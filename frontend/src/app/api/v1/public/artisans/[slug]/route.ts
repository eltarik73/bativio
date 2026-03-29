import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const artisan = await prisma.artisan.findFirst({
      where: {
        slug,
        actif: true,
        visible: true,
        deletedAt: null,
      },
      include: {
        user: {
          select: { email: true },
        },
        metier: true,
        photos: {
          orderBy: { ordre: "asc" },
        },
        badges: true,
        services: {
          orderBy: { ordre: "asc" },
        },
        horaires: true,
        zones: true,
      },
    });

    if (!artisan) {
      return apiError("Artisan non trouvé", 404);
    }

    const data = {
      id: artisan.id,
      nomAffichage: artisan.nomAffichage,
      prenom: artisan.prenom,
      nom: artisan.nom,
      slug: artisan.slug,
      siret: artisan.siret,
      raisonSociale: artisan.raisonSociale,
      description: artisan.description,
      telephone: artisan.telephone,
      email: artisan.user.email,
      adresse: artisan.adresse,
      codePostal: artisan.codePostal,
      ville: artisan.ville,
      latitude: artisan.latitude,
      longitude: artisan.longitude,
      zoneRayonKm: artisan.zoneRayonKm,
      experienceAnnees: artisan.experienceAnnees,
      noteMoyenne: artisan.noteMoyenne,
      nombreAvis: artisan.nombreAvis,
      plan: artisan.plan,
      templateId: artisan.templateId,
      colorPrimary: artisan.colorPrimary,
      colorAccent: artisan.colorAccent,
      photoLayout: artisan.photoLayout,
      seoDescription: artisan.seoDescription,
      seoKeywords: artisan.seoKeywords,
      createdAt: artisan.createdAt,
      metierNom: artisan.metier?.nom ?? null,
      metierSlug: artisan.metier?.slug ?? null,
      metierIcone: artisan.metier?.icone ?? null,
      photos: artisan.photos.map((p) => ({
        id: p.id,
        url: p.url,
        titre: p.titre,
        type: p.type,
        paireId: p.paireId,
        ordre: p.ordre,
      })),
      badges: artisan.badges.map((b) => ({
        id: b.id,
        nom: b.nom,
        type: b.type,
        icone: b.icone,
        couleur: b.couleur,
      })),
      badgesNoms: artisan.badges.map((b) => b.nom),
      services: artisan.services.map((s) => ({
        id: s.id,
        titre: s.titre,
        description: s.description,
        prixIndicatif: s.prixIndicatif,
        ordre: s.ordre,
      })),
      horaires: artisan.horaires.map((h) => ({
        id: h.id,
        jourSemaine: h.jourSemaine,
        ouvert: h.ouvert,
        heureOuverture: h.heureOuverture,
        heureFermeture: h.heureFermeture,
      })),
      zones: artisan.zones.map((z) => ({
        id: z.id,
        ville: z.ville,
      })),
    };

    return apiSuccess(data);
  } catch (error) {
    console.error("GET /api/v1/public/artisans/[slug] error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
