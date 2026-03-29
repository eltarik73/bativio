import { apiSuccess, apiError } from "@/lib/api-response";

interface EtablissementResult {
  siege?: {
    siret?: string;
    activite_principale?: string;
    date_creation?: string;
    adresse?: string;
    code_postal?: string;
    commune?: string;
    latitude?: string;
    longitude?: string;
  };
  nom_complet?: string;
  nom_raison_sociale?: string;
  nature_juridique?: string;
  tranche_effectif_salarie?: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ siret: string }> }
) {
  try {
    const { siret } = await params;

    // Validate SIRET format (14 digits)
    const siretClean = siret.replace(/\s/g, "");
    if (!/^\d{14}$/.test(siretClean)) {
      return apiError("Le SIRET doit contenir 14 chiffres", 400);
    }

    // Fetch from recherche-entreprises.api.gouv.fr
    const response = await fetch(
      `https://recherche-entreprises.api.gouv.fr/search?q=${siretClean}&mtm_campaign=bativio`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return apiError("Erreur lors de la recherche SIRET", 502);
    }

    const json = await response.json();

    if (!json.results || json.results.length === 0) {
      return apiError("Aucune entreprise trouvée pour ce SIRET", 404);
    }

    // Find the matching result
    const result: EtablissementResult = json.results.find(
      (r: EtablissementResult) => r.siege?.siret === siretClean
    ) || json.results[0];

    const siege = result.siege || {};

    const data = {
      siret: siretClean,
      siren: siretClean.substring(0, 9),
      raisonSociale: result.nom_complet || result.nom_raison_sociale || null,
      activitePrincipale: siege.activite_principale || null,
      dateCreation: siege.date_creation || null,
      adresse: siege.adresse || null,
      codePostal: siege.code_postal || null,
      ville: siege.commune || null,
      latitude: siege.latitude ? parseFloat(siege.latitude) : null,
      longitude: siege.longitude ? parseFloat(siege.longitude) : null,
      natureJuridique: result.nature_juridique || null,
      trancheEffectif: result.tranche_effectif_salarie || null,
    };

    return apiSuccess(data);
  } catch (error) {
    console.error("GET /api/v1/public/siret/[siret] error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
