import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { sendEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    // Verify CRON_SECRET
    const cronSecret = request.headers.get("x-cron-secret");
    if (!process.env.CRON_SECRET || cronSecret !== process.env.CRON_SECRET) {
      return apiError("Non autorise", 401);
    }

    // Find all RDV for tomorrow with statut CONFIRME and rappelSmsEnvoye = false
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowStart = new Date(
      `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, "0")}-${tomorrow.getDate().toString().padStart(2, "0")}T00:00:00.000Z`
    );
    const tomorrowEnd = new Date(
      `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, "0")}-${tomorrow.getDate().toString().padStart(2, "0")}T23:59:59.999Z`
    );

    const rdvs = await prisma.rendezVousBativio.findMany({
      where: {
        dateDebut: {
          gte: tomorrowStart,
          lte: tomorrowEnd,
        },
        statut: "CONFIRME",
        rappelSmsEnvoye: false,
      },
      include: {
        artisan: {
          select: {
            nomAffichage: true,
            telephone: true,
          },
        },
      },
    });

    let remindersSent = 0;

    for (const rdv of rdvs) {
      const formattedDate = rdv.dateDebut.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = `${rdv.dateDebut.getUTCHours().toString().padStart(2, "0")}:${rdv.dateDebut.getUTCMinutes().toString().padStart(2, "0")}`;

      // Send reminder email to client (if email available)
      if (rdv.clientEmail) {
        await sendEmail(
          rdv.clientEmail,
          `Rappel : votre RDV demain avec ${rdv.artisan.nomAffichage}`,
          `<h2>Rappel de rendez-vous</h2>
          <p>Bonjour ${rdv.clientNom},</p>
          <p>Nous vous rappelons votre rendez-vous demain avec <strong>${rdv.artisan.nomAffichage}</strong>.</p>
          <p><strong>Date :</strong> ${formattedDate} a ${formattedTime}</p>
          ${rdv.objet ? `<p><strong>Objet :</strong> ${rdv.objet}</p>` : ""}
          ${rdv.adresse ? `<p><strong>Adresse :</strong> ${rdv.adresse}</p>` : ""}
          <p>A demain !<br>L'equipe Bativio</p>`
        );
      }

      // Mark as reminder sent
      await prisma.rendezVousBativio.update({
        where: { id: rdv.id },
        data: { rappelSmsEnvoye: true },
      });

      remindersSent++;
    }

    return apiSuccess({
      message: `${remindersSent} rappel(s) envoye(s)`,
      count: remindersSent,
    });
  } catch (e: unknown) {
    console.error("CRON rappels-rdv error:", e);
    return apiError("Erreur serveur", 500);
  }
}
