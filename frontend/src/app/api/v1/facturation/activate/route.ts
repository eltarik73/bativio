import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function POST() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: { user: { select: { email: true } } },
    });
    if (!artisan) return apiError("Artisan introuvable", 404);
    if (artisan.invoquoEnabled) return apiError("Déjà activé", 409);

    // Créer un vrai compte sur Invoquo
    const invoquoEmail = `bativio-${artisan.id}@bativio.fr`;
    const invoquoPassword = `InvBtv_${artisan.id.slice(-8)}!2026`;

    const registerRes = await fetch("https://invoquo.vercel.app/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: invoquoEmail,
        password: invoquoPassword,
        companyName: artisan.nomAffichage,
        siret: artisan.siret,
      }),
    });

    if (!registerRes.ok) {
      const err = await registerRes.json().catch(() => ({ error: "Erreur Invoquo" }));
      console.error("Invoquo register error:", err);

      // Si le compte existe deja, essayer de se connecter
      if (registerRes.status === 409) {
        const loginRes = await fetch("https://invoquo.vercel.app/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: invoquoEmail, password: invoquoPassword }),
        });
        if (!loginRes.ok) {
          return apiError("Impossible de se connecter à Invoquo", 502);
        }
        const loginData = await loginRes.json();
        const accessToken = loginData.data?.accessToken;
        if (!accessToken) return apiError("Token Invoquo manquant", 502);

        await prisma.artisan.update({
          where: { id: artisan.id },
          data: {
            invoquoApiKey: invoquoPassword,
            invoquoSiret: artisan.siret,
            invoquoEnabled: true,
          },
        });
        return apiSuccess({ message: "Facturation activée" });
      }

      return apiError("Erreur lors de l'activation Invoquo", 502);
    }

    const registerData = await registerRes.json();
    const accessToken = registerData.data?.accessToken;

    if (!accessToken) {
      return apiError("Token Invoquo manquant", 502);
    }

    // Stocker le password Invoquo (pour re-login auto)
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
