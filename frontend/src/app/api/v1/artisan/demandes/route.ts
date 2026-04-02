import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

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

    const result = demandes.map((d) => ({
      id: d.id,
      nomClient: d.nomClient,
      telephoneClient: d.telephoneClient,
      emailClient: d.emailClient,
      clientVille: d.clientVille,
      descriptionBesoin: d.descriptionBesoin,
      urgence: d.urgence,
      statut: d.statut,
      reponduAt: d.reponduAt,
      createdAt: d.createdAt,
      messageCount: d._count.messages,
      lastMessageAt: d.messages[0]?.createdAt || null,
    }));

    return apiSuccess({
      demandes: result,
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
