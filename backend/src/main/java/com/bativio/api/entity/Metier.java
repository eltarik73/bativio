package com.bativio.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "metiers")
public class Metier {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false, columnDefinition = "varchar(255)")
    private String nom;

    @Column(unique = true, nullable = false, columnDefinition = "varchar(255)")
    private String slug;

    @Column(columnDefinition = "varchar(255)")
    private String icone;

    @CreationTimestamp
    private Instant createdAt;

    public Metier() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getIcone() { return icone; }
    public void setIcone(String icone) { this.icone = icone; }
    public Instant getCreatedAt() { return createdAt; }
}
