# Stratégie SEO Bativio — Architecture finale

> Document de référence post-livraison ETAPE-SEO-01 à 06.
> Dernière mise à jour : 28 avril 2026.

---

## 1. Vision SEO

Bativio cible **2 audiences distinctes** avec des architectures URL séparées :

| Audience | Intent | Cluster URL | Type contenu |
|---|---|---|---|
| **A. Clients finaux** (particuliers) | Trouver un artisan local | `/[ville]`, `/[metier]-[ville]`, `/artisans-[slug]`, `/travaux/...` | Annuaire + descriptions de travaux |
| **B. Artisans** (B2B) | Comprendre la réforme 2026 + se référencer | `/pro/*`, `/inscription`, `/tarifs` | Guides + comparatifs + glossaire |

**Pas de mélange entre les 2 clusters.** Un artisan qui cherche "facturation électronique" arrive sur `/pro/facturation-electronique-2026`, pas sur `/lyon`.

---

## 2. Architecture URL complète

### Cluster A — Audience clients finaux (~270 pages)

```
/                                       Homepage (SEO 100/100)
/[ville]                                Annuaire ville hub (5 villes : Chambéry, Annecy, Grenoble, Lyon, Valence)
/[ville]/[slug]                         (a) Listing métier-ville hub : /chambery/plombier (40 pages = 5 villes × 8 métiers)
                                        (b) Vitrine artisan : /chambery/plomberie-dupont
/[metier]-[ville]                       Listing métier × ville secondaire : /electricien-aix-les-bains (140 pages)
/artisans-[slug]                        Hub géographique : /artisans-chambery, /artisans-aix-les-bains... (40 villes)
/artisans-[departement]                 Hub département : /artisans-savoie (5 départements)
/artisans-rhone-alpes                   Hub région
/travaux/[slug]                         Pages travaux génériques (12 types)
/travaux/[slug]/[ville]                 Pages travaux × ville (60 pages)
/prix                                   Base tarifaire 250 prestations
/prix/[metier]                          Tarifs par métier
/tarifs                                 Plans Bativio
/facturation-electronique               Landing facturation
/[ville]/[slug]                         Vitrines artisans (dynamiques selon DB)
```

### Cluster B — Audience artisans B2B (~11 pages)

```
/pro                                    Landing Bativio Pro
/pro/facturation-electronique-2026      Pilier réforme (3000 mots)
/pro/plateforme-agreee-artisan          Pilier choix PA (2200 mots)
/pro/comparatif-pa                      Comparatif 9 PA (3000 mots)
/pro/facture-electronique-btp           Pilier spécificités BTP (2500 mots)
/pro/mentions-obligatoires-2026         Pilier mentions (1800 mots)
/pro/glossaire                          22 termes + DefinedTermSet
/pro/sanctions-facturation-electronique Satellite sanctions (1700 mots)
/pro/factur-x-artisan                   Satellite Factur-X (2000 mots)
/pro/devis-electronique-artisan         Satellite devis (1800 mots)
/pro/auto-entrepreneur-batiment-2026    Satellite micro-entreprise (1800 mots)
```

**Total contenu cluster /pro/ : ~22 000 mots**

### Pages support

```
/inscription, /connexion                Onboarding (noindex)
/dashboard/*, /admin/*                  App authentifiée (noindex)
/mentions-legales, /cgu                 Légal
/a-propos                               À propos
/rejoindre                              Recrutement équipe
/sitemap.xml, /robots.txt               SEO infra
/icon.svg, /favicon.svg                 Branding
```

---

## 3. Maillage interne

### Principes
- **Hub-spoke** : chaque ville / métier-ville / hub département / hub région se lient mutuellement
- **Cluster pro** : la landing /pro link vers les 4 piliers + 1 comparatif + 1 glossaire + 4 satellites. Chaque page link vers 4-5 autres du cluster.
- **Footer global** : top 5 villes + top 5 métiers + 5 départements + lien région + lien Bativio Pro
- **Géo-voisinage** : page `/artisans-chambery` link vers les 6 villes les plus proches (Haversine via `lib/seo/cities-graph.ts`)

### Garde-fous anti-cannibalisation
- `/lyon` (annuaire client) ≠ `/artisans-lyon` (hub géo SEO) ≠ `/pro` (cluster B2B). 3 pages distinctes avec contenu distinct.
- Canonical strict sur chaque URL pour éviter duplicate.
- `dynamicParams = false` sur les routes statiques pour 404 propre des slugs inconnus.

---

## 4. Schema.org (rich snippets)

| Type | Sur | Usage |
|---|---|---|
| `Organization` | Layout root + /pro | Identité Bativio |
| `WebSite` + `SearchAction` | Homepage | Boîte de recherche dans SERP |
| `LocalBusiness` (Plumber, Electrician, HousePainter) | Vitrines artisans | Profil artisan |
| `AggregateRating` | Vitrines avec avis | Étoiles dans SERP |
| `BreadcrumbList` | Toutes les pages | Fil d'Ariane SERP |
| `CollectionPage` | Hubs ville/dept/région | Type de page |
| `Service` | Pages métier-ville | Service géolocalisé |
| `FAQPage` | 11+ pages /pro/, vitrines, métier-ville | FAQ rich snippets |
| `Article` | 9 pages /pro/* | Articles informationnels |
| `SoftwareApplication` + `Offer` | /pro | Plans Bativio (Gratuit/Starter/Pro/Business) |
| `DefinedTermSet` + `DefinedTerm` | /pro/glossaire | Rich glossaire |
| `Place` / `AdministrativeArea` / `City` | Hubs géo | Géolocalisation |

---

## 5. Sitemap & robots

### Sitemap (sitemap.xml)
- **Format** : Next.js `app/sitemap.ts` (auto-généré)
- **URLs** : ~339 (ETAPE-SEO-06)
- **Priorities** :
  - 1.0 : homepage
  - 0.9 : /pro/ landing + 4 piliers + métier-ville composites Business
  - 0.8 : hubs villes + dept + région + comparatif PA + glossaire
  - 0.7 : pages métier-ville + travaux + satellites /pro/
  - 0.6 : pages locales métier × ville secondaire
  - 0.5 : vitrines artisans
- **changeFrequency** : weekly pour pages dynamiques, monthly pour /pro/, yearly pour mentions légales

### robots.txt
- `Allow: /` par défaut
- `Disallow:` `/dashboard/`, `/admin/`, `/api/`, `/connexion`, `/inscription`, `/onboarding/`, `/devis/`, `/d/`
- `Sitemap: https://www.bativio.fr/sitemap.xml`
- LLM-friendly : GPTBot, ClaudeBot, PerplexityBot explicitement Allow

### IndexNow
- Clé publiée `/6ab466157ac9113f93d3eeabc14451aa.txt`
- Auto-trigger sur changements artisan (`POST /artisans/me`, `POST /admin/validations/.../approve`)
- Notifie Bing en moins d'1h

---

## 6. Procédures opérationnelles

### Ajouter une nouvelle ville (5 étapes)

1. **`src/lib/constants.ts`** : ajouter dans `VILLES` (hub) ou `VILLES_SECONDAIRES` (avec `parentSlug` du hub le plus proche)
2. **`src/proxy.ts`** : ajouter le slug dans `ALL_VILLES_SLUGS` + dans `KNOWN_VILLES` si hub
3. **`src/lib/seo/cities-content.ts`** *(optionnel mais recommandé)* : ajouter une entrée dans `CITY_CONTENTS` avec `introText` unique 200-300 mots
4. **Build + deploy** : les routes `/artisans-[slug]`, `/[metier]-[ville]`, `/travaux/[slug]/[ville]` se génèrent automatiquement via `generateStaticParams`
5. **Notifier IndexNow** : le sitemap se met à jour automatiquement, GSC re-crawlera dans 24-48h. Pour accélérer Bing : `node` script qui appelle `notifyIndexNow()`.

### Ajouter un nouvel article /pro/

1. Créer le fichier `src/app/pro/{slug}/page.tsx` en s'inspirant des satellites existants (sanctions, factur-x, devis)
2. Inclure : metadata complet (title 50-60 chars, description 140-160 chars), JSON-LD Article + FAQPage + BreadcrumbList, breadcrumb visible, sommaire ancres si > 1500 mots, encadré "À lire aussi" en bas
3. Ajouter le lien dans `src/app/pro/layout.tsx` (`NAV_PRO` array)
4. Ajouter l'URL dans `src/app/sitemap.ts` (`proPages` array, priority 0.7-0.8 selon importance)
5. Ajouter des liens contextuels dans 2-3 autres pages /pro/ existantes pour le maillage

---

## 7. KPIs à monitorer

### Acquisition organique
- **Positions** sur les 30 mots-clés cibles définis dans `seo-audit/scripts/keywords.json`
- **Impressions GSC** par page (suivre `/lyon`, `/chambery`, `/pro/facturation-electronique-2026` en priorité)
- **CTR moyen** SERP (cible : > 5 % pour les pages position 1-3, > 2 % pour 4-10)
- **Pages indexées** dans GSC (cible : > 250 / 339 dans les 60 jours)

### Comportement
- **Bounce rate** par cluster (clients vs artisans)
- **Time on page** sur les pages /pro/ (cible : > 2 min sur les piliers)
- **Scroll depth** sur les longs articles (rich data Vercel Analytics)

### Conversion
- **Taux conversion devis** sur les pages métier-ville (cible : > 2 %)
- **Taux inscription artisan** sur /pro/ + /tarifs (cible : > 1 %)
- **Demandes de devis B2C** par mois (cible : > 50 dans les 90 jours)

### Outils
- **Google Search Console** (positions, impressions, indexation)
- **Bing Webmaster Tools** (10 % du trafic FR)
- **Vercel Analytics + Speed Insights** (Web Vitals temps réel)
- **`npm run seo:audit`** mensuel (check régression technique)

---

## 8. Roadmap post-livraison

### Court terme (M+1)
1. Resoumettre sitemap GSC + Bing
2. Demander indexation manuelle de 10 pages clés (homepage, 5 villes, /pro, 3 piliers)
3. Créer Google Business Profile pour Bativio (entreprise)
4. S'inscrire Pages Jaunes Pro, Manageo, Société.com (backlinks gratuits DA 50+)

### Moyen terme (M+2 à M+3)
5. Backlinks ciblés : CMA Auvergne-Rhône-Alpes, CCI Lyon, Le Progrès, Le Dauphiné Libéré
6. Production contenu mensuel : 2 articles /pro/ par mois (cible : 24 articles à M+12)
7. Surveillance hebdomadaire des 30 mots-clés cibles (via GSC ou outil tiers SE Ranking)
8. Premiers partenariats fournisseurs régionaux (Point.P, Brico Dépôt, Doras) : échange de visibilité

### Long terme (M+4 à M+12)
9. Extension à d'autres régions (Auvergne, PACA, Occitanie) via le même framework `lib/seo/cities-content.ts`
10. Pages comparatives concurrents (Bativio vs Pages Jaunes, vs Travaux.com) — long tail comparatif
11. Module avis structurés (Schema.org `Review`) sur les vitrines artisans
12. Refonte sitemap en multi-fichiers (sitemap-index + 4 sub-sitemaps) si > 5000 URLs

---

## 9. Limites connues / dette technique

- **`/prix/plombier`** : H1 manquant + title trop long (legacy non touché par les sprints SEO)
- **Sitemap unique** : actuellement 339 URLs, sous la limite 50k. Découper en multi-sitemap quand on dépassera 5000 URLs.
- **PageSpeed Insights API** : sans clé `PAGESPEED_API_KEY`, throttle à 1 req/sec (HTTP 429 fréquent). Créer une clé gratuite sur Google Cloud Console pour avoir les Web Vitals dans les audits.
- **Hreflang** : seulement `fr-FR + x-default`. Préparer multi-langue si extension internationale.
- **Pas de pagination** sur les listings métier-ville (max ~20 artisans actuellement). À implémenter avec `<link rel="prev/next">` quand un listing dépassera 20 cards.

---

## 10. Versions livrées

| Étape | Date | Pages créées | Mots produits | Score audit |
|---|---|---|---|---|
| ETAPE-SEO-AUDIT-01 | 2026-04-27 | 0 (infra) | 0 | 40/100 (état initial) |
| ETAPE-SEO-02 (corrections on-page) | 2026-04-27 | 0 (fix) | ~1500 enrichis | 97/100 |
| ETAPE-SEO-03 (hubs géo) | 2026-04-27 | 46 | ~5000 | 97/100 |
| ETAPE-SEO-04 (cluster /pro/ landing + 4 piliers) | 2026-04-27 | 5 | ~11000 | 94/100 |
| ETAPE-SEO-05 (comparatif + glossaire + 4 satellites) | 2026-04-27 | 6 | ~12500 | 94/100 |
| ETAPE-SEO-06 (extension géo + finalisation) | 2026-04-28 | 0 (consolidation) | ~3000 introTexts | 94/100 |
| **TOTAL** | — | **57 pages SEO + base** | **~33 000 mots** | **94-97/100** |

---

_Ce document est maintenu à jour par l'équipe Bativio. Toute évolution majeure de l'architecture SEO doit être reflétée ici._
