import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { runPreDevisAgent } from "@/lib/agents/pre-devis-agent";

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
