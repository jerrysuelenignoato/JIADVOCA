"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Loader2, CreditCard, User, BarChart2, Settings2, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getMesAtual, TONS_CONTEUDO } from "@/lib/utils";

type Profile = {
  nome: string;
  email: string;
  oab: string | null;
  whatsapp: string | null;
};

type Sub = {
  plano: string;
  status: string;
  fim: string | null;
  created_at: string;
};

type Usage = {
  carrosseis_gerados: number;
  reels_gerados: number;
};

const profileSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  oab: z.string().optional(),
  whatsapp: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

const LIMITES: Record<string, number> = { trial: 5, mensal: 60, anual: 60 };

export default function ContaPage() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sub, setSub] = useState<Sub | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [iniciandoPagamento, setIniciandoPagamento] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: p }, { data: s }, { data: u }] = await Promise.all([
        supabase.from("profiles").select("nome, email, oab, whatsapp").eq("id", user.id).single(),
        supabase.from("subscriptions").select("plano, status, fim, created_at").eq("user_id", user.id).eq("status", "ativa").order("created_at", { ascending: false }).limit(1).single(),
        supabase.from("usage").select("carrosseis_gerados, reels_gerados").eq("user_id", user.id).eq("mes", getMesAtual()).single(),
      ]);

      if (p) { setProfile(p as Profile); reset({ nome: p.nome, oab: p.oab ?? "", whatsapp: p.whatsapp ?? "" }); }
      if (s) setSub(s as Sub);
      if (u) setUsage(u as Usage);
    }
    load();

    // feedback do pagamento via URL
    const status = searchParams.get("status");
    if (status === "success") toast.success("Pagamento aprovado! Seu plano foi ativado.");
    if (status === "failure") toast.error("Pagamento não concluído. Tente novamente.");
  }, [reset, searchParams]);

  async function salvarPerfil(data: ProfileForm) {
    setSalvandoPerfil(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ nome: data.nome, oab: data.oab ?? null, whatsapp: data.whatsapp ?? null }).eq("id", user.id);
    if (error) toast.error("Erro ao salvar");
    else { toast.success("Perfil atualizado!"); setProfile((p) => p ? { ...p, ...data } : p); }
    setSalvandoPerfil(false);
  }

  async function iniciarCheckout(plano: "mensal" | "anual") {
    setIniciandoPagamento(plano);
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plano }) });
      const data = await res.json();
      if (data.init_point) window.location.href = data.init_point;
      else toast.error("Erro ao iniciar pagamento");
    } catch { toast.error("Erro ao iniciar pagamento"); }
    setIniciandoPagamento(null);
  }

  const totalGerado = (usage?.carrosseis_gerados ?? 0) + (usage?.reels_gerados ?? 0);
  const limite = LIMITES[sub?.plano ?? "trial"] ?? 5;
  const pctUso = Math.min(100, Math.round((totalGerado / limite) * 100));

  const diasTrial = sub?.plano === "trial" && sub.fim
    ? Math.max(0, Math.ceil((new Date(sub.fim).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-xl font-semibold mb-6">Minha Conta</h1>

      <Tabs defaultValue="perfil">
        <TabsList className="mb-6 w-full grid grid-cols-4">
          <TabsTrigger value="perfil" className="gap-1.5 text-xs sm:text-sm"><User className="h-3.5 w-3.5" />Perfil</TabsTrigger>
          <TabsTrigger value="plano" className="gap-1.5 text-xs sm:text-sm"><BarChart2 className="h-3.5 w-3.5" />Plano</TabsTrigger>
          <TabsTrigger value="faturamento" className="gap-1.5 text-xs sm:text-sm"><CreditCard className="h-3.5 w-3.5" />Faturas</TabsTrigger>
          <TabsTrigger value="preferencias" className="gap-1.5 text-xs sm:text-sm"><Settings2 className="h-3.5 w-3.5" />Config.</TabsTrigger>
        </TabsList>

        {/* ── Perfil ─────────────────────────────────── */}
        <TabsContent value="perfil">
          <form onSubmit={handleSubmit(salvarPerfil)} className="bg-white border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-medium">Dados pessoais</h2>

            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome completo</Label>
              <Input id="nome" {...register("nome")} />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={profile?.email ?? ""} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">Email não pode ser alterado</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="oab">OAB <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Input id="oab" placeholder="OAB/SP 123456" {...register("oab")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">WhatsApp <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Input id="whatsapp" placeholder="(11) 99999-9999" {...register("whatsapp")} />
            </div>

            <Button type="submit" disabled={salvandoPerfil} className="bg-[#0C447C] hover:bg-[#185FA5] text-white">
              {salvandoPerfil && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar alterações
            </Button>
          </form>
        </TabsContent>

        {/* ── Plano ─────────────────────────────────── */}
        <TabsContent value="plano">
          <div className="bg-white border border-border rounded-xl p-6 space-y-6">
            {/* plano atual */}
            <div>
              <h2 className="font-medium mb-3">Plano atual</h2>
              <div className="flex items-center gap-3">
                <Badge className={`capitalize text-sm px-3 py-1 ${sub?.plano === "trial" ? "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/20" : "bg-[#0F6E56]/10 text-[#0F6E56] border-[#0F6E56]/20"}`}>
                  {sub?.plano ?? "trial"}
                </Badge>
                {diasTrial !== null && (
                  <span className={`text-sm ${diasTrial <= 2 ? "text-destructive" : "text-muted-foreground"}`}>
                    {diasTrial} dia{diasTrial !== 1 ? "s" : ""} restante{diasTrial !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            {/* uso do mês */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Uso em {new Date().toLocaleString("pt-BR", { month: "long" })}</span>
                <span className="text-muted-foreground">{totalGerado} / {limite} gerações</span>
              </div>
              <Progress value={pctUso} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1.5">{limite - totalGerado} gerações disponíveis</p>
            </div>

            {/* upgrade */}
            {sub?.plano !== "anual" && (
              <div className="space-y-3 pt-2 border-t border-border">
                <h3 className="font-medium text-sm">Fazer upgrade</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {/* mensal */}
                  <div className="border border-border rounded-xl p-4">
                    <p className="font-semibold">Mensal</p>
                    <p className="text-2xl font-bold mt-1">R$97<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                    <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                      <li>✓ 60 gerações/mês</li>
                      <li>✓ Carrosséis + Reels</li>
                      <li>✓ Biblioteca ilimitada</li>
                    </ul>
                    <button
                      onClick={() => iniciarCheckout("mensal")}
                      disabled={iniciandoPagamento !== null}
                      className="mt-4 w-full py-2 rounded-lg border border-[#0C447C] text-[#0C447C] text-sm font-medium hover:bg-[#0C447C]/5 transition-colors disabled:opacity-50"
                    >
                      {iniciandoPagamento === "mensal" ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Assinar mensal"}
                    </button>
                  </div>

                  {/* anual */}
                  <div className="border-2 border-[#0C447C] rounded-xl p-4 relative">
                    <Badge className="absolute -top-2.5 left-3 bg-[#D97706] text-white text-xs border-0">Economize R$367</Badge>
                    <p className="font-semibold">Anual</p>
                    <p className="text-2xl font-bold mt-1">R$797<span className="text-sm font-normal text-muted-foreground">/ano</span></p>
                    <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                      <li>✓ 60 gerações/mês</li>
                      <li>✓ Carrosséis + Reels</li>
                      <li>✓ Biblioteca ilimitada</li>
                      <li className="text-[#0F6E56] font-medium">✓ 2 meses grátis</li>
                    </ul>
                    <button
                      onClick={() => iniciarCheckout("anual")}
                      disabled={iniciandoPagamento !== null}
                      className="mt-4 w-full py-2 rounded-lg bg-[#0C447C] text-white text-sm font-medium hover:bg-[#185FA5] transition-colors disabled:opacity-50"
                    >
                      {iniciandoPagamento === "anual" ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : <><Zap className="inline h-3.5 w-3.5 mr-1" />Assinar anual</>}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Faturamento ──────────────────────────── */}
        <TabsContent value="faturamento">
          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="font-medium mb-4">Histórico de pagamentos</h2>
            {sub?.plano === "trial" ? (
              <p className="text-sm text-muted-foreground">Nenhum pagamento realizado ainda.</p>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <div>
                    <p className="text-sm font-medium capitalize">Plano {sub?.plano}</p>
                    <p className="text-xs text-muted-foreground">
                      {sub?.created_at ? new Date(sub.created_at).toLocaleDateString("pt-BR") : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{sub?.plano === "anual" ? "R$ 797,00" : "R$ 97,00"}</p>
                    <Badge className="text-xs bg-[#0F6E56]/10 text-[#0F6E56] border-[#0F6E56]/20">Pago</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Preferências ─────────────────────────── */}
        <TabsContent value="preferencias">
          <div className="bg-white border border-border rounded-xl p-6 space-y-6">
            <div>
              <h2 className="font-medium mb-3">Tom padrão</h2>
              <div className="grid grid-cols-2 gap-2">
                {TONS_CONTEUDO.map(({ valor, label, desc }) => (
                  <div key={valor} className="p-3 rounded-lg border border-border">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Preferências de tom salvas automaticamente ao usar o gerador.</p>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="font-medium text-sm mb-2 text-destructive">Zona de perigo</h3>
              <button
                onClick={async () => {
                  if (!confirm("Tem certeza? Essa ação não pode ser desfeita.")) return;
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  window.location.href = "/login";
                }}
                className="text-sm text-destructive hover:underline"
              >
                Sair de todas as sessões
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
