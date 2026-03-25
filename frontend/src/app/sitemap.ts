import { MetadataRoute } from "next";
import { VILLES } from "@/lib/constants";
import { MOCK_ARTISANS } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bativio.fr";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/inscription`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/connexion`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const villePages: MetadataRoute.Sitemap = VILLES.map((v) => ({
    url: `${baseUrl}/${v.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const artisanPages: MetadataRoute.Sitemap = MOCK_ARTISANS.map((a) => {
    const villeSlug = a.ville.toLowerCase().replace(/[^a-z]/g, "");
    return {
      url: `${baseUrl}/${villeSlug}/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  return [...staticPages, ...villePages, ...artisanPages];
}
