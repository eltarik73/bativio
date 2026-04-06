// Plan IDs — supports both old (GRATUIT/ESSENTIEL/PRO/PRO_PLUS) and new (gratuit/starter/pro/business)
export type PlanId = "gratuit" | "starter" | "pro" | "business";

// Map old plan names to new ones
export function normalizePlan(plan: string): PlanId {
  const map: Record<string, PlanId> = {
    GRATUIT: "gratuit", gratuit: "gratuit",
    ESSENTIEL: "starter", STARTER: "starter", starter: "starter",
    PRO: "pro", pro: "pro",
    PRO_PLUS: "business", BUSINESS: "business", business: "business",
  };
  return map[plan] || "gratuit";
}

const PLAN_HIERARCHY: PlanId[] = ["gratuit", "starter", "pro", "business"];

export function hasAccess(userPlan: string, requiredPlan: PlanId): boolean {
  const normalized = normalizePlan(userPlan);
  return PLAN_HIERARCHY.indexOf(normalized) >= PLAN_HIERARCHY.indexOf(requiredPlan);
}

export const PLAN_LIMITS = {
  gratuit: {
    maxMetiers: 1, maxInvoicesPerMonth: 5, maxPhotos: 3, hasPA: false, hasSiteVitrine: false,
    hasCRM: false, hasIA: false, hasSEO: false, hasFEC: false, maxBadges: 2, smsPerMonth: 0,
  },
  starter: {
    maxMetiers: 2, maxInvoicesPerMonth: Infinity, maxPhotos: 10, hasPA: true, hasSiteVitrine: false,
    hasCRM: false, hasIA: false, hasSEO: false, hasFEC: false, maxBadges: Infinity, smsPerMonth: 0,
  },
  pro: {
    maxMetiers: 3, maxInvoicesPerMonth: Infinity, maxPhotos: Infinity, hasPA: true, hasSiteVitrine: true,
    hasCRM: true, hasIA: false, hasSEO: false, hasFEC: true, maxBadges: Infinity, smsPerMonth: 0,
  },
  business: {
    maxMetiers: 5, maxInvoicesPerMonth: Infinity, maxPhotos: Infinity, hasPA: true, hasSiteVitrine: true,
    hasCRM: true, hasIA: true, hasSEO: true, hasFEC: true, maxBadges: Infinity, smsPerMonth: 50,
  },
} as const;

export const PLAN_LABELS: Record<PlanId, string> = {
  gratuit: "Gratuit", starter: "Starter", pro: "Pro", business: "Business",
};

export const PLAN_PRICES: Record<PlanId, number> = {
  gratuit: 0, starter: 19, pro: 39, business: 59,
};

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[normalizePlan(plan)];
}

// Effective plan = max(planStripe, planOverride)
export function getEffectivePlan(artisan: {
  plan: string;
  planOverride?: string | null;
  planOverrideExpireAt?: Date | string | null;
}): PlanId {
  const stripePlan = normalizePlan(artisan.plan || "GRATUIT");

  if (!artisan.planOverride) return stripePlan;

  // Check expiration
  if (artisan.planOverrideExpireAt) {
    const expiry = new Date(artisan.planOverrideExpireAt);
    if (new Date() > expiry) return stripePlan;
  }

  const overridePlan = normalizePlan(artisan.planOverride);
  const stripeLevel = PLAN_HIERARCHY.indexOf(stripePlan);
  const overrideLevel = PLAN_HIERARCHY.indexOf(overridePlan);

  return PLAN_HIERARCHY[Math.max(stripeLevel, overrideLevel)];
}

// ─── Dashboard module gating ───────────────────────────────────────

export type DashboardModuleId =
  | "tableau-de-bord" | "profil" | "photos" | "abonnement" | "parametres"
  | "devis" | "demandes" | "agenda" | "facturation" | "tarifs" | "vitrine" | "devis-ia";

interface DashboardModuleConfig {
  requiredPlan: PlanId;
  label: string;
}

export const DASHBOARD_MODULES: Record<string, DashboardModuleConfig> = {
  "tableau-de-bord": { requiredPlan: "gratuit", label: "Tableau de bord" },
  profil:       { requiredPlan: "gratuit",  label: "Mon profil" },
  photos:       { requiredPlan: "gratuit",  label: "Photos" },
  abonnement:   { requiredPlan: "gratuit",  label: "Abonnement" },
  parametres:   { requiredPlan: "gratuit",  label: "Paramètres" },
  demandes:     { requiredPlan: "gratuit",  label: "Demandes" },
  agenda:       { requiredPlan: "starter",  label: "Planning" },
  tarifs:       { requiredPlan: "starter",  label: "Mes tarifs" },
  facturation:  { requiredPlan: "starter",  label: "Facturation" },
  vitrine:      { requiredPlan: "pro",      label: "Vitrine" },
  "devis-ia":   { requiredPlan: "business", label: "Devis IA" },
};

/** Returns the badge plan to show (null if module is accessible) */
export function getModuleBadge(effectivePlan: PlanId, moduleHref: string): PlanId | null {
  // Extract module id from href like "/dashboard/facturation" -> "facturation"
  const parts = moduleHref.replace("/dashboard/", "").replace("/dashboard", "tableau-de-bord").split("?")[0];
  const moduleId = parts || "tableau-de-bord";
  const mod = DASHBOARD_MODULES[moduleId];
  if (!mod) return null;
  if (hasAccess(effectivePlan, mod.requiredPlan)) return null;
  return mod.requiredPlan;
}
