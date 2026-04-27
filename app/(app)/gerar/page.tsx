"use client";

import { useState, useEffect } from "react";
import { Wand2, Loader2, ArrowRight, ChevronLeft, RefreshCw, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PreviewCarrossel from "@/components/app/PreviewCarrossel";
import PreviewReel from "@/components/app/PreviewReel";
import UpgradeModal from "@/components/app/UpgradeModal";
import { useGerar } from "@/hooks/useGerar";
import { SUGESTOES_POOL, TONS_CONTEUDO } from "@/lib/utils";

type Narrativa = { titulo: string; descricao: string };
type Etapa = "tema" | "narrativa" | "resultado";

export default function GerarPage() {
  const { gerar, loading, resultado, setResultado, loadingMsg, upgradeMotivo, fecharUpgrade } = useGerar();

  const [etapa, setEtapa] = useState<Etapa>("tema");
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [tema, setTema] = useState("");
  const [narrativas, setNarrativas] = useState<Narrativa[]>([]);
  const [narrativaIdx, setNarrativaIdx] = useState<number | null>(null);
  const [loadingNarrativas, setLoadingNarrativas] = useState(false);
  const [tipo, setTipo] = useState<"carrossel" | "reel">("reel");
  const [comImagem, setComImagem] = useState(false);
  const [tom, setTom] = useState("");

  useEffect(() => {
    if (resultado) setEtapa("resultado");
  }, [resultado]);

  useEffect(() => {
    const shuffled = [...SUGESTOES_POOL].sort(() => Math.random() - 0.5);
    setSugestoes(shuffled.slice(0, 8));
  }, []);


  async function buscarAngulos(temaOverride?: string) {
    const t = (temaOverride ?? tema).trim();
    if (!t) return;
    setLoadingNarrativas(true);
    setNarrativas([]);
    setNarrativaIdx(null);
    setResultado(null);
    setEtapa("narrativa");
    try {
      const res = await fetch("/api/narratives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema: t }),
      });
      const data = await res.json();
      setNarrativas(data.narrativas ?? []);
    } catch {
      setEtapa("tema");
    } finally {
      setLoadingNarrativas(false);
    }
  }

  function handleGerar() {
    if (narrativaIdx === null || !tom) return;
    const narrativa = narrativas[narrativaIdx];
    gerar({
      tipo,
      area: tema,
      tom,
      slides: tipo === "carrossel" ? 7 : undefined,
      duracao: tipo === "reel" ? 60 : undefined,
      extra: `Ângulo narrativo escolhido: "${narrativa.titulo}". ${narrativa.descricao}`,
      comImagem,
    });
  }

  function voltarParaNarrativa() {
    setResultado(null);
    setEtapa("narrativa");
  }

  function voltarParaTema() {
    setEtapa("tema");
    setNarrativas([]);
    setNarrativaIdx(null);
    setResultado(null);
  }

  return (
    <div className="min-h-full bg-[#FAFAF9]">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* ── Etapa 1: Tema ── */}
        {etapa === "tema" && (
          <div className="space-y-8">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-semibold text-[#1C1917]">O que você quer criar hoje?</h1>
              <p className="text-sm text-muted-foreground">Digite um tema ou escolha uma sugestão</p>
            </div>

            <div className="relative">
              <input
                autoFocus
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscarAngulos()}
                placeholder="Ex: Aposentadoria por invalidez, BPC para idosos..."
                className="w-full h-14 px-5 pr-14 rounded-2xl border border-border bg-white text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C447C]/30"
              />
              <button
                onClick={() => buscarAngulos()}
                disabled={!tema.trim()}
                className="absolute right-3 top-3 h-8 w-8 rounded-xl bg-[#0C447C] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#185FA5] transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Sugestões</p>
                <button
                  onClick={() => {
                    const shuffled = [...SUGESTOES_POOL].sort(() => Math.random() - 0.5);
                    setSugestoes(shuffled.slice(0, 8));
                  }}
                  className="text-xs text-[#0C447C] hover:underline"
                >
                  Outras sugestões
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sugestoes.map((area) => (
                  <button
                    key={area}
                    onClick={() => { setTema(area); buscarAngulos(area); }}
                    className="px-4 py-2 rounded-full border border-border bg-white text-sm hover:border-[#0C447C] hover:text-[#0C447C] transition-colors"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Etapa 2: Narrativa ── */}
        {etapa === "narrativa" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={voltarParaTema} className="text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{tema}</p>
                <h1 className="text-xl font-semibold text-[#1C1917]">1. Escolha o ângulo</h1>
              </div>
            </div>

            {loadingNarrativas ? (
              <div className="space-y-3">
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
              </div>
            ) : (
              <div className="space-y-3">
                {narrativas.map((n, i) => (
                  <button
                    key={i}
                    onClick={() => setNarrativaIdx(narrativaIdx === i ? null : i)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                      narrativaIdx === i
                        ? "border-[#0C447C] bg-[#0C447C]/5"
                        : "border-border bg-white hover:border-[#0C447C]/30"
                    }`}
                  >
                    <p className={`font-semibold text-base leading-snug ${narrativaIdx === i ? "text-[#0C447C]" : "text-[#1C1917]"}`}>
                      {n.titulo}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{n.descricao}</p>
                  </button>
                ))}
              </div>
            )}

            {narrativaIdx !== null && !loadingNarrativas && (
              <div className="bg-white border border-border rounded-2xl p-5 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">2. O que gerar</p>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Só Roteiro */}
                    <button
                      onClick={() => { setTipo("reel"); setComImagem(false); }}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        tipo === "reel"
                          ? "border-[#0C447C] bg-[#0C447C]/5"
                          : "border-border hover:border-[#0C447C]/30"
                      }`}
                    >
                      <span className="text-xl">📝</span>
                      <p className={`text-xs font-semibold mt-1.5 ${tipo === "reel" ? "text-[#0C447C]" : ""}`}>
                        Só roteiro
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                        Script completo para gravar
                      </p>
                    </button>

                    {/* Carrossel sem imagem */}
                    <button
                      onClick={() => { setTipo("carrossel"); setComImagem(false); }}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        tipo === "carrossel" && !comImagem
                          ? "border-[#0C447C] bg-[#0C447C]/5"
                          : "border-border hover:border-[#0C447C]/30"
                      }`}
                    >
                      <span className="text-xl">🖼</span>
                      <p className={`text-xs font-semibold mt-1.5 ${tipo === "carrossel" && !comImagem ? "text-[#0C447C]" : ""}`}>
                        Carrossel
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                        Slides prontos sem foto
                      </p>
                    </button>

                    {/* Carrossel com imagem */}
                    <button
                      onClick={() => { setTipo("carrossel"); setComImagem(true); }}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        tipo === "carrossel" && comImagem
                          ? "border-[#0F6E56] bg-[#0F6E56]/5"
                          : "border-border hover:border-[#0F6E56]/30"
                      }`}
                    >
                      <span className="text-xl">📸</span>
                      <p className={`text-xs font-semibold mt-1.5 ${tipo === "carrossel" && comImagem ? "text-[#0F6E56]" : ""}`}>
                        Com imagem
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                        Slides com foto real
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">3. Tom</p>
                  <div className="grid grid-cols-2 gap-2">
                    {TONS_CONTEUDO.map(({ valor, label, desc }) => (
                      <button
                        key={valor}
                        onClick={() => setTom(valor)}
                        className={`text-left p-3 rounded-xl border transition-colors ${
                          tom === valor
                            ? "border-[#0C447C] bg-[#0C447C]/5 text-[#0C447C]"
                            : "border-border hover:bg-secondary"
                        }`}
                      >
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGerar}
                  disabled={!tom || loading}
                  className="w-full h-12 rounded-xl bg-[#0C447C] hover:bg-[#185FA5] text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm">{loadingMsg}</span></>
                  ) : (
                    <><Wand2 className="h-4 w-4" /> Gerar com IA</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Etapa 3: Resultado ── */}
        {etapa === "resultado" && resultado && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={voltarParaNarrativa}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Escolher outro ângulo
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleGerar}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Gerar variação
                </button>
                <a href="/biblioteca" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-secondary transition-colors">
                  <BookOpen className="h-3.5 w-3.5" /> Biblioteca
                </a>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-[#0C447C] animate-spin" />
                  <p className="text-sm font-medium text-[#0C447C] animate-pulse">{loadingMsg}</p>
                </div>
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
              </div>
            ) : tipo === "carrossel" ? (
              <PreviewCarrossel conteudo={resultado.conteudo as Parameters<typeof PreviewCarrossel>[0]["conteudo"]} />
            ) : (
              <PreviewReel conteudo={resultado.conteudo as Parameters<typeof PreviewReel>[0]["conteudo"]} />
            )}
          </div>
        )}

      </div>

      <UpgradeModal
        aberto={upgradeMotivo !== null}
        onFechar={fecharUpgrade}
        motivo={upgradeMotivo ?? "cota"}
      />
    </div>
  );
}
