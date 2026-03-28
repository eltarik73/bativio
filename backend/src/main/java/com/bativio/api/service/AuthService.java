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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

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
            // Accepter slug ou UUID
            metierRepository.findBySlug(request.getMetierId())
                .or(() -> {
                    try { return metierRepository.findById(UUID.fromString(request.getMetierId())); }
                    catch (IllegalArgumentException e) { return java.util.Optional.empty(); }
                })
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

        return new AuthResponse(accessToken, refreshToken, user.getRole().name(), ArtisanPrivateResponse.fromEntity(artisan));
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
            Artisan artisan = artisanRepository.findByUserIdAndDeletedAtIsNull(user.getId()).orElse(null);
            if (artisan != null) {
                artisanResp = ArtisanPrivateResponse.fromEntity(artisan);
            }
        }

        return new AuthResponse(accessToken, refreshToken, user.getRole().name(), artisanResp);
    }

    @Transactional
    public void sendMagicLink(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setMagicLinkToken(passwordEncoder.encode(token));
            user.setMagicLinkExpiresAt(Instant.now().plusSeconds(900)); // 15 min
            userRepository.save(user);
            log.debug("[MAGIC LINK] token genere pour {}", email);
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
            Artisan artisan = artisanRepository.findByUserIdAndDeletedAtIsNull(user.getId()).orElse(null);
            if (artisan != null) {
                artisanResp = ArtisanPrivateResponse.fromEntity(artisan);
            }
        }

        return new AuthResponse(accessToken, refreshToken, user.getRole().name(), artisanResp);
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

        return new AuthResponse(newAccessToken, newRefreshToken, user.getRole().name(), null);
    }

    @Transactional(readOnly = true)
    public ArtisanPrivateResponse getMe(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        if (user.getRole() == Role.ARTISAN) {
            Artisan artisan = artisanRepository.findByUserIdAndDeletedAtIsNull(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Profil artisan introuvable"));
            return ArtisanPrivateResponse.fromEntity(artisan);
        }

        ArtisanPrivateResponse resp = new ArtisanPrivateResponse();
        resp.setEmail(user.getEmail());
        resp.setRole(user.getRole().name());
        return resp;
    }
}
