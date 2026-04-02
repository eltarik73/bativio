import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRelanceArtisan, sendRelanceClient } from "@/lib/devis-emails";

export async function GET(request: NextRequest) {
  try {
    // -----------------------------------------------------------------------
    // Auth check
    // -----------------------------------------------------------------------
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { success: false, error: "Non autorise" },
        { status: 401 }
      );
    }

    const now = new Date();
    const il24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const il48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const il30j = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let relancesArtisan = 0;
    let relancesClient = 0;
    let archived = 0;

    // -----------------------------------------------------------------------
    // 1. Relance artisan : NOUVEAU, cree il y a > 24h, relanceCount < 2
    // -----------------------------------------------------------------------
    const demandesArtisan = await prisma.demandeDevis.findMany({
      where: {
        statut: "NOUVEAU",
        createdAt: { lt: il24h },
        relanceCount: { lt: 2 },
      },
      include: {
        artisan: {
          include: {
            user: { select: { email: true } },
          },
        },
      },
    });

    for (const demande of demandesArtisan) {
      try {
        await sendRelanceArtisan({
          artisanEmail: demande.artisan.user.email,
          artisanNom: demande.artisan.nomAffichage,
          clientNom: demande.nomClient,
          demandeId: demande.id,
        });

        await prisma.demandeDevis.update({
          where: { id: demande.id },
          data: {
            relanceCount: { increment: 1 },
            relanceEnvoyee: true,
          },
        });

        relancesArtisan++;
      } catch (e) {
        console.error(
          `Relance artisan failed for demande ${demande.id}:`,
          e
        );
      }
    }

    // -----------------------------------------------------------------------
    // 2. Relance client : REPONDU, reponduAt > 48h, aucun message client
    //    apres reponduAt, relanceCount < 2, emailClient present
    // -----------------------------------------------------------------------
    const demandesClient = await prisma.demandeDevis.findMany({
      where: {
        statut: "REPONDU",
        reponduAt: { lt: il48h },
        relanceCount: { lt: 2 },
        emailClient: { not: null },
        responseToken: { not: null },
      },
      include: {
        artisan: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    for (const demande of demandesClient) {
      // Skip if the client already replied after reponduAt
      const lastMsg = demande.messages[0];
      if (
        lastMsg &&
        lastMsg.auteur === "client" &&
        demande.reponduAt &&
        lastMsg.createdAt > demande.reponduAt
      ) {
        continue;
      }

      try {
        await sendRelanceClient({
          clientEmail: demande.emailClient!,
          clientNom: demande.nomClient,
          artisanNom: demande.artisan.nomAffichage,
          responseToken: demande.responseToken!,
        });

        await prisma.demandeDevis.update({
          where: { id: demande.id },
          data: {
            relanceCount: { increment: 1 },
            relanceEnvoyee: true,
          },
        });

        relancesClient++;
      } catch (e) {
        console.error(
          `Relance client failed for demande ${demande.id}:`,
          e
        );
      }
    }

    // -----------------------------------------------------------------------
    // 3. Auto-archive : > 30 jours sans activite
    // -----------------------------------------------------------------------
    const demandesExpired = await prisma.demandeDevis.findMany({
      where: {
        statut: { in: ["NOUVEAU", "VU", "REPONDU"] },
        updatedAt: { lt: il30j },
      },
      select: { id: true },
    });

    if (demandesExpired.length > 0) {
      const ids = demandesExpired.map((d) => d.id);
      await prisma.demandeDevis.updateMany({
        where: { id: { in: ids } },
        data: {
          statut: "ARCHIVE",
          expiresAt: now,
        },
      });
      archived = ids.length;
    }

    // -----------------------------------------------------------------------
    // Summary
    // -----------------------------------------------------------------------
    return NextResponse.json({
      success: true,
      data: {
        relancesArtisan,
        relancesClient,
        archived,
        timestamp: now.toISOString(),
      },
    });
  } catch (e: unknown) {
    console.error("CRON relances error:", e);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
