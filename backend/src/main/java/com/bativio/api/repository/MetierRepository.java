package com.bativio.api.repository;

import com.bativio.api.entity.Metier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MetierRepository extends JpaRepository<Metier, UUID> {
    Optional<Metier> findBySlug(String slug);
    Optional<Metier> findByNom(String nom);
}
