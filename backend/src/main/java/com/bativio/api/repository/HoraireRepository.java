package com.bativio.api.repository;

import com.bativio.api.entity.Horaire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HoraireRepository extends JpaRepository<Horaire, UUID> {
    List<Horaire> findByArtisanIdOrderByJourSemaineAsc(UUID artisanId);
    void deleteAllByArtisanId(UUID artisanId);
}
