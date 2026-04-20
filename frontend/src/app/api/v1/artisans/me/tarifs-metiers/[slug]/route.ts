import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await requireAuth();
    const { slug } = await params;
    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      select: { id: true },
    });
    if (!artisan) return apiError("Artisan introuvable", 404);

    await prisma.tarifHoraireMetier.delete({
      where: { artisanId_metierSlug: { artisanId: artisan.id, metierSlug: slug } },
    }).catch(() => null);

    return apiSuccess({ ok: true });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    return apiError("Erreur serveur", 500);
  }
}
