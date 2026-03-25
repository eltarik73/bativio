package com.bativio.api.service;

import com.bativio.api.dto.request.LoginRequest;
import com.bativio.api.dto.request.RegisterRequest;
import com.bativio.api.dto.response.ArtisanPrivateResponse;
import com.bativio.api.dto.response.AuthResponse;
import com.bativio.api.entity.Artisan;
import com.bativio.api.entity.User;
import com.bativio.api.entity.enums.Plan;
import com.bativio.api.entity.enums.Role;
import com.bativio.api.exception.ResourceNotFoundException;
import com.bativio.api.exception.UnauthorizedException;
import com.bativio.api.repository.ArtisanRepository;
import com.bativio.api.repository.MetierRepository;
import com.bativio.api.repository.UserRepository;
import com.bativio.api.security.JwtTokenProvider;
import com.bativio.api.util.SlugGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ArtisanRepository artisanRepository;
    private final MetierRepository metierRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, ArtisanRepository artisanRepository,
                       MetierRepository metierRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.artisanRepository = artisanRepository;
        this.metierRepository = metierRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Un compte existe deja avec cet email");
        }
        if (artisanRepository.existsBySiret(request.getSiret())) {
            throw new IllegalArgumentException("Un artisan est deja inscrit avec ce SIRET");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ARTISAN);
        user = userRepository.save(user);

        Artisan artisan = new Artisan();
        artisan.setUser(user);
        artisan.setSiret(request.getSiret());
        artisan.setNomAffichage(request.getNomAffichage());
        artisan.setTelephone(request.getTelephone());
        artisan.setPlan(Plan.GRATUIT);
        artisan.setVille(request.getVille());
        artisan.setZoneRayonKm(request.getZoneRayonKm());

        if (request.getMetierId() != null && !request.getMetierId().isBlank()) {
            metierRepository.findById(UUID.fromString(request.getMetierId()))
                .ifPresent(artisan::setMetier);
        }

        String slug = SlugGenerator.slugify(request.getNomAffichage());
        if (artisanRepository.existsBySlug(slug)) {
            slug = slug + "-" + UUID.randomUUID().toString().substring(0, 4);
        }
        artisan.setSlug(slug);
        artisan.setProfilCompletion(30);
        artisan = artisanRepository.save(artisan);

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getRole());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());
        user.setRefreshTokenHash(passwordEncoder.encode(refreshToken));
        userRepository.save(user);

        return new AuthResponse(accessToken, refreshToken, ArtisanPrivateResponse.fromEntity(artisan));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Email ou mot de passe incorrect"));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Email ou mot de passe incorrect");
        }

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getRole());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());
        user.setRefreshTokenHash(passwordEncoder.encode(refreshToken));
        userRepository.save(user);

        ArtisanPrivateResponse artisanResp = null;
        if (user.getRole() == Role.ARTISAN) {
            artisanRepository.findByUserIdAndDeletedAtIsNull(user.getId())
                .ifPresent(a -> {});
            Artisan artisan = artisanRepository.findByUserIdAndDeletedAtIsNull(user.getId()).orElse(null);
            if (artisan != null) {
                artisanResp = ArtisanPrivateResponse.fromEntity(artisan);
            }
        }

        return new AuthResponse(accessToken, refreshToken, artisanResp);
    }

    @Transactional
    public void sendMagicLink(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setMagicLinkToken(passwordEncoder.encode(token));
            user.setMagicLinkExpiresAt(Instant.now().plusSeconds(900)); // 15 min
            userRepository.save(user);
            // En dev, on log le lien
            System.out.println("[MAGIC LINK] http://localhost:3000/magic-link/verify?token=" + token + "&email=" + email);
        });
    }

    @Transactional
    public AuthResponse verifyMagicLink(String email, String token) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Lien invalide ou expire"));

        if (user.getMagicLinkToken() == null || user.getMagicLinkExpiresAt() == null
                || Instant.now().isAfter(user.getMagicLinkExpiresAt())
                || !passwordEncoder.matches(token, user.getMagicLinkToken())) {
            throw new UnauthorizedException("Lien invalide ou expire");
        }

        user.setEmailVerified(true);
        user.setMagicLinkToken(null);
        user.setMagicLinkExpiresAt(null);

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getRole());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());
        user.setRefreshTokenHash(passwordEncoder.encode(refreshToken));
        userRepository.save(user);

        ArtisanPrivateResponse artisanResp = null;
        if (user.getRole() == Role.ARTISAN) {
            artisanRepository.findByUserIdAndDeletedAtIsNull(user.getId())
                .ifPresent(a -> {});
            Artisan artisan = artisanRepository.findByUserIdAndDeletedAtIsNull(user.getId()).orElse(null);
            if (artisan != null) {
                artisanResp = ArtisanPrivateResponse.fromEntity(artisan);
            }
        }

        return new AuthResponse(accessToken, refreshToken, artisanResp);
    }

    @Transactional
    public AuthResponse refreshTokens(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Refresh token invalide");
        }

        UUID userId = tokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Utilisateur introuvable"));

        if (user.getRefreshTokenHash() == null || !passwordEncoder.matches(refreshToken, user.getRefreshTokenHash())) {
            throw new UnauthorizedException("Refresh token invalide");
        }

        String newAccessToken = tokenProvider.generateAccessToken(user.getId(), user.getRole());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getId());
        user.setRefreshTokenHash(passwordEncoder.encode(newRefreshToken));
        userRepository.save(user);

        return new AuthResponse(newAccessToken, newRefreshToken, null);
    }

    public ArtisanPrivateResponse getMe(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        if (user.getRole() == Role.ARTISAN) {
            Artisan artisan = artisanRepository.findByUserIdAndDeletedAtIsNull(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Profil artisan introuvable"));
            return ArtisanPrivateResponse.fromEntity(artisan);
        }

        ArtisanPrivateResponse resp = new ArtisanPrivateResponse();
        return resp;
    }
}
