package com.bativio.api.service;

import com.bativio.api.dto.request.UpdateArtisanRequest;
import com.bativio.api.dto.response.ArtisanPrivateResponse;
import com.bativio.api.entity.*;
import com.bativio.api.entity.enums.*;
import com.bativio.api.exception.PlanLimitException;
import com.bativio.api.exception.ResourceNotFoundException;
import com.bativio.api.exception.UnauthorizedException;
import com.bativio.api.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ArtisanService {

    private final ArtisanRepository artisanRepository;
    private final MetierRepository metierRepository;
    private final PhotoRepository photoRepository;
    private final BadgeRepository badgeRepository;
    private final BadgeSystemeRepository badgeSystemeRepository;
    private final ServiceArtisanRepository serviceRepository;
    private final DemandeDevisRepository devisRepository;
    private final NotificationRepository notificationRepository;
    private final HoraireRepository horaireRepository;
    private final ZoneInterventionRepository zoneRepository;
    private final RendezVousRepository rdvRepository;

    public ArtisanService(ArtisanRepository artisanRepository, MetierRepository metierRepository,
                          PhotoRepository photoRepository, BadgeRepository badgeRepository,
                          BadgeSystemeRepository badgeSystemeRepository, ServiceArtisanRepository serviceRepository,
                          DemandeDevisRepository devisRepository, NotificationRepository notificationRepository,
                          HoraireRepository horaireRepository, ZoneInterventionRepository zoneRepository,
                          RendezVousRepository rdvRepository) {
        this.artisanRepository = artisanRepository;
        this.metierRepository = metierRepository;
        this.photoRepository = photoRepository;
        this.badgeRepository = badgeRepository;
        this.badgeSystemeRepository = badgeSystemeRepository;
        this.serviceRepository = serviceRepository;
        this.devisRepository = devisRepository;
        this.notificationRepository = notificationRepository;
        this.horaireRepository = horaireRepository;
        this.zoneRepository = zoneRepository;
        this.rdvRepository = rdvRepository;
    }

    private Artisan getArtisanByUserId(UUID userId) {
        return artisanRepository.findByUserIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profil artisan introuvable"));
    }

    public ArtisanPrivateResponse getProfile(UUID userId) {
        return ArtisanPrivateResponse.fromEntity(getArtisanByUserId(userId));
    }

    @Transactional
    public ArtisanPrivateResponse updateProfile(UUID userId, UpdateArtisanRequest req) {
        Artisan a = getArtisanByUserId(userId);
        if (req.getNomAffichage() != null) a.setNomAffichage(req.getNomAffichage());
        if (req.getDescription() != null) a.setDescription(req.getDescription());
        if (req.getTelephone() != null) a.setTelephone(req.getTelephone());
        if (req.getAdresse() != null) a.setAdresse(req.getAdresse());
        if (req.getCodePostal() != null) a.setCodePostal(req.getCodePostal());
        if (req.getVille() != null) a.setVille(req.getVille());
        if (req.getZoneRayonKm() != null) a.setZoneRayonKm(req.getZoneRayonKm());
        if (req.getExperienceAnnees() != null) a.setExperienceAnnees(req.getExperienceAnnees());
        if (req.getMetierId() != null) {
            metierRepository.findById(UUID.fromString(req.getMetierId())).ifPresent(a::setMetier);
        }
        a.setProfilCompletion(calculateCompletion(a));
        return ArtisanPrivateResponse.fromEntity(artisanRepository.save(a));
    }

    public Map<String, Object> getStats(UUID userId) {
        Artisan a = getArtisanByUserId(userId);
        Instant startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).toInstant(ZoneOffset.UTC);
        return Map.of(
            "vuesCeMois", 0,
            "demandesDevisCeMois", devisRepository.countByArtisanIdAndCreatedAtAfter(a.getId(), startOfMonth),
            "rdvCeMois", rdvRepository.countByArtisanIdAndCreatedAtAfter(a.getId(), startOfMonth),
            "noteMoyenne", a.getNoteMoyenne(),
            "nombreAvis", a.getNombreAvis()
        );
    }

    // --- Photos ---
    @Transactional
    public Photo addPhoto(UUID userId, String url, String cloudinaryPublicId, String titre, PhotoType type, UUID paireId) {
        Artisan a = getArtisanByUserId(userId);
        long count = photoRepository.countByArtisanId(a.getId());
        int max = switch (a.getPlan()) {
            case GRATUIT -> 3;
            case ESSENTIEL -> 10;
            default -> Integer.MAX_VALUE;
        };
        if (count >= max) throw new PlanLimitException("Limite de photos atteinte pour votre plan. Passez a un plan superieur.");

        Photo p = new Photo();
        p.setArtisan(a);
        p.setUrl(url);
        p.setCloudinaryPublicId(cloudinaryPublicId);
        p.setTitre(titre);
        p.setType(type);
        p.setPaireId(paireId);
        p.setOrdre((int) count);
        return photoRepository.save(p);
    }

    @Transactional
    public void deletePhoto(UUID userId, UUID photoId) {
        Artisan a = getArtisanByUserId(userId);
        Photo p = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo introuvable"));
        if (!p.getArtisan().getId().equals(a.getId())) throw new UnauthorizedException("Acces non autorise");
        photoRepository.delete(p);
    }

    // --- Badges ---
    @Transactional
    public Badge addBadge(UUID userId, UUID badgeSystemeId, String customNom, String customIcone, String customCouleur) {
        Artisan a = getArtisanByUserId(userId);
        long count = badgeRepository.countByArtisanId(a.getId());
        if (a.getPlan() == Plan.GRATUIT && count >= 2) {
            throw new PlanLimitException("Limite de 2 badges atteinte en plan Gratuit.");
        }

        Badge b = new Badge();
        b.setArtisan(a);
        if (badgeSystemeId != null) {
            BadgeSysteme bs = badgeSystemeRepository.findById(badgeSystemeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Badge systeme introuvable"));
            b.setType(BadgeType.SYSTEME);
            b.setNom(bs.getNom());
            b.setIcone(bs.getIcone());
        } else {
            b.setType(BadgeType.CUSTOM);
            b.setNom(customNom);
            b.setIcone(customIcone);
            b.setCouleur(customCouleur);
        }
        return badgeRepository.save(b);
    }

    @Transactional
    public void deleteBadge(UUID userId, UUID badgeId) {
        Artisan a = getArtisanByUserId(userId);
        Badge b = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new ResourceNotFoundException("Badge introuvable"));
        if (!b.getArtisan().getId().equals(a.getId())) throw new UnauthorizedException("Acces non autorise");
        badgeRepository.delete(b);
    }

    // --- Services ---
    @Transactional
    public ServiceArtisan addService(UUID userId, String titre, String description, String prix) {
        Artisan a = getArtisanByUserId(userId);
        long count = serviceRepository.findByArtisanIdOrderByOrdreAsc(a.getId()).size();
        ServiceArtisan s = new ServiceArtisan();
        s.setArtisan(a);
        s.setTitre(titre);
        s.setDescription(description);
        s.setPrixIndicatif(prix);
        s.setOrdre((int) count);
        return serviceRepository.save(s);
    }

    @Transactional
    public ServiceArtisan updateService(UUID userId, UUID serviceId, String titre, String description, String prix) {
        Artisan a = getArtisanByUserId(userId);
        ServiceArtisan s = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service introuvable"));
        if (!s.getArtisan().getId().equals(a.getId())) throw new UnauthorizedException("Acces non autorise");
        if (titre != null) s.setTitre(titre);
        if (description != null) s.setDescription(description);
        if (prix != null) s.setPrixIndicatif(prix);
        return serviceRepository.save(s);
    }

    @Transactional
    public void deleteService(UUID userId, UUID serviceId) {
        Artisan a = getArtisanByUserId(userId);
        ServiceArtisan s = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service introuvable"));
        if (!s.getArtisan().getId().equals(a.getId())) throw new UnauthorizedException("Acces non autorise");
        serviceRepository.delete(s);
    }

    // --- Devis ---
    public Page<DemandeDevis> getDevis(UUID userId, String statut, Pageable pageable) {
        Artisan a = getArtisanByUserId(userId);
        if (statut != null && !statut.isBlank()) {
            return devisRepository.findByArtisanIdAndStatut(a.getId(), StatutDevis.valueOf(statut), pageable);
        }
        return devisRepository.findByArtisanId(a.getId(), pageable);
    }

    public List<DemandeDevis> getRecentDevis(UUID userId) {
        Artisan a = getArtisanByUserId(userId);
        return devisRepository.findTop3ByArtisanIdOrderByCreatedAtDesc(a.getId());
    }

    @Transactional
    public DemandeDevis updateDevisStatut(UUID userId, UUID devisId, StatutDevis statut) {
        Artisan a = getArtisanByUserId(userId);
        DemandeDevis d = devisRepository.findById(devisId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande de devis introuvable"));
        if (!d.getArtisan().getId().equals(a.getId())) throw new UnauthorizedException("Acces non autorise");
        d.setStatut(statut);
        if (statut == StatutDevis.REPONDU) d.setReponduAt(Instant.now());
        return devisRepository.save(d);
    }

    // --- Notifications ---
    public Page<Notification> getNotifications(UUID userId, Boolean lu, Pageable pageable) {
        Artisan a = getArtisanByUserId(userId);
        if (lu != null) {
            return notificationRepository.findByArtisanIdAndLuOrderByCreatedAtDesc(a.getId(), lu, pageable);
        }
        return notificationRepository.findByArtisanIdOrderByCreatedAtDesc(a.getId(), pageable);
    }

    public long getUnreadNotifCount(UUID userId) {
        Artisan a = getArtisanByUserId(userId);
        return notificationRepository.countByArtisanIdAndLuFalse(a.getId());
    }

    @Transactional
    public void markNotifRead(UUID userId, UUID notifId) {
        Artisan a = getArtisanByUserId(userId);
        Notification n = notificationRepository.findById(notifId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification introuvable"));
        if (!n.getArtisan().getId().equals(a.getId())) throw new UnauthorizedException("Acces non autorise");
        n.setLu(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void markAllNotifsRead(UUID userId) {
        Artisan a = getArtisanByUserId(userId);
        notificationRepository.markAllAsRead(a.getId());
    }

    // --- Horaires ---
    @Transactional
    public List<Horaire> updateHoraires(UUID userId, List<Horaire> horaires) {
        Artisan a = getArtisanByUserId(userId);
        horaireRepository.deleteAllByArtisanId(a.getId());
        for (Horaire h : horaires) {
            h.setArtisan(a);
            h.setId(null);
        }
        return horaireRepository.saveAll(horaires);
    }

    // --- Zones ---
    @Transactional
    public ZoneIntervention addZone(UUID userId, String ville) {
        Artisan a = getArtisanByUserId(userId);
        ZoneIntervention z = new ZoneIntervention();
        z.setArtisan(a);
        z.setVille(ville);
        return zoneRepository.save(z);
    }

    @Transactional
    public void deleteZone(UUID userId, UUID zoneId) {
        Artisan a = getArtisanByUserId(userId);
        ZoneIntervention z = zoneRepository.findById(zoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Zone introuvable"));
        if (!z.getArtisan().getId().equals(a.getId())) throw new UnauthorizedException("Acces non autorise");
        zoneRepository.delete(z);
    }

    private int calculateCompletion(Artisan a) {
        int score = 0;
        if (a.getNomAffichage() != null) score += 15;
        if (a.getMetier() != null) score += 15;
        if (a.getTelephone() != null) score += 10;
        if (a.getDescription() != null && !a.getDescription().isBlank()) score += 15;
        if (a.getVille() != null) score += 10;
        if (!a.getPhotos().isEmpty()) score += 15;
        if (!a.getBadges().isEmpty()) score += 10;
        if (!a.getHoraires().isEmpty()) score += 10;
        return Math.min(score, 100);
    }
}
