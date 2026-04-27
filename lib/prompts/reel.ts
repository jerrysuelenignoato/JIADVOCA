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

REGRAS OAB — PROVIMENTO 205/2021 (OBRIGATÓRIO):
- O CTA do reel deve ser informativo, não comercial
- PROIBIDO: "me chama no WhatsApp", "manda DM", "consulta grátis", "agende agora", "eu resolvo seu caso", "só esta semana", qualquer promessa de resultado ou captação direta
- PERMITIDO: "salva esse vídeo", "compartilha com quem precisa saber disso", "me segue para mais conteúdos", "procura um advogado previdenciarista para avaliar seu caso", "comenta aqui sua dúvida"
- O gancho deve parar o scroll com uma informação ou dado, não com apelo emocional manipulativo

Retorne SOMENTE JSON válido:
{
  "headline": "headline educativa e impactante",
  "tese": "o que o segurado vai aprender, em 1 frase",
  "roteiro": {
    "gancho": {"texto": "fato surpreendente ou mito comum que para o scroll imediatamente", "duracao": "0-3s", "tipo_visual": "fala direta câmera | texto na tela"},
    "problema": {"texto": "por que esse assunto importa — consequência real de não saber", "duracao": "3-12s", "tipo_visual": "..."},
    "desenvolvimento": {"texto": "3 pontos educativos com dados reais, ritmados e objetivos", "duracao": "12-45s", "tipo_visual": "..."},
    "prova": {"texto": "dado concreto, artigo de lei ou estatística que valida o conteúdo", "duracao": "45-53s", "tipo_visual": "..."},
    "cta": {"texto": "CTA informativo e ético conforme OAB — sem captação direta, sem promessa de resultado", "duracao": "53-60s", "tipo_visual": "..."}
  },
  "legenda": "legenda completa educativa e conversacional, sem inventar histórias, sem linguagem de venda",
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7"],
  "trilha_sugerida": "tipo de áudio que combina (trending lo-fi | piano emocional | beat moderno)"
}`;
}
