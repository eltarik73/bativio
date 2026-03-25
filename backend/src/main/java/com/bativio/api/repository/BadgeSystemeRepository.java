package com.bativio.api.repository;

import com.bativio.api.entity.BadgeSysteme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BadgeSystemeRepository extends JpaRepository<BadgeSysteme, UUID> {
    Optional<BadgeSysteme> findByNom(String nom);
}
