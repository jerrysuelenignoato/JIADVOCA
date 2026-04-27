import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gerarImagemIA } from "@/lib/openai-images";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  // verificar e debitar crédito
  const { data: credRow } = await supabase
    .from("ia_credits")
    .select("saldo")
    .eq("user_id", user.id)
    .single();

  const saldo = credRow?.saldo ?? 0;
  if (saldo <= 0) {
    return NextResponse.json({ error: "Sem créditos de IA", code: "NO_IA_CREDITS" }, { status: 402 });
  }

  // debitar antes de gerar (evita uso duplo em falhas de rede)
  await supabase
    .from("ia_credits")
    .update({ saldo: saldo - 1, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  const { titulo, tema } = await req.json();
  const url = await gerarImagemIA(titulo ?? "", tema ?? "");

  if (!url) {
    // estornar crédito se a geração falhou
    await supabase
      .from("ia_credits")
      .update({ saldo, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    return NextResponse.json({ error: "Falha ao gerar imagem" }, { status: 500 });
  }

  return NextResponse.json({ url, saldoRestante: saldo - 1 });
}
