import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan?.invoquoEnabled) return apiError("Facturation non activée", 400);

    // Le invoquoApiKey stocke le mot de passe Invoquo
    const invoquoEmail = `bativio-${artisan.id}@bativio.fr`;
    const invoquoPassword = artisan.invoquoApiKey || "";

    // Login sur Invoquo — le token est dans le Set-Cookie header
    const loginRes = await fetch("https://invoquo.vercel.app/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: invoquoEmail, password: invoquoPassword }),
      redirect: "manual",
    });

    if (!loginRes.ok) {
      console.error("Invoquo login failed:", loginRes.status);
      return apiError("Impossible de se connecter à Invoquo", 502);
    }

    // Extraire le token du Set-Cookie header
    const setCookieHeader = loginRes.headers.get("set-cookie") || "";
    const tokenMatch = setCookieHeader.match(/invoquo-session=([^;]+)/);
    const token = tokenMatch?.[1] || "";

    if (!token) {
      // Fallback: chercher dans le body
      const body = await loginRes.json();
      const bodyToken = body.data?.accessToken || body.data?.token;
      if (bodyToken) return apiSuccess({ token: bodyToken });
      console.error("No token found in Invoquo response");
      return apiError("Token Invoquo introuvable", 502);
    }

    return apiSuccess({ token });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    console.error("Facturation refresh-token error:", err);
    return apiError("Erreur interne", 500);
  }
}
