import { MetadataRoute } from "next";
import { VILLES, VILLES_SECONDAIRES, METIERS_TOP_SEO, ALL_VILLES } from "@/lib/constants";
import { DEPARTEMENTS_COUVERTS } from "@/lib/seo/cities-graph";
import { MOCK_ARTISANS } from "@/lib/mock-data";
import { TRAVAUX } from "@/lib/travaux-data";
import { prisma } from "@/lib/prisma";
import { getEffectivePlan } from "@/lib/plan-gates";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bativio.fr";
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
  const baseUrl = "https://www.bativio.fr";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/rejoindre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    // inscription et connexion exclus (disallow dans robots.txt)
    { url: `${baseUrl}/facturation-electronique`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tarifs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/prix`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cgu`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const prixMetierPages: MetadataRoute.Sitemap = METIERS_SLUGS.map((metier) => ({
    url: `${baseUrl}/prix/${metier}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

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

  // Pages travaux x ville (12 travaux x 5 villes hub = 60 pages)
  const travauxVillePages: MetadataRoute.Sitemap = TRAVAUX.flatMap((t) =>
    VILLES.map((v) => ({
      url: `${baseUrl}/travaux/${t.slug}/${v.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  // Pages locales METIER_TOP_SEO x VILLE_SECONDAIRE
  // Ex: /electricien-aix-les-bains, /plombier-saint-jean-de-maurienne, etc.
  // 4 metiers prio x 35 villes secondaires = 140 pages long-tail SEO local
  const localMetierVillePages: MetadataRoute.Sitemap = METIERS_TOP_SEO.flatMap((metier) =>
    VILLES_SECONDAIRES.map((v) => ({
      url: `${baseUrl}/${metier}-${v.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6, // un peu en dessous des hubs (0.8) et metier-ville hub (0.7)
    }))
  );

  // ============================ HUBS GEO SEO ============================
  // /artisans-{ville} : 5 hub + 35 secondaires = 40 pages
  // /artisans-{departement} : 5 departements
  // /artisans-rhone-alpes : 1 page region
  const hubVillePages: MetadataRoute.Sitemap = ALL_VILLES.map((v) => ({
    url: `${baseUrl}/artisans-${v.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: "codePostal" in v && v.parentSlug === v.slug ? 0.7 : 0.5,
  }));
  const hubDepartementPages: MetadataRoute.Sitemap = DEPARTEMENTS_COUVERTS.map((d) => ({
    url: `${baseUrl}/artisans-${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  const hubRegionPage: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/artisans-rhone-alpes`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }];

  // Cluster /pro/ — landing B2B + 4 piliers + 1 glossaire + 1 comparatif + 4 satellites
  const proPages: MetadataRoute.Sitemap = [
    { p: "/pro", priority: 0.9 },
    { p: "/pro/facturation-electronique-2026", priority: 0.9 },
    { p: "/pro/plateforme-agreee-artisan", priority: 0.9 },
    { p: "/pro/facture-electronique-btp", priority: 0.9 },
    { p: "/pro/mentions-obligatoires-2026", priority: 0.9 },
    // ETAPE-SEO-05 : comparatif + glossaire + 4 satellites
    { p: "/pro/comparatif-pa", priority: 0.8 },
    { p: "/pro/glossaire", priority: 0.8 },
    { p: "/pro/sanctions-facturation-electronique", priority: 0.7 },
    { p: "/pro/factur-x-artisan", priority: 0.7 },
    { p: "/pro/devis-electronique-artisan", priority: 0.7 },
    { p: "/pro/auto-entrepreneur-batiment-2026", priority: 0.7 },
  ].map(({ p, priority }) => ({
    url: `${baseUrl}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));

  const villeMetierPages: MetadataRoute.Sitemap = VILLES_SLUGS.flatMap((ville) =>
    METIERS_SLUGS.map((metier) => ({
      url: `${baseUrl}/${ville}/${metier}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  // --- Business vitrine pages (metier-ville composite URLs) ---
  let businessCategoryPages: MetadataRoute.Sitemap = [];
  let businessVitrinePages: MetadataRoute.Sitemap = [];
  try {
    const businessArtisans = await prisma.artisan.findMany({
      where: { actif: true, visible: true, deletedAt: null, metierSlugSeo: { not: null }, villeSlug: { not: null } },
      select: { slug: true, metierSlugSeo: true, villeSlug: true, plan: true, planOverride: true, planOverrideExpireAt: true, updatedAt: true },
    });

    const biz = businessArtisans.filter((a) => getEffectivePlan(a) === "business");
    const seenCombos = new Set<string>();

    for (const a of biz) {
      if (!a.metierSlugSeo || !a.villeSlug) continue;
      const combo = `${a.metierSlugSeo}-${a.villeSlug}`;
      if (!seenCombos.has(combo)) {
        seenCombos.add(combo);
        businessCategoryPages.push({
          url: `${baseUrl}/${combo}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
      businessVitrinePages.push({
        url: `${baseUrl}/${combo}/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // Prisma may fail during build — skip silently
  }

  return [
    ...staticPages,
    ...prixMetierPages,
    ...villePages,
    ...villeMetierPages,
    ...artisanPages,
    ...travauxPages,
    ...travauxVillePages,
    ...localMetierVillePages,
    ...hubVillePages,
    ...hubDepartementPages,
    ...hubRegionPage,
    ...proPages,
    ...businessCategoryPages,
    ...businessVitrinePages,
  ];
}
