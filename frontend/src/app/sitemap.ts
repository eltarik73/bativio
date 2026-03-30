import { MetadataRoute } from "next";
import { VILLES } from "@/lib/constants";
import { MOCK_ARTISANS } from "@/lib/mock-data";
import { TRAVAUX } from "@/lib/travaux-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bativio.vercel.app";
const API_URL = `${SITE_URL}/api/v1`;

async function fetchActiveArtisans(): Promise<{ slug: string; ville: string; updatedAt?: string }[]> {
  try {
    const res = await fetch(`${API_URL}/public/artisans?size=500`, { cache: "no-store" });
    const json = await res.json();
    if (json.success && json.data?.content) {
      return json.data.content.map((a: { slug: string; ville: string }) => ({
        slug: a.slug,
        ville: a.ville,
      }));
    }
  } catch {
    // Fallback to mock data if API is unreachable
  }
  return [];
}

function slugifyVille(ville: string): string {
  return ville.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
}

const METIERS_SLUGS = [
  "plombier", "electricien", "peintre", "macon",
  "carreleur", "menuisier", "couvreur", "chauffagiste",
] as const;

const VILLES_SLUGS = [
  "chambery", "annecy", "grenoble", "lyon", "valence",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bativio.fr";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/rejoindre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/inscription`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/connexion`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/facturation-electronique`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tarifs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const villePages: MetadataRoute.Sitemap = VILLES.map((v) => ({
    url: `${baseUrl}/${v.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Fetch real artisans from API, merge with mock for SSG
  const apiArtisans = await fetchActiveArtisans();
  const mockArtisanPages = MOCK_ARTISANS.filter((a) => a.ville && a.slug).map((a) => ({
    slug: a.slug,
    ville: a.ville,
  }));

  const allSlugs = new Set<string>();
  const artisanEntries = [...apiArtisans, ...mockArtisanPages].filter((a) => {
    if (allSlugs.has(a.slug)) return false;
    allSlugs.add(a.slug);
    return true;
  });

  const artisanPages: MetadataRoute.Sitemap = artisanEntries.map((a) => ({
    url: `${baseUrl}/${slugifyVille(a.ville)}/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const travauxPages: MetadataRoute.Sitemap = TRAVAUX.map((t) => ({
    url: `${baseUrl}/travaux/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const villeMetierPages: MetadataRoute.Sitemap = VILLES_SLUGS.flatMap((ville) =>
    METIERS_SLUGS.map((metier) => ({
      url: `${baseUrl}/${ville}/${metier}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...villePages, ...villeMetierPages, ...artisanPages, ...travauxPages];
}
