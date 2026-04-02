import { NextRequest } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

const resetSchema = z.object({
  token: z.string().uuid("Token invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetSchema.safeParse(body);
    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { token, password } = parsed.data;

    // Hash the received token with SHA-256
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user where resetTokenHash matches AND resetTokenExpires > now
    const user = await prisma.user.findFirst({
      where: {
        resetTokenHash: tokenHash,
        resetTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return apiError("Ce lien est invalide ou a expiré", 400);
    }

    // Check new password != old password
    const isSamePassword = await bcrypt.compare(password, user.passwordHash);
    if (isSamePassword) {
      return apiError(
        "Le nouveau mot de passe doit être différent de l'ancien",
        400
      );
    }

    // Hash new password with bcrypt (salt 12)
    const newPasswordHash = await bcrypt.hash(password, 12);

    // Update user: new passwordHash, clear reset fields, invalidate sessions
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetTokenHash: null,
        resetTokenExpires: null,
        resetRequestedAt: null,
        resetAttempts: 0,
        refreshTokenHash: null, // Invalidate all sessions
      },
    });

    return apiSuccess({
      message: "Votre mot de passe a été réinitialisé avec succès.",
      redirect: "/connexion",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
