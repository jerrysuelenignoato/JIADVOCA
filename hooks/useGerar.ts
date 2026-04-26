"use client";

import { useState } from "react";
import { toast } from "sonner";

export type ResultadoGeracao = {
  id: string;
  conteudo: Record<string, unknown>;
  cotaRestante: number;
};

export type ConfigGeracao = {
  tipo: "carrossel" | "reel";
  area: string;
  tom: string;
  slides?: number;
  duracao?: number;
  extra?: string;
};

const LOADING_MSGS = [
  "Saindo do juridiquês...",
  "Pensando em ganchos magnéticos...",
  "Traduzindo legalês para português humano...",
  "Criando slides que param o scroll...",
  "Encontrando a dor do segurado...",
];

export type MotivoUpgrade = "cota" | "expirado" | null;

export function useGerar() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ResultadoGeracao | null>(null);
  const [msgIdx, setMsgIdx] = useState(0);
  const [upgradeMotivo, setUpgradeMotivo] = useState<MotivoUpgrade>(null);

  async function gerar(config: ConfigGeracao) {
    setLoading(true);
    setResultado(null);

    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % LOADING_MSGS.length);
    }, 1800);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.code === "QUOTA_EXCEEDED") {
          setUpgradeMotivo("cota");
        } else if (data.code === "EXPIRED") {
          setUpgradeMotivo("expirado");
        } else {
          toast.error(data.error ?? "Erro ao gerar conteúdo");
        }
        return;
      }

      setResultado({ id: data.id, conteudo: data.conteudo, cotaRestante: data.cotaRestante });
      toast.success("Conteúdo gerado e salvo na biblioteca!");
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  return {
    gerar,
    loading,
    resultado,
    setResultado,
    loadingMsg: LOADING_MSGS[msgIdx],
    upgradeMotivo,
    fecharUpgrade: () => setUpgradeMotivo(null),
  };
}
