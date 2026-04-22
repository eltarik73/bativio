import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { getEffectivePlan } from "@/lib/plan-gates";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ville = searchParams.get("ville");
    const metier = searchParams.get("metier");
    const search = searchParams.get("search");
    const lat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
    const lon = searchParams.get("lon") ? parseFloat(searchParams.get("lon")!) : null;
    const radius = searchParams.get("radius") ? parseFloat(searchParams.get("radius")!) : 30;
    const page = Math.max(0, parseInt(searchParams.get("page") || "0", 10));
    const rawSize = parseInt(searchParams.get("size") || "20", 10);
    const size = Math.min(50, Math.max(1, isNaN(rawSize) ? 20 : rawSize));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      actif: true,
      visible: true,
      deletedAt: null,
      profilCompletion: { gte: 50 },
      NOT: { slug: { startsWith: "test-" } },
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

    // Filter by metier slug — search in artisanMetiers (multi-metier support)
    if (metier) {
      const metierRecord = await prisma.metier.findUnique({
        where: { slug: metier },
      });
      if (metierRecord) {
        where.artisanMetiers = { some: { metierId: metierRecord.id } };
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
        select: {
          id: true,
          nomAffichage: true,
          slug: true,
          description: true,
          ville: true,
          codePostal: true,
          noteMoyenne: true,
          nombreAvis: true,
          experienceAnnees: true,
          plan: true,
          planOverride: true,
          planOverrideExpireAt: true,
          latitude: true,
          longitude: true,
          zoneRayonKm: true,
          metier: { select: { nom: true, slug: true, icone: true } },
          photos: {
            select: { id: true, url: true, titre: true, type: true, ordre: true },
            take: 3,
            orderBy: { ordre: "asc" },
          },
          badges: { select: { id: true, nom: true, type: true, icone: true, couleur: true } },
        },
        orderBy: [
          { plan: "desc" },
          { noteMoyenne: "desc" },
        ],
        skip: page * size,
        take: size,
      }),
      prisma.artisan.count({ where }),
    ]);

    const totalPages = Math.ceil(totalElements / size);

    // If geo coordinates provided, calculate distance and filter by proximity
    // An artisan matches if:
    // 1. The client is within the artisan's zone d'intervention (zoneRayonKm from artisan)
    // 2. OR the artisan is within the search radius from the client
    // 3. OR the artisan has no coordinates (include them, don't exclude)
    let sortedArtisans = artisans;
    if (lat && lon) {
      sortedArtisans = artisans
        .map((a) => {
          const dist = a.latitude && a.longitude
            ? haversine(lat, lon, a.latitude, a.longitude)
            : null;
          return { ...a, _distance: dist };
        })
        .filter((a) => {
          if (a._distance === null) return true; // No coords → include (don't punish)
          const artisanZone = a.zoneRayonKm || 25; // Default 25km
          // Include if client is within artisan's zone OR artisan is within search radius
          return a._distance <= Math.max(radius, artisanZone);
        })
        .sort((a, b) => (a._distance ?? 999) - (b._distance ?? 999));
    }

    // Re-sort by effective plan (handles planOverride) then noteMoyenne
    const PLAN_HIERARCHY = ["gratuit", "starter", "pro", "business"];
    sortedArtisans.sort((a, b) => {
      const planA = PLAN_HIERARCHY.indexOf(getEffectivePlan(a));
      const planB = PLAN_HIERARCHY.indexOf(getEffectivePlan(b));
      if (planB !== planA) return planB - planA;
      return (b.noteMoyenne || 0) - (a.noteMoyenne || 0);
    });

    // Public payload — expose effective plan only, no planOverride/planOverrideExpireAt leak
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
      plan: getEffectivePlan(a).toUpperCase(),
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
