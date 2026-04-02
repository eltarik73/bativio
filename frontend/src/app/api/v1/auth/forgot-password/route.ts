import { NextRequest } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { apiSuccess, apiError } from "@/lib/api-response";

const forgotSchema = z.object({
  email: z.string().email("Email invalide"),
});

const GENERIC_MESSAGE =
  "Si cette adresse est inscrite, vous allez recevoir un email de réinitialisation.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Email invalide", 400);
    }

    const email = parsed.data.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return 200 with generic message to prevent email enumeration
    if (!user) {
      return apiSuccess({ message: GENERIC_MESSAGE });
    }

    // Rate limiting: if resetRequestedAt < 1h ago AND resetAttempts >= 3, silently return 200
    if (user.resetRequestedAt && user.resetAttempts >= 3) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (user.resetRequestedAt > oneHourAgo) {
        return apiSuccess({ message: GENERIC_MESSAGE });
      }
    }

    // Generate token
    const token = crypto.randomUUID();
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Compute new attempts: reset counter if last request was >1h ago
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const newAttempts =
      user.resetRequestedAt && user.resetRequestedAt > oneHourAgo
        ? user.resetAttempts + 1
        : 1;

    // Store hash + expiry (1 hour) + increment attempts
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: tokenHash,
        resetTokenExpires: new Date(Date.now() + 60 * 60 * 1000),
        resetRequestedAt: new Date(),
        resetAttempts: newAttempts,
      },
    });

    // Build reset link
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://bativio.vercel.app";
    const resetLink = `${baseUrl}/reinitialiser-mot-de-passe?token=${token}`;

    // Send email
    await sendEmail(
      email,
      "Réinitialisez votre mot de passe — Bativio",
      `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:'Karla',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:480px;background:#FFFFFF;border-radius:16px;border:1px solid #E8E4DF;padding:40px;box-shadow:0 4px 24px rgba(61,46,31,.04);">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="font-family:'Fraunces',Georgia,serif;font-size:28px;font-weight:700;color:#C4531A;letter-spacing:-0.5px;">Bativio</span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:16px;">
              <h1 style="margin:0;font-family:'Fraunces',Georgia,serif;font-size:22px;font-weight:700;color:#1C1C1E;text-align:center;">
                Mot de passe oubli&eacute; ?
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;text-align:center;font-size:15px;color:#6B6560;line-height:1.6;">
              Vous avez demand&eacute; la r&eacute;initialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <a href="${resetLink}" target="_blank" style="display:inline-block;background:#C4531A;color:#FFFFFF;text-decoration:none;font-family:'Karla',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;padding:14px 32px;border-radius:10px;">
                R&eacute;initialiser mon mot de passe
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:24px;text-align:center;font-size:13px;color:#9B9590;line-height:1.6;">
              Ce lien expire dans 1 heure. Si vous n&apos;avez pas demand&eacute; cette r&eacute;initialisation, ignorez simplement cet email.
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #E8E4DF;padding-top:16px;text-align:center;font-size:12px;color:#9B9590;">
              &copy; Bativio &mdash; La plateforme des artisans du b&acirc;timent
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    );

    return apiSuccess({ message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("Forgot password error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
