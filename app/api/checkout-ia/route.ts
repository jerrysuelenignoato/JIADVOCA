import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { criarPreferenciaCreditos, PACKS_IA } from "@/lib/mercadopago";

const bodySchema = z.object({
  pack: z.enum(["pack10", "pack30", "pack100"]),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Pack inválido" }, { status: 400 });

    const preferencia = await criarPreferenciaCreditos(parsed.data.pack, user.id);
    return NextResponse.json({ init_point: preferencia.init_point });
  } catch (err) {
    console.error("[/api/checkout-ia]", err);
    return NextResponse.json({ error: "Erro ao criar checkout" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ saldo: 0 });

  const { data } = await supabase
    .from("ia_credits")
    .select("saldo")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({ saldo: data?.saldo ?? 0, packs: PACKS_IA });
}
