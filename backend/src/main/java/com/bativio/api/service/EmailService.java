package com.bativio.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${resend.api-key:}")
    private String apiKey;

    @Value("${resend.from-email:onboarding@resend.dev}")
    private String fromEmail;

    private static final String HEADER = "<div style=\"font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#FAF8F5\">"
        + "<div style=\"text-align:center;margin-bottom:32px\">"
        + "<h1 style=\"font-size:28px;font-weight:700;color:#C4531A;margin:0\">Bativio</h1>"
        + "</div>"
        + "<div style=\"background:#fff;border-radius:16px;padding:36px;border:1px solid #EDEBE7\">";

    private static final String FOOTER = "</div>"
        + "<div style=\"text-align:center;margin-top:32px\">"
        + "<p style=\"font-size:12px;color:#C5C0B9;margin:0 0 8px\">Des questions ? Contactez-nous a support@bativio.fr</p>"
        + "<p style=\"font-size:11px;color:#E0DDD8;margin:0\">&copy; 2026 Bativio &middot; Chamb&eacute;ry, France &middot; Z&eacute;ro commission</p>"
        + "</div></div>";

    public void send(String to, String subject, String html) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("RESEND_API_KEY not configured, skipping email to {}: {}", to, subject);
            return;
        }
        try {
            String body = "{\"from\":\"Bativio <" + escapeJson(fromEmail) + ">\","
                + "\"to\":[\"" + escapeJson(to) + "\"],"
                + "\"subject\":\"" + escapeJson(subject) + "\","
                + "\"html\":\"" + escapeJson(html) + "\"}";
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.resend.com/emails"))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 300) {
                log.error("Resend error {}: {}", response.statusCode(), response.body());
            } else {
                log.info("Email sent to {}: {}", to, subject);
            }
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    // --- EMAIL 1: BIENVENUE ---
    public void sendWelcome(String to, String nomAffichage) {
        String h = escapeHtml(nomAffichage);
        String html = HEADER
            + "<h2 style=\"font-size:22px;font-weight:700;color:#1C1C1E;margin:0 0 8px\">Bienvenue sur Bativio, " + h + " ! &#127881;</h2>"
            + "<p style=\"font-size:15px;color:#6B6560;line-height:1.6;margin:0 0 24px\">"
            + "Votre inscription a bien &eacute;t&eacute; prise en compte. Notre &eacute;quipe v&eacute;rifie votre profil &mdash; vous recevrez un email de confirmation sous 24h.</p>"
            + "<div style=\"background:#FFF7ED;border-radius:12px;padding:20px;margin-bottom:24px;border-left:4px solid #E8A84C\">"
            + "<p style=\"font-size:14px;font-weight:600;color:#1C1C1E;margin:0 0 4px\">&#9203; Votre profil est en cours de validation</p>"
            + "<p style=\"font-size:13px;color:#6B6560;margin:0\">En attendant, vous pouvez d&eacute;j&agrave; compl&eacute;ter votre profil pour &ecirc;tre visible d&egrave;s la validation.</p></div>"
            + "<h3 style=\"font-size:16px;font-weight:700;color:#1C1C1E;margin:0 0 16px\">En attendant, compl&eacute;tez votre profil :</h3>"
            + "<table style=\"width:100%;border-collapse:collapse\">"
            + row("&#128248; Ajoutez vos photos", "Les profils avec photos re&ccedil;oivent 3x plus de demandes")
            + row("&#128221; D&eacute;crivez vos services", "Listez vos prestations avec les tarifs indicatifs")
            + row("&#127941; Ajoutez vos certifications", "RGE, Qualibat, Qualifelec... les badges rassurent les clients")
            + "<tr><td style=\"padding:10px 0\"><span style=\"font-size:14px;color:#1C1C1E;font-weight:600\">&#128205; D&eacute;finissez votre zone</span><br>"
            + "<span style=\"font-size:12px;color:#9B9590\">Plus votre zone est pr&eacute;cise, plus les demandes seront qualifi&eacute;es</span></td></tr></table>"
            + cta("https://bativio.vercel.app/dashboard", "Compl&eacute;ter mon profil &rarr;")
            + "<p style=\"font-size:13px;color:#9B9590;text-align:center;margin-top:24px\">"
            + "&#128161; <strong>Le saviez-vous ?</strong> Un profil complet &agrave; 100% est 5x plus visible dans l'annuaire.</p>"
            + FOOTER;
        send(to, "Bienvenue sur Bativio ! \uD83C\uDF89 Votre inscription est confirmée", html);
    }

    // --- EMAIL 2: PROFIL VALIDÉ ---
    public void sendValidation(String to, String nomAffichage, String villeSlug, String slug) {
        String h = escapeHtml(nomAffichage);
        String url = "https://bativio.vercel.app/" + villeSlug + "/" + slug;
        String html = HEADER
            + "<div style=\"text-align:center;margin-bottom:24px\">"
            + "<div style=\"width:64px;height:64px;border-radius:50%;background:rgba(22,163,74,.08);display:inline-flex;align-items:center;justify-content:center;font-size:32px\">&#9989;</div></div>"
            + "<h2 style=\"font-size:22px;font-weight:700;color:#1C1C1E;margin:0 0 8px;text-align:center\">Votre profil est en ligne !</h2>"
            + "<p style=\"font-size:15px;color:#6B6560;line-height:1.6;margin:0 0 24px;text-align:center\">"
            + "Bonne nouvelle, " + h + " ! Votre profil a &eacute;t&eacute; v&eacute;rifi&eacute; et valid&eacute; par notre &eacute;quipe. Vous &ecirc;tes d&eacute;sormais visible dans l'annuaire Bativio.</p>"
            + "<div style=\"background:#F0FDF4;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center\">"
            + "<p style=\"font-size:13px;color:#6B6560;margin:0 0 8px\">Votre page artisan :</p>"
            + "<a href=\"" + url + "\" style=\"font-size:16px;font-weight:600;color:#C4531A;text-decoration:none\">bativio.fr/" + villeSlug + "/" + slug + "</a>"
            + "<p style=\"font-size:12px;color:#9B9590;margin:8px 0 0\">Partagez ce lien sur votre fiche Google, vos r&eacute;seaux sociaux et vos cartes de visite !</p></div>"
            + "<h3 style=\"font-size:16px;font-weight:700;color:#1C1C1E;margin:0 0 16px\">Prochaines &eacute;tapes pour recevoir des demandes :</h3>"
            + "<table style=\"width:100%;border-collapse:collapse\">"
            + row("1. Compl&eacute;tez votre profil &agrave; 100%", "Photos, services, badges, horaires &mdash; chaque d&eacute;tail compte")
            + row("2. Partagez votre page", "Ajoutez le lien sur votre fiche Google Business et vos r&eacute;seaux")
            + "<tr><td style=\"padding:10px 0\"><span style=\"font-size:14px;font-weight:600;color:#1C1C1E\">3. R&eacute;pondez vite aux demandes</span><br>"
            + "<span style=\"font-size:12px;color:#9B9590\">Les artisans qui r&eacute;pondent en moins de 2h ont 4x plus de chances de d&eacute;crocher le chantier</span></td></tr></table>"
            + cta("https://bativio.vercel.app/dashboard", "Acc&eacute;der &agrave; mon espace &rarr;")
            + FOOTER;
        send(to, "Votre profil Bativio est en ligne ! ✅", html);
    }

    // --- EMAIL 3: NOUVELLE DEMANDE DE DEVIS ---
    public void sendDevisNotification(String to, String nomAffichage, String clientName, String clientTel, String clientEmail, String description) {
        String html = HEADER
            + "<div style=\"background:#C4531A;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center\">"
            + "<p style=\"font-size:13px;color:rgba(255,255,255,.7);margin:0 0 4px\">Nouvelle demande</p>"
            + "<p style=\"font-size:20px;font-weight:700;color:#fff;margin:0\">Demande de devis</p></div>"
            + "<h2 style=\"font-size:18px;font-weight:700;color:#1C1C1E;margin:0 0 16px\">D&eacute;tails de la demande</h2>"
            + "<table style=\"width:100%;border-collapse:collapse;margin-bottom:20px\">"
            + detailRow("Client", escapeHtml(clientName))
            + detailRow("T&eacute;l&eacute;phone", escapeHtml(clientTel != null ? clientTel : "-"))
            + detailRow("Email", escapeHtml(clientEmail != null ? clientEmail : "-"))
            + "<tr><td style=\"padding:10px 0;font-size:13px;color:#9B9590;vertical-align:top;width:120px\">Description</td>"
            + "<td style=\"padding:10px 0;font-size:14px;color:#1C1C1E;line-height:1.5\">" + escapeHtml(description) + "</td></tr></table>"
            + "<div style=\"background:#FFF7ED;border-radius:10px;padding:14px;margin-bottom:24px;text-align:center\">"
            + "<p style=\"font-size:13px;color:#92400E;margin:0\">&#9889; <strong>Conseil :</strong> R&eacute;pondez dans les 2h pour maximiser vos chances !</p></div>"
            + cta("https://bativio.vercel.app/dashboard/devis", "Voir la demande et r&eacute;pondre &rarr;")
            + FOOTER;
        send(to, "\uD83D\uDCE9 Nouvelle demande de devis — " + escapeHtml(clientName), html);
    }

    // Backward-compatible overload
    public void sendDevisNotification(String to, String nomAffichage, String clientName, String description) {
        sendDevisNotification(to, nomAffichage, clientName, null, null, description);
    }

    // --- EMAIL 4: MAGIC LINK ---
    public void sendMagicLink(String to, String token) {
        String url = "https://bativio.vercel.app/magic-link/verify?token=" + token + "&email=" + to;
        String html = HEADER
            + "<h2 style=\"font-size:22px;font-weight:700;color:#1C1C1E;margin:0 0 8px;text-align:center\">Connexion &agrave; votre espace</h2>"
            + "<p style=\"font-size:15px;color:#6B6560;line-height:1.6;margin:0 0 24px;text-align:center\">"
            + "Cliquez sur le bouton ci-dessous pour vous connecter &agrave; votre espace Bativio :</p>"
            + cta(url, "Se connecter &rarr;")
            + "<p style=\"font-size:13px;color:#9B9590;text-align:center;margin-top:24px\">Ce lien expire dans 15 minutes.</p>"
            + "<p style=\"font-size:13px;color:#9B9590;text-align:center\">Si vous n'avez pas demand&eacute; ce lien, ignorez cet email.</p>"
            + FOOTER;
        send(to, "Votre lien de connexion Bativio", html);
    }

    // --- EMAIL 5: FEATURES (3 jours après inscription) ---
    public void sendFeatures(String to, String nomAffichage) {
        String h = escapeHtml(nomAffichage);
        String html = HEADER
            + "<h2 style=\"font-size:20px;font-weight:700;color:#1C1C1E;margin:0 0 8px\">" + h + ", tirez le meilleur de Bativio</h2>"
            + "<p style=\"font-size:15px;color:#6B6560;line-height:1.6;margin:0 0 28px\">"
            + "Voici ce que la plateforme peut faire pour d&eacute;velopper votre activit&eacute; :</p>"
            + feature("&#127760;", "Votre vitrine en ligne", "Votre propre page pro avec vos r&eacute;alisations, avis clients et coordonn&eacute;es. Partageable sur Google, r&eacute;seaux sociaux et cartes de visite.")
            + feature("&#128232;", "Demandes de devis qualifi&eacute;es", "Recevez des demandes de clients de votre ville, directement dans votre espace. Notification par email et SMS.")
            + feature("&#128197;", "Agenda et prise de RDV", "Vos clients prennent RDV en ligne 24h/24. SMS de rappel automatique avant chaque intervention.")
            + featureSoon("&#129534;", "Facturation &eacute;lectronique", "Pr&eacute;parez-vous &agrave; la r&eacute;forme de septembre 2026. Invoquo, notre module de facturation, sera int&eacute;gr&eacute; directement dans votre espace.")
            + "<div style=\"margin-bottom:24px\">"
            + featureIcon("&#129302;") + "<div><p style=\"font-size:14px;font-weight:600;color:#1C1C1E;margin:0 0 4px\">Assistant IA <span style=\"font-size:10px;background:rgba(232,168,76,.12);color:#D97706;padding:2px 6px;border-radius:4px;font-weight:600\">BIENT&Ocirc;T</span></p>"
            + "<p style=\"font-size:13px;color:#6B6560;margin:0;line-height:1.5\">Notre IA r&eacute;pondra &agrave; vos clients 24h/24 et g&eacute;n&eacute;rera des devis automatiquement. Disponible avec le plan Pro+.</p></div></div>"
            + "<div style=\"background:#1C1C1E;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px\">"
            + "<p style=\"font-size:16px;font-weight:700;color:#fff;margin:0 0 4px\">Z&eacute;ro commission. Jamais.</p>"
            + "<p style=\"font-size:13px;color:rgba(255,255,255,.5);margin:0\">Abonnement fixe &middot; Pas de co&ucirc;t par devis &middot; Pas de frais cach&eacute;s</p></div>"
            + cta("https://bativio.vercel.app/dashboard", "Acc&eacute;der &agrave; mon espace &rarr;")
            + FOOTER;
        send(to, "\uD83D\uDCA1 Découvrez tout ce que Bativio peut faire pour vous", html);
    }

    // --- EMAIL 6: RAPPEL PROFIL INCOMPLET ---
    public void sendProfileReminder(String to, String nomAffichage, int pourcentage) {
        String h = escapeHtml(nomAffichage);
        String html = HEADER
            + "<h2 style=\"font-size:22px;font-weight:700;color:#1C1C1E;margin:0 0 8px\">" + h + ", votre profil n'est qu'&agrave; " + pourcentage + "%</h2>"
            + "<p style=\"font-size:15px;color:#6B6560;line-height:1.6;margin:0 0 24px\">"
            + "Un profil complet est 5x plus visible dans l'annuaire. Compl&eacute;tez les &eacute;l&eacute;ments manquants pour recevoir plus de demandes !</p>"
            + "<div style=\"background:#F7F5F2;border-radius:12px;padding:20px;margin-bottom:24px\">"
            + "<div style=\"display:flex;align-items:center;gap:12px;margin-bottom:12px\">"
            + "<div style=\"flex:1;height:8px;background:#E0DDD8;border-radius:4px;overflow:hidden\">"
            + "<div style=\"width:" + pourcentage + "%;height:100%;background:#C4531A;border-radius:4px\"></div></div>"
            + "<span style=\"font-size:14px;font-weight:700;color:#C4531A\">" + pourcentage + "%</span></div>"
            + "<p style=\"font-size:13px;color:#6B6560;margin:0\">Ajoutez des photos, d&eacute;crivez vos services et vos certifications pour atteindre 100%.</p></div>"
            + cta("https://bativio.vercel.app/dashboard/profil", "Compl&eacute;ter mon profil &rarr;")
            + FOOTER;
        send(to, h + ", votre profil n'est qu'à " + pourcentage + "% — complétez-le !", html);
    }

    // --- HTML helpers ---

    private String cta(String url, String text) {
        return "<div style=\"text-align:center;margin-top:28px\">"
            + "<a href=\"" + url + "\" style=\"display:inline-block;background:#C4531A;color:#fff;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none\">" + text + "</a></div>";
    }

    private String row(String title, String subtitle) {
        return "<tr><td style=\"padding:10px 0;border-bottom:1px solid #F7F5F2\">"
            + "<span style=\"font-size:14px;color:#1C1C1E;font-weight:600\">" + title + "</span><br>"
            + "<span style=\"font-size:12px;color:#9B9590\">" + subtitle + "</span></td></tr>";
    }

    private String detailRow(String label, String value) {
        return "<tr><td style=\"padding:10px 0;border-bottom:1px solid #F7F5F2;width:120px;font-size:13px;color:#9B9590\">" + label + "</td>"
            + "<td style=\"padding:10px 0;border-bottom:1px solid #F7F5F2;font-size:14px;font-weight:600;color:#1C1C1E\">" + value + "</td></tr>";
    }

    private String featureIcon(String emoji) {
        return "<div style=\"display:flex;gap:16px\">"
            + "<div style=\"width:40px;height:40px;border-radius:10px;background:rgba(196,83,26,.06);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0\">" + emoji + "</div>";
    }

    private String feature(String emoji, String title, String desc) {
        return "<div style=\"display:flex;gap:16px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #F7F5F2\">"
            + "<div style=\"width:40px;height:40px;border-radius:10px;background:rgba(196,83,26,.06);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0\">" + emoji + "</div>"
            + "<div><p style=\"font-size:14px;font-weight:600;color:#1C1C1E;margin:0 0 4px\">" + title + "</p>"
            + "<p style=\"font-size:13px;color:#6B6560;margin:0;line-height:1.5\">" + desc + "</p></div></div>";
    }

    private String featureSoon(String emoji, String title, String desc) {
        return "<div style=\"display:flex;gap:16px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #F7F5F2\">"
            + "<div style=\"width:40px;height:40px;border-radius:10px;background:rgba(232,168,76,.08);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0\">" + emoji + "</div>"
            + "<div><p style=\"font-size:14px;font-weight:600;color:#1C1C1E;margin:0 0 4px\">" + title
            + " <span style=\"font-size:10px;background:rgba(232,168,76,.12);color:#D97706;padding:2px 6px;border-radius:4px;font-weight:600\">BIENT&Ocirc;T</span></p>"
            + "<p style=\"font-size:13px;color:#6B6560;margin:0;line-height:1.5\">" + desc + "</p></div></div>";
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }

    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
