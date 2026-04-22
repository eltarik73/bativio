# Audit Tech & Sécurité Externe — Bativio

**Cabinet** : externe indépendant (angle blackbox + revue code)
**Date** : 22 avril 2026
**Périmètre** : bativio.fr + frontend/src (Next.js 16.2.1, Prisma 6.19, Railway PG)

---

## 1. Note globale : **6,2 / 10**

| Domaine | Note |
|---|---|
| Sécu transport (HSTS, TLS) | 9/10 |
| Security headers | 5/10 (CSP absent, COOP/COEP absents) |
| Auth JWT / session | 6,5/10 |
| API publique (rate-limit, size cap) | 3/10 |
| Prisma / injection | 9/10 |
| Stripe webhook | 8,5/10 |
| Dépendances / CVE | 7/10 |
| Next.js 16 hygiène | 7/10 |

**Verdict** : socle correct (TLS, HttpOnly cookie, bcrypt cost=12, Zod, webhook HMAC vérifié), mais **3 trous critiques** exploitables dès aujourd'hui : pas de CSP, rate-limit login en Map mémoire (bypass trivial sur Vercel multi-instance), et `size` non plafonné sur l'API publique artisans.

---

## 2. OWASP Top 10 2026 — verdict

| # | Risque | État |
|---|---|---|
| A01 Broken Access Control | OK — middleware vérifie JWT + rôle ADMIN sur `/admin/*` et `/api/v1/admin/*`. **Mais** : pas de vérif ownership dans le middleware (artisanId check délégué aux routes) — à auditer route par route. |
| A02 Cryptographic Failures | OK — HS256 via `jose`, bcrypt cost=12, HttpOnly+Secure+SameSite=Lax |
| A03 Injection | OK — 0 `$queryRaw`/`$executeRaw` dans `src/`, Prisma uniquement. Zod sur inputs. |
| A04 Insecure Design | **MOYEN** — JWT 7j sans rotation/refresh token, pas de révocation serveur (stateless only) |
| A05 Security Misconfiguration | **CRITIQUE** — pas de Content-Security-Policy, pas de COOP/COEP, CORS `access-control-allow-origin: *` observé sur root |
| A06 Vulnerable Components | À vérifier (Next 16.2.1 récent, Stripe 21, jose 6.2 OK) |
| A07 Auth Failures | **MOYEN** — rate-limit login en `Map` JS (cf. §7) |
| A08 Software/Data Integrity | OK — webhook Stripe HMAC vérifié (L17-25 route.ts) |
| A09 Logging | **FAIBLE** — `console.error` uniquement, pas de Sentry/DataDog en prod confirmé |
| A10 SSRF | À vérifier (siret API, Cloudinary upload signature) |

---

## 3. Security Headers HTTP — manquants

Observé sur `https://www.bativio.fr` :

| Header | État |
|---|---|
| `strict-transport-security` | OK (`max-age=63072000; includeSubDomains; preload`) |
| `x-frame-options` | OK (`DENY`) |
| `x-content-type-options` | OK (`nosniff`) |
| `referrer-policy` | OK (`strict-origin-when-cross-origin`) |
| `permissions-policy` | OK (camera, micro, geo=self) |
| **`content-security-policy`** | **ABSENT** — XSS non mitigé |
| **`cross-origin-opener-policy`** | **ABSENT** |
| **`cross-origin-embedder-policy`** | **ABSENT** |
| **`cross-origin-resource-policy`** | **ABSENT** |
| `access-control-allow-origin: *` | **PRÉSENT sur `/`** — à restreindre pour endpoints sensibles |

---

## 4. Exposition API publique

Endpoint `/api/v1/public/artisans` (route.ts) :

- **Aucun plafond sur `size`** : `parseInt(searchParams.get("size") \|\| "20", 10)` — un attaquant passe `size=100000` et dump la DB entière en 1 requête. Fix : `Math.min(size, 50)`.
- **Aucun rate-limit** sur l'endpoint public (middleware ne matche pas `/api/v1/public/*`).
- **PII retournée** : `telephone`, `description`, `ville`, `noteMoyenne`, `nombreAvis`, `plan`, `planOverride` (!). Le plan interne ne devrait PAS fuiter en public — fuite d'info business pour concurrents.
- `planOverrideExpireAt` exposé = fuite d'info sur les cadeaux admin.
- Scraping massif trivial (cf. test : `size=100000` renvoie 200 OK, 27 artisans car base petite, mais ne bloquera pas à 10k).

**Fixes** :
```ts
const size = Math.min(parseInt(searchParams.get("size") || "20", 10), 50);
// Retirer plan, planOverride, planOverrideExpireAt du select public
```

---

## 5. Next.js 16 — best practices

- ✓ App Router, `generateMetadata` présent sur pages publiques (à vérifier couverture)
- ✓ Server Components par défaut
- ✗ **Pas de `next.config.ts` headers()** — le CSP/COOP/COEP doit se configurer ici
- ✗ Pas de `revalidate` visible sur `/api/v1/public/artisans` — chaque hit DB. Ajouter `export const revalidate = 60` + tag Cache pour invalidation sur update artisan.
- ✓ Pas d'import Prisma dans Client Components (vérifié sur route.ts publique)

---

## 6. Prisma — sécurité

- ✓ **0 raw query** dans `src/` — 100% ORM, zéro surface injection SQL.
- ✓ Client singleton (`@/lib/prisma`).
- ✓ Pas de `RLS` Postgres (stratégie applicative) — cohérent mais nécessite **tests d'autorisation par route** (risque IDOR si un dev oublie `where: { userId: session.userId }`).
- ⚠ `soft-delete` via `deletedAt` : vérifier que TOUTES les queries publiques filtrent `deletedAt: null` (OK sur artisans/route.ts L22).

---

## 7. Auth JWT cookie HttpOnly — audit critique

**Positif** :
- HS256 via `jose`, HttpOnly + Secure + SameSite=Lax + Path=/
- Bcrypt cost=12 (OWASP 2024 ≥ 10, bon)
- Middleware bloque `/dashboard`, `/admin`, `/api/v1/artisans`, `/api/v1/admin`
- Soft-delete check au login (L58)

**Problèmes** :
1. **Rate-limit login en `Map` JS** (L12, route.ts) : sur Vercel (functions stateless, multi-instance), un attaquant qui spray sur plusieurs régions **bypasse entièrement** la limite de 10/15min. Fix : Upstash Redis ou Vercel KV.
2. **JWT 7j sans refresh token** : vol de cookie = 7j d'accès. Fix : access token 15min + refresh token rotation, ou stockage session DB avec révocation.
3. **Pas de CSRF token** : SameSite=Lax protège les navigateurs modernes mais ne couvre PAS les requêtes GET état-modifiantes. Audit nécessaire.
4. **JWT_SECRET fallback `"dev-secret-change-in-production"`** (auth-server.ts L8) : le throw en prod est OK, mais le fallback string est toujours compilé dans le bundle edge — risque si NODE_ENV mal détecté.
5. Pas de **fingerprinting** session (user-agent/IP hash dans JWT) — un cookie volé est utilisable partout.

---

## 8. Stripe webhook — vérification

Route `/api/v1/stripe/webhook` (webhook/route.ts) :
- ✓ `stripe.webhooks.constructEvent(body, sig, secret)` — signature HMAC vérifiée (L17-25)
- ✓ `request.text()` utilisé (raw body, indispensable sinon HMAC échoue)
- ✓ 400 si signature absente/invalide
- ⚠ `process.env.STRIPE_WEBHOOK_SECRET \|\| ""` : fallback string vide permettrait un bypass en dev si variable non set. Fix : `if (!secret) throw`.
- ⚠ Pas de **déduplication `event.id`** : Stripe peut rejouer un event. Risque : double upgrade de plan. Fix : table `stripe_events_processed` avec unique sur event.id.
- ⚠ Pas de timeout/retry logic sur les `prisma.update` — un update échoué retourne 200 OK à Stripe (L115 return OK même si catch).

---

## 9. Dépendances

```
next@16.2.1            OK (récent)
react@19.2.4           OK
prisma@6.19.2          OK
stripe@21.0.1          OK
jose@6.2.2             OK (pas de CVE connue)
bcryptjs@3.0.3         OK
zod@4.3.6              OK
@anthropic-ai/sdk 0.90 OK
```

À lancer : `npm audit --production` (non effectué en blackbox).

---

## 10. TOP 10 FIXES P0 — à faire CETTE SEMAINE

| # | Fix | Effort | Impact |
|---|---|---|---|
| 1 | **Plafonner `size` à 50** dans `/api/v1/public/artisans` (+ tous endpoints publics) | 15 min | Bloque scraping massif |
| 2 | **Retirer `plan`, `planOverride*`, `telephone`** du payload public artisans | 30 min | Stop fuite PII + info business |
| 3 | **Migrer rate-limit login → Vercel KV / Upstash Redis** | 2h | Vrai brute-force protection |
| 4 | **Ajouter Content-Security-Policy** dans `next.config.ts` via `headers()` (`default-src 'self'`, script-src avec nonce, img-src cloudinary + unsplash) | 2h | Mitige XSS |
| 5 | **Déduplication `event.id` Stripe** (table `StripeEventLog` avec unique) | 1h | Stop double facturation |
| 6 | **Rate-limit global** `/api/v1/public/*` (100 req/min/IP via middleware + KV) | 2h | Stop DoS applicatif |
| 7 | **Sentry + source maps** en prod (capturer `console.error` login/webhook) | 1h | Observabilité incidents |
| 8 | **Refresh token rotation** (access 15min + refresh 7j en DB avec révocation) | 1 journée | Limiter fenêtre vol cookie |
| 9 | **Retirer `access-control-allow-origin: *`** sur `/` (probable fuite Vercel default) — whitelister `bativio.fr` + `invoquo.vercel.app` | 30 min | Stop CORS permissif |
| 10 | **Ajouter COOP/COEP/CORP headers** + `npm audit --production` + GitHub Dependabot activé | 1h | Isolation iframe + CVE monitoring |

**Coût total** : ~2 jours dev pour passer de **6,2/10 → 8,5/10**.

---

## Annexe — tests blackbox effectués

- `curl -sI https://www.bativio.fr` → HSTS OK, CSP absent
- `GET /api/v1/public/artisans?size=100000` → 200 OK (bypass pagination)
- `GET /.env`, `/.git/config`, `/package.json` → 200 HTML (page `[ville]` catch-all, pas d'exposition, OK)
- `GET /api/v1/stripe/webhook` → 405 (POST only, OK)
- `GET /api/v1/admin` → redirection `/connexion` (middleware OK)
- `curl -H "Origin: https://evil.com"` → pas de reflet CORS sur endpoint API (OK)
