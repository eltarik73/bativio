package com.bativio.api.controller;

import com.bativio.api.dto.request.LoginRequest;
import com.bativio.api.dto.request.MagicLinkRequest;
import com.bativio.api.dto.request.RefreshTokenRequest;
import com.bativio.api.dto.request.RegisterRequest;
import com.bativio.api.dto.response.ApiResponse;
import com.bativio.api.dto.response.ArtisanPrivateResponse;
import com.bativio.api.dto.response.AuthResponse;
import com.bativio.api.entity.User;
import com.bativio.api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Transactional
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/magic-link")
    public ResponseEntity<ApiResponse<String>> sendMagicLink(@Valid @RequestBody MagicLinkRequest request) {
        authService.sendMagicLink(request.getEmail());
        return ResponseEntity.ok(ApiResponse.ok("Si un compte existe avec cet email, un lien de connexion a ete envoye."));
    }

    @PostMapping("/magic-link/verify")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyMagicLink(
            @RequestParam String email,
            @RequestParam String token) {
        AuthResponse response = authService.verifyMagicLink(email, token);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshTokens(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ArtisanPrivateResponse>> me(@AuthenticationPrincipal User user) {
        ArtisanPrivateResponse response = authService.getMe(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
