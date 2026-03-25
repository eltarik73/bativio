package com.bativio.api.dto.request;

import jakarta.validation.constraints.NotBlank;

public class DevisRequest {
    @NotBlank(message = "Le nom est requis")
    private String nomClient;

    @NotBlank(message = "Le telephone est requis")
    private String telephoneClient;

    private String emailClient;

    @NotBlank(message = "La description du besoin est requise")
    private String descriptionBesoin;

    public String getNomClient() { return nomClient; }
    public void setNomClient(String nomClient) { this.nomClient = nomClient; }
    public String getTelephoneClient() { return telephoneClient; }
    public void setTelephoneClient(String telephoneClient) { this.telephoneClient = telephoneClient; }
    public String getEmailClient() { return emailClient; }
    public void setEmailClient(String emailClient) { this.emailClient = emailClient; }
    public String getDescriptionBesoin() { return descriptionBesoin; }
    public void setDescriptionBesoin(String descriptionBesoin) { this.descriptionBesoin = descriptionBesoin; }
}
