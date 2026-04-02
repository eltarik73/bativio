export const LEAD_LIMITS: Record<string, number | null> = {
  GRATUIT: 5,
  STARTER: null,
  ESSENTIEL: null, // legacy
  PRO: null,
  PRO_PLUS: null, // legacy
  BUSINESS: null,
};

export function getLeadLimit(plan: string): number | null {
  return LEAD_LIMITS[(plan || "GRATUIT").toUpperCase()] ?? 5;
}

export function isLeadMasked(
  plan: string,
  leadsUsed: number,
  demandRank: number
): boolean {
  const limit = getLeadLimit(plan);
  if (limit === null) return false;
  return demandRank > limit;
}
