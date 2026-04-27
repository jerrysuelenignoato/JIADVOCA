import Link from "next/link";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { CheckCircle2, Wand2, BookOpen, Kanban, ArrowRight, Star } from "lucide-react";

const PROBLEMAS = [
  {
    emoji: "⏰",
    titulo: "Falta de tempo",
    desc: "Entre audiências, petições e clientes, não sobra tempo para criar conteúdo toda semana.",
  },
  {
    emoji: "📝",
    titulo: "Conteúdo genérico",
    desc: "Posts que parecem de qualquer advogado. Sem diferencial, sem conexão com quem precisa de você.",
  },
  {
    emoji: "🤔",
    titulo: "Não sabe o que postar",
    desc: "A mente trava na frente do celular. E o Instagram fica parado enquanto concorrentes crescem.",
  },
];

const PASSOS = [
  {
    n: "01",
    titulo: "Escolha o tema",
    desc: "Selecione uma das 8 áreas previdenciárias — aposentadoria, BPC, auxílio-doença e mais.",
  },
  {
    n: "02",
    titulo: "Configure o tom",
    desc: "Educativo, empático, de autoridade ou prático. O conteúdo soa como você, não como um robô.",
  },
  {
    n: "03",
    titulo: "Gere em segundos",
    desc: "A IA cria slides, legenda, hashtags e CTA. Você copia, ajusta se quiser e posta.",
  },
];

const DEPOIMENTOS = [
  {
    nome: "Dra. Camila Souza",
    oab: "OAB/SP 412.391",
    texto:
      "Em 3 semanas usando o JIADVOCA, meu perfil saiu de 300 para 1.800 seguidores. Recebi 12 consultas direto pelo Instagram — algo que nunca tinha acontecido antes.",
    estrelas: 5,
  },
  {
    nome: "Dr. Ricardo Alves",
    oab: "OAB/MG 187.204",
    texto:
      "Eu travava toda vez que ia escrever um post. Com o JIADVOCA consigo criar um carrossel completo em menos de 2 minutos. O juridiquês sumiu dos meus conteúdos.",
    estrelas: 5,
  },
  {
    nome: "Dra. Patrícia Lima",
    oab: "OAB/RJ 204.567",
    texto:
      "A qualidade dos textos é impressionante. Parecem escritos por um copywriter especializado em direito previdenciário. Meus clientes ficam perguntando quem escreve.",
    estrelas: 5,
  },
];

const FAQ = [
  {
    p: "Preciso saber de marketing para usar?",
    r: "Não. O JIADVOCA foi feito para advogados que nunca criaram conteúdo. Você só escolhe o tema e o tom — a IA faz o resto.",
  },
  {
    p: "O conteúdo vai parecer com o de outros advogados?",
    r: "Não. Cada geração é única. Além disso você pode personalizar com contexto específico do seu escritório, cidade ou perfil de clientes.",
  },
  {
    p: "Posso cancelar quando quiser?",
    r: "Sim. No plano mensal você cancela a qualquer momento sem multa. No anual, você garantiu o melhor preço pelo período.",
  },
  {
    p: "Funciona para outras áreas do direito?",
    r: "O JIADVOCA é especializado em direito previdenciário — e essa especialização é o que torna os conteúdos tão precisos e eficazes.",
  },
  {
    p: "Qual a diferença entre os planos Reel e Completo?",
    r: "O plano Roteiro (R$97) gera roteiros de carrossel e reels. O plano Plus (R$127) inclui também Biblioteca, Kanban, Calendário editorial e carrosséis com imagem real.",
  },
  {
    p: "Quantos posts consigo gerar por mês?",
    r: "Em todos os planos pagos, 60 gerações por mês. Para a maioria dos advogados (3–4 posts/semana) isso é mais do que suficiente.",
  },
  {
    p: "Os textos podem ser usados sem edição?",
    r: "Sim, mas recomendamos uma leitura rápida para adicionar seu toque pessoal. A IA entrega 90% do trabalho — você finaliza com 10%.",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="pt-16">
        {/* ── HERO ─────────────────────────────────────── */}
        <section className="bg-white px-4 sm:px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-xs font-semibold bg-[#0C447C]/10 text-[#0C447C] px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
              Para advogados previdenciaristas
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-[#1C1917]">
              Alcance seus clientes
              <br />
              <span className="text-[#0C447C]">da melhor forma.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Gere carrosséis e reels magnéticos para o Instagram em menos de 2 minutos — sem juridiquês, sem página em branco, sem terceirizar.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/cadastro"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0C447C] text-white font-medium hover:bg-[#185FA5] transition-colors text-base"
              >
                Testar grátis por 7 dias
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#como-funciona"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-border font-medium hover:bg-secondary transition-colors text-base text-muted-foreground"
              >
                Ver como funciona
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Sem cartão de crédito · Cancele quando quiser
            </p>
          </div>
        </section>

        {/* ── PROVA SOCIAL ─────────────────────────────── */}
        <section className="bg-[#F5F5F4] py-10 px-4 sm:px-6 border-y border-border">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Mais de <strong className="text-foreground">200 advogados</strong> já geram conteúdo com o JIADVOCA
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground">
              {["OAB/SP", "OAB/MG", "OAB/RJ", "OAB/RS", "OAB/PR", "OAB/BA"].map((oab) => (
                <span key={oab} className="opacity-60">{oab}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEMAS ────────────────────────────────── */}
        <section className="bg-white py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl sm:text-4xl">Reconhece alguma dessas situações?</h2>
              <p className="mt-3 text-muted-foreground">São as três razões por que a maioria dos advogados não cresce no Instagram.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {PROBLEMAS.map(({ emoji, titulo, desc }) => (
                <div key={titulo} className="bg-[#F5F5F4] rounded-2xl p-6">
                  <span className="text-3xl">{emoji}</span>
                  <h3 className="font-semibold mt-4 mb-2">{titulo}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMO FUNCIONA ────────────────────────────── */}
        <section id="como-funciona" className="bg-[#F5F5F4] py-20 px-4 sm:px-6 border-y border-border">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl sm:text-4xl">Como funciona</h2>
              <p className="mt-3 text-muted-foreground">De zero a carrossel publicado em menos de 3 minutos.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {PASSOS.map(({ n, titulo, desc }) => (
                <div key={n} className="flex gap-4">
                  <span className="text-4xl font-bold text-[#0C447C]/15 shrink-0 leading-none">{n}</span>
                  <div>
                    <h3 className="font-semibold mb-1">{titulo}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* features grid */}
            <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Wand2, titulo: "Gerador de IA", desc: "Carrosséis e reels em segundos" },
                { icon: BookOpen, titulo: "Biblioteca", desc: "Todos os conteúdos organizados" },
                { icon: Kanban, titulo: "Kanban", desc: "Fluxo de publicação visual" },
                { icon: CheckCircle2, titulo: "Calendário", desc: "Agende com antecedência" },
              ].map(({ icon: Icon, titulo, desc }) => (
                <div key={titulo} className="bg-white rounded-xl p-5 border border-border">
                  <Icon className="h-5 w-5 text-[#0C447C] mb-3" />
                  <p className="font-medium text-sm">{titulo}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DEPOIMENTOS ──────────────────────────────── */}
        <section className="bg-white py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl sm:text-4xl">O que dizem os advogados</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {DEPOIMENTOS.map(({ nome, oab, texto, estrelas }) => (
                <div key={nome} className="bg-[#F5F5F4] rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: estrelas }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#D97706] text-[#D97706]" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed flex-1">&ldquo;{texto}&rdquo;</p>
                  <div>
                    <p className="text-sm font-semibold">{nome}</p>
                    <p className="text-xs text-muted-foreground">{oab}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PREÇOS ───────────────────────────────────── */}
        <section id="precos" className="bg-[#F5F5F4] py-20 px-4 sm:px-6 border-y border-border">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl sm:text-4xl">Preços simples</h2>
              <p className="mt-3 text-muted-foreground">Sem surpresas. Cancele quando quiser.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {/* roteiro */}
              <div className="bg-white rounded-2xl border border-border p-7 flex flex-col">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Roteiro</p>
                <p className="mt-3 text-4xl font-bold">R$97</p>
                <p className="text-muted-foreground text-sm">por mês</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {[
                    "7 dias grátis",
                    "60 roteiros/mês",
                    "Roteiro de carrossel",
                    "Roteiro de reels",
                    "Suporte por email",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-[#0F6E56] shrink-0" />
                      {f}
                    </li>
                  ))}
                  {["Biblioteca e Kanban", "Calendário editorial", "Carrossel completo com imagem"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground/60">
                      <span className="h-4 w-4 shrink-0 text-center leading-none">✗</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cadastro"
                  className="mt-8 w-full py-3 rounded-xl border border-[#0C447C] text-[#0C447C] font-medium text-center hover:bg-[#0C447C]/5 transition-colors"
                >
                  Começar grátis
                </Link>
              </div>

              {/* plus */}
              <div className="bg-white rounded-2xl border-2 border-[#0C447C] p-7 flex flex-col relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0C447C] text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  Mais popular
                </span>
                <p className="text-sm font-semibold text-[#0C447C] uppercase tracking-wide">Plus</p>
                <p className="mt-3 text-4xl font-bold text-[#0C447C]">R$127</p>
                <p className="text-muted-foreground text-sm">por mês</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {[
                    "7 dias grátis",
                    "60 gerações/mês",
                    "Roteiro de carrossel",
                    "Roteiro de reels",
                    "Suporte por email",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-[#0F6E56] shrink-0" />
                      {f}
                    </li>
                  ))}
                  {["Biblioteca e Kanban", "Calendário editorial", "Carrossel completo com imagem"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[#0F6E56] font-medium">
                      <CheckCircle2 className="h-4 w-4 text-[#0F6E56] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cadastro"
                  className="mt-8 w-full py-3 rounded-xl bg-[#0C447C] text-white font-semibold text-center hover:bg-[#185FA5] transition-colors"
                >
                  Começar grátis
                </Link>
              </div>

              {/* anual */}
              <div className="bg-[#0C447C] rounded-2xl p-7 flex flex-col text-white relative overflow-hidden">
                <span className="absolute top-4 right-4 bg-[#D97706] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  2 meses grátis
                </span>
                <p className="text-sm font-semibold text-white/60 uppercase tracking-wide">Anual</p>
                <p className="mt-3 text-4xl font-bold">R$797</p>
                <p className="text-white/60 text-sm">por ano · R$66/mês</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {[
                    "7 dias grátis",
                    "60 gerações/mês",
                    "Reels completos",
                    "Biblioteca e Kanban",
                    "Calendário editorial",
                    "Suporte prioritário",
                    "Carrosséis prontos",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-white/70 shrink-0" />
                      {f}
                    </li>
                  ))}
                  <li className="flex items-center gap-2.5 text-sm text-[#D97706] font-medium">
                    <CheckCircle2 className="h-4 w-4 text-[#D97706] shrink-0" />
                    Economize R$727/ano
                  </li>
                </ul>
                <Link
                  href="/cadastro"
                  className="mt-8 w-full py-3 rounded-xl bg-white text-[#0C447C] font-semibold text-center hover:bg-white/90 transition-colors"
                >
                  Começar grátis
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────── */}
        <section id="faq" className="bg-white py-20 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl sm:text-4xl">Perguntas frequentes</h2>
            </div>
            <div className="divide-y divide-border">
              {FAQ.map(({ p, r }) => (
                <details key={p} className="group py-5">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-medium text-sm hover:text-[#0C447C] transition-colors">
                    {p}
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform shrink-0">▾</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────── */}
        <section className="bg-[#0C447C] py-20 px-4 sm:px-6 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl">
              Seu próximo cliente está no Instagram agora.
            </h2>
            <p className="mt-4 text-white/70 text-lg">
              Comece a criar conteúdo que conecta — grátis por 7 dias.
            </p>
            <Link
              href="/cadastro"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0C447C] font-semibold text-base hover:bg-white/90 transition-colors"
            >
              Criar minha conta grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-white/50 text-sm">Sem cartão de crédito · Cancele quando quiser</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
