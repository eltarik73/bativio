import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  nom: z.string().optional(),
  nomAffichage: z.string().optional(),
  siret: z.string().optional(),
  telephone: z.string().optional(),
  metierId: z.string().optional(),
  ville: z.string().optional(),
  zoneRayonKm: z.number().int().min(5).max(80).optional(),
});

function generateSlug(nom: string): string {
  return nom
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove diacritics
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

    const data = parsed.data;
    const email = data.email;
    const password = data.password;
    const nom = data.nomAffichage || data.nom || email.split("@")[0];
    const telephone = data.telephone || "";
    const siret = data.siret && data.siret.length >= 9 ? data.siret : `TEMP${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
    const { metierId, ville, zoneRayonKm } = data;

    // Check for duplicates: email, siret, telephone
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "doublon",
          message: "Une entreprise avec cet email est déjà inscrite.",
          champDoublon: "email",
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    if (!siret.startsWith("TEMP")) {
      const existingSiret = await prisma.artisan.findUnique({ where: { siret } });
      if (existingSiret) {
        return NextResponse.json(
          {
            success: false,
            error: "doublon",
            message: "Une entreprise avec ce SIRET est déjà inscrite.",
            champDoublon: "siret",
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );
      }
    }

    if (telephone) {
      const existingTelephone = await prisma.artisan.findFirst({
        where: { telephone },
      });
      if (existingTelephone) {
        return NextResponse.json(
          {
            success: false,
            error: "doublon",
            message: "Une entreprise avec ce numéro de téléphone est déjà inscrite.",
            champDoublon: "telephone",
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );
      }
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

    // Resolve metierId — accepts slug or cuid
    let resolvedMetierId: string | null = null;
    if (metierId) {
      const metier = await prisma.metier.findFirst({
        where: {
          OR: [
            { id: metierId },
            { slug: metierId },
            { nom: { equals: metierId, mode: "insensitive" } },
          ],
        },
      });
      resolvedMetierId = metier?.id || null;
    }

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
          metierId: resolvedMetierId,
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
  } catch (error: unknown) {
    console.error("Register error:", error);
    const err = error as { code?: string; meta?: { target?: string[] } };
    if (err.code === "P2002") {
      const field = err.meta?.target?.[0] || "champ";
      if (field === "email") return apiError("Un compte existe déjà avec cet email", 409);
      if (field === "siret") return apiError("Un compte existe déjà avec ce SIRET", 409);
      if (field === "slug") return apiError("Ce nom est déjà pris, essayez un autre", 409);
      return apiError(`Ce ${field} est déjà utilisé`, 409);
    }
    return apiError("Erreur interne du serveur", 500);
  }
}
