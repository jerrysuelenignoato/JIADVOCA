import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMesAtual(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export const AREAS_PREVIDENCIARIAS = [
  "Aposentadoria por Tempo de Contribuição",
  "Aposentadoria por Invalidez",
  "Aposentadoria por Idade",
  "Benefício de Prestação Continuada (BPC/LOAS)",
  "Auxílio-Doença / Perícia Médica",
  "Pensão por Morte",
  "Salário-Maternidade",
  "Revisão do Teto / Revisão da Vida Toda",
] as const;

export const SUGESTOES_POOL = [
  "Aposentadoria por Tempo de Contribuição",
  "Aposentadoria por Invalidez",
  "Aposentadoria por Idade",
  "BPC/LOAS para pessoas com deficiência",
  "BPC/LOAS para idosos acima de 65 anos",
  "Auxílio-Doença: quando o INSS é obrigado a pagar",
  "Perícia Médica: como se preparar",
  "Pensão por Morte: quem tem direito",
  "Salário-Maternidade para autônomas e MEIs",
  "Revisão da Vida Toda: o que mudou",
  "Aposentadoria Especial para atividade insalubre",
  "Aposentadoria Rural: regras e documentos",
  "Benefício negado pelo INSS: como recorrer",
  "Prazo para recorrer após indeferimento",
  "Documentos obrigatórios para aposentadoria",
  "Carência previdenciária: o que é e como calcular",
  "Tempo de contribuição: o que conta e o que não conta",
  "Reforma da Previdência: o que mudou na prática",
  "INSS negou sem justo motivo: seus direitos",
  "Segurado especial: regras e benefícios",
  "Auxílio-Acidente: quem tem direito",
  "Como calcular o valor da aposentadoria",
  "Trabalho informal conta para a aposentadoria?",
  "Contribuição em atraso: como regularizar",
];

export const TONS_CONTEUDO = [
  { valor: "educativo", label: "Educativo", desc: "Explica com clareza e didática" },
  { valor: "empático", label: "Empático", desc: "Conecta com a dor e esperança" },
  { valor: "autoridade", label: "Autoridade", desc: "Postura de especialista confiável" },
  { valor: "prático", label: "Prático", desc: "Direto ao ponto, acionável" },
] as const;

export type AreaPrevidenciaria = (typeof AREAS_PREVIDENCIARIAS)[number];
export type TomConteudo = (typeof TONS_CONTEUDO)[number]["valor"];
export type TipoConteudo = "carrossel" | "reel";
export type StatusConteudo = "ideia" | "revisando" | "agendado" | "publicado";
