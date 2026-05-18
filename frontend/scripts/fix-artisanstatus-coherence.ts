// scripts/fix-artisanstatus-coherence.ts
//
// Data fix one-shot : aligne artisanStatus avec actif pour eviter
// l'incoherence "PENDING_NAF_REVIEW + actif=true" qui fait apparaitre des
// artisans dans le compteur "en attente" de l'admin.
//
// Regle simple :
// - actif=true  -> artisanStatus = "ACTIVE"
// - actif=false -> on garde le statut historique (PENDING_NAF_REVIEW etc.)

import { prisma } from "../src/lib/prisma";

async function main() {
  // 1. Trouve les artisans actifs avec un statut non-ACTIVE
  const incoherents = await prisma.artisan.findMany({
    where: {
      deletedAt: null,
      actif: true,
      artisanStatus: { not: "ACTIVE" },
    },
    select: {
      id: true,
      slug: true,
      nomAffichage: true,
      artisanStatus: true,
      actif: true,
      visible: true,
    },
  });

  console.log(`Artisans incoherents trouves : ${incoherents.length}`);
  for (const a of incoherents) {
    console.log(`  - ${a.nomAffichage} (slug=${a.slug}) : artisanStatus=${a.artisanStatus} actif=${a.actif}`);
  }

  if (incoherents.length === 0) {
    console.log("✅ Aucune incoherence a corriger.");
    await prisma.$disconnect();
    return;
  }

  // 2. Fix : update artisanStatus = ACTIVE
  const result = await prisma.artisan.updateMany({
    where: {
      deletedAt: null,
      actif: true,
      artisanStatus: { not: "ACTIVE" },
    },
    data: { artisanStatus: "ACTIVE" },
  });

  console.log(`\n✅ ${result.count} artisans mis a jour : artisanStatus -> ACTIVE`);

  // 3. Verification finale
  const remaining = await prisma.artisan.count({
    where: {
      deletedAt: null,
      actif: true,
      artisanStatus: { not: "ACTIVE" },
    },
  });
  console.log(`Incoherences restantes : ${remaining}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
