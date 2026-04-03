import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan?.invoquoEnabled) return apiError("Facturation non activée", 400);

    const siret = artisan.invoquoSiret || artisan.siret || "";
    const apiKey = artisan.invoquoApiKey || "";

    if (!apiKey) {
      return apiError("API key facturation non configurée", 500);
    }

    // Call Invoquo's official embed-tokens API with the tenant's API key
    const embedRes = await fetch("https://invoquo.vercel.app/api/v1/embed-tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        siret,
        modules: ["dashboard", "invoices", "received", "quotes", "clients", "reporting", "export", "compliance", "settings"],
      }),
    });

    if (!embedRes.ok) {
      console.error("[FACTURATION] Invoquo embed-tokens failed:", embedRes.status);
      return apiError("Impossible de générer le token facturation", 502);
    }

    const embedData = await embedRes.json();
    if (!embedData.success || !embedData.data?.token) {
      console.error("[FACTURATION] No token in embed response:", embedData);
      return apiError("Token facturation introuvable", 502);
    }

    return apiSuccess({ token: embedData.data.token, siret });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    console.error("[FACTURATION] refresh-token error:", err);
    return apiError("Erreur interne", 500);
  }
}
