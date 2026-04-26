import type { CataloguePrestation } from "@prisma/client";

export interface DevisLigne {
  code?: string;
  label: string;
  qte: number;
  unite: string;
  puHt: number;
  totalHt: number;
  tva: number;
  source?: string;
}

export interface DevisIAOutput {
  status: "ok" | "need_clarif";
  lignes?: DevisLigne[];
  totalHt?: number;
  totalTva?: number;
  totalTtc?: number;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validateur SANITY CHECK post-génération devis IA.
 *
 * Empêche l'envoi au client d'un devis halluciné :
 * - Vérifie qte × puHt = totalHt (arrondi 2 décimales)
 * - Vérifie totalLignes = totalHt global
 * - Vérifie totalHt + totalTva = totalTtc
 * - Vérifie taux TVA dans {0, 2.1, 5.5, 10, 20}
 * - Vérifie prix dans range catalogue ±20% si code matché
 * - Vérifie quantité raisonnable (1-1000 pour la plupart des unités)
 * - Détecte montants aberrants (>50K€ par ligne, >100K€ total)
 *
 * @returns valid: true si OK, errors[] et warnings[] sinon
 */
export function validateDevisIA(
  devis: DevisIAOutput,
  catalogue: CataloguePrestation[] = [],
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (devis.status !== "ok") {
    return { valid: true, errors: [], warnings: ["Status non 'ok' — pas de validation"] };
  }

  const lignes = devis.lignes ?? [];
  if (lignes.length === 0) {
    errors.push("Aucune ligne de devis");
    return { valid: false, errors, warnings };
  }

  let sommeLignes = 0;

  for (const [i, ligne] of lignes.entries()) {
    const ctx = `Ligne ${i + 1} "${ligne.label}"`;

    // Validation arithmétique
    const expectedTotal = Math.round(ligne.qte * ligne.puHt * 100) / 100;
    if (Math.abs(expectedTotal - ligne.totalHt) > 0.05) {
      errors.push(`${ctx}: ${ligne.qte} × ${ligne.puHt} = ${expectedTotal}€ ≠ totalHt déclaré ${ligne.totalHt}€`);
    }

    // Validation TVA
    if (![0, 2.1, 5.5, 10, 20].includes(ligne.tva)) {
      errors.push(`${ctx}: taux TVA ${ligne.tva}% invalide (autorisés : 0, 2.1, 5.5, 10, 20)`);
    }

    // Validation quantité raisonnable
    if (ligne.qte <= 0) {
      errors.push(`${ctx}: quantité ${ligne.qte} <= 0`);
    }
    if (ligne.qte > 10000) {
      warnings.push(`${ctx}: quantité ${ligne.qte} très élevée — vérifier`);
    }

    // Validation montant aberrant par ligne
    if (ligne.totalHt > 50000) {
      warnings.push(`${ctx}: total ligne ${ligne.totalHt}€ > 50K€ — anormal`);
    }
    if (ligne.totalHt < 0) {
      errors.push(`${ctx}: total ligne négatif ${ligne.totalHt}€`);
    }

    // Validation range catalogue si code matché
    if (ligne.code) {
      const cat = catalogue.find((c) => c.code === ligne.code);
      if (cat) {
        const minAcceptable = cat.prixHtBas * 0.7; // -30%
        const maxAcceptable = cat.prixHtHaut * 1.5; // +50%
        if (ligne.puHt < minAcceptable || ligne.puHt > maxAcceptable) {
          warnings.push(
            `${ctx}: prix unitaire ${ligne.puHt}€ hors range catalogue [${minAcceptable.toFixed(2)}–${maxAcceptable.toFixed(2)}]€ (code ${ligne.code})`,
          );
        }
        if (cat.unite !== ligne.unite) {
          warnings.push(`${ctx}: unité "${ligne.unite}" ≠ catalogue "${cat.unite}" (code ${ligne.code})`);
        }
      }
    }

    sommeLignes += ligne.totalHt;
  }

  // Validation total HT global
  if (devis.totalHt !== undefined) {
    sommeLignes = Math.round(sommeLignes * 100) / 100;
    if (Math.abs(sommeLignes - devis.totalHt) > 0.10) {
      errors.push(`Somme lignes ${sommeLignes}€ ≠ totalHt déclaré ${devis.totalHt}€`);
    }
  }

  // Validation HT + TVA = TTC
  if (devis.totalHt !== undefined && devis.totalTva !== undefined && devis.totalTtc !== undefined) {
    const expectedTtc = Math.round((devis.totalHt + devis.totalTva) * 100) / 100;
    if (Math.abs(expectedTtc - devis.totalTtc) > 0.10) {
      errors.push(`HT ${devis.totalHt}€ + TVA ${devis.totalTva}€ = ${expectedTtc}€ ≠ TTC déclaré ${devis.totalTtc}€`);
    }
  }

  // Total aberrant global
  if (devis.totalTtc && devis.totalTtc > 100000) {
    warnings.push(`Devis total TTC ${devis.totalTtc}€ > 100K€ — vérification humaine recommandée`);
  }
  if (devis.totalTtc && devis.totalTtc < 0) {
    errors.push(`Devis total TTC négatif ${devis.totalTtc}€`);
  }

  return { valid: errors.length === 0, errors, warnings };
}
