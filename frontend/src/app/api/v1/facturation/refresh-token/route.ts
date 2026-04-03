import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { SignJWT } from "jose";

export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan?.invoquoEnabled) return apiError("Facturation non activée", 400);

    const siret = artisan.invoquoSiret || artisan.siret || "";

    // Sign a fresh token with INVOQUO_JWT_SECRET for the embed iframe
    const invoquoSecret = process.env.INVOQUO_JWT_SECRET;
    if (!invoquoSecret) {
      console.error("[FACTURATION] INVOQUO_JWT_SECRET not configured");
      return apiError("Configuration facturation manquante", 500);
    }

    const secret = new TextEncoder().encode(invoquoSecret);

    // First, get the Invoquo user/tenant IDs by logging in
    const invoquoEmail = `bativio-${artisan.id}@bativio.fr`;
    const invoquoPassword = artisan.invoquoApiKey || "";

    let invoquoUserId = artisan.id;
    let tenantId = artisan.id;

    try {
      const loginRes = await fetch("https://invoquo.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: invoquoEmail, password: invoquoPassword }),
        redirect: "manual",
      });

      if (loginRes.ok) {
        // Extract IDs from the login cookie token
        const setCookieHeader = loginRes.headers.get("set-cookie") || "";
        const tokenMatch = setCookieHeader.match(/invoquo-session=([^;]+)/);
        if (tokenMatch?.[1]) {
          try {
            const parts = tokenMatch[1].split(".");
            const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
            invoquoUserId = payload.sub || invoquoUserId;
            tenantId = payload.tenantId || tenantId;
          } catch { /* use defaults */ }
        }
      }
    } catch { /* use defaults */ }

    // Sign the token with Invoquo's secret — same claims as Invoquo generates
    const token = await new SignJWT({
      sub: invoquoUserId,
      role: "user",
      tenantId: tenantId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    return apiSuccess({ token, siret });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    console.error("Facturation refresh-token error:", err);
    return apiError("Erreur interne", 500);
  }
}
