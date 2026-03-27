package com.bativio.api.entity;

import com.bativio.api.entity.enums.BadgeType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "badges")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private Artisan artisan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BadgeType type = BadgeType.SYSTEME;

    @Column(nullable = false)
    private String nom;

    private String icone;
    private String couleur;

    @CreationTimestamp
    private Instant createdAt;

    public Badge() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Artisan getArtisan() { return artisan; }
    public void setArtisan(Artisan artisan) { this.artisan = artisan; }
    public BadgeType getType() { return type; }
    public void setType(BadgeType type) { this.type = type; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getIcone() { return icone; }
    public void setIcone(String icone) { this.icone = icone; }
    public String getCouleur() { return couleur; }
    public void setCouleur(String couleur) { this.couleur = couleur; }
    public Instant getCreatedAt() { return createdAt; }
}
