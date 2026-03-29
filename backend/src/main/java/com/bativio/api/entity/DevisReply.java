package com.bativio.api.entity;

import com.bativio.api.entity.enums.ReplyType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "devis_replies", indexes = {
    @Index(name = "idx_reply_devis", columnList = "demande_devis_id, created_at")
})
public class DevisReply {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "demande_devis_id", nullable = false)
    private DemandeDevis demandeDevis;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private Artisan artisan;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(columnDefinition = "varchar(512)")
    private String attachmentUrl;

    @Column(columnDefinition = "varchar(255)")
    private String attachmentFilename;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(50)")
    private ReplyType type = ReplyType.MESSAGE;

    @CreationTimestamp
    private Instant createdAt;

    public DevisReply() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public DemandeDevis getDemandeDevis() { return demandeDevis; }
    public void setDemandeDevis(DemandeDevis demandeDevis) { this.demandeDevis = demandeDevis; }
    public Artisan getArtisan() { return artisan; }
    public void setArtisan(Artisan artisan) { this.artisan = artisan; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }
    public String getAttachmentFilename() { return attachmentFilename; }
    public void setAttachmentFilename(String attachmentFilename) { this.attachmentFilename = attachmentFilename; }
    public ReplyType getType() { return type; }
    public void setType(ReplyType type) { this.type = type; }
    public Instant getCreatedAt() { return createdAt; }
}
