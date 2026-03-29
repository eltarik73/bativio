import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

// Price IDs — create these in your Stripe Dashboard > Products
// For now, we use lookup_keys to find prices dynamically
export const PLAN_CONFIG = {
  ESSENTIEL: { price: 1900, name: "Essentiel", lookupKey: "essentiel_monthly" },
  PRO: { price: 4900, name: "Pro", lookupKey: "pro_monthly" },
  PRO_PLUS: { price: 7900, name: "Pro+", lookupKey: "pro_plus_monthly" },
} as const;

export type PaidPlan = keyof typeof PLAN_CONFIG;
