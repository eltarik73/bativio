// scripts/setup-bureau-etude-aztech.ts
//
// One-shot :
// 1. Cree le metier "Bureau d'etude" (slug "bureau-etude")
// 2. Renomme "AZ TECH" -> "AZ TECH (monpcmi13)"
// 3. Associe AZ TECH au metier "Bureau d'etude"
//
// AZ TECH = artisan lie au service monpcmi13.com (Tarik). Affiche sur les
// pages /attestation-sismique/* comme bureau d'etude pour rediriger vers
// le service en ligne.
//
// Usage : npx dotenv-cli -e .env.local -- npx tsx scripts/setup-bureau-etude-aztech.ts

import { prisma } from "../src/lib/prisma";

async function main() {
  // 1. Créer ou retrouver le métier "Bureau d'étude"
  let bureauEtude = await prisma.metier.findUnique({
    where: { slug: "bureau-etude" },
  });

  if (!bureauEtude) {
    // Trouver l'ordre max actuel pour placer en fin
    const last = await prisma.metier.findFirst({
      orderBy: { ordre: "desc" },
      select: { ordre: true },
    });
    const nextOrdre = (last?.ordre ?? 0) + 1;

    bureauEtude = await prisma.metier.create({
      data: {
        slug: "bureau-etude",
        nom: "Bureau d'étude",
        // Icone SVG inline (compass / boussole pour BET)
        icone:
          '<path d="M12 2l3.5 7L23 10l-5.5 5 1.5 7-7-4-7 4 1.5-7L1 10l7.5-1z" stroke-linejoin="round"/>',
        // Couleur dédiée pour distinguer (vert mousse Bativio = qualifié technique)
        ordre: nextOrdre,
      },
    });
    console.log(`✅ Métier créé : ${bureauEtude.nom} (id=${bureauEtude.id}, slug=${bureauEtude.slug})`);
  } else {
    console.log(`ℹ️ Métier déjà existant : ${bureauEtude.nom}`);
  }

  // 2. Retrouver AZ TECH
  const aztech = await prisma.artisan.findUnique({
    where: { slug: "az-tech" },
    select: { id: true, nomAffichage: true, metierId: true },
  });

  if (!aztech) {
    console.error("❌ AZ TECH introuvable (slug az-tech). Annulation.");
    process.exit(1);
  }

  // 3. Renommer + associer au métier Bureau d'étude
  const updated = await prisma.artisan.update({
    where: { id: aztech.id },
    data: {
      nomAffichage: "AZ TECH (monpcmi13)",
      metierId: bureauEtude.id,
    },
    select: { id: true, slug: true, nomAffichage: true, metierId: true },
  });
  console.log(
    `✅ AZ TECH mis à jour : nom="${updated.nomAffichage}", metierId=${updated.metierId}`,
  );

  // 4. Verification
  const final = await prisma.artisan.findUnique({
    where: { slug: "az-tech" },
    select: {
      slug: true,
      nomAffichage: true,
      ville: true,
      actif: true,
      visible: true,
      metier: { select: { nom: true, slug: true } },
    },
  });
  console.log("\n=== État final ===");
  console.log(JSON.stringify(final, null, 2));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
