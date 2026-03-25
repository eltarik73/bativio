package com.bativio.api.repository;

import com.bativio.api.entity.CreneauDisponible;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CreneauDisponibleRepository extends JpaRepository<CreneauDisponible, UUID> {
    List<CreneauDisponible> findByArtisanIdAndActifTrue(UUID artisanId);
}
