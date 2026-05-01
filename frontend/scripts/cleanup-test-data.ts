/**
 * Cleanup test data from the prod DB.
 *
 * Removes artisans whose email contains "bativio-test.local" or whose siret
 * matches our fake-SIRET prefix. Run with: `npx tsx scripts/cleanup-test-data.ts`
 *
 * Dry-run by default. Set `EXECUTE=1` to actually delete.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config(); // also load .env if present
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EXECUTE = process.env.EXECUTE === "1";

async function main() {
  // 1. Find test users (created by smoke tests / dev)
  const testUsers = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: "bativio-test.local" } },
        { email: { startsWith: "smoke.test+" } },
      ],
    },
    select: { id: true, email: true, artisan: { select: { id: true, slug: true } } },
  });

  // 2. Find duplicate artisans (same nomAffichage + same ville, multiple records)
  type DupRow = { nom_affichage: string; ville: string | null; count: bigint };
  const duplicateGroups = await prisma.$queryRaw<DupRow[]>`
    SELECT nom_affichage, ville, COUNT(*) as count
    FROM artisans
    WHERE deleted_at IS NULL
    GROUP BY nom_affichage, ville
    HAVING COUNT(*) > 1
  `;

  // 3. Find artisans whose nomAffichage contains "KLIKPHONE" (off-vertical: telecom in BTP directory)
  const offVerticalArtisans = await prisma.artisan.findMany({
    where: {
      OR: [
        { nomAffichage: { contains: "KLIKPHONE", mode: "insensitive" } },
        { nomAffichage: { contains: "Klik Phone", mode: "insensitive" } },
        { slug: { contains: "test-" } },
      ],
      deletedAt: null,
    },
    select: { id: true, slug: true, nomAffichage: true, ville: true },
  });

  console.log("=== TEST USERS ===");
  console.log(`Found ${testUsers.length} test users`);
  for (const u of testUsers) {
    console.log(` - ${u.email} (artisan slug: ${u.artisan?.slug ?? "—"})`);
  }

  console.log("\n=== DUPLICATE ARTISANS ===");
  console.log(`Found ${duplicateGroups.length} duplicate groups`);
  for (const g of duplicateGroups) {
    console.log(` - "${g.nom_affichage}" / ${g.ville ?? "(no ville)"} : ${g.count} records`);
  }

  console.log("\n=== OFF-VERTICAL / TEST SLUGS ===");
  console.log(`Found ${offVerticalArtisans.length} suspicious artisans`);
  for (const a of offVerticalArtisans) {
    console.log(` - ${a.nomAffichage} (slug=${a.slug}, ville=${a.ville ?? "—"})`);
  }

  if (!EXECUTE) {
    console.log("\n[DRY RUN] No changes applied. Re-run with EXECUTE=1 to delete.");
    return;
  }

  console.log("\n=== EXECUTING DELETIONS ===");

  // Delete test users (artisan first because of the RESTRICT FK on user_id)
  for (const u of testUsers) {
    if (u.artisan) await prisma.artisan.delete({ where: { id: u.artisan.id } });
    await prisma.user.delete({ where: { id: u.id } });
    console.log(`deleted user ${u.email}`);
  }

  // Soft-delete duplicates: keep the one with the highest profilCompletion or
  // earliest createdAt, soft-delete the rest. Doing this safely requires
  // human review per group, so we just log here. Set MERGE_DUPS=1 for
  // automatic soft-delete of the older duplicates.
  if (process.env.MERGE_DUPS === "1") {
    for (const g of duplicateGroups) {
      const rows = await prisma.artisan.findMany({
        where: { nomAffichage: g.nom_affichage, ville: g.ville, deletedAt: null },
        orderBy: [{ profilCompletion: "desc" }, { createdAt: "asc" }],
        select: { id: true, slug: true },
      });
      const [keep, ...losers] = rows;
      console.log(`keeping ${keep.slug}, soft-deleting ${losers.length} duplicates`);
      for (const l of losers) {
        await prisma.artisan.update({ where: { id: l.id }, data: { deletedAt: new Date() } });
      }
    }
  } else {
    console.log("[skip] duplicate merging — set MERGE_DUPS=1 to auto-soft-delete older copies");
  }

  // Soft-delete off-vertical / test-slug artisans
  for (const a of offVerticalArtisans) {
    await prisma.artisan.update({ where: { id: a.id }, data: { deletedAt: new Date(), actif: false } });
    console.log(`soft-deleted ${a.slug}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
