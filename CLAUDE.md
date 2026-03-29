# CLAUDE.md — Bativio

## Projet

Bativio est un SaaS B2B pour artisans du bâtiment (plombiers, électriciens, peintres, maçons, carreleurs, couvreurs, chauffagistes, menuisiers, etc.). C'est un "Planity des artisans" : annuaire public par ville, vitrines artisan avec URL perso, espace pro de gestion, et facturation électronique intégrée.

Lancement : Chambéry via le réseau Klik&Go, puis scaling Rhône-Alpes ville par ville.
Volume cible : 10-30 artisans en 6 mois, 200-300 à 18 mois.
Modèle : abonnement uniquement, zéro commission, zéro frais cachés.

---

## Stack technique

| Couche | Technologie | Hébergement |
|--------|------------|-------------|
| App (frontend + API) | Next.js 16 (App Router + API Routes) | Vercel |
| ORM | Prisma 6 | — |
| Auth | JWT cookie HttpOnly (jose + bcryptjs) | — |
| Base de données | PostgreSQL | Railway |
| Photos | Cloudinary | — |
| Emails | Resend | — |
| Paiements | Stripe | — |
| IA | Anthropic Claude API | — |
| SIRET auto-fill | recherche-entreprises.api.gouv.fr | — |

---

## Design system

### Couleurs
- Terre : `#C4531A` (primaire, CTA, accents)
- Terre light : `#D4733A` (hover)
- Anthracite : `#1C1C1E` (texte, fonds sombres)
- Or : `#E8A84C` (badges, étoiles, accents secondaires)
- Crème : `#FAF8F5` (fond principal)
- Blanc : `#FFFFFF` (cards, surfaces)

### Typographie
- Display / titres : **Fraunces** (serif, variable)
- Body / texte : **Karla** (sans-serif)

### UI patterns
- Badges frosted glass : `background: rgba(255,255,255,0.85); backdrop-filter: blur(12px);`
- Micro-interactions hover : `translateY(-4px)` + box-shadow sur les cards
- Séparateurs section : `w-10 h-0.5 bg-terre`
- CTA principal : bg-terre, texte blanc, border-radius 8px
- CTA secondaire : outline blanc ou anthracite

### Inspiration
- Planity, Doctolib — premium, moderne, efficace

---

## Architecture URL (SEO)

```
bativio.fr/                          → Landing page nationale (SSG)
bativio.fr/[ville]                   → Page annuaire par ville (SSG + ISR)
bativio.fr/[ville]/[metier]          → Page métier × ville (SSG + ISR) — V2
bativio.fr/[ville]/[slug-artisan]    → Vitrine artisan publique (SSR)
bativio.fr/inscription               → Onboarding artisan (CSR)
bativio.fr/connexion                 → Login (CSR)
bativio.fr/dashboard/*               → Espace pro artisan (CSR, noindex)
bativio.fr/admin/*                   → Back-office webmaster (CSR, noindex)
bativio.fr/facturation-electronique  → Page SEO Invoquo (SSG)
[slug].bativio.fr                    → Site dédié artisan Premium — V2
```

### SEO technique
- `generateMetadata()` Next.js pour meta tags dynamiques
- JSON-LD Schema.org sur chaque vitrine : `LocalBusiness`, `AggregateRating`, `Service`, `AreaServed`
- `ItemList` sur les pages villes
- Sitemap XML dynamique (mis à jour à chaque inscription)
- Robots.txt : indexer pages publiques, exclure dashboard/admin
- Canonical URLs sur toutes les pages
- Contenu unique par ville (généré par IA, pas de doorway pages)

### Villes V1
Chambéry, Annecy, Grenoble, Lyon, Valence

---

## Les 4 briques

### Brique 1 — Annuaire public
Page d'accueil avec recherche par métier + ville. Pages par ville avec contenu SEO unique. Cards artisan avec : nom, métier, photo, note, ville, description courte. Filtres par métier (pills cliquables). Résultats filtrés côté client (données SSR).

### Brique 2 — Espace artisan (inscription + profil)
Inscription SIRET → auto-fill Pappers → nom d'affichage, email, tel, mot de passe → en ligne.
Personnalisation progressive depuis le dashboard : photos, description, badges, zone, horaires.
Barre de complétion profil gamifiée.

### Brique 3 — Vitrine artisan (mini-site)
Page publique à `bativio.fr/[ville]/[slug]`. Disponible complète à partir du plan Pro (49€).
Sections : hero, badges, présentation, services, galerie avant/après, avis, zone d'intervention, contact/devis, footer SIRET.
CTA sticky mobile (Appeler + Devis). JSON-LD structuré.

### Brique 4 — Back-office webmaster
Interface admin pour gérer la plateforme : artisans, villes, métiers, reporting, modération, Stripe.

---

## Plans tarifaires

| Feature | Gratuit | Essentiel 19€ | Pro 49€ | Pro+ 79€ |
|---------|---------|---------------|---------|----------|
| **VISIBILITÉ** | | | | |
| Fiche annuaire | ✅ | ✅ | ✅ | ✅ |
| URL perso (vitrine complète) | ❌ | ❌ | ✅ | ✅ |
| Photos chantiers | 3 max | 10 | Illimité | Illimité |
| Photos avant/après | ❌ | ✅ | ✅ | ✅ |
| Badges qualifications | 2 max | Illimité | Illimité | Illimité |
| QR Code vitrine | ❌ | ❌ | ✅ | ✅ |
| Bouton RDV Google/réseaux | ❌ | ❌ | ✅ | ✅ |
| **INTERACTION CLIENT** | | | | |
| Formulaire devis (4 champs) | ✅ | ✅ | ✅ | ✅ |
| Agenda visible clients 24/7 | ❌ | ✅ | ✅ | ✅ |
| Prise de RDV en ligne | ❌ | ✅ | ✅ | ✅ |
| Annulation/report par client | ❌ | ✅ | ✅ | ✅ |
| SMS rappel avant RDV | ❌ | ✅ | ✅ | ✅ |
| Compte à rebours 20min + relance SMS | ❌ | ✅ | ✅ | ✅ |
| Agent IA répondeur client | ❌ | ❌ | ❌ | ✅ |
| **GESTION** | | | | |
| Dashboard stats | Basique | ✅ | ✅ complet | ✅ complet |
| Fiches clients / mini-CRM | ❌ | ❌ | ✅ | ✅ |
| Historique échanges par client | ❌ | ❌ | ✅ | ✅ |
| Notifications (email+SMS+dashboard) | Email seul | ✅ | ✅ | ✅ |
| Progression profil gamifiée | ✅ | ✅ | ✅ | ✅ |
| **FACTURATION (Invoquo)** | | | | |
| Réception factures PA | ❌ | ✅ | ✅ | ✅ |
| Dépôt/transmission PA | ❌ | ❌ | ✅ | ✅ |
| Création factures Bativio | ❌ | ❌ | ❌ | ✅ |
| Devis IA | ❌ | ❌ | ❌ | ✅ |
| Export comptable (CSV/Excel) | ❌ | ❌ | ✅ | ✅ |
| **ABONNEMENT** | | | | |
| Zéro commission | ✅ | ✅ | ✅ | ✅ |
| Gestion abo Stripe | — | ✅ | ✅ | ✅ |
| Support | — | Email | Prioritaire | Dédié |

---

## Authentification

- **Artisan** : email + mot de passe OU magic link (au choix)
- **Admin/Webmaster** : même système, rôle ADMIN
- **Tokens** : JWT access 15min + refresh rotatif hashé en BDD
- **Rôles** : ARTISAN, ADMIN
- **CORS** : configuré par environnement (dev / staging / prod)
- **Inscription** : libre, artisan visible immédiatement dans l'annuaire

---

## Onboarding artisan

Flow en étapes progressives (max 3 min) :

1. **SIRET** → auto-fill Pappers (raison sociale, adresse, code NAF, date création)
2. **Nom d'affichage** + email + téléphone + mot de passe
3. **Métier** — sélection visuelle (gros boutons avec icônes)
4. **Zone d'intervention** — ville + slider rayon (5-80 km)
5. **Photos** — upload drag & drop ou appareil photo mobile (optionnel, peut skip)
6. **Aperçu** — preview de la fiche → "Publier ma page"

Principe : capturer le minimum pour mettre en ligne. L'artisan complète ensuite depuis le dashboard.

---

## Fonctionnalités détaillées

### Formulaire de devis (côté client)
- 4 champs : nom, téléphone, email, description du besoin (texte libre)
- À la soumission → email + SMS + notification dashboard à l'artisan
- Compte à rebours de 20 minutes démarre
- Si pas de réponse artisan à 20min → SMS de relance automatique
- Si toujours pas de réponse → notification "Vous risquez de perdre ce client"

### Agenda / RDV
- L'artisan définit ses créneaux disponibles depuis le dashboard
- L'agenda est visible publiquement 24h/24 sur la vitrine
- Le client réserve un créneau directement
- SMS de confirmation au client + notification artisan
- SMS de rappel automatique la veille du RDV
- Le client peut annuler/reporter via un lien dans le SMS
- 50% des RDV pris en dehors des heures d'ouverture (insight Planity)

### Avis clients (V2)
- Réservés aux clients ayant demandé un devis via la plateforme
- Note étoiles + texte + service concerné + date
- Mention "Avis vérifié"
- L'artisan peut répondre
- Modération admin possible (signalement)

### Agent IA répondeur (Pro+ uniquement)
- Quand un client envoie un message ou une demande de devis
- L'IA répond immédiatement avec des questions de qualification
- Questions : type de travaux, urgence, adresse, budget estimé
- Une fois le brief complet → transmis à l'artisan avec un résumé structuré
- L'artisan prend le relai pour le contact humain

### Devis IA (Pro+ uniquement)
- L'artisan décrit le besoin en 2 phrases
- L'IA génère un devis structuré : postes, quantités estimées, fourchettes de prix
- L'artisan ajuste et envoie au client

### Fiches clients / mini-CRM (Pro et Pro+)
- Fiche par client : nom, coordonnées, historique RDV, historique messages, devis envoyés
- Notes internes de l'artisan
- Tous les échanges regroupés dans la fiche

### Photos
- Upload via API Route Next.js → Cloudinary
- Validation côté backend : taille max 10 Mo, formats JPG/PNG/WebP
- Compression automatique
- Deux modes : photo simple OU paire avant/après avec titre commun
- Limites selon le plan (3 / 10 / illimité)

### Badges qualifications
- Pré-programmés : RGE, Qualibat, Qualifelec, Qualibois, Qualipac, QualitENR, CAPEB, assurance décennale, garantie décennale
- Personnalisables par l'artisan (texte + icône)
- Limites : 2 badges max en Gratuit, illimité sinon

### Statistiques dashboard
- Gratuit : nombre de vues
- Essentiel+ : vues, demandes de devis reçues, RDV ce mois, note moyenne
- Pro+ : + taux de réponse, évolution mensuelle, source des visites

### QR Code (Pro et Pro+)
- Généré automatiquement à partir de l'URL de la vitrine
- Téléchargeable en PDF depuis le dashboard
- Pour cartes de visite, camion, flyers

### Notifications
- Email : Resend (transactionnel)
- SMS : OVH SMS (confirmations, rappels, relances)
- Dashboard : notification in-app temps réel

### Export comptable (Pro et Pro+)
- Export CSV/Excel des factures et paiements
- Transmissible au comptable

---

## Stripe — Abonnements

- Stripe Checkout pour la souscription
- Stripe Customer Portal pour que l'artisan gère son abo (upgrade/downgrade/annulation)
- Webhooks Stripe → API Route Next.js : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- L'artisan peut activer/changer de plan depuis son dashboard
- Le webmaster peut depuis l'admin :
  - Voir le statut d'abonnement de chaque artisan
  - Offrir un mois gratuit / coupon
  - Forcer un upgrade/downgrade
  - Voir les logs Stripe (paiements, échecs, annulations)

---

## Invoquo — Facturation électronique (V3)

Architecture : `Artisan → Bativio → Invoquo (OD interne) → API PA (IOPOLE / Sequino)`

Invoquo est un OD (Opérateur de Dématérialisation), pas une PA. Il consomme les API PA en marque blanche.

- **Essentiel** : réception PA uniquement (artisan garde son logiciel de facturation)
- **Pro** : artisan glisse/dépose ses factures → Invoquo transmet en PA
- **Pro+** : artisan crée/modifie ses factures dans Bativio → transmission PA sur demande + assistant IA

Communication : "connecté à une plateforme certifiée par l'État" (sans prétendre être une PA).

Mandat PA : reporté à V3 (intégré dans l'onboarding quand Invoquo est prêt).

---

## Back-office webmaster (admin)

| Fonctionnalité | Description |
|----------------|-------------|
| Liste artisans | Tous les artisans : actifs, inactifs, suspendus |
| Activation/suspension | Activer, désactiver, suspendre un compte |
| Plans Stripe | Voir le plan de chaque artisan, forcer changement |
| Gestion villes | Ajouter/retirer des villes actives |
| Gestion métiers | Ajouter/modifier les métiers disponibles |
| Reporting | Inscriptions, vues, devis, RDV, revenus (global + par ville) |
| Modération | Signaler/masquer du contenu, gérer les avis signalés |
| Logs Stripe | Paiements, échecs, annulations |

---

## Sécurité (recommandations audit)

- Access tokens : 15 minutes
- Refresh tokens : rotatifs, hashés en BDD
- CORS : configuré par environnement
- Backup : tests de restauration mensuels
- HMAC signature sur les webhooks entrants (Stripe, PA)
- Idempotency keys sur les webhooks
- Rate limiting sur les endpoints publics

---

## Roadmap

### V1 — Plateforme de visibilité
- Landing page bativio.fr
- Pages villes SSG (5 villes, contenu IA unique)
- Vitrines artisans SSR
- Onboarding SIRET (Pappers)
- Dashboard artisan basique (profil, photos, stats simples)
- Upload photos → Cloudinary
- Formulaire demande de devis (email + notification)
- Auth JWT + refresh rotatif
- SEO : schema.org, sitemap, meta tags
- Monitoring Sentry
- Progression profil gamifiée

### V2 — Interactions & engagement
- Prise de RDV : agenda visible, créneaux, réservation 24/7
- SMS rappel avant RDV
- Compte à rebours 20min + relance SMS
- Messagerie artisan ↔ client
- Fiches clients / mini-CRM
- Avis clients vérifiés
- Stripe : abonnements 4 plans
- Notifications email + SMS + dashboard
- QR Code vitrine
- Bouton RDV sur Google/réseaux
- Agent IA répondeur client (Pro+)
- Devis IA (Pro+)
- Pages métier × ville (SEO)
- Dashboard avancé (stats complètes)
- Export comptable
- Annulation/report RDV par client

### V3 — Invoquo & facturation
- Module Invoquo : couche OD
- Connexion API PA partenaire (IOPOLE / Sequino)
- Mandat PA dans l'onboarding
- Réception factures (Essentiel)
- Dépôt + transmission (Pro)
- Création factures + transmission (Pro+)
- Gestion statuts de facture
- Webhook inbox PA (signature, idempotence, retries)
- Stockage documents S3
- Génération PDF
- E-reporting (périmètre à confirmer avec PA)

---

## Conventions de code

### Frontend (Next.js)
- App Router (pas Pages Router)
- TypeScript strict
- Tailwind CSS (config étendue avec les tokens Bativio)
- Composants dans `src/components/`
- Pages dans `src/app/`
- Server Components par défaut, Client Components quand nécessaire
- `generateMetadata()` sur chaque page publique
- `generateStaticParams()` pour les pages villes

### API Routes (Next.js)
- Toutes dans `src/app/api/v1/`
- Auth : JWT cookie HttpOnly (jose), pas de header Authorization
- Validation : Zod
- ORM : Prisma
- Réponses standardisées : `{ success, data, error, timestamp }`
- Middleware Next.js pour protection des routes /dashboard et /admin

### Base de données (Prisma)
- Nommage : snake_case via `@@map`
- Toutes les tables avec `id` (cuid), `created_at`, `updated_at`
- Soft delete (`deleted_at`) sur les entités principales
- Indexes sur les colonnes de recherche fréquente
- Schema dans `prisma/schema.prisma`

### API REST
- Préfixe : `/api/v1/`
- Auth : cookie HttpOnly `bativio-session` (JWT 7j)
- Pagination : `?page=0&size=20`
- Filtres : query params (`?ville=chambery&metier=plombier`)
- Codes HTTP standards : 200, 201, 400, 401, 403, 404, 500

---

## Variables d'environnement requises

### .env.local
```
DATABASE_URL=
JWT_SECRET=
RESEND_API_KEY=
CLOUDINARY_URL=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
SENTRY_DSN=
```

---

## Principes directeurs

1. **Simplicité** — L'artisan est non-tech. Chaque écran doit être compréhensible en 3 secondes.
2. **Mobile-first** — L'artisan est sur chantier, pas derrière un PC.
3. **Réactivité** — Le temps de réponse est le premier facteur de conversion. Tout est conçu pour pousser l'artisan à répondre vite.
4. **Zéro commission** — C'est l'argument différenciant. Le mettre en avant partout.
5. **SEO local** — Chaque artisan inscrit renforce le SEO de Bativio, et Bativio booste la visibilité de l'artisan. Cercle vertueux.
6. **Pas d'over-engineering** — PostgreSQL-based job queue, pas de Redis/Bull en V1. On complexifie quand le volume le justifie.
