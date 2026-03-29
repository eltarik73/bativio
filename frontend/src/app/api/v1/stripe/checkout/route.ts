import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { getStripe, PLAN_CONFIG, PaidPlan } from "@/lib/stripe";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const plan = body.plan as string;

    if (!plan || !(plan in PLAN_CONFIG)) {
      return apiError("Plan invalide. Choisissez ESSENTIEL, PRO ou PRO_PLUS", 400);
    }

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: { user: { select: { email: true } } },
    });

    if (!artisan) return apiError("Artisan introuvable", 404);

    const stripe = getStripe();
    const config = PLAN_CONFIG[plan as PaidPlan];
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

    // If artisan already has a subscription, redirect to customer portal instead
    if (artisan.stripeSubscriptionId) {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${appUrl}/dashboard/parametres`,
      });
      return apiSuccess({ url: portalSession.url, type: "portal" });
    }

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Bativio ${config.name}`,
              description: `Abonnement mensuel Bativio ${config.name}`,
            },
            unit_amount: config.price,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard/parametres?success=true&plan=${plan}`,
      cancel_url: `${appUrl}/dashboard/parametres?canceled=true`,
      metadata: {
        artisanId: artisan.id,
        plan: plan,
      },
    });

    return apiSuccess({ url: checkoutSession.url, type: "checkout" });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    console.error("Stripe checkout error:", err);
    return apiError("Erreur lors de la création du paiement", 500);
  }
}
