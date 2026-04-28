import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { sendEmail } from "@/lib/email";

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  nom: z.string().optional(),
  nomAffichage: z.string().optional(),
  siret: z.string().min(9, "SIRET/SIREN requis").regex(/^\d{9,14}$/, "SIRET invalide"),
  telephone: z.string().optional(),
  metierId: z.string().optional(),
  ville: z.string().optional(),
  codeInsee: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  zoneRayonKm: z.number().int().min(5).max(80).optional(),
});

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

const registerAttempts = new Map<string, { count: number; resetAt: number }>();

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
    // Rate limiting per IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const ipEntry = registerAttempts.get(ip);
    if (ipEntry && now < ipEntry.resetAt && ipEntry.count >= 3) {
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
        },
        include: {
          metier: true,
        },
      });

      return { user, artisan };
    });

    // Track registration attempt for rate limiting
    const currentIpEntry = registerAttempts.get(ip);
    if (!currentIpEntry || now >= currentIpEntry.resetAt) {
      registerAttempts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    } else {
      currentIpEntry.count++;
    }

    // Set auth cookie
    await setAuthCookie(result.user.id, result.user.role);

    // Send welcome email — AWAIT obligatoire car Vercel kill la fonction serverless
    // des que la Response est retournee (fire-and-forget = fetch interrompu).
    // sendEmail ne throw jamais (fail-safe), donc await + catch garde la robustesse.
    await sendEmail(
      email,
      "Bienvenue sur Bativio — votre inscription est en cours de validation",
      `
        <div style="font-family:'Karla',Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#3D2E1F;">
          <h1 style="font-family:'Fraunces',serif;font-size:24px;color:#C4531A;margin-bottom:16px;">Bonjour ${nom} 👋</h1>
          <p style="font-size:15px;line-height:1.6;">Merci pour votre inscription sur <strong>Bativio</strong>, la plateforme des artisans du bâtiment en Rhône-Alpes.</p>
          <p style="font-size:15px;line-height:1.6;">Notre équipe va vérifier votre profil sous <strong>24 à 48 heures</strong> ouvrées. Vous recevrez un email dès que votre fiche sera publiée dans l'annuaire.</p>
          <div style="background:#FAF8F5;border-left:3px solid #C4531A;padding:16px;margin:20px 0;border-radius:4px;">
            <strong style="color:#C4531A;">Prochaines étapes :</strong>
            <ol style="margin:8px 0 0 20px;padding:0;font-size:14px;line-height:1.6;">
              <li>Connectez-vous à votre espace pour compléter votre profil</li>
              <li>Ajoutez vos photos de chantiers et vos qualifications</li>
              <li>Notre équipe valide votre fiche</li>
              <li>Vous commencez à recevoir des demandes de devis</li>
            </ol>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://www.bativio.fr"}/dashboard"
             style="display:inline-block;padding:14px 28px;background:#C4531A;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;margin-top:8px;">
            Accéder à mon espace
          </a>
          <p style="font-size:13px;color:#9C958D;margin-top:32px;line-height:1.5;">
            Une question ? Répondez simplement à cet email, nous vous répondons sous 24h.<br>
            <strong>L'équipe Bativio</strong>
          </p>
        </div>
      `
    ).catch((e) => console.error("[register] welcome email failed:", e));

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
