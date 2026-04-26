export function buildCarrosselPrompt(
  area: string,
  tom: string,
  slides: number,
  extra?: string
) {
  return `Crie um carrossel educativo de Instagram com ${slides} slides sobre "${area}".

Tom: ${tom}
${extra ? `Contexto adicional: ${extra}` : ""}

REGRAS DE CONTEÚDO:
- Use apenas fatos reais: prazos legais, requisitos da Lei 8.213/91, dados do INSS
- PROIBIDO inventar histórias de clientes, casos fictícios ou depoimentos
- Prefira: mitos vs. realidade, erros comuns, requisitos pouco conhecidos, como agir na prática
- Seja específico: cite prazos exatos, idades, porcentagens, artigos de lei quando relevante

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
  "legenda": "legenda completa (150-200 palavras) educativa e conversacional, sem inventar histórias",
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7"],
  "cta_sugerido": "chamada acionável específica para o público"
}`;
}
