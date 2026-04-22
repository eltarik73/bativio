# Audit technique Bativio — Review staff-level

Review externe, ton direct, aucun contentement.
Repo : `frontend/` (Next.js 16.2.1, React 19.2.4, Prisma 6.19, TS strict, Tailwind v4).

---

## 1. Note technique globale : **5,5 / 10**

Projet jeune, dette déjà lourde. Stack moderne bien choisie, mais sous-exploitée. Trois signaux critiques : **auth incohérent** (cookie HttpOnly côté serveur + Bearer/localStorage côté client qui viole explicitement la règle de `CLAUDE.md`), **landing 100 % client** qui tue le SSR et le SEO du point d'entrée principal, et **zéro test automatisé** (aucun Vitest/Jest/Playwright). On sent une app poussée vite en prod, pas une app pensée pour durer 3 ans.

---

## 2. Usage Next.js 16

- **Server Components** : sous-exploités. `app/page.tsx` (landing) est `"use client"` complet : on ré-hydrate motion, sessionStorage, `fetch` client d'artisans, alors que tout peut être servi en RSC. **73 fichiers** déclarent `"use client"` — beaucoup sont des pages entières qui devraient être des Server Components avec un composant client enfant.
- **generateMetadata** : seulement **4 occurrences** (`[ville]/page.tsx`, `[ville]/[slug]/page.tsx`, `travaux/[slug]`, `prix/[metier]`). Les pages publiques `/tarifs`, `/facturation-electronique`, `/demande`, `/artisan`, `/rejoindre` n'ont pas de metadata dynamique — SEO des pages marketing laissé à Open Graph statique.
- **Streaming / Suspense** : ~50 occurrences mais surtout des `loading.tsx` et `revalidate` exports. Aucune utilisation de `<Suspense boundary>` pour streamer la liste d'artisans page d'accueil (elle est chargée en `useEffect` après hydratation — Time-to-Interactive dégradé).
- **PPR (Partial Prerendering)** : **non activé**, aucune config `experimental.ppr`. Next 16 le rend stable — gaspillage net sur les pages `[ville]` et `[slug]` qui sont massivement cacheables.
- **Caching** : aucun usage de `unstable_cache`, `cacheTag`, `cacheLife`. `next.config.ts` ne définit pas `cacheComponents`. L'API `GET /api/v1/public/artisans` n'a ni `revalidate` ni header `Cache-Control` — chaque visiteur provoque un hit DB complet.
- **Server Actions / Form Actions** : **zéro** usage détecté. Tous les submit passent par des fetch JSON manuels (login, register, devis). On passe à côté du pattern natif.

---

## 3. Usage React 19

- **useOptimistic, useActionState, `use()`** : **zéro occurrence**. Les 7 `use(` trouvés correspondent tous à `use client` (faux positif sémantique).
- **Pas de form actions**. Pas d'optimistic UI sur les envois de messages (`/dashboard/demandes/[id]`) alors que c'est un cas d'usage canonique.
- **React Compiler** : non activé (pas de `reactCompiler: true` dans `next.config.ts`). Avec 73 fichiers client et `framer-motion` dans 10 endroits, le compilateur donnerait un gain gratuit.

**Verdict React 19** : la dépendance est installée, les fonctionnalités ne sont pas utilisées. On a payé le ticket et on est resté sur le quai.

---

## 4. Bundle size + perf

- **`framer-motion` importé dans la landing page** (`"use client"` + animations hero) — lib de ~60 kB min+gzip chargée sur le point d'entrée. À remplacer par `motion/react` tree-shakable ou par CSS animations `@keyframes` pour le hero.
- **Styles inline massifs** : `page.tsx` contient 400+ lignes dont ~80 % de `style={{...}}` inline. Tailwind v4 est installé mais peu exploité. Coût : pas de purge, pas de compression, rendu dupliqué à chaque navigation.
- **`optimizePackageImports: ["lucide-react"]`** : bonne config mais seulement 1 package optimisé. Ajouter `framer-motion`, `@prisma/client` (pour build), `jose`.
- **Images** : `deviceSizes` limité à 1200 max — OK pour mobile, insuffisant pour retina desktop (2x un écran 1440 = 2880). Augmenter à 1920/2560.
- **`<img>` natif utilisé dans Navbar** (ligne 76) au lieu de `next/image` — pas d'optimisation sur le logo.
- **Cache headers manquants** sur `/api/v1/public/*` — chaque appel recalcule tout.

---

## 5. Prisma — N+1 et optimisations

**Point positif** : indexes bien pensés dans `Artisan` (6 indexes composites incluant `[ville, metierId, actif, visible]`), `DemandeProjet` (5 indexes dont `[statut, createdAt]`), `Devis` (4). L'effort P0 récent est visible.

**Problèmes** :
- **`/api/v1/public/artisans/route.ts` ligne 62-82** : tri par `noteMoyenne` en DB, puis **re-tri complet en mémoire** par `PLAN_HIERARCHY` (ligne 111) après avoir déjà fait `skip/take`. Résultat : la pagination est fausse (le tri par plan casse l'ordre DB). Il faut reconstruire la requête avec un `CASE WHEN plan = 'BUSINESS' THEN 1 ...` en `orderByRaw`, ou dénormaliser un champ `plan_rank`.
- **`include: { metier, photos, badges, artisanMetiers: { include: { metier } } }`** : 4 jointures + sous-include. Sur 100 artisans, cela instancie 400+ objets Prisma côté Node. `select` plutôt que `include` réduirait de 30-40 % la taille du payload. La doc Prisma 6 recommande explicitement `select` pour les listes.
- **Haversine en JS post-query** : correct pour des volumes faibles, mais dès 5000+ artisans, passer à `ST_DWithin` PostGIS ou au plus simple un `WHERE lat BETWEEN x AND y` pré-filter côté DB.
- **`where.ville = { equals, mode: "insensitive" }`** : le filtrage par nom texte au lieu de la FK `villeId` force un scan sur une colonne non-unique. La table `Ville` existe mais n'est pas reliée à `Artisan` par FK.
- **Pas de `prisma.$transaction`** sur le login (lecture user + update audit) ni sur register.
- **Singleton OK** mais pas de `log: ['warn', 'error']` en prod, ni d'instrumentation (Prisma Accelerate/Pulse non exploitée).

---

## 6. Auth / sécurité — **problème critique**

**Incohérence majeure** : le projet dit dans `CLAUDE.md` « JAMAIS de `Authorization: Bearer` ». Or :
- `src/lib/auth.ts` utilise `localStorage.setItem("bativio_refresh", ...)` + `headers["Authorization"] = \`Bearer ${accessToken}\`` (lignes 91, 159).
- `src/lib/auth-server.ts` et le middleware utilisent le cookie HttpOnly `bativio-session`.

Les deux systèmes **coexistent**. Résultat :
- Refresh token dans `localStorage` = **vulnérable à toute faille XSS** (`dangerouslySetInnerHTML` utilisé dans 14 fichiers — surface d'attaque non nulle).
- L'endpoint `/api/v1/auth/login` pose un cookie **et** retourne les tokens à mettre en localStorage — doublon. On peut voler le token client et bypass le cookie httpOnly.
- `JWT_SECRET` a un fallback `"dev-secret-change-in-production"` (middleware.ts ligne 8, auth-server.ts ligne 8) — le garde-fou `throw` ne se déclenche que si `NODE_ENV === "production"`. Toute preview Vercel non-prod tournera avec le secret en clair.
- **Aucun CSRF token** sur les routes mutatives (cookie `sameSite: lax` seul — insuffisant pour les POST déclenchés par formulaires cross-origin en cas d'iframe Invoquo).
- **Rate-limit** `loginAttempts` est un `Map` in-memory — ineffectif sur Vercel (serverless : chaque invocation froide repart à 0). Il faut Upstash/Redis.
- **bcrypt rounds = 12** : correct (OWASP 2024 recommande 12-14).
- **JWT 7j sans rotation du `refresh_token_hash`** malgré son existence dans le schéma (`User.refreshTokenHash`). Le champ est déclaré mais je ne vois pas de logique de rotation/révocation.

---

## 7. TypeScript strict

- `strict: true` activé (bien).
- **9 occurrences `: any`** (dont 2 dans `lib/config.ts`) + **1 `as any`** dans `api/v1/public/artisans/route.ts` (`where: any`) → la requête Prisma perd son typage au point le plus critique.
- Non-null assertion (`!.`) : ~7 cas dans des dynamic routes — acceptable sur params, mais non documenté.
- `[key: string]: unknown` dans `ArtisanSessionData` (`auth.ts`) → échappatoire qui casse toute garantie de typage derrière.
- `eslint.config.mjs` : pas de règle `@typescript-eslint/no-explicit-any` ni `no-unsafe-*`. Le linter ne flag rien.

---

## 8. Tests

**Aucun test**. Pas de `vitest.config`, pas de `jest.config`, pas de dossier `__tests__`, pas de `playwright.config`. Aucune dépendance de test dans `package.json`. Pour un SaaS B2B facturant 19-59 €/mois, c'est le point le plus inquiétant avec l'auth.

---

## 9. TOP 15 dettes techniques (classées par gravité)

| # | Dette | Gravité | Impact |
|---|-------|---------|--------|
| 1 | Double système auth (cookie + Bearer/localStorage) | **CRITIQUE** | Faille XSS + viol règle projet |
| 2 | Aucun test automatisé (0 %) | **CRITIQUE** | Régression non détectable |
| 3 | `JWT_SECRET` fallback string en preview | **CRITIQUE** | Tokens forgés possibles |
| 4 | `/api/v1/public/artisans` : tri plan post-pagination | **HAUTE** | Résultats faux pages > 0 |
| 5 | Landing `app/page.tsx` en `"use client"` total | **HAUTE** | SEO + LCP + TTI dégradés |
| 6 | Rate-limit login in-memory sur Vercel | **HAUTE** | Brute-force possible |
| 7 | `where: any` dans API publique | HAUTE | Typage perdu au point chaud |
| 8 | Zéro `useOptimistic`/`useActionState` R19 | HAUTE | UX loading, double-submits |
| 9 | Pas de `cacheComponents` / `revalidate` | HAUTE | Coûts DB × 10 |
| 10 | `framer-motion` sur landing | MOYENNE | Bundle +60 kB |
| 11 | Pas de relation FK `Artisan.villeId` | MOYENNE | Requêtes string mode insensitive |
| 12 | Pas de PPR | MOYENNE | Perte perf annuaire |
| 13 | Pas de ESLint strict (no-explicit-any off) | MOYENNE | Dette TS non détectée |
| 14 | Styles inline 400+ lignes `page.tsx` | MOYENNE | Maintenance, duplication |
| 15 | Migrations Prisma non versionnées en doc (seul le schema) | FAIBLE | Rollback prod dur |

---

## 10. TOP 10 optimisations P0 (impact × facilité)

1. **Supprimer `localStorage + Bearer`** (auth.ts) — tout passer via cookie HttpOnly. 1 jour, impact sécurité massif.
2. **Convertir landing `page.tsx` en RSC**, extraire le `<ChatDevis />` / `<SearchBar />` en enfants client. 0,5 j, gain SEO + LCP −40 %.
3. **Ajouter Playwright + 10 scénarios critiques** (login, inscription, devis, paiement Stripe webhook). 2 j, éteint le risque régression.
4. **`JWT_SECRET` : `throw` hors NODE_ENV === "test"**, peu importe prod/preview. 10 min.
5. **Rate-limit Upstash** sur `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/magic-link`. 0,5 j.
6. **Fixer tri plan `/public/artisans`** en SQL natif ou via champ `plan_rank` dénormalisé. 0,5 j.
7. **Activer PPR + `cacheComponents`** sur `[ville]`, `[slug]`, `tarifs`, `facturation-electronique`. 1 j.
8. **React Compiler** (`reactCompiler: true`). 10 min + QA.
9. **Remplacer `include` par `select`** dans les 6 endpoints détectés. 1 j, payload −30 %.
10. **`generateMetadata` dynamique** sur toutes les pages publiques marketing. 2 h, gain SEO direct.

---

**Synthèse** : stack moderne, fondations 2025-ready, mais l'exécution est à mi-chemin. Les choix Next.js 16 / React 19 ne sont pas rentabilisés. Les deux urgences absolues : **auth à unifier** et **tests à écrire**. Tant que ces deux points ne sont pas traités, chaque nouvelle feature ajoute de la dette non-contrôlée.
