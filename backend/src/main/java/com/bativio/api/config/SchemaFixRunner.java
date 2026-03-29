package com.bativio.api.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Fixes columns that Hibernate may have created as bytea instead of varchar.
 * This happens when ddl-auto=update encounters ambiguous String mappings on PostgreSQL.
 * Runs once at startup — safe to run multiple times (idempotent).
 */
@Component
public class SchemaFixRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SchemaFixRunner.class);

    private final JdbcTemplate jdbc;

    public SchemaFixRunner(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(String... args) {
        // --- artisans ---
        fixBytea("artisans", List.of(
                "raison_sociale", "nom_affichage", "prenom", "nom",
                "telephone", "adresse", "code_postal", "ville",
                "slug", "stripe_customer_id", "stripe_subscription_id",
                "template_id", "color_primary", "color_accent", "photo_layout"
        ), "varchar(255)");
        fixBytea("artisans", List.of("description", "seo_description", "seo_keywords"), "text");

        // --- users ---
        fixBytea("users", List.of("email", "password_hash", "magic_link_token", "refresh_token_hash"), "varchar(255)");

        // --- villes ---
        fixBytea("villes", List.of("nom", "slug", "code_postal", "departement"), "varchar(255)");
        fixBytea("villes", List.of("contenu_seo"), "text");

        // --- metiers ---
        fixBytea("metiers", List.of("nom", "slug", "icone"), "varchar(255)");

        // --- photos ---
        fixBytea("photos", List.of("cloudinary_public_id", "titre"), "varchar(255)");
        fixBytea("photos", List.of("url"), "varchar(512)");

        // --- badges ---
        fixBytea("badges", List.of("nom", "icone", "couleur"), "varchar(255)");

        // --- services_artisan ---
        fixBytea("services_artisan", List.of("titre", "prix_indicatif"), "varchar(255)");
        fixBytea("services_artisan", List.of("description"), "text");

        // --- demandes_devis ---
        fixBytea("demandes_devis", List.of("nom_client", "telephone_client", "email_client"), "varchar(255)");
        fixBytea("demandes_devis", List.of("description_besoin"), "text");
    }

    private void fixBytea(String table, List<String> columns, String targetType) {
        for (String col : columns) {
            try {
                String type = getColumnType(table, col);
                if (type == null) continue; // column doesn't exist yet
                if ("bytea".equals(type)) {
                    log.warn("Fixing {}.{}: bytea -> {}", table, col, targetType);
                    jdbc.execute("ALTER TABLE " + table + " ALTER COLUMN " + col
                            + " TYPE " + targetType + " USING encode(" + col + ", 'escape')");
                    log.info("Fixed {}.{} to {}", table, col, targetType);
                }
            } catch (Exception e) {
                log.error("Failed to fix {}.{}: {}", table, col, e.getMessage());
            }
        }
    }

    private String getColumnType(String table, String column) {
        try {
            return jdbc.queryForObject(
                    "SELECT data_type FROM information_schema.columns WHERE table_name = ? AND column_name = ?",
                    String.class, table, column);
        } catch (Exception e) {
            return null;
        }
    }
}
