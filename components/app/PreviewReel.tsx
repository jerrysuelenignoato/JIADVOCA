"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

type Cena = { texto: string; duracao: string; tipo_visual: string };
type Props = {
  conteudo: {
    headline?: string;
    tese?: string;
    roteiro?: {
      gancho?: Cena;
      problema?: Cena;
      desenvolvimento?: Cena;
      prova?: Cena;
      cta?: Cena;
    };
    legenda?: string;
    hashtags?: string[];
    trilha_sugerida?: string;
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
    <button onClick={copy} className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" aria-label="Copiar">
      {copied ? <Check className="h-3.5 w-3.5 text-[#0F6E56]" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

const LABELS: Record<string, string> = {
  gancho: "🎯 Gancho",
  problema: "😟 Problema",
  desenvolvimento: "📖 Desenvolvimento",
  prova: "✅ Prova social",
  cta: "📣 CTA",
};

export default function PreviewReel({ conteudo }: Props) {
  const roteiro = conteudo.roteiro ?? {};

  const roteiroCompleto = Object.entries(roteiro)
    .map(([k, v]) => `${LABELS[k] ?? k} (${v.duracao})\n${v.texto}\nVisual: ${v.tipo_visual}`)
    .join("\n\n");

  return (
    <div className="space-y-4">
      {conteudo.headline && (
        <div className="flex items-start justify-between gap-2 p-3 bg-[#0C447C]/5 rounded-lg border border-[#0C447C]/10">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Headline</p>
            <p className="font-semibold text-[#0C447C] leading-snug">{conteudo.headline}</p>
          </div>
          <CopyBtn text={conteudo.headline} />
        </div>
      )}

      {/* roteiro */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/30">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Roteiro</p>
          <CopyBtn text={roteiroCompleto} />
        </div>
        <div className="divide-y divide-border">
          {Object.entries(roteiro).map(([key, cena]) => (
            <div key={key} className="px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium">{LABELS[key] ?? key}</span>
                <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{cena.duracao}</span>
              </div>
              <p className="text-sm leading-relaxed">{cena.texto}</p>
              <p className="text-xs text-muted-foreground mt-1">Visual: {cena.tipo_visual}</p>
            </div>
          ))}
        </div>
      </div>

      {conteudo.trilha_sugerida && (
        <div className="p-3 bg-secondary/50 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground mb-0.5">Trilha sonora sugerida</p>
          <p className="text-sm font-medium">{conteudo.trilha_sugerida}</p>
        </div>
      )}

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
    </div>
  );
}
