package com.bativio.api.dto.response;

import com.bativio.api.entity.Artisan;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class ArtisanPrivateResponse {
    private UUID id;
    private String email;
    private String role;
    private String siret;
    private String raisonSociale;
    private String nomAffichage;
    private String prenom;
    private String nom;
    private String metierNom;
    private String metierId;
    private String description;
    private String telephone;
    private String adresse;
    private String codePostal;
    private String ville;
    private int zoneRayonKm;
    private Integer experienceAnnees;
    private BigDecimal noteMoyenne;
    private int nombreAvis;
    private String plan;
    private String stripeCustomerId;
    private int profilCompletion;
    private String slug;
    private boolean actif;
    private List<String> badgesNoms;
    private List<ServiceResponse> services;
    private List<PhotoResponse> photos;
    private List<HoraireResponse> horaires;
    private List<String> zones;

    public static ArtisanPrivateResponse fromEntity(Artisan a) {
        ArtisanPrivateResponse r = new ArtisanPrivateResponse();
        r.id = a.getId();
        r.email = a.getUser() != null ? a.getUser().getEmail() : null;
        r.role = a.getUser() != null ? a.getUser().getRole().name() : null;
        r.siret = a.getSiret();
        r.raisonSociale = a.getRaisonSociale();
        r.nomAffichage = a.getNomAffichage();
        r.prenom = a.getPrenom();
        r.nom = a.getNom();
        r.metierNom = a.getMetier() != null ? a.getMetier().getNom() : null;
        r.metierId = a.getMetier() != null ? a.getMetier().getId().toString() : null;
        r.description = a.getDescription();
        r.telephone = a.getTelephone();
        r.adresse = a.getAdresse();
        r.codePostal = a.getCodePostal();
        r.ville = a.getVille();
        r.zoneRayonKm = a.getZoneRayonKm();
        r.experienceAnnees = a.getExperienceAnnees();
        r.noteMoyenne = a.getNoteMoyenne();
        r.nombreAvis = a.getNombreAvis();
        r.plan = a.getPlan().name();
        r.stripeCustomerId = a.getStripeCustomerId();
        r.profilCompletion = a.getProfilCompletion();
        r.slug = a.getSlug();
        r.actif = a.isActif();
        r.badgesNoms = a.getBadges().stream().map(b -> b.getNom()).toList();
        r.services = a.getServices().stream().map(ServiceResponse::fromEntity).toList();
        r.photos = a.getPhotos().stream().map(PhotoResponse::fromEntity).toList();
        r.horaires = a.getHoraires().stream().map(HoraireResponse::fromEntity).toList();
        r.zones = a.getZones().stream().map(z -> z.getVille()).toList();
        return r;
    }

    // Setters
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }

    // Getters
    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getSiret() { return siret; }
    public String getRaisonSociale() { return raisonSociale; }
    public String getNomAffichage() { return nomAffichage; }
    public String getPrenom() { return prenom; }
    public String getNom() { return nom; }
    public String getMetierNom() { return metierNom; }
    public String getMetierId() { return metierId; }
    public String getDescription() { return description; }
    public String getTelephone() { return telephone; }
    public String getAdresse() { return adresse; }
    public String getCodePostal() { return codePostal; }
    public String getVille() { return ville; }
    public int getZoneRayonKm() { return zoneRayonKm; }
    public Integer getExperienceAnnees() { return experienceAnnees; }
    public BigDecimal getNoteMoyenne() { return noteMoyenne; }
    public int getNombreAvis() { return nombreAvis; }
    public String getPlan() { return plan; }
    public String getStripeCustomerId() { return stripeCustomerId; }
    public int getProfilCompletion() { return profilCompletion; }
    public String getSlug() { return slug; }
    public boolean isActif() { return actif; }
    public List<String> getBadgesNoms() { return badgesNoms; }
    public List<ServiceResponse> getServices() { return services; }
    public List<PhotoResponse> getPhotos() { return photos; }
    public List<HoraireResponse> getHoraires() { return horaires; }
    public List<String> getZones() { return zones; }
}
