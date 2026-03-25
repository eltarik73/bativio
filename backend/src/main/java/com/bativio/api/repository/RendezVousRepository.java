package com.bativio.api.repository;

import com.bativio.api.entity.RendezVous;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface RendezVousRepository extends JpaRepository<RendezVous, UUID> {
    Optional<RendezVous> findByTokenAnnulation(UUID token);
    long countByArtisanIdAndCreatedAtAfter(UUID artisanId, Instant after);
}
