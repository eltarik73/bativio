import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: {
        artisanMetiers: {
          include: { metier: true },
          orderBy: { principal: "desc" },
        },
      },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const metiers = artisan.artisanMetiers.map((am) => ({
      id: am.metier.id,
      nom: am.metier.nom,
      icone: am.metier.icone,
      principal: am.principal,
    }));

    const prestations = await prisma.prestationType.findMany({
      where: { artisanId: artisan.id },
      orderBy: [{ categorie: "asc" }, { designation: "asc" }],
    });

    const allMetiers = await prisma.metier.findMany({
      orderBy: { nom: "asc" },
      select: { id: true, nom: true, icone: true },
    });

    return apiSuccess({ metiers, prestations, allMetiers });
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("GET metiers-prestations error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}
