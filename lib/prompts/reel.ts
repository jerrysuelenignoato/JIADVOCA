export function buildReelPrompt(
  area: string,
  tom: string,
  duracao: number,
  extra?: string
) {
  return `Crie um roteiro de Reel educativo de Instagram com ${duracao} segundos sobre "${area}".

Tom: ${tom}
${extra ? `Contexto adicional: ${extra}` : ""}

REGRAS DE CONTEÚDO:
- Use apenas fatos reais: prazos legais, requisitos da Lei 8.213/91, dados do INSS
- PROIBIDO inventar histórias de clientes, casos fictícios ou depoimentos fabricados
- Prefira: revelar um dado surpreendente, desmistificar um erro comum, explicar um requisito mal compreendido
- Seja específico: cite prazos, idades, porcentagens, artigos quando relevante

Retorne SOMENTE JSON válido:
{
  "headline": "headline educativa e impactante",
  "tese": "o que o segurado vai aprender, em 1 frase",
  "roteiro": {
    "gancho": {"texto": "fato surpreendente ou mito comum que para o scroll imediatamente", "duracao": "0-3s", "tipo_visual": "fala direta câmera | texto na tela"},
    "problema": {"texto": "por que esse assunto importa — consequência real de não saber", "duracao": "3-12s", "tipo_visual": "..."},
    "desenvolvimento": {"texto": "3 pontos educativos com dados reais, ritmados e objetivos", "duracao": "12-45s", "tipo_visual": "..."},
    "prova": {"texto": "dado concreto, artigo de lei ou estatística que valida o conteúdo", "duracao": "45-53s", "tipo_visual": "..."},
    "cta": {"texto": "chamada acionável específica", "duracao": "53-60s", "tipo_visual": "..."}
  },
  "legenda": "legenda completa educativa e conversacional, sem inventar histórias",
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7"],
  "trilha_sugerida": "tipo de áudio que combina (trending lo-fi | piano emocional | beat moderno)"
}`;
}
