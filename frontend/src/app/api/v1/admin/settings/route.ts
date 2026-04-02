import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

const settingsSchema = z.object({
  adminEmail: z.string().email("Format d'email invalide"),
});

export async function GET() {
  try {
    await requireAdmin();

    const settings = await prisma.settings.upsert({
      where: { id: "singleton" },
      update: {},
      create: {
        id: "singleton",
        adminEmail: "contact@bativio.com",
      },
    });

    return apiSuccess({ adminEmail: settings.adminEmail });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Admin settings GET error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.issues[0]?.message || "Donnees invalides",
        400
      );
    }

    const { adminEmail } = parsed.data;

    const settings = await prisma.settings.upsert({
      where: { id: "singleton" },
      update: { adminEmail },
      create: {
        id: "singleton",
        adminEmail,
      },
    });

    return apiSuccess({ adminEmail: settings.adminEmail });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Admin settings PUT error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
