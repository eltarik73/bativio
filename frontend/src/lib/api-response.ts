import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(
    { success: true, data, timestamp: new Date().toISOString() },
    { status }
  );
}

export function apiError(error: string, status = 400, code?: string) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(code ? { code } : {}),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

const PLAN_LABELS: Record<string, string> = {
  agenda: "Starter",
  invoquo_reception: "Starter",
  vitrine: "Pro",
  badge_verifie: "Pro",
  invoquo_depot: "Pro",
  reporting: "Pro",
  sms: "Business",
  devis_ia: "Business",
  agent_ia: "Business",
  invoquo_creation: "Business",
};

/**
 * Handle errors thrown by requireAuth / requireFeature / requireAdmin.
 * Returns an appropriate apiError response, or null if not a known error.
 */
export function handleAuthError(e: unknown): ReturnType<typeof apiError> | null {
  if (!(e instanceof Error)) return null;
  if (e.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
  if (e.message === "FORBIDDEN") return apiError("Accès interdit", 403);
  if (e.message === "ARTISAN_NOT_FOUND") return apiError("Artisan non trouvé", 404);
  if (e.message.startsWith("PLAN_REQUIRED:")) {
    const feature = e.message.split(":")[1];
    const plan = PLAN_LABELS[feature] || "supérieur";
    return apiError(`Cette fonctionnalité est disponible à partir du plan ${plan}`, 403, "PLAN_REQUIRED");
  }
  return null;
}
