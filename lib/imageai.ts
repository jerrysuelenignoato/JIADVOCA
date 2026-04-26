export function buildSlideImageUrl(prompt: string, seed: number): string {
  const safe = prompt + ", no people, no faces, no humans, abstract concept, professional photography";
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(safe)}?width=1024&height=1024&nologo=true&seed=${seed}`;
}
