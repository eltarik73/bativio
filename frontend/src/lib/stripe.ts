import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not configured");
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

// Plan configuration with Stripe price IDs
export const PLAN_CONFIG = {
  STARTER: {
    name: "Starter",
    monthlyPrice: 19,
    yearlyPrice: 190,
    priceMonthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || null,
    priceYearly: process.env.STRIPE_PRICE_STARTER_YEARLY || null,
  },
  PRO: {
    name: "Pro",
    monthlyPrice: 39,
    yearlyPrice: 390,
    priceMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY || null,
    priceYearly: process.env.STRIPE_PRICE_PRO_YEARLY || null,
  },
  BUSINESS: {
    name: "Business",
    monthlyPrice: 59,
    yearlyPrice: 590,
    priceMonthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || null,
    priceYearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY || null,
  },
  // Legacy mappings
  ESSENTIEL: {
    name: "Starter",
    monthlyPrice: 19,
    yearlyPrice: 190,
    priceMonthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || null,
    priceYearly: process.env.STRIPE_PRICE_STARTER_YEARLY || null,
  },
  PRO_PLUS: {
    name: "Business",
    monthlyPrice: 59,
    yearlyPrice: 590,
    priceMonthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || null,
    priceYearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY || null,
  },
} as const;

export type PaidPlan = keyof typeof PLAN_CONFIG;

// Resolve the Stripe price ID for a given plan and billing interval
export function getStripePriceId(plan: string, annual: boolean): string | null {
  const key = plan.toUpperCase() as keyof typeof PLAN_CONFIG;
  const config = PLAN_CONFIG[key];
  if (!config) return null;

  // Direct config lookup (uses env vars loaded at startup)
  if (annual && config.priceYearly) return config.priceYearly;
  if (!annual && config.priceMonthly) return config.priceMonthly;

  // Fallback: try env vars with explicit naming
  const prefix = annual ? "YEARLY" : "MONTHLY";
  const normalized = key === "ESSENTIEL" ? "STARTER" : key === "PRO_PLUS" ? "BUSINESS" : key;
  const envKey = `STRIPE_PRICE_${normalized}_${prefix}`;
  if (process.env[envKey]) return process.env[envKey]!;

  // Legacy fallback (old single-price format)
  const oldKey = `STRIPE_PRICE_${key}`;
  if (process.env[oldKey]) return process.env[oldKey]!;

  return null;
}

// Reverse: map a Stripe price ID back to a plan name
export function getPlanFromPriceId(priceId: string): string | null {
  for (const [planKey, config] of Object.entries(PLAN_CONFIG)) {
    if (planKey === "ESSENTIEL" || planKey === "PRO_PLUS") continue; // Skip legacy
    if (config.priceMonthly === priceId || config.priceYearly === priceId) {
      return planKey;
    }
  }
  return null;
}
