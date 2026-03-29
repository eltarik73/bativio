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
    @Query("SELECT a FROM Artisan a LEFT JOIN FETCH a.metier LEFT JOIN FETCH a.user " +
           "WHERE a.slug = :slug AND a.actif = true AND a.visible = true AND a.deletedAt IS NULL")
    Optional<Artisan> findBySlugAndActifTrueAndVisibleTrueAndDeletedAtIsNull(@Param("slug") String slug);
    Optional<Artisan> findByUserIdAndDeletedAtIsNull(UUID userId);

    @Query("SELECT DISTINCT a FROM Artisan a LEFT JOIN FETCH a.user LEFT JOIN FETCH a.metier LEFT JOIN FETCH a.badges " +
           "WHERE a.user.id = :userId AND a.deletedAt IS NULL")
    Optional<Artisan> findByUserIdWithRelations(@Param("userId") UUID userId);
    Optional<Artisan> findBySlug(String slug);
    boolean existsBySiret(String siret);
    boolean existsBySlug(String slug);

    @Query(value = "SELECT a FROM Artisan a LEFT JOIN FETCH a.metier LEFT JOIN FETCH a.user " +
           "WHERE a.actif = true AND a.visible = true AND a.deletedAt IS NULL " +
           "AND (:ville IS NULL OR LOWER(a.ville) = LOWER(:ville)) " +
           "AND (:metierId IS NULL OR a.metier.id = :metierId)",
           countQuery = "SELECT COUNT(a) FROM Artisan a WHERE a.actif = true AND a.visible = true AND a.deletedAt IS NULL " +
           "AND (:ville IS NULL OR LOWER(a.ville) = LOWER(:ville)) " +
           "AND (:metierId IS NULL OR a.metier.id = :metierId)")
    Page<Artisan> findPublicArtisans(@Param("ville") String ville, @Param("metierId") UUID metierId, Pageable pageable);

    @Query("SELECT a FROM Artisan a LEFT JOIN FETCH a.metier LEFT JOIN FETCH a.user " +
           "WHERE LOWER(a.ville) = LOWER(:ville) AND a.actif = true AND a.visible = true AND a.deletedAt IS NULL")
    List<Artisan> findByVilleIgnoreCaseAndActifTrueAndVisibleTrueAndDeletedAtIsNull(@Param("ville") String ville);

    @Query("SELECT COUNT(a) FROM Artisan a WHERE a.actif = true AND a.visible = true AND a.deletedAt IS NULL AND LOWER(a.ville) = LOWER(:ville)")
    long countByVille(@Param("ville") String ville);

    @Query("SELECT COUNT(a) FROM Artisan a WHERE a.actif = true AND a.visible = true AND a.deletedAt IS NULL AND a.metier.id = :metierId")
    long countByMetierId(@Param("metierId") UUID metierId);

    // Simple fallback query — no LOWER(), no joins, works even if columns are bytea
    @Query("SELECT a FROM Artisan a WHERE a.actif = true AND a.visible = true AND a.deletedAt IS NULL")
    List<Artisan> findAllActive();

    long countByActifTrueAndDeletedAtIsNull();
    long countByPlanAndDeletedAtIsNull(Plan plan);

    @Query(value = "SELECT a FROM Artisan a WHERE a.deletedAt IS NULL " +
           "AND (:search IS NULL OR :search = '' OR LOWER(a.nomAffichage) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.ville) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Artisan> findAllAdmin(@Param("search") String search, Pageable pageable);
}
