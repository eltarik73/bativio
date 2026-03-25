package com.bativio.api.dto.response;

import com.bativio.api.entity.ServiceArtisan;

import java.util.UUID;

public class ServiceResponse {
    private UUID id;
    private String titre;
    private String description;
    private String prixIndicatif;
    private int ordre;

    public static ServiceResponse fromEntity(ServiceArtisan s) {
        ServiceResponse r = new ServiceResponse();
        r.id = s.getId();
        r.titre = s.getTitre();
        r.description = s.getDescription();
        r.prixIndicatif = s.getPrixIndicatif();
        r.ordre = s.getOrdre();
        return r;
    }

    public UUID getId() { return id; }
    public String getTitre() { return titre; }
    public String getDescription() { return description; }
    public String getPrixIndicatif() { return prixIndicatif; }
    public int getOrdre() { return ordre; }
}
