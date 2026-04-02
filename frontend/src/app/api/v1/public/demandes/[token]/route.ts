import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const demande = await prisma.demandeDevis.findFirst({
      where: { responseToken: token },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        photosDevis: {
          orderBy: { createdAt: "asc" },
        },
        artisan: {
          select: {
            nomAffichage: true,
            metierId: true,
            metier: {
              select: {
                nom: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!demande) {
      return apiError("Demande de devis introuvable", 404);
    }

    return apiSuccess({
      id: demande.id,
      nomClient: demande.nomClient,
      telephoneClient: demande.telephoneClient,
      emailClient: demande.emailClient,
      clientVille: demande.clientVille,
      descriptionBesoin: demande.descriptionBesoin,
      reponses: demande.reponses,
      urgence: demande.urgence,
      statut: demande.statut,
      reponduAt: demande.reponduAt,
      createdAt: demande.createdAt,
      artisan: {
        nomAffichage: demande.artisan.nomAffichage,
        metier: demande.artisan.metier?.nom || null,
      },
      messages: demande.messages,
      photos: demande.photosDevis,
    });
  } catch (error) {
    console.error("GET /api/v1/public/demandes/[token] error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
