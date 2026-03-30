import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not configured");
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

// New V2 plans
export const PLAN_CONFIG = {
  STARTER: { price: 1900, name: "Starter", lookupKey: "starter_monthly" },
  PRO: { price: 3900, name: "Pro", lookupKey: "pro_monthly" },
  BUSINESS: { price: 5900, name: "Business", lookupKey: "business_monthly" },
  // Legacy plan names (map to new ones)
  ESSENTIEL: { price: 1900, name: "Starter", lookupKey: "starter_monthly" },
  PRO_PLUS: { price: 5900, name: "Business", lookupKey: "business_monthly" },
} as const;

export type PaidPlan = keyof typeof PLAN_CONFIG;

// Price ID resolution: env var > ad-hoc
export function getStripePriceId(plan: string, annual: boolean): string | null {
  const prefix = annual ? "YEARLY" : "MONTHLY";
  // Try new plan names first
  const envKey = `NEXT_PUBLIC_STRIPE_PRICE_${plan.toUpperCase()}_${prefix}`;
  if (process.env[envKey]) return process.env[envKey]!;
  // Try legacy names
  const legacyMap: Record<string, string> = {
    ESSENTIEL: "STARTER", STARTER: "STARTER",
    PRO: "PRO",
    PRO_PLUS: "BUSINESS", BUSINESS: "BUSINESS",
  };
  const mapped = legacyMap[plan.toUpperCase()];
  if (mapped) {
    const mappedKey = `NEXT_PUBLIC_STRIPE_PRICE_${mapped}_${prefix}`;
    if (process.env[mappedKey]) return process.env[mappedKey]!;
  }
  // Try old format (STRIPE_PRICE_ESSENTIEL etc.)
  const oldKey = `STRIPE_PRICE_${plan.toUpperCase()}`;
  if (process.env[oldKey]) return process.env[oldKey]!;
  return null;
}
