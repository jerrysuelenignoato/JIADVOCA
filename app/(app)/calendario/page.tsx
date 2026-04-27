"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Wand2,
  Calendar,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import { Dialog } from "@/components/ui/dialog";
import Link from "next/link";
import PlanoGate from "@/components/app/PlanoGate";

type Agendado = {
  id: string;
  tipo: "carrossel" | "reel";
  headline: string | null;
  area: string;
  data_agendada: string;
};

type ConteudoBiblioteca = {
  id: string;
  tipo: "carrossel" | "reel";
  headline: string | null;
  area: string;
};

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function CalendarioPage() {
  const [mesAtual, setMesAtual] = useState(new Date());
  const [agendados, setAgendados] = useState<Agendado[]>([]);
  const [loading, setLoading] = useState(true);

  // modal agendar
  const [modalAberto, setModalAberto] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [biblioteca, setBiblioteca] = useState<ConteudoBiblioteca[]>([]);
  const [conteudoSelecionado, setConteudoSelecionado] = useState("");
  const [salvando, setSalvando] = useState(false);

  const fetchAgendados = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const inicio = startOfMonth(mesAtual).toISOString();
    const fim = endOfMonth(mesAtual).toISOString();
    const { data } = await supabase
      .from("contents")
      .select("id, tipo, headline, area, data_agendada")
      .eq("status", "agendado")
      .gte("data_agendada", inicio)
      .lte("data_agendada", fim);
    setAgendados((data as Agendado[]) ?? []);
    setLoading(false);
  }, [mesAtual]);

  useEffect(() => { fetchAgendados(); }, [fetchAgendados]);

  async function abrirModalDia(dia: Date) {
    setDiaSelecionado(dia);
    setConteudoSelecionado("");
    const supabase = createClient();
    const { data } = await supabase
      .from("contents")
      .select("id, tipo, headline, area")
      .neq("status", "agendado")
      .order("created_at", { ascending: false })
      .limit(20);
    setBiblioteca((data as ConteudoBiblioteca[]) ?? []);
    setModalAberto(true);
  }

  async function agendar() {
    if (!diaSelecionado || !conteudoSelecionado) return;
    setSalvando(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("contents")
      .update({ status: "agendado", data_agendada: diaSelecionado.toISOString() })
      .eq("id", conteudoSelecionado);
    if (error) {
      toast.error("Erro ao agendar");
    } else {
      toast.success("Conteúdo agendado!");
      setModalAberto(false);
      fetchAgendados();
    }
    setSalvando(false);
  }

  async function desagendar(id: string) {
    const supabase = createClient();
    await supabase
      .from("contents")
      .update({ status: "ideia", data_agendada: null })
      .eq("id", id);
    toast.success("Removido do calendário");
    setAgendados((prev) => prev.filter((a) => a.id !== id));
  }

  // gerar grade do mês
  const inicioMes = startOfMonth(mesAtual);
  const fimMes = endOfMonth(mesAtual);
  const inicioGrade = startOfWeek(inicioMes, { weekStartsOn: 0 });
  const fimGrade = endOfWeek(fimMes, { weekStartsOn: 0 });
  const dias = eachDayOfInterval({ start: inicioGrade, end: fimGrade });

  return (
    <PlanoGate recurso="Calendário editorial">
    <div className="p-6 lg:p-8 max-w-5xl space-y-4">
      {/* cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Calendário</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {format(mesAtual, "MMMM yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMesAtual((m) => new Date(m.getFullYear(), m.getMonth() - 1))}
            className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMesAtual(new Date())}
            className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            Hoje
          </button>
          <button
            onClick={() => setMesAtual((m) => new Date(m.getFullYear(), m.getMonth() + 1))}
            className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* grade */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {/* dias da semana */}
        <div className="grid grid-cols-7 border-b border-border">
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="py-2.5 text-center text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {/* células */}
        <div className="grid grid-cols-7">
          {dias.map((dia, i) => {
            const agendadosDia = agendados.filter(
              (a) => a.data_agendada && isSameDay(parseISO(a.data_agendada), dia)
            );
            const pertenceMes = isSameMonth(dia, mesAtual);
            const hoje = isToday(dia);

            return (
              <div
                key={i}
                className={`min-h-24 p-1.5 border-b border-r border-border last:border-r-0 ${!pertenceMes ? "bg-[#F5F5F4]/50" : ""} ${i % 7 === 6 ? "border-r-0" : ""}`}
              >
                {/* número do dia */}
                <button
                  onClick={() => pertenceMes && abrirModalDia(dia)}
                  className={`w-7 h-7 rounded-full text-sm font-medium flex items-center justify-center mb-1 transition-colors ${hoje ? "bg-[#0C447C] text-white" : pertenceMes ? "hover:bg-secondary" : "text-muted-foreground/40"}`}
                >
                  {format(dia, "d")}
                </button>

                {/* conteúdos agendados */}
                <div className="space-y-0.5">
                  {agendadosDia.slice(0, 2).map((a) => (
                    <div
                      key={a.id}
                      className="group flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-[#0C447C]/10 text-[#0C447C] truncate cursor-pointer hover:bg-[#0C447C]/20 transition-colors"
                      title={a.headline ?? a.area}
                    >
                      <span>{a.tipo === "carrossel" ? "🖼" : "🎬"}</span>
                      <span className="truncate flex-1">{a.headline ?? a.area}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); desagendar(a.id); }}
                        className="opacity-0 group-hover:opacity-100 text-[#0C447C]/60 hover:text-destructive transition-all ml-0.5"
                        aria-label="Remover"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {agendadosDia.length > 2 && (
                    <p className="text-xs text-muted-foreground px-1">+{agendadosDia.length - 2} mais</p>
                  )}
                  {pertenceMes && agendadosDia.length === 0 && (
                    <button
                      onClick={() => abrirModalDia(dia)}
                      className="opacity-0 hover:opacity-100 w-full flex items-center justify-center gap-0.5 text-xs text-muted-foreground py-0.5 rounded hover:bg-secondary transition-all"
                    >
                      <Plus className="h-3 w-3" /> agendar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* legenda */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span>🖼</span> Carrossel</span>
        <span className="flex items-center gap-1.5"><span>🎬</span> Reel</span>
        <span className="text-muted-foreground/60">Clique em um dia para agendar</span>
      </div>

      {/* modal agendar */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setModalAberto(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-border w-full max-w-md p-6 z-10">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-[#0C447C]" />
              <h2 className="font-semibold">
                Agendar para {diaSelecionado ? format(diaSelecionado, "dd 'de' MMMM", { locale: ptBR }) : ""}
              </h2>
            </div>

            {biblioteca.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm mb-4">Nenhum conteúdo disponível na biblioteca</p>
                <Link
                  href="/gerar"
                  className="inline-flex items-center gap-2 text-sm text-[#0C447C] hover:underline"
                >
                  <Wand2 className="h-3.5 w-3.5" /> Gerar conteúdo agora
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                  {biblioteca.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setConteudoSelecionado(c.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${conteudoSelecionado === c.id ? "border-[#0C447C] bg-[#0C447C]/5" : "border-border hover:bg-secondary"}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{c.tipo === "carrossel" ? "🖼" : "🎬"}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{c.headline ?? c.area}</p>
                          <p className="text-xs text-muted-foreground">{c.area}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setModalAberto(false)}
                    className="flex-1 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={agendar}
                    disabled={!conteudoSelecionado || salvando}
                    className="flex-1 py-2 rounded-lg bg-[#0C447C] text-white text-sm font-medium hover:bg-[#185FA5] transition-colors disabled:opacity-50"
                  >
                    {salvando ? "Salvando..." : "Agendar"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    </PlanoGate>
  );
}
