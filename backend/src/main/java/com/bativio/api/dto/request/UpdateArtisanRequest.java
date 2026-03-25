package com.bativio.api.dto.request;

public class UpdateArtisanRequest {
    private String nomAffichage;
    private String description;
    private String telephone;
    private String adresse;
    private String codePostal;
    private String ville;
    private Integer zoneRayonKm;
    private Integer experienceAnnees;
    private String metierId;

    public String getNomAffichage() { return nomAffichage; }
    public void setNomAffichage(String nomAffichage) { this.nomAffichage = nomAffichage; }
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
    public Integer getZoneRayonKm() { return zoneRayonKm; }
    public void setZoneRayonKm(Integer zoneRayonKm) { this.zoneRayonKm = zoneRayonKm; }
    public Integer getExperienceAnnees() { return experienceAnnees; }
    public void setExperienceAnnees(Integer experienceAnnees) { this.experienceAnnees = experienceAnnees; }
    public String getMetierId() { return metierId; }
    public void setMetierId(String metierId) { this.metierId = metierId; }
}
