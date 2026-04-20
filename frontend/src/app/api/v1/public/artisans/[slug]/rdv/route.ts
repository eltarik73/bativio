import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/html-escape";
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

function overlaps(
  slotStart: number,
  slotDuration: number,
  rdvDebutMinutes: number,
  rdvFinMinutes: number
): boolean {
  const slotEnd = slotStart + slotDuration;
  return slotStart < rdvFinMinutes && slotEnd > rdvDebutMinutes;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const body: {
      clientNom: string;
      clientTelephone: string;
      clientEmail?: string;
      dateDebut: string;
      objet?: string;
    } = await request.json();

    if (!body.clientNom || !body.clientTelephone || !body.dateDebut) {
      return apiError(
        "clientNom, clientTelephone et dateDebut sont requis",
        400
      );
    }

    // 1. Find artisan by slug
    const artisan = await prisma.artisan.findFirst({
      where: {
        slug,
        actif: true,
        visible: true,
        deletedAt: null,
      },
      include: { user: { select: { email: true } } },
    });

    if (!artisan) {
      return apiError("Artisan non trouve", 404);
    }

    const dateDebut = new Date(body.dateDebut);
    if (isNaN(dateDebut.getTime())) {
      return apiError("dateDebut invalide", 400);
    }

    // 2. Get slot duration from DisponibiliteHebdo for this day
    const dayIndex = dateDebut.getUTCDay();
    const jour = DAY_INDEX_TO_JOUR[dayIndex];

    const dispo = await prisma.disponibiliteHebdo.findUnique({
      where: {
        artisanId_jour: {
          artisanId: artisan.id,
          jour,
        },
      },
    });

    const slotDuration = dispo?.dureeSlot || 60;
    const dateFin = new Date(dateDebut.getTime() + slotDuration * 60000);

    // 3. Check the slot is still available
    const dateStr = dateDebut.toISOString().split("T")[0];
    const startOfDay = new Date(dateStr + "T00:00:00.000Z");
    const endOfDay = new Date(dateStr + "T23:59:59.999Z");

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

    const slotStartMinutes =
      dateDebut.getUTCHours() * 60 + dateDebut.getUTCMinutes();

    const isConflict = existingRdvs.some((rdv) => {
      const rdvDebut = new Date(rdv.dateDebut);
      const rdvFin = new Date(rdv.dateFin);
      const rdvDebutMin =
        rdvDebut.getUTCHours() * 60 + rdvDebut.getUTCMinutes();
      const rdvFinMin = rdvFin.getUTCHours() * 60 + rdvFin.getUTCMinutes();
      return overlaps(slotStartMinutes, slotDuration, rdvDebutMin, rdvFinMin);
    });

    if (isConflict) {
      return apiError("Ce creneau n'est plus disponible", 409);
    }

    // 4. Create RDV with statut EN_ATTENTE
    const rdv = await prisma.rendezVousBativio.create({
      data: {
        artisanId: artisan.id,
        clientNom: body.clientNom,
        clientTelephone: body.clientTelephone,
        clientEmail: body.clientEmail ?? null,
        dateDebut,
        dateFin,
        dureeMinutes: slotDuration,
        objet: body.objet ?? null,
        statut: "EN_ATTENTE",
      },
    });

    // 5. Send email to artisan (notification)
    const formattedDate = dateDebut.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = `${dateDebut.getUTCHours().toString().padStart(2, "0")}:${dateDebut.getUTCMinutes().toString().padStart(2, "0")}`;

    const safeClientNom = escapeHtml(body.clientNom);
    const safeClientTelephone = escapeHtml(body.clientTelephone);
    const safeClientEmail = body.clientEmail ? escapeHtml(body.clientEmail) : "";
    const safeObjet = body.objet ? escapeHtml(body.objet) : "";
    const safeArtisanNom = escapeHtml(artisan.nomAffichage);

    await sendEmail(
      artisan.user.email,
      `Nouveau RDV de ${body.clientNom}`,
      `<h2>Nouveau rendez-vous</h2>
      <p><strong>Client :</strong> ${safeClientNom}</p>
      <p><strong>Telephone :</strong> ${safeClientTelephone}</p>
      ${safeClientEmail ? `<p><strong>Email :</strong> ${safeClientEmail}</p>` : ""}
      <p><strong>Date :</strong> ${formattedDate} a ${formattedTime}</p>
      ${safeObjet ? `<p><strong>Objet :</strong> ${safeObjet}</p>` : ""}
      <p>Connectez-vous a votre espace Bativio pour confirmer ou modifier ce rendez-vous.</p>`
    );

    // 6. Send email confirmation to client (if email provided)
    if (body.clientEmail) {
      await sendEmail(
        body.clientEmail,
        `Confirmation de votre demande de RDV - ${artisan.nomAffichage}`,
        `<h2>Votre demande de rendez-vous</h2>
        <p>Bonjour ${safeClientNom},</p>
        <p>Votre demande de rendez-vous avec <strong>${safeArtisanNom}</strong> a bien ete enregistree.</p>
        <p><strong>Date :</strong> ${formattedDate} a ${formattedTime}</p>
        ${safeObjet ? `<p><strong>Objet :</strong> ${safeObjet}</p>` : ""}
        <p>L'artisan reviendra vers vous pour confirmer le rendez-vous.</p>
        <p>A bientot,<br>L'equipe Bativio</p>`
      );
    }

    // 7. Return the RDV
    return apiSuccess(rdv, 201);
  } catch (e: unknown) {
    console.error("POST public rdv error:", e);
    return apiError("Erreur serveur", 500);
  }
}
