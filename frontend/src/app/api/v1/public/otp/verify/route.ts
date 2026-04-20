import { NextRequest } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

const bodySchema = z.object({
  telephone: z.string().min(6).max(30),
  code: z.string().length(6),
});

function formatPhone(phone: string): string {
  let c = phone.replace(/\s+/g, "");
  if (c.startsWith("0")) c = "+33" + c.slice(1);
  return c;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return apiError("Code invalide", 400);

    const telephone = formatPhone(parsed.data.telephone);
    const codeHash = crypto.createHash("sha256").update(parsed.data.code).digest("hex");

    const otp = await prisma.otpVerification.findFirst({
      where: {
        telephone,
        verifiedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) return apiError("Aucun code actif, demandez-en un nouveau", 400);

    if (otp.attempts >= 5) {
      return apiError("Trop de tentatives. Demandez un nouveau code.", 429);
    }

    await prisma.otpVerification.update({
      where: { id: otp.id },
      data: { attempts: otp.attempts + 1 },
    });

    if (otp.codeHash !== codeHash) {
      return apiError("Code incorrect", 400);
    }

    await prisma.otpVerification.update({
      where: { id: otp.id },
      data: { verifiedAt: new Date() },
    });

    return apiSuccess({ verified: true, telephone });
  } catch (error: unknown) {
    console.error("OTP verify error:", error);
    return apiError("Erreur serveur", 500);
  }
}
