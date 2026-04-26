"use client";

import { useState } from "react";
import { Wand2, Loader2, RefreshCw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PreviewCarrossel from "@/components/app/PreviewCarrossel";
import PreviewReel from "@/components/app/PreviewReel";
import UpgradeModal from "@/components/app/UpgradeModal";
import { useGerar } from "@/hooks/useGerar";
import { AREAS_PREVIDENCIARIAS, TONS_CONTEUDO } from "@/lib/utils";

const DURACOES = [15, 30, 60, 90];

export default function GerarPage() {
  const { gerar, loading, resultado, setResultado, loadingMsg, upgradeMotivo, fecharUpgrade } = useGerar();

  const [tipo, setTipo] = useState<"carrossel" | "reel">("carrossel");
  const [area, setArea] = useState("");
  const [tom, setTom] = useState("");
  const [slides, setSlides] = useState(7);
  const [duracao, setDuracao] = useState(60);
  const [extra, setExtra] = useState("");

  function handleGerar() {
    if (!area || !tom) return;
    gerar({ tipo, area, tom, slides: tipo === "carrossel" ? slides : undefined, duracao: tipo === "reel" ? duracao : undefined, extra: extra || undefined });
  }

  const pronto = area && tom;

  return (
    <div className="flex flex-col lg:flex-row min-h-full">
      {/* ── coluna esquerda: configuração (40%) ─────────── */}
      <aside className="w-full lg:w-[40%] lg:max-w-sm xl:max-w-md border-r border-border bg-white p-6 space-y-6 shrink-0">
        <div>
          <h1 className="text-xl font-semibold">Gerar conteúdo</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configure e clique em gerar</p>
        </div>

        {/* toggle tipo */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">Formato</Label>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["carrossel", "reel"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTipo(t); setResultado(null); }}
                className={`flex-1 py-2 text-sm font-medium transition-colors capitalize ${tipo === t ? "bg-[#0C447C] text-white" : "hover:bg-secondary text-muted-foreground"}`}
              >
                {t === "carrossel" ? "🖼 Carrossel" : "🎬 Reel"}
              </button>
            ))}
          </div>
        </div>

        {/* área */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">Área previdenciária</Label>
          <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
            {AREAS_PREVIDENCIARIAS.map((a) => (
              <button
                key={a}
                onClick={() => setArea(a)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${area === a ? "bg-[#0C447C] text-white" : "hover:bg-secondary text-foreground border border-border"}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* tom */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">Tom do conteúdo</Label>
          <div className="grid grid-cols-2 gap-2">
            {TONS_CONTEUDO.map(({ valor, label, desc }) => (
              <button
                key={valor}
                onClick={() => setTom(valor)}
                className={`text-left p-3 rounded-lg border transition-colors ${tom === valor ? "border-[#0C447C] bg-[#0C447C]/5" : "border-border hover:bg-secondary"}`}
              >
                <p className={`text-sm font-medium ${tom === valor ? "text-[#0C447C]" : ""}`}>{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* slides ou duração */}
        {tipo === "carrossel" ? (
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
              Número de slides: <span className="font-semibold text-foreground">{slides}</span>
            </Label>
            <input
              type="range"
              min={3}
              max={10}
              step={1}
              value={slides}
              onChange={(e) => setSlides(Number(e.target.value))}
              className="mt-2 w-full accent-[#0C447C]"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>3</span><span>10</span>
            </div>
          </div>
        ) : (
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">Duração do reel</Label>
            <div className="flex gap-2">
              {DURACOES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuracao(d)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${duracao === d ? "border-[#0C447C] bg-[#0C447C]/5 text-[#0C447C]" : "border-border hover:bg-secondary"}`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>
        )}

        {/* extra */}
        <div>
          <Label htmlFor="extra" className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
            Personalização <span className="normal-case font-normal">(opcional)</span>
          </Label>
          <Textarea
            id="extra"
            placeholder="Ex: Foque em aposentadoria rural para trabalhadores de MG. Mencione a Lei 8.213/91."
            rows={3}
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            className="text-sm resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right mt-1">{extra.length}/500</p>
        </div>

        {/* botão gerar */}
        <Button
          onClick={handleGerar}
          disabled={!pronto || loading}
          className="w-full bg-[#0C447C] hover:bg-[#185FA5] text-white h-11"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Gerando...</>
          ) : (
            <><Wand2 className="h-4 w-4 mr-2" /> Gerar com IA</>
          )}
        </Button>

        {!pronto && (
          <p className="text-xs text-center text-muted-foreground -mt-2">
            Selecione uma área e um tom para continuar
          </p>
        )}
      </aside>

      {/* ── coluna direita: preview (60%) ───────────────── */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* estado vazio */}
        {!loading && !resultado && (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[#0C447C]/10 flex items-center justify-center mb-4">
              <Wand2 className="h-7 w-7 text-[#0C447C]" />
            </div>
            <h2 className="text-lg font-semibold">Nenhum conteúdo gerado ainda</h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-xs">
              Configure o formato, área e tom à esquerda e clique em <strong>Gerar com IA</strong>
            </p>
          </div>
        )}

        {/* estado loading */}
        {loading && (
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="h-5 w-5 text-[#0C447C] animate-spin" />
              <p className="text-sm font-medium text-[#0C447C] animate-pulse">{loadingMsg}</p>
            </div>
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        )}

        {/* resultado */}
        {!loading && resultado && (
          <div className="max-w-xl">
            {/* ações */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-[#0F6E56]/10 text-[#0F6E56] border-[#0F6E56]/20 hover:bg-[#0F6E56]/10">
                  Salvo na biblioteca
                </Badge>
                {resultado.cotaRestante !== undefined && (
                  <Badge variant="outline" className="text-muted-foreground">
                    {resultado.cotaRestante} gerações restantes
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleGerar} className="gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" /> Gerar variação
                </Button>
                <a href="/biblioteca" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm font-medium hover:bg-secondary transition-colors">
                  <BookOpen className="h-3.5 w-3.5" /> Biblioteca
                </a>
              </div>
            </div>

            {tipo === "carrossel" ? (
              <PreviewCarrossel conteudo={resultado.conteudo as Parameters<typeof PreviewCarrossel>[0]["conteudo"]} />
            ) : (
              <PreviewReel conteudo={resultado.conteudo as Parameters<typeof PreviewReel>[0]["conteudo"]} />
            )}
          </div>
        )}
      </main>

      <UpgradeModal
        aberto={upgradeMotivo !== null}
        onFechar={fecharUpgrade}
        motivo={upgradeMotivo ?? "cota"}
      />
    </div>
  );
}
