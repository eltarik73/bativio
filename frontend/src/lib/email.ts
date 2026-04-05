import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || "contact@bativio.fr";
const FROM_NAME = "Bativio";

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[EMAIL] RESEND_API_KEY manquante, email ignoré →", to, subject);
    return;
  }

  try {
    console.log(`[EMAIL] Envoi via Resend → ${to} | Sujet: ${subject}`);

    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error(`[EMAIL] Resend erreur → ${to} |`, error);
      return;
    }

    console.log(`[EMAIL] Succès → ${to} | id: ${data?.id || "ok"}`);
    return data;
  } catch (e) {
    const err = e as { message?: string };
    console.error(`[EMAIL] Échec → ${to} | ${err.message || e}`);
  }
}
