import { PrismaClient } from "@prisma/client";
import data from "./devis-questions-metiers.json";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding métiers et arbres de questions...");

  // Upsert métiers
  for (const m of data.metiers) {
    await prisma.metier.upsert({
      where: { slug: m.slug },
      update: { label: m.label, categorie: m.categorie, icone: m.icone, ordre: m.ordre },
      create: { nom: m.nom, slug: m.slug, label: m.label, categorie: m.categorie, icone: m.icone, ordre: m.ordre },
    });
    console.log(`  ✓ Métier: ${m.nom}`);
  }

  // Upsert arbres de questions
  const arbres = data.arbres as Record<string, unknown>;
  const communes = data.questions_communes as Record<string, unknown>;

  for (const [slug, rootNode] of Object.entries(arbres)) {
    const fullTree = JSON.parse(JSON.stringify({ root: rootNode, questions: communes }));
    await prisma.arbreQuestions.upsert({
      where: { metierSlug: slug },
      update: { questions: fullTree },
      create: { metierSlug: slug, questions: fullTree },
    });
    console.log(`  ✓ Arbre: ${slug}`);
  }

  // Migrate existing artisans to ArtisanMetier if not already done
  const artisans = await prisma.artisan.findMany({
    where: { metierId: { not: null } },
    select: { id: true, metierId: true },
  });

  for (const a of artisans) {
    if (!a.metierId) continue;
    const existing = await prisma.artisanMetier.findUnique({
      where: { artisanId_metierId: { artisanId: a.id, metierId: a.metierId } },
    });
    if (!existing) {
      await prisma.artisanMetier.create({
        data: { artisanId: a.id, metierId: a.metierId, principal: true },
      });
      console.log(`  ✓ Artisan ${a.id} → métier principal ${a.metierId}`);
    }
  }

  console.log("Seed terminé !");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
