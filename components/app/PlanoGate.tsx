"use client";

import { Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { usePlano } from "@/hooks/usePlano";

type Props = {
  children: React.ReactNode;
  recurso: string;
};

export default function PlanoGate({ children, recurso }: Props) {
  const { plano, loading } = usePlano();
  const [pagando, setPagando] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (plano === "mensal") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-sm w-full text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#D97706]/10 flex items-center justify-center mx-auto">
            <Zap className="h-7 w-7 text-[#D97706]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#1C1917]">{recurso} no plano Plus</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Faça upgrade para o plano Plus (R$127/mês) ou Anual e tenha acesso a {recurso.toLowerCase()}, roteiro de reels e carrossel completo com imagem.
            </p>
          </div>
          <button
            disabled={pagando}
            onClick={async () => {
              setPagando(true);
              const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plano: "mensal_plus" }),
              });
              const data = await res.json();
              if (data.init_point) window.location.href = data.init_point;
              else setPagando(false);
            }}
            className="w-full py-3 rounded-xl bg-[#0C447C] text-white font-semibold hover:bg-[#185FA5] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {pagando ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Fazer upgrade — R$127/mês
          </button>
          <a href="/planos" className="block text-xs text-muted-foreground hover:underline">
            Ver todos os planos
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
