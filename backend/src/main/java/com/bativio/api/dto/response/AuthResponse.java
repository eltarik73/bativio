package com.bativio.api.dto.response;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String role;
    private ArtisanPrivateResponse artisan;

    public AuthResponse() {}

    public AuthResponse(String accessToken, String refreshToken, String role, ArtisanPrivateResponse artisan) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.role = role;
        this.artisan = artisan;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public ArtisanPrivateResponse getArtisan() { return artisan; }
    public void setArtisan(ArtisanPrivateResponse artisan) { this.artisan = artisan; }
}
