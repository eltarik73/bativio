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
    maxInvoicesPerMonth: 5, maxPhotos: 3, hasPA: false, hasSiteVitrine: false,
    hasCRM: false, hasIA: false, hasSEO: false, hasFEC: false, maxBadges: 2, smsPerMonth: 0,
  },
  starter: {
    maxInvoicesPerMonth: Infinity, maxPhotos: 10, hasPA: true, hasSiteVitrine: false,
    hasCRM: false, hasIA: false, hasSEO: false, hasFEC: false, maxBadges: Infinity, smsPerMonth: 0,
  },
  pro: {
    maxInvoicesPerMonth: Infinity, maxPhotos: Infinity, hasPA: true, hasSiteVitrine: true,
    hasCRM: true, hasIA: false, hasSEO: false, hasFEC: true, maxBadges: Infinity, smsPerMonth: 0,
  },
  business: {
    maxInvoicesPerMonth: Infinity, maxPhotos: Infinity, hasPA: true, hasSiteVitrine: true,
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
