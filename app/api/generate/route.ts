import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { gerarConteudo } from "@/lib/groq";
import { SYSTEM_PROMPT } from "@/lib/prompts/system";
import { buildCarrosselPrompt } from "@/lib/prompts/carrossel";
import { buildReelPrompt } from "@/lib/prompts/reel";
import { getMesAtual } from "@/lib/utils";
const VARIANTES = [
  "Aborde pelo ângulo de quem quase perdeu o benefício por desconhecer o prazo.",
  "Foque nos erros burocráticos mais comuns que levam ao indeferimento.",
  "Desmonte mitos populares com artigos e dados reais do INSS.",
  "Apresente como um guia prático com passos numerados e objetivos.",
  "Destaque as diferenças sutis que confundem quem tenta solicitar o benefício.",
  "Explore as consequências financeiras de atrasar ou errar o pedido.",
  "Aborde pelo ponto de vista de quem está a 2 anos de se aposentar.",
  "Explique os documentos necessários e como organizar cada um.",
  "Foque nos casos em que o INSS nega indevidamente e como recorrer.",
  "Aborde as mudanças pós-Reforma da Previdência e o que mudou na prática.",
];

const LIMITES = { trial: 5, mensal: 60, anual: 9999 };

const bodySchema = z.object({
  tipo: z.enum(["carrossel", "reel"]),
  area: z.string().min(3),
  tom: z.string().min(3),
  slides: z.number().int().min(3).max(10).optional(),
  duracao: z.number().int().optional(),
  extra: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    const { tipo, area, tom, slides, duracao, extra } = parsed.data;

    // verificar assinatura ativa
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plano, status, fim")
      .eq("user_id", user.id)
      .eq("status", "ativa")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!sub) {
      return NextResponse.json({ error: "Sem assinatura ativa", code: "NO_SUB" }, { status: 403 });
    }
    if (sub.fim && new Date(sub.fim) < new Date()) {
      await supabase
        .from("subscriptions")
        .update({ status: "expirada" })
        .eq("user_id", user.id);
      return NextResponse.json({ error: "Trial expirado", code: "EXPIRED" }, { status: 403 });
    }

    // verificar cota do mês
    const mes = getMesAtual();
    const limite = LIMITES[sub.plano as keyof typeof LIMITES] ?? 5;
    const campo = tipo === "carrossel" ? "carrosseis_gerados" : "reels_gerados";

    const { data: usage } = await supabase
      .from("usage")
      .select("carrosseis_gerados, reels_gerados")
      .eq("user_id", user.id)
      .eq("mes", mes)
      .single();

    const totalGerado = (usage?.carrosseis_gerados ?? 0) + (usage?.reels_gerados ?? 0);
    if (totalGerado >= limite) {
      return NextResponse.json({ error: "Cota do mês esgotada", code: "QUOTA_EXCEEDED" }, { status: 429 });
    }

    // variante aleatória garante conteúdo único por geração
    const variante = VARIANTES[Math.floor(Math.random() * VARIANTES.length)];

    const userPrompt =
      tipo === "carrossel"
        ? buildCarrosselPrompt(area, tom, slides ?? 7, extra) + `\n\nAbordagem exclusiva para esta geração: ${variante}`
        : buildReelPrompt(area, tom, duracao ?? 60, extra) + `\n\nAbordagem exclusiva para esta geração: ${variante}`;

    const conteudo = await gerarConteudo(SYSTEM_PROMPT, userPrompt);

    // salvar na biblioteca
    const { data: saved } = await supabase
      .from("contents")
      .insert({
        user_id: user.id,
        tipo,
        area,
        tom,
        headline: (conteudo.headline as string) ?? null,
        tese: (conteudo.tese as string) ?? null,
        conteudo,
        legenda: (conteudo.legenda as string) ?? null,
        hashtags: (conteudo.hashtags as string[]) ?? [],
        status: "ideia",
      })
      .select()
      .single();

    // incrementar usage
    if (usage) {
      await supabase
        .from("usage")
        .update({ [campo]: (usage[campo as keyof typeof usage] as number) + 1 })
        .eq("user_id", user.id)
        .eq("mes", mes);
    } else {
      await supabase
        .from("usage")
        .insert({ user_id: user.id, mes, [campo]: 1 });
    }

    return NextResponse.json({ conteudo, id: saved?.id, cotaRestante: limite - totalGerado - 1 });
  } catch (err) {
    console.error("[/api/generate]", err);
    return NextResponse.json({ error: "Erro interno ao gerar conteúdo" }, { status: 500 });
  }
}
