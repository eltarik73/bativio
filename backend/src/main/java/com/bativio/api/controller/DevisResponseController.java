package com.bativio.api.controller;

import com.bativio.api.dto.response.ApiResponse;
import com.bativio.api.entity.DemandeDevis;
import com.bativio.api.entity.enums.StatutDevis;
import com.bativio.api.exception.ResourceNotFoundException;
import com.bativio.api.repository.DemandeDevisRepository;
import com.bativio.api.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Public endpoint for clients to accept/refuse a devis via token link (no auth required).
 */
@RestController
@RequestMapping("/api/v1/public/devis-response")
public class DevisResponseController {

    private static final Logger log = LoggerFactory.getLogger(DevisResponseController.class);

    private final DemandeDevisRepository devisRepository;
    private final EmailService emailService;

    public DevisResponseController(DemandeDevisRepository devisRepository, EmailService emailService) {
        this.devisRepository = devisRepository;
        this.emailService = emailService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDevisInfo(@RequestParam String token) {
        DemandeDevis d = devisRepository.findByResponseToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Lien invalide ou expire"));
        Map<String, Object> info = Map.of(
                "id", d.getId(),
                "artisanName", d.getArtisan().getNomAffichage(),
                "description", d.getDescriptionBesoin(),
                "statut", d.getStatut().name()
        );
        return ResponseEntity.ok(ApiResponse.ok(info));
    }

    @Transactional
    @PostMapping
    public ResponseEntity<ApiResponse<String>> respondToDevis(
            @RequestParam String token,
            @RequestParam String action,
            @RequestBody(required = false) Map<String, String> body) {

        DemandeDevis d = devisRepository.findByResponseToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Lien invalide ou expire"));

        if (d.getStatut() == StatutDevis.ACCEPTE || d.getStatut() == StatutDevis.REFUSE) {
            return ResponseEntity.ok(ApiResponse.ok("Vous avez deja repondu a ce devis"));
        }

        String raison = body != null ? body.get("raison") : null;

        if ("accept".equalsIgnoreCase(action)) {
            d.setStatut(StatutDevis.ACCEPTE);
        } else if ("refuse".equalsIgnoreCase(action)) {
            d.setStatut(StatutDevis.REFUSE);
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.ok("Action invalide"));
        }
        devisRepository.save(d);

        // Notify artisan
        try {
            emailService.sendDevisStatusToArtisan(
                    d.getArtisan().getUser().getEmail(),
                    d.getArtisan().getNomAffichage(),
                    d.getNomClient(),
                    d.getStatut().name(),
                    raison
            );
        } catch (Exception e) {
            log.error("Failed to send devis status email: {}", e.getMessage());
        }

        return ResponseEntity.ok(ApiResponse.ok(
                "accept".equalsIgnoreCase(action) ? "Devis accepte ! L'artisan a ete notifie." : "Devis decline. Merci de votre retour."));
    }
}
