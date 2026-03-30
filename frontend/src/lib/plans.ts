export type PlanType = "GRATUIT" | "ESSENTIEL" | "PRO" | "PRO_PLUS";

export type FeatureKey =
  | "annuaire" | "vitrine" | "badge_verifie" | "qrcode" | "google_business"
  | "demande_devis" | "agenda" | "avis" | "sms"
  | "fiche_client" | "reporting" | "devis_ia" | "agent_ia"
  | "invoquo_reception" | "invoquo_depot" | "invoquo_creation";

const PLAN_FEATURES: Record<PlanType, FeatureKey[]> = {
  GRATUIT: ["annuaire", "demande_devis", "avis", "fiche_client"],
  ESSENTIEL: ["annuaire", "demande_devis", "avis", "fiche_client", "agenda", "invoquo_reception"],
  PRO: ["annuaire", "demande_devis", "avis", "fiche_client", "agenda", "invoquo_reception", "vitrine", "badge_verifie", "qrcode", "google_business", "reporting", "invoquo_depot"],
  PRO_PLUS: ["annuaire", "demande_devis", "avis", "fiche_client", "agenda", "invoquo_reception", "vitrine", "badge_verifie", "qrcode", "google_business", "reporting", "invoquo_depot", "sms", "devis_ia", "agent_ia", "invoquo_creation"],
};

export const PLAN_LIMITS: Record<PlanType, { photosMax: number; badgesMax: number; smsParMois: number; devisIaParJour: number }> = {
  GRATUIT:   { photosMax: 3,  badgesMax: 2,  smsParMois: 0,  devisIaParJour: 0 },
  ESSENTIEL: { photosMax: 10, badgesMax: -1, smsParMois: 0,  devisIaParJour: 0 },
  PRO:       { photosMax: -1, badgesMax: -1, smsParMois: 0,  devisIaParJour: 0 },
  PRO_PLUS:  { photosMax: -1, badgesMax: -1, smsParMois: 30, devisIaParJour: 10 },
};

export const FEATURE_MIN_PLAN: Record<FeatureKey, PlanType> = {
  annuaire: "GRATUIT", demande_devis: "GRATUIT", avis: "GRATUIT", fiche_client: "GRATUIT",
  agenda: "ESSENTIEL", invoquo_reception: "ESSENTIEL",
  vitrine: "PRO", badge_verifie: "PRO", qrcode: "PRO", google_business: "PRO", reporting: "PRO", invoquo_depot: "PRO",
  sms: "PRO_PLUS", devis_ia: "PRO_PLUS", agent_ia: "PRO_PLUS", invoquo_creation: "PRO_PLUS",
};

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  annuaire: "Fiche annuaire", demande_devis: "Formulaire de devis", avis: "Avis clients", fiche_client: "Fiches clients",
  agenda: "Agenda & RDV en ligne", invoquo_reception: "Réception factures",
  vitrine: "Mini-site vitrine personnalisé", badge_verifie: "Badge artisan vérifié", qrcode: "QR code vitrine", google_business: "Lien Google Business", reporting: "Reporting & statistiques", invoquo_depot: "Dépôt & transmission factures",
  sms: "SMS notifications", devis_ia: "Devis IA intelligent", agent_ia: "Agent IA répondeur", invoquo_creation: "Création de factures",
};

export const PLAN_LABELS: Record<PlanType, string> = { GRATUIT: "Gratuit", ESSENTIEL: "Essentiel", PRO: "Pro", PRO_PLUS: "Pro+" };
export const PLAN_PRICES: Record<PlanType, number> = { GRATUIT: 0, ESSENTIEL: 19, PRO: 49, PRO_PLUS: 79 };

export function hasFeature(plan: PlanType, feature: FeatureKey): boolean {
  return PLAN_FEATURES[plan]?.includes(feature) ?? false;
}

export function checkLimit(plan: PlanType, key: keyof typeof PLAN_LIMITS.GRATUIT, currentCount: number) {
  const limit = PLAN_LIMITS[plan]?.[key] ?? 0;
  if (limit === -1) return { allowed: true, limit: -1, remaining: Infinity };
  return { allowed: currentCount < limit, limit, remaining: Math.max(0, limit - currentCount) };
}

export function getRequiredPlan(feature: FeatureKey): PlanType {
  return FEATURE_MIN_PLAN[feature];
}
