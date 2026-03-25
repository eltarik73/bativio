package com.bativio.api.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "zones_intervention")
public class ZoneIntervention {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private Artisan artisan;

    @Column(nullable = false)
    private String ville;

    public ZoneIntervention() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Artisan getArtisan() { return artisan; }
    public void setArtisan(Artisan artisan) { this.artisan = artisan; }
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
}
