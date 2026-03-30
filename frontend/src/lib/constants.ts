export const COLORS = {
  terre: "#C4531A",
  terreLight: "#D4733A",
  terreDark: "#a3440f",
  anthracite: "#1C1C1E",
  anthraciteLight: "#2C2C2E",
  or: "#E8A84C",
  creme: "#FAF8F5",
  blanc: "#FFFFFF",
} as const;

export const VILLES = [
  { nom: "Chambéry", slug: "chambery", codePostal: "73000", departement: "Savoie", lat: 45.5646, lng: 5.9178 },
  { nom: "Annecy", slug: "annecy", codePostal: "74000", departement: "Haute-Savoie", lat: 45.8992, lng: 6.1294 },
  { nom: "Grenoble", slug: "grenoble", codePostal: "38000", departement: "Isère", lat: 45.1885, lng: 5.7245 },
  { nom: "Lyon", slug: "lyon", codePostal: "69000", departement: "Rhône", lat: 45.7640, lng: 4.8357 },
  { nom: "Valence", slug: "valence", codePostal: "26000", departement: "Drôme", lat: 44.9334, lng: 4.8924 },
] as const;

export const METIERS = [
  { nom: "Plombier", slug: "plombier", icone: "\u{1F527}" },
  { nom: "Électricien", slug: "electricien", icone: "⚡" },
  { nom: "Peintre", slug: "peintre", icone: "\u{1F3A8}" },
  { nom: "Maçon", slug: "macon", icone: "\u{1F9F1}" },
  { nom: "Carreleur", slug: "carreleur", icone: "\u{1F532}" },
  { nom: "Menuisier", slug: "menuisier", icone: "\u{1FA9A}" },
  { nom: "Couvreur", slug: "couvreur", icone: "\u{1F3E0}" },
  { nom: "Chauffagiste", slug: "chauffagiste", icone: "\u{1F525}" },
  { nom: "Serrurier", slug: "serrurier", icone: "\u{1F511}" },
  { nom: "Cuisiniste", slug: "cuisiniste", icone: "\u{1F373}" },
] as const;

export type PlanId = "GRATUIT" | "STARTER" | "PRO" | "BUSINESS";

export interface PlanFeature {
  nom: string;
  gratuit: boolean | string;
  starter: boolean | string;
  pro: boolean | string;
  business: boolean | string;
}

export const PLANS = [
  {
    id: "GRATUIT" as PlanId,
    nom: "Gratuit",
    prix: 0,
    description: "Testez Bativio et commencez à facturer gratuitement",
    features: [
      "Fiche annuaire",
      "Réception demandes de devis",
      "3 photos chantiers",
    ],
  },
  {
    id: "STARTER" as PlanId,
    nom: "Starter",
    prix: 19,
    description: "Votre présence en ligne et facturation illimitée, en conformité",
    features: [
      "Fiche annuaire optimisée",
      "10 photos chantiers",
      "Badges qualifications illimités",
      "Factures + devis illimités",
      "Réception PA",
      "Émission PA",
      "E-reporting automatique",
      "Support email",
    ],
  },
  {
    id: "PRO" as PlanId,
    nom: "Pro",
    prix: 39,
    populaire: true,
    description: "Votre site internet pro + CRM pour gagner des clients",
    features: [
      "Site internet Bativio personnalisé",
      "Avis clients vérifiés",
      "Relances devis automatiques",
      "Agenda & RDV en ligne",
      "CRM clients",
      "Photos illimitées",
      "Export comptable (FEC)",
      "Support prioritaire",
    ],
  },
  {
    id: "BUSINESS" as PlanId,
    nom: "Business",
    prix: 59,
    description: "L'IA et le SEO travaillent pour vous",
    features: [
      "Tout Pro inclus",
      "SEO local optimisé",
      "Mise en avant dans l'annuaire",
      "Stats CA + conversion",
      "SMS notifications",
      "Devis IA automatisé",
      "Agent IA répondeur",
      "Reporting intelligent",
    ],
  },
] as const;

export const SITE_NAME = "Bativio";
export const SITE_URL = "https://bativio.fr";
export const SITE_DESCRIPTION =
  "Trouvez les meilleurs artisans du bâtiment près de chez vous. Plombier, électricien, peintre, maçon... Comparez, contactez, zéro commission.";
