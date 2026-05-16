// scripts/rename-novasan-slug.ts
// One-shot script : raccourcit le slug "novasan-n-s" en "novasan" pour
// utilisation dans la fiche Google My Business de Novasan.
//
// Usage : npx tsx scripts/rename-novasan-slug.ts [--dry-run]

import { prisma } from "../src/lib/prisma";

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  // Find current state
  const current = await prisma.artisan.findMany({
    where: { slug: { in: ["novasan-n-s", "novasan-energie", "novasan"] } },
    select: { id: true, slug: true, nomAffichage: true, ville: true },
  });

  console.log("État actuel des artisans Novasan :");
  console.log(JSON.stringify(current, null, 2));

  const target = current.find((a) => a.slug === "novasan-n-s");
  if (!target) {
    console.log("⚠️  Aucun artisan avec slug 'novasan-n-s' trouvé. Rien à faire.");
    return;
  }

  // Check collision
  const existing = current.find((a) => a.slug === "novasan");
  if (existing) {
    console.error(`❌ Collision : un autre artisan a déjà le slug 'novasan' (id=${existing.id})`);
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log(`\n[DRY-RUN] Renommerait : ${target.slug} → 'novasan' (id=${target.id}, nom='${target.nomAffichage}')`);
    return;
  }

  // Apply
  const updated = await prisma.artisan.update({
    where: { id: target.id },
    data: { slug: "novasan" },
    select: { id: true, slug: true, nomAffichage: true },
  });
  console.log(`✅ Slug raccourci : 'novasan-n-s' → '${updated.slug}' (id=${updated.id}, nom='${updated.nomAffichage}')`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
