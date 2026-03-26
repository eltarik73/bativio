package com.bativio.api.controller;

import com.bativio.api.dto.response.ApiResponse;
import com.bativio.api.dto.response.ArtisanPublicResponse;
import com.bativio.api.entity.Artisan;
import com.bativio.api.entity.BadgeSysteme;
import com.bativio.api.entity.Metier;
import com.bativio.api.entity.Ville;
import com.bativio.api.exception.ResourceNotFoundException;
import com.bativio.api.repository.*;
import com.bativio.api.service.SiretService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/public")
public class PublicController {

    private final ArtisanRepository artisanRepository;
    private final VilleRepository villeRepository;
    private final MetierRepository metierRepository;
    private final BadgeSystemeRepository badgeSystemeRepository;
    private final SiretService siretService;

    public PublicController(ArtisanRepository artisanRepository, VilleRepository villeRepository,
                            MetierRepository metierRepository, BadgeSystemeRepository badgeSystemeRepository,
                            SiretService siretService) {
        this.artisanRepository = artisanRepository;
        this.villeRepository = villeRepository;
        this.metierRepository = metierRepository;
        this.badgeSystemeRepository = badgeSystemeRepository;
        this.siretService = siretService;
    }

    @GetMapping("/siret/{siret}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> lookupSiret(@PathVariable String siret) {
        Map<String, Object> data = siretService.lookupSiret(siret);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/artisans")
    public ResponseEntity<ApiResponse<Page<ArtisanPublicResponse>>> getArtisans(
            @RequestParam(required = false) String ville,
            @RequestParam(required = false) String metier,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        UUID metierId = null;
        if (metier != null && !metier.isBlank()) {
            metierId = metierRepository.findBySlug(metier).map(Metier::getId).orElse(null);
        }

        String villeNom = null;
        if (ville != null && !ville.isBlank()) {
            villeNom = villeRepository.findBySlug(ville).map(Ville::getNom).orElse(ville);
        }

        Page<ArtisanPublicResponse> result = artisanRepository
                .findPublicArtisans(villeNom, metierId, PageRequest.of(page, size, Sort.by("noteMoyenne").descending()))
                .map(ArtisanPublicResponse::fromEntityShort);

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/artisans/{slug}")
    public ResponseEntity<ApiResponse<ArtisanPublicResponse>> getArtisanBySlug(@PathVariable String slug) {
        Artisan artisan = artisanRepository.findBySlugAndActifTrueAndVisibleTrueAndDeletedAtIsNull(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Artisan introuvable"));
        return ResponseEntity.ok(ApiResponse.ok(ArtisanPublicResponse.fromEntity(artisan)));
    }

    @GetMapping("/villes")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getVilles() {
        List<Map<String, Object>> result = villeRepository.findByActifTrue().stream().map(v -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", v.getId());
            m.put("nom", v.getNom());
            m.put("slug", v.getSlug());
            m.put("codePostal", v.getCodePostal());
            m.put("departement", v.getDepartement());
            m.put("latitude", v.getLatitude());
            m.put("longitude", v.getLongitude());
            m.put("contenuSeo", v.getContenuSeo());
            m.put("nombreArtisans", artisanRepository.countByVille(v.getNom()));
            return m;
        }).toList();
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/villes/{slug}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getVilleBySlug(@PathVariable String slug) {
        Ville ville = villeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Ville introuvable"));

        List<ArtisanPublicResponse> artisans = artisanRepository
                .findByVilleIgnoreCaseAndActifTrueAndVisibleTrueAndDeletedAtIsNull(ville.getNom())
                .stream().map(ArtisanPublicResponse::fromEntityShort).toList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", ville.getId());
        result.put("nom", ville.getNom());
        result.put("slug", ville.getSlug());
        result.put("codePostal", ville.getCodePostal());
        result.put("departement", ville.getDepartement());
        result.put("contenuSeo", ville.getContenuSeo());
        result.put("artisans", artisans);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/metiers")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMetiers() {
        List<Map<String, Object>> result = metierRepository.findAll().stream().map(m -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", m.getId());
            map.put("nom", m.getNom());
            map.put("slug", m.getSlug());
            map.put("icone", m.getIcone());
            map.put("nombreArtisans", artisanRepository.countByMetierId(m.getId()));
            return map;
        }).toList();
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/badges-systeme")
    public ResponseEntity<ApiResponse<List<BadgeSysteme>>> getBadgesSysteme() {
        return ResponseEntity.ok(ApiResponse.ok(badgeSystemeRepository.findAll()));
    }
}
