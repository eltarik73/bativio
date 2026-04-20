import { NextRequest } from "next/server";
import { z } from "zod";
import { Prisma, Plan } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";
import { sendEmail } from "@/lib/email";

const bodySchema = z.object({
  mode: z.enum(["MANUAL", "AUTO_CONCERNES", "AUTO_TOUS", "AUTO_PRO", "AUTO_BUSINESS"]),
  artisanIds: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return apiError("Paramètres invalides", 400);

    const demande = await prisma.demandeProjet.findUnique({ where: { id } });
    if (!demande) return apiError("Demande introuvable", 404);

    let targetIds: string[] = [];

    if (parsed.data.mode === "MANUAL") {
      if (!parsed.data.artisanIds || parsed.data.artisanIds.length === 0) {
        return apiError("Sélection vide", 400);
      }
      targetIds = parsed.data.artisanIds;
    } else {
      const where: Prisma.ArtisanWhereInput = {
        deletedAt: null,
        actif: true,
        visible: true,
      };

      if (parsed.data.mode === "AUTO_CONCERNES" || parsed.data.mode === "AUTO_PRO" || parsed.data.mode === "AUTO_BUSINESS") {
        if (demande.metierDetecte) where.metier = { slug: demande.metierDetecte };
        if (demande.villeSlug) where.villeSlug = demande.villeSlug;
      }

      if (parsed.data.mode === "AUTO_PRO") where.plan = { in: [Plan.PRO, Plan.PRO_PLUS, Plan.BUSINESS] };
      if (parsed.data.mode === "AUTO_BUSINESS") where.plan = { in: [Plan.BUSINESS] };

      const artisans = await prisma.artisan.findMany({
        where,
        select: { id: true },
        take: 20,
      });
      targetIds = artisans.map((a) => a.id);
    }

    if (targetIds.length === 0) {
      return apiError("Aucun artisan cible trouvé", 400);
    }

    // Crée les envois en masse (upsert pour éviter doublons si déjà routé)
    const envois = await Promise.all(
      targetIds.map((artisanId) =>
        prisma.demandeEnvoi.upsert({
          where: { demandeId_artisanId: { demandeId: id, artisanId } },
          update: { sentAt: new Date() },
          create: { demandeId: id, artisanId },
        })
      )
    );

    // Met à jour statut et meta
    const updated = await prisma.demandeProjet.update({
      where: { id },
      data: {
        statut: "ROUTEE",
        modeRoutage: parsed.data.mode === "MANUAL" ? "MANUEL" : parsed.data.mode,
        routageBy: session.userId,
        routageAt: new Date(),
      },
    });

    // Envoi emails + notifications in-app aux artisans (non bloquant)
    void notifyArtisans(id, targetIds, demande.description, demande.villeLabel, demande.metierDetecte);

    return apiSuccess({
      demande: updated,
      envoyesA: envois.length,
      artisanIds: targetIds,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces admin requis", 403);
    console.error("Route demande error:", err);
    return apiError("Erreur serveur", 500);
  }
}

async function notifyArtisans(
  demandeId: string,
  artisanIds: string[],
  description: string,
  villeLabel: string | null,
  metier: string | null,
) {
  try {
    const artisans = await prisma.artisan.findMany({
      where: { id: { in: artisanIds } },
      include: { user: { select: { email: true } } },
    });

    const projetSummary = description.slice(0, 150);
    const url = `https://bativio.fr/dashboard/demandes-projets`;

    await Promise.all(
      artisans.map(async (a) => {
        await prisma.notification.create({
          data: {
            artisanId: a.id,
            type: "DEMANDE_DEVIS",
            titre: `Nouvelle demande ${metier ? metier : "projet"}${villeLabel ? ` à ${villeLabel}` : ""}`,
            message: projetSummary,
          },
        }).catch(() => null);

        if (a.user?.email) {
          const html = `
            <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
              <h2 style="color: #C4531A; font-family: Georgia, serif;">Nouvelle demande de devis via Bativio</h2>
              <p style="color: #3D2E1F; font-size: 15px; line-height: 1.5;">
                Bonjour <strong>${a.nomAffichage}</strong>,<br><br>
                L'équipe Bativio a sélectionné votre profil pour cette nouvelle demande :
              </p>
              <div style="background: #FAF8F5; padding: 20px; border-radius: 10px; border-left: 4px solid #C4531A; margin: 20px 0;">
                <div style="font-size: 12px; letter-spacing: 1px; color: #C4531A; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">${metier || "Projet"}${villeLabel ? ` — ${villeLabel}` : ""}</div>
                <div style="font-size: 15px; color: #3D2E1F; font-style: italic;">« ${projetSummary}${description.length > 150 ? "…" : ""} »</div>
              </div>
              <p style="color: #6B6560; font-size: 13px;">
                Connectez-vous à votre espace pro pour consulter la qualification complète et générer un devis IA en 1 clic.
              </p>
              <a href="${url}" style="display: inline-block; background: #C4531A; color: #fff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; margin-top: 12px;">Voir la demande</a>
              <p style="color: #9C958D; font-size: 12px; margin-top: 32px; border-top: 1px solid #EDEBE7; padding-top: 16px;">
                Astuce : les premiers à répondre convertissent le plus.<br>
                L'équipe Bativio.
              </p>
            </div>
          `;
          await sendEmail(
            a.user.email,
            `Nouvelle demande ${metier || "projet"}${villeLabel ? ` à ${villeLabel}` : ""} — Bativio`,
            html,
          ).catch((e) => console.error("Email artisan failed:", e));
        }
      }),
    );
  } catch (e) {
    console.error("notifyArtisans error:", e);
  }
}
