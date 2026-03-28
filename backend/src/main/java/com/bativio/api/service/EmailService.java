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

    public void send(String to, String subject, String html) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("RESEND_API_KEY not configured, skipping email to {}: {}", to, subject);
            return;
        }
        try {
            String body = """
                {"from":"%s","to":["%s"],"subject":"%s","html":"%s"}
                """.formatted(
                    fromEmail,
                    to,
                    escapeJson(subject),
                    escapeJson(html)
                );
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

    private String escapeJson(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }

    // Pre-built email templates
    public void sendWelcome(String to, String nomAffichage) {
        String html = "<div style='font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 20px'>"
            + "<h1 style='color:#C4531A;font-size:24px;margin-bottom:24px'>Bativio</h1>"
            + "<p>Bonjour <strong>" + escapeHtml(nomAffichage) + "</strong>,</p>"
            + "<p>Bienvenue sur Bativio ! Votre profil est en cours de validation par notre equipe.</p>"
            + "<p>Vous recevrez un email des que votre page sera en ligne.</p>"
            + "<p style='color:#9B9590;font-size:13px;margin-top:32px'>L'equipe Bativio</p></div>";
        send(to, "Bienvenue sur Bativio !", html);
    }

    public void sendValidation(String to, String nomAffichage, String villeSlug, String slug) {
        String url = "https://bativio.vercel.app/" + villeSlug + "/" + slug;
        String html = "<div style='font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 20px'>"
            + "<h1 style='color:#C4531A;font-size:24px;margin-bottom:24px'>Bativio</h1>"
            + "<p>Bonjour <strong>" + escapeHtml(nomAffichage) + "</strong>,</p>"
            + "<p>Bonne nouvelle ! Votre profil est maintenant <strong>en ligne</strong> sur Bativio.</p>"
            + "<a href='" + url + "' style='display:inline-block;background:#C4531A;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600;margin:20px 0'>Voir ma page</a>"
            + "<p style='color:#9B9590;font-size:13px;margin-top:32px'>L'equipe Bativio</p></div>";
        send(to, "Votre profil Bativio est en ligne !", html);
    }

    public void sendDevisNotification(String to, String nomAffichage, String clientName, String description) {
        String html = "<div style='font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 20px'>"
            + "<h1 style='color:#C4531A;font-size:24px;margin-bottom:24px'>Bativio</h1>"
            + "<p>Bonjour <strong>" + escapeHtml(nomAffichage) + "</strong>,</p>"
            + "<p>Vous avez recu une nouvelle demande de devis :</p>"
            + "<div style='background:#F7F5F2;border-radius:10px;padding:16px;margin:16px 0'>"
            + "<p style='margin:0'><strong>" + escapeHtml(clientName) + "</strong></p>"
            + "<p style='margin:4px 0 0;color:#6B6560;font-size:14px'>" + escapeHtml(description) + "</p></div>"
            + "<a href='https://bativio.vercel.app/dashboard/devis' style='display:inline-block;background:#C4531A;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600;margin:12px 0'>Voir la demande</a>"
            + "<p style='color:#9B9590;font-size:13px;margin-top:32px'>Repondez rapidement pour maximiser vos chances !</p></div>";
        send(to, "Nouvelle demande de devis sur Bativio", html);
    }

    public void sendMagicLink(String to, String token) {
        String url = "https://bativio.vercel.app/magic-link/verify?token=" + token + "&email=" + to;
        String html = "<div style='font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 20px'>"
            + "<h1 style='color:#C4531A;font-size:24px;margin-bottom:24px'>Bativio</h1>"
            + "<p>Bonjour,</p>"
            + "<p>Cliquez sur le bouton ci-dessous pour vous connecter :</p>"
            + "<a href='" + url + "' style='display:inline-block;background:#C4531A;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600;margin:20px 0'>Se connecter</a>"
            + "<p style='color:#9B9590;font-size:13px'>Ce lien expire dans 15 minutes.</p>"
            + "<p style='color:#9B9590;font-size:13px'>Si vous n'avez pas demande ce lien, ignorez cet email.</p></div>";
        send(to, "Votre lien de connexion Bativio", html);
    }

    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
