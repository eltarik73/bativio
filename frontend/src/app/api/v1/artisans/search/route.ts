import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const q = request.nextUrl.searchParams.get("q");

    if (!q || q.length < 2) return apiSuccess([]);

    const myArtisan = await prisma.artisan.findUnique({ where: { userId: session.userId } });

    const artisans = await prisma.artisan.findMany({
      where: {
        actif: true,
        deletedAt: null,
        ...(myArtisan ? { id: { not: myArtisan.id } } : {}),
        OR: [
          { nomAffichage: { contains: q, mode: "insensitive" } },
          { raisonSociale: { contains: q, mode: "insensitive" } },
          { user: { email: { contains: q, mode: "insensitive" } } },
        ],
      },
      include: {
        user: { select: { email: true } },
        metier: { select: { nom: true, icone: true } },
        photos: { take: 1, orderBy: { ordre: "asc" } },
      },
      take: 10,
      orderBy: { nomAffichage: "asc" },
    });

    const results = artisans.map((a) => ({
      id: a.id,
      nomAffichage: a.nomAffichage,
      email: a.user.email,
      metierNom: a.metier?.nom || null,
      metierIcone: a.metier?.icone || null,
      ville: a.ville,
      photo: a.photos[0]?.url || null,
    }));

    return apiSuccess(results);
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("GET artisans search error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}
