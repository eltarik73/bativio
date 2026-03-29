import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { JourSemaine } from "@prisma/client";

const DAY_INDEX_TO_JOUR: JourSemaine[] = [
  "DIMANCHE",
  "LUNDI",
  "MARDI",
  "MERCREDI",
  "JEUDI",
  "VENDREDI",
  "SAMEDI",
];

function parseTime(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function overlaps(
  slotStart: number,
  slotDuration: number,
  rdvDebutMinutes: number,
  rdvFinMinutes: number
): boolean {
  const slotEnd = slotStart + slotDuration;
  return slotStart < rdvFinMinutes && slotEnd > rdvDebutMinutes;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const dateStr = request.nextUrl.searchParams.get("date");

    if (!dateStr) {
      return apiError("Le parametre date est requis (format: YYYY-MM-DD)", 400);
    }

    const date = new Date(dateStr + "T00:00:00");
    if (isNaN(date.getTime())) {
      return apiError("Date invalide", 400);
    }

    // 1. Find artisan by slug (actif, visible)
    const artisan = await prisma.artisan.findFirst({
      where: {
        slug,
        actif: true,
        visible: true,
        deletedAt: null,
      },
    });

    if (!artisan) {
      return apiError("Artisan non trouve", 404);
    }

    // 2. Get day of week and map to JourSemaine
    const dayIndex = date.getDay(); // 0=Sunday ... 6=Saturday
    const jour = DAY_INDEX_TO_JOUR[dayIndex];

    // 3. Find DisponibiliteHebdo for that artisan + jour
    const dispo = await prisma.disponibiliteHebdo.findUnique({
      where: {
        artisanId_jour: {
          artisanId: artisan.id,
          jour,
        },
      },
    });

    // 4. If not found or not active -> empty array
    if (!dispo || !dispo.isActive) {
      return apiSuccess([]);
    }

    // 5. Check JourFerie for that date
    const startOfDay = new Date(dateStr + "T00:00:00.000Z");
    const endOfDay = new Date(dateStr + "T23:59:59.999Z");

    const jourFerie = await prisma.jourFerie.findFirst({
      where: {
        artisanId: artisan.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (jourFerie) {
      return apiSuccess([]);
    }

    // 6. Get existing RDV for that date (statut not ANNULE)
    const existingRdvs = await prisma.rendezVousBativio.findMany({
      where: {
        artisanId: artisan.id,
        dateDebut: {
          gte: startOfDay,
          lte: endOfDay,
        },
        statut: {
          not: "ANNULE",
        },
      },
    });

    // Convert RDVs to minutes-since-midnight for overlap checking
    const rdvMinutes = existingRdvs.map((rdv) => {
      const debutDate = new Date(rdv.dateDebut);
      const finDate = new Date(rdv.dateFin);
      return {
        debutMinutes: debutDate.getUTCHours() * 60 + debutDate.getUTCMinutes(),
        finMinutes: finDate.getUTCHours() * 60 + finDate.getUTCMinutes(),
      };
    });

    // 7. Generate slots
    const slots: Array<{
      heureDebut: string;
      heureFin: string;
      disponible: boolean;
    }> = [];

    let current = parseTime(dispo.heureDebut);
    const end = parseTime(dispo.heureFin);
    const slotDuration = dispo.dureeSlot || 60;
    const pauseStart = dispo.pauseDebut ? parseTime(dispo.pauseDebut) : null;
    const pauseEnd = dispo.pauseFin ? parseTime(dispo.pauseFin) : null;

    while (current + slotDuration <= end) {
      // Skip pause
      if (
        pauseStart !== null &&
        pauseEnd !== null &&
        current >= pauseStart &&
        current < pauseEnd
      ) {
        current = pauseEnd;
        continue;
      }

      // Check if slot is taken by existing RDV
      const isTaken = rdvMinutes.some((rdv) =>
        overlaps(current, slotDuration, rdv.debutMinutes, rdv.finMinutes)
      );

      slots.push({
        heureDebut: formatTime(current),
        heureFin: formatTime(current + slotDuration),
        disponible: !isTaken,
      });

      current += slotDuration;
    }

    return apiSuccess(slots);
  } catch (e: unknown) {
    console.error("GET creneaux error:", e);
    return apiError("Erreur serveur", 500);
  }
}
