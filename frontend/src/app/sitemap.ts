import { MetadataRoute } from "next";
import { VILLES } from "@/lib/constants";
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
      return json.data.content.map((a: { slug: string; ville: string; updatedAt?: string }) => ({
        slug: a.slug,
        ville: a.ville,
        updatedAt: a.updatedAt,
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

// Dernière mise à jour SIGNIFICATIVE du contenu de chaque page statique.
// Bumper manuellement quand un contenu change (refonte SEO, nouvel article…).
// Utiliser `new Date()` à chaque génération est un mauvais signal pour Google :
// les sitemaps qui mentent sur leur fraîcheur sont devalués au crawl. La doc
// Google : "Setting <lastmod> too aggressively hurts crawl efficiency."
const SITE_LAST_REFONTE = new Date("2026-05-01"); // refonte SEO/GEO 2026
const GUIDES_LAST_UPDATE = new Date("2026-04-22");
const TARIFS_LAST_UPDATE = new Date("2026-05-01"); // H1 + refonte
const VILLES_LAST_UPDATE = new Date("2026-05-01"); // VilleSeoSection

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.bativio.fr";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: SITE_LAST_REFONTE, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/rejoindre`, lastModified: SITE_LAST_REFONTE, changeFrequency: "monthly", priority: 0.7 },
    // inscription et connexion exclus (disallow dans robots.txt)
    { url: `${baseUrl}/facturation-electronique`, lastModified: SITE_LAST_REFONTE, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tarifs`, lastModified: TARIFS_LAST_UPDATE, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/prix`, lastModified: TARIFS_LAST_UPDATE, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/a-propos`, lastModified: SITE_LAST_REFONTE, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date("2026-04-21"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cgu`, lastModified: new Date("2026-04-21"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/comparatif/pagesjaunes`, lastModified: new Date("2026-04-15"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/comparatif/habitatpresto`, lastModified: new Date("2026-04-15"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/comparatif/starofservice`, lastModified: new Date("2026-04-15"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/comparatif/obat`, lastModified: new Date("2026-04-15"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/comparatif/tolteck`, lastModified: new Date("2026-04-15"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date("2026-04-15"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/urgence`, lastModified: SITE_LAST_REFONTE, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/maprimerenov`, lastModified: SITE_LAST_REFONTE, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/metiers`, lastModified: new Date("2026-04-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/contact`, lastModified: new Date("2026-04-15"), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/guides`, lastModified: GUIDES_LAST_UPDATE, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/guides/trouver-bon-artisan`, lastModified: GUIDES_LAST_UPDATE, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/guides/prix-renovation-salle-bain`, lastModified: GUIDES_LAST_UPDATE, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/guides/maprimerenov-demarches`, lastModified: GUIDES_LAST_UPDATE, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/plan-du-site`, lastModified: SITE_LAST_REFONTE, changeFrequency: "weekly", priority: 0.4 },
  ];

  const prixMetierPages: MetadataRoute.Sitemap = METIERS_SLUGS.map((metier) => ({
    url: `${baseUrl}/prix/${metier}`,
    lastModified: TARIFS_LAST_UPDATE,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const villePages: MetadataRoute.Sitemap = VILLES.map((v) => ({
    url: `${baseUrl}/${v.slug}`,
    lastModified: VILLES_LAST_UPDATE,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Fetch real artisans from API, merge with mock for SSG
  const apiArtisans = await fetchActiveArtisans();
  const mockArtisanPages: { slug: string; ville: string; updatedAt?: string }[] =
    MOCK_ARTISANS.filter((a) => a.ville && a.slug).map((a) => ({
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
    // Si l'API renvoie updatedAt (artisans réels), on l'utilise — sinon
    // fallback sur la date de la dernière refonte (cas mocks).
    lastModified: a.updatedAt ? new Date(a.updatedAt) : SITE_LAST_REFONTE,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const travauxPages: MetadataRoute.Sitemap = TRAVAUX.map((t) => ({
    url: `${baseUrl}/travaux/${t.slug}`,
    lastModified: GUIDES_LAST_UPDATE,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const villeMetierPages: MetadataRoute.Sitemap = VILLES_SLUGS.flatMap((ville) =>
    METIERS_SLUGS.map((metier) => ({
      url: `${baseUrl}/${ville}/${metier}`,
      lastModified: VILLES_LAST_UPDATE,
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
          // Tient compte de la fraîcheur réelle du business artisan
          // (updatedAt) au lieu d'une fausse "modif maintenant".
          lastModified: a.updatedAt || VILLES_LAST_UPDATE,
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

  return [...staticPages, ...prixMetierPages, ...villePages, ...villeMetierPages, ...artisanPages, ...travauxPages, ...businessCategoryPages, ...businessVitrinePages];
}
