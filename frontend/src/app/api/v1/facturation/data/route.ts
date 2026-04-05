import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { hasFeature } from "@/lib/plans";
import type { PlanType } from "@/lib/plans";
import { getEffectivePlan } from "@/lib/plan-gates";

const INVOQUO_URL = process.env.INVOQUO_URL || "https://invoquo.vercel.app";

/**
 * GET /api/v1/facturation/data
 * Proxy to Invoquo API to fetch invoices, quotes, and clients for the artisan.
 * Uses the artisan's stored API key to authenticate with Invoquo.
 */
export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan?.invoquoEnabled || !artisan.invoquoApiKey) {
      return apiSuccess({ invoices: [], quotes: [], clients: [] });
    }

    const plan = getEffectivePlan(artisan).toUpperCase() as PlanType;
    if (!hasFeature(plan, "invoquo_reception")) {
      return apiSuccess({ invoices: [], quotes: [], clients: [] });
    }

    const apiKey = artisan.invoquoApiKey;
    const headers = { "X-Api-Key": apiKey };

    // Fetch all 3 in parallel from Invoquo
    const [invRes, quoRes, cliRes] = await Promise.allSettled([
      fetch(`${INVOQUO_URL}/api/invoices?limit=20&sort=createdAt&order=desc`, { headers }).then(r => r.ok ? r.json() : null),
      fetch(`${INVOQUO_URL}/api/quotes?limit=20&sort=createdAt&order=desc`, { headers }).then(r => r.ok ? r.json() : null),
      fetch(`${INVOQUO_URL}/api/clients?limit=50&sort=createdAt&order=desc`, { headers }).then(r => r.ok ? r.json() : null),
    ]);

    return apiSuccess({
      invoices: invRes.status === "fulfilled" && invRes.value?.data?.data ? invRes.value.data.data : [],
      quotes: quoRes.status === "fulfilled" && quoRes.value?.data?.data ? quoRes.value.data.data : [],
      clients: cliRes.status === "fulfilled" && cliRes.value?.data?.data ? cliRes.value.data.data : [],
    });
  } catch (error) {
    const authErr = handleAuthError(error);
    if (authErr) return authErr;
    console.error("[FACTURATION] data error:", error);
    return apiError("Erreur interne", 500);
  }
}
