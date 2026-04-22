/**
 * Mapping métier slug → Schema.org spécifique LocalBusiness sub-type.
 * Critical SEO 2026 : utiliser le sous-type le plus précis pour rich snippets.
 * @see https://schema.org/LocalBusiness
 */
export const METIER_TO_SCHEMA_TYPE: Record<string, string> = {
  plombier: "Plumber",
  electricien: "Electrician",
  peintre: "HousePainter",
  carreleur: "GeneralContractor", // schema n'a pas Tiler — Contractor
  macon: "GeneralContractor",
  menuisier: "GeneralContractor",
  couvreur: "RoofingContractor",
  chauffagiste: "HVACBusiness",
  serrurier: "Locksmith",
  cuisiniste: "HomeAndConstructionBusiness",
  jardinier: "LandscapeGardenSupplier",
};

/**
 * Retourne le type Schema.org pour un slug métier (fallback LocalBusiness).
 */
export function getSchemaTypeForMetier(metierSlug: string | null | undefined): string {
  if (!metierSlug) return "LocalBusiness";
  return METIER_TO_SCHEMA_TYPE[metierSlug.toLowerCase()] || "LocalBusiness";
}
