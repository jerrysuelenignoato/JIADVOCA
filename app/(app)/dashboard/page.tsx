import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getMesAtual, AREAS_PREVIDENCIARIAS } from "@/lib/utils";
import { Wand2, BookOpen, Zap, CalendarDays, ArrowRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const SUGESTOES = [
  { area: "Auxílio-Doença / Perícia Médica", gancho: "O INSS negou sua perícia? Você tem direito de recorrer" },
  { area: "Aposentadoria por Invalidez", gancho: "Quando a doença impede de trabalhar, o INSS é obrigado a pagar" },
  { area: "Benefício de Prestação Continuada (BPC/LOAS)", gancho: "Sua família pode ter direito a R$1.518 sem nunca ter contribuído" },
  { area: "Pensão por Morte", gancho: "Perdeu alguém? A pensão pode ser vitalícia e você talvez não saiba" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const mes = getMesAtual();

  const [{ data: profile }, { data: sub }, { data: usage }, { data: ultimosConteudos }, { data: agendados }] =
    await Promise.all([
      supabase.from("profiles").select("nome").eq("id", user.id).single(),
      supabase.from("subscriptions").select("plano, status, fim").eq("user_id", user.id).eq("status", "ativa").order("created_at", { ascending: false }).limit(1).single(),
      supabase.from("usage").select("carrosseis_gerados, reels_gerados").eq("user_id", user.id).eq("mes", mes).single(),
      supabase.from("contents").select("id, tipo, headline, area, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
      supabase.from("contents").select("id, headline, data_agendada").eq("user_id", user.id).eq("status", "agendado").order("data_agendada", { ascending: true }).limit(1).single(),
    ]);

  const nome = profile?.nome?.split(" ")[0] ?? "Doutor(a)";
  const totalGerado = (usage?.carrosseis_gerados ?? 0) + (usage?.reels_gerados ?? 0);
  const limites: Record<string, number> = { trial: 5, mensal: 60, anual: 60 };
  const limite = limites[sub?.plano ?? "trial"] ?? 5;
  const cotaRestante = Math.max(0, limite - totalGerado);

  const diasTrial = sub?.plano === "trial" && sub.fim
    ? Math.max(0, Math.ceil((new Date(sub.fim).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl">
      {/* boas-vindas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {saudacao()}, {nome} 👋
          </h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Plano <span className="font-medium capitalize text-foreground">{sub?.plano ?? "trial"}</span>
            {diasTrial !== null && (
              <span className={`ml-2 ${diasTrial <= 2 ? "text-destructive" : "text-[#D97706]"}`}>
                — {diasTrial} dia{diasTrial !== 1 ? "s" : ""} restante{diasTrial !== 1 ? "s" : ""} de trial
              </span>
            )}
          </p>
        </div>
        {diasTrial !== null && (
          <Link
            href="/conta"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D97706] text-white text-sm font-medium hover:bg-[#b45309] transition-colors"
          >
            <Zap className="h-4 w-4" /> Fazer upgrade
          </Link>
        )}
      </div>

      {/* métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Gerados este mês", value: totalGerado, icon: TrendingUp, color: "text-[#0C447C]" },
          { label: "Publicados", value: ultimosConteudos?.filter((c) => c.status === "publicado").length ?? 0, icon: BookOpen, color: "text-[#0F6E56]" },
          { label: "Cota disponível", value: cotaRestante, icon: Zap, color: cotaRestante <= 3 ? "text-destructive" : "text-[#D97706]" },
          { label: "Próximo agendado", value: agendados?.data_agendada ? new Date(agendados.data_agendada).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "—", icon: CalendarDays, color: "text-[#185FA5]" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-border shadow-none">
            <CardContent className="p-4">
              <Icon className={`h-5 w-5 mb-2 ${color}`} />
              <p className="text-2xl font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* continue de onde parou */}
      {ultimosConteudos && ultimosConteudos.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Continue de onde parou</h2>
            <Link href="/biblioteca" className="text-sm text-[#185FA5] hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {ultimosConteudos.map((c) => (
              <Link
                key={c.id}
                href={`/biblioteca`}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border hover:border-[#0C447C]/30 hover:bg-[#0C447C]/5 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.tipo === "carrossel" ? "bg-[#0C447C]/10" : "bg-[#185FA5]/10"}`}>
                  {c.tipo === "carrossel" ? "🖼" : "🎬"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.headline ?? c.area}</p>
                  <p className="text-xs text-muted-foreground">{c.area}</p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0 capitalize">{c.status}</Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* sugestões da semana */}
      <section>
        <h2 className="font-semibold mb-3">Sugestões da semana</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {SUGESTOES.map(({ area, gancho }) => (
            <div key={area} className="p-4 bg-white rounded-xl border border-border hover:border-[#0C447C]/30 transition-colors">
              <p className="text-xs text-muted-foreground mb-1">{area}</p>
              <p className="text-sm font-medium leading-snug mb-3">&ldquo;{gancho}&rdquo;</p>
              <Link
                href={`/gerar`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0C447C] hover:underline"
              >
                <Wand2 className="h-3.5 w-3.5" /> Gerar agora
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
