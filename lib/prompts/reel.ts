export function buildReelPrompt(
  area: string,
  tom: string,
  duracao: number,
  extra?: string
) {
  return `Crie um roteiro de Reel de Instagram com ${duracao} segundos sobre "${area}".

Tom: ${tom}
${extra ? `Contexto adicional: ${extra}` : ""}

Retorne SOMENTE JSON válido:
{
  "headline": "headline magnética",
  "tese": "tese central em 1 frase",
  "roteiro": {
    "gancho": {"texto": "primeira frase que para o scroll", "duracao": "0-3s", "tipo_visual": "fala direta câmera | b-roll | texto na tela"},
    "problema": {"texto": "identificação clara da dor", "duracao": "3-12s", "tipo_visual": "..."},
    "desenvolvimento": {"texto": "conteúdo principal — 3 pontos ritmados", "duracao": "12-45s", "tipo_visual": "..."},
    "prova": {"texto": "exemplo real ou dado validador", "duracao": "45-53s", "tipo_visual": "..."},
    "cta": {"texto": "chamada para ação específica", "duracao": "53-60s", "tipo_visual": "..."}
  },
  "legenda": "legenda completa do post",
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7"],
  "trilha_sugerida": "tipo de áudio que combina (trending lo-fi | piano emocional | beat moderno)"
}`;
}
