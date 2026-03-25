package com.bativio.api.repository;

import com.bativio.api.entity.DemandeDevis;
import com.bativio.api.entity.enums.StatutDevis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface DemandeDevisRepository extends JpaRepository<DemandeDevis, UUID> {
    Page<DemandeDevis> findByArtisanId(UUID artisanId, Pageable pageable);
    Page<DemandeDevis> findByArtisanIdAndStatut(UUID artisanId, StatutDevis statut, Pageable pageable);
    List<DemandeDevis> findTop3ByArtisanIdOrderByCreatedAtDesc(UUID artisanId);
    long countByArtisanIdAndCreatedAtAfter(UUID artisanId, Instant after);
    long countByCreatedAtAfter(Instant after);
}
