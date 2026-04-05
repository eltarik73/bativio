import { sendEmail } from "@/lib/email";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.bativio.fr";

// ---------------------------------------------------------------------------
// Shared HTML helpers
// ---------------------------------------------------------------------------

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#FAF8F5;font-family:Karla,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F5;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <!-- Header -->
      <tr>
        <td style="background-color:#1C1C1E;padding:28px 40px;text-align:center;">
          <span style="font-family:Fraunces,Georgia,serif;font-size:26px;font-weight:700;color:#FFFFFF;letter-spacing:0.5px;">Bativio</span>
        </td>
      </tr>
      <!-- Body -->
      <tr>
        <td style="padding:36px 40px 28px 40px;color:#1C1C1E;font-size:15px;line-height:1.65;">
          ${content}
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="padding:20px 40px 28px 40px;text-align:center;border-top:1px solid #EEE;">
          <span style="font-size:13px;color:#888;">Bativio &mdash; La plateforme des artisans du b&acirc;timent</span>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function ctaButton(label: string, url: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:28px 0;">
  <tr><td align="center" style="background-color:#C4531A;border-radius:99px;">
    <a href="${url}" target="_blank" style="display:inline-block;padding:14px 32px;color:#FFFFFF;font-family:Karla,Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;border-radius:99px;">${label}</a>
  </td></tr>
</table>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncate(str: string, maxLen = 200): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "...";
}

// ---------------------------------------------------------------------------
// 1. Nouvelle demande -> artisan
// ---------------------------------------------------------------------------

export async function sendNewDemandeToArtisan(params: {
  artisanEmail: string;
  artisanNom: string;
  clientNom: string;
  descriptionBesoin: string;
  urgence: string;
  demandeId: string;
}): Promise<void> {
  const { artisanEmail, artisanNom, clientNom, descriptionBesoin, urgence, demandeId } = params;

  const urgenceLabel = urgence === "urgent"
    ? `<span style="display:inline-block;background:#C4531A;color:#FFF;padding:2px 10px;border-radius:4px;font-size:13px;font-weight:700;margin-left:8px;">URGENT</span>`
    : "";

  const dashboardUrl = `${SITE_URL}/dashboard/demandes/${demandeId}`;

  const html = emailWrapper(`
    <p style="margin:0 0 8px 0;">Bonjour <strong>${escapeHtml(artisanNom)}</strong>,</p>
    <p style="margin:0 0 20px 0;">Vous avez re&ccedil;u une nouvelle demande de devis&nbsp;! ${urgenceLabel}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;border-radius:8px;padding:20px;margin-bottom:4px;">
      <tr><td>
        <p style="margin:0 0 6px 0;font-size:13px;color:#888;">Client</p>
        <p style="margin:0 0 16px 0;font-weight:700;">${escapeHtml(clientNom)}</p>
        <p style="margin:0 0 6px 0;font-size:13px;color:#888;">Besoin</p>
        <p style="margin:0;">${escapeHtml(truncate(descriptionBesoin))}</p>
      </td></tr>
    </table>

    ${ctaButton("Voir la demande", dashboardUrl)}

    <p style="margin:0;font-size:13px;color:#888;">R&eacute;pondez rapidement pour maximiser vos chances de d&eacute;crocher ce chantier.</p>
  `);

  await sendEmail(
    artisanEmail,
    `Nouvelle demande de devis de ${clientNom}`,
    html
  );
}

// ---------------------------------------------------------------------------
// 2. Confirmation -> client
// ---------------------------------------------------------------------------

export async function sendDemandeConfirmationToClient(params: {
  clientEmail: string;
  clientNom: string;
  artisanNom: string;
  responseToken: string;
}): Promise<void> {
  const { clientEmail, clientNom, artisanNom, responseToken } = params;

  const filUrl = `${SITE_URL}/devis/fil/${responseToken}`;

  const html = emailWrapper(`
    <p style="margin:0 0 8px 0;">Bonjour <strong>${escapeHtml(clientNom)}</strong>,</p>
    <p style="margin:0 0 20px 0;">Votre demande de devis a bien &eacute;t&eacute; envoy&eacute;e &agrave; <strong>${escapeHtml(artisanNom)}</strong>.</p>
    <p style="margin:0 0 20px 0;">Vous recevrez une notification d&egrave;s que l&rsquo;artisan vous r&eacute;pondra. Vous pouvez aussi suivre l&rsquo;&eacute;change depuis votre espace&nbsp;:</p>

    ${ctaButton("Suivre ma demande", filUrl)}

    <p style="margin:0;font-size:13px;color:#888;">Gardez cet email : il contient votre lien d&rsquo;acc&egrave;s personnel.</p>
  `);

  await sendEmail(
    clientEmail,
    `Demande de devis envoyee a ${artisanNom}`,
    html
  );
}

// ---------------------------------------------------------------------------
// 3. Artisan a repondu -> client
// ---------------------------------------------------------------------------

export async function sendArtisanReplyToClient(params: {
  clientEmail: string;
  clientNom: string;
  artisanNom: string;
  messageExtrait: string;
  responseToken: string;
}): Promise<void> {
  const { clientEmail, clientNom, artisanNom, messageExtrait, responseToken } = params;

  const filUrl = `${SITE_URL}/devis/fil/${responseToken}`;

  const html = emailWrapper(`
    <p style="margin:0 0 8px 0;">Bonjour <strong>${escapeHtml(clientNom)}</strong>,</p>
    <p style="margin:0 0 20px 0;"><strong>${escapeHtml(artisanNom)}</strong> vous a r&eacute;pondu&nbsp;:</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;border-radius:8px;padding:20px;margin-bottom:4px;">
      <tr><td>
        <p style="margin:0;font-style:italic;color:#444;">&laquo;&nbsp;${escapeHtml(truncate(messageExtrait))}&nbsp;&raquo;</p>
      </td></tr>
    </table>

    ${ctaButton("Voir la conversation", filUrl)}
  `);

  await sendEmail(
    clientEmail,
    `${artisanNom} a repondu a votre demande de devis`,
    html
  );
}

// ---------------------------------------------------------------------------
// 4. Client a repondu -> artisan
// ---------------------------------------------------------------------------

export async function sendClientReplyToArtisan(params: {
  artisanEmail: string;
  artisanNom: string;
  clientNom: string;
  messageExtrait: string;
  demandeId: string;
}): Promise<void> {
  const { artisanEmail, artisanNom, clientNom, messageExtrait, demandeId } = params;

  const dashboardUrl = `${SITE_URL}/dashboard/demandes/${demandeId}`;

  const html = emailWrapper(`
    <p style="margin:0 0 8px 0;">Bonjour <strong>${escapeHtml(artisanNom)}</strong>,</p>
    <p style="margin:0 0 20px 0;"><strong>${escapeHtml(clientNom)}</strong> a r&eacute;pondu &agrave; votre devis&nbsp;:</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;border-radius:8px;padding:20px;margin-bottom:4px;">
      <tr><td>
        <p style="margin:0;font-style:italic;color:#444;">&laquo;&nbsp;${escapeHtml(truncate(messageExtrait))}&nbsp;&raquo;</p>
      </td></tr>
    </table>

    ${ctaButton("Voir la conversation", dashboardUrl)}
  `);

  await sendEmail(
    artisanEmail,
    `Nouveau message de ${clientNom} sur votre devis`,
    html
  );
}

// ---------------------------------------------------------------------------
// 5. Relance artisan (24h sans reponse)
// ---------------------------------------------------------------------------

export async function sendRelanceArtisan(params: {
  artisanEmail: string;
  artisanNom: string;
  clientNom: string;
  demandeId: string;
}): Promise<void> {
  const { artisanEmail, artisanNom, clientNom, demandeId } = params;

  const dashboardUrl = `${SITE_URL}/dashboard/demandes/${demandeId}`;

  const html = emailWrapper(`
    <p style="margin:0 0 8px 0;">Bonjour <strong>${escapeHtml(artisanNom)}</strong>,</p>
    <p style="margin:0 0 20px 0;"><strong>${escapeHtml(clientNom)}</strong> attend toujours votre r&eacute;ponse pour sa demande de devis.</p>
    <p style="margin:0 0 20px 0;">Les artisans qui r&eacute;pondent sous 24&nbsp;h d&eacute;crochent <strong>3&times; plus de chantiers</strong>. Ne laissez pas passer cette opportunit&eacute;&nbsp;!</p>

    ${ctaButton("Repondre maintenant", dashboardUrl)}

    <p style="margin:0;font-size:13px;color:#888;">Si ce chantier ne vous int&eacute;resse pas, vous pouvez archiver la demande depuis votre tableau de bord.</p>
  `);

  await sendEmail(
    artisanEmail,
    `Rappel : ${clientNom} attend votre reponse`,
    html
  );
}

// ---------------------------------------------------------------------------
// 6. Demande masquee -> artisan (frustration / upsell)
// ---------------------------------------------------------------------------

export async function sendDemandeMasqueeToArtisan(params: {
  artisanEmail: string;
  artisanNom: string;
  clientVille: string;
  typeTravauxResume: string;
  demandeId: string;
}): Promise<void> {
  const { artisanEmail, artisanNom, clientVille, typeTravauxResume, demandeId } = params;

  void demandeId; // kept for future use (deep-link)

  const upgradeUrl = `${SITE_URL}/dashboard/abonnement`;

  const html = emailWrapper(`
    <p style="margin:0 0 8px 0;">Bonjour <strong>${escapeHtml(artisanNom)}</strong>,</p>
    <p style="margin:0 0 20px 0;">Un client &agrave; <strong>${escapeHtml(clientVille || "votre secteur")}</strong> recherche un artisan pour&nbsp;:</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;border-radius:8px;padding:20px;margin-bottom:4px;">
      <tr><td>
        <p style="margin:0 0 6px 0;font-size:13px;color:#888;">Type de travaux</p>
        <p style="margin:0;font-weight:700;">${escapeHtml(truncate(typeTravauxResume))}</p>
      </td></tr>
    </table>

    <p style="margin:20px 0;padding:16px;background:rgba(196,83,26,.06);border:1px solid rgba(196,83,26,.15);border-radius:8px;font-size:14px;color:#1C1C1E;">
      Vous avez utilis&eacute; vos <strong>5 demandes gratuites</strong>. Les coordonn&eacute;es de ce client sont masqu&eacute;es.
    </p>

    ${ctaButton("D\u00e9bloquer mes demandes \u2014 19\u20ac/mois", upgradeUrl)}

    <p style="margin:0;font-size:13px;color:#888;">Passez &agrave; Starter pour acc&eacute;der &agrave; toutes vos demandes, sans limite.</p>
  `);

  await sendEmail(
    artisanEmail,
    `Un client à ${clientVille || "votre secteur"} cherche un artisan — débloquez ses coordonnées`,
    html
  );
}

// ---------------------------------------------------------------------------
// 7. Relance client (48h sans reponse au devis)
// ---------------------------------------------------------------------------

export async function sendRelanceClient(params: {
  clientEmail: string;
  clientNom: string;
  artisanNom: string;
  responseToken: string;
}): Promise<void> {
  const { clientEmail, clientNom, artisanNom, responseToken } = params;

  const filUrl = `${SITE_URL}/devis/fil/${responseToken}`;

  const html = emailWrapper(`
    <p style="margin:0 0 8px 0;">Bonjour <strong>${escapeHtml(clientNom)}</strong>,</p>
    <p style="margin:0 0 20px 0;"><strong>${escapeHtml(artisanNom)}</strong> vous a envoy&eacute; une r&eacute;ponse &agrave; votre demande de devis. Avez-vous eu le temps de la consulter&nbsp;?</p>
    <p style="margin:0 0 20px 0;">Pensez &agrave; r&eacute;pondre pour que l&rsquo;artisan puisse avancer sur votre projet.</p>

    ${ctaButton("Voir la reponse", filUrl)}
  `);

  await sendEmail(
    clientEmail,
    `${artisanNom} attend votre retour`,
    html
  );
}
