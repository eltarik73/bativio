import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { randomUUID } from "crypto";

export async function POST() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan) return apiError("Artisan introuvable", 404);
    if (artisan.invoquoEnabled) return apiError("Déjà activé", 409);

    // TODO: Appeler l'API Invoquo pour créer un tenant et obtenir une vraie apiKey
    // POST https://invoquo.vercel.app/api/v1/tenants
    // Pour V1: placeholder apiKey
    const apiKey = `inv_${randomUUID()}`;

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
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    console.error("Facturation activate error:", err);
    return apiError("Erreur interne", 500);
  }
}
