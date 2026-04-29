const ANGULOS = [
  "mito vs realidade — desmistifique uma crença errada e muito comum sobre esse tema",
  "passo a passo prático — guie o segurado por etapas concretas e acionáveis",
  "alerta de erro — mostre os erros mais comuns que fazem perder o benefício",
  "artigo de lei na prática — cite o texto legal exato e explique com exemplo real",
  "dado surpreendente — comece com estatística ou número impactante e pouco conhecido",
  "pergunta frequente respondida — a dúvida que todo segurado tem mas ninguém explica direito",
  "quem tem direito e quem não tem — destrinche critérios com precisão e exemplos",
  "documentação essencial — quais documentos são exigidos e por que cada um importa",
  "prazo que você não pode perder — destaque os prazos legais críticos e as consequências",
  "comparativo antes e depois — como a lei era e como ficou após a EC 103/2019",
  "quanto vale e como calcular — explique o valor do benefício com cálculo passo a passo",
  "como recorrer — o que fazer quando o INSS nega e qual o caminho certo",
  "mapa de benefícios — qual benefício é adequado para cada situação descrita",
  "história do direito — contexto histórico e por que esse benefício existe",
  "linguagem simples de artigo de lei — pegue um artigo complexo e traduza para o leigo",
  "caso hipotético educativo — construa um cenário fictício anônimo que ilustra o direito",
  "checklist do segurado — lista do que verificar antes de pedir o benefício",
  "armadilhas do INSS — situações onde o segurado perde o direito sem saber",
  "comparativo de benefícios — diferenças entre dois benefícios que as pessoas confundem",
  "o que a lei diz vs o que o INSS faz — discrepâncias e como o segurado reage",
] as const;

function angulo(): string {
  return ANGULOS[Math.floor(Math.random() * ANGULOS.length)];
}

export function buildCarrosselPrompt(
  area: string,
  tom: string,
  slides: number,
  extra?: string
) {
  const anguloEscolhido = angulo();

  return `Crie um carrossel educativo de Instagram com ${slides} slides sobre "${area}".

Tom: ${tom}
${extra ? `Contexto adicional: ${extra}` : ""}

━━━ ÂNGULO OBRIGATÓRIO DESTA GERAÇÃO ━━━
${anguloEscolhido}
Use esse ângulo como fio condutor de TODOS os slides. Não ignore esta instrução.
O conteúdo deve ser claramente diferente de um carrossel genérico sobre o mesmo tema.

━━━ VARIAÇÃO ESTRUTURAL ━━━
- Comece o slide de capa de forma diferente do óbvio (não apenas "Saiba seus direitos")
- Varie o formato dos slides de conteúdo: nem todos precisam ser bullet points
- Misture afirmações, perguntas retóricas, dados numéricos e citações de lei
- O slide final pode ser resumo, checklist, alerta ou provocação reflexiva

REGRAS DE CONTEÚDO:
- Use apenas fatos reais: prazos legais, requisitos da Lei 8.213/91, dados do INSS
- PROIBIDO inventar histórias de clientes, casos fictícios ou depoimentos
- Prefira: mitos vs. realidade, erros comuns, requisitos pouco conhecidos, como agir na prática
- Seja específico: cite prazos exatos, idades, porcentagens, artigos de lei quando relevante

REGRAS OAB — PROVIMENTO 205/2021 (OBRIGATÓRIO):
- O CTA deve ser informativo, não comercial
- PROIBIDO: "fale comigo", "DM", "WhatsApp", "consulta grátis", "agende agora", "eu resolvo", "só esta semana", qualquer promessa de resultado
- PERMITIDO: "salve este post", "compartilhe com quem precisa", "siga para mais conteúdos", "procure um advogado previdenciarista", "comente sua dúvida"

Retorne SOMENTE JSON válido (sem markdown, sem \`\`\`):
{
  "headline": "headline factual e impactante, max 10 palavras",
  "tese": "o que o segurado vai aprender neste carrossel, em 1 frase",
  "slides": [
    {
      "numero": 1,
      "tipo": "capa",
      "titulo": "título com fato surpreendente ou mito comum que para o scroll",
      "subtitulo": "o que você vai descobrir neste carrossel",
      "visual": "sugestão de composição visual",
      "imagem_query": "english photo query — ONLY objects or places, NEVER people (e.g. 'justice scales marble', 'law books shelf', 'courthouse columns')"
    },
    {
      "numero": 2,
      "tipo": "conteudo",
      "titulo": "ponto educativo com dado real",
      "corpo": "explicação clara em 2-3 frases com informação verificável",
      "visual": "sugestão visual",
      "imagem_query": "english photo query — ONLY objects or places, NEVER people (e.g. 'legal documents desk', 'retirement papers calculator')"
    }
  ],
  "legenda": "legenda completa (150-200 palavras) educativa e conversacional, sem inventar histórias, sem linguagem de venda",
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7"],
  "cta_sugerido": "CTA informativo e ético conforme OAB — sem captação direta, sem promessa de resultado"
}`;
}
