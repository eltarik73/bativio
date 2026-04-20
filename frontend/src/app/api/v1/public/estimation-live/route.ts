import { NextRequest } from "next/server";
import { z } from "zod";
import { apiSuccess, apiError } from "@/lib/api-response";
import { runPreDevisAgent } from "@/lib/agents/pre-devis-agent";

const bodySchema = z.object({
  metier: z.string().min(2),
  description: z.string().min(5),
  qualifData: z.record(z.string(), z.string()),
  ville: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return apiError("Invalide", 400);

    // Si moins de 2 infos collectées, pas d'estimation fiable
    if (Object.keys(parsed.data.qualifData).length < 2) {
      return apiSuccess({ tooEarly: true });
    }

    const result = await runPreDevisAgent({
      metier: parsed.data.metier,
      description: parsed.data.description,
      qualifData: parsed.data.qualifData,
      ville: parsed.data.ville ?? null,
    });

    return apiSuccess({
      tooEarly: false,
      ...result.response,
      _cost: result.cost,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("estimation-live error:", err);
    return apiError(err.message || "Erreur estimation", 500);
  }
}
