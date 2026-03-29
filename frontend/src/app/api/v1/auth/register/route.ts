import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  nom: z.string().min(1, "Le nom est requis"),
  siret: z.string().min(1, "Le SIRET est requis"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  metierId: z.string().optional(),
  ville: z.string().optional(),
  zoneRayonKm: z.number().int().min(5).max(80).optional(),
});

function generateSlug(nom: string): string {
  return nom
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alnum with -
    .replace(/-{2,}/g, "-") // dedup consecutive dashes
    .replace(/^-|-$/g, ""); // trim leading/trailing dashes
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { email, password, nom, siret, telephone, metierId, ville, zoneRayonKm } = parsed.data;

    // Check email uniqueness
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return apiError("Un compte existe déjà avec cet email", 409);
    }

    // Check SIRET uniqueness
    const existingSiret = await prisma.artisan.findUnique({ where: { siret } });
    if (existingSiret) {
      return apiError("Un compte existe déjà avec ce SIRET", 409);
    }

    // Generate unique slug
    let slug = generateSlug(nom);
    if (!slug) {
      slug = "artisan";
    }

    // Ensure slug uniqueness
    let slugCandidate = slug;
    let counter = 1;
    while (await prisma.artisan.findUnique({ where: { slug: slugCandidate } })) {
      slugCandidate = `${slug}-${counter}`;
      counter++;
    }
    slug = slugCandidate;

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create User + Artisan in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: "ARTISAN",
        },
      });

      const artisan = await tx.artisan.create({
        data: {
          userId: user.id,
          siret,
          nomAffichage: nom,
          telephone,
          metierId: metierId || null,
          ville: ville || null,
          zoneRayonKm: zoneRayonKm ?? 15,
          slug,
          actif: false,
          profilCompletion: 30,
        },
        include: {
          metier: true,
        },
      });

      return { user, artisan };
    });

    // Set auth cookie
    await setAuthCookie(result.user.id, result.user.role);

    return apiSuccess(
      {
        artisan: {
          id: result.artisan.id,
          email: result.user.email,
          role: result.user.role,
          nomAffichage: result.artisan.nomAffichage,
          slug: result.artisan.slug,
          metierNom: result.artisan.metier?.nom ?? null,
          ville: result.artisan.ville,
          plan: result.artisan.plan,
          profilCompletion: result.artisan.profilCompletion,
          actif: result.artisan.actif,
          telephone: result.artisan.telephone,
          description: result.artisan.description,
          siret: result.artisan.siret,
        },
      },
      201
    );
  } catch (error) {
    console.error("Register error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
