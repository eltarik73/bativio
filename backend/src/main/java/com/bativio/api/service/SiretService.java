package com.bativio.api.service;

import com.bativio.api.dto.response.ApiResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class SiretService {

    private static final String API_URL = "https://recherche-entreprises.api.gouv.fr/search?q=";
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public SiretService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public Map<String, Object> lookupSiret(String siret) {
        try {
            String cleanSiret = siret.replaceAll("\\s", "");
            if (cleanSiret.length() != 9 && cleanSiret.length() != 14) {
                throw new IllegalArgumentException("Entrez un SIREN (9 chiffres) ou un SIRET (14 chiffres) valide");
            }

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL + cleanSiret))
                    .header("Accept", "application/json")
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("API DINUM indisponible (HTTP " + response.statusCode() + ")");
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode results = root.path("results");

            if (!results.isArray() || results.isEmpty()) {
                // Pas trouve avec le SIRET complet, essayer avec le SIREN (9 premiers chiffres)
                String siren = cleanSiret.substring(0, 9);
                HttpRequest sirenRequest = HttpRequest.newBuilder()
                        .uri(URI.create(API_URL + siren))
                        .header("Accept", "application/json")
                        .timeout(Duration.ofSeconds(10))
                        .GET()
                        .build();

                HttpResponse<String> sirenResponse = httpClient.send(sirenRequest, HttpResponse.BodyHandlers.ofString());
                root = objectMapper.readTree(sirenResponse.body());
                results = root.path("results");

                if (!results.isArray() || results.isEmpty()) {
                    throw new IllegalArgumentException("SIRET introuvable");
                }
            }

            JsonNode entreprise = results.get(0);
            JsonNode siege = entreprise.path("siege");

            Map<String, Object> data = new LinkedHashMap<>();
            data.put("siret", cleanSiret);
            data.put("siren", entreprise.path("siren").asText(""));
            data.put("raisonSociale", entreprise.path("nom_complet").asText(""));
            data.put("adresse", siege.path("geo_adresse").asText(siege.path("adresse").asText("")));
            data.put("codePostal", siege.path("code_postal").asText(""));
            data.put("ville", siege.path("libelle_commune").asText(""));
            data.put("codeNaf", siege.path("activite_principale").asText(""));
            data.put("dateCreation", siege.path("date_creation").asText(""));
            data.put("nombreEtablissements", entreprise.path("nombre_etablissements").asInt(1));

            return data;

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la recherche SIRET : " + e.getMessage());
        }
    }
}
