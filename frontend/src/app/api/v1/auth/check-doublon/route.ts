import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { z } from "zod";

const schema = z.object({
  siret: z.string().optional(),
  email: z.string().email().optional(),
  telephone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return apiError("Données invalides", 400);
    }

    const { siret, email, telephone } = parsed.data;
    if (!siret && !email && !telephone) {
      return apiSuccess({ exists: false });
    }

    const conditions = [];
    if (siret) conditions.push({ siret });
    if (email) conditions.push({ user: { email: email.toLowerCase().trim() } });
    if (telephone) conditions.push({ telephone: telephone.replace(/[\s.\-+]/g, "").replace(/^33/, "0") });

    const existing = await prisma.artisan.findFirst({
      where: { OR: conditions },
      select: { siret: true, telephone: true, user: { select: { email: true } } },
    });

    if (!existing) {
      return apiSuccess({ exists: false });
    }

    let champDoublon = "SIRET";
    if (email && existing.user?.email === email.toLowerCase().trim()) {
      champDoublon = "adresse email";
    } else if (telephone && existing.telephone === telephone.replace(/[\s.\-+]/g, "").replace(/^33/, "0")) {
      champDoublon = "numéro de téléphone";
    }

    return new Response(
      JSON.stringify({
        error: "doublon",
        message: `Une entreprise avec ce ${champDoublon} est déjà inscrite sur Bativio.`,
        champDoublon,
      }),
      { status: 409, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Check doublon error:", error);
    return apiError("Erreur interne", 500);
  }
}
