// scripts/setup-aztech-tarifs-sismobat.ts
//
// Configure les services + tarifs d'AZ TECH (monpcmi13) avec les tarifs
// SismoBat (https://sismobat.fr) :
// - Attestation PCMI13   : 187 € — délai 48h
// - Attestation AT2      : 397 € — délai 72h
// - Pack PCMI13 + AT2    : 490 € — délai 48-72h
//
// Cree :
// 1. ServiceArtisan (affichage vitrine) - 3 entrees
// 2. PrestationType (devis structures) - 3 entrees
//
// Usage : npx dotenv-cli -e .env.local -- npx tsx scripts/setup-aztech-tarifs-sismobat.ts

import { prisma } from "../src/lib/prisma";

const TARIFS = [
  {
    titre: "Attestation sismique PCMI13",
    description:
      "Vérification des plans et conformité zone sismique. Attestation officielle PCMI13 (Cerfa) délivrée par email pour votre dossier de permis de construire. Conforme Eurocode 8.",
    prixIndicatif: "187 €",
    prixUnitaire: 187,
    unite: "forfait",
    categorie: "Attestation parasismique",
    delai: "48h",
    ordre: 1,
  },
  {
    titre: "Attestation sismique AT2",
    description:
      "Contrôle documentaire et conformité administrative et sismique à l'achèvement des travaux. Attestation AT2 obligatoire en zones 3-5 selon DHUP CPMI-EC8.",
    prixIndicatif: "397 €",
    prixUnitaire: 397,
    unite: "forfait",
    categorie: "Attestation parasismique",
    delai: "72h",
    ordre: 2,
  },
  {
    titre: "Pack PCMI13 + AT2",
    description:
      "Pack complet pour votre projet : attestation PCMI13 (avant chantier) + attestation AT2 (après travaux). Économie de 94 € par rapport aux 2 prestations séparées.",
    prixIndicatif: "490 €",
    prixUnitaire: 490,
    unite: "forfait",
    categorie: "Attestation parasismique",
    delai: "48-72h",
    ordre: 3,
  },
];

async function main() {
  const aztech = await prisma.artisan.findUnique({
    where: { slug: "az-tech" },
    select: { id: true, slug: true, nomAffichage: true },
  });

  if (!aztech) {
    console.error("❌ AZ TECH introuvable. Annulation.");
    process.exit(1);
  }
  console.log(`Artisan trouvé : ${aztech.nomAffichage} (id=${aztech.id})`);

  // 1. ServiceArtisan : on remplace tous les services existants
  await prisma.serviceArtisan.deleteMany({ where: { artisanId: aztech.id } });
  console.log("  Services existants supprimés.");

  for (const t of TARIFS) {
    const s = await prisma.serviceArtisan.create({
      data: {
        artisanId: aztech.id,
        titre: t.titre,
        description: `${t.description} Délivré sous ${t.delai}.`,
        prixIndicatif: t.prixIndicatif,
        ordre: t.ordre,
      },
    });
    console.log(`  ✅ ServiceArtisan créé : ${s.titre} (${s.prixIndicatif})`);
  }

  // 2. PrestationType : on remplace celles d'AZ TECH
  await prisma.prestationType.deleteMany({
    where: { artisanId: aztech.id, metierSlug: "bureau-etude" },
  });
  console.log("  Prestations bureau-etude existantes supprimées.");

  for (const t of TARIFS) {
    const p = await prisma.prestationType.create({
      data: {
        artisanId: aztech.id,
        designation: t.titre,
        description: `${t.description} Délivré sous ${t.delai}.`,
        unite: t.unite,
        prixUnitaire: t.prixUnitaire,
        categorie: t.categorie,
        metierSlug: "bureau-etude",
        tvaApplicable: 20, // TVA normale (services intellectuels)
        inclutFourniture: false, // Service intellectuel - pas de fourniture
        isCustom: false,
      },
    });
    console.log(`  ✅ PrestationType créée : ${p.designation} (${p.prixUnitaire}€)`);
  }

  console.log("\n=== État final AZ TECH ===");
  const final = await prisma.artisan.findUnique({
    where: { slug: "az-tech" },
    select: {
      slug: true,
      nomAffichage: true,
      services: {
        select: { titre: true, prixIndicatif: true },
        orderBy: { ordre: "asc" },
      },
      prestationTypes: {
        select: { designation: true, prixUnitaire: true, unite: true },
      },
    },
  });
  console.log(JSON.stringify(final, null, 2));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
