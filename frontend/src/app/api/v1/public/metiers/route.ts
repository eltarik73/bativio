import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const metiers = await prisma.metier.findMany({
      orderBy: { nom: "asc" },
    });

    const metiersWithCount = await Promise.all(
      metiers.map(async (metier) => {
        const artisansCount = await prisma.artisan.count({
          where: {
            metierId: metier.id,
            actif: true,
            visible: true,
            deletedAt: null,
          },
        });

        return {
          id: metier.id,
          nom: metier.nom,
          slug: metier.slug,
          icone: metier.icone,
          artisansCount,
        };
      })
    );

    return apiSuccess(metiersWithCount);
  } catch (error) {
    console.error("GET /api/v1/public/metiers error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
