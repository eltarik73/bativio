import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { getStripe } from "@/lib/stripe";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan?.stripeCustomerId) {
      return apiError("Aucun abonnement actif", 400);
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bativio.fr";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: artisan.stripeCustomerId,
      return_url: `${appUrl}/dashboard/parametres`,
    });

    return apiSuccess({ url: portalSession.url });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    console.error("Stripe portal error:", err);
    return apiError("Erreur", 500);
  }
}
