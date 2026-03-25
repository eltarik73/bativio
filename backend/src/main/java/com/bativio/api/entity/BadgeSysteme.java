package com.bativio.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "badges_systeme")
public class BadgeSysteme {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String nom;

    private String description;
    private String icone;

    @CreationTimestamp
    private Instant createdAt;

    public BadgeSysteme() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIcone() { return icone; }
    public void setIcone(String icone) { this.icone = icone; }
    public Instant getCreatedAt() { return createdAt; }
}
