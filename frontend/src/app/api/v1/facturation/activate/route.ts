import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

const INVOQUO_URL = process.env.INVOQUO_URL || "https://invoquo.vercel.app";
const PROVISION_SECRET = process.env.PROVISION_SECRET;

export async function POST() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: { user: { select: { email: true } } },
    });
    if (!artisan) return apiError("Artisan introuvable", 404);

    // Deja active
    if (artisan.invoquoEnabled && artisan.invoquoApiKey) {
      return apiSuccess({ message: "Déjà activé" });
    }

    // Option 1: Via provisioning API (si PROVISION_SECRET configure)
    if (PROVISION_SECRET) {
      const res = await fetch(`${INVOQUO_URL}/api/v1/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Provision-Secret": PROVISION_SECRET,
        },
        body: JSON.stringify({
          email: artisan.user.email,
          siret: artisan.siret,
          companyName: artisan.nomAffichage,
          source: "bativio",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.apiKey) {
          await prisma.artisan.update({
            where: { id: artisan.id },
            data: {
              invoquoApiKey: data.data.apiKey,
              invoquoSiret: data.data.siret || artisan.siret,
              invoquoEnabled: true,
            },
          });
          return apiSuccess({ message: "Facturation activée" });
        }
      }
    }

    // Option 2: Via register + login (fallback)
    const invoquoEmail = `bativio-${artisan.id}@bativio.fr`;
    const invoquoPassword = `InvBtv_${artisan.id.slice(-8)}!2026`;

    // Tenter register
    const registerRes = await fetch(`${INVOQUO_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: invoquoEmail,
        password: invoquoPassword,
        companyName: artisan.nomAffichage,
        siret: artisan.siret,
      }),
    });

    // Si 409 (existe deja), pas grave, on continue
    if (!registerRes.ok && registerRes.status !== 409) {
      console.error("Invoquo register failed:", registerRes.status);
      return apiError("Erreur lors de l'activation", 502);
    }

    // Stocker le password pour les futurs logins
    await prisma.artisan.update({
      where: { id: artisan.id },
      data: {
        invoquoApiKey: invoquoPassword,
        invoquoSiret: artisan.siret,
        invoquoEnabled: true,
      },
    });

    return apiSuccess({ message: "Facturation activée" });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    console.error("Facturation activate error:", err);
    return apiError("Erreur interne", 500);
  }
}
