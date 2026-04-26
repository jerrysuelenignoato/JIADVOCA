import { MetadataRoute } from "next";

const BASE_URL = process.env.APP_URL ?? "https://jiadvoca.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/precos", "/login", "/cadastro"],
        disallow: ["/dashboard", "/gerar", "/biblioteca", "/kanban", "/calendario", "/conta", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
