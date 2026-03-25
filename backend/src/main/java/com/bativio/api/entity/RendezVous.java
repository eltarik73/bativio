package com.bativio.api.entity;

import com.bativio.api.entity.enums.StatutRdv;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "rendez_vous", indexes = {
    @Index(name = "idx_rdv_artisan_date", columnList = "artisan_id, date_heure"),
    @Index(name = "idx_rdv_token", columnList = "token_annulation")
})
public class RendezVous {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private Artisan artisan;

    private String clientNom;
    private String clientTelephone;
    private String clientEmail;

    @Column(nullable = false)
    private LocalDateTime dateHeure;

    private int dureeMinutes = 60;

    @Column(columnDefinition = "TEXT")
    private String motif;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutRdv statut = StatutRdv.EN_ATTENTE;

    private boolean rappelEnvoye = false;

    @Column(unique = true)
    private UUID tokenAnnulation;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    public RendezVous() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Artisan getArtisan() { return artisan; }
    public void setArtisan(Artisan artisan) { this.artisan = artisan; }
    public String getClientNom() { return clientNom; }
    public void setClientNom(String clientNom) { this.clientNom = clientNom; }
    public String getClientTelephone() { return clientTelephone; }
    public void setClientTelephone(String clientTelephone) { this.clientTelephone = clientTelephone; }
    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }
    public LocalDateTime getDateHeure() { return dateHeure; }
    public void setDateHeure(LocalDateTime dateHeure) { this.dateHeure = dateHeure; }
    public int getDureeMinutes() { return dureeMinutes; }
    public void setDureeMinutes(int dureeMinutes) { this.dureeMinutes = dureeMinutes; }
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    public StatutRdv getStatut() { return statut; }
    public void setStatut(StatutRdv statut) { this.statut = statut; }
    public boolean isRappelEnvoye() { return rappelEnvoye; }
    public void setRappelEnvoye(boolean rappelEnvoye) { this.rappelEnvoye = rappelEnvoye; }
    public UUID getTokenAnnulation() { return tokenAnnulation; }
    public void setTokenAnnulation(UUID tokenAnnulation) { this.tokenAnnulation = tokenAnnulation; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
