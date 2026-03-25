package com.bativio.api.repository;

import com.bativio.api.entity.ZoneIntervention;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ZoneInterventionRepository extends JpaRepository<ZoneIntervention, UUID> {
    List<ZoneIntervention> findByArtisanId(UUID artisanId);
}
