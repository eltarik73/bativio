package com.bativio.api.controller;

import com.bativio.api.dto.response.ApiResponse;
import com.bativio.api.dto.response.ArtisanPublicResponse;
import com.bativio.api.entity.Artisan;
import com.bativio.api.entity.Metier;
import com.bativio.api.entity.Ville;
import com.bativio.api.entity.enums.Plan;
import com.bativio.api.exception.ResourceNotFoundException;
import com.bativio.api.repository.*;
import com.bativio.api.service.EmailService;
import com.bativio.api.util.SlugGenerator;
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
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final ArtisanRepository artisanRepository;
    private final VilleRepository villeRepository;
    private final MetierRepository metierRepository;
    private final DemandeDevisRepository devisRepository;
    private final EmailService emailService;

    public AdminController(ArtisanRepository artisanRepository, VilleRepository villeRepository,
                           MetierRepository metierRepository, DemandeDevisRepository devisRepository,
                           EmailService emailService) {
        this.artisanRepository = artisanRepository;
        this.villeRepository = villeRepository;
        this.metierRepository = metierRepository;
        this.devisRepository = devisRepository;
        this.emailService = emailService;
    }

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    @GetMapping("/artisans")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getArtisans(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Artisan> artisans = artisanRepository
                .findAllAdmin(search != null ? search : "", PageRequest.of(page, size, Sort.by("createdAt").descending()));

        List<Map<String, Object>> content = artisans.getContent().stream().map(a -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", a.getId());
            m.put("nomAffichage", a.getNomAffichage());
            m.put("slug", a.getSlug());
            m.put("ville", a.getVille());
            try { m.put("email", a.getUser() != null ? a.getUser().getEmail() : null); } catch (Exception e) { m.put("email", null); }
            try { m.put("metierNom", a.getMetier() != null ? a.getMetier().getNom() : null); } catch (Exception e) { m.put("metierNom", null); }
            m.put("plan", a.getPlan() != null ? a.getPlan().name() : "GRATUIT");
            m.put("actif", a.isActif());
            m.put("visible", a.isVisible());
            m.put("createdAt", a.getCreatedAt());
            m.put("telephone", a.getTelephone());
            m.put("noteMoyenne", a.getNoteMoyenne());
            m.put("nombreAvis", a.getNombreAvis());
            m.put("profilCompletion", a.getProfilCompletion());
            return m;
        }).toList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("content", content);
        result.put("totalElements", artisans.getTotalElements());
        result.put("totalPages", artisans.getTotalPages());
        result.put("number", artisans.getNumber());
        result.put("size", artisans.getSize());

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
            // Send validation email (fire-and-forget)
            try {
                String villeSlug = a.getVille() != null ? SlugGenerator.slugify(a.getVille()) : "";
                emailService.sendValidation(a.getUser().getEmail(), a.getNomAffichage(), villeSlug, a.getSlug());
            } catch (Exception e) {
                // Don't fail the status update if email fails
            }
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
