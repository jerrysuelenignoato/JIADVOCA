export async function buscarImagemUnsplash(query: string): Promise<string | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const results: { urls: { regular: string } }[] = data.results ?? [];
    if (results.length === 0) return null;
    const pick = results[Math.floor(Math.random() * Math.min(3, results.length))];
    return pick.urls?.regular ?? null;
  } catch {
    return null;
  }
}
