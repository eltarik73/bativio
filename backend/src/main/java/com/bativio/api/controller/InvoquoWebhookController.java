package com.bativio.api.controller;

import com.bativio.api.dto.response.ApiResponse;
import com.bativio.api.entity.DemandeDevis;
import com.bativio.api.entity.DevisReply;
import com.bativio.api.entity.enums.ReplyType;
import com.bativio.api.entity.enums.StatutDevis;
import com.bativio.api.repository.DemandeDevisRepository;
import com.bativio.api.repository.DevisReplyRepository;
import com.bativio.api.service.EmailService;
import com.bativio.api.util.SlugGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * Webhook endpoint for Invoquo integration.
 * Invoquo (separate invoicing software) will call these endpoints when:
 * - A quote is created and sent to the client
 * - A quote status changes (accepted/refused/expired)
 * - An invoice is generated
 *
 * Authentication: HMAC signature on the webhook body (to be implemented with Invoquo team).
 * For now, uses a shared secret in the X-Invoquo-Secret header.
 */
@RestController
@RequestMapping("/api/v1/webhooks/invoquo")
public class InvoquoWebhookController {

    private static final Logger log = LoggerFactory.getLogger(InvoquoWebhookController.class);

    private final DemandeDevisRepository devisRepository;
    private final DevisReplyRepository replyRepository;
    private final EmailService emailService;

    public InvoquoWebhookController(DemandeDevisRepository devisRepository,
                                     DevisReplyRepository replyRepository,
                                     EmailService emailService) {
        this.devisRepository = devisRepository;
        this.replyRepository = replyRepository;
        this.emailService = emailService;
    }

    /**
     * Called by Invoquo when a quote is created and sent.
     * Body: { devisId, quoteNumber, pdfUrl, totalHT, totalTTC, tvaRate }
     */
    @Transactional
    @PostMapping("/quote-sent")
    public ResponseEntity<ApiResponse<String>> quoteSent(
            @RequestHeader(value = "X-Invoquo-Secret", required = false) String secret,
            @RequestBody Map<String, Object> body) {

        // TODO: validate HMAC signature with Invoquo shared secret
        log.info("Invoquo webhook: quote-sent for devis {}", body.get("devisId"));

        String devisIdStr = (String) body.get("devisId");
        if (devisIdStr == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("devisId requis"));
        }

        DemandeDevis d = devisRepository.findById(UUID.fromString(devisIdStr))
                .orElse(null);
        if (d == null) {
            return ResponseEntity.ok(ApiResponse.ok("Devis non trouve, ignore"));
        }

        // Create reply entry
        DevisReply reply = new DevisReply();
        reply.setDemandeDevis(d);
        reply.setArtisan(d.getArtisan());
        reply.setType(ReplyType.QUOTE_INVOQUO);
        reply.setMessage("Devis " + body.getOrDefault("quoteNumber", "") + " envoye via Invoquo — " + body.getOrDefault("totalTTC", "") + " EUR TTC");
        reply.setAttachmentUrl((String) body.get("pdfUrl"));
        reply.setAttachmentFilename("devis-" + body.getOrDefault("quoteNumber", "invoquo") + ".pdf");
        replyRepository.save(reply);

        // Update devis status
        if (d.getResponseToken() == null) {
            d.setResponseToken(UUID.randomUUID().toString());
        }
        d.setStatut(StatutDevis.REPONDU);
        d.setReponduAt(Instant.now());
        devisRepository.save(d);

        // Send email to client
        try {
            String villeSlug = d.getArtisan().getVille() != null ? SlugGenerator.slugify(d.getArtisan().getVille()) : "";
            if (d.getEmailClient() != null && !d.getEmailClient().isBlank()) {
                emailService.sendDevisReply(
                        d.getEmailClient(),
                        d.getArtisan().getNomAffichage(),
                        d.getArtisan().getTelephone(),
                        d.getArtisan().getSlug(),
                        villeSlug,
                        d.getDescriptionBesoin().substring(0, Math.min(80, d.getDescriptionBesoin().length())),
                        reply.getMessage(),
                        (String) body.get("pdfUrl"),
                        reply.getAttachmentFilename(),
                        d.getResponseToken()
                );
            }
        } catch (Exception e) {
            log.error("Failed to send Invoquo quote email: {}", e.getMessage());
        }

        return ResponseEntity.ok(ApiResponse.ok("Quote enregistre"));
    }

    /**
     * Called by Invoquo when a quote status changes.
     * Body: { devisId, status: "ACCEPTED"|"REFUSED"|"EXPIRED" }
     */
    @Transactional
    @PostMapping("/quote-status")
    public ResponseEntity<ApiResponse<String>> quoteStatus(
            @RequestHeader(value = "X-Invoquo-Secret", required = false) String secret,
            @RequestBody Map<String, String> body) {

        log.info("Invoquo webhook: quote-status {} for devis {}", body.get("status"), body.get("devisId"));

        String devisIdStr = body.get("devisId");
        if (devisIdStr == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("devisId requis"));
        }

        DemandeDevis d = devisRepository.findById(UUID.fromString(devisIdStr)).orElse(null);
        if (d == null) return ResponseEntity.ok(ApiResponse.ok("Devis non trouve, ignore"));

        String status = body.get("status");
        if ("ACCEPTED".equalsIgnoreCase(status)) {
            d.setStatut(StatutDevis.ACCEPTE);
        } else if ("REFUSED".equalsIgnoreCase(status)) {
            d.setStatut(StatutDevis.REFUSE);
        }
        devisRepository.save(d);

        return ResponseEntity.ok(ApiResponse.ok("Statut mis a jour"));
    }

    /**
     * Health check for Invoquo to verify the webhook is reachable.
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.ok("Invoquo webhook ready"));
    }
}
