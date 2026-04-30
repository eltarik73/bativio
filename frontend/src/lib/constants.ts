export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bativio.fr";
export const SITE_NAME = "Bativio";

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
  { nom: "Chambéry", slug: "chambery", codePostal: "73000", departement: "Savoie", lat: 45.5646, lng: 5.9178, parentSlug: "chambery" },
  { nom: "Annecy", slug: "annecy", codePostal: "74000", departement: "Haute-Savoie", lat: 45.8992, lng: 6.1294, parentSlug: "annecy" },
  { nom: "Grenoble", slug: "grenoble", codePostal: "38000", departement: "Isère", lat: 45.1885, lng: 5.7245, parentSlug: "grenoble" },
  { nom: "Lyon", slug: "lyon", codePostal: "69000", departement: "Rhône", lat: 45.7640, lng: 4.8357, parentSlug: "lyon" },
  { nom: "Valence", slug: "valence", codePostal: "26000", departement: "Drôme", lat: 44.9334, lng: 4.8924, parentSlug: "valence" },
] as const;

// Villes secondaires (long-tail SEO) : 35 communes Rhone-Alpes pres des hubs.
// parentSlug = ville hub la plus proche (pour le maillage interne et redirection).
// Utilisees pour generer les pages /[metier]-[ville-secondaire] (ex: /electricien-la-bridoire).
export const VILLES_SECONDAIRES = [
  // Savoie (rattachees a Chambery)
  { nom: "Aix-les-Bains", slug: "aix-les-bains", codePostal: "73100", departement: "Savoie", lat: 45.6884, lng: 5.9156, parentSlug: "chambery" },
  { nom: "Albertville", slug: "albertville", codePostal: "73200", departement: "Savoie", lat: 45.6755, lng: 6.3925, parentSlug: "chambery" },
  { nom: "Saint-Jean-de-Maurienne", slug: "saint-jean-de-maurienne", codePostal: "73300", departement: "Savoie", lat: 45.2766, lng: 6.3450, parentSlug: "chambery" },
  { nom: "Challes-les-Eaux", slug: "challes-les-eaux", codePostal: "73190", departement: "Savoie", lat: 45.5466, lng: 5.9805, parentSlug: "chambery" },
  { nom: "Bourg-Saint-Maurice", slug: "bourg-saint-maurice", codePostal: "73700", departement: "Savoie", lat: 45.6189, lng: 6.7691, parentSlug: "chambery" },
  { nom: "La Motte-Servolex", slug: "la-motte-servolex", codePostal: "73290", departement: "Savoie", lat: 45.5839, lng: 5.8794, parentSlug: "chambery" },
  { nom: "Cognin", slug: "cognin", codePostal: "73160", departement: "Savoie", lat: 45.5639, lng: 5.8856, parentSlug: "chambery" },
  { nom: "Pont-de-Beauvoisin", slug: "pont-de-beauvoisin", codePostal: "73330", departement: "Savoie", lat: 45.5358, lng: 5.6731, parentSlug: "chambery" },
  { nom: "La Bridoire", slug: "la-bridoire", codePostal: "73520", departement: "Savoie", lat: 45.5167, lng: 5.7672, parentSlug: "chambery" },
  { nom: "Yenne", slug: "yenne", codePostal: "73170", departement: "Savoie", lat: 45.7011, lng: 5.7575, parentSlug: "chambery" },
  { nom: "Les Échelles", slug: "les-echelles", codePostal: "73360", departement: "Savoie", lat: 45.4456, lng: 5.7475, parentSlug: "chambery" },
  { nom: "Novalaise", slug: "novalaise", codePostal: "73470", departement: "Savoie", lat: 45.5994, lng: 5.7836, parentSlug: "chambery" },
  // Haute-Savoie (rattachees a Annecy)
  { nom: "Annemasse", slug: "annemasse", codePostal: "74100", departement: "Haute-Savoie", lat: 46.1936, lng: 6.2367, parentSlug: "annecy" },
  { nom: "Thonon-les-Bains", slug: "thonon-les-bains", codePostal: "74200", departement: "Haute-Savoie", lat: 46.3712, lng: 6.4795, parentSlug: "annecy" },
  { nom: "Cluses", slug: "cluses", codePostal: "74300", departement: "Haute-Savoie", lat: 46.0639, lng: 6.5800, parentSlug: "annecy" },
  { nom: "Sallanches", slug: "sallanches", codePostal: "74700", departement: "Haute-Savoie", lat: 45.9389, lng: 6.6322, parentSlug: "annecy" },
  { nom: "Évian-les-Bains", slug: "evian-les-bains", codePostal: "74500", departement: "Haute-Savoie", lat: 46.4017, lng: 6.5897, parentSlug: "annecy" },
  { nom: "Rumilly", slug: "rumilly", codePostal: "74150", departement: "Haute-Savoie", lat: 45.8651, lng: 5.9461, parentSlug: "annecy" },
  { nom: "La Roche-sur-Foron", slug: "la-roche-sur-foron", codePostal: "74800", departement: "Haute-Savoie", lat: 46.0664, lng: 6.3128, parentSlug: "annecy" },
  // Isere (rattachees a Grenoble)
  { nom: "Échirolles", slug: "echirolles", codePostal: "38130", departement: "Isère", lat: 45.1457, lng: 5.7223, parentSlug: "grenoble" },
  { nom: "Saint-Martin-d'Hères", slug: "saint-martin-d-heres", codePostal: "38400", departement: "Isère", lat: 45.1819, lng: 5.7642, parentSlug: "grenoble" },
  { nom: "Voiron", slug: "voiron", codePostal: "38500", departement: "Isère", lat: 45.3658, lng: 5.5894, parentSlug: "grenoble" },
  { nom: "Bourgoin-Jallieu", slug: "bourgoin-jallieu", codePostal: "38300", departement: "Isère", lat: 45.5853, lng: 5.2725, parentSlug: "grenoble" },
  { nom: "Vienne", slug: "vienne", codePostal: "38200", departement: "Isère", lat: 45.5256, lng: 4.8744, parentSlug: "grenoble" },
  { nom: "Meylan", slug: "meylan", codePostal: "38240", departement: "Isère", lat: 45.2061, lng: 5.7833, parentSlug: "grenoble" },
  // Rhone (rattachees a Lyon)
  { nom: "Villeurbanne", slug: "villeurbanne", codePostal: "69100", departement: "Rhône", lat: 45.7667, lng: 4.8800, parentSlug: "lyon" },
  { nom: "Vénissieux", slug: "venissieux", codePostal: "69200", departement: "Rhône", lat: 45.6967, lng: 4.8867, parentSlug: "lyon" },
  { nom: "Caluire-et-Cuire", slug: "caluire-et-cuire", codePostal: "69300", departement: "Rhône", lat: 45.7950, lng: 4.8478, parentSlug: "lyon" },
  { nom: "Bron", slug: "bron", codePostal: "69500", departement: "Rhône", lat: 45.7411, lng: 4.9089, parentSlug: "lyon" },
  { nom: "Saint-Priest", slug: "saint-priest", codePostal: "69800", departement: "Rhône", lat: 45.6964, lng: 4.9461, parentSlug: "lyon" },
  { nom: "Vaulx-en-Velin", slug: "vaulx-en-velin", codePostal: "69120", departement: "Rhône", lat: 45.7775, lng: 4.9217, parentSlug: "lyon" },
  // Drome (rattachees a Valence)
  { nom: "Romans-sur-Isère", slug: "romans-sur-isere", codePostal: "26100", departement: "Drôme", lat: 45.0489, lng: 5.0517, parentSlug: "valence" },
  { nom: "Montélimar", slug: "montelimar", codePostal: "26200", departement: "Drôme", lat: 44.5556, lng: 4.7503, parentSlug: "valence" },
  { nom: "Bourg-lès-Valence", slug: "bourg-les-valence", codePostal: "26500", departement: "Drôme", lat: 44.9495, lng: 4.8946, parentSlug: "valence" },
  { nom: "Pierrelatte", slug: "pierrelatte", codePostal: "26700", departement: "Drôme", lat: 44.3750, lng: 4.7011, parentSlug: "valence" },
] as const;

// Toutes les villes (hubs + secondaires) pour le sitemap et le maillage interne.
export const ALL_VILLES = [...VILLES, ...VILLES_SECONDAIRES] as const;

// Top metiers SEO : utilises pour generer les pages /[metier]-[ville-secondaire]
// (4 metiers x 35 villes = 140 pages long-tail SEO).
// Choix : metiers les plus recherches en construction/renovation residentielle.
export const METIERS_TOP_SEO = ["plombier", "electricien", "peintre", "macon"] as const;

export const METIERS = [
  // GROS OEUVRE
  { nom: "Maçon", slug: "macon", icone: "\u{1F9F1}", categorie: "gros_oeuvre" },
  { nom: "Couvreur", slug: "couvreur", icone: "\u{1F3E0}", categorie: "gros_oeuvre" },
  { nom: "Charpentier", slug: "charpentier", icone: "\u{1FAB5}", categorie: "gros_oeuvre" },
  { nom: "Terrassier", slug: "terrassier", icone: "\u{1F69C}", categorie: "gros_oeuvre" },
  { nom: "Démolition", slug: "demolition", icone: "\u{1F528}", categorie: "gros_oeuvre" },
  // SECOND OEUVRE
  { nom: "Plombier", slug: "plombier", icone: "\u{1F527}", categorie: "second_oeuvre" },
  { nom: "Électricien", slug: "electricien", icone: "⚡", categorie: "second_oeuvre" },
  { nom: "Peintre", slug: "peintre", icone: "\u{1F3A8}", categorie: "second_oeuvre" },
  { nom: "Carreleur", slug: "carreleur", icone: "\u{1F532}", categorie: "second_oeuvre" },
  { nom: "Menuisier", slug: "menuisier", icone: "\u{1FA9A}", categorie: "second_oeuvre" },
  { nom: "Chauffagiste", slug: "chauffagiste", icone: "\u{1F525}", categorie: "second_oeuvre" },
  { nom: "Plâtrier", slug: "platrier", icone: "\u{1F3D7}\uFE0F", categorie: "second_oeuvre" },
  { nom: "Solier", slug: "solier", icone: "\u{1F7EB}", categorie: "second_oeuvre" },
  { nom: "Vitrier", slug: "vitrier", icone: "\u{1FA9F}", categorie: "second_oeuvre" },
  { nom: "Isolation", slug: "isolation", icone: "\u{1F9E4}", categorie: "second_oeuvre" },
  // SPECIALITES
  { nom: "Serrurier", slug: "serrurier", icone: "\u{1F511}", categorie: "specialites" },
  { nom: "Cuisiniste", slug: "cuisiniste", icone: "\u{1F373}", categorie: "specialites" },
  { nom: "Paysagiste", slug: "paysagiste", icone: "\u{1F33F}", categorie: "specialites" },
  { nom: "Pisciniste", slug: "pisciniste", icone: "\u{1F3CA}", categorie: "specialites" },
  { nom: "Domoticien", slug: "domoticien", icone: "\u{1F4F1}", categorie: "specialites" },
  { nom: "Alarme", slug: "alarme", icone: "\u{1F514}", categorie: "specialites" },
  { nom: "Ramoneur", slug: "ramoneur", icone: "\u{1FA88}", categorie: "specialites" },
  // EXTERIEUR
  { nom: "Clôturiste", slug: "cloturiste", icone: "\u{1F6A7}", categorie: "exterieur" },
  { nom: "Aménagement extérieur", slug: "paysagiste-ext", icone: "\u{1F3E1}", categorie: "exterieur" },
  { nom: "Assainissement", slug: "assainissement", icone: "\u{1F6B0}", categorie: "exterieur" },
  { nom: "Étanchéité", slug: "etancheite", icone: "\u{1F4A7}", categorie: "exterieur" },
  // AUTRE
  { nom: "Autre", slug: "autre", icone: "\u{1F6E0}\uFE0F", categorie: "autre" },
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
