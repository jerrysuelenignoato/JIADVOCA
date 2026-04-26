export function buildCarrosselPrompt(
  area: string,
  tom: string,
  slides: number,
  extra?: string
) {
  return `Crie um carrossel de Instagram com ${slides} slides sobre "${area}".

Tom: ${tom}
${extra ? `Contexto adicional: ${extra}` : ""}

Retorne SOMENTE JSON válido (sem markdown, sem \`\`\`):
{
  "headline": "headline magnética max 10 palavras",
  "tese": "tese central em 1 frase",
  "slides": [
    {
      "numero": 1,
      "tipo": "capa",
      "titulo": "título de impacto que para o scroll",
      "subtitulo": "frase de gancho",
      "visual": "sugestão de design e elementos visuais",
      "imagem_query": "2-4 english words for a real photo (e.g. elderly woman documents office)"
    },
    {
      "numero": 2,
      "tipo": "problema",
      "titulo": "...",
      "corpo": "2-3 frases curtas e diretas",
      "visual": "...",
      "imagem_query": "2-4 english words for a real photo"
    }
  ],
  "legenda": "legenda completa para o post (150-200 palavras, tom conversacional, sem emoji excessivo)",
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7"],
  "cta_sugerido": "chamada específica para o público agir"
}`;
}
