import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

export async function GET() {
  try {
    await requireAdmin();

    const artisans = await prisma.artisan.findMany({
      where: {
        artisanStatus: "PENDING_REVIEW",
        deletedAt: null,
      },
      include: {
        user: { select: { email: true } },
        metier: { select: { nom: true, slug: true } },
      },
      orderBy: { scoringDate: "asc" },
    });

    return apiSuccess({ artisans });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Admin validations list error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
