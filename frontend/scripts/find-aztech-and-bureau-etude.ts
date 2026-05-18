import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("=== Recherche AZ TECH (toutes variantes) ===");
  const artisans = await prisma.artisan.findMany({
    where: {
      OR: [
        { nomAffichage: { contains: "az tech", mode: "insensitive" } },
        { nomAffichage: { contains: "aztech", mode: "insensitive" } },
        { slug: { contains: "az-tech" } },
        { slug: { contains: "aztech" } },
        { nomAffichage: { contains: "monpcmi", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      slug: true,
      nomAffichage: true,
      ville: true,
      metier: { select: { nom: true, slug: true } },
      actif: true,
      visible: true,
    },
  });
  console.log(JSON.stringify(artisans, null, 2));

  console.log("\n=== Métiers existants ===");
  const metiers = await prisma.metier.findMany({
    select: { id: true, nom: true, slug: true, icone: true, ordre: true },
    orderBy: { ordre: "asc" },
  });
  console.log(metiers.map((m) => `${m.slug.padEnd(20)} | ${m.nom}`).join("\n"));

  console.log("\n=== Recherche metier bureau d'etude ===");
  const bureauEtude = metiers.find(
    (m) =>
      m.slug.includes("bureau") ||
      m.nom.toLowerCase().includes("bureau") ||
      m.slug.includes("etude") ||
      m.slug.includes("bet"),
  );
  console.log(bureauEtude || "Aucun métier 'Bureau d'étude' trouvé");

  await prisma.$disconnect();
}
main();
