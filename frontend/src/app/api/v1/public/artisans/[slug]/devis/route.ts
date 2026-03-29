import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { sendEmail } from "@/lib/email";
import { sendSmsWithQuota, smsTemplates } from "@/lib/sms";
import { z } from "zod";
import crypto from "crypto";

const devisSchema = z.object({
  nomClient: z.string().min(1, "Le nom est requis"),
  telephoneClient: z.string().min(1, "Le téléphone est requis"),
  emailClient: z.string().email("Email invalide").optional().or(z.literal("")),
  descriptionBesoin: z.string().min(1, "La description du besoin est requise"),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const parsed = devisSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { nomClient, telephoneClient, emailClient, descriptionBesoin } =
      parsed.data;

    // Find artisan by slug
    const artisan = await prisma.artisan.findFirst({
      where: {
        slug,
        actif: true,
        visible: true,
        deletedAt: null,
      },
      include: {
        user: { select: { email: true } },
      },
    });

    if (!artisan) {
      return apiError("Artisan non trouvé", 404);
    }

    // Generate unique response token
    const responseToken = crypto.randomUUID();

    // Create DemandeDevis
    const demandeDevis = await prisma.demandeDevis.create({
      data: {
        artisanId: artisan.id,
        nomClient,
        telephoneClient,
        emailClient: emailClient || null,
        descriptionBesoin,
        responseToken,
      },
    });

    // Create notification for artisan
    await prisma.notification.create({
      data: {
        artisanId: artisan.id,
        type: "DEMANDE_DEVIS",
        titre: "Nouvelle demande de devis",
        message: `${nomClient} vous a envoyé une demande de devis : "${descriptionBesoin.substring(0, 100)}${descriptionBesoin.length > 100 ? "..." : ""}"`,
      },
    });

    // Send email to artisan
    await sendEmail(
      artisan.user.email,
      `Nouvelle demande de devis de ${nomClient}`,
      `
          <div style="font-family: Karla, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #C4531A;">Nouvelle demande de devis</h2>
            <p>Bonjour <strong>${artisan.nomAffichage}</strong>,</p>
            <p>Vous avez reçu une nouvelle demande de devis sur votre page Bativio.</p>
            <div style="background: #FAF8F5; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Client :</strong> ${nomClient}</p>
              <p><strong>Téléphone :</strong> ${telephoneClient}</p>
              ${emailClient ? `<p><strong>Email :</strong> ${emailClient}</p>` : ""}
              <p><strong>Besoin :</strong></p>
              <p>${descriptionBesoin}</p>
            </div>
            <p>Répondez rapidement pour maximiser vos chances de décrocher ce chantier !</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://bativio.fr"}/dashboard/devis/${demandeDevis.id}"
               style="display: inline-block; background: #C4531A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 8px;">
              Voir la demande
            </a>
            <p style="color: #666; font-size: 12px; margin-top: 24px;">
              — L'équipe Bativio
            </p>
          </div>
        `,
    );

    // Send SMS to artisan (critical notification)
    if (artisan.telephone) {
      await sendSmsWithQuota({
        artisanId: artisan.id,
        artisanPlan: artisan.plan,
        to: artisan.telephone,
        content: smsTemplates.nouveauDevisUrgent(nomClient),
        artisanEmail: artisan.user.email,
      }).catch(() => {});
    }

    return apiSuccess(
      {
        id: demandeDevis.id,
        message: "Votre demande de devis a été envoyée avec succès",
      },
      201
    );
  } catch (error) {
    console.error("POST /api/v1/public/artisans/[slug]/devis error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
