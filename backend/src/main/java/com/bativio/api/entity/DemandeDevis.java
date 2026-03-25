package com.bativio.api.entity;

import com.bativio.api.entity.enums.StatutDevis;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "demandes_devis", indexes = {
    @Index(name = "idx_devis_artisan_statut", columnList = "artisan_id, statut, created_at")
})
public class DemandeDevis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private Artisan artisan;

    @Column(nullable = false)
    private String nomClient;

    @Column(nullable = false)
    private String telephoneClient;

    private String emailClient;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descriptionBesoin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutDevis statut = StatutDevis.NOUVEAU;

    private Instant reponduAt;

    private boolean relanceEnvoyee = false;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    public DemandeDevis() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Artisan getArtisan() { return artisan; }
    public void setArtisan(Artisan artisan) { this.artisan = artisan; }
    public String getNomClient() { return nomClient; }
    public void setNomClient(String nomClient) { this.nomClient = nomClient; }
    public String getTelephoneClient() { return telephoneClient; }
    public void setTelephoneClient(String telephoneClient) { this.telephoneClient = telephoneClient; }
    public String getEmailClient() { return emailClient; }
    public void setEmailClient(String emailClient) { this.emailClient = emailClient; }
    public String getDescriptionBesoin() { return descriptionBesoin; }
    public void setDescriptionBesoin(String descriptionBesoin) { this.descriptionBesoin = descriptionBesoin; }
    public StatutDevis getStatut() { return statut; }
    public void setStatut(StatutDevis statut) { this.statut = statut; }
    public Instant getReponduAt() { return reponduAt; }
    public void setReponduAt(Instant reponduAt) { this.reponduAt = reponduAt; }
    public boolean isRelanceEnvoyee() { return relanceEnvoyee; }
    public void setRelanceEnvoyee(boolean relanceEnvoyee) { this.relanceEnvoyee = relanceEnvoyee; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
