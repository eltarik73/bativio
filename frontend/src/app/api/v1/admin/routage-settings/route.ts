import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await prisma.routageSettings.findUnique({ where: { scope: "global" } });
    return apiSuccess(settings);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "FORBIDDEN") return apiError("Acces admin requis", 403);
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    return apiError("Erreur serveur", 500);
  }
}

const putSchema = z.object({
  modeDefault: z.enum(["MANUEL", "AUTO_TOUS", "AUTO_CONCERNES", "AUTO_PRO", "AUTO_BUSINESS"]),
  delaiManuelMin: z.number().min(0).max(10080).nullable().optional(),
  emailTemplate: z.string().max(5000).nullable().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = putSchema.safeParse(body);
    if (!parsed.success) return apiError("Paramètres invalides", 400);

    const updated = await prisma.routageSettings.upsert({
      where: { scope: "global" },
      update: parsed.data,
      create: { scope: "global", ...parsed.data },
    });

    return apiSuccess(updated);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "FORBIDDEN") return apiError("Acces admin requis", 403);
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    return apiError("Erreur serveur", 500);
  }
}
