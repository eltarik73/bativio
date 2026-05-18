import { prisma } from "../src/lib/prisma";
async function main() {
  const a = await prisma.artisan.findUnique({
    where: { slug: "novasan" },
    select: {
      nomAffichage: true,
      ville: true,
      codePostal: true,
      experienceAnnees: true,
      description: true,
      siret: true,
      nombreAvis: true,
      noteMoyenne: true,
      zoneRayonKm: true,
      metier: { select: { nom: true } },
      services: { select: { titre: true, description: true } },
      badges: { select: { nom: true } },
    },
  });
  console.log(JSON.stringify(a, null, 2));
  await prisma.$disconnect();
}
main();
