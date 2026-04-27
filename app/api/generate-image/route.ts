import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gerarImagemIA } from "@/lib/openai-images";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  // apenas planos que incluem carrossel com imagem
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plano")
    .eq("user_id", user.id)
    .eq("status", "ativa")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!sub || sub.plano === "mensal") {
    return NextResponse.json({ error: "Requer plano Plus ou Anual", code: "PLAN_UPGRADE_NEEDED" }, { status: 403 });
  }

  const { titulo, tema } = await req.json();
  if (!titulo && !tema) {
    return NextResponse.json({ error: "titulo ou tema obrigatório" }, { status: 400 });
  }

  const url = await gerarImagemIA(titulo ?? "", tema ?? "");
  if (!url) return NextResponse.json({ error: "Falha ao gerar imagem" }, { status: 500 });

  return NextResponse.json({ url });
}
