import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const villes = await prisma.ville.findMany({
      where: { actif: true },
      orderBy: { nom: "asc" },
    });

    const villesWithCount = await Promise.all(
      villes.map(async (ville) => {
        const artisansCount = await prisma.artisan.count({
          where: {
            ville: { equals: ville.nom, mode: "insensitive" },
            actif: true,
            visible: true,
            deletedAt: null,
          },
        });

        return {
          id: ville.id,
          nom: ville.nom,
          slug: ville.slug,
          codePostal: ville.codePostal,
          departement: ville.departement,
          latitude: ville.latitude,
          longitude: ville.longitude,
          contenuSeo: ville.contenuSeo,
          artisansCount,
        };
      })
    );

    return apiSuccess(villesWithCount);
  } catch (error) {
    console.error("GET /api/v1/public/villes error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
