package com.bativio.api.controller;

import com.bativio.api.dto.request.UpdateArtisanRequest;
import com.bativio.api.dto.response.ApiResponse;
import com.bativio.api.dto.response.ArtisanPrivateResponse;
import com.bativio.api.entity.*;
import com.bativio.api.entity.enums.PhotoType;
import com.bativio.api.entity.enums.StatutDevis;
import com.bativio.api.service.ArtisanService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@Transactional
@RequestMapping("/api/v1/artisans/me")
public class ArtisanController {

    private final ArtisanService artisanService;

    public ArtisanController(ArtisanService artisanService) {
        this.artisanService = artisanService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ArtisanPrivateResponse>> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(artisanService.getProfile(user.getId())));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ArtisanPrivateResponse>> updateProfile(
            @AuthenticationPrincipal User user, @RequestBody UpdateArtisanRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(artisanService.updateProfile(user.getId(), request)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(artisanService.getStats(user.getId())));
    }

    // --- Photos ---
    @PostMapping("/photos")
    public ResponseEntity<ApiResponse<Photo>> addPhoto(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        Photo p = artisanService.addPhoto(user.getId(),
                body.get("url"),
                body.get("cloudinaryPublicId"),
                body.get("titre"),
                body.get("type") != null ? PhotoType.valueOf(body.get("type")) : PhotoType.SIMPLE,
                body.get("paireId") != null ? UUID.fromString(body.get("paireId")) : null);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(p));
    }

    @DeleteMapping("/photos/{id}")
    public ResponseEntity<ApiResponse<String>> deletePhoto(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        artisanService.deletePhoto(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Photo supprimee"));
    }

    // --- Badges ---
    @PostMapping("/badges")
    public ResponseEntity<ApiResponse<Badge>> addBadge(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        UUID badgeSystemeId = body.get("badgeSystemeId") != null ? UUID.fromString(body.get("badgeSystemeId")) : null;
        Badge b = artisanService.addBadge(user.getId(), badgeSystemeId,
                body.get("nom"), body.get("icone"), body.get("couleur"));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(b));
    }

    @DeleteMapping("/badges/{id}")
    public ResponseEntity<ApiResponse<String>> deleteBadge(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        artisanService.deleteBadge(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Badge supprime"));
    }

    // --- Services ---
    @PostMapping("/services")
    public ResponseEntity<ApiResponse<ServiceArtisan>> addService(
            @AuthenticationPrincipal User user, @RequestBody Map<String, String> body) {
        ServiceArtisan s = artisanService.addService(user.getId(),
                body.get("titre"), body.get("description"), body.get("prixIndicatif"));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(s));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<ApiResponse<ServiceArtisan>> updateService(
            @AuthenticationPrincipal User user, @PathVariable UUID id, @RequestBody Map<String, String> body) {
        ServiceArtisan s = artisanService.updateService(user.getId(), id,
                body.get("titre"), body.get("description"), body.get("prixIndicatif"));
        return ResponseEntity.ok(ApiResponse.ok(s));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<ApiResponse<String>> deleteService(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        artisanService.deleteService(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Service supprime"));
    }

    // --- Devis ---
    @GetMapping("/devis")
    public ResponseEntity<ApiResponse<Page<DemandeDevis>>> getDevis(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String statut,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(
                artisanService.getDevis(user.getId(), statut, PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @GetMapping("/devis/recent")
    public ResponseEntity<ApiResponse<List<DemandeDevis>>> getRecentDevis(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(artisanService.getRecentDevis(user.getId())));
    }

    @PutMapping("/devis/{id}/statut")
    public ResponseEntity<ApiResponse<DemandeDevis>> updateDevisStatut(
            @AuthenticationPrincipal User user, @PathVariable UUID id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok(
                artisanService.updateDevisStatut(user.getId(), id, StatutDevis.valueOf(body.get("statut")))));
    }

    // --- Notifications ---
    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<Page<Notification>>> getNotifications(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Boolean lu,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(
                artisanService.getNotifications(user.getId(), lu, PageRequest.of(page, size))));
    }

    @GetMapping("/notifications/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(artisanService.getUnreadNotifCount(user.getId())));
    }

    @PutMapping("/notifications/{id}/lire")
    public ResponseEntity<ApiResponse<String>> markRead(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        artisanService.markNotifRead(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Notification marquee comme lue"));
    }

    @PutMapping("/notifications/lire-tout")
    public ResponseEntity<ApiResponse<String>> markAllRead(@AuthenticationPrincipal User user) {
        artisanService.markAllNotifsRead(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Toutes les notifications marquees comme lues"));
    }

    // --- Zones ---
    @PostMapping("/zones")
    public ResponseEntity<ApiResponse<ZoneIntervention>> addZone(
            @AuthenticationPrincipal User user, @RequestBody Map<String, String> body) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(artisanService.addZone(user.getId(), body.get("ville"))));
    }

    @DeleteMapping("/zones/{id}")
    public ResponseEntity<ApiResponse<String>> deleteZone(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        artisanService.deleteZone(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Zone supprimee"));
    }
}
