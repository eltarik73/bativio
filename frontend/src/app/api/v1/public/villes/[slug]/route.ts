import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const ville = await prisma.ville.findUnique({
      where: { slug },
    });

    if (!ville) {
      return apiError("Ville non trouvée", 404);
    }

    const artisans = await prisma.artisan.findMany({
      where: {
        ville: { equals: ville.nom, mode: "insensitive" },
        actif: true,
        visible: true,
        deletedAt: null,
        // Un artisan ACTIVE (valide manuellement par admin) apparait meme si
        // son profilCompletion < 50, sinon NOVASAN et autres validations
        // disparaissent silencieusement du listing public.
        OR: [
          { artisanStatus: "ACTIVE" },
          { profilCompletion: { gte: 50 } },
        ],
        NOT: { slug: { startsWith: "test-" } },
      },
      include: {
        metier: true,
        photos: {
          take: 1,
          orderBy: { ordre: "asc" },
        },
        badges: true,
      },
      orderBy: [{ plan: "desc" }, { noteMoyenne: "desc" }],
    });

    const artisansData = artisans.map((a) => ({
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
      metierNom: a.metier?.nom ?? null,
      metierSlug: a.metier?.slug ?? null,
      metierIcone: a.metier?.icone ?? null,
      photo: a.photos[0]
        ? {
            id: a.photos[0].id,
            url: a.photos[0].url,
            titre: a.photos[0].titre,
          }
        : null,
      badges: a.badges.map((b) => ({
        id: b.id,
        nom: b.nom,
        type: b.type,
        icone: b.icone,
        couleur: b.couleur,
      })),
    }));

    return apiSuccess({
      ville: {
        id: ville.id,
        nom: ville.nom,
        slug: ville.slug,
        codePostal: ville.codePostal,
        departement: ville.departement,
        latitude: ville.latitude,
        longitude: ville.longitude,
        seoTitle: ville.seoTitle,
        seoDescription: ville.seoDescription,
        contenuSeo: ville.contenuSeo,
      },
      artisans: artisansData,
    });
  } catch (error) {
    console.error("GET /api/v1/public/villes/[slug] error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
