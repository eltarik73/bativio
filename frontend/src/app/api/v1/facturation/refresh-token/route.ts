import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { SignJWT } from "jose";

// Invoquo embed uses EMBED_JWT_SECRET (not JWT_SECRET)
// Token must have: sub=tenantId, siret, type="embed", modules=[]

const ALL_MODULES = [
  "dashboard", "invoices", "received", "quotes",
  "clients", "reporting", "export", "compliance", "settings",
];

export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan?.invoquoEnabled) return apiError("Facturation non activée", 400);

    const siret = artisan.invoquoSiret || artisan.siret || "";

    const embedSecret = process.env.EMBED_JWT_SECRET;
    if (!embedSecret) {
      console.error("[FACTURATION] EMBED_JWT_SECRET not configured");
      return apiError("Configuration facturation manquante", 500);
    }

    // Get the Invoquo tenant ID by logging in
    const invoquoEmail = `bativio-${artisan.id}@bativio.fr`;
    const invoquoPassword = artisan.invoquoApiKey || "";

    let tenantId = artisan.id; // fallback

    try {
      const loginRes = await fetch("https://invoquo.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: invoquoEmail, password: invoquoPassword }),
        redirect: "manual",
      });

      if (loginRes.ok) {
        const setCookieHeader = loginRes.headers.get("set-cookie") || "";
        const tokenMatch = setCookieHeader.match(/invoquo-session=([^;]+)/);
        if (tokenMatch?.[1]) {
          try {
            const parts = tokenMatch[1].split(".");
            const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
            tenantId = payload.tenantId || tenantId;
          } catch { /* use fallback */ }
        }
      }
    } catch { /* use fallback */ }

    // Sign embed token with EMBED_JWT_SECRET — must match Invoquo's verifyEmbedToken()
    const secret = new TextEncoder().encode(embedSecret);
    const token = await new SignJWT({
      sub: tenantId,
      siret,
      type: "embed",
      modules: ALL_MODULES,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    return apiSuccess({ token, siret });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    console.error("Facturation refresh-token error:", err);
    return apiError("Erreur interne", 500);
  }
}
