package com.bativio.api.entity;

import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "horaires")
public class Horaire {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private Artisan artisan;

    private int jourSemaine; // 1=lundi..7=dimanche

    private boolean ouvert = true;

    private LocalTime heureOuverture;
    private LocalTime heureFermeture;

    public Horaire() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Artisan getArtisan() { return artisan; }
    public void setArtisan(Artisan artisan) { this.artisan = artisan; }
    public int getJourSemaine() { return jourSemaine; }
    public void setJourSemaine(int jourSemaine) { this.jourSemaine = jourSemaine; }
    public boolean isOuvert() { return ouvert; }
    public void setOuvert(boolean ouvert) { this.ouvert = ouvert; }
    public LocalTime getHeureOuverture() { return heureOuverture; }
    public void setHeureOuverture(LocalTime heureOuverture) { this.heureOuverture = heureOuverture; }
    public LocalTime getHeureFermeture() { return heureFermeture; }
    public void setHeureFermeture(LocalTime heureFermeture) { this.heureFermeture = heureFermeture; }
}
