/**
 * Codes NAF (Nomenclature d'Activités Française) éligibles au catalogue Bativio.
 * Whitelist basée sur les divisions 41 (Construction de bâtiments),
 * 42 (Génie civil), 43 (Travaux de construction spécialisés)
 * + quelques codes annexes pertinents (paysage, ferronnerie, etc.).
 *
 * Un artisan avec un code NAF hors whitelist est créé avec artisanStatus =
 * PENDING_NAF_REVIEW et actif = false. Il doit être validé manuellement
 * par un admin avant d'apparaître dans l'annuaire public.
 */

const NAF_BTP_WHITELIST = new Set<string>([
  // Section F — Construction
  // Division 41 — Construction de bâtiments
  "41.10A", "41.10B", "41.10C", "41.10D", "41.10Z",
  "41.20A", "41.20B",

  // Division 42 — Génie civil
  "42.11Z", "42.12Z", "42.13A", "42.13B",
  "42.21Z", "42.22Z",
  "42.91Z", "42.99Z",

  // Division 43 — Travaux de construction spécialisés
  "43.11Z", // Démolition
  "43.12A", "43.12B", // Terrassement
  "43.13Z", // Forages et sondages
  "43.21A", "43.21B", // Installation électrique
  "43.22A", // Plomberie / chauffage
  "43.22B", // Climatisation
  "43.29A", "43.29B", // Isolation, autres installations
  "43.31Z", // Plâtrerie
  "43.32A", "43.32B", "43.32C", // Menuiserie (bois, métal, PVC/alu)
  "43.33Z", // Revêtement sols / murs
  "43.34Z", // Peinture et vitrerie
  "43.39Z", // Autres finitions
  "43.91A", "43.91B", // Couverture, charpente
  "43.99A", "43.99B", "43.99C", "43.99D", "43.99E", // Autres travaux spécialisés

  // Section N — Services (paysagisme)
  "81.30Z", // Services d'aménagement paysager
  "81.22Z", // Nettoyage industriel (ravalement)
  "81.29A", "81.29B", // Nettoyage façades

  // Division 23 — Fabrication carrelage, ferronnerie
  "23.31Z", // Carreaux céramiques
  "25.12Z", // Portes et fenêtres métal
  "25.61Z", // Traitement et revêtement métaux (ferronnerie)
  "25.62A", "25.62B", // Mécanique générale
  "25.71Z", // Coutellerie
  "25.72Z", // Serrurerie
  "25.93Z", // Ressorts / ferronnerie

  // Division 16 — Menuiserie bois
  "16.23Z", // Charpente bois
  "16.22Z", // Parquets assemblés

  // Cuisinistes / agencement
  "31.02Z", // Meubles de cuisine
  "31.09A", "31.09B", // Autres meubles
]);

export function isNafBtp(codeNaf: string | null | undefined): boolean {
  if (!codeNaf) return false;
  // Normalize : uppercase + remove spaces/dots variations
  const normalized = codeNaf.trim().toUpperCase().replace(/\s+/g, "");
  return NAF_BTP_WHITELIST.has(normalized);
}

export function getNafBtpLabel(codeNaf: string | null | undefined): string {
  if (!codeNaf) return "Inconnu";
  const normalized = codeNaf.trim().toUpperCase().replace(/\s+/g, "");
  const prefix = normalized.split(".")[0];
  if (prefix === "41") return "Construction de bâtiments";
  if (prefix === "42") return "Génie civil";
  if (prefix === "43") return "Travaux de construction spécialisés";
  if (prefix === "81") return "Services (paysagisme / nettoyage)";
  if (prefix === "23") return "Fabrication (céramiques)";
  if (prefix === "25") return "Métallurgie / ferronnerie";
  if (prefix === "16") return "Menuiserie bois";
  if (prefix === "31") return "Meubles / agencement";
  return "Autre";
}
