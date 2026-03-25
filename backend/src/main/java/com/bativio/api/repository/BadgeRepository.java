package com.bativio.api.repository;

import com.bativio.api.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BadgeRepository extends JpaRepository<Badge, UUID> {
    List<Badge> findByArtisanId(UUID artisanId);
    long countByArtisanId(UUID artisanId);
}
