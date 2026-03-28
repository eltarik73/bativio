package com.bativio.api.controller;

import com.bativio.api.dto.response.ApiResponse;
import com.bativio.api.dto.response.ArtisanPublicResponse;
import com.bativio.api.entity.Artisan;
import com.bativio.api.entity.Metier;
import com.bativio.api.entity.Ville;
import com.bativio.api.entity.enums.Plan;
import com.bativio.api.exception.ResourceNotFoundException;
import com.bativio.api.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final ArtisanRepository artisanRepository;
    private final VilleRepository villeRepository;
    private final MetierRepository metierRepository;
    private final DemandeDevisRepository devisRepository;

    public AdminController(ArtisanRepository artisanRepository, VilleRepository villeRepository,
                           MetierRepository metierRepository, DemandeDevisRepository devisRepository) {
        this.artisanRepository = artisanRepository;
        this.villeRepository = villeRepository;
        this.metierRepository = metierRepository;
        this.devisRepository = devisRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Instant startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0).toInstant(ZoneOffset.UTC);
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalArtisans", artisanRepository.countByActifTrueAndDeletedAtIsNull());
        stats.put("devisCeMois", devisRepository.countByCreatedAtAfter(startOfMonth));
        Map<String, Long> parPlan = new LinkedHashMap<>();
        for (Plan p : Plan.values()) {
            parPlan.put(p.name(), artisanRepository.countByPlanAndDeletedAtIsNull(p));
        }
        stats.put("artisansParPlan", parPlan);
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/artisans")
    public ResponseEntity<ApiResponse<Page<ArtisanPublicResponse>>> getArtisans(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<ArtisanPublicResponse> result = artisanRepository
                .findAllAdmin(search, PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(ArtisanPublicResponse::fromEntityShort);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @Transactional
    @PutMapping("/artisans/{id}/toggle-actif")
    public ResponseEntity<ApiResponse<String>> toggleActif(@PathVariable UUID id) {
        Artisan a = artisanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artisan introuvable"));
        a.setActif(!a.isActif());
        artisanRepository.save(a);
        return ResponseEntity.ok(ApiResponse.ok(a.isActif() ? "Artisan active" : "Artisan desactive"));
    }

    @Transactional
    @PutMapping("/artisans/{id}/statut")
    public ResponseEntity<ApiResponse<String>> updateStatut(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        Artisan a = artisanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artisan introuvable"));
        String statut = body.get("statut");
        if ("ACTIVE".equalsIgnoreCase(statut)) {
            a.setActif(true);
        } else if ("INACTIVE".equalsIgnoreCase(statut)) {
            a.setActif(false);
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.ok("Statut invalide. Valeurs acceptees: ACTIVE, INACTIVE"));
        }
        artisanRepository.save(a);
        return ResponseEntity.ok(ApiResponse.ok(a.isActif() ? "Artisan active" : "Artisan desactive"));
    }

    @Transactional
    @PutMapping("/artisans/{id}/toggle-visible")
    public ResponseEntity<ApiResponse<String>> toggleVisible(@PathVariable UUID id) {
        Artisan a = artisanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artisan introuvable"));
        a.setVisible(!a.isVisible());
        artisanRepository.save(a);
        return ResponseEntity.ok(ApiResponse.ok(a.isVisible() ? "Artisan visible" : "Artisan masque"));
    }

    @Transactional
    @PutMapping("/artisans/{id}/plan")
    public ResponseEntity<ApiResponse<String>> changePlan(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        Artisan a = artisanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artisan introuvable"));
        a.setPlan(Plan.valueOf(body.get("plan")));
        artisanRepository.save(a);
        return ResponseEntity.ok(ApiResponse.ok("Plan mis a jour: " + a.getPlan()));
    }

    // --- Villes CRUD ---
    @Transactional
    @PostMapping("/villes")
    public ResponseEntity<ApiResponse<Ville>> createVille(@RequestBody Map<String, String> body) {
        Ville v = new Ville();
        v.setNom(body.get("nom"));
        v.setSlug(body.get("slug"));
        v.setCodePostal(body.get("codePostal"));
        v.setDepartement(body.get("departement"));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(villeRepository.save(v)));
    }

    @Transactional
    @PutMapping("/villes/{id}")
    public ResponseEntity<ApiResponse<Ville>> updateVille(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        Ville v = villeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ville introuvable"));
        if (body.containsKey("nom")) v.setNom(body.get("nom"));
        if (body.containsKey("contenuSeo")) v.setContenuSeo(body.get("contenuSeo"));
        if (body.containsKey("actif")) v.setActif(Boolean.parseBoolean(body.get("actif")));
        return ResponseEntity.ok(ApiResponse.ok(villeRepository.save(v)));
    }

    @Transactional
    @DeleteMapping("/villes/{id}")
    public ResponseEntity<ApiResponse<String>> deleteVille(@PathVariable UUID id) {
        villeRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Ville supprimee"));
    }

    // --- Metiers CRUD ---
    @Transactional
    @PostMapping("/metiers")
    public ResponseEntity<ApiResponse<Metier>> createMetier(@RequestBody Map<String, String> body) {
        Metier m = new Metier();
        m.setNom(body.get("nom"));
        m.setSlug(body.get("slug"));
        m.setIcone(body.get("icone"));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(metierRepository.save(m)));
    }

    @Transactional
    @PutMapping("/metiers/{id}")
    public ResponseEntity<ApiResponse<Metier>> updateMetier(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        Metier m = metierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Metier introuvable"));
        if (body.containsKey("nom")) m.setNom(body.get("nom"));
        if (body.containsKey("icone")) m.setIcone(body.get("icone"));
        return ResponseEntity.ok(ApiResponse.ok(metierRepository.save(m)));
    }

    @Transactional
    @DeleteMapping("/metiers/{id}")
    public ResponseEntity<ApiResponse<String>> deleteMetier(@PathVariable UUID id) {
        metierRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Metier supprime"));
    }
}
