import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ville = searchParams.get("ville");
    const metier = searchParams.get("metier");
    const search = searchParams.get("search");
    const lat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
    const lon = searchParams.get("lon") ? parseFloat(searchParams.get("lon")!) : null;
    const radius = searchParams.get("radius") ? parseFloat(searchParams.get("radius")!) : 30;
    const page = parseInt(searchParams.get("page") || "0", 10);
    const size = parseInt(searchParams.get("size") || "20", 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      actif: true,
      visible: true,
      deletedAt: null,
    };

    // Filter by ville — resolve slug to display name first
    if (ville) {
      const villeRecord = await prisma.ville.findUnique({ where: { slug: ville } });
      if (villeRecord) {
        where.ville = { equals: villeRecord.nom, mode: "insensitive" };
      } else {
        where.ville = { equals: ville, mode: "insensitive" };
      }
    }

    // Filter by metier slug
    if (metier) {
      const metierRecord = await prisma.metier.findUnique({
        where: { slug: metier },
      });
      if (metierRecord) {
        where.metierId = metierRecord.id;
      } else {
        // Metier not found — return empty results
        return apiSuccess({
          content: [],
          totalElements: 0,
          totalPages: 0,
          page,
          size,
        });
      }
    }

    // Search on nomAffichage OR description (case-insensitive)
    if (search) {
      where.OR = [
        { nomAffichage: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [artisans, totalElements] = await Promise.all([
      prisma.artisan.findMany({
        where,
        include: {
          metier: true,
          photos: {
            take: 3,
            orderBy: { ordre: "asc" },
          },
          badges: true,
        },
        orderBy: { noteMoyenne: "desc" },
        skip: page * size,
        take: size,
      }),
      prisma.artisan.count({ where }),
    ]);

    const totalPages = Math.ceil(totalElements / size);

    // If geo coordinates provided, calculate distance and sort
    let sortedArtisans = artisans;
    if (lat && lon) {
      sortedArtisans = artisans
        .map((a) => ({
          ...a,
          _distance: a.latitude && a.longitude
            ? haversine(lat, lon, a.latitude, a.longitude)
            : 9999,
        }))
        .filter((a) => a._distance <= radius)
        .sort((a, b) => a._distance - b._distance);
    }

    const content = sortedArtisans.map((a) => ({
      id: a.id,
      nomAffichage: a.nomAffichage,
      slug: a.slug,
      description: a.description,
      ville: a.ville,
      codePostal: a.codePostal,
      noteMoyenne: a.noteMoyenne,
      nombreAvis: a.nombreAvis,
      experienceAnnees: a.experienceAnnees,
      plan: a.plan,
      distance: (a as unknown as { _distance?: number })._distance ?? null,
      metierNom: a.metier?.nom ?? null,
      metierSlug: a.metier?.slug ?? null,
      metierIcone: a.metier?.icone ?? null,
      photos: a.photos.map((p) => ({
        id: p.id,
        url: p.url,
        titre: p.titre,
        type: p.type,
        ordre: p.ordre,
      })),
      badges: a.badges.map((b) => ({
        id: b.id,
        nom: b.nom,
        type: b.type,
        icone: b.icone,
        couleur: b.couleur,
      })),
    }));

    return apiSuccess({
      content,
      totalElements,
      totalPages,
      page,
      size,
    });
  } catch (error) {
    console.error("GET /api/v1/public/artisans error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}

// Haversine formula — distance in km between 2 GPS points
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
