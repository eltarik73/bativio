import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

export async function GET() {
  try {
    const session = await requireAuth();
    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      select: { id: true },
    });
    if (!artisan) return apiError("Artisan introuvable", 404);

    const tarifs = await prisma.tarifHoraireMetier.findMany({
      where: { artisanId: artisan.id },
      orderBy: { metierNom: "asc" },
    });

    return apiSuccess(tarifs);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    return apiError("Erreur serveur", 500);
  }
}

const bodySchema = z.object({
  metierSlug: z.string().min(2).max(50),
  metierNom: z.string().min(2).max(100),
  tarifHoraire: z.number().min(15).max(300),
  tarifUrgence: z.number().min(0).max(500).nullable().optional(),
  tarifWeekend: z.number().min(0).max(500).nullable().optional(),
  minimumFacture: z.number().min(0).max(5000).nullable().optional(),
  minimumHeures: z.number().min(0).max(24).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      select: { id: true },
    });
    if (!artisan) return apiError("Artisan introuvable", 404);

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalide", 400);

    const tarif = await prisma.tarifHoraireMetier.upsert({
      where: { artisanId_metierSlug: { artisanId: artisan.id, metierSlug: parsed.data.metierSlug } },
      update: parsed.data,
      create: { artisanId: artisan.id, ...parsed.data },
    });

    return apiSuccess(tarif);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    return apiError("Erreur serveur", 500);
  }
}
