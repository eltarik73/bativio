package com.bativio.api.repository;

import com.bativio.api.entity.Ville;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VilleRepository extends JpaRepository<Ville, UUID> {
    Optional<Ville> findBySlug(String slug);
    List<Ville> findByActifTrue();
    boolean existsBySlug(String slug);
}
