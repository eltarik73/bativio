package com.bativio.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class ClaudeApiService {

    private static final Logger log = LoggerFactory.getLogger(ClaudeApiService.class);
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${anthropic.api-key:}")
    private String apiKey;

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    /**
     * Call Claude API with a prompt and return the text response.
     */
    public String call(String prompt) {
        if (!isConfigured()) {
            log.warn("ANTHROPIC_API_KEY not configured, skipping Claude API call");
            return null;
        }

        try {
            String body = "{\"model\":\"claude-sonnet-4-20250514\","
                    + "\"max_tokens\":1024,"
                    + "\"messages\":[{\"role\":\"user\",\"content\":\"" + escapeJson(prompt) + "\"}]}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.anthropic.com/v1/messages"))
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", "2023-06-01")
                    .header("content-type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 300) {
                log.error("Claude API error {}: {}", response.statusCode(), response.body());
                return null;
            }

            // Extract text from response: {"content":[{"type":"text","text":"..."}]}
            String responseBody = response.body();
            int textStart = responseBody.indexOf("\"text\":\"");
            if (textStart == -1) return null;
            textStart += 8;
            int textEnd = findClosingQuote(responseBody, textStart);
            if (textEnd == -1) return null;

            return unescapeJson(responseBody.substring(textStart, textEnd));
        } catch (Exception e) {
            log.error("Claude API call failed: {}", e.getMessage());
            return null;
        }
    }

    private int findClosingQuote(String s, int start) {
        for (int i = start; i < s.length(); i++) {
            if (s.charAt(i) == '"' && s.charAt(i - 1) != '\\') return i;
        }
        return -1;
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }

    private String unescapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\n", "\n").replace("\\\"", "\"").replace("\\\\", "\\");
    }
}
