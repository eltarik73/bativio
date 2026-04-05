import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

const INVOQUO_URL = process.env.INVOQUO_URL || "https://invoquo.vercel.app";
const ALL_MODULES = ["dashboard", "invoices", "received", "quotes", "clients", "reporting", "export", "compliance", "settings"];

/**
 * Auto-repair: if the stored key is a legacy password (not inv_...), try to
 * login with it and fetch a real API key from Invoquo.
 */
async function repairApiKey(artisanId: string, storedKey: string, siret: string): Promise<string | null> {
  const invoquoEmail = `bativio-${artisanId}@bativio.fr`;

  const loginRes = await fetch(`${INVOQUO_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: invoquoEmail, password: storedKey }),
  });

  if (!loginRes.ok) return null;

  const setCookieHeader = loginRes.headers.get("set-cookie");
  const sessionCookie = setCookieHeader
    ?.split(",")
    .map((c) => c.trim().split(";")[0])
    .find((c) => c.startsWith("invoquo-session="));

  if (!sessionCookie) return null;

  const apiKeyRes = await fetch(`${INVOQUO_URL}/api/settings/api-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: sessionCookie },
  });

  if (!apiKeyRes.ok) return null;

  const data = await apiKeyRes.json();
  const newKey = data.data?.apiKey;
  if (!newKey?.startsWith("inv_")) return null;

  await prisma.artisan.update({
    where: { id: artisanId },
    data: { invoquoApiKey: newKey, invoquoSiret: siret },
  });

  console.log(`[FACTURATION] Auto-repaired API key for artisan ${artisanId}`);
  return newKey;
}

export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan?.invoquoEnabled) return apiError("Facturation non activée", 400);

    const siret = artisan.invoquoSiret || artisan.siret || "";
    let apiKey = artisan.invoquoApiKey || "";

    if (!apiKey) {
      return apiError("API key facturation non configurée", 500);
    }

    // Auto-repair legacy keys (stored password instead of real inv_ API key)
    if (!apiKey.startsWith("inv_")) {
      const repairedKey = await repairApiKey(artisan.id, apiKey, siret);
      if (!repairedKey) {
        return apiError("Clé facturation invalide — veuillez réactiver", 400);
      }
      apiKey = repairedKey;
    }

    // Call Invoquo embed-tokens with valid API key
    const embedRes = await fetch(`${INVOQUO_URL}/api/v1/embed-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ siret, modules: ALL_MODULES }),
    });

    if (!embedRes.ok) {
      console.error("[FACTURATION] embed-tokens failed:", embedRes.status);
      return apiError("Impossible de générer le token facturation", 502);
    }

    const embedData = await embedRes.json();
    if (!embedData.success || !embedData.data?.token) {
      console.error("[FACTURATION] No token in response:", embedData);
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
