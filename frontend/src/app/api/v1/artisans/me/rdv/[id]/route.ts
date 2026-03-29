import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { RdvStatut } from "@prisma/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan) return apiError("Artisan non trouve", 404);

    const rdv = await prisma.rendezVousBativio.findUnique({
      where: { id },
    });

    if (!rdv) return apiError("RDV non trouve", 404);
    if (rdv.artisanId !== artisan.id) return apiError("Acces refuse", 403);

    return apiSuccess(rdv);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED")
      return apiError("Non autorise", 401);
    console.error("GET rdv/[id] error:", e);
    return apiError("Erreur serveur", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan) return apiError("Artisan non trouve", 404);

    const rdv = await prisma.rendezVousBativio.findUnique({
      where: { id },
    });

    if (!rdv) return apiError("RDV non trouve", 404);
    if (rdv.artisanId !== artisan.id) return apiError("Acces refuse", 403);

    const body: {
      dateDebut?: string;
      dateFin?: string;
      statut?: RdvStatut;
      objet?: string;
      notes?: string;
    } = await request.json();

    const updateData: Record<string, unknown> = {};

    if (body.dateDebut) updateData.dateDebut = new Date(body.dateDebut);
    if (body.dateFin) updateData.dateFin = new Date(body.dateFin);
    if (body.objet !== undefined) updateData.objet = body.objet;
    if (body.notes !== undefined) updateData.notes = body.notes;

    if (body.statut) {
      const validStatuts: RdvStatut[] = [
        "CONFIRME",
        "EN_ATTENTE",
        "ANNULE",
        "TERMINE",
        "NO_SHOW",
      ];
      if (!validStatuts.includes(body.statut)) {
        return apiError("Statut invalide", 400);
      }
      updateData.statut = body.statut;

      // If cancelling, log SMS notification (no sms.ts yet)
      if (body.statut === "ANNULE" && rdv.statut !== "ANNULE") {
        console.log(
          `[SMS] Annulation RDV: notification a envoyer au client ${rdv.clientTelephone} pour le RDV ${rdv.id}`
        );
      }
    }

    const updated = await prisma.rendezVousBativio.update({
      where: { id },
      data: updateData,
    });

    return apiSuccess(updated);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED")
      return apiError("Non autorise", 401);
    console.error("PUT rdv/[id] error:", e);
    return apiError("Erreur serveur", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan) return apiError("Artisan non trouve", 404);

    const rdv = await prisma.rendezVousBativio.findUnique({
      where: { id },
    });

    if (!rdv) return apiError("RDV non trouve", 404);
    if (rdv.artisanId !== artisan.id) return apiError("Acces refuse", 403);

    // Soft delete: set statut to ANNULE
    await prisma.rendezVousBativio.update({
      where: { id },
      data: { statut: "ANNULE" },
    });

    return apiSuccess({ message: "RDV annule" });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED")
      return apiError("Non autorise", 401);
    console.error("DELETE rdv/[id] error:", e);
    return apiError("Erreur serveur", 500);
  }
}
