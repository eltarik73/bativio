# Session 30 avril 2026 — Deploy massif SEO + GEO 2026

Session marathon Claude Code : audit complet (Search Console + 4 audits
"investisseur/dev/client/lambda" + veille SEO/GEO 2026) → 14 commits
de fixes → merge + déploiement Vercel + migration Prisma.

## Résultat

- **PR [#1](https://github.com/eltarik73/bativio/pull/1)** mergée sur `main` (commit `43e71b0`)
- **Vercel deploy production** : `dpl_Ex7C7RVV9pXrBKBmR3qgEXQK3qui` READY
- **Table `rate_limits`** créée en prod (Railway PostgreSQL)
- **Branche** `claude/jolly-northcutt-afea33` supprimée (clean)
- **Tests** : 0 → 29 (21 unit XSS + 8 smoke API), 21/21 pass
- **CI** GitHub Actions vert sur 7 vagues consécutives
- **Lint** : 75 → 53 problems (−22)
- **+2 052 lignes / −319 lignes** (52 fichiers)

## Vérifié live sur https://www.bativio.fr (30 avr ~11h UTC)

```
GET /tarifs        → 1 H1 (était 0)            ✅
GET /chambery      → 745 mots (était 310)      ✅
GET /chambery      → 5 FAQ <details>           ✅
GET /llms.txt      → 200 OK, 3517 bytes        ✅
GET /robots.txt    → CCBot autorisé            ✅
/mentions-legales  → KLIKPHONE × 2             ✅
/mentions-legales  → "Bouzeggou" × 0           ✅
DB rate_limits     → table existe (0 rows)     ✅
```

## Audit Search Console (état 30 avril 2026)

- Propriété créée 27/04/2026 (3 jours d'historique)
- **18 pages indexées / 264 non indexées** (6,4 % index)
- 239 pages "Détectée non indexée" (sitemap soumis trop récemment)
- 21 pages "Explorée non indexée" (contenu jugé faible — densification a fixé /chambery)
- Performance 3 mois : 1 clic / 8 impressions / **position moyenne 36,4** (page 4)
- Crawl : 14,6k requêtes / 90j, **TTFB 250 ms** (excellent)
- 0 actions manuelles, 0 problèmes sécurité
- HTTPS : 11/11 OK
- FAQPage : 2 valides, Fils d'Ariane : 19 valides
- Liens : "données en cours" (site trop jeune)

## Positionnement (DDG / Bing — Google captcha)

| Requête | Position Bativio |
|---|---|
| "bativio" (brand) | **#1** ✅ |
| "plombier chambéry 73" | ABSENT top 15 ❌ |
| "electricien annecy" | ABSENT top 13 ❌ |
| "facturation electronique artisan 2026" | ABSENT top 10 ❌ |

## Identité légale corrigée

**Audit API officielle data.gouv.fr (INSEE/RCS) :**
- ❌ SIREN annoncé `932 458 712` : **n'existe pas** dans le registre
- ❌ Dirigeant "Tarik Bouzeggou" : **introuvable**
- ✅ Vraie société : **KLIKPHONE SAS** (SIREN `813 961 141`), Chambéry
- ✅ Vrai dirigeant : **TARIK BOUDEFAR**

Mentions légales corrigées avec valeurs vérifiées. À finaliser
définitivement (Tarik a indiqué "ça va bientôt changer" — possible
création SAS BATIVIO dédiée).

## Vagues de commits

| Vague | Commit | Sujet | Impact |
|---|---|---|---|
| 0 | d980cc1 | photos AVANT/APRÈS + plan effectif | Bug critique |
| 0 | f930579 | Sécurité + 29 tests + GH Actions CI | Fondations |
| 1 | ef2a2b6 | H1 tarifs + VilleSeoSection (821 mots) | SEO villes |
| 1 | 4c8300f | GEO + 10 bots IA + E-E-A-T + mentions corrigées | IA + auth |
| 1 | e83dba6 | Capsules /maprimerenov + /urgence + author Person | E-E-A-T guides |
| 1bis | 0dfc0b8 + 9dc81ea | Fix CI lint + dummy env vars | Build green |
| 2 | e3309e3 | Schema Service+LocalBusiness + 2 capsules | 140 pages |
| 3 | a460429 | HowTo guides + fix Boudefar partout | Rich results |
| 4 | 1150cdb | Sweep lint + Link pages publiques | Perf nav |
| 5 | aa07ce7 | Preconnect Cloudinary + sitemap lastmod réaliste + ItemList /metiers | Perf + signal |
| 6 | 3385aaa | ContactPage + Article comparatifs (5 pages) | Money pages |
| 7 | 5d63bd3 | Article+OfferCatalog /prix/[metier] + Service /travaux/[slug] + cleanup | 40 pages |

## Schémas JSON-LD livrés (15 types Schema.org)

`Organization` E-E-A-T, `Person` (founder), `WebSite`, `WebPage`,
`AboutPage`, `ContactPage`, `CollectionPage`, `Article`, `HowTo`,
`FAQPage`, `BreadcrumbList`, `ItemList`, `Service`, `LocalBusiness`,
`OfferCatalog` + `PriceSpecification`, `OpeningHoursSpecification`,
`ContactPoint`, `PostalAddress`, `GeoCircle`.

## Pages avec JSON-LD enrichi

| Type | Volume |
|---|---|
| Pages publiques avec schema dédié | ~25 |
| Pages /[ville]/[metier] (Service + Capsule + ItemList) | 140 |
| Pages /[ville]/[slug] artisan (LocalBusiness enrichi) | dynamique |
| Pages /prix/[metier] (Article + OfferCatalog) | 28 |
| Pages /travaux/[slug] (FAQPage + Service) | 12 |
| Pages /comparatif/[slug] (Article + about) | 5 |
| Pages /guides/[slug] (Article + HowTo si numéroté) | 3 |
| **Total estimé** | **~210+ pages indexables avec JSON-LD riche** |

## Robots IA explicitement autorisés (10 user-agents)

| Famille | Bots |
|---|---|
| OpenAI | `GPTBot`, `ChatGPT-User`, `OAI-SearchBot` |
| Anthropic | `ClaudeBot`, `Claude-Web`, `anthropic-ai` |
| Google | `Google-Extended`, `GoogleOther` |
| Apple | `Applebot-Extended` |
| Perplexity | `PerplexityBot`, `Perplexity-User` |
| Common Crawl (Mistral, Llama) | `CCBot` |
| Meta AI | `Meta-ExternalAgent`, `FacebookBot` |
| TikTok / Doubao | `Bytespider` |
| Bloomberg / Grok | `Diffbot` |
| You / Phind / Cohere / Mistral | `YouBot`, `PhindBot`, `cohere-ai`, `Mistralai-User` |

Bloqués : `AhrefsBot`, `SemrushBot`, `MJ12bot`, `DotBot`, `PetalBot`.

## Answer Capsules GEO 2026 (8 pages + 1 pattern)

40-60 mots, auto-suffisants, citables par ChatGPT/Claude/Perplexity/
Gemini/Grok :
- `/tarifs`, `/facturation-electronique`, `/maprimerenov`, `/urgence`
- `/prix`, `/rejoindre`, `/metiers`
- Pattern dynamique sur les 140 pages `/[ville]/[metier]` (composant
  `MetierVillePage.tsx`)

## llms.txt

Servi sur https://www.bativio.fr/llms.txt (3 517 octets) avec :
- Identité éditoriale (KLIKPHONE SAS, fondateur Tarik Boudefar, dateModified)
- Pages clés à citer
- Annuaire par ville
- Métiers couverts
- Comparatifs concurrence
- Règles d'usage explicites pour les LLMs

## Sécurité

- `JWT_SECRET` fail-fast sans fallback (auth-server.ts, middleware.ts)
- Rate-limit DB-backed avec fallback RAM (`src/lib/rate-limit.ts`)
- `sanitizeAdminHtml` whitelist token-based (21 tests XSS)
- Zod strict sur réponses Claude IA (devis-ia + scoring)

## Restant côté business (non-code)

1. **Demande indexation manuelle GSC** demain (1er mai 2026, quota frais
   à minuit UTC) — 9 URLs prioritaires :
   - `/chambery/plombier`, `/chambery/electricien`
   - `/annecy/plombier`, `/annecy/electricien`
   - `/grenoble/plombier`, `/lyon/plombier`, `/valence/plombier`
   - `/metiers` (nouveau Schema ItemList)
   - `/contact` (nouveau Schema ContactPage)
2. **Bing Webmaster Tools** : `bing.com/webmasters` → import GSC en
   1 clic. Débloque trafic Bing + DuckDuckGo + ChatGPT Search
   (Bing-powered).
3. **Sourcing 5-10 artisans réels par ville V1** (Chambéry, Annecy,
   Grenoble, Lyon, Valence) — débloque les 21 pages "Explorée non
   indexée" qui jugent contenu faible.
4. **Backlinks** : CAPEB Savoie/Haute-Savoie, Dauphiné Libéré, Reddit
   `r/AutoEntrepreneur` / `r/france`. Effet sur le crawl budget Google
   et l'autorité.
5. **Finaliser identité légale** : choisir entre KLIKPHONE 813961141
   (le plus actif) et MACXIPHONE 894608322 dans les mentions, ou
   créer SAS BATIVIO dédiée.

## Note pour le prochain audit

Pour mesurer l'impact réel des changements, attendre **2-3 semaines** :
- Google met du temps à re-évaluer (Helpful Content + Information Gain)
- Perplexity / ChatGPT Search re-indexent en 24-48 h
- Gemini suit Google
- Claude favorise les sources autoritaires (donc backlinks comptent)

Refaire un `site:bativio.fr` + 4 audits "investisseur/dev/client/lambda"
fin mai pour comparer.

## Auteur

Session menée en autonomie par Claude Code (Opus 4.7). Prompts
"attaque", "go", "continue" du fondateur Tarik Boudefar (KLIKPHONE SAS).
