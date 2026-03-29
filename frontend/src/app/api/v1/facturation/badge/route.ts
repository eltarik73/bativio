import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan?.invoquoApiKey) return apiSuccess({ count: 0 });

    try {
      const res = await fetch("https://invoquo.vercel.app/api/v1/stats", {
        headers: { "X-Api-Key": artisan.invoquoApiKey },
      });
      if (!res.ok) return apiSuccess({ count: 0 });
      const json = await res.json();
      return apiSuccess({
        count: json.data?.pendingReceivedInvoices || 0,
      });
    } catch {
      return apiSuccess({ count: 0 });
    }
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    return apiSuccess({ count: 0 });
  }
}
