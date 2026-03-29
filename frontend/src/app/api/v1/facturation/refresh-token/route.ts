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

    // Le invoquoApiKey stocke le mot de passe Invoquo
    const invoquoEmail = `bativio-${artisan.id}@bativio.fr`;
    const invoquoPassword = artisan.invoquoApiKey || "";

    // Login sur Invoquo pour obtenir un JWT frais
    const loginRes = await fetch("https://invoquo.vercel.app/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: invoquoEmail, password: invoquoPassword }),
    });

    if (!loginRes.ok) {
      console.error("Invoquo login failed:", loginRes.status);
      return apiError("Impossible de se connecter à Invoquo", 502);
    }

    const loginData = await loginRes.json();
    const accessToken = loginData.data?.accessToken;
    if (!accessToken) return apiError("Token Invoquo manquant", 502);

    // Essayer d'obtenir un embed token
    const embedRes = await fetch("https://invoquo.vercel.app/api/v1/embed-tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        siret: artisan.invoquoSiret || artisan.siret,
        modules: ["dashboard", "invoices", "received", "quotes", "clients"],
      }),
    });

    if (embedRes.ok) {
      const json = await embedRes.json();
      const embedToken = json.data?.token || json.token;
      if (embedToken) return apiSuccess({ token: embedToken });
    }

    // Fallback: utiliser le JWT Invoquo directement
    return apiSuccess({ token: accessToken, direct: true });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    console.error("Facturation refresh-token error:", err);
    return apiError("Erreur interne", 500);
  }
}
