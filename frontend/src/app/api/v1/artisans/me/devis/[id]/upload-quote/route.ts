import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { sendEmail } from "@/lib/email";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

cloudinary.config({ secure: true });

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(
  request: NextRequest,
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

    const devis = await prisma.demandeDevis.findUnique({ where: { id } });

    if (!devis || devis.artisanId !== artisan.id) {
      return apiError("Demande de devis introuvable", 404);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("Aucun fichier fourni", 400);
    }

    // Validate PDF
    if (file.type !== "application/pdf") {
      return apiError("Seuls les fichiers PDF sont acceptés", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return apiError("Le fichier dépasse la taille maximale de 10 Mo.", 400);
    }

    // Convert file to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload PDF to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `bativio/devis/${artisan.id}`,
            resource_type: "raw",
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

    // Generate responseToken if null
    const responseToken = devis.responseToken || crypto.randomUUID();

    // Create reply and update devis in a transaction
    const [reply] = await prisma.$transaction([
      prisma.devisReply.create({
        data: {
          demandeDevisId: devis.id,
          artisanId: artisan.id,
          message: null,
          type: "QUOTE_UPLOAD",
          attachmentUrl: uploadResult.secure_url,
          attachmentFilename: file.name,
        },
      }),
      prisma.demandeDevis.update({
        where: { id },
        data: {
          statut: "REPONDU",
          reponduAt: new Date(),
          responseToken,
        },
      }),
    ]);

    // Send email to client
    if (devis.emailClient) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bativio.fr";
      await sendEmail(
          devis.emailClient,
          `${artisan.nomAffichage} vous a envoyé un devis`,
          `
            <h2>Devis de ${artisan.nomAffichage}</h2>
            <p>${artisan.nomAffichage} vous a envoyé un devis en pièce jointe.</p>
            <p><a href="${uploadResult.secure_url}" style="display:inline-block;padding:12px 24px;background:#1C1C1E;color:#fff;text-decoration:none;border-radius:8px;">Télécharger le devis</a></p>
            <hr>
            <p>
              <a href="${baseUrl}/devis/${devis.id}/response?token=${responseToken}&action=accept" style="display:inline-block;padding:12px 24px;background:#C4531A;color:#fff;text-decoration:none;border-radius:8px;margin-right:12px;">Accepter</a>
              <a href="${baseUrl}/devis/${devis.id}/response?token=${responseToken}&action=refuse" style="display:inline-block;padding:12px 24px;background:#1C1C1E;color:#fff;text-decoration:none;border-radius:8px;">Refuser</a>
            </p>
          `,
        );
    }

    return apiSuccess(reply, 201);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Upload quote error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
