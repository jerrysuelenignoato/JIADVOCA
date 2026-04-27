"use client";

import { useEffect, useState } from "react";
import { X, Sparkles, Loader2, AlertTriangle } from "lucide-react";

type Pack = { creditos: number; preco: number; label: string };
type Packs = Record<string, Pack>;

type Props = {
  aberto: boolean;
  onFechar: () => void;
  onConfirmar: () => void;
  gerando: boolean;
};

export default function IAImageModal({ aberto, onFechar, onConfirmar, gerando }: Props) {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [packs, setPacks] = useState<Packs>({});
  const [comprando, setComprando] = useState<string | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  useEffect(() => {
    if (!aberto) return;
    setLoadingInfo(true);
    fetch("/api/checkout-ia")
      .then((r) => r.json())
      .then((d) => { setSaldo(d.saldo ?? 0); setPacks(d.packs ?? {}); })
      .finally(() => setLoadingInfo(false));
  }, [aberto]);

  async function comprar(packId: string) {
    setComprando(packId);
    try {
      const res = await fetch("/api/checkout-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: packId }),
      });
      const data = await res.json();
      if (data.init_point) window.location.href = data.init_point;
    } finally {
      setComprando(null);
    }
  }

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-border w-full max-w-md p-6 z-10 space-y-5">
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-[#D97706]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#1C1917]">Gerar imagem com IA</h2>
            <p className="text-xs text-muted-foreground">Cada imagem consome 1 crédito de IA</p>
          </div>
        </div>

        {/* aviso de custo */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Imagens geradas por IA têm <strong>custo adicional</strong> e são cobradas separadamente da sua assinatura. Os créditos não expiram.
          </p>
        </div>

        {loadingInfo ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* saldo atual */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F4] border border-border">
              <span className="text-sm text-muted-foreground">Seu saldo de créditos</span>
              <span className={`text-lg font-bold ${(saldo ?? 0) > 0 ? "text-[#0F6E56]" : "text-[#D97706]"}`}>
                {saldo} crédito{saldo !== 1 ? "s" : ""}
              </span>
            </div>

            {/* se tem crédito: botão de usar */}
            {(saldo ?? 0) > 0 && (
              <button
                onClick={onConfirmar}
                disabled={gerando}
                className="w-full py-3 rounded-xl bg-[#0C447C] hover:bg-[#185FA5] text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {gerando
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando imagem...</>
                  : <><Sparkles className="h-4 w-4" /> Usar 1 crédito e gerar</>}
              </button>
            )}

            {/* packs de compra */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {(saldo ?? 0) > 0 ? "Comprar mais créditos" : "Comprar créditos para começar"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(packs).map(([id, pack]) => (
                  <button
                    key={id}
                    onClick={() => comprar(id)}
                    disabled={comprando !== null}
                    className="flex flex-col items-center p-3 rounded-xl border border-border hover:border-[#0C447C] hover:bg-[#0C447C]/5 transition-all disabled:opacity-50 text-center"
                  >
                    {comprando === id
                      ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mb-1" />
                      : <span className="text-lg font-bold text-[#1C1917]">{pack.creditos}</span>
                    }
                    <span className="text-[10px] text-muted-foreground">imagens</span>
                    <span className="text-xs font-semibold text-[#0C447C] mt-1">
                      R${pack.preco.toFixed(2).replace(".", ",")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Pagamento seguro via Mercado Pago · Créditos não expiram
        </p>
      </div>
    </div>
  );
}
