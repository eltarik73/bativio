import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function backfill() {
  console.log("Backfilling clients from DemandeDevis and Devis...");

  // Get all artisans
  const artisans = await prisma.artisan.findMany({ select: { id: true } });

  for (const artisan of artisans) {
    // Get all demandes for this artisan
    const demandes = await prisma.demandeDevis.findMany({
      where: { artisanId: artisan.id },
      select: { id: true, nomClient: true, emailClient: true, telephoneClient: true, clientVille: true },
    });

    // Get all devis for this artisan
    const devis = await prisma.devis.findMany({
      where: { artisanId: artisan.id },
      select: { clientNom: true, clientEmail: true, clientTelephone: true, clientAdresse: true },
    });

    const seen = new Set<string>();

    for (const d of demandes) {
      if (!d.nomClient) continue;
      const key = (d.emailClient || d.telephoneClient || d.nomClient).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      // Check if client already exists
      const existing = d.emailClient
        ? await prisma.client.findFirst({ where: { artisanId: artisan.id, email: d.emailClient } })
        : d.telephoneClient
        ? await prisma.client.findFirst({ where: { artisanId: artisan.id, telephone: d.telephoneClient } })
        : null;

      if (!existing) {
        try {
          const client = await prisma.client.create({
            data: {
              artisanId: artisan.id,
              nom: d.nomClient,
              email: d.emailClient || undefined,
              telephone: d.telephoneClient || undefined,
              ville: d.clientVille || undefined,
            },
          });
          // Link demande to client
          await prisma.demandeDevis.update({ where: { id: d.id }, data: { clientId: client.id } });
          console.log(`  Created client: ${d.nomClient} (${d.emailClient || d.telephoneClient})`);
        } catch (e) {
          // Unique constraint violation — skip
          console.log(`  Skipped duplicate: ${d.nomClient}`);
        }
      }
    }

    for (const d of devis) {
      if (!d.clientNom) continue;
      const key = (d.clientEmail || d.clientTelephone || d.clientNom).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      const existing = d.clientEmail
        ? await prisma.client.findFirst({ where: { artisanId: artisan.id, email: d.clientEmail } })
        : d.clientTelephone
        ? await prisma.client.findFirst({ where: { artisanId: artisan.id, telephone: d.clientTelephone } })
        : null;

      if (!existing) {
        try {
          await prisma.client.create({
            data: {
              artisanId: artisan.id,
              nom: d.clientNom,
              email: d.clientEmail || undefined,
              telephone: d.clientTelephone || undefined,
              adresse: d.clientAdresse || undefined,
            },
          });
          console.log(`  Created client from devis: ${d.clientNom}`);
        } catch {
          console.log(`  Skipped duplicate from devis: ${d.clientNom}`);
        }
      }
    }
  }

  console.log("Done!");
}

backfill().catch(console.error).finally(() => prisma.$disconnect());
