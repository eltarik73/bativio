// Email transactionnel via Brevo (ex-Sendinblue)
// Brevo permet d'envoyer à n'importe qui en vérifiant juste l'adresse expéditrice
// Config : BREVO_API_KEY dans les variables d'environnement
// Vérifier l'adresse expéditrice sur https://app.brevo.com/senders

// Quand le domaine bativio.fr sera configuré, changer pour noreply@bativio.fr
// En attendant, utiliser l'adresse vérifiée dans Brevo
const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || "t.boudefar@gmail.com";
const FROM_NAME = "Bativio";

export async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[EMAIL] BREVO_API_KEY manquante, email ignoré →", to, subject);
    return;
  }

  try {
    console.log(`[EMAIL] Envoi via Brevo → ${to} | Sujet: ${subject}`);

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`[EMAIL] Brevo erreur ${res.status} → ${to} | ${errorBody}`);
      return;
    }

    const result = await res.json();
    console.log(`[EMAIL] Succès → ${to} | messageId: ${result.messageId || "ok"}`);
    return result;
  } catch (e) {
    const err = e as { message?: string };
    console.error(`[EMAIL] Échec → ${to} | ${err.message || e}`);
  }
}
