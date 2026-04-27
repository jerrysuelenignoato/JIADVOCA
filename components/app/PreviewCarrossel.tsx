"use client";

import { useState, useRef } from "react";
import { Copy, Check, ChevronLeft, ChevronRight, RefreshCw, Upload } from "lucide-react";
import { toast } from "sonner";

type Slide = {
  numero: number;
  tipo: string;
  titulo?: string;
  subtitulo?: string;
  corpo?: string;
  imagem_url?: string;
  imagem_query?: string;
  imagem_prompt?: string;
};

type Props = {
  conteudo: {
    headline?: string;
    tese?: string;
    slides?: Slide[];
    legenda?: string;
    hashtags?: string[];
    cta_sugerido?: string;
  };
};

const BG_GRADIENTS = [
  "linear-gradient(135deg, #0B3D6B 0%, #185FA5 100%)",
  "linear-gradient(150deg, #061828 0%, #0C447C 100%)",
  "linear-gradient(135deg, #093322 0%, #0F6E56 100%)",
  "linear-gradient(145deg, #0a0e1a 0%, #0C447C 100%)",
  "linear-gradient(135deg, #0C447C 0%, #093322 100%)",
  "linear-gradient(150deg, #120a28 0%, #0C447C 100%)",
  "linear-gradient(135deg, #061828 0%, #0F6E56 100%)",
];

const ACCENT_COLORS = ["#0F6E56", "#185FA5", "#D97706", "#0F6E56", "#185FA5", "#0F6E56", "#D97706"];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copiado!");
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
      aria-label="Copiar"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-[#0F6E56]" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function PreviewCarrossel({ conteudo }: Props) {
  const [slides, setSlides] = useState<Slide[]>(conteudo.slides ?? []);
  const [idx, setIdx] = useState(0);
  const [trocando, setTrocando] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  const slide = slides[idx];
  const bgIdx = (slide?.numero ?? 1) - 1;
  const bg = BG_GRADIENTS[bgIdx % BG_GRADIENTS.length];
  const accent = ACCENT_COLORS[bgIdx % ACCENT_COLORS.length];

  async function trocarImagem() {
    setTrocando(true);
    try {
      const query = slide?.imagem_query ?? slide?.imagem_prompt ?? "";
      const exclude = slide?.imagem_url ?? "";
      const params = new URLSearchParams({ query, exclude });
      const res = await fetch(`/api/unsplash?${params}`);
      const data = await res.json();
      if (data.url) {
        setSlides((prev) =>
          prev.map((s, i) => (i === idx ? { ...s, imagem_url: data.url } : s))
        );
      } else {
        toast.error("Não foi possível encontrar outra imagem");
      }
    } catch {
      toast.error("Erro ao buscar imagem");
    } finally {
      setTrocando(false);
    }
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSlides((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, imagem_url: url } : s))
    );
    e.target.value = "";
  }

  return (
    <div className="space-y-4">
      {/* headline */}
      {conteudo.headline && (
        <div className="flex items-start justify-between gap-2 p-3 bg-[#0C447C]/5 rounded-lg border border-[#0C447C]/10">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Headline</p>
            <p className="font-semibold text-[#0C447C] leading-snug">{conteudo.headline}</p>
          </div>
          <CopyBtn text={conteudo.headline} />
        </div>
      )}

      {/* slide */}
      {slides.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="relative pr-12">
            {/* hidden file input */}
            <input
              ref={uploadRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
            {/* slide visual */}
            <div
              className="relative w-full overflow-hidden flex flex-col"
              style={{ aspectRatio: "1 / 1", maxHeight: "320px" }}
              style={{
                background: bg,
                ...(slide?.imagem_url && {
                  backgroundImage: `url(${slide.imagem_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }),
              }}
            >
              {/* overlay */}
              <div className="absolute inset-0" style={{
                background: slide?.imagem_url
                  ? "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.22) 35%, rgba(0,0,0,0.80) 65%, rgba(0,0,0,0.92) 100%)"
                  : "linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 100%)",
              }} />

              {/* círculos decorativos */}
              {!slide?.imagem_url && <>
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
                  style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full"
                  style={{ background: "rgba(255,255,255,0.03)" }} />
              </>}

              {/* conteúdo */}
              <div className="relative z-10 flex flex-col h-full p-8">
                <div className="flex items-center justify-between mb-auto">
                  <span className="text-white/40 text-[9px] tracking-[0.3em] uppercase font-medium">
                    {slide?.tipo}
                  </span>
                  <span className="text-white/25 text-[9px] tracking-[0.2em] uppercase">
                    JIADVOCA
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-center py-4">
                  <div className="w-10 h-[3px] rounded-full mb-5" style={{ background: accent }} />
                  {slide?.titulo && (
                    <p
                      className="text-white font-serif font-semibold leading-[1.08] tracking-tight"
                      style={{ fontSize: "clamp(1.9rem, 6.5vw, 3.2rem)" }}
                    >
                      {slide.titulo}
                    </p>
                  )}
                  {(slide?.subtitulo || slide?.corpo) && (
                    <p
                      className="text-white/70 mt-5 leading-relaxed font-light"
                      style={{ fontSize: "clamp(0.82rem, 2.2vw, 1rem)" }}
                    >
                      {slide.subtitulo ?? slide.corpo}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="w-8 h-[1.5px] rounded-full" style={{ background: accent }} />
                  <span className="text-white/20 text-[9px] font-light">
                    {slide?.numero} / {slides.length}
                  </span>
                </div>
              </div>
            </div>

            {/* botões à direita do slide */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 w-10 items-center">
              <button
                onClick={trocarImagem}
                disabled={trocando}
                title="Trocar imagem de fundo"
                className="w-9 h-9 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 text-muted-foreground ${trocando ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => uploadRef.current?.click()}
                title="Enviar imagem própria"
                className="w-9 h-9 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Upload className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* navegação */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-white">
            <button
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              disabled={idx === 0}
              className="p-1 rounded hover:bg-secondary disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground">{idx + 1} / {slides.length}</span>
            <button
              onClick={() => setIdx((i) => Math.min(slides.length - 1, i + 1))}
              disabled={idx === slides.length - 1}
              className="p-1 rounded hover:bg-secondary disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* legenda */}
      {conteudo.legenda && (
        <div className="border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Legenda</p>
            <CopyBtn text={conteudo.legenda + "\n\n" + (conteudo.hashtags?.join(" ") ?? "")} />
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{conteudo.legenda}</p>
          {conteudo.hashtags && (
            <p className="mt-2 text-sm text-[#185FA5] flex flex-wrap gap-1">
              {conteudo.hashtags.map((h) => <span key={h}>{h}</span>)}
            </p>
          )}
        </div>
      )}

      {/* cta */}
      {conteudo.cta_sugerido && (
        <div className="flex items-start justify-between gap-2 p-3 bg-[#0F6E56]/5 rounded-lg border border-[#0F6E56]/15">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">CTA sugerido</p>
            <p className="text-sm font-medium text-[#0F6E56]">{conteudo.cta_sugerido}</p>
          </div>
          <CopyBtn text={conteudo.cta_sugerido} />
        </div>
      )}
    </div>
  );
}
