import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

const createSchema = z.object({
  nom: z.string().min(1, "Le nom du chantier est requis"),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  clientNom: z.string().optional(),
  clientTelephone: z.string().optional(),
  couleur: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#C4531A"),
  dateDebut: z.string().min(1, "La date de d\u00e9but est requise"),
  dateFin: z.string().min(1, "La date de fin est requise"),
  heureDebut: z.string().optional(),
  heureFin: z.string().optional(),
  notes: z.string().optional(),
  statut: z.enum(["PLANIFIE", "EN_COURS", "TERMINE", "ANNULE", "REPORTE"]).optional(),
  devisId: z.string().optional(),
  montantDevis: z.number().optional(),
});

// GET — list chantiers + RDVs for a date range
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const artisan = await prisma.artisan.findUnique({ where: { userId: session.userId } });
    if (!artisan || artisan.deletedAt) return apiError("Artisan introuvable", 404);

    const searchParams = request.nextUrl.searchParams;
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) return apiError("Param\u00e8tres start et end requis", 400);

    const startDate = new Date(start + "T00:00:00Z");
    const endDate = new Date(end + "T23:59:59Z");

    const [chantiers, rdvs] = await Promise.all([
      prisma.chantier.findMany({
        where: {
          artisanId: artisan.id,
          dateDebut: { lte: endDate },
          dateFin: { gte: startDate },
        },
        include: { collaborateurs: true },
        orderBy: { dateDebut: "asc" },
      }),
      prisma.rendezVousBativio.findMany({
        where: {
          artisanId: artisan.id,
          dateDebut: { gte: startDate, lte: endDate },
        },
        orderBy: { dateDebut: "asc" },
      }),
    ]);

    return apiSuccess({ chantiers, rdvs });
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("GET chantiers error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}

// POST — create a chantier
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const artisan = await prisma.artisan.findUnique({ where: { userId: session.userId } });
    if (!artisan || artisan.deletedAt) return apiError("Artisan introuvable", 404);

    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Donn\u00e9es invalides", 400);
    }

    const data = parsed.data;
    const dateDebut = new Date(data.dateDebut);
    const dateFin = new Date(data.dateFin);

    if (dateFin < dateDebut) {
      return apiError("La date de fin doit \u00eatre apr\u00e8s la date de d\u00e9but", 400);
    }

    const chantier = await prisma.chantier.create({
      data: {
        artisanId: artisan.id,
        nom: data.nom,
        adresse: data.adresse || null,
        ville: data.ville || null,
        clientNom: data.clientNom || null,
        clientTelephone: data.clientTelephone || null,
        couleur: data.couleur,
        dateDebut,
        dateFin,
        heureDebut: data.heureDebut || null,
        heureFin: data.heureFin || null,
        notes: data.notes || null,
        statut: data.statut || "PLANIFIE",
        devisId: data.devisId || null,
        montantDevis: data.montantDevis ?? null,
      },
    });

    return apiSuccess(chantier, 201);
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("POST chantier error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}
