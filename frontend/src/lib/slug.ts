/**
 * Slugifie une chaîne pour les URLs SEO.
 * "Chambéry" → "chambery"
 * "Aix-les-Bains" → "aix-les-bains"
 * "Réparation téléphone" → "reparation-telephone"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Génère le slug métier-ville pour l'URL SEO vitrine.
 * ("Réparation téléphone", "Chambéry") → "reparation-telephone-chambery"
 */
export function metierVilleSlug(metier: string, ville: string): string {
  return `${slugify(metier)}-${slugify(ville)}`;
}
