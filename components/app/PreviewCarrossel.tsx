"use client";

import { useState, useRef } from "react";
import { Copy, Check, ChevronLeft, ChevronRight, RefreshCw, Upload, SlidersHorizontal, X, Download, Sparkles, Type, Pencil } from "lucide-react";
import { toast } from "sonner";
import IAImageModal from "@/components/app/IAImageModal";

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

type ImageAdjust = { x: number; y: number; scale: number };
type TextStyle = { fontFamily: string; titleSize: number; bodySize: number };

type Props = {
  conteudo: {
    headline?: string;
    tese?: string;
    slides?: Slide[];
    legenda?: string;
    hashtags?: string[];
    cta_sugerido?: string;
  };
  area?: string;
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
const DEFAULT_ADJUST: ImageAdjust = { x: 50, y: 50, scale: 110 };
const DEFAULT_TEXT_STYLE: TextStyle = { fontFamily: "Georgia, serif", titleSize: 74, bodySize: 34 };

const FONT_OPTIONS = [
  { label: "Georgia (Serif)", value: "Georgia, serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica Neue", value: "'Helvetica Neue', Helvetica, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Courier New (Mono)", value: "'Courier New', Courier, monospace" },
];

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

export default function PreviewCarrossel({ conteudo, area }: Props) {
  const [slides, setSlides] = useState<Slide[]>(conteudo.slides ?? []);
  const [idx, setIdx] = useState(0);
  const [trocando, setTrocando] = useState(false);
  const [adjustments, setAdjustments] = useState<Record<number, ImageAdjust>>({});
  const [adjusting, setAdjusting] = useState(false);
  const [editingText, setEditingText] = useState(false);
  const [editingField, setEditingField] = useState<"titulo" | "subtitulo" | "corpo" | null>(null);
  const [textStyle, setTextStyle] = useState<TextStyle>(DEFAULT_TEXT_STYLE);
  const [baixando, setBaixando] = useState(false);
  const [gerandoIA, setGerandoIA] = useState(false);
  const [iaModalAberto, setIAModalAberto] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  const slide = slides[idx];
  const bgIdx = (slide?.numero ?? 1) - 1;
  const bg = BG_GRADIENTS[bgIdx % BG_GRADIENTS.length];
  const accent = ACCENT_COLORS[bgIdx % ACCENT_COLORS.length];
  const adj = adjustments[idx] ?? DEFAULT_ADJUST;

  function editSlideField(field: "titulo" | "subtitulo" | "corpo", value: string) {
    setSlides((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  }

  async function trocarImagem() {
    setTrocando(true);
    setAdjusting(false);
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
        setAdjustments((prev) => ({ ...prev, [idx]: DEFAULT_ADJUST }));
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
    setAdjustments((prev) => ({ ...prev, [idx]: DEFAULT_ADJUST }));
    setAdjusting(true);
    e.target.value = "";
  }

  function setAdj(field: keyof ImageAdjust, value: number) {
    setAdjustments((prev) => ({
      ...prev,
      [idx]: { ...(prev[idx] ?? DEFAULT_ADJUST), [field]: value },
    }));
  }

  async function gerarComIA() {
    setGerandoIA(true);
    setAdjusting(false);
    setIAModalAberto(false);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: slide?.titulo ?? "", tema: area ?? "" }),
      });
      const data = await res.json();
      if (data.url) {
        setSlides((prev) =>
          prev.map((s, i) => (i === idx ? { ...s, imagem_url: data.url } : s))
        );
        setAdjustments((prev) => ({ ...prev, [idx]: DEFAULT_ADJUST }));
        toast.success("Imagem gerada com IA!");
      } else if (data.code === "NO_IA_CREDITS") {
        setIAModalAberto(true);
      } else {
        toast.error("Erro ao gerar imagem com IA");
      }
    } catch {
      toast.error("Erro ao gerar imagem com IA");
    } finally {
      setGerandoIA(false);
    }
  }

  async function baixarSlide() {
    setBaixando(true);
    try {
      const SIZE = 1080;
      const PAD = 88;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d")!;

      // ── fundo ──────────────────────────────────────────
      if (slide?.imagem_url) {
        const src = slide.imagem_url.startsWith("blob:")
          ? slide.imagem_url
          : `/api/proxy-image?url=${encodeURIComponent(slide.imagem_url)}`;
        const img = await carregarImg(src);

        const scale = adj.scale / 100;
        const drawW = SIZE * scale;
        const drawH = (drawW / img.width) * img.height;
        const drawX = (SIZE - drawW) * (adj.x / 100);
        const drawY = (SIZE - drawH) * (adj.y / 100);
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        const ov = ctx.createLinearGradient(0, 0, 0, SIZE);
        ov.addColorStop(0,    "rgba(0,0,0,0.12)");
        ov.addColorStop(0.35, "rgba(0,0,0,0.22)");
        ov.addColorStop(0.65, "rgba(0,0,0,0.80)");
        ov.addColorStop(1,    "rgba(0,0,0,0.92)");
        ctx.fillStyle = ov;
        ctx.fillRect(0, 0, SIZE, SIZE);
      } else {
        const m = bg.match(/(\d+)deg[^#]*(#[0-9A-Fa-f]{6})[^#]*(#[0-9A-Fa-f]{6})/);
        if (m) {
          const ang = (parseInt(m[1]) - 90) * (Math.PI / 180);
          const grd = ctx.createLinearGradient(
            SIZE / 2 - SIZE / 2 * Math.cos(ang), SIZE / 2 - SIZE / 2 * Math.sin(ang),
            SIZE / 2 + SIZE / 2 * Math.cos(ang), SIZE / 2 + SIZE / 2 * Math.sin(ang),
          );
          grd.addColorStop(0, m[2]);
          grd.addColorStop(1, m[3]);
          ctx.fillStyle = grd;
        } else {
          ctx.fillStyle = "#0C447C";
        }
        ctx.fillRect(0, 0, SIZE, SIZE);

        ctx.beginPath();
        ctx.arc(SIZE + 80, -80, 288, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-64, SIZE + 64, 224, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.fill();
      }

      // ── barra de acento ────────────────────────────────
      const midY = SIZE * 0.44;
      ctx.fillStyle = accent;
      ctx.fillRect(PAD, midY, 108, 12);

      // ── título ─────────────────────────────────────────
      let textY = midY + 76;
      if (slide?.titulo) {
        ctx.font = `600 ${textStyle.titleSize}px ${textStyle.fontFamily}`;
        ctx.fillStyle = "#ffffff";
        const titleLines = quebrarTexto(ctx, slide.titulo, SIZE - PAD * 2);
        const titleLineH = Math.round(textStyle.titleSize * 1.19);
        for (const ln of titleLines) {
          ctx.fillText(ln, PAD, textY);
          textY += titleLineH;
        }
      }

      // ── subtítulo / corpo ──────────────────────────────
      const sub = slide?.subtitulo ?? slide?.corpo;
      if (sub) {
        textY += 20;
        ctx.font = `300 ${textStyle.bodySize}px ${textStyle.fontFamily}`;
        ctx.fillStyle = "rgba(255,255,255,0.70)";
        const subLines = quebrarTexto(ctx, sub, SIZE - PAD * 2);
        const bodyLineH = Math.round(textStyle.bodySize * 1.35);
        for (const ln of subLines.slice(0, 5)) {
          ctx.fillText(ln, PAD, textY);
          textY += bodyLineH;
        }
      }

      // ── rodapé: linha ──────────────────────────────────
      ctx.fillStyle = accent;
      ctx.fillRect(PAD, SIZE - PAD - 4, 86, 6);

      // ── download ───────────────────────────────────────
      const link = document.createElement("a");
      link.download = `slide-${slide?.numero ?? idx + 1}-jiadvoca.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("[baixarSlide]", e);
      toast.error("Erro ao baixar imagem");
    } finally {
      setBaixando(false);
    }
  }

  function carregarImg(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function quebrarTexto(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // preview font sizes scaled proportionally from canvas sizes
  const previewTitleSize = `${(textStyle.titleSize / 74 * 2.5).toFixed(2)}rem`;
  const previewBodySize = `${(textStyle.bodySize / 34 * 0.9).toFixed(2)}rem`;

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
              ref={slideRef}
              className="relative w-full overflow-hidden flex flex-col"
              style={{
                aspectRatio: "1 / 1",
                maxHeight: "360px",
                background: bg,
                ...(slide?.imagem_url && {
                  backgroundImage: `url(${slide.imagem_url})`,
                  backgroundSize: `${adj.scale}%`,
                  backgroundPosition: `${adj.x}% ${adj.y}%`,
                  backgroundRepeat: "no-repeat",
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
                <div className="flex-1 flex flex-col justify-center py-4">
                  <div className="w-10 h-[3px] rounded-full mb-5" style={{ background: accent }} />
                  {slide?.titulo && (
                    <div className="relative group">
                      {editingField === "titulo" ? (
                        <textarea
                          autoFocus
                          value={slide.titulo}
                          onChange={(e) => editSlideField("titulo", e.target.value)}
                          onBlur={() => setEditingField(null)}
                          rows={2}
                          className="w-full bg-transparent text-white font-semibold leading-[1.08] tracking-tight resize-none border-b border-white/50 focus:outline-none focus:border-white"
                          style={{ fontFamily: textStyle.fontFamily, fontSize: previewTitleSize }}
                        />
                      ) : (
                        <>
                          <p
                            className="text-white font-semibold leading-[1.08] tracking-tight cursor-text"
                            style={{ fontFamily: textStyle.fontFamily, fontSize: previewTitleSize }}
                            onClick={() => setEditingField("titulo")}
                          >
                            {slide.titulo}
                          </p>
                          <button
                            onClick={() => setEditingField("titulo")}
                            className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 bg-white/20 hover:bg-white/35 rounded flex items-center justify-center"
                          >
                            <Pencil className="h-2.5 w-2.5 text-white" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {(slide?.subtitulo || slide?.corpo) && (
                    <div className="relative group mt-5">
                      {editingField === "subtitulo" || editingField === "corpo" ? (
                        <textarea
                          autoFocus
                          value={slide.subtitulo ?? slide.corpo ?? ""}
                          onChange={(e) => {
                            if (slide.subtitulo !== undefined) editSlideField("subtitulo", e.target.value);
                            else editSlideField("corpo", e.target.value);
                          }}
                          onBlur={() => setEditingField(null)}
                          rows={3}
                          className="w-full bg-transparent text-white/70 leading-relaxed font-light resize-none border-b border-white/30 focus:outline-none focus:border-white/60"
                          style={{ fontFamily: textStyle.fontFamily, fontSize: previewBodySize }}
                        />
                      ) : (
                        <>
                          <p
                            className="text-white/70 leading-relaxed font-light cursor-text"
                            style={{ fontFamily: textStyle.fontFamily, fontSize: previewBodySize }}
                            onClick={() => setEditingField(slide.subtitulo !== undefined ? "subtitulo" : "corpo")}
                          >
                            {slide.subtitulo ?? slide.corpo}
                          </p>
                          <button
                            onClick={() => setEditingField(slide.subtitulo !== undefined ? "subtitulo" : "corpo")}
                            className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 bg-white/20 hover:bg-white/35 rounded flex items-center justify-center"
                          >
                            <Pencil className="h-2.5 w-2.5 text-white" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <div className="w-8 h-[1.5px] rounded-full" style={{ background: accent }} />
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
              {slide?.imagem_url && (
                <button
                  onClick={() => { setAdjusting((v) => !v); setEditingText(false); }}
                  title="Ajustar imagem"
                  className={`w-9 h-9 rounded-xl border shadow-sm flex items-center justify-center transition-colors ${
                    adjusting
                      ? "bg-[#0C447C] border-[#0C447C] text-white"
                      : "bg-white border-border hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIAModalAberto(true)}
                disabled={gerandoIA}
                title="Gerar fundo com IA"
                className="w-9 h-9 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 text-[#D97706] ${gerandoIA ? "animate-pulse" : ""}`} />
              </button>
              <button
                onClick={baixarSlide}
                disabled={baixando}
                title="Baixar slide"
                className="w-9 h-9 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
              >
                <Download className={`h-4 w-4 text-muted-foreground ${baixando ? "animate-bounce" : ""}`} />
              </button>
              <button
                onClick={() => { setEditingText((v) => !v); setAdjusting(false); }}
                title="Editar texto e fonte"
                className={`w-9 h-9 rounded-xl border shadow-sm flex items-center justify-center transition-colors ${
                  editingText
                    ? "bg-[#0C447C] border-[#0C447C] text-white"
                    : "bg-white border-border hover:bg-secondary text-muted-foreground"
                }`}
              >
                <Type className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* painel de ajuste de imagem */}
          {adjusting && slide?.imagem_url && (
            <div className="border-t border-border bg-[#FAFAF9] px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ajustar imagem</p>
                <button onClick={() => setAdjusting(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-10">Zoom</span>
                  <input
                    type="range" min={100} max={300} step={1}
                    value={adj.scale}
                    onChange={(e) => setAdj("scale", Number(e.target.value))}
                    className="flex-1 accent-[#0C447C] h-1.5"
                  />
                  <span className="text-xs text-muted-foreground w-10 text-right">{adj.scale}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-10">Posição X</span>
                  <input
                    type="range" min={0} max={100} step={1}
                    value={adj.x}
                    onChange={(e) => setAdj("x", Number(e.target.value))}
                    className="flex-1 accent-[#0C447C] h-1.5"
                  />
                  <span className="text-xs text-muted-foreground w-10 text-right">{adj.x}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-10">Posição Y</span>
                  <input
                    type="range" min={0} max={100} step={1}
                    value={adj.y}
                    onChange={(e) => setAdj("y", Number(e.target.value))}
                    className="flex-1 accent-[#0C447C] h-1.5"
                  />
                  <span className="text-xs text-muted-foreground w-10 text-right">{adj.y}%</span>
                </div>
              </div>
            </div>
          )}

          {/* painel de edição de texto */}
          {editingText && (
            <div className="border-t border-border bg-[#FAFAF9] px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fonte e tamanho</p>
                <button onClick={() => setEditingText(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground/70">Clique no texto do slide para editar o conteúdo.</p>
              <div className="space-y-3">
                {/* fonte */}
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Fonte</label>
                  <select
                    value={textStyle.fontFamily}
                    onChange={(e) => setTextStyle((s) => ({ ...s, fontFamily: e.target.value }))}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#0C447C]"
                    style={{ fontFamily: textStyle.fontFamily }}
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* tamanho do título */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-16">Título</span>
                  <input
                    type="range" min={40} max={120} step={2}
                    value={textStyle.titleSize}
                    onChange={(e) => setTextStyle((s) => ({ ...s, titleSize: Number(e.target.value) }))}
                    className="flex-1 accent-[#0C447C] h-1.5"
                  />
                  <span className="text-xs text-muted-foreground w-10 text-right">{textStyle.titleSize}px</span>
                </div>
                {/* tamanho do corpo */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-16">Corpo</span>
                  <input
                    type="range" min={16} max={60} step={2}
                    value={textStyle.bodySize}
                    onChange={(e) => setTextStyle((s) => ({ ...s, bodySize: Number(e.target.value) }))}
                    className="flex-1 accent-[#0C447C] h-1.5"
                  />
                  <span className="text-xs text-muted-foreground w-10 text-right">{textStyle.bodySize}px</span>
                </div>
              </div>
            </div>
          )}

          {/* navegação */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-white">
            <button
              onClick={() => { setIdx((i) => Math.max(0, i - 1)); setAdjusting(false); }}
              disabled={idx === 0}
              className="p-1 rounded hover:bg-secondary disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{idx + 1} / {slides.length}</span>
              <span className="text-[10px] text-muted-foreground/50 border border-border rounded px-1.5 py-0.5 font-mono">
                1080 × 1080
              </span>
            </div>
            <button
              onClick={() => { setIdx((i) => Math.min(slides.length - 1, i + 1)); setAdjusting(false); }}
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
      <IAImageModal
        aberto={iaModalAberto}
        onFechar={() => setIAModalAberto(false)}
        onConfirmar={gerarComIA}
        gerando={gerandoIA}
      />
    </div>
  );
}
