# Phase 0 — Contexte Bativio

**Date audit** : 2026-04-26
**URL prod** : https://www.bativio.fr
**Repo** : github.com/eltarik73/bativio
**Branche** : claude/sharp-meninsky-5e0ca8 (mergée dans main)

## Stack RÉELLE (correction du prompt)

- **Frontend/Backend** : Next.js 16.2.1 (App Router) + React 19 + TypeScript strict
- **DB** : PostgreSQL sur Railway via Prisma 6.19
- **Auth** : JWT cookie HttpOnly (jose + bcryptjs) — **PAS Clerk**
- **Paiements** : Stripe (intégré pour abos artisan)
- **Hébergement** : Vercel (CLI deploy)
- **Images** : Cloudinary (signed uploads)
- **Emails** : Resend
- **SMS** : OVH
- **IA** : Anthropic Claude Opus 4.7 + Sonnet 4.6 + Haiku 4.5

**PAS de Spring Boot** (le prompt utilisateur s'est trompé). Tout est en Next.js full-stack.

## Baseline DB (production Railway)

```json
{
  "artisans_actifs": 10,
  "artisans_total": 11,
  "metiers": 29,
  "villes": 5,
  "catalogue": 500,
  "devis": 3,
  "devis_acceptes": 1,
  "demandes": 6,
  "tokenLogs": 15,
  "photos": 10,
  "users": 11,
  "admins": 1
}
```

**Plans artisans actifs** : 1 BUSINESS, 2 PRO, 1 PRO_PLUS, 1 STARTER, 1 ESSENTIEL, 4 GRATUIT.

## Comptes test disponibles

- **Admin** : admin@bativio.fr / Admin1234!
- **Artisan PRO** : plombier.test@bativio.fr / Test1234! (Dubois Plomberie, Lyon)
- **Artisan STARTER** : peintre.test@bativio.fr / Test1234! (Martin Peinture, Annecy)
- **Artisan BUSINESS** : electricien.test@bativio.fr / Test1234! (Savoie Electric Pro, Chambéry)

## Features Bativio actuelles (recensées)

### Côté client
- Annuaire par ville (5 villes : Chambéry, Annecy, Grenoble, Lyon, Valence)
- Pages métier-ville composites (50 combos) — SSG
- Vitrines artisan avec 4 templates (classique, moderne, portfolio, business)
- Demande devis classique (formulaire vitrine)
- **Demande projet IA** : chat IA qualif → estimation immédiate → routage admin
- Page devis publique signature `/d/[token]`
- Bandeau cookies CNIL conforme

### Côté artisan
- Dashboard : tableau de bord, planning, profil, vitrine, photos
- **Demandes directes** (depuis vitrine artisan)
- **Demandes Bativio** (routées par admin depuis chat IA client)
- Mes tarifs (forfaits + tarif horaire + multi-métiers)
- **Devis IA** (Business only) — génération devis Opus 4.7 avec prompt caching
- Facturation électronique (Invoquo en iframe embed)
- Mon abonnement (Stripe)
- Paramètres

### Côté admin
- Dashboard : 4 stats + répartition plan/ville
- Demandes projets (routage manuel vers artisans)
- Artisans (CRUD)
- Villes (CRUD + SEO content)
- Métiers (CRUD)
- Contenu SEO
- Abonnements
- Validations KYC
- Statistiques
- **Coûts IA** (token tracking par agent/modèle/artisan)
- Newsletter (subscribers)
- Paramètres

### Backend
- 500 prestations BTP catalogue (10 métiers × 50)
- 3 agents IA Claude :
  - Qualif (Sonnet 4.6) — chat conversationnel client
  - Pre-devis (Sonnet 4.6) — estimation indicative
  - Devis (Opus 4.7) — génération devis détaillé avec prompt caching
- Cost tracking complet (TokenUsage table avec cache_read/creation)
- Email automation (Resend) sur 14 events
- SMS (OVH) sur urgences
- 16 mentions légales 2026 PDF (LCEN + Article 242 nonies A)

## Audits déjà effectués (historique branche)

1. ✅ 30 bugs identifiés + corrigés (XSS, photos placeholder, etc.)
2. ✅ Audit SEO 2026 (Schema spécifique, BreadcrumbList, FAQPage, robots IA, /a-propos E-E-A-T)
3. ✅ Tests grandeur nature E2E (parcours client → admin → artisan → signature)
4. ✅ 40 tests unitaires (vitest)
5. ✅ Cost tracking + prompt caching (gain -42% Opus)
6. ✅ HTTP 404 propre via middleware whitelist

## Concurrence à benchmarker (10 sites)

1. habitatpresto.com
2. travaux.com
3. ManoMano Pro (pro.manomano.fr)
4. IZI by EDF (izi-by-edf.fr)
5. allovoisins.com
6. mesdepanneurs.fr
7. lamaisonsaintgobain.fr
8. bobex.fr
9. 123devis.com
10. quotatis.fr

## Mission audit (4 phases)

- **Phase 1** : Tests E2E live Bativio (déjà fait + à compléter sur photos / mobile / PDF)
- **Phase 2** : Benchmark concurrence (recherche web sur features publiques)
- **Phase 3** : 3 audits croisés (UX / Business / Tech)
- **Phase 4** : Synthèse CTO avec roadmap 90j

## Limites assumées

- **Création comptes concurrents** : limitée (besoin emails/téléphones, captcha, KYC). Audit basé sur navigation publique + screenshots vitrines + recherches web.
- **Stress test photos** : Bativio actuel a peu de vraies photos (10 en DB, beaucoup d'artisans test). Tests sur les vrais artisans existants + simulation upload.

