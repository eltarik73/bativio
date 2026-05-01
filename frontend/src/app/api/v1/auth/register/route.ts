import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { isNafBtp } from "@/lib/naf-btp";
import { consumeRateLimit } from "@/lib/rate-limit";

// Regex anti-injection : pas de <, >, &#, javascript:, data:, etc.
const SAFE_TEXT = /^[^<>]*$/;
const safeText = (field: string) =>
  z.string().regex(SAFE_TEXT, { message: `${field} contient des caractères interdits (<, >)` });

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  nom: safeText("nom").optional(),
  nomAffichage: safeText("nomAffichage").max(100, "Nom trop long (100 max)").optional(),
  siret: z.string().min(9, "SIRET/SIREN requis").regex(/^\d{9,14}$/, "SIRET invalide"),
  telephone: z.string().regex(/^[0-9\s+()-]*$/, "Téléphone invalide").max(20).optional(),
  metierId: z.string().optional(),
  ville: safeText("ville").max(80).optional(),
  codeInsee: z.string().regex(/^[0-9A-Z]*$/, "Code INSEE invalide").max(10).optional(),
  codeNaf: z.string().regex(/^[0-9.A-Z]*$/, "Code NAF invalide").max(10).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  zoneRayonKm: z.number().int().min(5).max(80).optional(),
});

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

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
    // Rate limiting per IP — 10 inscriptions / heure (DB-backed, multi-region safe)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await consumeRateLimit(`register:${ip}`, 10, 60 * 60 * 1000);
    if (!rl.allowed) {
      return apiError("Trop de tentatives d'inscription. Réessayez plus tard.", 429);
    }

    const body = await request.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const data = parsed.data;
    const email = data.email;
    const password = data.password;
    const nom = stripHtml(data.nomAffichage || data.nom || email.split("@")[0]);
    const telephone = data.telephone || "";
    const siret = data.siret;
    const { metierId, zoneRayonKm } = data;
    const ville = data.ville ? stripHtml(data.ville) : undefined;
    const latitude = typeof data.latitude === "number" ? data.latitude : undefined;
    const longitude = typeof data.longitude === "number" ? data.longitude : undefined;
    const codeInsee = typeof data.codeInsee === "string" ? data.codeInsee : undefined;
    const codeNaf = typeof data.codeNaf === "string" ? data.codeNaf : undefined;

    // Si un code NAF est fourni et qu'il n'est pas dans la whitelist BTP,
    // l'artisan est marqué PENDING_NAF_REVIEW (invisible dans l'annuaire public
    // tant qu'un admin n'a pas validé manuellement)
    const nafBtpOk = codeNaf ? isNafBtp(codeNaf) : null; // null = inconnu
    const initialStatus = nafBtpOk === false ? "PENDING_NAF_REVIEW" : "ONBOARDING";

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

      // Resolve metier slug for SEO
      const metierForSlug = resolvedMetierId ? await tx.metier.findUnique({ where: { id: resolvedMetierId }, select: { slug: true } }) : null;

      const artisan = await tx.artisan.create({
        data: {
          userId: user.id,
          siret,
          nomAffichage: nom,
          telephone,
          metierId: resolvedMetierId,
          ville: ville || null,
          villeSlug: ville ? ville.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : null,
          metierSlugSeo: metierForSlug?.slug || null,
          codeInsee: codeInsee || null,
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          zoneRayonKm: zoneRayonKm ?? 15,
          slug,
          actif: false,
          profilCompletion: 30,
          artisanStatus: initialStatus,
          motifRefus: nafBtpOk === false ? `Code NAF "${codeNaf}" hors BTP — validation admin requise` : null,
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
