package com.bativio.api.entity;

import com.bativio.api.entity.enums.PhotoType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "photos", indexes = {
    @Index(name = "idx_photo_artisan_ordre", columnList = "artisan_id, ordre")
})
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private Artisan artisan;

    private String cloudinaryPublicId;

    @Column(nullable = false)
    private String url;

    private String titre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PhotoType type = PhotoType.SIMPLE;

    private UUID paireId;

    private int ordre = 0;

    @CreationTimestamp
    private Instant createdAt;

    public Photo() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Artisan getArtisan() { return artisan; }
    public void setArtisan(Artisan artisan) { this.artisan = artisan; }
    public String getCloudinaryPublicId() { return cloudinaryPublicId; }
    public void setCloudinaryPublicId(String cloudinaryPublicId) { this.cloudinaryPublicId = cloudinaryPublicId; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    public PhotoType getType() { return type; }
    public void setType(PhotoType type) { this.type = type; }
    public UUID getPaireId() { return paireId; }
    public void setPaireId(UUID paireId) { this.paireId = paireId; }
    public int getOrdre() { return ordre; }
    public void setOrdre(int ordre) { this.ordre = ordre; }
    public Instant getCreatedAt() { return createdAt; }
}
