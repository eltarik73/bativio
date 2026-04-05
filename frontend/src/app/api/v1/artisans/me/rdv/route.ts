import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireFeature } from "@/lib/auth-server";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { RdvStatut } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { artisan } = await requireFeature("agenda");
    void artisan;

    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const statut = searchParams.get("statut") as RdvStatut | null;

    const where: Record<string, unknown> = { artisanId: artisan.id };

    if (from || to) {
      where.dateDebut = {};
      if (from) (where.dateDebut as Record<string, unknown>).gte = new Date(from);
      if (to) (where.dateDebut as Record<string, unknown>).lte = new Date(to);
    }

    if (statut) {
      const validStatuts: RdvStatut[] = [
        "CONFIRME",
        "EN_ATTENTE",
        "ANNULE",
        "TERMINE",
        "NO_SHOW",
      ];
      if (validStatuts.includes(statut)) {
        where.statut = statut;
      }
    }

    const rdvList = await prisma.rendezVousBativio.findMany({
      where,
      orderBy: { dateDebut: "asc" },
    });

    return apiSuccess(rdvList);
  } catch (e: unknown) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("GET rdv error:", e);
    return apiError("Erreur serveur", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { artisan } = await requireFeature("agenda");

    const body: {
      clientNom: string;
      clientTelephone: string;
      clientEmail?: string;
      dateDebut: string;
      dateFin: string;
      dureeMinutes?: number;
      objet?: string;
      adresse?: string;
      notes?: string;
    } = await request.json();

    if (!body.clientNom || !body.clientTelephone || !body.dateDebut || !body.dateFin) {
      return apiError(
        "clientNom, clientTelephone, dateDebut et dateFin sont requis",
        400
      );
    }

    const dateDebut = new Date(body.dateDebut);
    const dateFin = new Date(body.dateFin);

    if (isNaN(dateDebut.getTime()) || isNaN(dateFin.getTime())) {
      return apiError("Dates invalides", 400);
    }

    if (dateFin <= dateDebut) {
      return apiError("dateFin doit etre apres dateDebut", 400);
    }

    const dureeMinutes =
      body.dureeMinutes ??
      Math.round((dateFin.getTime() - dateDebut.getTime()) / 60000);

    const rdv = await prisma.rendezVousBativio.create({
      data: {
        artisanId: artisan.id,
        clientNom: body.clientNom,
        clientTelephone: body.clientTelephone,
        clientEmail: body.clientEmail ?? null,
        dateDebut,
        dateFin,
        dureeMinutes,
        objet: body.objet ?? null,
        adresse: body.adresse ?? null,
        notes: body.notes ?? null,
        statut: "CONFIRME", // artisan creates = auto-confirm
      },
    });

    return apiSuccess(rdv, 201);
  } catch (e: unknown) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("POST rdv error:", e);
    return apiError("Erreur serveur", 500);
  }
}
