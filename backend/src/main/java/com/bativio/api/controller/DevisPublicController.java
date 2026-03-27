package com.bativio.api.controller;

import com.bativio.api.dto.request.DevisRequest;
import com.bativio.api.dto.response.ApiResponse;
import com.bativio.api.entity.Artisan;
import com.bativio.api.entity.DemandeDevis;
import com.bativio.api.entity.Notification;
import com.bativio.api.entity.enums.NotificationType;
import com.bativio.api.entity.enums.StatutDevis;
import com.bativio.api.exception.ResourceNotFoundException;
import com.bativio.api.repository.ArtisanRepository;
import com.bativio.api.repository.DemandeDevisRepository;
import com.bativio.api.repository.NotificationRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/artisans/{slug}/devis")
public class DevisPublicController {

    private final ArtisanRepository artisanRepository;
    private final DemandeDevisRepository devisRepository;
    private final NotificationRepository notificationRepository;

    public DevisPublicController(ArtisanRepository artisanRepository,
                                  DemandeDevisRepository devisRepository,
                                  NotificationRepository notificationRepository) {
        this.artisanRepository = artisanRepository;
        this.devisRepository = devisRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    @PostMapping
    public ResponseEntity<ApiResponse<String>> submitDevis(
            @PathVariable String slug,
            @Valid @RequestBody DevisRequest request) {

        Artisan artisan = artisanRepository.findBySlugAndActifTrueAndVisibleTrueAndDeletedAtIsNull(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Artisan introuvable"));

        DemandeDevis devis = new DemandeDevis();
        devis.setArtisan(artisan);
        devis.setNomClient(request.getNomClient());
        devis.setTelephoneClient(request.getTelephoneClient());
        devis.setEmailClient(request.getEmailClient());
        devis.setDescriptionBesoin(request.getDescriptionBesoin());
        devis.setStatut(StatutDevis.NOUVEAU);
        devisRepository.save(devis);

        Notification notif = new Notification();
        notif.setArtisan(artisan);
        notif.setType(NotificationType.DEMANDE_DEVIS);
        notif.setTitre("Nouvelle demande de devis");
        notif.setMessage(request.getNomClient() + " souhaite un devis : " + request.getDescriptionBesoin());
        notificationRepository.save(notif);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Demande de devis envoyee avec succes"));
    }
}
