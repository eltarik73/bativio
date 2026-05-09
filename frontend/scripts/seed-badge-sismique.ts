// scripts/seed-badge-sismique.ts
//
// Idempotent : ajoute (ou met à jour) la catégorie "Attestation sismique"
// dans BadgeSysteme. Mots-clés associés : PCMI13, attestation parasismique.
//
// Usage : `cd frontend && npx tsx scripts/seed-badge-sismique.ts`
// Prérequis : DATABASE_URL dans frontend/.env.local

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const nom = "Attestation sismique";
  const description =
    "Attestation parasismique requise pour le formulaire PCMI13 (Cerfa de demande de permis de construire de maison individuelle en zone sismique). Mots-clés : PCMI13, parasismique, zone sismique.";
  const icone = "\u{1F3D7}️"; // 🏗️

  const result = await prisma.badgeSysteme.upsert({
    where: { nom },
    create: { nom, description, icone },
    update: { description, icone },
  });

  console.log("OK BadgeSysteme upserted:");
  console.log(`  id          = ${result.id}`);
  console.log(`  nom         = ${result.nom}`);
  console.log(`  description = ${result.description}`);
  console.log(`  icone       = ${result.icone}`);
  console.log(`  createdAt   = ${result.createdAt.toISOString()}`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
