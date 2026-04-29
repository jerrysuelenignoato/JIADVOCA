const ANGULOS_REEL = [
  "mito derrubado — comece afirmando que a crença mais comum sobre esse tema está errada",
  "revelação de dado — abra com número real que choca e explique o que ele significa",
  "erro fatal — mostre o erro que faz o segurado perder o benefício sem perceber",
  "passo a passo urgente — ensine o que fazer agora mesmo em situação específica",
  "comparativo direto — explique a diferença entre dois conceitos ou benefícios confundidos",
  "pergunta que todo mundo tem — responda a dúvida mais buscada sobre o tema",
  "artigo de lei traduzido — cite o texto da lei e explique palavra por palavra",
  "quem tem e quem não tem — critérios claros com exemplos opostos",
  "prazo crítico — alerte sobre prazo legal que quase ninguém conhece",
  "caso hipotético anônimo — crie personagem fictício para ilustrar a situação",
  "antes e depois da reforma — contraste a regra antiga com a nova de forma visual",
  "o que o INSS não te conta — informação real que o sistema não divulga ativamente",
  "documentos que salvam ou afundam — liste os documentos mais ignorados",
  "recurso possível — explique que é possível recorrer e como iniciar",
  "valor real — revele quanto o segurado recebe e como é calculado",
] as const;

function angulo(): string {
  return ANGULOS_REEL[Math.floor(Math.random() * ANGULOS_REEL.length)];
}

export function buildReelPrompt(
  area: string,
  tom: string,
  duracao: number,
  extra?: string
) {
  const anguloEscolhido = angulo();

  return `Crie um roteiro de Reel educativo de Instagram com ${duracao} segundos sobre "${area}".

Tom: ${tom}
${extra ? `Contexto adicional: ${extra}` : ""}

━━━ ÂNGULO OBRIGATÓRIO DESTA GERAÇÃO ━━━
${anguloEscolhido}
Este ângulo DEVE definir o gancho, a estrutura e a conclusão do reel.
Mesmo que o tema seja repetido, o conteúdo deve ser completamente diferente por causa deste ângulo.

━━━ VARIAÇÃO ESTRUTURAL ━━━
- O gancho não pode começar sempre com "Você sabia que...". Use variedade:
  → Afirmação direta: "A maioria das pessoas perde esse benefício por causa de um único erro."
  → Pergunta específica: "Você tem 65 anos e nunca contribuiu? Existe um benefício para você."
  → Dado chocante: "Mais de 2 milhões de brasileiros têm direito ao BPC e nunca solicitaram."
  → Contraponto: "O INSS negou? Isso não significa que você não tem direito."
- Varie o ritmo: alguns reels são mais cadenciados, outros são urgentes e diretos
- A prova pode ser um artigo de lei, uma estatística ou uma comparação concreta

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
