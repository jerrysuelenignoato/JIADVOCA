"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Wand2, Search, Trash2, Copy, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PlanoGate from "@/components/app/PlanoGate";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { StatusConteudo } from "@/lib/utils";

type Conteudo = {
  id: string;
  tipo: "carrossel" | "reel";
  area: string;
  tom: string;
  headline: string | null;
  tese: string | null;
  status: StatusConteudo;
  created_at: string;
};

const STATUS_LABEL: Record<StatusConteudo, string> = {
  ideia: "Ideia",
  revisando: "Revisando",
  agendado: "Agendado",
  publicado: "Publicado",
};

const STATUS_COLOR: Record<StatusConteudo, string> = {
  ideia: "bg-secondary text-muted-foreground",
  revisando: "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/20",
  agendado: "bg-[#185FA5]/10 text-[#185FA5] border-[#185FA5]/20",
  publicado: "bg-[#0F6E56]/10 text-[#0F6E56] border-[#0F6E56]/20",
};

const TIPOS = ["todos", "carrossel", "reel"] as const;
const STATUSES: Array<StatusConteudo | "todos"> = ["todos", "ideia", "revisando", "agendado", "publicado"];

export default function BibliotecaPage() {
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<(typeof TIPOS)[number]>("todos");
  const [filtroStatus, setFiltroStatus] = useState<(typeof STATUSES)[number]>("todos");

  const fetchConteudos = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("contents")
      .select("id, tipo, area, tom, headline, tese, status, created_at")
      .order("created_at", { ascending: false });

    if (filtroTipo !== "todos") query = query.eq("tipo", filtroTipo);
    if (filtroStatus !== "todos") query = query.eq("status", filtroStatus);

    const { data } = await query;
    setConteudos(data ?? []);
    setLoading(false);
  }, [filtroTipo, filtroStatus]);

  useEffect(() => { fetchConteudos(); }, [fetchConteudos]);

  async function deletar(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("contents").delete().eq("id", id);
    if (error) { toast.error("Erro ao deletar"); return; }
    toast.success("Conteúdo deletado");
    setConteudos((c) => c.filter((x) => x.id !== id));
  }

  async function atualizarStatus(id: string, status: StatusConteudo) {
    const supabase = createClient();
    await supabase.from("contents").update({ status }).eq("id", id);
    setConteudos((c) => c.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success("Status atualizado");
  }

  const filtrados = conteudos.filter((c) => {
    if (!busca) return true;
    const q = busca.toLowerCase();
    return (
      c.headline?.toLowerCase().includes(q) ||
      c.area.toLowerCase().includes(q) ||
      c.tese?.toLowerCase().includes(q)
    );
  });

  return (
    <PlanoGate recurso="Biblioteca">
    <div className="p-6 lg:p-8 max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Biblioteca</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{conteudos.length} conteúdo{conteudos.length !== 1 ? "s" : ""} salvos</p>
        </div>
        <Link
          href="/gerar"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0C447C] text-white text-sm font-medium hover:bg-[#185FA5] transition-colors"
        >
          <Wand2 className="h-4 w-4" /> Novo conteúdo
        </Link>
      </div>

      {/* filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por headline ou área..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TIPOS.map((t) => (
            <button
              key={t}
              onClick={() => setFiltroTipo(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize border ${filtroTipo === t ? "bg-[#0C447C] text-white border-[#0C447C]" : "border-border hover:bg-secondary"}`}
            >
              {t === "todos" ? "Todos" : t === "carrossel" ? "🖼 Carrossel" : "🎬 Reel"}
            </button>
          ))}
          {STATUSES.slice(1).map((s) => (
            <button
              key={s}
              onClick={() => setFiltroStatus(filtroStatus === s ? "todos" : s)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${filtroStatus === s ? "bg-secondary border-[#0C447C]/30 text-[#0C447C]" : "border-border hover:bg-secondary text-muted-foreground"}`}
            >
              {STATUS_LABEL[s as StatusConteudo]}
            </button>
          ))}
        </div>
      </div>

      {/* grid de conteúdos */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium">Nenhum conteúdo encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            {busca ? "Tente outra busca" : "Gere seu primeiro conteúdo"}
          </p>
          {!busca && (
            <Link href="/gerar" className="mt-4 text-sm text-[#0C447C] hover:underline flex items-center gap-1">
              <Wand2 className="h-3.5 w-3.5" /> Gerar agora
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtrados.map((c) => (
            <div key={c.id} className="bg-white border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-[#0C447C]/30 transition-colors group">
              <div className="flex items-start justify-between gap-2">
                <span className="text-lg">{c.tipo === "carrossel" ? "🖼" : "🎬"}</span>
                <select
                  value={c.status}
                  onChange={(e) => atualizarStatus(c.id, e.target.value as StatusConteudo)}
                  className={`text-xs px-2 py-1 rounded-md border font-medium cursor-pointer ${STATUS_COLOR[c.status]}`}
                >
                  {Object.entries(STATUS_LABEL).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-h-0">
                <p className="text-sm font-semibold leading-snug line-clamp-2">
                  {c.headline ?? c.area}
                </p>
                {c.tese && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.tese}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">{c.area}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => navigator.clipboard.writeText(c.headline ?? c.area).then(() => toast.success("Copiado!"))}
                    className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Copiar headline"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deletar(c.id)}
                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Deletar conteúdo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </PlanoGate>
  );
}
