import { NextRequest } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

const bodySchema = z.object({
  telephone: z.string().min(6).max(30),
});

// Rate limit : 3 OTP max par numero par heure
async function checkRateLimit(telephone: string, ip: string): Promise<boolean> {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const count = await prisma.otpVerification.count({
    where: { telephone, createdAt: { gte: since } },
  });
  return count < 3;
}

function formatPhone(phone: string): string {
  let c = phone.replace(/\s+/g, "");
  if (c.startsWith("0")) c = "+33" + c.slice(1);
  return c;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return apiError("Téléphone invalide", 400);

    const telephone = formatPhone(parsed.data.telephone);
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const okRate = await checkRateLimit(telephone, ip);
    if (!okRate) return apiError("Trop de tentatives. Réessayez dans 1h.", 429);

    // Génère code 6 chiffres
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    await prisma.otpVerification.create({
      data: {
        telephone,
        codeHash,
        ip,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // TODO: envoyer vraiment le SMS via OVH (sms.ts a déjà la logique)
    if (process.env.NODE_ENV !== "production") {
      console.log(`[OTP dev] ${telephone} → ${code}`);
    }

    return apiSuccess({
      sent: true,
      telephone,
      ttlMin: 10,
      devCode: process.env.NODE_ENV === "development" ? code : undefined,
    });
  } catch (error: unknown) {
    console.error("OTP send error:", error);
    return apiError("Erreur serveur", 500);
  }
}
