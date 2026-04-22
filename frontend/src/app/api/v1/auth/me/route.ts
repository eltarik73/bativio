import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { getEffectivePlan } from "@/lib/plan-gates";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("Non authentifié", 401);
    }

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: {
        user: true,
        metier: true,
        badges: true,
        services: { orderBy: { ordre: "asc" } },
        photos: { orderBy: { ordre: "asc" } },
        horaires: { orderBy: { jourSemaine: "asc" } },
        zones: true,
      },
    });

    if (!artisan) {
      // User connecté mais pas d'artisan : soit ADMIN pur, soit compte non fini
      // On retourne un profil minimal pour que le client sache que l'utilisateur EST
      // authentifié (évite la boucle /connexion ↔ /dashboard causée par un 404).
      const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { email: true, role: true } });
      if (!user) return apiError("Utilisateur introuvable", 404);
      return apiSuccess({
        id: "",
        nomAffichage: user.email.split("@")[0],
        slug: null,
        metierNom: null,
        ville: null,
        plan: "GRATUIT",
        profilCompletion: 0,
        actif: false,
        email: user.email,
        role: user.role,
        artisanStatus: "NO_ARTISAN",
        artisanMissing: true, // flag pour que le dashboard redirige vers /inscription
      });
    }

    if (artisan.deletedAt) {
      return apiError("Compte supprimé", 403);
    }

    return apiSuccess({
      id: artisan.id,
      nomAffichage: artisan.nomAffichage,
      slug: artisan.slug,
      metierNom: artisan.metier?.nom ?? null,
      ville: artisan.ville,
      plan: getEffectivePlan(artisan).toUpperCase(),
      planStripe: artisan.plan,
      planOverride: artisan.planOverride,
      profilCompletion: artisan.profilCompletion,
      actif: artisan.actif,
      telephone: artisan.telephone,
      description: artisan.description,
      email: artisan.user.email,
      role: artisan.user.role,
      templateId: artisan.templateId,
      colorPrimary: artisan.colorPrimary,
      colorAccent: artisan.colorAccent,
      photoLayout: artisan.photoLayout,
      siret: artisan.siret,
      raisonSociale: artisan.raisonSociale,
      invoquoEnabled: artisan.invoquoEnabled,
      artisanStatus: artisan.artisanStatus,
      invoiceCount: artisan.invoiceCount,
      leadsCompletsUtilises: artisan.leadsCompletsUtilises,
      scoringPercent: artisan.scoringPercent,
      adresse: artisan.adresse,
      codePostal: artisan.codePostal,
      zoneRayonKm: artisan.zoneRayonKm,
      experienceAnnees: artisan.experienceAnnees,
      noteMoyenne: artisan.noteMoyenne,
      nombreAvis: artisan.nombreAvis,
      badgesNoms: artisan.badges.map((b) => b.nom),
      services: artisan.services.map((s) => ({
        id: s.id,
        titre: s.titre,
        description: s.description,
        prixIndicatif: s.prixIndicatif,
        ordre: s.ordre,
      })),
      photos: artisan.photos.map((p) => ({
        id: p.id,
        url: p.url,
        titre: p.titre,
        type: p.type,
        paireId: p.paireId,
        ordre: p.ordre,
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
    });
  } catch (error) {
    console.error("Me error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
