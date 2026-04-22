import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Règle générale (Google, Bing, Yandex, etc.)
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/admin/",
          "/api/",
          "/devis/", // anciennes URLs partage
          "/d/", // pages partage devis privées (token unique)
          "/connexion",
          "/inscription",
          "/onboarding/",
          "/onboarding", // sans trailing slash
          "/dashboard", // strict
          "/admin", // strict
        ],
      },
      // Bots IA — autorisés (acquisition via LLMs Claude, ChatGPT, Perplexity, Gemini)
      // Permet à Bativio d'apparaître dans les réponses des LLMs (canal 2026 majeur)
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot"],
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/d/", "/devis/"],
      },
      {
        userAgent: ["ClaudeBot", "Claude-Web", "anthropic-ai"],
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/d/", "/devis/"],
      },
      {
        userAgent: ["PerplexityBot", "Perplexity-User"],
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/d/", "/devis/"],
      },
      {
        userAgent: ["Google-Extended", "GoogleOther", "Applebot-Extended"],
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/d/", "/devis/"],
      },
      // Bots scraping agressifs / non-utiles SEO — bloqués
      {
        userAgent: ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "PetalBot"],
        disallow: "/",
      },
    ],
    sitemap: "https://www.bativio.fr/sitemap.xml",
    host: "https://www.bativio.fr",
  };
}
