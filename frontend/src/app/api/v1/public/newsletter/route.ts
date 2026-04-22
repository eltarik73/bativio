import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

const bodySchema = z.object({
  email: z.string().email("Email invalide").max(254),
  source: z.string().regex(/^[a-z0-9_-]*$/, "Source invalide").max(50).optional(),
});

// Rate limiting basique in-memory (remplacer par Upstash pour multi-instance)
const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const entry = attempts.get(ip);
    if (entry && now < entry.resetAt && entry.count >= 5) {
      return apiError("Trop de tentatives. Réessayez plus tard.", 429);
    }
    if (!entry || now >= entry.resetAt) {
      attempts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    } else {
      entry.count++;
    }

    const body = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Données invalides", 400);
    }

    const { email, source } = parsed.data;

    // Upsert : si email déjà présent, on ne crée pas de doublon
    try {
      await prisma.newsletterSubscriber.upsert({
        where: { email: email.toLowerCase() },
        create: { email: email.toLowerCase(), source: source || null },
        update: { unsubscribedAt: null }, // ré-activer si désinscrit avant
      });
      return apiSuccess({ subscribed: true, email: email.toLowerCase() });
    } catch (err: unknown) {
      console.error("Newsletter subscribe error:", err);
      return apiError("Erreur lors de l'inscription", 500);
    }
  } catch {
    return apiError("Erreur interne du serveur", 500);
  }
}
