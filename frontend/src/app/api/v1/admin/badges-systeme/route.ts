import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

// GET /api/v1/admin/badges-systeme — list all system-level badges/qualifications
export async function GET() {
  try {
    await requireAdmin();
    const badges = await prisma.badgeSysteme.findMany({ orderBy: { nom: "asc" } });
    return apiSuccess(badges);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin GET badges-systeme error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}

// POST /api/v1/admin/badges-systeme — upsert a system badge by name (idempotent)
//
// Used to seed new qualification categories (e.g. "Attestation sismique").
// Idempotent: if a badge with the same `nom` exists, it's updated rather
// than creating a duplicate.
const upsertSchema = z.object({
  nom: z.string().min(1).max(120),
  description: z.string().max(500).nullable().optional(),
  icone: z.string().max(50).nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json().catch(() => null);
    const parsed = upsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Payload invalide : nom requis (string)", 400);
    }
    const { nom, description, icone } = parsed.data;
    const badge = await prisma.badgeSysteme.upsert({
      where: { nom },
      create: { nom, description: description ?? null, icone: icone ?? null },
      update: { description: description ?? null, icone: icone ?? null },
    });
    return apiSuccess(badge);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin POST badges-systeme error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
