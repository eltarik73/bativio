/**
 * Voisinage geographique entre villes Bativio (calcul depuis lat/lng deja
 * dans constants.ts via getVillesProches).
 *
 * Utilise pour le maillage interne : section "Voir aussi" sur les pages
 * villes hub, listings metier-ville, vitrines artisans.
 *
 * Strategie SEO : eviter la cannibalisation entre /chambery et /aix-les-bains
 * en explicitant les liens entre villes proches geographiquement.
 */
import { ALL_VILLES, getVillesProches } from "@/lib/constants";

/**
 * Pour chaque ville (hub + secondaire), retourne les N villes les plus proches.
 * Retourne un objet plat pour serialisation simple.
 */
export function buildCityNeighbors(n = 6): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const v of ALL_VILLES) {
    result[v.slug] = getVillesProches(v.slug, n).map((vp) => vp.slug);
  }
  return result;
}

/**
 * Cache module-level (les coords ne changent pas au runtime).
 */
let _cache: Record<string, string[]> | null = null;
export function getCityNeighbors(slug: string, n = 6): string[] {
  if (!_cache) _cache = buildCityNeighbors(n);
  return _cache[slug] || [];
}

/**
 * Mapping ville -> departement pour les hubs departementaux.
 * Source : constants.ts (champ "departement" sur chaque ville).
 */
export const DEPARTEMENT_BY_SLUG: Record<string, { name: string; code: string; slug: string }> = {};
for (const v of ALL_VILLES) {
  if (!v.departement) continue;
  const slug = v.departement
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const code = ({
    "Savoie": "73",
    "Haute-Savoie": "74",
    "Isère": "38",
    "Rhône": "69",
    "Drôme": "26",
  } as Record<string, string>)[v.departement] || "";
  DEPARTEMENT_BY_SLUG[v.slug] = { name: v.departement, code, slug };
}

/**
 * Liste tous les villes d'un departement donne (par slug "savoie", etc.).
 */
export function getVillesByDepartementSlug(departementSlug: string): typeof ALL_VILLES {
  return ALL_VILLES.filter((v) => DEPARTEMENT_BY_SLUG[v.slug]?.slug === departementSlug);
}

/**
 * Departements couverts par Bativio (avec hub ville hub).
 */
export const DEPARTEMENTS_COUVERTS: { slug: string; name: string; code: string; chefLieu: string; chefLieuSlug: string }[] = [
  { slug: "savoie", name: "Savoie", code: "73", chefLieu: "Chambéry", chefLieuSlug: "chambery" },
  { slug: "haute-savoie", name: "Haute-Savoie", code: "74", chefLieu: "Annecy", chefLieuSlug: "annecy" },
  { slug: "isere", name: "Isère", code: "38", chefLieu: "Grenoble", chefLieuSlug: "grenoble" },
  { slug: "rhone", name: "Rhône", code: "69", chefLieu: "Lyon", chefLieuSlug: "lyon" },
  { slug: "drome", name: "Drôme", code: "26", chefLieu: "Valence", chefLieuSlug: "valence" },
];

/**
 * Departements pas encore couverts (pour CTA "inscrivez-vous").
 */
export const DEPARTEMENTS_BIENTOT: { slug: string; name: string; code: string }[] = [
  { slug: "ain", name: "Ain", code: "01" },
  { slug: "loire", name: "Loire", code: "42" },
  { slug: "ardeche", name: "Ardèche", code: "07" },
];
