"use client";

import { useState } from "react";
import { Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type Slide = {
  numero: number;
  tipo: string;
  titulo?: string;
  subtitulo?: string;
  corpo?: string;
  visual?: string;
  imagem_url?: string;
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
  const slides = conteudo.slides ?? [];
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];

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

      {/* slides navegáveis */}
      {slides.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden">
          {/* preview do slide — formato 1:1 Instagram */}
          <div
            className="relative w-full aspect-square overflow-hidden flex flex-col justify-between"
            style={{
              backgroundColor: "#0C447C",
              ...(slide?.imagem_url && {
                backgroundImage: `url(${slide.imagem_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }),
            }}
          >
            {/* gradiente escuro só na base — deixa a foto respirar */}
            <div
              className="absolute inset-0"
              style={{
                background: slide?.imagem_url
                  ? "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.78) 100%)"
                  : "linear-gradient(to bottom, rgba(12,68,124,0.4) 0%, rgba(12,68,124,0.95) 100%)",
              }}
            />

            {/* badge topo */}
            <div className="relative z-10 p-5">
              <Badge variant="secondary" className="w-fit text-xs bg-black/30 text-white border-0 backdrop-blur-sm">
                Slide {slide?.numero} — {slide?.tipo}
              </Badge>
            </div>

            {/* texto base */}
            <div className="relative z-10 p-7 pb-8 space-y-3">
              {slide?.titulo && (
                <p className="text-white font-serif text-[2.1rem] leading-[1.15] drop-shadow-lg tracking-tight">
                  {slide.titulo}
                </p>
              )}
              {slide?.subtitulo && (
                <p className="text-white/85 text-[0.95rem] font-light leading-relaxed tracking-wide drop-shadow">
                  {slide.subtitulo}
                </p>
              )}
              {slide?.corpo && (
                <p className="text-white/85 text-[0.95rem] font-light leading-relaxed tracking-wide drop-shadow">
                  {slide.corpo}
                </p>
              )}
              {/* linha de marca */}
              <div className="pt-1">
                <span className="text-white/50 text-[0.7rem] tracking-[0.2em] uppercase font-medium">JIADVOCA</span>
              </div>
            </div>
          </div>

          {/* controles */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
            <button
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              disabled={idx === 0}
              className="p-1 rounded hover:bg-secondary disabled:opacity-30 transition-colors"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground">
              {idx + 1} / {slides.length}
            </span>
            <button
              onClick={() => setIdx((i) => Math.min(slides.length - 1, i + 1))}
              disabled={idx === slides.length - 1}
              className="p-1 rounded hover:bg-secondary disabled:opacity-30 transition-colors"
              aria-label="Próximo slide"
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
              {conteudo.hashtags.map((h) => (
                <span key={h}>{h}</span>
              ))}
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
