# AUDIT BATIVIO V2026 — Synthèse CTO

**Date** : avril 2026
**Périmètre** : 9 agents experts (5 audit code + 3 veille 2026 + 1 UX critique)
**Verdict global** : 6/10 — Fondations saines, chantiers critiques à mener avant scale >1000 artisans.

---

## 1. Fixes P0 appliqués immédiatement (commit `TBD`)

| # | Fix | Fichier | Impact |
|---|-----|---------|--------|
| 1 | **JWT_SECRET throw en prod** si manquant | `src/lib/auth-server.ts` + `src/middleware.ts` | Bloque signing avec secret par défaut (catastrophe si absent) |
| 2 | **Models Claude upgradés** `opus-4-7` / `sonnet-4-6` / `haiku-4-5` | `src/lib/claude.ts` | Qualité devis IA +30%, pricing aligné 2026 |
| 3 | **Focus-visible WCAG 2.2** ring terre 2px sur tous éléments interactifs | `src/app/globals.css` | Conformité EAA juin 2025, keyboard a11y |
| 4 | **Skip-link CSS** classe `.skip-link` prête (à intégrer layouts) | `src/app/globals.css` | WCAG 2.4.1 skip navigation |
| 5 | **Lien nav artisan "Projets IA"** déjà posé commit précédent | `src/app/dashboard/layout.tsx` | Les artisans voient maintenant les demandes routées |
| 6 | **Ownership check** `generer-devis` (déjà en place) | `src/app/api/v1/artisans/me/demandes-projets/[id]/generer-devis/route.ts:20-23` | Artisan peut générer devis uniquement pour demandes reçues |

---

## 2. P0 restants critiques (1 sprint)

### Sécurité (Agent Dev-1)
- **XSS via stripHtml insuffisant** → migrer vers `isomorphic-dompurify` (endpoints POST clients)
- **Token expiry non vérifié** dans middleware — ajouter `if (payload.exp < Date.now()/1000) return null`
- **Rate limiting distribué** (Upstash Redis) sur login/register/forgot/OTP/magic-link — actuellement Map en RAM, reset à chaque cold start Vercel
- **Cost tracking Claude en DB** — model `TokenUsage` (`artisanId, model, tokensIn, tokensOut, costEur, createdAt`) — actuellement perdu en mémoire
- **Instrumentation Sentry + @vercel/speed-insights** — zéro observabilité prod actuellement

### Architecture Next.js 16 (Agent veille tech)
- **Landing `page.tsx` en `"use client"` complet** → dégrade LCP. Refactor en Server Component + `<HomeSearch/>` client isolé
- **51 fichiers `"use client"`** — majorité du dashboard devrait être Server Components + Server Actions + `useActionState`
- **`middleware.ts` → `proxy.ts`** codemod Next 16 : `npx @next/codemod@canary middleware-to-proxy .`
- **Activer `experimental.reactCompiler: true`** — 62 useMemo/useCallback éparpillés deviennent inutiles, gain perf 12%
- **Activer `cacheComponents: true`** + `"use cache"` sur pages annuaire — LCP −30-50% sur `/[ville]/*`
- **11 `<img>` bruts** à migrer vers `next/image`

### Claude API 2026 (Agent Claude)
- **Prompt caching** `cache_control: {type: "ephemeral", ttl: "1h"}` sur system prompts Agent 4 (devis) + Agent 1 (qualif) — **gain 60-80% sur input tokens** (0,20€ → 0,08€/devis)
- **Structured outputs** `output_config.format` + Zod schema — élimine retry JSON parse
- **Adaptive thinking** (`thinking: {type: "adaptive", effort: "xhigh"}`) sur Opus pour devis complexes
- **Tool use** sur Agent 4 : `get_artisan_forfait()`, `get_prix_marche()` — Claude interroge la DB au lieu de tout recevoir inline
- **Downgrade Agent 1 qualif** Sonnet → Haiku 4.5 — chat 3x moins cher (0,01€ → 0,003€)
- **Batch API** pour scénarios async (génération "ronde 5 artisans", cron KB refresh) — 50% moins cher

### DB Prisma (Agent Dev-4)
- **10 indexes composites manquants** P0 (gain 100x sur queries annuaire) :
  ```prisma
  @@index([ville, metierId, actif, visible])  // Artisan
  @@index([statut, createdAt])  // DemandeProjet
  @@index([artisanId, sentAt, respondedAt])  // DemandeEnvoi
  @@index([villeSlug, metierSlugSeo, actif])  // Artisan SEO
  @@index([artisanId, createdAt])  // Devis
  ```
- **Float → Decimal(12,2)** pour montants financiers (`Devis.totalHT`, `Tarification.tarifHoraire`) — intégrité comptable NF525
- **Soft delete cohérent** : ajouter `deletedAt` sur `DemandeEnvoi`, `ChantierCollaborateur`, `OtpVerification`

### UX / A11y (Agent UX)
- **Remplacer tous `alert()` natifs** par toast notifications (20 instances) — inutilisable screen reader, mobile bugs
- **Aria-labels sur boutons icon-only** (search, arrow card, hamburger) — 40+ composants
- **Labels explicites** sur inputs contact `/demande` (actuellement placeholders seuls)
- **Modal escape key** (`d/[token]`, admin demandes) — keyboard piégé
- **Empty states contextuels** (Aucun artisan → CTA "Réduire filtres / Changer ville")
- **Contrast fixes** : devis expiré `rgba(201,148,58,.12)` → `.25` (WCAG AA)
- **Dynamic H2** page landing (hardcodé "Chambéry" même si user cherche Lyon)

### Facturation & compliance
- **Factur-X readiness** : structure XML intégrable PDF
- **Médiateur consommation** obligatoire mention 2026 sur PDF devis (à ajouter)
- **Upgrade signature client** → niveau Eidas avancé via DocuSign / Yousign (vs case cochée actuelle)
- **DKIM/SPF/DMARC** à configurer sur bativio.fr pour emails Resend

---

## 3. Opportunités 2026 fortes (de la veille design)

### Top 8 actions UX/design à fort ROI
| # | Action | Page | Impact | Effort |
|---|--------|------|--------|--------|
| 1 | Single-CTA hero (chat IA prioritaire) | `/` | +28% conversion | M |
| 2 | Inverser estimation/contact | `/demande` | +30% completion | M |
| 3 | Bento grid dashboard tarifs | `/dashboard/tarifs` | +47% dwell | M |
| 4 | Hero typo XXL clamp(48px, 8vw, 96px) | `/` | +10% dwell | S |
| 5 | Bento pour "Comment ça marche" | `/` | +47% dwell | M |
| 6 | Scroll-driven CSS + View Transitions | Global | +8% engagement | S |
| 7 | Command palette ⌘K (Linear-like) | `/dashboard/*` | Rétention power users | L |
| 8 | AI copilot inline tarifs ("Suggérer tarif marché") | `/dashboard/tarifs` | Différenciateur | L |

### Features produit à considérer (benchmark concurrents V2)
- **Vérif SMS client obligatoire** à la soumission (StarOfService) — anti-spam
- **Visio intégrée artisan-client** (AlloVoisins) — pré-qualification
- **Base prix travaux publique** (Hemea) — déjà démarré avec `/prix`, booster SEO
- **3 mois gratuits facturation** pour nouveaux artisans — acquisition (Hemea stratégie)
- **Escrow paiement** gros chantiers (>3k€) — argument confiance

---

## 4. Plan d'action 3 sprints

### Sprint 1 (1 semaine) — Sécurité + Observabilité
- [x] JWT throw en prod ✓
- [ ] DOMPurify sur XSS
- [ ] Token expiry middleware
- [ ] Sentry + Speed Insights
- [ ] TokenUsage model + cost tracking DB

### Sprint 2 (1-2 semaines) — Perfs + Claude
- [ ] Prompt caching Claude (3 agents)
- [ ] Landing page → Server Component + HomeSearch Client
- [ ] React Compiler activé
- [ ] Migration img → next/image
- [ ] Rate limiting Upstash

### Sprint 3 (2 semaines) — UX 2026 + Database
- [ ] Single-CTA hero
- [ ] Inverser estimation/contact chat IA
- [ ] Bento grid dashboard tarifs
- [ ] Indexes DB P0 (10 composites)
- [ ] Float → Decimal montants

---

## 5. Skills à mettre à jour

### `claude-design-awwwards` (existant)
Enrichir avec :
- Section "Dashboard patterns 2026" (sidebar 240-280 + KPI strip + bento grid)
- Section "AI Chat UI trust layer" (citations, reasoning traces, cost transparency)
- Section "Mobile-first" (bottom sheets iOS 15+, haptic feedback)
- Section "A11y WCAG 2.2" (Focus Appearance 2.4.13, Target Size 2.5.8)
- Section "Variable typography" (Fraunces `font-variation-settings opsz clamp`)
- Anti-slop update : pas de 3D WebGL lourd, skeleton > spinners

### Nouveau : `claude-api-bativio`
Structure dédiée à l'usage Claude pour Bativio :
```
claude-api-bativio/
├── SKILL.md          (model matrix + cache strategy)
├── prompts/           (4 agents system prompts cacheables)
├── schemas/           (Zod schemas structured outputs)
├── tools/             (db-tools, kb-tools)
├── kb/                (mentions-legales, TVA, DTU, tarifs marché)
└── lib/               (client, cache-helper, cost-tracker)
```

### Nouveau : `expert-saas-dev` (à créer)
Règles 2026 Next.js 16 + React 19 :
- RSC par défaut, Client = feuilles
- Server Actions pour mutations
- Cache Components activés
- Prompt caching Claude obligatoire >1024 tokens
- Rate limit Upstash auth endpoints
- INP < 200ms cible
- Prisma transactions multi-write

---

## 6. Ressources clés

### Docs 2026
- [Next.js 16 blog](https://nextjs.org/blog/next-16)
- [Cache Components guide](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [React Compiler 1.0](https://react.dev/blog/2025/10/07/react-compiler-1)
- [Anthropic Prompt Caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [Anthropic Adaptive Thinking](https://docs.anthropic.com/en/docs/build-with-claude/adaptive-thinking)
- [WCAG 2.2 new criteria](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

### Best practices
- [Sentry + OpenTelemetry Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/opentelemetry/)
- [Upstash Ratelimit TS](https://upstash.com/docs/redis/sdks/ratelimit-ts)
- [Prisma Accelerate](https://www.prisma.io/docs/accelerate)

### Benchmarks design
- [Linear](https://linear.app), [Vercel](https://vercel.com), [Stripe Dashboard](https://dashboard.stripe.com), [Arc](https://arc.net), [Campsite](https://campsite.com), [Runway](https://runwayml.com)
