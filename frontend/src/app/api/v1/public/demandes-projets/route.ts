import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { runPreDevisAgent } from "@/lib/agents/pre-devis-agent";
import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/html-escape";
import { rateLimitAi, getClientIp } from "@/lib/rate-limit";

const bodySchema = z.object({
  description: z.string().min(5).max(3000),
  villeLabel: z.string().optional().nullable(),
  villeSlug: z.string().optional().nullable(),
  lat: z.number().optional().nullable(),
  lon: z.number().optional().nullable(),
  metierDetecte: z.string().optional().nullable(),
  qualifJson: z.record(z.string(), z.unknown()).optional().nullable(),
  photos: z.array(z.string().url()).max(10).optional().nullable(),
  contactNom: z.string().min(2).max(120),
  contactEmail: z.string().email(),
  contactTel: z.string().min(6).max(30),
  source: z.string().max(60).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    // SÉCU: rate-limit IA (cet endpoint déclenche pre-devis Sonnet)
    const ip = getClientIp(request);
    const limit = await rateLimitAi(ip);
    if (!limit.success) {
      return apiError(`Trop de requêtes. Réessayez après ${new Date(limit.reset).toLocaleTimeString("fr-FR")}.`, 429);
    }

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Paramètres invalides", 400);
    }
    const data = parsed.data;

    function stripHtml(s: string): string { return s.replace(/<[^>]*>/g, "").trim(); }

    const demande = await prisma.demandeProjet.create({
      data: {
        description: stripHtml(data.description),
        villeLabel: data.villeLabel ?? null,
        villeSlug: data.villeSlug ?? null,
        lat: data.lat ?? null,
        lon: data.lon ?? null,
        metierDetecte: data.metierDetecte ?? null,
        ...(data.qualifJson ? { qualifJson: data.qualifJson as object } : {}),
        ...(data.photos && data.photos.length > 0 ? { photos: data.photos as unknown as object } : {}),
        contactNom: stripHtml(data.contactNom),
        contactEmail: data.contactEmail,
        contactTel: stripHtml(data.contactTel),
        source: data.source ?? "landing",
        statut: "NOUVELLE",
      },
    });

    // Agent 2 pré-devis (non bloquant en cas d'erreur)
    let preDevis = null;
    let qualifScore = 60;
    try {
      if (data.metierDetecte && data.qualifJson) {
        const collected: Record<string, string> = {};
        for (const [k, v] of Object.entries(data.qualifJson)) {
          if (typeof v === "string") collected[k] = v;
        }
        const pre = await runPreDevisAgent({
          metier: data.metierDetecte,
          description: data.description,
          qualifData: collected,
          ville: data.villeLabel,
          demandeId: demande.id,
        });
        preDevis = pre.response;
        qualifScore = 85;

        await prisma.demandeProjet.update({
          where: { id: demande.id },
          data: {
            preDevisJson: preDevis as unknown as object,
            qualifScore,
          },
        });
      }
    } catch (e) {
      console.error("Pré-devis échoué (non bloquant):", e);
    }

    // Email confirmation client (non bloquant, escape user-controlled content)
    const safeContactNom = escapeHtml(data.contactNom);
    const safeVilleLabel = data.villeLabel ? escapeHtml(data.villeLabel) : "";
    const safeDescription = escapeHtml(data.description.slice(0, 200));
    const safeDisclaimer = preDevis?.disclaimer ? escapeHtml(preDevis.disclaimer) : "";
    // AWAIT obligatoire (Vercel kill la fonction serverless avant que
    // le fetch Brevo ne se termine). sendEmail ne throw jamais (fail-safe).
    await sendEmail(
      data.contactEmail,
      "Votre demande Bativio a bien été reçue",
      `<div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #C4531A; font-family: Georgia, serif;">Merci ${safeContactNom}</h2>
        <p style="color: #3D2E1F; font-size: 15px; line-height: 1.6;">
          Votre demande a bien été reçue. L'équipe Bativio l'examine et va contacter
          les artisans les plus pertinents de ${safeVilleLabel || "votre région"} sous 24h.
        </p>
        <div style="background: #FAF8F5; padding: 16px; border-radius: 10px; border-left: 4px solid #C4531A; margin: 20px 0;">
          <div style="font-size: 11px; letter-spacing: 1px; color: #9C958D; text-transform: uppercase; margin-bottom: 6px;">Votre projet</div>
          <div style="font-size: 14px; color: #3D2E1F; font-style: italic;">« ${safeDescription}${data.description.length > 200 ? "…" : ""} »</div>
        </div>
        ${preDevis?.fourchetteHt ? `
          <div style="background: linear-gradient(135deg, rgba(196,83,26,.06), rgba(201,148,58,.04)); padding: 16px; border-radius: 10px; margin: 20px 0;">
            <div style="font-size: 11px; letter-spacing: 1.5px; color: #C4531A; text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Estimation indicative</div>
            <div style="font-size: 22px; color: #3D2E1F; font-weight: 600; font-family: Georgia, serif;">
              ${preDevis.fourchetteHt.min.toLocaleString("fr-FR")}–${preDevis.fourchetteHt.max.toLocaleString("fr-FR")} € HT
            </div>
            <div style="font-size: 12px; color: #6B6560; margin-top: 4px;">${safeDisclaimer}</div>
          </div>
        ` : ""}
        <p style="color: #6B6560; font-size: 13px;">
          <strong>Prochaines étapes :</strong><br>
          1. Notre équipe vérifie votre demande<br>
          2. Nous sélectionnons 3 à 5 artisans vérifiés<br>
          3. Ils vous contactent directement par téléphone ou email
        </p>
        <p style="color: #9C958D; font-size: 12px; margin-top: 32px;">
          Référence : <code style="background: #EDEBE7; padding: 2px 6px; border-radius: 4px;">${demande.id.slice(-10).toUpperCase()}</code><br>
          L'équipe Bativio — contact@bativio.fr
        </p>
      </div>`,
    ).catch((e) => console.error("Email client conf failed:", e));

    return apiSuccess({
      id: demande.id,
      statut: demande.statut,
      preDevis,
      qualifScore,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("POST /demandes-projets error:", err);
    return apiError(err.message || "Erreur création demande", 500);
  }
}
