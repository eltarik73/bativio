package com.bativio.api.config;

import com.bativio.api.entity.*;
import com.bativio.api.entity.enums.*;
import com.bativio.api.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            VilleRepository villeRepo,
            MetierRepository metierRepo,
            BadgeSystemeRepository badgeSystemeRepo,
            UserRepository userRepo,
            ArtisanRepository artisanRepo,
            BadgeRepository badgeRepo,
            ServiceArtisanRepository serviceRepo,
            HoraireRepository horaireRepo,
            ZoneInterventionRepository zoneRepo,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (villeRepo.count() > 0) return;

            // --- Villes ---
            Ville chambery = createVille(villeRepo, "Chambery", "chambery", "73000", "Savoie", 45.5646, 5.9178,
                "Chambery, capitale historique de la Savoie, abrite un patrimoine architectural riche entre Vieux-Chambery et quartiers modernes comme Bissy ou Cognin. Les artisans du batiment y sont particulierement sollicites pour la renovation d'immeubles anciens, l'entretien de chalets savoyards et les projets de construction neuve dans les zones residentielles en plein essor. La proximite des stations de ski genere egalement une forte demande en travaux saisonniers.");
            Ville annecy = createVille(villeRepo, "Annecy", "annecy", "74000", "Haute-Savoie", 45.8992, 6.1294,
                "Annecy, la Venise des Alpes, seduit par son lac et sa vieille ville pittoresque. Les artisans du batiment accompagnent la renovation du centre historique, l'entretien des residences lacustres et les constructions dans les quartiers residentiels comme Cran-Gevrier, Seynod et Meythet. Le dynamisme immobilier de l'agglomeration assure une demande constante en travaux de qualite.");
            Ville grenoble = createVille(villeRepo, "Grenoble", "grenoble", "38000", "Isere", 45.1885, 5.7245,
                "Grenoble, capitale des Alpes, est un pole universitaire et technologique majeur. La renovation energetique des batiments anciens du centre-ville et des campus constitue un marche important pour les artisans. Les quartiers de l'Ile Verte, Europole et la Presqu'ile offrent de nombreuses opportunites en construction et renovation, portees par les objectifs de transition ecologique de la metropole.");
            Ville lyon = createVille(villeRepo, "Lyon", "lyon", "69000", "Rhone", 45.7640, 4.8357,
                "Lyon, deuxieme metropole de France, offre un marche du batiment dynamique et diversifie. Du Vieux Lyon classe a l'UNESCO aux projets modernes de la Confluence et de la Part-Dieu, les artisans interviennent sur tous types de chantiers. La Croix-Rousse, les pentes et les arrondissements residentiels generent une demande permanente en renovation, amenagement et construction.");
            createVille(villeRepo, "Valence", "valence", "26000", "Drome", 44.9334, 4.8910,
                "Valence, porte du Midi, beneficie d'un cadre de vie attractif entre Rhone et Vercors. Le centre-ville historique et les quartiers pavillonnaires comme Fontbarlettes ou le Plan offrent de nombreux chantiers de renovation et d'amenagement. La croissance demographique de l'agglomeration stimule la construction neuve et les travaux d'amelioration de l'habitat.");

            // --- Metiers ---
            Metier plombier = createMetier(metierRepo, "Plombier", "plombier", "\uD83D\uDD27");
            Metier electricien = createMetier(metierRepo, "Electricien", "electricien", "\u26A1");
            Metier peintre = createMetier(metierRepo, "Peintre", "peintre", "\uD83C\uDFA8");
            Metier macon = createMetier(metierRepo, "Macon", "macon", "\uD83E\uDDF1");
            Metier carreleur = createMetier(metierRepo, "Carreleur", "carreleur", "\uD83D\uDD32");
            createMetier(metierRepo, "Menuisier", "menuisier", "\uD83E\uDE9A");
            createMetier(metierRepo, "Couvreur", "couvreur", "\uD83C\uDFE0");
            createMetier(metierRepo, "Chauffagiste", "chauffagiste", "\uD83D\uDD25");
            createMetier(metierRepo, "Serrurier", "serrurier", "\uD83D\uDD11");
            createMetier(metierRepo, "Cuisiniste", "cuisiniste", "\uD83C\uDF73");

            // --- Badges systeme ---
            createBadgeSysteme(badgeSystemeRepo, "RGE", "Reconnu Garant de l'Environnement", "\u2705");
            createBadgeSysteme(badgeSystemeRepo, "Qualibat", "Certification Qualibat", "\uD83C\uDFC5");
            createBadgeSysteme(badgeSystemeRepo, "Qualifelec", "Certification Qualifelec", "\u26A1");
            createBadgeSysteme(badgeSystemeRepo, "Qualibois", "Certification Qualibois", "\uD83C\uDF33");
            createBadgeSysteme(badgeSystemeRepo, "Qualipac", "Certification Qualipac", "\u2744\uFE0F");
            createBadgeSysteme(badgeSystemeRepo, "QualitENR", "Certification QualitENR", "\u2600\uFE0F");
            createBadgeSysteme(badgeSystemeRepo, "CAPEB", "Membre de la CAPEB", "\uD83E\uDD1D");
            createBadgeSysteme(badgeSystemeRepo, "Assurance decennale", "Assurance decennale souscrite", "\uD83D\uDEE1\uFE0F");
            createBadgeSysteme(badgeSystemeRepo, "Garantie decennale", "Garantie decennale active", "\uD83D\uDCDC");

            // --- Admin ---
            User admin = new User();
            admin.setEmail("admin@bativio.fr");
            admin.setPasswordHash(passwordEncoder.encode("Bativio2024!"));
            admin.setRole(Role.ADMIN);
            admin.setEmailVerified(true);
            userRepo.save(admin);

            // --- Artisans fictifs a Chambery ---
            createArtisan1(userRepo, artisanRepo, badgeRepo, serviceRepo, horaireRepo, zoneRepo, passwordEncoder, plombier, chambery);
            createArtisan2(userRepo, artisanRepo, badgeRepo, serviceRepo, horaireRepo, zoneRepo, passwordEncoder, electricien, chambery);
            createArtisan3(userRepo, artisanRepo, badgeRepo, serviceRepo, horaireRepo, zoneRepo, passwordEncoder, peintre, chambery);
            createArtisan4(userRepo, artisanRepo, badgeRepo, serviceRepo, horaireRepo, zoneRepo, passwordEncoder, macon, chambery);
            createArtisan5(userRepo, artisanRepo, badgeRepo, serviceRepo, horaireRepo, zoneRepo, passwordEncoder, carreleur, chambery);
        };
    }

    private Ville createVille(VilleRepository repo, String nom, String slug, String cp, String dept, double lat, double lng, String seo) {
        Ville v = new Ville();
        v.setNom(nom);
        v.setSlug(slug);
        v.setCodePostal(cp);
        v.setDepartement(dept);
        v.setLatitude(lat);
        v.setLongitude(lng);
        v.setContenuSeo(seo);
        return repo.save(v);
    }

    private Metier createMetier(MetierRepository repo, String nom, String slug, String icone) {
        Metier m = new Metier();
        m.setNom(nom);
        m.setSlug(slug);
        m.setIcone(icone);
        return repo.save(m);
    }

    private void createBadgeSysteme(BadgeSystemeRepository repo, String nom, String desc, String icone) {
        BadgeSysteme bs = new BadgeSysteme();
        bs.setNom(nom);
        bs.setDescription(desc);
        bs.setIcone(icone);
        repo.save(bs);
    }

    private Artisan createBaseArtisan(UserRepository userRepo, ArtisanRepository artisanRepo, PasswordEncoder encoder,
                                       String email, String password, String siret, String raisonSociale, String nomAffichage,
                                       String prenom, String nomFamille, String telephone, Metier metier, Ville villeRef,
                                       String description, int experience, BigDecimal note, int avis, Plan plan, String slug) {
        User u = new User();
        u.setEmail(email);
        u.setPasswordHash(encoder.encode(password));
        u.setRole(Role.ARTISAN);
        u.setEmailVerified(true);
        u = userRepo.save(u);

        Artisan a = new Artisan();
        a.setUser(u);
        a.setSiret(siret);
        a.setRaisonSociale(raisonSociale);
        a.setNomAffichage(nomAffichage);
        a.setPrenom(prenom);
        a.setNom(nomFamille);
        a.setTelephone(telephone);
        a.setMetier(metier);
        a.setAdresse(villeRef.getNom());
        a.setCodePostal(villeRef.getCodePostal());
        a.setVille(villeRef.getNom());
        a.setLatitude(villeRef.getLatitude());
        a.setLongitude(villeRef.getLongitude());
        a.setZoneRayonKm(25);
        a.setDescription(description);
        a.setExperienceAnnees(experience);
        a.setNoteMoyenne(note);
        a.setNombreAvis(avis);
        a.setPlan(plan);
        a.setSlug(slug);
        a.setProfilCompletion(85);
        return artisanRepo.save(a);
    }

    private void addBadge(BadgeRepository repo, Artisan a, String nom, String icone) {
        Badge b = new Badge();
        b.setArtisan(a);
        b.setType(BadgeType.SYSTEME);
        b.setNom(nom);
        b.setIcone(icone);
        repo.save(b);
    }

    private void addService(ServiceArtisanRepository repo, Artisan a, String titre, String desc, String prix, int ordre) {
        ServiceArtisan s = new ServiceArtisan();
        s.setArtisan(a);
        s.setTitre(titre);
        s.setDescription(desc);
        s.setPrixIndicatif(prix);
        s.setOrdre(ordre);
        repo.save(s);
    }

    private void addHoraires(HoraireRepository repo, Artisan a) {
        for (int j = 1; j <= 5; j++) {
            Horaire h = new Horaire();
            h.setArtisan(a);
            h.setJourSemaine(j);
            h.setOuvert(true);
            h.setHeureOuverture(LocalTime.of(8, 0));
            h.setHeureFermeture(LocalTime.of(18, 0));
            repo.save(h);
        }
        Horaire samedi = new Horaire();
        samedi.setArtisan(a);
        samedi.setJourSemaine(6);
        samedi.setOuvert(true);
        samedi.setHeureOuverture(LocalTime.of(9, 0));
        samedi.setHeureFermeture(LocalTime.of(12, 0));
        repo.save(samedi);
        Horaire dimanche = new Horaire();
        dimanche.setArtisan(a);
        dimanche.setJourSemaine(7);
        dimanche.setOuvert(false);
        repo.save(dimanche);
    }

    private void addZones(ZoneInterventionRepository repo, Artisan a, String... villes) {
        for (String v : villes) {
            ZoneIntervention z = new ZoneIntervention();
            z.setArtisan(a);
            z.setVille(v);
            repo.save(z);
        }
    }

    // --- Artisan 1: Martin Plomberie ---
    private void createArtisan1(UserRepository userRepo, ArtisanRepository artisanRepo, BadgeRepository badgeRepo,
                                 ServiceArtisanRepository serviceRepo, HoraireRepository horaireRepo,
                                 ZoneInterventionRepository zoneRepo, PasswordEncoder encoder, Metier metier, Ville ville) {
        Artisan a = createBaseArtisan(userRepo, artisanRepo, encoder,
            "jp.martin@email.com", "Demo2024!", "12345678901234", "Martin Plomberie SARL",
            "Martin Plomberie", "Jean-Pierre", "Martin", "04 79 12 34 56", metier, ville,
            "Plombier a Chambery depuis 15 ans, je mets mon expertise au service de vos projets. Specialise en renovation de salles de bains, installation de chauffage et depannage d'urgence. Mon engagement : un travail soigne, des delais respectes et un devis transparent avant chaque intervention.",
            15, new BigDecimal("4.8"), 47, Plan.PRO, "martin-plomberie");

        addBadge(badgeRepo, a, "RGE", "\u2705");
        addBadge(badgeRepo, a, "Qualibat", "\uD83C\uDFC5");
        addBadge(badgeRepo, a, "Assurance decennale", "\uD83D\uDEE1\uFE0F");
        addService(serviceRepo, a, "Depannage plomberie", "Intervention rapide pour fuites, canalisations bouchees, chauffe-eau en panne. Disponible 7j/7 pour les urgences.", "A partir de 80\u20AC", 0);
        addService(serviceRepo, a, "Renovation salle de bains", "Conception et realisation complete de votre salle de bains : plomberie, carrelage, sanitaires, meubles.", "Sur devis", 1);
        addService(serviceRepo, a, "Installation chauffage", "Pose de chaudieres gaz, pompes a chaleur, planchers chauffants. Conseil en economies d'energie.", "Sur devis", 2);
        addHoraires(horaireRepo, a);
        addZones(zoneRepo, a, "Chambery", "Cognin", "Bissy", "La Motte-Servolex", "Bassens", "Saint-Alban-Leysse");
    }

    // --- Artisan 2: Elec Savoie ---
    private void createArtisan2(UserRepository userRepo, ArtisanRepository artisanRepo, BadgeRepository badgeRepo,
                                 ServiceArtisanRepository serviceRepo, HoraireRepository horaireRepo,
                                 ZoneInterventionRepository zoneRepo, PasswordEncoder encoder, Metier metier, Ville ville) {
        Artisan a = createBaseArtisan(userRepo, artisanRepo, encoder,
            "t.girard@email.com", "Demo2024!", "23456789012345", "Elec Savoie",
            "Elec Savoie", "Thomas", "Girard", "04 79 23 45 67", metier, ville,
            "Electricien qualifie a Chambery, je realise tous vos travaux electriques dans le respect des normes NF C 15-100. Du tableau electrique a la domotique, en passant par les bornes de recharge pour vehicules electriques.",
            8, new BigDecimal("4.9"), 32, Plan.ESSENTIEL, "elec-savoie");

        addBadge(badgeRepo, a, "Qualifelec", "\u26A1");
        addBadge(badgeRepo, a, "Assurance decennale", "\uD83D\uDEE1\uFE0F");
        addService(serviceRepo, a, "Mise aux normes electriques", "Diagnostic et mise en conformite de votre installation electrique.", "A partir de 500\u20AC", 0);
        addService(serviceRepo, a, "Installation domotique", "Maison connectee : eclairage intelligent, volets roulants, thermostat connecte.", "Sur devis", 1);
        addHoraires(horaireRepo, a);
        addZones(zoneRepo, a, "Chambery", "Aix-les-Bains", "La Ravoire", "Barby");
    }

    // --- Artisan 3: Dupont Peinture ---
    private void createArtisan3(UserRepository userRepo, ArtisanRepository artisanRepo, BadgeRepository badgeRepo,
                                 ServiceArtisanRepository serviceRepo, HoraireRepository horaireRepo,
                                 ZoneInterventionRepository zoneRepo, PasswordEncoder encoder, Metier metier, Ville ville) {
        Artisan a = createBaseArtisan(userRepo, artisanRepo, encoder,
            "m.dupont@email.com", "Demo2024!", "34567890123456", "Dupont Peinture",
            "Dupont Peinture", "Marie", "Dupont", "04 79 34 56 78", metier, ville,
            "Artisan peintre a Chambery, je transforme vos interieurs et exterieurs avec des finitions impeccables. Peinture decorative, ravalement de facades, pose de revetements muraux.",
            12, new BigDecimal("4.7"), 28, Plan.GRATUIT, "dupont-peinture");

        addBadge(badgeRepo, a, "Qualibat", "\uD83C\uDFC5");
        addService(serviceRepo, a, "Peinture interieure", "Preparation des surfaces, application de peinture, finitions soignees pour tous types de pieces.", "A partir de 25\u20AC/m2", 0);
        addService(serviceRepo, a, "Ravalement de facade", "Nettoyage, reparation et peinture de facades. Protection durable contre les intemperies.", "Sur devis", 1);
        addHoraires(horaireRepo, a);
        addZones(zoneRepo, a, "Chambery", "Cognin", "Jacob-Bellecombette");
    }

    // --- Artisan 4: Alpes Maconnerie ---
    private void createArtisan4(UserRepository userRepo, ArtisanRepository artisanRepo, BadgeRepository badgeRepo,
                                 ServiceArtisanRepository serviceRepo, HoraireRepository horaireRepo,
                                 ZoneInterventionRepository zoneRepo, PasswordEncoder encoder, Metier metier, Ville ville) {
        Artisan a = createBaseArtisan(userRepo, artisanRepo, encoder,
            "p.blanc@email.com", "Demo2024!", "45678901234567", "Alpes Maconnerie",
            "Alpes Maconnerie", "Pierre", "Blanc", "04 79 45 67 89", metier, ville,
            "Macon a Chambery depuis 20 ans, specialise dans la construction traditionnelle savoyarde et la renovation du bati ancien. Gros oeuvre, extension, terrassement et amenagement exterieur.",
            20, new BigDecimal("4.6"), 53, Plan.PRO_PLUS, "alpes-maconnerie");

        addBadge(badgeRepo, a, "Qualibat", "\uD83C\uDFC5");
        addBadge(badgeRepo, a, "CAPEB", "\uD83E\uDD1D");
        addBadge(badgeRepo, a, "Garantie decennale", "\uD83D\uDCDC");
        addService(serviceRepo, a, "Construction neuve", "Gros oeuvre complet : fondations, murs, dalles, charpente.", "Sur devis", 0);
        addService(serviceRepo, a, "Extension de maison", "Agrandissement de votre habitat : garage, veranda, etage supplementaire.", "Sur devis", 1);
        addService(serviceRepo, a, "Renovation pierre", "Restauration de murs en pierre, joints a la chaux, taille de pierre.", "Sur devis", 2);
        addHoraires(horaireRepo, a);
        addZones(zoneRepo, a, "Chambery", "Cognin", "La Motte-Servolex", "Bassens", "Saint-Alban-Leysse", "Barby", "Challes-les-Eaux");
    }

    // --- Artisan 5: Savoie Carrelage ---
    private void createArtisan5(UserRepository userRepo, ArtisanRepository artisanRepo, BadgeRepository badgeRepo,
                                 ServiceArtisanRepository serviceRepo, HoraireRepository horaireRepo,
                                 ZoneInterventionRepository zoneRepo, PasswordEncoder encoder, Metier metier, Ville ville) {
        Artisan a = createBaseArtisan(userRepo, artisanRepo, encoder,
            "l.moreau@email.com", "Demo2024!", "56789012345678", "Savoie Carrelage",
            "Savoie Carrelage", "Luc", "Moreau", "04 79 56 78 90", metier, ville,
            "Carreleur professionnel a Chambery, je pose tous types de carrelages et faiences : sol, mur, terrasse. Travail minutieux et propre, respect des delais.",
            6, new BigDecimal("4.5"), 19, Plan.ESSENTIEL, "savoie-carrelage");

        addBadge(badgeRepo, a, "Assurance decennale", "\uD83D\uDEE1\uFE0F");
        addService(serviceRepo, a, "Pose de carrelage", "Sol et mur, tous formats et tous materiaux : gres cerame, faience, mosaique.", "A partir de 35\u20AC/m2", 0);
        addService(serviceRepo, a, "Terrasses et exterieurs", "Pose de dalles et carrelage exterieur, resistant au gel.", "Sur devis", 1);
        addHoraires(horaireRepo, a);
        addZones(zoneRepo, a, "Chambery", "Cognin", "La Ravoire");
    }
}
