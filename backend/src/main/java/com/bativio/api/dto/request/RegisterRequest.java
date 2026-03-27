package com.bativio.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "L'email est requis")
    @Email(message = "Email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caracteres")
    private String password;

    @NotBlank(message = "Le SIREN/SIRET est requis")
    private String siret;

    @NotBlank(message = "Le nom d'affichage est requis")
    private String nomAffichage;

    @NotBlank(message = "Le telephone est requis")
    private String telephone;

    private String metierId;
    private String ville;
    private int zoneRayonKm = 15;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getSiret() { return siret; }
    public void setSiret(String siret) { this.siret = siret; }
    public String getNomAffichage() { return nomAffichage; }
    public void setNomAffichage(String nomAffichage) { this.nomAffichage = nomAffichage; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getMetierId() { return metierId; }
    public void setMetierId(String metierId) { this.metierId = metierId; }
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    public int getZoneRayonKm() { return zoneRayonKm; }
    public void setZoneRayonKm(int zoneRayonKm) { this.zoneRayonKm = zoneRayonKm; }
}
