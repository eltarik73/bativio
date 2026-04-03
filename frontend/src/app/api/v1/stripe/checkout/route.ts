import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { getStripe, PLAN_CONFIG, getStripePriceId } from "@/lib/stripe";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const plan = (body.plan || body.priceId || "").toUpperCase() as string;
    const annual = body.annual === true || body.billing === "yearly";

    if (!plan || !(plan in PLAN_CONFIG)) {
      return apiError("Plan invalide", 400);
    }

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: { user: { select: { email: true } } },
    });
    if (!artisan) return apiError("Artisan introuvable", 404);

    const stripe = getStripe();
    const config = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG];
    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bativio.vercel.app";

    // Create or retrieve Stripe customer
    let customerId = artisan.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: artisan.user.email,
        name: artisan.nomAffichage,
        metadata: { artisanId: artisan.id },
      });
      customerId = customer.id;
      await prisma.artisan.update({
        where: { id: artisan.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // If already subscribed, redirect to customer portal
    if (artisan.stripeSubscriptionId) {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${appUrl}/dashboard/parametres`,
      });
      return apiSuccess({ url: portalSession.url, type: "portal" });
    }

    // Try to get a real Stripe Price ID from env
    const stripePriceId = getStripePriceId(plan, annual);

    const lineItems = stripePriceId
      ? [{ price: stripePriceId, quantity: 1 }]
      : [{
          price_data: {
            currency: "eur" as const,
            product_data: { name: `Bativio ${config.name}`, description: `Abonnement ${annual ? "annuel" : "mensuel"} Bativio ${config.name}` },
            unit_amount: annual ? Math.round(config.monthlyPrice * 100 * 0.83) : config.monthlyPrice * 100,
            recurring: { interval: (annual ? "year" : "month") as "year" | "month" },
          },
          quantity: 1,
        }];

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: lineItems,
      allow_promotion_codes: true,
      success_url: `${appUrl}/dashboard/abonnement?success=true&plan=${plan}`,
      cancel_url: `${appUrl}/artisan#pricing`,
      metadata: { artisanId: artisan.id, plan },
    });

    return apiSuccess({ url: checkoutSession.url, type: "checkout" });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    console.error("Stripe checkout error:", err);
    return apiError("Erreur lors de la création du paiement", 500);
  }
}
