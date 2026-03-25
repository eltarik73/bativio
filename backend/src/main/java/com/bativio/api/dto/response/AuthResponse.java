package com.bativio.api.dto.response;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private ArtisanPrivateResponse artisan;

    public AuthResponse() {}

    public AuthResponse(String accessToken, String refreshToken, ArtisanPrivateResponse artisan) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.artisan = artisan;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public ArtisanPrivateResponse getArtisan() { return artisan; }
    public void setArtisan(ArtisanPrivateResponse artisan) { this.artisan = artisan; }
}
