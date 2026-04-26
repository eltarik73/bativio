import { NextRequest } from "next/server";
import { z } from "zod";
import { apiSuccess, apiError } from "@/lib/api-response";
import { runQualifAgent, type QualifMessage } from "@/lib/agents/qualif-agent";
import { rateLimitAi, getClientIp } from "@/lib/rate-limit";

const bodySchema = z.object({
  description: z.string().min(5).max(2000),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(5000),
  })).max(30),
  collected: z.record(z.string(), z.string()),
  ville: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    // SÉCU: rate-limit IA (30 req/IP/h) — empêche abuse compte Anthropic
    const ip = getClientIp(request);
    const limit = await rateLimitAi(ip);
    if (!limit.success) {
      return apiError(
        `Trop de requêtes. Réessayez après ${new Date(limit.reset).toLocaleTimeString("fr-FR")}.`,
        429,
      );
    }

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Paramètres invalides", 400);
    }

    const result = await runQualifAgent({
      initialDescription: parsed.data.description,
      history: parsed.data.history as QualifMessage[],
      collected: parsed.data.collected,
      ville: parsed.data.ville ?? null,
    });

    return apiSuccess({
      ...result.response,
      _meta: {
        cost: result.cost,
        tokensIn: result.tokensIn,
        tokensOut: result.tokensOut,
        model: result.modelUsed,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("chat-qualif error:", err);
    return apiError(err.message || "Erreur agent qualif", 500);
  }
}
