import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { rateLimitAi, getClientIp } from "@/lib/rate-limit";
import crypto from "crypto";

/**
 * POST /api/v1/public/avis
 *
 * Dépose un avis client VÉRIFIÉ : nécessite le `viewToken` du devis ACCEPTE.
 * 1 avis par devis (unique constraint en DB).
 *
 * Vérification :
 * - viewToken doit exister et correspondre à un devis ACCEPTE
 * - Pas d'avis déjà déposé pour ce devis
 * - Note 1-5 obligatoire, commentaire optionnel
 *
 * Modération : créé avec `publiqueAt = NULL` (admin valide ensuite).
 */
const bodySchema = z.object({
  viewToken: z.string().min(8),
  note: z.number().int().min(1).max(5),
  commentaire: z.string().max(2000).optional().nullable(),
  clientNomAffiche: z.string().min(2).max(80),
  clientVille: z.string().max(80).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate-limit (anti-spam)
    const ip = getClientIp(request);
    const limit = await rateLimitAi(ip);
    if (!limit.success) {
      return apiError(`Trop de tentatives. Réessayez après ${new Date(limit.reset).toLocaleTimeString("fr-FR")}.`, 429);
    }

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Paramètres invalides", 400);
    }

    // Vérification devis : doit exister et ACCEPTE
    const devis = await prisma.devis.findUnique({
      where: { viewToken: parsed.data.viewToken },
      include: { avis: true },
    });
    if (!devis) return apiError("Devis introuvable", 404);
    if (devis.statut !== "ACCEPTE") {
      return apiError("Vous ne pouvez déposer un avis que sur un devis accepté.", 403);
    }
    if (devis.avis) {
      return apiError("Un avis a déjà été déposé pour ce devis.", 409);
    }

    // Hash IP (anti-fraude, RGPD-safe : pas l'IP brute en DB)
    const ipHash = crypto.createHash("sha256").update(ip + (process.env.IP_HASH_SALT || "bativio-salt")).digest("hex");

    const avis = await prisma.avis.create({
      data: {
        artisanId: devis.artisanId,
        devisId: devis.id,
        note: parsed.data.note,
        commentaire: parsed.data.commentaire ?? null,
        clientNomAffiche: parsed.data.clientNomAffiche,
        clientVille: parsed.data.clientVille ?? null,
        source: "EMAIL_AUTO",
        ipHash,
        // publiqueAt = NULL → en attente modération admin
      },
      select: { id: true, note: true, createdAt: true },
    });

    return apiSuccess({
      ok: true,
      message: "Merci ! Votre avis sera publié sous 48h après modération.",
      avis,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[POST /api/v1/public/avis]", err);
    return apiError(err.message || "Erreur serveur", 500);
  }
}

/**
 * GET /api/v1/public/avis?artisanId=xxx
 *
 * Liste les avis publics d'un artisan (publiqueAt non null).
 * Inclut moyenne + count + distribution notes.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artisanId = searchParams.get("artisanId");
    if (!artisanId) return apiError("artisanId requis", 400);

    const avis = await prisma.avis.findMany({
      where: { artisanId, publiqueAt: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        note: true,
        commentaire: true,
        reponseArtisan: true,
        clientNomAffiche: true,
        clientVille: true,
        createdAt: true,
      },
    });

    const aggregate = await prisma.avis.aggregate({
      where: { artisanId, publiqueAt: { not: null } },
      _avg: { note: true },
      _count: { _all: true },
    });

    const byNote = await prisma.avis.groupBy({
      by: ["note"],
      where: { artisanId, publiqueAt: { not: null } },
      _count: true,
    });

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const row of byNote) distribution[row.note] = row._count;

    return apiSuccess({
      avis,
      moyenne: aggregate._avg.note ? Math.round(aggregate._avg.note * 10) / 10 : null,
      total: aggregate._count._all,
      distribution,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[GET /api/v1/public/avis]", err);
    return apiError("Erreur serveur", 500);
  }
}
