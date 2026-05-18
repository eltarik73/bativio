import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { z } from "zod";

// POST /api/v1/public/track-click
//
// Endpoint public (sans auth) qui enregistre un clic sur un bouton/lien
// externe pour analytics admin (/admin/statistiques > Clics sortants).
//
// Appele par le composant <ExternalCtaButton> au clic ou via navigator.sendBeacon
// pour ne pas bloquer la navigation. Tres rapide (insert seul, no read).
//
// Rate-limit naturel : 1 clic legitime ≈ 1 user ≈ 1 IP. Si abus, ajouter un
// IP-based rate limit (pas urgent).

const Schema = z.object({
  label: z.string().min(1).max(80),
  targetUrl: z.string().url().max(500),
  sourcePage: z.string().min(1).max(200),
  category: z.string().min(1).max(50).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return apiError("Invalid payload", 400);
    }

    const userAgent = request.headers.get("user-agent")?.slice(0, 200) ?? null;
    const referer = request.headers.get("referer")?.slice(0, 500) ?? null;

    await prisma.clickEvent.create({
      data: {
        label: parsed.data.label,
        targetUrl: parsed.data.targetUrl,
        sourcePage: parsed.data.sourcePage,
        category: parsed.data.category ?? null,
        userAgent,
        referer,
      },
    });

    return apiSuccess({ tracked: true });
  } catch (error) {
    console.error("POST /api/v1/public/track-click error:", error);
    // Ne JAMAIS échouer côté client - les analytics ne doivent pas bloquer l'UX
    return apiSuccess({ tracked: false });
  }
}
