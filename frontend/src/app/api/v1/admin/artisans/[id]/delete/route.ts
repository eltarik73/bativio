import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

// DELETE an artisan completely (hard delete: artisan + user)
// Use for testing purposes — removes all traces
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { id },
      select: { id: true, userId: true, nomAffichage: true },
    });

    if (!artisan) {
      return apiError("Artisan introuvable", 404);
    }

    // Delete in correct order (cascade should handle most, but be explicit)
    await prisma.$transaction([
      // Delete all related records first
      prisma.messageDevis.deleteMany({ where: { demande: { artisanId: id } } }),
      prisma.devisPhoto.deleteMany({ where: { demande: { artisanId: id } } }),
      prisma.devisReply.deleteMany({ where: { artisanId: id } }),
      prisma.demandeDevis.deleteMany({ where: { artisanId: id } }),
      prisma.devis.deleteMany({ where: { artisanId: id } }),
      prisma.photo.deleteMany({ where: { artisanId: id } }),
      prisma.badge.deleteMany({ where: { artisanId: id } }),
      prisma.serviceArtisan.deleteMany({ where: { artisanId: id } }),
      prisma.horaire.deleteMany({ where: { artisanId: id } }),
      prisma.zoneIntervention.deleteMany({ where: { artisanId: id } }),
      prisma.notification.deleteMany({ where: { artisanId: id } }),
      prisma.smsUsage.deleteMany({ where: { artisanId: id } }),
      prisma.smsRecharge.deleteMany({ where: { artisanId: id } }),
      prisma.artisanMetier.deleteMany({ where: { artisanId: id } }),
      prisma.rendezVousBativio.deleteMany({ where: { artisanId: id } }),
      prisma.disponibiliteHebdo.deleteMany({ where: { artisanId: id } }),
      prisma.jourFerie.deleteMany({ where: { artisanId: id } }),
      prisma.tarification.deleteMany({ where: { artisanId: id } }),
      prisma.prestationType.deleteMany({ where: { artisanId: id } }),
      // Delete artisan
      prisma.artisan.delete({ where: { id } }),
      // Delete user
      prisma.user.delete({ where: { id: artisan.userId } }),
    ]);

    console.log(`[ADMIN] Artisan supprimé: ${artisan.nomAffichage} (${id})`);

    return apiSuccess({ deleted: true, nom: artisan.nomAffichage });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin delete artisan error:", err);
    return apiError("Erreur lors de la suppression", 500);
  }
}
