import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { hasFeature } from "@/lib/plans";
import type { PlanType } from "@/lib/plans";
import { getEffectivePlan } from "@/lib/plan-gates";

const INVOQUO_URL = process.env.INVOQUO_URL || "https://invoquo.vercel.app";
const PROVISION_SECRET = process.env.PROVISION_SECRET;

/**
 * Activate facturation for an artisan.
 *
 * Strategy 1 (preferred): Provisioning API — one call, returns API key directly.
 * Strategy 2 (fallback):  Register + login + fetch API key from /api/settings/api-key.
 */
export async function POST() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: { user: { select: { email: true } } },
    });
    if (!artisan) return apiError("Artisan introuvable", 404);

    // ── SERVER-SIDE PLAN CHECK (uses effective plan: max of Stripe + override) ──
    const plan = getEffectivePlan(artisan).toUpperCase() as PlanType;
    if (!hasFeature(plan, "invoquo_reception")) {
      return apiError("La facturation électronique est disponible à partir du plan Starter (19€/mois)", 403);
    }

    // Already activated with a valid API key
    if (artisan.invoquoEnabled && artisan.invoquoApiKey?.startsWith("inv_")) {
      return apiSuccess({ message: "Déjà activé" });
    }

    // ── Strategy 1: Provisioning API (preferred) ──
    if (PROVISION_SECRET) {
      const provisionRes = await fetch(`${INVOQUO_URL}/api/v1/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Provision-Secret": PROVISION_SECRET,
        },
        body: JSON.stringify({
          email: artisan.user.email,
          siret: artisan.siret,
          companyName: artisan.nomAffichage,
          source: "bativio",
        }),
      });

      if (provisionRes.ok) {
        const data = await provisionRes.json();
        if (data.success && data.data?.apiKey) {
          await prisma.artisan.update({
            where: { id: artisan.id },
            data: {
              invoquoApiKey: data.data.apiKey,
              invoquoSiret: data.data.siret || artisan.siret,
              invoquoEnabled: true,
            },
          });
          return apiSuccess({ message: "Facturation activée" });
        }
      }
      // If provisioning failed, fall through to strategy 2
      console.warn("[FACTURATION] Provisioning failed, trying register fallback");
    }

    // ── Strategy 2: Register + login + retrieve API key ──
    const invoquoEmail = `bativio-${artisan.id}@bativio.fr`;
    const invoquoPassword = `InvBtv_${artisan.id.slice(-8)}!2026`;

    // Step 1: Register (ignore 409 = already exists)
    const registerRes = await fetch(`${INVOQUO_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: invoquoEmail,
        password: invoquoPassword,
        companyName: artisan.nomAffichage,
        siret: artisan.siret,
      }),
    });

    if (!registerRes.ok && registerRes.status !== 409) {
      console.error("[FACTURATION] Register failed:", registerRes.status);
      return apiError("Erreur lors de l'activation", 502);
    }

    // Step 2: Login to get session cookie
    const loginRes = await fetch(`${INVOQUO_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: invoquoEmail, password: invoquoPassword }),
    });

    if (!loginRes.ok) {
      console.error("[FACTURATION] Login failed:", loginRes.status);
      return apiError("Erreur lors de l'activation", 502);
    }

    // Extract session cookie from login response
    const setCookieHeader = loginRes.headers.get("set-cookie");
    const sessionCookie = setCookieHeader
      ?.split(",")
      .map((c) => c.trim().split(";")[0])
      .find((c) => c.startsWith("invoquo-session="));

    if (!sessionCookie) {
      console.error("[FACTURATION] No session cookie from login");
      return apiError("Erreur lors de l'activation", 502);
    }

    // Step 3: Generate/retrieve API key using the session
    const apiKeyRes = await fetch(`${INVOQUO_URL}/api/settings/api-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
    });

    if (!apiKeyRes.ok) {
      console.error("[FACTURATION] API key generation failed:", apiKeyRes.status);
      return apiError("Erreur lors de l'activation", 502);
    }

    const apiKeyData = await apiKeyRes.json();
    const apiKey = apiKeyData.data?.apiKey;

    if (!apiKey || !apiKey.startsWith("inv_")) {
      console.error("[FACTURATION] Invalid API key returned:", apiKeyData);
      return apiError("Erreur lors de l'activation", 502);
    }

    // Step 4: Store the real API key
    await prisma.artisan.update({
      where: { id: artisan.id },
      data: {
        invoquoApiKey: apiKey,
        invoquoSiret: artisan.siret,
        invoquoEnabled: true,
      },
    });

    return apiSuccess({ message: "Facturation activée" });
  } catch (error: unknown) {
    const authErr = handleAuthError(error);
    if (authErr) return authErr;
    console.error("[FACTURATION] Activate error:", error);
    return apiError("Erreur interne", 500);
  }
}
