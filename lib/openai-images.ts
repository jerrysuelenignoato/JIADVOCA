import OpenAI from "openai";

function buildPrompt(titulo: string, tema: string): string {
  return `Photorealistic cinematic scene: a worried elderly Brazilian person sitting at a cluttered wooden desk, surrounded by stacks of INSS documents, government papers, and forms. Multiple colorful sticky notes with handwritten questions pinned to the wall behind them. The scene relates to the topic: "${titulo || tema}". Warm indoor lamp light, hyper-detailed, 4K, documentary style photography. No text on the main subject's face. Realistic textures on papers and desk surface.`;
}

export async function gerarImagemIA(titulo: string, tema: string): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) return null;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: buildPrompt(titulo, tema),
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });
    return response.data?.[0]?.url ?? null;
  } catch (err) {
    console.error("[openai-images]", err);
    return null;
  }
}
