import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

// GET /api/v1/admin/artisans/[id] — Read full artisan record (admin edit form)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const artisan = await prisma.artisan.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, role: true, createdAt: true } },
        metier: { select: { id: true, nom: true, slug: true } },
      },
    });
    if (!artisan) return apiError("Artisan introuvable", 404);
    return apiSuccess(artisan);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin GET artisan error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}

// PATCH /api/v1/admin/artisans/[id] — Edit any field on an artisan
//
// Used by /admin/artisans/[id] form to fix data quality issues (invalid SIRET,
// wrong status, missing phone, etc.) without going through the
// validation/reject flow. Status changes here bypass the scoring pipeline,
// so use with care.
const patchSchema = z.object({
  // Identity
  siret: z.string().regex(/^\d{9,14}$/, "SIRET doit faire 9 ou 14 chiffres").optional(),
  raisonSociale: z.string().max(200).nullable().optional(),
  nomAffichage: z.string().min(1).max(120).optional(),
  prenom: z.string().max(80).nullable().optional(),
  nom: z.string().max(80).nullable().optional(),
  metierId: z.string().nullable().optional(),

  // Description / contact
  description: z.string().max(5000).nullable().optional(),
  telephone: z.string().max(40).optional(),
  adresse: z.string().max(200).nullable().optional(),
  codePostal: z.string().max(10).nullable().optional(),
  ville: z.string().max(120).nullable().optional(),
  villeSlug: z.string().max(120).nullable().optional(),
  codeInsee: z.string().max(10).nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  zoneRayonKm: z.number().int().min(1).max(200).optional(),

  // Business profile
  experienceAnnees: z.number().int().min(0).max(80).nullable().optional(),
  metierSlugSeo: z.string().max(120).nullable().optional(),

  // Visibility / status (admin override — bypasses scoring)
  actif: z.boolean().optional(),
  visible: z.boolean().optional(),
  artisanStatus: z
    .enum(["ONBOARDING", "PENDING_NAF_REVIEW", "PENDING_REVIEW", "ACTIVE", "REJECTED", "INACTIVE"])
    .optional(),
  motifRefus: z.string().max(2000).nullable().optional(),

  // Plan override
  planOverride: z.enum(["GRATUIT", "STARTER", "PRO", "BUSINESS"]).nullable().optional(),
  planOverrideRaison: z.string().max(500).nullable().optional(),
  planOverrideExpireAt: z.string().datetime().nullable().optional(),

  // SEO / vitrine
  seoTitle: z.string().max(200).nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
  horairesTexte: z.string().max(500).nullable().optional(),
  zoneTexte: z.string().max(500).nullable().optional(),

  // External links
  googleBusinessUrl: z.string().url().nullable().optional(),
  facebookUrl: z.string().url().nullable().optional(),
  instagramUrl: z.string().url().nullable().optional(),
  siteWebUrl: z.string().url().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    const body = await req.json().catch(() => null);
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const fieldErrors = flat.fieldErrors as Record<string, string[] | undefined>;
      const firstField = Object.keys(fieldErrors)[0];
      const firstMsg = firstField
        ? `${firstField}: ${fieldErrors[firstField]?.[0] || "invalide"}`
        : flat.formErrors[0] || "Payload invalide";
      return apiError(firstMsg, 400);
    }
    const data = parsed.data;

    const existing = await prisma.artisan.findUnique({ where: { id } });
    if (!existing) return apiError("Artisan introuvable", 404);

    // If SIRET is changing, ensure no collision
    if (data.siret && data.siret !== existing.siret) {
      const collision = await prisma.artisan.findUnique({ where: { siret: data.siret } });
      if (collision && collision.id !== id) {
        return apiError(`Un autre artisan utilise déjà le SIRET ${data.siret}`, 409);
      }
    }

    // If the admin manually flips to ACTIVE, also set actif=true and stamp validation.
    const isActivating = data.artisanStatus === "ACTIVE" && existing.artisanStatus !== "ACTIVE";
    const updateData: Record<string, unknown> = { ...data };
    if (data.planOverrideExpireAt) {
      updateData.planOverrideExpireAt = new Date(data.planOverrideExpireAt);
    }
    if (isActivating) {
      updateData.actif = data.actif ?? true;
      updateData.validationDate = new Date();
      updateData.validatedBy = session.userId;
      updateData.motifRefus = data.motifRefus ?? null;
    }

    const updated = await prisma.artisan.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { email: true } },
        metier: { select: { id: true, nom: true, slug: true } },
      },
    });

    return apiSuccess(updated);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin PATCH artisan error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
