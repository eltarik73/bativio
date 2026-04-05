# CLAUDE.md — Bativio

## Projet

Bativio est un SaaS B2B pour artisans du bâtiment (plombiers, électriciens, peintres, maçons, etc.) en Rhône-Alpes.
Annuaire public par ville, vitrines artisan personnalisées, espace pro de gestion (devis, RDV, CRM), facturation électronique (Invoquo).

- **Repo** : https://github.com/eltarik73/bativio
- **Prod** : https://bativio.fr
- **Vercel project** : `bativio` (team_FdEiwAUDJ71q2MGrK6QH6Eag)
- **DB** : PostgreSQL sur Railway

---

## Stack détectée

| Couche | Technologie | Version |
|--------|------------|---------|
| Framework | Next.js (App Router) | 16.2.1 |
| Runtime | React | 19.2.4 |
| Langage | TypeScript (strict) | ^5 |
| CSS | Tailwind CSS v4 + PostCSS | ^4 |
| ORM | Prisma | ^6.19.2 |
| Auth | JWT cookie HttpOnly (jose + bcryptjs) | jose ^6.2 |
| Validation | Zod | ^4.3.6 |
| Images | Cloudinary | ^2.9 |
| Emails | Resend | ^6.9 |
| Paiements | Stripe | ^21.0 |
| Icônes | lucide-react | ^1.7 |
| Hébergement | Vercel | — |
| DB | PostgreSQL | Railway |

---

## Structure des fichiers clés

```
bativio/
├── frontend/                      ← Dossier Next.js (CWD pour npm)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           ← Landing page
│   │   │   ├── layout.tsx         ← Root layout (Fraunces + Karla + Playfair)
│   │   │   ├── globals.css        ← Tailwind v4 @theme inline + design tokens
│   │   │   ├── [ville]/           ← Pages annuaire par ville (SSR)
│   │   │   │   └── [slug]/        ← Vitrine artisan publique
│   │   │   ├── dashboard/         ← Espace pro artisan (auth required)
│   │   │   │   ├── profil/
│   │   │   │   ├── photos/
│   │   │   │   ├── demandes/
│   │   │   │   ├── devis/
│   │   │   │   ├── devis-ia/
│   │   │   │   ├── agenda/
│   │   │   │   ├── rdv/
│   │   │   │   ├── facturation/
│   │   │   │   ├── vitrine/
│   │   │   │   ├── abonnement/
│   │   │   │   └── parametres/
│   │   │   ├── admin/             ← Back-office webmaster (ADMIN role)
│   │   │   │   ├── artisans/
│   │   │   │   ├── villes/
│   │   │   │   ├── metiers/
│   │   │   │   ├── validations/
│   │   │   │   ├── abonnements/
│   │   │   │   ├── statistiques/
│   │   │   │   ├── seo/
│   │   │   │   └── parametres/
│   │   │   ├── api/v1/            ← API Routes
│   │   │   │   ├── auth/          ← login, register, magic-link, forgot-password
│   │   │   │   ├── artisans/me/   ← CRUD artisan connecté
│   │   │   │   ├── artisan/       ← demandes, scoring
│   │   │   │   ├── public/        ← endpoints publics (artisans, villes, siret, devis)
│   │   │   │   ├── admin/         ← endpoints admin
│   │   │   │   ├── stripe/        ← checkout, portal, webhook
│   │   │   │   ├── facturation/   ← Invoquo (activate, badge, refresh-token)
│   │   │   │   ├── upload/        ← signature Cloudinary
│   │   │   │   └── cron/          ← rappels-rdv
│   │   │   ├── inscription/       ← Onboarding artisan
│   │   │   ├── connexion/         ← Login
│   │   │   ├── tarifs/            ← Page pricing
│   │   │   ├── facturation-electronique/ ← Page SEO Invoquo
│   │   │   ├── robots.ts
│   │   │   └── sitemap.ts
│   │   ├── components/
│   │   │   ├── vitrines/          ← Templates vitrine (Classique, Moderne, Portfolio, Vitrine)
│   │   │   ├── pricing/           ← PricingGrid
│   │   │   ├── ChatDevis/         ← Chat devis interactif
│   │   │   ├── FilConversation/   ← Messagerie artisan-client
│   │   │   ├── VilleAutocomplete/ ← Autocomplete villes
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── DevisForm.tsx / DevisForm3Steps.tsx
│   │   │   ├── ArtisanCard.tsx
│   │   │   ├── FeatureGate.tsx / DashboardFeatureGate.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx     ← Auth state global
│   │   ├── lib/
│   │   │   ├── prisma.ts          ← Client Prisma singleton
│   │   │   ├── auth.ts            ← authFetch, token refresh mutex
│   │   │   ├── auth-server.ts     ← JWT verify côté serveur
│   │   │   ├── api-response.ts    ← apiSuccess() / apiError()
│   │   │   ├── stripe.ts          ← Client Stripe
│   │   │   ├── email.ts           ← Resend
│   │   │   ├── sms.ts             ← OVH SMS
│   │   │   ├── plans.ts           ← Feature gates par plan (hasFeature, checkLimit)
│   │   │   ├── plan-gates.ts      ← Plan restrictions
│   │   │   ├── constants.ts       ← VILLES, METIERS, PLANS, COLORS
│   │   │   ├── config.ts          ← SiteConfig avec cache TTL
│   │   │   ├── scoring.ts         ← Scoring artisan
│   │   │   └── vitrine-config.ts  ← Config templates vitrine
│   │   └── middleware.ts          ← Auth middleware (JWT verify, role check)
│   ├── prisma/
│   │   ├── schema.prisma          ← 20+ modèles (User, Artisan, Metier, DemandeDevis, Devis...)
│   │   ├── seed.ts                ← Seed principal
│   │   ├── seed-metiers.ts
│   │   ├── seed-seo.ts
│   │   └── seed-config.ts
│   ├── public/
│   │   ├── manifest.json
│   │   └── icons/
│   ├── next.config.ts             ← Images (Cloudinary, Unsplash, placehold.co)
│   ├── vercel.json                ← Crons (rappels-rdv 18h, relances 8h)
│   ├── package.json
│   └── tsconfig.json              ← Alias @/* → ./src/*
├── vitrines/                      ← Fichiers .pen (vitrines artisan)
├── CLAUDE.md                      ← Ce fichier
└── README.md
```

---

## Commandes de développement

Toutes les commandes npm doivent être exécutées depuis `frontend/` :

```bash
cd frontend
npm run dev          # next dev — port 3000
npm run build        # prisma generate && next build
npm run lint         # eslint
npm run start        # next start (production)
npx prisma studio    # GUI base de données
npx prisma migrate dev --name <nom>   # nouvelle migration
npx prisma db push   # push schema sans migration
npx prisma generate  # régénérer le client
npx tsx prisma/seed.ts               # seed DB
```

---

## Architecture & patterns du code

### Réponses API standardisées
Toutes les API Routes utilisent `apiSuccess()` et `apiError()` de `@/lib/api-response.ts` :
```ts
return apiSuccess(data)       // { success: true, data, timestamp }
return apiError("msg", 400)   // { success: false, error, timestamp }
```

### Authentification
- Cookie `bativio-session` (JWT signé avec `jose`, HttpOnly)
- Middleware Next.js vérifie JWT sur `/dashboard/*`, `/admin/*`, `/api/v1/artisans/*`, `/api/v1/admin/*`
- Rôles : `ARTISAN`, `ADMIN`
- Côté client : `authFetch()` dans `@/lib/auth.ts` avec mutex refresh token
- Magic link disponible en alternative au mot de passe

### Feature gates
- `hasFeature(plan, feature)` dans `@/lib/plans.ts`
- `checkLimit(plan, key, count)` pour limites (photos, badges, SMS, devis IA)
- Plans : GRATUIT → STARTER (19€) → PRO (39€) → BUSINESS (59€)
- Legacy plans (ESSENTIEL, PRO_PLUS) mappés sur les nouveaux

### Prisma
- Nommage : camelCase TS → snake_case SQL via `@map()`
- Toutes les tables avec `id` (cuid), `created_at`, `updated_at`
- Soft delete via `deleted_at` sur `Artisan`
- Client singleton dans `@/lib/prisma.ts` (cache global en dev)

### Tailwind CSS v4
- Design tokens dans `globals.css` avec `@theme inline { ... }`
- Couleurs custom : `terre`, `anthracite`, `or`, `creme`, `sable`, `bois`, `mousse`, `pierre`
- Fonts : `--font-display` (Fraunces), `--font-body` (Karla), `--font-calli` (Playfair Display)
- Variables CSS dupliquées dans `:root` pour usage hors Tailwind

### Images
- Upload via signature Cloudinary (`/api/v1/upload/signature`)
- Remote patterns configurés : `res.cloudinary.com`, `images.unsplash.com`, `placehold.co`
- Formats : WebP + AVIF

---

## Règles non négociables

### Sécurité
- **JAMAIS** de secret dans le code source (JWT_SECRET, API keys, etc.)
- **JAMAIS** de `Authorization: Bearer` header — utiliser uniquement le cookie HttpOnly `bativio-session`
- Toujours valider les inputs avec Zod dans les API Routes
- Vérifier le rôle ADMIN sur tous les endpoints `/api/v1/admin/*`
- Vérifier que l'artisan accède uniquement à SES données sur `/api/v1/artisans/me/*`
- Stripe webhooks : toujours vérifier la signature HMAC
- Rate limiting sur les endpoints publics sensibles (login, register, forgot-password)

### Next.js 16 / App Router
- **LIRE la doc dans `node_modules/next/dist/docs/`** avant d'utiliser une API — Next.js 16 a des breaking changes par rapport aux versions précédentes
- Server Components par défaut, `"use client"` uniquement quand nécessaire
- `generateMetadata()` sur chaque page publique pour le SEO
- Ne jamais importer `prisma` ou des modules Node dans un Client Component
- Les API Routes sont dans `src/app/api/v1/` — préfixe `/api/v1/` obligatoire

### Prisma
- Toujours faire `npx prisma generate` après avoir modifié `schema.prisma`
- Ne jamais modifier manuellement les fichiers dans `src/generated/prisma`
- Utiliser les transactions Prisma pour les opérations multi-tables critiques

### TypeScript
- Mode `strict: true` — pas de `any` sauf nécessité absolue documentée
- Alias `@/*` pour les imports depuis `src/`

### Git
- Ne jamais committer `.env`, `.env.local`, ou tout fichier contenant des secrets
- Les fichiers `.claude/` sont dans `.gitignore`

---

## Erreurs fréquentes à éviter

1. **Oublier `"use client"` sur un composant utilisant useState/useEffect** — erreur runtime obscure
2. **Importer `@prisma/client` dans un Client Component** — crash module Node côté navigateur
3. **Oublier `npx prisma generate` après modif schema** — types TS désynchronisés
4. **Utiliser Tailwind v3 syntax** (`bg-[#C4531A]`) au lieu des tokens v4 (`bg-terre`)
5. **Mettre `async` sur un Client Component** — Server Components only
6. **Oublier `onDelete: Cascade`** sur les relations Prisma enfant → parent critique
7. **Ne pas vérifier le plan artisan** avant d'autoriser une feature premium
8. **Écrire les commandes npm à la racine** au lieu de `frontend/`
9. **Utiliser `fetch()` nu** côté client au lieu de `authFetch()` — perd l'auth
10. **Créer une migration en dev** sur la branche main sans review

---

## Variables d'environnement requises

Fichier `frontend/.env.local` :
```
DATABASE_URL=
JWT_SECRET=
RESEND_API_KEY=
CLOUDINARY_URL=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Variables optionnelles (features avancées) :
```
INVOQUO_API_KEY=
INVOQUO_JWT_SECRET=
OVH_SMS_*=
ANTHROPIC_API_KEY=
SENTRY_DSN=
```

---

## Design system

### Couleurs
| Token | Hex | Usage |
|-------|-----|-------|
| `terre` | `#C4531A` | Primaire, CTA, accents |
| `terre-light` | `#D4733A` | Hover |
| `anthracite` | `#1C1C1E` | Texte, fonds sombres |
| `or` | `#C9943A` | Badges, étoiles, accents |
| `creme` | `#FAF8F5` | Fond principal |
| `blanc` | `#FFFFFF` | Cards, surfaces |

### Typographie
- Display / titres : **Fraunces** (serif, variable) — `font-display`
- Body / texte : **Karla** (sans-serif) — `font-body`
- Accents calligraphiques : **Playfair Display** — `font-calli`

### UI patterns
- Cards : classe `.bv-card` (hover translateY(-3px) + shadow)
- Badges frosted glass : `bg-white/85 backdrop-blur-[12px]`
- CTA principal : `bg-terre text-white rounded-lg`
- Nav : sticky, glassmorphism, 64px height

---

## Facturation électronique (Invoquo)

Bativio intègre Invoquo (invoquo.vercel.app) en iframe embed.

### Architecture
- **Activation** : `POST /api/v1/facturation/activate` → provisionne tenant Invoquo → stocke API key (`inv_...`)
- **Token embed** : `GET /api/v1/facturation/refresh-token` → appelle Invoquo `/api/v1/embed-tokens` → retourne JWT + modules autorisés
- **Iframe** : `invoquo.vercel.app/embed/{siret}/{module}?token=...&accent=C4531A`
- **Formulaires embed** : route catch-all `[...module]` dans Invoquo pour `/invoices/new`, `/quotes/new`, `/clients/new`
- **API embed** : `/api/v1/embed/invoices`, `/api/v1/embed/clients`, `/api/v1/embed/quotes` (auth par `x-embed-token`)
- **Recherche INSEE** : appel direct à `recherche-entreprises.api.gouv.fr` (gratuit, côté client)

### Modules par plan
| Plan | Modules autorisés |
|------|------------------|
| STARTER | dashboard, received, clients, reporting, compliance, settings |
| PRO | + quotes, export |
| BUSINESS | + invoices (création) |

### Règles critiques
- **TOUJOURS** utiliser `getEffectivePlan(artisan)` — jamais `artisan.plan` directement (planOverride)
- L'API key doit commencer par `inv_` — sinon le refresh-token auto-repair
- Le `NEXT_PUBLIC_INVOQUO_URL` permet de pointer sur l'Invoquo local en dev

---

## Plan enforcement

### Helpers
- `requireFeature(feature)` dans `auth-server.ts` — auth + artisan + plan check en une ligne
- `handleAuthError(e)` dans `api-response.ts` — gère UNAUTHORIZED, PLAN_REQUIRED, ARTISAN_NOT_FOUND
- `getEffectivePlan(artisan)` dans `plan-gates.ts` — max(stripePlan, planOverride)

### Endpoints protégés
| Endpoint | Feature | Plan min |
|----------|---------|----------|
| `/facturation/activate` | invoquo_reception | STARTER |
| `/facturation/refresh-token` | invoquo_reception | STARTER |
| `/artisans/me/rdv/*` | agenda | STARTER |
| `/artisans/me/disponibilites` | agenda | STARTER |
| `/artisans/me/devis-ia` | devis_ia | BUSINESS |
| `/artisans/me/seo-optimize` | agent_ia | BUSINESS |
| `/artisans/me/photos/upload` | photosMax (limit) | ALL |
| `/artisans/me/badges` | badgesMax (limit) | ALL |

---

## Déploiement

### Bativio
Les pushes GitHub déclenchent des builds Vercel CANCELED (root directory issue).
**Déployer via CLI :**
```bash
cd frontend
npm run build
find .next/cache -type f -size +50M -delete  # éviter erreur file size
npx vercel deploy --prod --yes
```

### Invoquo
Les pushes GitHub déploient automatiquement. Vérifier le build sur Vercel dashboard.
**Attention :** `useRef()` sans argument initial = erreur React 19. Toujours `useRef(undefined)`.

---

## PWA / Webapp

- `manifest.json` : `display: standalone`, `start_url: /dashboard`
- `viewport-fit: cover` pour iPhones avec encoche
- Safe-area padding sur la nav mobile
- `prefetch={false}` sur tous les liens sidebar/nav mobile (évite 20+ requêtes au chargement)

### Navigation mobile (barre bas)
Accueil | Demandes | Factures | Devis IA | Plus (→ Profil, Agenda, Vitrine, Photos, Abonnement, Paramètres)

---

## Villes actives (V1)

Chambéry, Annecy, Grenoble, Lyon, Valence

## Crons Vercel

- `/api/v1/cron/rappels-rdv` — tous les jours à 18h
- `/api/cron/relances` — tous les jours à 8h

---

## Workflow automatique après chaque modification UI

Après chaque modification d'un fichier .tsx, .jsx ou .html dans src/components ou app/ :
1. Vérifie l'accessibilité : contrastes WCAG AA, labels aria, focus clavier, touch targets ≥ 44px
2. Vérifie la performance : pas d'animations sans prefers-reduced-motion, pas de layout shift, images optimisées
3. Corrige automatiquement les problèmes trouvés sans demander
4. Lance npm run build pour vérifier que ça compile

Ne me demande PAS avant de corriger ces problèmes — fais-le automatiquement.
