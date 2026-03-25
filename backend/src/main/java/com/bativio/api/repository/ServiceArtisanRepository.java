package com.bativio.api.repository;

import com.bativio.api.entity.ServiceArtisan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ServiceArtisanRepository extends JpaRepository<ServiceArtisan, UUID> {
    List<ServiceArtisan> findByArtisanIdOrderByOrdreAsc(UUID artisanId);
}
