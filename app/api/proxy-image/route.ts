import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Não autenticado", { status: 401 });

  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("url obrigatório", { status: 400 });

  // permitir apenas URLs de domínios confiáveis
  const allowed = ["images.unsplash.com", "plus.unsplash.com", "source.unsplash.com", "images.pexels.com", "oaidalleapiprodscus.blob.core.windows.net"];
  const parsed = new URL(url);
  if (!allowed.some((d) => parsed.hostname.endsWith(d))) {
    return new NextResponse("Domínio não permitido", { status: 403 });
  }

  const res = await fetch(url, { headers: { "User-Agent": "JIADVOCA/1.0" } });
  if (!res.ok) return new NextResponse("Erro ao buscar imagem", { status: 502 });

  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") ?? "image/jpeg";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
