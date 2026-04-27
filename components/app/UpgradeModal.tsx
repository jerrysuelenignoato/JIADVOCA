"use client";

import { useState } from "react";
import { Zap, X, Loader2 } from "lucide-react";

type Plano = "mensal" | "mensal_plus" | "anual";

type Props = {
  aberto: boolean;
  onFechar: () => void;
  motivo?: "cota" | "expirado" | "plano";
};

export default function UpgradeModal({ aberto, onFechar, motivo = "cota" }: Props) {
  const [loading, setLoading] = useState<Plano | null>(null);

  if (!aberto) return null;

  async function checkout(plano: Plano) {
    setLoading(plano);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano }),
      });
      const data = await res.json();
      if (data.init_point) window.location.href = data.init_point;
    } finally {
      setLoading(null);
    }
  }

  const titulo =
    motivo === "expirado"
      ? "Seu trial expirou"
      : motivo === "plano"
      ? "Carrosséis no plano Completo"
      : "Cota do mês esgotada";

  const subtitulo =
    motivo === "expirado"
      ? "Assine para continuar gerando conteúdo"
      : motivo === "plano"
      ? "Seu plano atual inclui apenas Reels. Faça upgrade para criar carrosséis."
      : "Assine para desbloquear mais gerações";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-border w-full max-w-lg p-6 z-10">
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-[#D97706]" />
          </div>
          <div>
            <h2 className="font-semibold">{titulo}</h2>
            <p className="text-sm text-muted-foreground">{subtitulo}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Reel */}
          <div className="border border-border rounded-xl p-4 flex flex-col">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Roteiro</p>
            <p className="text-xl font-bold mt-1">
              R$97<span className="text-xs font-normal text-muted-foreground">/mês</span>
            </p>
            <ul className="text-xs text-muted-foreground mt-3 space-y-1.5 flex-1">
              <li>✓ 60 roteiros/mês</li>
              <li>✓ Roteiro de carrossel</li>
              <li className="text-[#78716C]">✗ Roteiro de reels</li>
              <li className="text-[#78716C]">✗ Carrossel com imagem</li>
            </ul>
            <button
              onClick={() => checkout("mensal")}
              disabled={loading !== null}
              className="mt-4 w-full py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {loading === "mensal" ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "Assinar"
              )}
            </button>
          </div>

          {/* Completo */}
          <div className="border-2 border-[#0C447C] rounded-xl p-4 flex flex-col relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#0C447C] text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">
              Mais popular
            </span>
            <p className="text-xs font-semibold text-[#0C447C] uppercase tracking-wide">Plus</p>
            <p className="text-xl font-bold mt-1 text-[#0C447C]">
              R$127<span className="text-xs font-normal text-muted-foreground">/mês</span>
            </p>
            <ul className="text-xs text-muted-foreground mt-3 space-y-1.5 flex-1">
              <li>✓ 60 gerações/mês</li>
              <li>✓ Roteiro de carrossel</li>
              <li>✓ Roteiro de reels</li>
              <li className="text-[#0F6E56] font-medium">✓ Carrossel completo com imagem</li>
            </ul>
            <button
              onClick={() => checkout("mensal_plus")}
              disabled={loading !== null}
              className="mt-4 w-full py-2 rounded-lg bg-[#0C447C] text-white text-sm font-medium hover:bg-[#185FA5] transition-colors disabled:opacity-50"
            >
              {loading === "mensal_plus" ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "Assinar"
              )}
            </button>
          </div>

          {/* Anual */}
          <div className="border border-border rounded-xl p-4 flex flex-col relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#D97706] text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">
              2 meses grátis
            </span>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Anual</p>
            <p className="text-xl font-bold mt-1">
              R$797<span className="text-xs font-normal text-muted-foreground">/ano</span>
            </p>
            <ul className="text-xs text-muted-foreground mt-3 space-y-1.5 flex-1">
              <li>✓ 60 gerações/mês</li>
              <li>✓ Reels + Carrosséis</li>
              <li className="text-[#0F6E56] font-medium">✓ Economize R$727</li>
              <li>✓ Suporte prioritário</li>
            </ul>
            <button
              onClick={() => checkout("anual")}
              disabled={loading !== null}
              className="mt-4 w-full py-2 rounded-lg border border-[#D97706] text-[#D97706] text-sm font-medium hover:bg-[#D97706]/5 transition-colors disabled:opacity-50"
            >
              {loading === "anual" ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "Assinar"
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Pagamento seguro via Mercado Pago · Cancele a qualquer momento
        </p>
      </div>
    </div>
  );
}
