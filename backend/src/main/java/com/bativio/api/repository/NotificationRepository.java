package com.bativio.api.repository;

import com.bativio.api.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    Page<Notification> findByArtisanIdOrderByCreatedAtDesc(UUID artisanId, Pageable pageable);
    Page<Notification> findByArtisanIdAndLuOrderByCreatedAtDesc(UUID artisanId, boolean lu, Pageable pageable);
    long countByArtisanIdAndLuFalse(UUID artisanId);

    @Modifying
    @Query("UPDATE Notification n SET n.lu = true WHERE n.artisan.id = :artisanId AND n.lu = false")
    void markAllAsRead(@Param("artisanId") UUID artisanId);
}
