"use client";

import { useState } from "react";
import { Zap, X, Loader2 } from "lucide-react";

type Props = {
  aberto: boolean;
  onFechar: () => void;
  motivo?: "cota" | "expirado";
};

export default function UpgradeModal({ aberto, onFechar, motivo = "cota" }: Props) {
  const [loading, setLoading] = useState<"mensal" | "anual" | null>(null);

  if (!aberto) return null;

  async function checkout(plano: "mensal" | "anual") {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-border w-full max-w-md p-6 z-10">
        {/* fechar */}
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ícone + título */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-[#D97706]" />
          </div>
          <div>
            <h2 className="font-semibold">
              {motivo === "expirado" ? "Seu trial expirou" : "Cota do mês esgotada"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {motivo === "expirado"
                ? "Assine para continuar gerando conteúdo"
                : "Assine para desbloquear mais gerações"}
            </p>
          </div>
        </div>

        {/* planos */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* mensal */}
          <div className="border border-border rounded-xl p-4 flex flex-col">
            <p className="text-sm font-semibold">Mensal</p>
            <p className="text-xl font-bold mt-1">
              R$97<span className="text-xs font-normal text-muted-foreground">/mês</span>
            </p>
            <ul className="text-xs text-muted-foreground mt-3 space-y-1 flex-1">
              <li>✓ 60 gerações/mês</li>
              <li>✓ Carrosséis + Reels</li>
              <li>✓ Cancele quando quiser</li>
            </ul>
            <button
              onClick={() => checkout("mensal")}
              disabled={loading !== null}
              className="mt-4 w-full py-2 rounded-lg border border-[#0C447C] text-[#0C447C] text-sm font-medium hover:bg-[#0C447C]/5 transition-colors disabled:opacity-50"
            >
              {loading === "mensal" ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "Assinar mensal"
              )}
            </button>
          </div>

          {/* anual */}
          <div className="border-2 border-[#0C447C] rounded-xl p-4 flex flex-col relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#D97706] text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
              Economize R$367
            </span>
            <p className="text-sm font-semibold">Anual</p>
            <p className="text-xl font-bold mt-1">
              R$797<span className="text-xs font-normal text-muted-foreground">/ano</span>
            </p>
            <ul className="text-xs text-muted-foreground mt-3 space-y-1 flex-1">
              <li>✓ 60 gerações/mês</li>
              <li>✓ Carrosséis + Reels</li>
              <li className="text-[#0F6E56] font-medium">✓ 2 meses grátis</li>
            </ul>
            <button
              onClick={() => checkout("anual")}
              disabled={loading !== null}
              className="mt-4 w-full py-2 rounded-lg bg-[#0C447C] text-white text-sm font-medium hover:bg-[#185FA5] transition-colors disabled:opacity-50"
            >
              {loading === "anual" ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "Assinar anual"
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
