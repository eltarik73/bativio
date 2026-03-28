package com.bativio.api.dto.response;

import com.bativio.api.entity.Artisan;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class ArtisanPublicResponse {
    private UUID id;
    private String nomAffichage;
    private String slug;
    private String metierNom;
    private String metierIcone;
    private String ville;
    private BigDecimal noteMoyenne;
    private int nombreAvis;
    private String description;
    private String telephone;
    private String adresse;
    private String codePostal;
    private int zoneRayonKm;
    private Integer experienceAnnees;
    private String plan;
    private boolean actif;
    private String email;
    private List<String> badgesNoms;
    private List<ServiceResponse> services;
    private List<PhotoResponse> photos;
    private List<HoraireResponse> horaires;
    private List<String> zones;

    public static ArtisanPublicResponse fromEntity(Artisan a) {
        ArtisanPublicResponse r = new ArtisanPublicResponse();
        r.id = a.getId();
        r.nomAffichage = a.getNomAffichage();
        r.slug = a.getSlug();
        r.metierNom = a.getMetier() != null ? a.getMetier().getNom() : null;
        r.metierIcone = a.getMetier() != null ? a.getMetier().getIcone() : null;
        r.ville = a.getVille();
        r.noteMoyenne = a.getNoteMoyenne();
        r.nombreAvis = a.getNombreAvis();
        r.description = a.getDescription();
        r.telephone = a.getTelephone();
        r.adresse = a.getAdresse();
        r.codePostal = a.getCodePostal();
        r.zoneRayonKm = a.getZoneRayonKm();
        r.experienceAnnees = a.getExperienceAnnees();
        r.plan = a.getPlan().name();
        r.actif = a.isActif();
        r.email = a.getUser() != null ? a.getUser().getEmail() : null;
        r.badgesNoms = a.getBadges().stream().map(b -> b.getNom()).toList();
        r.services = a.getServices().stream().map(ServiceResponse::fromEntity).toList();
        r.photos = a.getPhotos().stream().map(PhotoResponse::fromEntity).toList();
        r.horaires = a.getHoraires().stream().map(HoraireResponse::fromEntity).toList();
        r.zones = a.getZones().stream().map(z -> z.getVille()).toList();
        return r;
    }

    public static ArtisanPublicResponse fromEntityShort(Artisan a) {
        ArtisanPublicResponse r = new ArtisanPublicResponse();
        r.id = a.getId();
        r.nomAffichage = a.getNomAffichage();
        r.slug = a.getSlug();
        r.metierNom = a.getMetier() != null ? a.getMetier().getNom() : null;
        r.metierIcone = a.getMetier() != null ? a.getMetier().getIcone() : null;
        r.ville = a.getVille();
        r.noteMoyenne = a.getNoteMoyenne();
        r.nombreAvis = a.getNombreAvis();
        r.description = a.getDescription() != null && a.getDescription().length() > 150
            ? a.getDescription().substring(0, 150) + "..."
            : a.getDescription();
        r.plan = a.getPlan().name();
        r.actif = a.isActif();
        r.email = a.getUser() != null ? a.getUser().getEmail() : null;
        r.badgesNoms = a.getBadges().stream().map(b -> b.getNom()).limit(3).toList();
        return r;
    }

    // Getters
    public UUID getId() { return id; }
    public String getNomAffichage() { return nomAffichage; }
    public String getSlug() { return slug; }
    public String getMetierNom() { return metierNom; }
    public String getMetierIcone() { return metierIcone; }
    public String getVille() { return ville; }
    public BigDecimal getNoteMoyenne() { return noteMoyenne; }
    public int getNombreAvis() { return nombreAvis; }
    public String getDescription() { return description; }
    public String getTelephone() { return telephone; }
    public String getAdresse() { return adresse; }
    public String getCodePostal() { return codePostal; }
    public int getZoneRayonKm() { return zoneRayonKm; }
    public Integer getExperienceAnnees() { return experienceAnnees; }
    public String getPlan() { return plan; }
    public boolean isActif() { return actif; }
    public String getEmail() { return email; }
    public List<String> getBadgesNoms() { return badgesNoms; }
    public List<ServiceResponse> getServices() { return services; }
    public List<PhotoResponse> getPhotos() { return photos; }
    public List<HoraireResponse> getHoraires() { return horaires; }
    public List<String> getZones() { return zones; }
}
