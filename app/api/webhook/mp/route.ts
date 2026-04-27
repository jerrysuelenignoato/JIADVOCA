import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { MercadoPagoConfig, Payment, PreApproval } from "mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";
import { PACKS_IA } from "@/lib/mercadopago";

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

// valida assinatura HMAC-SHA256 do Mercado Pago
function validarAssinatura(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  // se o secret não estiver configurado, aceitar em dev mas logar aviso
  if (!secret) {
    console.warn("[webhook/mp] MP_WEBHOOK_SECRET não configurado — validação desativada");
    return true;
  }

  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");
  const url = new URL(req.url);
  const dataId = url.searchParams.get("data.id") ?? "";

  if (!xSignature) return false;

  // formato: ts=<timestamp>,v1=<hash>
  const parts = Object.fromEntries(xSignature.split(",").map((p) => p.split("=")));
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${xRequestId ?? ""};ts:${ts};`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
}

async function ativarAssinatura(userId: string, plano: "mensal" | "mensal_plus" | "anual", mpPaymentId: string) {
  const supabase = createAdminClient();
  const meses = plano === "anual" ? 12 : 1;
  const fim = new Date();
  fim.setMonth(fim.getMonth() + meses);

  // desativar assinaturas anteriores do usuário
  await supabase
    .from("subscriptions")
    .update({ status: "cancelada" })
    .eq("user_id", userId)
    .neq("status", "cancelada");

  // criar nova assinatura ativa
  await supabase.from("subscriptions").insert({
    user_id: userId,
    plano,
    status: "ativa",
    fim: fim.toISOString(),
    mp_payment_id: mpPaymentId,
  });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    if (!validarAssinatura(req, rawBody)) {
      console.error("[webhook/mp] Assinatura inválida");
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
    }

    const body = JSON.parse(rawBody) as { type?: string; data?: { id?: string } };
    const { type, data } = body;

    if (!type || !data?.id) {
      return NextResponse.json({ received: true });
    }

    // ── pagamento único (plano anual) ──────────────────
    if (type === "payment") {
      const payment = new Payment(mpClient);
      const pagamento = await payment.get({ id: data.id });

      if (pagamento.status !== "approved") {
        return NextResponse.json({ received: true });
      }

      const extRef = pagamento.external_reference ?? "";
      const [userId, ref] = extRef.split("|");

      if (!userId) {
        console.warn("[webhook/mp] external_reference inválido:", extRef);
        return NextResponse.json({ received: true });
      }

      // créditos de IA
      if (ref && ref in PACKS_IA) {
        const pack = PACKS_IA[ref as keyof typeof PACKS_IA];
        const supabase = createAdminClient();
        const { data: atual } = await supabase
          .from("ia_credits")
          .select("saldo")
          .eq("user_id", userId)
          .single();

        if (atual) {
          await supabase
            .from("ia_credits")
            .update({ saldo: atual.saldo + pack.creditos, updated_at: new Date().toISOString() })
            .eq("user_id", userId);
        } else {
          await supabase
            .from("ia_credits")
            .insert({ user_id: userId, saldo: pack.creditos });
        }
        return NextResponse.json({ received: true });
      }

      // plano anual
      if (ref !== "anual") {
        console.warn("[webhook/mp] ref desconhecido:", extRef);
        return NextResponse.json({ received: true });
      }

      await ativarAssinatura(userId, "anual", String(pagamento.id));
    }

    // ── assinatura recorrente (plano mensal) ──────────
    if (type === "subscription_preapproval") {
      const preapproval = new PreApproval(mpClient);
      const assinatura = await preapproval.get({ id: data.id });

      if (assinatura.status !== "authorized") {
        return NextResponse.json({ received: true });
      }

      // external_reference foi passado na URL de checkout
      const extRef = assinatura.external_reference ?? "";
      const [userId, planoRef] = extRef.split("|");

      if (!userId) {
        console.warn("[webhook/mp] preapproval sem external_reference:", data.id);
        return NextResponse.json({ received: true });
      }

      const plano = planoRef === "mensal_plus" ? "mensal_plus" : "mensal";
      await ativarAssinatura(userId, plano, String(assinatura.id));
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook/mp]", err);
    // retornar 200 para o MP não retentar em erros de processamento
    return NextResponse.json({ received: true });
  }
}
