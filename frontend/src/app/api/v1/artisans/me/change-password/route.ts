import { prisma } from "@/lib/prisma";
import { requireAuth, hashPassword, verifyPassword } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { z } from "zod";

const schema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
});

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Données invalides", 400);
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return apiError("Utilisateur introuvable", 404);

    const valid = await verifyPassword(parsed.data.oldPassword, user.passwordHash);
    if (!valid) return apiError("Mot de passe actuel incorrect", 401);

    await prisma.user.update({
      where: { id: session.userId },
      data: { passwordHash: await hashPassword(parsed.data.newPassword) },
    });

    return apiSuccess({ message: "Mot de passe modifié" });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    console.error("Change password error:", err);
    return apiError("Erreur interne", 500);
  }
}
