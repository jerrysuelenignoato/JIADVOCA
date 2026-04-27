"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Zap, Crown, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getMesAtual } from "@/lib/utils";

type Sub = { plano: string; status: string; fim: string | null };
type Usage = { carrosseis_gerados: number; reels_gerados: number };

const PLANOS = [
  {
    id: "mensal",
    nome: "Roteiro",
    preco: "R$97",
    periodo: "/mês",
    desc: "Roteiros prontos de carrossel e reels todo mês",
    recursos: [
      "60 roteiros por mês",
      "Roteiro de carrossel (sem foto)",
      "Roteiro de reels",
      "Biblioteca e Kanban",
      "Calendário editorial",
      "Suporte por email",
    ],
    nao: ["Carrossel completo com foto"],
    cor: "border-border",
    badge: null,
  },
  {
    id: "mensal_plus",
    nome: "Plus",
    preco: "R$127",
    periodo: "/mês",
    desc: "Tudo do Roteiro + carrossel completo com foto real",
    recursos: [
      "60 gerações por mês",
      "Roteiro de carrossel (sem foto)",
      "Roteiro de reels",
      "Carrossel completo com foto",
      "Biblioteca e Kanban",
      "Calendário editorial",
      "Suporte por email",
    ],
    nao: [],
    cor: "border-[#0C447C]",
    badge: "Mais popular",
  },
  {
    id: "anual",
    nome: "Anual",
    preco: "R$797",
    periodo: "/ano",
    desc: "Tudo incluso com 2 meses grátis",
    recursos: [
      "60 gerações por mês",
      "Roteiro de carrossel (sem foto)",
      "Roteiro de reels",
      "Carrossel completo com foto",
      "Biblioteca e Kanban",
      "Calendário editorial",
      "Suporte prioritário",
      "2 meses grátis",
    ],
    nao: [],
    cor: "border-[#D97706]",
    badge: "Economize R$727",
  },
];

const LABEL: Record<string, string> = {
  trial: "Trial",
  mensal: "Reel",
  mensal_plus: "Completo",
  anual: "Anual",
};

const LIMITES: Record<string, number> = {
  trial: 5,
  mensal: 60,
  mensal_plus: 60,
  anual: 9999,
};

export default function PlanosPage() {
  const [sub, setSub] = useState<Sub | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagando, setPagando] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: subData }, { data: usageData }] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("plano, status, fim")
          .eq("user_id", user.id)
          .eq("status", "ativa")
          .order("created_at", { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from("usage")
          .select("carrosseis_gerados, reels_gerados")
          .eq("user_id", user.id)
          .eq("mes", getMesAtual())
          .single(),
      ]);

      setSub(subData);
      setUsage(usageData);
      setLoading(false);
    }
    load();
  }, []);

  async function assinar(plano: string) {
    setPagando(plano);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano }),
      });
      const data = await res.json();
      if (data.init_point) window.location.href = data.init_point;
    } finally {
      setPagando(null);
    }
  }

  const planoAtual = sub?.plano ?? "trial";
  const limite = LIMITES[planoAtual] ?? 5;
  const totalUsado = (usage?.carrosseis_gerados ?? 0) + (usage?.reels_gerados ?? 0);
  const pct = Math.min(100, Math.round((totalUsado / limite) * 100));

  const diasRestantes = sub?.fim
    ? Math.max(0, Math.ceil((new Date(sub.fim).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="min-h-full bg-[#FAFAF9]">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">

        {/* ── Meu plano atual ── */}
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1917] mb-6">Planos</h1>

          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Carregando...</span>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Meu plano atual</p>
                  <div className="flex items-center gap-2">
                    {planoAtual === "anual" ? (
                      <Crown className="h-4 w-4 text-[#D97706]" />
                    ) : planoAtual === "mensal_plus" ? (
                      <Star className="h-4 w-4 text-[#0C447C]" />
                    ) : (
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-xl font-bold text-[#1C1917]">
                      {LABEL[planoAtual] ?? planoAtual}
                    </span>
                    {planoAtual === "trial" && (
                      <span className="text-xs bg-[#D97706]/10 text-[#D97706] px-2 py-0.5 rounded-full font-medium">
                        Período de teste
                      </span>
                    )}
                  </div>
                </div>
                {diasRestantes !== null && planoAtual !== "anual" && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Renova em</p>
                    <p className="text-sm font-semibold">{diasRestantes} dias</p>
                  </div>
                )}
              </div>

              {/* uso do mês */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Gerações este mês</span>
                  <span className="font-medium">
                    {totalUsado} / {limite === 9999 ? "ilimitado" : limite}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#F5F5F4] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${limite === 9999 ? 10 : pct}%`,
                      background: pct > 80 ? "#D97706" : "#0C447C",
                    }}
                  />
                </div>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>📸 {usage?.carrosseis_gerados ?? 0} carrosséis</span>
                  <span>🎬 {usage?.reels_gerados ?? 0} reels</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Cards de planos ── */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {planoAtual === "trial"
              ? "Escolha um plano para continuar gerando conteúdo:"
              : "Quer mudar de plano? Escolha abaixo:"}
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {PLANOS.map((p) => {
              const ativo = planoAtual === p.id;
              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-2xl border-2 ${p.cor} p-5 flex flex-col relative`}
                >
                  {p.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap text-white"
                      style={{ background: p.id === "anual" ? "#D97706" : "#0C447C" }}>
                      {p.badge}
                    </span>
                  )}
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{p.nome}</p>
                  <p className="text-3xl font-bold mt-1">
                    {p.preco}<span className="text-xs font-normal text-muted-foreground">{p.periodo}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4 leading-snug">{p.desc}</p>

                  <ul className="space-y-1.5 flex-1 mb-4">
                    {p.recursos.map((r) => (
                      <li key={r} className="flex items-start gap-1.5 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#0F6E56] shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                    {p.nao.map((r) => (
                      <li key={r} className="flex items-start gap-1.5 text-xs text-muted-foreground/50">
                        <span className="h-3.5 w-3.5 shrink-0 text-center leading-none mt-0.5">✗</span>
                        {r}
                      </li>
                    ))}
                  </ul>

                  {ativo ? (
                    <div className="w-full py-2 rounded-xl text-center text-xs font-semibold bg-[#0C447C]/10 text-[#0C447C]">
                      ✓ Plano atual
                    </div>
                  ) : (
                    <button
                      onClick={() => assinar(p.id)}
                      disabled={pagando !== null}
                      className="w-full py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                      style={{
                        background: p.id === "anual" ? "#D97706" : "#0C447C",
                        color: "white",
                      }}
                    >
                      {pagando === p.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto" />
                      ) : (
                        planoAtual === "trial" ? "Assinar agora" : "Mudar para este"
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Pagamento seguro via Mercado Pago · Cancele a qualquer momento
        </p>
      </div>
    </div>
  );
}
