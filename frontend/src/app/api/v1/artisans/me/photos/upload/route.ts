import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { checkLimit } from "@/lib/plans";
import type { PlanType } from "@/lib/plans";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ secure: true });

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: { _count: { select: { photos: true } } },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    // Check plan photo limits via centralized plans.ts
    const { allowed, limit } = checkLimit((artisan.plan || "GRATUIT") as PlanType, "photosMax", artisan._count.photos);
    if (!allowed) {
      return apiError(
        `Limite de ${limit} photos atteinte pour votre plan. Passez au plan supérieur pour en ajouter davantage.`,
        403
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("Aucun fichier fourni", 400);
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return apiError("Format de fichier non supporté. Utilisez JPG, PNG ou WebP.", 400);
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return apiError("Le fichier dépasse la taille maximale de 10 Mo.", 400);
    }

    // Convert file to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `bativio/artisans/${artisan.id}`,
            resource_type: "image",
            transformation: [
              { quality: "auto", fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Upload failed"));
            } else {
              resolve({ secure_url: result.secure_url, public_id: result.public_id });
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    // Get next order value
    const lastPhoto = await prisma.photo.findFirst({
      where: { artisanId: artisan.id },
      orderBy: { ordre: "desc" },
    });
    const nextOrdre = (lastPhoto?.ordre ?? -1) + 1;

    // Create Photo record
    const photo = await prisma.photo.create({
      data: {
        artisanId: artisan.id,
        url: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id,
        ordre: nextOrdre,
      },
    });

    return apiSuccess(photo, 201);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Photo upload error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
