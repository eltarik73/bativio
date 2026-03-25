package com.bativio.api.dto.response;

import com.bativio.api.entity.Photo;

import java.util.UUID;

public class PhotoResponse {
    private UUID id;
    private String url;
    private String titre;
    private String type;
    private UUID paireId;
    private int ordre;

    public static PhotoResponse fromEntity(Photo p) {
        PhotoResponse r = new PhotoResponse();
        r.id = p.getId();
        r.url = p.getUrl();
        r.titre = p.getTitre();
        r.type = p.getType().name();
        r.paireId = p.getPaireId();
        r.ordre = p.getOrdre();
        return r;
    }

    public UUID getId() { return id; }
    public String getUrl() { return url; }
    public String getTitre() { return titre; }
    public String getType() { return type; }
    public UUID getPaireId() { return paireId; }
    public int getOrdre() { return ordre; }
}
