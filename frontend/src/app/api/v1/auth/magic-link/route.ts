import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { sendEmail } from "@/lib/email";
import { z } from "zod";
import crypto from "crypto";

const schema = z.object({
  email: z.string().email("Email invalide").transform((v) => v.toLowerCase().trim()),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return apiError("Email invalide", 400);
    }
    const { email } = parsed.data;

    // Always return same response (don't reveal if email exists)
    const genericResponse = { message: "Si cette adresse est inscrite, un email a été envoyé." };

    const user = await prisma.user.findUnique({
      where: { email },
      include: { artisan: { select: { deletedAt: true } } },
    });

    if (!user || user.artisan?.deletedAt) {
      return apiSuccess(genericResponse);
    }

    // Rate limit: 5 per hour
    if (user.magicRequestedAt) {
      const since = Date.now() - user.magicRequestedAt.getTime();
      const oneHour = 60 * 60 * 1000;
      if (since < oneHour && user.magicAttempts >= 5) {
        return apiSuccess(genericResponse);
      }
      if (since >= oneHour) {
        await prisma.user.update({ where: { id: user.id }, data: { magicAttempts: 0 } });
      }
    }

    // Generate token + hash
    const magicToken = crypto.randomUUID();
    const magicTokenHash = crypto.createHash("sha256").update(magicToken).digest("hex");
    const magicExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await prisma.user.update({
      where: { id: user.id },
      data: {
        magicTokenHash,
        magicTokenExpires: magicExpires,
        magicRequestedAt: new Date(),
        magicAttempts: { increment: 1 },
      },
    });

    // Send email
    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bativio.fr";
    const magicUrl = `${appUrl}/auth/magic?token=${magicToken}`;

    await sendEmail(
      email,
      "Votre lien de connexion Bativio",
      `<!DOCTYPE html><html><body style="font-family:Karla,Helvetica,Arial,sans-serif;background:#FAF8F5;padding:40px 20px;">
<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:14px;border:1px solid #E8D5C0;padding:32px;">
<h1 style="font-family:Georgia,serif;font-size:22px;color:#3D2E1F;margin:0 0 16px;">Connexion &agrave; Bativio</h1>
<p style="font-size:14px;color:#5C4A3A;line-height:1.6;margin:0 0 24px;">Cliquez sur le bouton ci-dessous pour vous connecter instantan&eacute;ment &agrave; votre espace Bativio.</p>
<p style="text-align:center;margin:0 0 24px;"><a href="${magicUrl}" style="display:inline-block;background:#C4531A;color:#fff;padding:14px 32px;border-radius:99px;text-decoration:none;font-weight:600;font-size:15px;">Me connecter</a></p>
<p style="font-size:12px;color:#9C958D;line-height:1.5;margin:0 0 8px;">Ce lien est valable <strong>15 minutes</strong>.</p>
<p style="font-size:12px;color:#9C958D;line-height:1.5;margin:0;">Si vous n'&ecirc;tes pas &agrave; l'origine de cette demande, ignorez cet email.</p>
<hr style="border:none;border-top:1px solid #E8D5C0;margin:24px 0;">
<p style="font-size:11px;color:#9C958D;text-align:center;">Bativio &mdash; La plateforme des artisans du b&acirc;timent</p>
</div></body></html>`
    );

    console.log(`[MAGIC-LINK] Sent to ${email}`);
    return apiSuccess(genericResponse);
  } catch (error) {
    console.error("[MAGIC-LINK] Error:", error);
    return apiError("Erreur interne", 500);
  }
}
