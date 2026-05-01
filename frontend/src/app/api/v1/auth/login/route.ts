import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setAuthCookie } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { consumeRateLimit, resetRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { email, password } = parsed.data;

    // Rate limiting per email — 10 tentatives / 15 min (DB-backed, multi-region safe)
    const rlKey = `login:${email.toLowerCase()}`;
    const rl = await consumeRateLimit(rlKey, 10, 15 * 60 * 1000);
    if (!rl.allowed) {
      return apiError("Trop de tentatives. Réessayez dans 15 minutes.", 429);
    }

    // Find user by email with artisan relation (exclude soft-deleted)
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        artisan: {
          include: {
            metier: true,
          },
        },
      },
    });

    if (!user) {
      return apiError("Identifiants incorrects", 401);
    }

    // Check if artisan is soft-deleted
    if (user.artisan?.deletedAt) {
      return apiError("Identifiants incorrects", 401);
    }

    // Verify password
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return apiError("Identifiants incorrects", 401);
    }

    // Successful login — clear rate limit
    await resetRateLimit(rlKey);

    // Set auth cookie
    await setAuthCookie(user.id, user.role);

    const artisan = user.artisan;

    return apiSuccess({
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
            status: artisan.actif ? "ACTIF" : "INACTIF",
            plan: artisan.plan,
            slug: artisan.slug,
            ville: artisan.ville,
            metierNom: artisan.metier?.nom ?? null,
            actif: artisan.actif,
            profilCompletion: artisan.profilCompletion,
            telephone: artisan.telephone,
            description: artisan.description,
          }
        : null,
    });
  } catch (error) {
    console.error("Login error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
