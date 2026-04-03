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
    const invoquoEmail = `bativio-${artisan.id}@bativio.fr`;
    const invoquoPassword = artisan.invoquoApiKey || "";

    // Step 1: Login to Invoquo to get a session cookie
    const loginRes = await fetch("https://invoquo.vercel.app/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: invoquoEmail, password: invoquoPassword }),
      redirect: "manual",
    });

    if (!loginRes.ok) {
      console.error("[FACTURATION] Invoquo login failed:", loginRes.status);
      return apiError("Connexion facturation impossible", 502);
    }

    // Extract session cookie
    const setCookieHeader = loginRes.headers.get("set-cookie") || "";
    const cookieMatch = setCookieHeader.match(/invoquo-session=([^;]+)/);
    const sessionCookie = cookieMatch?.[1] || "";

    if (!sessionCookie) {
      console.error("[FACTURATION] No session cookie from Invoquo login");
      return apiError("Token facturation introuvable", 502);
    }

    // Step 2: Use the session cookie to call the embed-tokens API
    // First, get the tenant's API key
    const meRes = await fetch("https://invoquo.vercel.app/api/auth/me", {
      headers: { Cookie: `invoquo-session=${sessionCookie}` },
    });

    let apiKey = "";
    if (meRes.ok) {
      const meData = await meRes.json();
      apiKey = meData.data?.tenant?.apiKey || "";
    }

    if (apiKey) {
      // Use the official embed-tokens endpoint
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

      if (embedRes.ok) {
        const embedData = await embedRes.json();
        if (embedData.success && embedData.data?.token) {
          return apiSuccess({ token: embedData.data.token, siret });
        }
      }
    }

    // Fallback: use the session cookie token directly (middleware accepts it)
    return apiSuccess({ token: sessionCookie, siret });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    console.error("[FACTURATION] refresh-token error:", err);
    return apiError("Erreur interne", 500);
  }
}
