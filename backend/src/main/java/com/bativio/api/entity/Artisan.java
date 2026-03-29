package com.bativio.api.entity;

import com.bativio.api.entity.enums.Plan;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "artisans", indexes = {
    @Index(name = "idx_artisan_ville_metier", columnList = "ville, metier_id"),
    @Index(name = "idx_artisan_slug", columnList = "slug"),
    @Index(name = "idx_artisan_plan", columnList = "plan"),
    @Index(name = "idx_artisan_actif_visible", columnList = "actif, visible")
})
public class Artisan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(length = 14, unique = true, nullable = false)
    private String siret;

    @Column(columnDefinition = "varchar(255)")
    private String raisonSociale;

    @Column(nullable = false, columnDefinition = "varchar(255)")
    private String nomAffichage;

    @Column(columnDefinition = "varchar(255)")
    private String prenom;
    @Column(columnDefinition = "varchar(255)")
    private String nom;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "metier_id", nullable = true)
    private Metier metier;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "varchar(255)")
    private String telephone;

    @Column(columnDefinition = "varchar(255)")
    private String adresse;
    @Column(columnDefinition = "varchar(255)")
    private String codePostal;
    @Column(columnDefinition = "varchar(255)")
    private String ville;
    private Double latitude;
    private Double longitude;
    private int zoneRayonKm = 15;
    private Integer experienceAnnees;

    @Column(precision = 3, scale = 1)
    private BigDecimal noteMoyenne = BigDecimal.ZERO;

    private int nombreAvis = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Plan plan = Plan.GRATUIT;

    @Column(columnDefinition = "varchar(255)")
    private String stripeCustomerId;
    @Column(columnDefinition = "varchar(255)")
    private String stripeSubscriptionId;
    private int profilCompletion = 0;

    // Vitrine personnalisable (Pro/Pro+)
    @Column(columnDefinition = "varchar(50)")
    private String templateId = "classique";
    @Column(columnDefinition = "varchar(20)")
    private String colorPrimary = "#C4531A";
    @Column(columnDefinition = "varchar(20)")
    private String colorAccent = "#E8A84C";
    @Column(columnDefinition = "varchar(50)")
    private String photoLayout = "grid";
    @Column(columnDefinition = "TEXT")
    private String seoDescription;
    @Column(columnDefinition = "TEXT")
    private String seoKeywords;
    private boolean actif = false;
    private boolean visible = true;

    @Column(unique = true, columnDefinition = "varchar(255)")
    private String slug;

    private Instant deletedAt;

    @OneToMany(mappedBy = "artisan", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordre ASC")
    private List<Photo> photos = new ArrayList<>();

    @OneToMany(mappedBy = "artisan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Badge> badges = new ArrayList<>();

    @OneToMany(mappedBy = "artisan", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordre ASC")
    private List<ServiceArtisan> services = new ArrayList<>();

    @OneToMany(mappedBy = "artisan", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt DESC")
    private List<DemandeDevis> demandesDevis = new ArrayList<>();

    @OneToMany(mappedBy = "artisan", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("dateHeure ASC")
    private List<RendezVous> rendezVous = new ArrayList<>();

    @OneToMany(mappedBy = "artisan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CreneauDisponible> creneaux = new ArrayList<>();

    @OneToMany(mappedBy = "artisan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Horaire> horaires = new ArrayList<>();

    @OneToMany(mappedBy = "artisan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ZoneIntervention> zones = new ArrayList<>();

    @OneToMany(mappedBy = "artisan", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt DESC")
    private List<Notification> notifications = new ArrayList<>();

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    public Artisan() {}

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getSiret() { return siret; }
    public void setSiret(String siret) { this.siret = siret; }
    public String getRaisonSociale() { return raisonSociale; }
    public void setRaisonSociale(String raisonSociale) { this.raisonSociale = raisonSociale; }
    public String getNomAffichage() { return nomAffichage; }
    public void setNomAffichage(String nomAffichage) { this.nomAffichage = nomAffichage; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public Metier getMetier() { return metier; }
    public void setMetier(Metier metier) { this.metier = metier; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    public String getCodePostal() { return codePostal; }
    public void setCodePostal(String codePostal) { this.codePostal = codePostal; }
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public int getZoneRayonKm() { return zoneRayonKm; }
    public void setZoneRayonKm(int zoneRayonKm) { this.zoneRayonKm = zoneRayonKm; }
    public Integer getExperienceAnnees() { return experienceAnnees; }
    public void setExperienceAnnees(Integer experienceAnnees) { this.experienceAnnees = experienceAnnees; }
    public BigDecimal getNoteMoyenne() { return noteMoyenne; }
    public void setNoteMoyenne(BigDecimal noteMoyenne) { this.noteMoyenne = noteMoyenne; }
    public int getNombreAvis() { return nombreAvis; }
    public void setNombreAvis(int nombreAvis) { this.nombreAvis = nombreAvis; }
    public Plan getPlan() { return plan; }
    public void setPlan(Plan plan) { this.plan = plan; }
    public String getStripeCustomerId() { return stripeCustomerId; }
    public void setStripeCustomerId(String stripeCustomerId) { this.stripeCustomerId = stripeCustomerId; }
    public String getStripeSubscriptionId() { return stripeSubscriptionId; }
    public void setStripeSubscriptionId(String stripeSubscriptionId) { this.stripeSubscriptionId = stripeSubscriptionId; }
    public int getProfilCompletion() { return profilCompletion; }
    public void setProfilCompletion(int profilCompletion) { this.profilCompletion = profilCompletion; }
    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }
    public String getColorPrimary() { return colorPrimary; }
    public void setColorPrimary(String colorPrimary) { this.colorPrimary = colorPrimary; }
    public String getColorAccent() { return colorAccent; }
    public void setColorAccent(String colorAccent) { this.colorAccent = colorAccent; }
    public String getPhotoLayout() { return photoLayout; }
    public void setPhotoLayout(String photoLayout) { this.photoLayout = photoLayout; }
    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }
    public String getSeoKeywords() { return seoKeywords; }
    public void setSeoKeywords(String seoKeywords) { this.seoKeywords = seoKeywords; }
    public boolean isActif() { return actif; }
    public void setActif(boolean actif) { this.actif = actif; }
    public boolean isVisible() { return visible; }
    public void setVisible(boolean visible) { this.visible = visible; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }
    public List<Photo> getPhotos() { return photos; }
    public void setPhotos(List<Photo> photos) { this.photos = photos; }
    public List<Badge> getBadges() { return badges; }
    public void setBadges(List<Badge> badges) { this.badges = badges; }
    public List<ServiceArtisan> getServices() { return services; }
    public void setServices(List<ServiceArtisan> services) { this.services = services; }
    public List<DemandeDevis> getDemandesDevis() { return demandesDevis; }
    public void setDemandesDevis(List<DemandeDevis> demandesDevis) { this.demandesDevis = demandesDevis; }
    public List<RendezVous> getRendezVous() { return rendezVous; }
    public void setRendezVous(List<RendezVous> rendezVous) { this.rendezVous = rendezVous; }
    public List<CreneauDisponible> getCreneaux() { return creneaux; }
    public void setCreneaux(List<CreneauDisponible> creneaux) { this.creneaux = creneaux; }
    public List<Horaire> getHoraires() { return horaires; }
    public void setHoraires(List<Horaire> horaires) { this.horaires = horaires; }
    public List<ZoneIntervention> getZones() { return zones; }
    public void setZones(List<ZoneIntervention> zones) { this.zones = zones; }
    public List<Notification> getNotifications() { return notifications; }
    public void setNotifications(List<Notification> notifications) { this.notifications = notifications; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
