"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { Plus, GripVertical, Wand2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { StatusConteudo } from "@/lib/utils";
import PlanoGate from "@/components/app/PlanoGate";

type Card = {
  id: string;
  tipo: "carrossel" | "reel";
  headline: string | null;
  area: string;
  status: StatusConteudo;
  created_at: string;
};

type Coluna = {
  id: StatusConteudo;
  label: string;
  cor: string;
};

const COLUNAS: Coluna[] = [
  { id: "ideia", label: "Ideias", cor: "bg-secondary text-muted-foreground border-border" },
  { id: "revisando", label: "Revisando", cor: "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/20" },
  { id: "publicado", label: "Publicado", cor: "bg-[#0F6E56]/10 text-[#0F6E56] border-[#0F6E56]/20" },
];

function KanbanCard({ card, isDragging }: { card: Card; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-border rounded-xl p-3 shadow-sm cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="mt-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-base">{card.tipo === "carrossel" ? "🖼" : "🎬"}</span>
            <Badge variant="outline" className="text-xs py-0 capitalize">{card.tipo}</Badge>
          </div>
          <p className="text-sm font-medium leading-snug line-clamp-2">
            {card.headline ?? card.area}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{card.area}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(card.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
          </p>
        </div>
      </div>
    </div>
  );
}

function ColunaKanban({ coluna, cards }: { coluna: Coluna; cards: Card[] }) {
  const { setNodeRef } = useSortable({ id: coluna.id });

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${coluna.cor}`}>
            {coluna.label}
          </span>
          <span className="text-xs text-muted-foreground">{cards.length}</span>
        </div>
        <Link
          href="/gerar"
          className="p-1 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Novo conteúdo"
        >
          <Plus className="h-4 w-4" />
        </Link>
      </div>

      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex flex-col gap-2 min-h-32 p-2 rounded-xl bg-[#F5F5F4] border-2 border-dashed border-transparent data-[over=true]:border-[#0C447C]/30 data-[over=true]:bg-[#0C447C]/5 transition-colors"
        >
          {cards.length === 0 && (
            <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
              Nenhum conteúdo
            </div>
          )}
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("contents")
        .select("id, tipo, headline, area, status, created_at")
        .in("status", ["ideia", "revisando", "publicado"])
        .order("created_at", { ascending: false });
      setCards((data as Card[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  function handleDragStart(event: DragStartEvent) {
    const card = cards.find((c) => c.id === event.active.id);
    if (card) setActiveCard(card);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const novoStatus = over.id as StatusConteudo;
    const cardId = active.id as string;
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.status === novoStatus) return;

    // verificar se over.id é uma coluna (não um card)
    const isColunaTarget = COLUNAS.some((col) => col.id === novoStatus);
    if (!isColunaTarget) return;

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: novoStatus } : c))
    );

    const supabase = createClient();
    const { error } = await supabase
      .from("contents")
      .update({ status: novoStatus })
      .eq("id", cardId);

    if (error) {
      toast.error("Erro ao mover card");
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, status: card.status } : c))
      );
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-xl font-semibold mb-6">Kanban</h1>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUNAS.map((c) => (
            <div key={c.id} className="w-72 shrink-0 space-y-2">
              <Skeleton className="h-8 w-28 rounded-full" />
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <PlanoGate recurso="Kanban">
    <div className="p-6 lg:p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Kanban</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Arraste os cards entre as colunas</p>
        </div>
        <Link
          href="/gerar"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0C447C] text-white text-sm font-medium hover:bg-[#185FA5] transition-colors"
        >
          <Wand2 className="h-4 w-4" /> Novo conteúdo
        </Link>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6">
          {COLUNAS.map((coluna) => (
            <ColunaKanban
              key={coluna.id}
              coluna={coluna}
              cards={cards.filter((c) => c.status === coluna.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard && <KanbanCard card={activeCard} isDragging />}
        </DragOverlay>
      </DndContext>

      {cards.length === 0 && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <p className="font-medium text-muted-foreground">Nenhum conteúdo no kanban ainda</p>
          <Link href="/gerar" className="mt-3 text-sm text-[#0C447C] hover:underline flex items-center gap-1">
            <Wand2 className="h-3.5 w-3.5" /> Gerar primeiro conteúdo
          </Link>
        </div>
      )}
    </div>
    </PlanoGate>
  );
}
