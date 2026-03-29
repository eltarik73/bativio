import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  // Villes
  const villes = [
    { nom: "Chambéry", slug: "chambery", codePostal: "73000", departement: "73" },
    { nom: "Annecy", slug: "annecy", codePostal: "74000", departement: "74" },
    { nom: "Grenoble", slug: "grenoble", codePostal: "38000", departement: "38" },
    { nom: "Lyon", slug: "lyon", codePostal: "69000", departement: "69" },
    { nom: "Valence", slug: "valence", codePostal: "26000", departement: "26" },
  ];
  for (const v of villes) {
    await prisma.ville.upsert({ where: { slug: v.slug }, update: {}, create: v });
  }
  console.log(`  ${villes.length} villes`);

  // Metiers
  const metiers = [
    { nom: "Plombier", slug: "plombier", icone: "🔧" },
    { nom: "Électricien", slug: "electricien", icone: "⚡" },
    { nom: "Peintre", slug: "peintre", icone: "🎨" },
    { nom: "Maçon", slug: "macon", icone: "🧱" },
    { nom: "Carreleur", slug: "carreleur", icone: "🔲" },
    { nom: "Menuisier", slug: "menuisier", icone: "🪚" },
    { nom: "Couvreur", slug: "couvreur", icone: "🏠" },
    { nom: "Chauffagiste", slug: "chauffagiste", icone: "🔥" },
    { nom: "Serrurier", slug: "serrurier", icone: "🔑" },
    { nom: "Cuisiniste", slug: "cuisiniste", icone: "🍳" },
  ];
  for (const m of metiers) {
    await prisma.metier.upsert({ where: { slug: m.slug }, update: {}, create: m });
  }
  console.log(`  ${metiers.length} metiers`);

  // Badges systeme
  const badges = [
    { nom: "RGE", icone: "🟢" },
    { nom: "Qualibat", icone: "🏗️" },
    { nom: "Qualifelec", icone: "⚡" },
    { nom: "Assurance decennale", icone: "🛡️" },
    { nom: "Garantie decennale", icone: "✅" },
    { nom: "CAPEB", icone: "🔨" },
  ];
  for (const b of badges) {
    await prisma.badgeSysteme.upsert({ where: { nom: b.nom }, update: {}, create: b });
  }
  console.log(`  ${badges.length} badges systeme`);

  // Admin user
  const adminHash = await bcrypt.hash("Bativio2026!", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@bativio.fr" },
    update: {},
    create: { email: "admin@bativio.fr", passwordHash: adminHash, role: "ADMIN" },
  });
  const plombierMetier = await prisma.metier.findUnique({ where: { slug: "plombier" } });
  await prisma.artisan.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      siret: "00000000000000",
      nomAffichage: "Admin Bativio",
      slug: "admin-bativio",
      telephone: "0000000000",
      ville: "Chambéry",
      metierId: plombierMetier?.id,
      actif: true,
      visible: false,
    },
  });
  console.log("  Admin: admin@bativio.fr / Bativio2026!");

  console.log("Seed termine !");
}

main().catch(console.error).finally(() => prisma.$disconnect());
