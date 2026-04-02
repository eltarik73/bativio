import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { getLeadLimit } from "@/lib/lead-limits";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "0", 10);
    const size = parseInt(searchParams.get("size") || "20", 10);

    const where = {
      artisanId: artisan.id,
      ...(status
        ? {
            statut: status as
              | "NOUVEAU"
              | "VU"
              | "REPONDU"
              | "ACCEPTE"
              | "REFUSE"
              | "ARCHIVE",
          }
        : {}),
    };

    const [demandes, total] = await Promise.all([
      prisma.demandeDevis.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: page * size,
        take: size,
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              createdAt: true,
            },
          },
          _count: {
            select: { messages: true },
          },
        },
      }),
      prisma.demandeDevis.count({ where }),
    ]);

    // Determine lead limit for this artisan's plan
    const leadLimit = getLeadLimit(artisan.plan);

    // To determine rank: count all demandes created before each one
    // We need total demandes ordered by createdAt ASC to assign rank
    const allDemandeIds = await prisma.demandeDevis.findMany({
      where: { artisanId: artisan.id },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    // Build a map from demande id -> rank (1-based)
    const rankMap = new Map<string, number>();
    allDemandeIds.forEach((d, idx) => {
      rankMap.set(d.id, idx + 1);
    });

    let masqueCount = 0;

    const result = demandes.map((d) => {
      const rank = rankMap.get(d.id) ?? 1;
      const masked =
        leadLimit !== null && rank > leadLimit;
      if (masked) masqueCount++;
      return {
        id: d.id,
        nomClient: masked ? null : d.nomClient,
        telephoneClient: masked ? null : d.telephoneClient,
        emailClient: masked ? null : d.emailClient,
        clientVille: d.clientVille,
        descriptionBesoin: d.descriptionBesoin,
        urgence: d.urgence,
        statut: d.statut,
        reponduAt: d.reponduAt,
        createdAt: d.createdAt,
        messageCount: d._count.messages,
        lastMessageAt: d.messages[0]?.createdAt || null,
        masque: masked,
      };
    });

    // Also compute total masked across ALL demandes (not just this page)
    const totalMasque =
      leadLimit !== null
        ? Math.max(0, allDemandeIds.length - leadLimit)
        : 0;

    return apiSuccess({
      demandes: result,
      masqueCount: totalMasque,
      pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("GET /api/v1/artisan/demandes error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
