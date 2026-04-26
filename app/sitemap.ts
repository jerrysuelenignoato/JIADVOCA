import { MetadataRoute } from "next";

const BASE_URL = process.env.APP_URL ?? "https://jiadvoca.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/precos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/cadastro`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
  ];
}
