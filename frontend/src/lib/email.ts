/**
 * Email transactionnel Bativio.
 *
 * Provider PRINCIPAL : Brevo (ex-Sendinblue) — domaine bativio.fr déjà validé chez eux.
 * Resend reste en fallback secondaire en cas de panne Brevo (mais limité car le
 * domaine n'a jamais été vérifié côté Resend).
 *
 * Décision actée le 28/04/2026 : ne PAS migrer vers Resend, ne PAS demander à
 * l'utilisateur de vérifier le domaine Resend. On reste sur Brevo.
 *
 * Endpoint Brevo : https://api.brevo.com/v3/smtp/email
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || "contact@bativio.fr";
const FROM_NAME = "Bativio";

export interface SendEmailResult {
  ok: boolean;
  provider: "brevo" | "resend" | "none";
  messageId?: string;
  error?: string;
}

/**
 * Envoie un email transactionnel via Brevo (primaire) avec fallback Resend.
 *
 * Fail-safe : ne throw jamais. Logue toujours le résultat.
 * Retourne SendEmailResult avec le provider utilisé et l'éventuelle erreur.
 *
 * Usage :
 *   await sendEmail("user@example.com", "Sujet", "<p>HTML</p>")
 *     .catch((e) => console.warn("ne devrait jamais arriver:", e));
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<SendEmailResult> {
  // 1) Tentative Brevo (provider principal)
  if (BREVO_API_KEY) {
    try {
      console.log(`[EMAIL] Envoi via Brevo -> ${to} | Sujet: ${subject}`);
      // Pas de AbortSignal.timeout : sur Vercel serverless, le timeout du runtime
      // (10s par defaut) gere deja le cas. AbortSignal.timeout est instable sur edge.
      const r = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({
          sender: { name: FROM_NAME, email: FROM_EMAIL },
          to: [{ email: to }],
          replyTo: { email: FROM_EMAIL, name: FROM_NAME },
          subject,
          htmlContent: html,
        }),
      });

      if (r.ok) {
        const data = await r.json().catch(() => ({} as Record<string, unknown>));
        const messageId = (data as { messageId?: string }).messageId;
        console.log(`[EMAIL] Brevo OK -> ${to} | id: ${messageId || "?"}`);
        return { ok: true, provider: "brevo", messageId };
      }

      const errText = await r.text().catch(() => `HTTP ${r.status}`);
      console.error(`[EMAIL] Brevo erreur ${r.status} -> ${to} | ${errText.substring(0, 300)}`);
      // Continue vers fallback Resend
    } catch (e) {
      const err = e as Error;
      // Log detaille pour debug : message + name + premiers chars du stack
      console.error(`[EMAIL] Brevo exception -> ${to} | name=${err.name} message=${err.message || "(empty)"} stack=${(err.stack || "").substring(0, 200)}`);
      // Continue vers fallback Resend
    }
  }

  // 2) Fallback Resend (limité — domaine non vérifié, ne fonctionne qu'en mode test)
  if (RESEND_API_KEY) {
    try {
      console.log(`[EMAIL] Fallback Resend -> ${to} | Sujet: ${subject}`);
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: [to],
          subject,
          html,
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (r.ok) {
        const data = await r.json().catch(() => ({} as Record<string, unknown>));
        const messageId = (data as { id?: string }).id;
        console.log(`[EMAIL] Resend OK -> ${to} | id: ${messageId || "?"}`);
        return { ok: true, provider: "resend", messageId };
      }

      const errText = await r.text().catch(() => `HTTP ${r.status}`);
      console.error(`[EMAIL] Resend erreur ${r.status} -> ${to} | ${errText.substring(0, 200)}`);
      return { ok: false, provider: "resend", error: errText };
    } catch (e) {
      console.error(`[EMAIL] Resend exception -> ${to} | ${(e as Error).message}`);
      return { ok: false, provider: "resend", error: (e as Error).message };
    }
  }

  console.warn(`[EMAIL] Aucun provider configure (BREVO_API_KEY et RESEND_API_KEY manquantes) -> ${to} | ${subject}`);
  return { ok: false, provider: "none", error: "no_provider_configured" };
}
