package com.bativio.api.dto.response;

import com.bativio.api.entity.Horaire;

public class HoraireResponse {
    private int jourSemaine;
    private boolean ouvert;
    private String heureOuverture;
    private String heureFermeture;

    public static HoraireResponse fromEntity(Horaire h) {
        HoraireResponse r = new HoraireResponse();
        r.jourSemaine = h.getJourSemaine();
        r.ouvert = h.isOuvert();
        r.heureOuverture = h.getHeureOuverture() != null ? h.getHeureOuverture().toString() : null;
        r.heureFermeture = h.getHeureFermeture() != null ? h.getHeureFermeture().toString() : null;
        return r;
    }

    public int getJourSemaine() { return jourSemaine; }
    public boolean isOuvert() { return ouvert; }
    public String getHeureOuverture() { return heureOuverture; }
    public String getHeureFermeture() { return heureFermeture; }
}
