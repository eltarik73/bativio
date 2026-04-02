import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setAuthCookie } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

const loginSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { email, password } = parsed.data;

    // Rate limiting per email
    const key = email.toLowerCase();
    const now = Date.now();
    const entry = loginAttempts.get(key);
    if (entry && now < entry.resetAt && entry.count >= 10) {
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
      // Track failed attempt
      const current = loginAttempts.get(key);
      if (!current || now >= current.resetAt) {
        loginAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
      } else {
        current.count++;
      }
      return apiError("Identifiants incorrects", 401);
    }

    // Check if artisan is soft-deleted
    if (user.artisan?.deletedAt) {
      return apiError("Identifiants incorrects", 401);
    }

    // Verify password
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      // Track failed attempt
      const current = loginAttempts.get(key);
      if (!current || now >= current.resetAt) {
        loginAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
      } else {
        current.count++;
      }
      return apiError("Identifiants incorrects", 401);
    }

    // Successful login — clear rate limit
    loginAttempts.delete(key);

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
