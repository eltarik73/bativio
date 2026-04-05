import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFeature } from "@/lib/auth-server";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { JourSemaine } from "@prisma/client";

const JOUR_ORDER: JourSemaine[] = [
  "LUNDI",
  "MARDI",
  "MERCREDI",
  "JEUDI",
  "VENDREDI",
  "SAMEDI",
  "DIMANCHE",
];

export async function GET() {
  try {
    const { artisan } = await requireFeature("agenda");

    const disponibilites = await prisma.disponibiliteHebdo.findMany({
      where: { artisanId: artisan.id },
      orderBy: { jour: "asc" },
    });

    // Sort by logical day order
    disponibilites.sort(
      (a, b) => JOUR_ORDER.indexOf(a.jour) - JOUR_ORDER.indexOf(b.jour)
    );

    return apiSuccess(disponibilites);
  } catch (e: unknown) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("GET disponibilites error:", e);
    return apiError("Erreur serveur", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { artisan } = await requireFeature("agenda");

    const body: Array<{
      jour: JourSemaine;
      heureDebut: string;
      heureFin: string;
      pauseDebut?: string | null;
      pauseFin?: string | null;
      isActive: boolean;
      dureeSlot?: number;
    }> = await request.json();

    if (!Array.isArray(body)) {
      return apiError("Le body doit etre un tableau", 400);
    }

    const results = [];

    for (const item of body) {
      if (!item.jour || !item.heureDebut || !item.heureFin) {
        return apiError(
          "Chaque element doit avoir jour, heureDebut, heureFin",
          400
        );
      }

      if (!JOUR_ORDER.includes(item.jour)) {
        return apiError(`Jour invalide: ${item.jour}`, 400);
      }

      const upserted = await prisma.disponibiliteHebdo.upsert({
        where: {
          artisanId_jour: {
            artisanId: artisan.id,
            jour: item.jour,
          },
        },
        update: {
          heureDebut: item.heureDebut,
          heureFin: item.heureFin,
          pauseDebut: item.pauseDebut ?? null,
          pauseFin: item.pauseFin ?? null,
          isActive: item.isActive,
          dureeSlot: item.dureeSlot ?? 60,
        },
        create: {
          artisanId: artisan.id,
          jour: item.jour,
          heureDebut: item.heureDebut,
          heureFin: item.heureFin,
          pauseDebut: item.pauseDebut ?? null,
          pauseFin: item.pauseFin ?? null,
          isActive: item.isActive,
          dureeSlot: item.dureeSlot ?? 60,
        },
      });
      results.push(upserted);
    }

    // Return full updated list
    const disponibilites = await prisma.disponibiliteHebdo.findMany({
      where: { artisanId: artisan.id },
    });
    disponibilites.sort(
      (a, b) => JOUR_ORDER.indexOf(a.jour) - JOUR_ORDER.indexOf(b.jour)
    );

    return apiSuccess(disponibilites);
  } catch (e: unknown) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("PUT disponibilites error:", e);
    return apiError("Erreur serveur", 500);
  }
}
