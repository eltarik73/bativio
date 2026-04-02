import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.error("[EMAIL] RESEND_API_KEY manquante");
    return null;
  }
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

// Use onboarding@resend.dev for testing (only sends to account owner)
// Switch to noreply@bativio.fr once domain is verified in Resend
const FROM = "Bativio <onboarding@resend.dev>";

export async function sendEmail(to: string, subject: string, html: string) {
  const resend = getResend();
  if (!resend) {
    console.warn("[EMAIL] Resend non configuré, email ignoré →", to, subject);
    return;
  }
  try {
    console.log(`[EMAIL] Envoi → ${to} | Sujet: ${subject}`);
    const result = await resend.emails.send({ from: FROM, to, subject, html });
    console.log(`[EMAIL] Succès →`, JSON.stringify(result));
    return result;
  } catch (e) {
    const err = e as { message?: string; statusCode?: number };
    console.error(`[EMAIL] Échec → ${to} | ${err.message || e} | statusCode: ${err.statusCode || "?"}`);
    // Don't throw — callers use fire-and-forget pattern
  }
}
