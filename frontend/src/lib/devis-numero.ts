import { prisma } from "@/lib/prisma";

/**
 * Génère le prochain numéro de devis pour un artisan, de manière ATOMIQUE.
 *
 * Pattern : transaction Serializable + advisory lock PostgreSQL pour
 * garantir l'absence de doublon même sur appels concurrents (race condition
 * actuelle avec count + 1 non atomique = crash unique constraint).
 *
 * Format : `{prefix}{year}-{NNNN}` (ex: BTV-2026-0042)
 *
 * Conformité Article 242 nonies A CGI : numérotation séquentielle sans trou
 * obligatoire pour TVA. La séquence est par artisan + par année.
 *
 * @param artisanId  Artisan owner du devis
 * @param prefix     Préfixe court (ex: "BTV-" ou "")
 * @returns Le numéro unique séquentiel (ex: "BTV-2026-0042")
 */
export async function generateNextDevisNumero(
  artisanId: string,
  prefix: string = "",
): Promise<string> {
  const year = new Date().getFullYear();
  // Hash artisanId vers un BIGINT pour pg_advisory_xact_lock
  // (advisory lock release auto à la fin de la transaction)
  const lockKey = hashStringToBigInt(`devis:${artisanId}:${year}`);

  return await prisma.$transaction(async (tx) => {
    // PostgreSQL advisory lock — sérialise les appels concurrents par artisan/année
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockKey})`;

    // Lit le dernier numéro pour CET artisan dans CETTE année
    const last = await tx.devis.findFirst({
      where: {
        artisanId,
        numero: { startsWith: `${prefix}${year}-` },
      },
      orderBy: { createdAt: "desc" },
      select: { numero: true },
    });

    let nextSeq = 1;
    if (last) {
      // Extrait le NNNN du dernier numéro
      const match = last.numero.match(/-(\d+)$/);
      if (match) nextSeq = parseInt(match[1], 10) + 1;
    }

    return `${prefix}${year}-${String(nextSeq).padStart(4, "0")}`;
  }, {
    isolationLevel: "Serializable",
    maxWait: 5000,
    timeout: 10000,
  });
}

/**
 * Hash déterministe string → bigint (pour pg_advisory_xact_lock).
 * Utilise djb2 + reduction modulo 2^31 (signed bigint PostgreSQL compatible).
 */
function hashStringToBigInt(s: string): bigint {
  let hash = BigInt(5381);
  const five = BigInt(5);
  const mask = BigInt("0xffffffff");
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << five) + hash + BigInt(s.charCodeAt(i))) & mask;
  }
  return hash;
}
