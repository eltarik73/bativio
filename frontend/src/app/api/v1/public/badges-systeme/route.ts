import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const badges = await prisma.badgeSysteme.findMany({
      orderBy: { nom: "asc" },
    });

    const data = badges.map((b) => ({
      id: b.id,
      nom: b.nom,
      description: b.description,
      icone: b.icone,
    }));

    return apiSuccess(data);
  } catch (error) {
    console.error("GET /api/v1/public/badges-systeme error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
