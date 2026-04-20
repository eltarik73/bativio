import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { runDevisAgent } from "@/lib/agents/devis-agent";
import crypto from "crypto";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const { id: demandeId } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      select: { id: true },
    });
    if (!artisan) return apiError("Artisan introuvable", 404);

    // Vérifier que l'artisan a bien reçu cette demande
    const envoi = await prisma.demandeEnvoi.findUnique({
      where: { demandeId_artisanId: { demandeId, artisanId: artisan.id } },
    });
    if (!envoi) return apiError("Cette demande ne vous a pas été adressée", 403);

    // Marquer vu
    if (!envoi.seenAt) {
      await prisma.demandeEnvoi.update({
        where: { id: envoi.id },
        data: { seenAt: new Date() },
      });
    }

    // Lancer Agent 4
    const result = await runDevisAgent({ artisanId: artisan.id, demandeId });

    if (result.response.status === "need_clarif") {
      return apiSuccess({
        status: "need_clarif",
        clarifications: result.response.clarifications ?? [],
        _meta: { cost: result.cost, tokensIn: result.tokensIn, tokensOut: result.tokensOut, model: result.modelUsed },
      });
    }

    const r = result.response;
    if (!r.lignes || r.totalHt === undefined) {
      return apiError("Réponse agent incomplète", 500);
    }

    const viewToken = crypto.randomBytes(16).toString("hex");
    const numero = r.numero ?? `BTV-2026-${String(Date.now()).slice(-5)}`;

    // Récupère infos client depuis la demande
    const demandeFull = await prisma.demandeProjet.findUnique({
      where: { id: demandeId },
      select: { contactNom: true, contactEmail: true, contactTel: true, villeLabel: true },
    });

    // Upsert Client CRM auto (linking P0 audit)
    let clientId: string | null = null;
    if (demandeFull?.contactEmail && demandeFull.contactNom) {
      const existing = await prisma.client.findUnique({
        where: { artisanId_email: { artisanId: artisan.id, email: demandeFull.contactEmail } },
      }).catch(() => null);
      const client = existing || await prisma.client.create({
        data: {
          artisanId: artisan.id,
          nom: demandeFull.contactNom,
          email: demandeFull.contactEmail,
          telephone: demandeFull.contactTel,
          ville: demandeFull.villeLabel,
        },
      }).catch(() => null);
      if (client) clientId = client.id;
    }

    // Créer le devis en DB (linké à demande + client)
    const devis = await prisma.devis.create({
      data: {
        artisanId: artisan.id,
        numero,
        clientNom: demandeFull?.contactNom ?? "Client",
        clientEmail: demandeFull?.contactEmail ?? null,
        clientTelephone: demandeFull?.contactTel ?? null,
        clientAdresse: null,
        ...(clientId ? { clientId } : {}),
        objet: r.objet ?? "Devis Bativio",
        niveauGamme: "standard",
        fournitureOption: "artisan_fournit",
        postes: r.lignes as unknown as object,
        totalHT: r.totalHt,
        tauxTVA: r.lignes[0]?.tva ?? 10,
        montantTVA: r.totalTva ?? 0,
        totalTTC: r.totalTtc ?? r.totalHt,
        dureeEstimee: r.dureeEstimee ?? null,
        conditionsPaiement: r.conditionsPaiement ?? null,
        notes: r.notes ?? null,
        mentionSousReserve: true,
        validiteJours: r.validiteJours ?? 30,
        statut: "BROUILLON",
        viewToken,
        source: "IA",
        demandeProjetId: demandeId,
        promptVersion: "v1.0",
        modelUsed: result.modelUsed,
        tokensIn: result.tokensIn,
        tokensOut: result.tokensOut,
        costEur: result.cost,
        ...(r.mentionsObligatoires ? { mentionsJson: r.mentionsObligatoires as unknown as object } : {}),
      },
    });

    await prisma.demandeEnvoi.update({
      where: { id: envoi.id },
      data: { respondedAt: new Date() },
    });

    return apiSuccess({
      status: "ok",
      devis,
      preview: result.response,
      _meta: { cost: result.cost, tokensIn: result.tokensIn, tokensOut: result.tokensOut, model: result.modelUsed },
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    console.error("Generate devis error:", err);
    return apiError(err.message || "Erreur génération devis", 500);
  }
}
