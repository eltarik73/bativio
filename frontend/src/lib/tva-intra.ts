/**
 * Calcul correct du numéro TVA intracommunautaire français.
 *
 * Format : FRXX SIREN (9 chiffres)
 * Où XX = clé de contrôle = (12 + 3 × (SIREN modulo 97)) modulo 97
 *
 * Référence : DGFiP / EUROFISC.
 * SIRET = SIREN (9) + NIC (5 chiffres établissement) — pour TVA on prend SIREN seul.
 *
 * Le bug actuel `FR + siret.slice(0,9)` produit FR111222333 au lieu de FR47111222333
 * → Numéro INVALIDE rejeté par EUROFISC + factures B2B refusées par client.
 */
export function computeTvaIntra(siretOrSiren: string): string {
  // Nettoie : enlève espaces, garde que chiffres
  const clean = siretOrSiren.replace(/\D/g, "");
  if (clean.length < 9) return ""; // SIREN minimal 9 chiffres

  const siren = clean.slice(0, 9);
  // SIREN max 999_999_999 < 2^31, on peut rester en number safe
  const sirenNum = parseInt(siren, 10);

  // Clé : (12 + 3 × (SIREN mod 97)) mod 97
  const cle = (12 + 3 * (sirenNum % 97)) % 97;
  const cleStr = String(cle).padStart(2, "0");

  return `FR${cleStr}${siren}`;
}

/**
 * Valide un numéro TVA intra français (format FR + 11 chiffres + clé correcte).
 */
export function isValidTvaIntra(numero: string): boolean {
  const m = numero.replace(/\s/g, "").match(/^FR(\d{2})(\d{9})$/i);
  if (!m) return false;
  const expectedKey = parseInt(m[1], 10);
  const siren = m[2];
  const sirenNum = parseInt(siren, 10);
  const computedKey = (12 + 3 * (sirenNum % 97)) % 97;
  return expectedKey === computedKey;
}
