import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buscarImagemUnsplash } from "@/lib/unsplash";

const FALLBACKS = [
  "law books shelf wood",
  "courthouse marble columns",
  "justice scales desk",
  "legal documents folder",
  "gavel wooden desk",
  "contract signing pen",
  "library books law",
];

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const query = req.nextUrl.searchParams.get("query") ?? "";
  const exclude = req.nextUrl.searchParams.get("exclude") ?? "";

  let url: string | null = null;

  if (query) {
    // tenta até 3 vezes com a query original para pegar uma imagem diferente
    for (let i = 0; i < 3; i++) {
      url = await buscarImagemUnsplash(query);
      if (url && url !== exclude) break;
    }
  }

  // fallback jurídico se a query não retornou nada ou era a mesma imagem
  if (!url || url === exclude) {
    const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    url = await buscarImagemUnsplash(fallback);
  }

  return NextResponse.json({ url });
}
