package com.bativio.api.repository;

import com.bativio.api.entity.Artisan;
import com.bativio.api.entity.enums.Plan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArtisanRepository extends JpaRepository<Artisan, UUID> {
    Optional<Artisan> findBySlugAndActifTrueAndVisibleTrueAndDeletedAtIsNull(String slug);
    Optional<Artisan> findByUserIdAndDeletedAtIsNull(UUID userId);
    Optional<Artisan> findBySlug(String slug);
    boolean existsBySiret(String siret);
    boolean existsBySlug(String slug);

    @Query("SELECT a FROM Artisan a WHERE a.actif = true AND a.visible = true AND a.deletedAt IS NULL " +
           "AND (:ville IS NULL OR LOWER(a.ville) = LOWER(:ville)) " +
           "AND (:metierId IS NULL OR a.metier.id = :metierId)")
    Page<Artisan> findPublicArtisans(@Param("ville") String ville, @Param("metierId") UUID metierId, Pageable pageable);

    List<Artisan> findByVilleIgnoreCaseAndActifTrueAndVisibleTrueAndDeletedAtIsNull(String ville);

    @Query("SELECT COUNT(a) FROM Artisan a WHERE a.actif = true AND a.visible = true AND a.deletedAt IS NULL AND LOWER(a.ville) = LOWER(:ville)")
    long countByVille(@Param("ville") String ville);

    @Query("SELECT COUNT(a) FROM Artisan a WHERE a.actif = true AND a.visible = true AND a.deletedAt IS NULL AND a.metier.id = :metierId")
    long countByMetierId(@Param("metierId") UUID metierId);

    long countByActifTrueAndDeletedAtIsNull();
    long countByPlanAndDeletedAtIsNull(Plan plan);

    @Query(value = "SELECT a FROM Artisan a LEFT JOIN FETCH a.user WHERE a.deletedAt IS NULL " +
           "AND (:search IS NULL OR LOWER(a.nomAffichage) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.ville) LIKE LOWER(CONCAT('%', :search, '%')))",
           countQuery = "SELECT COUNT(a) FROM Artisan a WHERE a.deletedAt IS NULL " +
           "AND (:search IS NULL OR LOWER(a.nomAffichage) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.ville) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Artisan> findAllAdmin(@Param("search") String search, Pageable pageable);
}
