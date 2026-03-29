import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { z } from "zod";

const schema = z.object({
  nom: z.string().min(1),
  slug: z.string().min(1),
  icone: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Données invalides", 400);

    const existing = await prisma.metier.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) return apiError("Un métier avec ce slug existe déjà", 409);

    const metier = await prisma.metier.create({ data: parsed.data });
    return apiSuccess(metier, 201);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin create metier error:", err);
    return apiError("Erreur interne", 500);
  }
}
