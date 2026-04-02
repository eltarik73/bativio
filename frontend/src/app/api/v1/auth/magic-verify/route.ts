import { prisma } from "@/lib/prisma";
import { setAuthCookie } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { z } from "zod";
import crypto from "crypto";

const schema = z.object({
  token: z.string().min(1, "Token manquant"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return apiError("Token manquant", 400);
    }
    const { token } = parsed.data;

    // Hash token to compare with DB
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        magicTokenHash: tokenHash,
        magicTokenExpires: { gt: new Date() },
      },
      include: {
        artisan: {
          include: { metier: true },
        },
      },
    });

    if (!user) {
      return apiError("Ce lien est invalide ou a expiré.", 400);
    }

    // One-time use: clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        magicTokenHash: null,
        magicTokenExpires: null,
        magicAttempts: 0,
        magicRequestedAt: null,
      },
    });

    // Set auth cookie — SAME as login route
    await setAuthCookie(user.id, user.role);

    const artisan = user.artisan;

    console.log(`[MAGIC-LINK] Login success for ${user.email}`);

    return apiSuccess({
      message: "Connexion réussie",
      redirect: user.role === "ADMIN" ? "/admin" : "/dashboard",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      artisan: artisan
        ? {
            id: artisan.id,
            email: user.email,
            nom: artisan.nomAffichage,
            role: user.role,
            plan: artisan.plan,
            slug: artisan.slug,
            ville: artisan.ville,
            metierNom: artisan.metier?.nom ?? null,
            actif: artisan.actif,
          }
        : null,
    });
  } catch (error) {
    console.error("[MAGIC-VERIFY] Error:", error);
    return apiError("Erreur interne", 500);
  }
}
