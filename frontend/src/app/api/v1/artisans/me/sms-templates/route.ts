import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { SMS_TEMPLATES } from "@/lib/sms-templates";

export async function GET() {
  try {
    await requireAuth();
    return apiSuccess(SMS_TEMPLATES);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    return apiError("Erreur serveur", 500);
  }
}
