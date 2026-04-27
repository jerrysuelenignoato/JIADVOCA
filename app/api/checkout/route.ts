import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { criarPreferencia } from "@/lib/mercadopago";

const bodySchema = z.object({
  plano: z.enum(["mensal", "mensal_plus", "anual"]),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const { plano } = parsed.data;

    // planos de assinatura recorrente via preapproval
    if (plano === "mensal" || plano === "mensal_plus") {
      const envKey = plano === "mensal" ? "MP_PREAPPROVAL_MENSAL" : "MP_PREAPPROVAL_MENSAL_PLUS";
      const planId = process.env[envKey];
      if (!planId) {
        return NextResponse.json({ error: "Plano não configurado" }, { status: 500 });
      }
      const checkoutUrl = `https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=${planId}&external_reference=${user.id}|${plano}`;
      return NextResponse.json({ init_point: checkoutUrl });
    }

    // plano anual usa Preference (pagamento único)
    const preferencia = await criarPreferencia("anual", user.id);
    return NextResponse.json({ init_point: preferencia.init_point });
  } catch (err) {
    console.error("[/api/checkout]", err);
    return NextResponse.json({ error: "Erro ao criar checkout" }, { status: 500 });
  }
}
