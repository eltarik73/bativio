package com.bativio.api.entity;

import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "creneaux_disponibles")
public class CreneauDisponible {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private Artisan artisan;

    private int jourSemaine; // 1=lundi..7=dimanche

    private LocalTime heureDebut;
    private LocalTime heureFin;

    private boolean actif = true;

    public CreneauDisponible() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Artisan getArtisan() { return artisan; }
    public void setArtisan(Artisan artisan) { this.artisan = artisan; }
    public int getJourSemaine() { return jourSemaine; }
    public void setJourSemaine(int jourSemaine) { this.jourSemaine = jourSemaine; }
    public LocalTime getHeureDebut() { return heureDebut; }
    public void setHeureDebut(LocalTime heureDebut) { this.heureDebut = heureDebut; }
    public LocalTime getHeureFin() { return heureFin; }
    public void setHeureFin(LocalTime heureFin) { this.heureFin = heureFin; }
    public boolean isActif() { return actif; }
    public void setActif(boolean actif) { this.actif = actif; }
}
