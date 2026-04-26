export async function buscarImagemUnsplash(query: string): Promise<string | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  try {
    const safeQuery = query + " no people";
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(safeQuery)}&per_page=5&orientation=squarish&content_filter=high`;
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${key}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const results: { urls: { regular: string } }[] = data.results ?? [];
    if (results.length === 0) return null;
    const pick = results[Math.floor(Math.random() * results.length)];
    return pick.urls?.regular ?? null;
  } catch {
    return null;
  }
}
