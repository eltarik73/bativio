import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      select: { id: true },
    });

    if (!artisan) return apiError("Artisan introuvable", 404);

    const envois = await prisma.demandeEnvoi.findMany({
      where: { artisanId: artisan.id, rejectedAt: null },
      orderBy: { sentAt: "desc" },
      take: 50,
      include: {
        demande: {
          select: {
            id: true,
            description: true,
            villeLabel: true,
            metierDetecte: true,
            qualifJson: true,
            qualifScore: true,
            preDevisJson: true,
            contactNom: true,
            contactEmail: true,
            contactTel: true,
            photos: true,
            statut: true,
            createdAt: true,
            devis: {
              where: { artisanId: artisan.id },
              select: { id: true, numero: true, statut: true, totalTTC: true },
            },
          },
        },
      },
    });

    return apiSuccess({ envois });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    console.error("Get demandes-projets artisan error:", err);
    return apiError("Erreur serveur", 500);
  }
}
