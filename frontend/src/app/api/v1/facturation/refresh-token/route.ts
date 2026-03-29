import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan?.invoquoApiKey) return apiError("Non autorisé", 401);

    const tokenResponse = await fetch(
      "https://invoquo.vercel.app/api/v1/embed-tokens",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": artisan.invoquoApiKey,
        },
        body: JSON.stringify({
          siret: artisan.invoquoSiret || artisan.siret,
          modules: [
            "dashboard",
            "invoices",
            "received",
            "quotes",
            "clients",
            "reporting",
            "export",
            "compliance",
            "settings",
          ],
        }),
      }
    );

    if (!tokenResponse.ok) return apiError("Erreur token Invoquo", 502);

    const json = await tokenResponse.json();
    return apiSuccess({ token: json.data?.token || json.token });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    console.error("Facturation refresh-token error:", err);
    return apiError("Erreur interne", 500);
  }
}
