# Spec Vitrine — Martin Plomberie

## Artisan
- **Nom d'affichage** : Martin Plomberie
- **Prenom** : Jean-Pierre
- **Nom** : Martin
- **Metier** : Plombier-chauffagiste
- **Ville** : Chambery (73000)
- **Adresse** : 14 rue de Boigne, 73000 Chambery
- **Zone d'intervention** : Chambery, La Motte-Servolex, Cognin, Bassens, Jacob-Bellecombette, Saint-Alban-Leysse, Barby, Challes-les-Eaux (rayon 15 km)
- **Experience** : 15 ans
- **SIRET** : 84729361500014
- **Telephone** : 04 79 62 18 43
- **Email** : contact@martin-plomberie.fr
- **Description** : Plombier-chauffagiste a Chambery depuis 2010. Specialise en depannage urgent, renovation de salle de bain et installation de systemes de chauffage. Intervention rapide dans tout le bassin chamberien. Travail soigne, devis gratuit, garantie decennale.
- **Note moyenne** : 4.8/5 (27 avis)

## Badges
1. **RGE** (Reconnu Garant Environnement) — badge systeme, icone feuille
2. **QualitENR** — certification chauffage, icone soleil
3. **Urgence 7j/7** — badge custom, icone clock, couleur terre
4. **Devis gratuit sous 24h** — badge custom, icone check-circle, couleur or
5. **Garantie decennale** — badge custom, icone shield, couleur anthracite

## Services
1. **Depannage plomberie** — Intervention rapide pour fuites d'eau, canalisations bouchees, robinetterie defaillante. Deplacement dans l'heure en zone Chambery. — A partir de 80EUR
2. **Renovation salle de bain** — Transformation complete : demontage, plomberie, carrelage (partenaire carreleur), pose sanitaires. Du projet au cle en main. — Sur devis
3. **Installation chauffage** — Pose et remplacement de chaudieres gaz, pompes a chaleur, planchers chauffants. Eligible aides MaPrimeRenov. — Sur devis
4. **Entretien chaudiere** — Contrat d'entretien annuel obligatoire. Verification complete, nettoyage, attestation. — 120EUR/an

## Galerie avant/apres
1. **Renovation salle de bain a Cognin** — Transformation d'une salle de bain des annees 80 en espace moderne avec douche italienne et double vasque. Date : 2024-09.
2. **Remplacement chaudiere a Chambery** — Passage d'une vieille chaudiere fioul a une pompe a chaleur air-eau. Economies d'energie de 40%. Date : 2024-06.
3. **Depannage fuite sous dalle a Bassens** — Detection et reparation d'une fuite invisible sous dalle beton. Intervention en urgence, remise en eau en 4h. Date : 2024-11.

## Avis clients
1. **Sophie D.** — 5/5 — "Intervention rapide pour une fuite dans la cuisine. Jean-Pierre est arrive en moins d'une heure un dimanche. Travail propre et prix honnete. Je recommande vivement." — Depannage plomberie — 2024-11-15 — verifie
2. **Marc L.** — 5/5 — "Renovation complete de notre salle de bain. Resultat magnifique, dans les delais et le budget annonces. L'equipe est serieuse et soignee." — Renovation salle de bain — 2024-09-22 — verifie
3. **Catherine B.** — 4/5 — "Bon travail pour l'installation de notre pompe a chaleur. Quelques jours de retard mais le resultat est la. Tres content du chauffage." — Installation chauffage — 2024-07-10 — verifie
4. **Thomas R.** — 5/5 — "Entretien chaudiere fait dans les regles. Jean-Pierre prend le temps d'expliquer et de conseiller. Rien a redire." — Entretien chaudiere — 2025-01-08 — verifie
5. **Amelie G.** — 5/5 — "Urgence un soir de semaine, fuite importante sous l'evier. Intervention en 45 minutes. Professionnel et rassurant." — Depannage plomberie — 2025-02-03 — verifie

## Direction artistique

### Angle
**L'artisan de quartier, fiable et reactif.** On joue sur la proximite (Chambery, Savoie), la rapidite d'intervention, et la qualite du travail prouvee par les photos avant/apres. Pas de jargon technique excessif — on parle au particulier de 40-55 ans qui a une urgence ou un projet de renovation.

### Hero
- **Layout** : Photo de fond pleine largeur (chantier salle de bain renovee), overlay gradient anthracite du bas vers le haut (from-80% to-30%)
- **Contenu** : Logo Bativio discret en haut, nom "Martin Plomberie" en Fraunces display blanc, sous-titre "Plombier-chauffagiste a Chambery" en Karla, badge note or (4.8/5 - 27 avis), puis deux CTA : "Demander un devis" (bouton terre) et numero de telephone cliquable (bouton outline blanc)
- **Mobile** : Stack vertical, CTA full-width, telephone en premier

### Element signature
**Galerie avant/apres avec slider draggable** — Le principal differenciateur visuel. Un slider pleine largeur avec curseur vertical qu'on tire pour reveler l'avant et l'apres. Touch-friendly sur mobile. Labels "AVANT" / "APRES" en badges frosted glass.

### Palette specifique
- Hero : anthracite dominant + blanc
- Badges : fond blanc/90 + icones terre
- Services : fond creme #FAF8F5
- Galerie : fond anthracite (dark section pour contraste)
- Avis : fond creme avec cards blanches
- Contact : split — gauche creme (formulaire), droite terre (infos)

## Structure des sections (ordre)
1. **Hero** — Photo fond + nom + metier + note + CTA + telephone
2. **Bandeau badges** — Scroll horizontal mobile, fixe desktop. RGE, QualitENR, Urgence 7j/7, Devis gratuit, Garantie decennale
3. **Presentation** — Photo portrait artisan a gauche + description + chiffres cles (15 ans, 27 avis, rayon 15km)
4. **Services** — 4 cards en grille 2x2 desktop, stack mobile. Icone + titre + description + prix
5. **Galerie avant/apres** — 3 projets avec slider draggable. Dark background pour impact visuel
6. **Avis clients** — Carrousel horizontal de 5 avis. Etoiles + texte + prenom + service
7. **Zone d'intervention** — Liste des communes en chips + mention "rayon 15 km autour de Chambery"
8. **Contact & Devis** — Formulaire 4 champs (nom, telephone, email, description du besoin) + infos contact + horaires
9. **Footer** — SIRET, mention Bativio, liens legaux

## Criteres de succes specifiques
- CTA "Demander un devis" visible sans scroll sur iPhone SE (375px)
- Telephone cliquable avec `tel:`
- Slider avant/apres fonctionne au touch et a la souris
- Bandeau badges scrollable sans barre de defilement visible
- Formulaire max 4 champs
- CTA sticky en bas d'ecran sur mobile (Appeler + Devis)
- Transition douce entre sections (pas de coupe brutale)
- Score WCAG AA sur les contrastes texte/fond
