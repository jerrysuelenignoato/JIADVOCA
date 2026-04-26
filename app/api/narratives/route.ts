import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gerarConteudo } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const { tema } = await req.json();
    if (!tema || typeof tema !== "string" || tema.trim().length < 3) {
      return NextResponse.json({ error: "Tema inválido" }, { status: 400 });
    }

    const result = await gerarConteudo(
      "Você é um especialista em marketing jurídico digital e criação de conteúdo para Instagram focado em direito previdenciário brasileiro.",
      `Para um advogado previdenciarista que quer criar conteúdo para Instagram sobre "${tema.trim()}", gere 3 ângulos narrativos diferentes e criativos.

Cada ângulo deve ter um título impactante (que pare o scroll no Instagram) e uma descrição curta do approach.

Retorne SOMENTE JSON válido (sem markdown, sem \`\`\`):
{
  "narrativas": [
    {"titulo": "título impactante max 8 palavras", "descricao": "descrição do ângulo em 1-2 frases diretas"},
    {"titulo": "...", "descricao": "..."},
    {"titulo": "...", "descricao": "..."}
  ]
}`
    );

    return NextResponse.json({ narrativas: result.narrativas ?? [] });
  } catch (err) {
    console.error("[/api/narratives]", err);
    return NextResponse.json({ error: "Erro ao gerar ângulos" }, { status: 500 });
  }
}
