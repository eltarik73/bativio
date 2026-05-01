import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ secure: true });

async function destroyCloudinary(publicId: string | null) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (err) {
    // Log but don't fail the DB delete — orphan asset is acceptable, lost user data is not
    console.error("Cloudinary destroy failed for", publicId, err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const photo = await prisma.photo.findUnique({ where: { id } });

    if (!photo || photo.artisanId !== artisan.id) {
      return apiError("Photo introuvable", 404);
    }

    // If this photo is part of an AVANT/APRES pair, find the sibling so we can
    // delete both (otherwise we'd leave a single half of a pair behind).
    let pair: { id: string; cloudinaryPublicId: string | null } | null = null;
    if (photo.paireId) {
      pair = await prisma.photo.findUnique({
        where: { id: photo.paireId },
        select: { id: true, cloudinaryPublicId: true },
      });
    }

    await prisma.$transaction(async (tx) => {
      if (pair) await tx.photo.delete({ where: { id: pair.id } });
      await tx.photo.delete({ where: { id } });
    });

    // Best-effort Cloudinary cleanup after the DB commit
    await destroyCloudinary(photo.cloudinaryPublicId);
    if (pair) await destroyCloudinary(pair.cloudinaryPublicId);

    return apiSuccess({ deleted: true, pairDeleted: !!pair });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Delete photo error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
