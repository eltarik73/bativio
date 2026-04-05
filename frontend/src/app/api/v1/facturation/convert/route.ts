import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { hasFeature } from "@/lib/plans";
import type { PlanType } from "@/lib/plans";
import { getEffectivePlan } from "@/lib/plan-gates";

const INVOQUO_URL = process.env.INVOQUO_URL || "https://invoquo.vercel.app";

/**
 * POST /api/v1/facturation/convert
 * Body: { quoteId: string }
 * Converts a quote to an invoice via Invoquo API using the artisan's API key.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan) return apiError("Artisan introuvable", 404);

    const plan = getEffectivePlan(artisan).toUpperCase() as PlanType;
    if (!hasFeature(plan, "invoquo_creation")) {
      return apiError("La création de factures nécessite le plan Business", 403);
    }

    if (!artisan.invoquoEnabled || !artisan.invoquoApiKey) {
      return apiError("Facturation non activée", 400);
    }

    const body = await request.json();
    const { quoteId } = body;
    if (!quoteId) return apiError("quoteId requis", 400);

    // Call Invoquo convert API using the artisan's API key
    // The Invoquo API /api/quotes/[id]/convert uses cookie auth,
    // so we need to login first and use the session cookie
    const invoquoEmail = `bativio-${artisan.id}@bativio.fr`;
    const invoquoPassword = artisan.invoquoApiKey.startsWith("inv_") ? null : artisan.invoquoApiKey;

    let sessionCookie: string | null = null;

    if (invoquoPassword) {
      // Legacy: password stored, login with it
      const loginRes = await fetch(`${INVOQUO_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: invoquoEmail, password: invoquoPassword }),
      });
      if (loginRes.ok) {
        const setCookie = loginRes.headers.get("set-cookie");
        sessionCookie = setCookie?.split(",").map(c => c.trim().split(";")[0]).find(c => c.startsWith("invoquo-session=")) || null;
      }
    }

    if (!sessionCookie) {
      // Try with API key — create a temporary session via login
      // For API key users, we need to find their Invoquo credentials
      // Fallback: use the API key as x-api-key header directly
      const convertRes = await fetch(`${INVOQUO_URL}/api/quotes/${quoteId}/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": artisan.invoquoApiKey,
        },
      });

      if (convertRes.ok) {
        const data = await convertRes.json();
        return apiSuccess(data.data || data, 201);
      }

      // If X-Api-Key doesn't work for this endpoint, try cookie auth with generated credentials
      const loginRes2 = await fetch(`${INVOQUO_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: invoquoEmail, password: `InvBtv_${artisan.id.slice(-8)}!2026` }),
      });
      if (loginRes2.ok) {
        const setCookie = loginRes2.headers.get("set-cookie");
        sessionCookie = setCookie?.split(",").map(c => c.trim().split(";")[0]).find(c => c.startsWith("invoquo-session=")) || null;
      }
    }

    if (!sessionCookie) {
      return apiError("Impossible de se connecter à Invoquo pour la conversion", 502);
    }

    // Call the convert endpoint with the session cookie
    const convertRes = await fetch(`${INVOQUO_URL}/api/quotes/${quoteId}/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
    });

    if (!convertRes.ok) {
      const errData = await convertRes.json().catch(() => ({}));
      return apiError(errData.error || "Erreur lors de la conversion", convertRes.status);
    }

    const data = await convertRes.json();
    return apiSuccess(data.data || data, 201);
  } catch (error) {
    const authErr = handleAuthError(error);
    if (authErr) return authErr;
    console.error("[FACTURATION] convert error:", error);
    return apiError("Erreur interne", 500);
  }
}
