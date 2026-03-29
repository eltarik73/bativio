import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  const stripe = getStripe();
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const artisanId = session.metadata?.artisanId;
        const plan = session.metadata?.plan;
        const subscriptionId = session.subscription as string;

        if (artisanId && plan) {
          await prisma.artisan.update({
            where: { id: artisanId },
            data: {
              plan: plan as "ESSENTIEL" | "PRO" | "PRO_PLUS",
              stripeSubscriptionId: subscriptionId,
            },
          });
          console.log(`Plan updated: artisan ${artisanId} -> ${plan}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        const artisan = await prisma.artisan.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (artisan) {
          if (status === "canceled" || status === "unpaid") {
            await prisma.artisan.update({
              where: { id: artisan.id },
              data: { plan: "GRATUIT", stripeSubscriptionId: null },
            });
            console.log(`Subscription canceled: artisan ${artisan.id} -> GRATUIT`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        await prisma.artisan.updateMany({
          where: { stripeCustomerId: customerId },
          data: { plan: "GRATUIT", stripeSubscriptionId: null },
        });
        console.log(`Subscription deleted for customer ${customerId}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;
        console.warn(`Payment failed for customer ${customerId}`);
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
  }

  return new Response("OK", { status: 200 });
}
