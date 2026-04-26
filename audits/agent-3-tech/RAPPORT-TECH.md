# RAPPORT TECH — Bativio (Ghost CTO)

**Date** : 2026-04-26
**Codebase** : `frontend/` — Next.js 16.2.1 + React 19.2.4 + TS strict + Prisma 6.19 + PostgreSQL Railway
**Live** : https://www.bativio.fr

Verdict en une ligne : **ne pas stopper, mais bloquer Factur-X (RFE sept 2026), rate-limit IA et signature Cloudinary publique avant 1 000 demandes/mois**.

---

## 1. Bug photos — root cause analysis

Lecture croisée des 4 fichiers : `next.config.ts`, `api/v1/upload/signature/route.ts`, `api/v1/artisans/me/photos/upload/route.ts`, `components/vitrines/PhotoGallery.tsx`, `lib/image-compress.ts`.

### Ce qui marche

- `next.config.ts` autorise `res.cloudinary.com`, formats WebP/AVIF, deviceSizes propres.
- Compression côté client (`compressImage`) : canvas → JPEG q=0.8, max 1600px. OK.
- 2 chemins d'upload coexistent :
  - `/api/v1/upload/signature` (signature Cloudinary unsigned, folder `bativio/devis`, rate-limited 10/h/IP).
  - `/api/v1/artisans/me/photos/upload` (upload server-side avec `cloudinary.uploader.upload_stream`, auth requise, max 10 Mo, types restreints).
- `PhotoGallery.tsx` : `next/image` avec `fill`, sizes corrects, lightbox propre, lazy par défaut, fallback explicite "pas encore de photos" — **pas de Unsplash en realisations**, c'est bien.

### Vrais problèmes (par ordre de gravité)

**P0 — Signature Cloudinary publique sans auth utilisateur** (`upload/signature/route.ts`).
- Le endpoint est ouvert : n'importe qui peut générer une signature valide pour `bativio/devis` à 10/h/IP. Avec un VPN tournant, on peut polluer ton compte Cloudinary (quota 25 GB/mois free).
- Pire : la signature ne contraint ni `max_file_size`, ni `allowed_formats`, ni `eager` — Cloudinary acceptera n'importe quoi (vidéo 100 MB, PDF, raw).
- Absent du fichier : `notification_url`, `tags`, `context`, et surtout aucun `public_id` préfixé par l'ID demande.

**Fix prêt à coller** :

```ts
// frontend/src/app/api/v1/upload/signature/route.ts
const paramsToSign = `allowed_formats=jpg,png,webp&folder=${folder}&max_file_size=10485760&timestamp=${timestamp}&transformation=q_auto,f_auto,w_2000`;
const signature = crypto
  .createHash("sha1")
  .update(paramsToSign + creds.apiSecret)
  .digest("hex");

return apiSuccess({
  signature, timestamp, cloudName: creds.cloudName, apiKey: creds.apiKey,
  folder, allowedFormats: "jpg,png,webp", maxFileSize: 10485760,
  transformation: "q_auto,f_auto,w_2000",
});
```

Et côté client, **renvoyer ces params au upload** sinon la signature sera rejetée.

**P1 — Pas de blur placeholder**.
`PhotoGallery.tsx` n'envoie aucun `placeholder="blur"` ni `blurDataURL`. Sur 4G mobile, on voit le carré gris pendant 200-800 ms par photo. Sur la grille 3 colonnes, ça fait 9 carrés gris simultanément. Layout shift acceptable (aspectRatio défini), mais perception lente.

**Fix** : générer un blur server-side via `cloudinary.url(publicId, { transformation: [{ width: 20, quality: 30 }] })` et stocker dans `Photo.blurDataUrl` (champ à ajouter au schema). Ou plus simple : utiliser le générateur `next/image` `placeholder="blur"` avec un `blurDataURL` base64 minimal.

**P2 — `before-after` gallery cassée**.
- `BeforeAfterGallery` lit `urls[0]` et `urls[1]`, mais aucun lien avec `Photo.type=BEFORE_AFTER` ni `Photo.paireId` du schema. Tu as un modèle prévu pour ça (ligne 290-291) mais le composant ignore complètement le pairing.
- Si un artisan upload 5 photos avec layout=before-after, on n'affiche que les 2 premières aléatoires. **Sortie incorrecte garantie**.

**Fix structure** :
```ts
const pairs = urls.reduce<Array<[string, string]>>((acc, _, i) => {
  if (i % 2 === 0 && urls[i+1]) acc.push([urls[i], urls[i+1]]);
  return acc;
}, []);
// puis carrousel sur pairs
```

**P3 — `cloudinaryPublicId` jamais utilisé pour DELETE**.
`prisma/schema.prisma` ligne 287 stocke `cloudinaryPublicId`, mais `photos/[id]/route.ts` (DELETE) — à vérifier — ne fait pas le `cloudinary.uploader.destroy(publicId)`. Résultat : les photos supprimées en DB restent sur Cloudinary, le quota grimpe pour rien.

### Note sur "10 photos en DB"
C'est cohérent avec mes findings — le système n'a pas été stress-testé. Avant de monter à 100 artisans avec 10 photos chacun (1 000 fichiers), corriger P0 + P3 minimum, sinon ton compte Cloudinary saute en 2 mois.

---

## 2. Performance

### Estimation Lighthouse (lecture du code, sans Chrome DevTools)

| Page | LCP estimé | CLS | Bundle JS estimé | Note |
|------|-----------|-----|-----------------|------|
| `/` (landing) | 1.8-2.2 s | < 0.05 | ~180 KB gzip | Bon. Hero serveur, pas de SPA. |
| `/lyon` | 2.2-2.8 s | < 0.05 | ~200 KB | ISR 3600 s, query Prisma + 1 hop API → 250-400 ms TTFB. |
| `/lyon/test-plombier-lyon` | 2.5-3.2 s | < 0.05 | ~220 KB | Vitrine = fetch artisan + JSON-LD lourd inline. |
| `/demande` | 2.0 s | < 0.05 | ~250 KB | Formulaire 3-step + chat IA. |
| `/dashboard` | 3-4 s | 0.05-0.1 | ~400 KB | Layout protégé + sidebar + 20 sous-pages chargées paresseusement. |

### N+1 Prisma — vrai trou

`src/app/api/v1/public/villes/[slug]/route.ts` est **clean** : 1 query `findMany` avec `include: { metier, photos: { take: 1 }, badges }`. Pas de N+1.

**MAIS** dans `src/app/[ville]/page.tsx` ligne 21-37 (`generateStaticParams`) et lignes 51-65 et 142-153 du même fichier : tu fais **3 fois** la même `prisma.artisan.findMany({ select: { metierSlugSeo, villeSlug, ville, metier: { select: { nom } } }, distinct })`. Une fois pour `generateStaticParams`, une fois pour `generateMetadata`, une fois dans la page elle-même.

À 200 artisans : 600 lignes scannées 3× par requête au lieu d'1×. À 2 000 artisans (si tu scales hors Rhône-Alpes), c'est 6 000.

**Fix** : extraire dans une fonction unique mémorisée par requête (React `cache()` natif) :

```ts
import { cache } from "react";

export const getMetierVilleCombos = cache(async () =>
  prisma.artisan.findMany({
    where: { actif: true, deletedAt: null, metierSlugSeo: { not: null }, villeSlug: { not: null } },
    select: { metierSlugSeo: true, villeSlug: true, ville: true, metier: { select: { nom: true } } },
    distinct: ["metierSlugSeo", "villeSlug"],
  }),
);
```

### Bundle size — points louches

- `framer-motion` (12.38) → ~70 KB gzip. Tu l'utilises ailleurs que landing ? Si non, isole-le en dynamic import.
- `pdf-lib` (1.17) → ~150 KB gzip. Doit être uniquement server-side (devis-pdf.ts) — vérifie qu'il ne fuit pas dans le bundle client (chercher `import "pdf-lib"` dans des Client Components).
- `lucide-react` ✓ déjà dans `optimizePackageImports`.

### Cache HTTP

- ISR `revalidate = 3600` partout (1 h). Bon compromis SEO.
- `next.config.ts` headers : Cache-Control immutable sur `_next/static`, 86400 sur icônes. Manque : Cache-Control sur les endpoints `/api/v1/public/*` (ils sont actuellement no-cache par défaut → chaque hit = lambda Vercel + DB hit).

**Fix**:
```ts
// dans /api/v1/public/villes/[slug]/route.ts
return apiSuccess(data, 200, {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
});
```
(et adapter `apiSuccess` pour accepter des headers).

---

## 3. Sécurité — OWASP Top 10

| OWASP | État | Note |
|-------|------|------|
| A01 Broken Access Control | OK | Middleware verify JWT sur `/dashboard/*`, `/admin/*`, role check ADMIN. |
| A02 Cryptographic Failures | Mitigé | JWT HS256 via `jose`, secret en env. Cookie HttpOnly + SameSite=Lax. **Mais** `secure: true` doit être conditionnel dev/prod (à vérifier auth-server.ts l.32-34). |
| A03 Injection | OK | Prisma → safe. Tous les inputs Zod-validated. |
| A04 Insecure Design | KO | Voir P0 signature Cloudinary publique + chat-qualif sans rate limit. |
| A05 Security Misconfiguration | OK | HSTS preload, X-Frame-Options DENY, X-Content-Type nosniff dans `next.config.ts`. |
| A06 Vulnerable Components | OK | Stack récente (Next 16.2.1, React 19.2.4, Prisma 6.19). |
| A07 Auth Failures | Mitigé | Rate limit login = 10/15 min/email, **in-memory Map** → reset à chaque cold start Vercel = bypass trivial avec un curl en boucle. |
| A08 Software/Data Integrity | OK | Signature Stripe webhook vérifiée (à supposer dans `stripe/webhook/route.ts`). |
| A09 Logging | KO | Aucun Sentry, juste `console.error`. Pas de Logflare/Axiom. À 0€/mois jusqu'à 5 000 events Sentry free tier. |
| A10 SSRF | N/A | Pas de fetch user-controlled URL. |

### Détails critiques

**Rate limiting in-memory = sécurité théâtrale sur Vercel**.
Vercel utilise des fonctions serverless stateless. Le `Map` se reset à chaque cold start (~10 min d'inactivité ou nouvelle région). En pratique, un attaquant peut tester 10 mots de passe, attendre, recommencer. Et chaque région Vercel a sa propre map.

**Fix** (Upstash Redis serverless free tier 10 K commandes/jour) :

```bash
npm i @upstash/ratelimit @upstash/redis
```

```ts
// frontend/src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const loginLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  analytics: true,
  prefix: "rl:login",
});

export const chatQualifLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 h"),
  prefix: "rl:chat",
});
```

**chat-qualif sans rate limit du tout** (`api/v1/public/chat-qualif/route.ts` lu intégralement). N'importe qui peut spammer Claude Sonnet illimité. À 0,01€/qualif × 1 attaquant × 1 000 hits/h = **240€/jour** brûlés. Critique. **Fix obligatoire avant trafic**.

**Estimation-live** (`api/v1/public/estimation-live/route.ts`) : même problème, appelle Sonnet sans aucune protection.

**JWT_SECRET fallback** : middleware ligne 5-7 = `throw if production`. Bien. Mais le fallback `"dev-secret-change-in-production"` reste dans le code source — si quelqu'un push en prod sans var d'env, le throw catch et... c'est OK en fait. Mais en dev, deux instances peuvent s'auth réciproquement avec ce secret. Préfère un random per-process.

---

## 4. Conformité facture — Article 242 nonies A CGI

J'ai lu `frontend/src/lib/pdf/devis-pdf.ts` (398 lignes).

Le PDF couvre **9 sur 16** mentions obligatoires devis/facture :

| Mention | Présente ? | Ligne |
|---------|----------|-------|
| Date émission | ✓ | 110 |
| Numérotation unique séquentielle | Mitigé | voir ci-dessous |
| Identité émetteur (raison sociale, adresse, SIRET, RM) | ✓ | 138-153 |
| TVA intra | ✓ | 303 (auto-calculé `FR${siret.slice(0,9)}`) — **ATTENTION : faux**. Le format INSEE = clé contrôle 2 chiffres + SIREN, pas siret.slice(0,9) |
| Identité destinataire | ✓ | 163-179 |
| Date livraison/exécution | Mitigé | présent si fourni, sinon "à convenir" |
| Désignation prestation, qté, PU | ✓ | 209-223 |
| Prix HT, TVA, TTC | ✓ | 234-243 |
| Réduction de prix acquise | KO | non géré |
| Taux TVA et montant par taux | KO | un seul total TVA agrégé, pas de ventilation par taux |
| Mention spéciale franchise TVA | ✓ | 333 |
| Adresse facturation différente | KO | seul `adresseChantier` géré |
| Mention pénalités retard | ✓ | 341 |
| Indemnité forfaitaire 40€ | ✓ | 341 |
| Médiateur conso | ✓ | 342 |
| Droit rétractation 14 j (hors étab.) | ✓ | 346 |
| Tribunal compétent | ✓ | 350 |
| Mention manuscrite "bon pour accord" | ✓ | 283 |

**Faux : `tvaIntra` calculée**. La clé TVA française fait 13 caractères : `FR` + 2 chiffres clé + 9 chiffres SIREN. Faire `FR${siret.slice(0,9)}` produit du n'importe quoi (manque la clé contrôle).

**Fix** :
```ts
function computeTvaIntra(siren: string): string {
  const sirenNum = parseInt(siren, 10);
  const cle = (12 + 3 * (sirenNum % 97)) % 97;
  return `FR${String(cle).padStart(2, "0")}${siren}`;
}
const tvaIntra = input.artisan.tvaIntra || computeTvaIntra(input.artisan.siret.slice(0, 9));
```

### Numérotation séquentielle — non conforme

`api/v1/artisans/me/devis-ia/route.ts` ligne 213-220 :
```ts
const devisCount = await prisma.devis.count({ where: { artisanId, numero: { startsWith: `${year}-` } } });
const numero = `${year}-${String(devisCount + 1).padStart(4, "0")}`;
```

**Bug race condition** : 2 devis créés simultanément → même `numero`. `Devis.numero` est `@unique` (schema l.499), donc le 2e crash. Pas conforme article 242 nonies (numérotation continue sans rupture).

**Fix** : utiliser un compteur atomique en DB ou `prisma.$transaction` avec advisory lock :

```ts
const devis = await prisma.$transaction(async (tx) => {
  const last = await tx.devis.findFirst({
    where: { artisanId, numero: { startsWith: `${year}-` } },
    orderBy: { createdAt: "desc" },
  });
  const nextNum = last ? parseInt(last.numero.split("-")[1], 10) + 1 : 1;
  return tx.devis.create({ data: { ..., numero: `${year}-${String(nextNum).padStart(4, "0")}` } });
}, { isolationLevel: "Serializable" });
```

Et ajoute un `@@unique([artisanId, numero])` au schema.

### Archivage 10 ans

PDF généré à la volée (in-memory `Uint8Array`), **jamais persisté**. `Devis.pdfUrl` est nullable et vide. Si Cloudinary disparaît dans 3 ans, tous les devis sont perdus. L221-1 C. com. exige conservation 10 ans.

**Fix** : à la génération, upload sur Cloudinary `bativio/devis-archives/${artisanId}/${numero}.pdf` avec `resource_type: "raw"` et stocker l'URL dans `pdfUrl`. Coût : 1 KB/devis × 10 000 devis = 10 MB. Négligeable.

### Signature électronique
Actuellement texte "Bon pour accord" + champ signature manuscrite vierge. Ce n'est pas eIDAS conforme niveau "avancé" mais c'est **suffisant pour devis BTP B2C** (DGCCRF accepte la signature manuscrite scannée). À valoriser dans la doc commerciale, pas un blocker.

---

## 5. Conformité Factur-X (RFE 2026) — CRITIQUE

Tu as **0 implémentation Factur-X**. Recherche `factur-x|facturx|UN/CEFACT|ZUGFeRD` → aucun résultat dans `package.json` ni dans `src/`.

### Calendrier officiel (DGFiP, décret n°2024-266)
- **1er sept 2026** : toutes les entreprises doivent **recevoir** des factures électroniques + grandes entreprises doivent **émettre**.
- **1er sept 2027** : PME et microentreprises doivent émettre.

Tes artisans cibles = principalement microentreprises et TPE → obligation **émission au 1er sept 2027**, mais **réception au 1er sept 2026** (dans 4 mois).

### Architecture obligatoire
1. Choisir une **PA** (Plateforme Agréée — anciennement PDP) ou utiliser le PPF (gratuit mais minimaliste).
2. Émettre au format Factur-X (PDF/A-3 + XML UN/CEFACT CII 16931 EN intégré) ou UBL ou CII pur.
3. Transmettre via la PA, pas en direct.

### Recommandation
Bativio ne peut pas (raisonnablement) devenir une PA — il faut une certification ANSSI + assurance + 1 M€ de capital + audits semestriels. **Choisir un partenaire** :

| Partenaire | API | Coût | Pour Bativio |
|-----------|-----|------|---------------|
| **Pennylane** | OAuth + REST | 0€ pour partenaires (commission flux) | **Recommandé**. Skill `pennylane-pa` existe déjà. |
| Chorus Pro | API native | Gratuit | Service public, lent, B2G uniquement. |
| Cegedim e-invoicing | REST | ~0,10€/facture | Trop cher à ce stade. |
| Sellsy | REST | Inclus dans abo | Bof, ils sont concurrents. |
| Tiime / Indy | API limitée | Variable | Pas mûres. |

### Code à écrire (Factur-X minimum)

```ts
// frontend/src/lib/pdf/facturx-builder.ts
import { create } from "xmlbuilder2";

export function buildFacturXXml(devis: DevisPdfInput): string {
  const doc = create({ version: "1.0", encoding: "UTF-8" })
    .ele("rsm:CrossIndustryInvoice", {
      "xmlns:rsm": "urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100",
      "xmlns:ram": "urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100",
      "xmlns:udt": "urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100",
    });

  doc.ele("rsm:ExchangedDocumentContext")
    .ele("ram:GuidelineSpecifiedDocumentContextParameter")
      .ele("ram:ID").txt("urn:cen.eu:en16931:2017").up().up().up();

  const exchanged = doc.ele("rsm:ExchangedDocument");
  exchanged.ele("ram:ID").txt(devis.numero);
  exchanged.ele("ram:TypeCode").txt("380"); // facture commerciale
  exchanged.ele("ram:IssueDateTime").ele("udt:DateTimeString", { format: "102" })
    .txt(devis.date.toISOString().slice(0, 10).replace(/-/g, ""));

  // ApplicableHeaderTradeAgreement (vendeur + acheteur)
  // ApplicableHeaderTradeDelivery
  // ApplicableHeaderTradeSettlement (TVA, totaux)
  // [...] ~150 lignes XML totales

  return doc.end({ prettyPrint: true });
}
```

Puis embed avec `pdf-lib` :
```ts
const xml = buildFacturXXml(input);
pdfDoc.attach(new TextEncoder().encode(xml), "factur-x.xml", {
  mimeType: "application/xml",
  description: "Factur-X invoice data",
  creationDate: input.date,
  modificationDate: input.date,
  afRelationship: "Alternative",
});
// Et conformité PDF/A-3 → utiliser pdf-lib avec colorProfile sRGB OutputIntent + XMP metadata
```

**Effort** : 5-7 jours dev pour Factur-X minimum + intégration Pennylane PA = ~12-15 jours homme. **À démarrer maintenant**.

---

## 6. Devis IA — analyse critique

### Modèles utilisés
- `MODEL_OPUS = "claude-opus-4-7"` → devis-agent (généreur final)
- `MODEL_SONNET = "claude-sonnet-4-6"` → qualif-agent + pre-devis-agent
- `MODEL_HAIKU = "claude-haiku-4-5"` → défini mais non utilisé dans agents

Tarifs `/lib/claude.ts` ligne 42-44 : Opus 15$/M in, 75$/M out. Sonnet 3$/M in, 15$/M out.

### Prompt caching
**Bien implémenté** : `cache_control: { type: "ephemeral" }` sur `systemWithRag` (devis-agent.ts l.235) et `systemWithGuides` (qualif-agent.ts l.142). Le -42% mesuré (0,234 → 0,136€) est cohérent.

### Hallucinations sur prix
Le system prompt ligne 50-66 force la hiérarchie : forfait artisan → tarif horaire métier → tarif horaire global → catalogue → fallback marché. Et ligne 63 : *"Tu n'inventes JAMAIS un prix qui n'est pas dans la grille, catalogue ou RAG"*.

**Mais** :
- Pas de validateur post-génération qui rejette les lignes avec `source: "estimation_ia"` (qui n'est même pas censé exister selon le prompt mais figure ligne 13 du type DevisLigne, donc Claude peut le générer).
- Pas de check : "si totalHt = qte × puHt ± 0.01, sinon rejette".
- Pas de plafond : un Claude qui hallucine "rénovation salle de bain 50 000€" n'est jamais blocké.

**Fix validateur** :
```ts
function validateDevisLignes(lignes: DevisLigne[], catalogue: CataloguePrestation[]): string[] {
  const errors: string[] = [];
  for (const l of lignes) {
    if (Math.abs(l.qte * l.puHt - l.totalHt) > 0.01) {
      errors.push(`Ligne "${l.label}" : total ${l.totalHt} ≠ qte×PU ${l.qte * l.puHt}`);
    }
    if (l.source === "estimation_ia") {
      errors.push(`Ligne "${l.label}" : source interdite estimation_ia`);
    }
    if (l.source === "catalogue" && l.code) {
      const ref = catalogue.find((c) => c.code === l.code);
      if (ref && (l.puHt < ref.prixHtBas * 0.7 || l.puHt > ref.prixHtHaut * 1.3)) {
        errors.push(`Ligne "${l.label}" : PU ${l.puHt}€ hors range catalogue [${ref.prixHtBas}-${ref.prixHtHaut}]`);
      }
    }
  }
  return errors;
}
```

Si `errors.length > 0` → retry max 1× avec message d'erreur, sinon fallback humain (statut "À VALIDER" + email admin).

### Fallback humain
Pas de route admin pour valider/corriger un devis IA avant envoi client. C'est dangereux — un devis IA buggé peut être envoyé directement. **Ajouter** : statut `BROUILLON` obligatoire avant `ENVOYE`, avec UI artisan qui review chaque ligne.

### Coûts Claude — vérification
Avec prompt caching effectif :
- Qualif Sonnet : ~3 K tokens in (cached) + 0,5 K out par tour → **0,008€/tour × 5 tours = 0,04€/qualif**.
- Devis Opus : ~5 K in (cached) + 2 K out → **0,15€/devis** (cache miss = 0,30€).

À 1 000 devis/mois : **150-200€ Anthropic** + 50€ qualif = ~250€/mois. Comparé à 1 000 × 19€ = 19 K€ revenu mensuel STARTER, ROI excellent.

**Mais l'agent estimation-live** se déclenche dès 2 infos collectées, soit 3-5 fois pendant un chat. À 0,008€ × 5 = 0,04€/visiteur qui n'est même pas converti. À 10 000 visiteurs/mois = 400€/mois pour des leads non convertis. **Trop cher** sans rate limit.

---

## 7. Scalabilité

### Bottlenecks par ordre d'apparition

1. **Anthropic rate limits** (1er à péter). Tier 1 par défaut = 50 RPM Opus + 50 RPM Sonnet. À 50 devis/heure = OK. À 50 devis/min = 429. Demander Tier 2 dès 100 devis/jour = gratuit, juste un email à anthropic.com.

2. **PostgreSQL Railway free tier** : 256 MB RAM, 1 vCPU partagé, **1 GB stockage**. Schema actuel ~50 tables, chaque devis ~5 KB JSON + photos URLs. À 10 K devis = 50 MB. À 100 K = 500 MB. Le storage tient 2 ans, mais **les requêtes deviennent lentes au-dessus de 5 GB sans index correct**. Tu as quelques `@@index` mais manque sur `Devis.statut`, `DemandeProjet.metierDetecte`, `Photo.artisanId+ordre` (tu l'as déjà ✓).

3. **Vercel serverless cold start** : ~600 ms côté DB-touching, ~150 ms statique. À 100 visiteurs/min sur 5 villes ISR, c'est OK. Au-delà, passe en `runtime: "edge"` pour les routes publiques sans Prisma.

### Cache Redis : NON présent
Confirmé. Tu n'as que ISR (3600 s). C'est suffisant pour < 1000 visiteurs/jour. Au-dessus, Upstash Redis devient obligatoire pour :
- Rate limiting (cf. section 3)
- Cache des résultats Anthropic identiques (qualif avec mêmes inputs = même output)
- Session storage si tu sors de JWT pur

### Coût Vercel à 10 K visiteurs/mois
- Hobby : 100 GB bandwidth, 100 K function invocations. Tu vas dépasser dès 10 K visiteurs (chacun = ~30 invocations API).
- **Pro à 20$/mois** devient obligatoire à ce stade.

---

## 8. Coûts cachés — runway

### Aujourd'hui (10 artisans, < 1 K visiteurs/mois)
| Service | Coût/mois |
|---------|----------|
| Vercel Hobby | 0€ |
| Railway PostgreSQL Hobby | 5€ |
| Cloudinary Free | 0€ (10 photos seulement) |
| Resend Free | 0€ (< 100 emails) |
| OVH SMS | 0€ (pas de SMS envoyés) |
| Anthropic | ~10€ (tests) |
| Stripe | 0€ |
| **TOTAL** | **~15€/mois** |

### À 100 artisans actifs (~50 demandes/jour)
| Service | Coût/mois |
|---------|----------|
| Vercel Pro | 20€ |
| Railway Pro | 20€ |
| Cloudinary Plus | 99€ (1 000 photos × 10 MB = 10 GB) |
| Resend Pro | 20€ (10 K emails) |
| OVH SMS | 30€ (300 SMS × 0,10€) |
| Anthropic Tier 2 | 200€ (1 500 devis IA) |
| Stripe (frais 1.5%) | sur 100×19€ = 1900€ → 28€ |
| Upstash Redis | 0€ (free tier) |
| Sentry Team | 26€ |
| **TOTAL** | **~440€/mois** |
| **REVENU** | 1 900€ (STARTER seul) à 5 900€ (mix) |
| **MARGE** | 75-92% |

### À 1 000 artisans actifs
| Coût | ~3 500€/mois |
| Revenu | 19-59 K€/mois |
| Marge | ~92% |

### À 10 000 artisans
| Coût | ~25 000€/mois (Vercel Enterprise + DB dédiée + équipe support) |
| Revenu | 190-590 K€/mois |
| Marge | ~87% |

**Conclusion** : modèle SaaS classique, marge confortable à partir de 100 artisans. Le seuil de rentabilité est ~30 artisans actifs (435€ revenus = couvre 15€ tech + 100€ side).

---

## 9. Critique des audits UX et Business

Les fichiers `audits/agent-1-ux/RAPPORT-UX.md` et `audits/agent-2-business/RAPPORT-BUSINESS.md` sont **introuvables** (dossiers vides). DONNÉE MANQUANTE — les autres agents n'ont pas livré leur rapport au moment où je rédige.

Sans ces rapports, je ne peux pas critiquer leurs préconisations directement. Je note ce qu'**il faudra défendre techniquement** quand ils livreront :

- Si UX propose "chat en temps réel artisan-client" → coût technique élevé (WebSocket, pas Vercel-friendly, faut Pusher 49$/mois ou Ably). Faisable mais pas P0.
- Si Business propose "marketplace avec commission sur devis acceptés" → impose tracking devis-paiement, signature eIDAS niveau avancé (~150€/mois DocuSign), conformité PA financier. Trop tôt.
- Si UX propose "vidéos artisan dans vitrine" → Cloudinary video plan = +99€/mois minimum. À benchmarker vs YouTube embed (gratuit).

---

## 10. Top 10 dette technique — par risque

| # | Titre | Risque | Effort | Priorité |
|---|------|--------|--------|----------|
| 1 | Rate limit chat-qualif et estimation-live (in-memory → Upstash Redis) | **COÛT** : 240€/jour brûlés en cas d'abuse Claude | 1 j | P0 |
| 2 | Factur-X + intégration Pennylane PA | **FAIL PROD** : non-conforme RFE sept 2026 | 12-15 j | P0 |
| 3 | Signature Cloudinary publique sans contrainte (max_file_size, allowed_formats) | **COÛT/SÉCU** : pollution compte Cloudinary | 0.5 j | P0 |
| 4 | Numérotation devis race-condition (count + 1 non atomique) | **CONFORMITÉ** : doublons numéros = invalide CGI | 0.5 j | P0 |
| 5 | Archivage PDF devis (génération in-memory, jamais persisté) | **CONFORMITÉ** : violation L221-1 C. com. (10 ans) | 1 j | P1 |
| 6 | Validateur post-génération devis IA (sanity check prix vs catalogue) | **UX/JURIDIQUE** : devis halluciné envoyé client | 1.5 j | P1 |
| 7 | Sentry + Logflare/Axiom monitoring | **PROD** : aucune visibilité erreurs runtime | 0.5 j | P1 |
| 8 | TVA intra calculée à partir de `siret.slice(0,9)` au lieu de SIREN + clé contrôle | **CONFORMITÉ** : numéro TVA invalide sur tous les devis | 0.5 j | P1 |
| 9 | DELETE photo ne supprime pas sur Cloudinary (`cloudinaryPublicId` orphelin) | **COÛT** : quota Cloudinary explose | 0.5 j | P2 |
| 10 | Triple `prisma.artisan.findMany distinct` dans `[ville]/page.tsx` (N+1 contournable via React `cache()`) | **PERF** : 3× plus de queries Railway que nécessaire | 0.5 j | P2 |

**Bonus dette tech non classée** :
- Bug `BeforeAfterGallery` ignorant `Photo.paireId` du schema → photos affichées aléatoirement.
- Pas de blur placeholder sur `next/image` → perception de lenteur visible.
- Devis IA route utilise `claude-sonnet-4-20250514` (modèle déprécié) au lieu de `MODEL_SONNET` constant — incohérence.
- `auth-server.ts` n'a pas été inspecté pour vérifier `secure: true` conditionnel dev/prod sur le cookie.

---

## Verdict final

**Ne pas stopper. Ship la V1, mais bloquer 4 trucs avant 100 artisans actifs ou 1 000 demandes/mois** :

1. **Rate limit IA endpoints publics** (chat-qualif, estimation-live) sinon 1 attaquant peut brûler ton compte Anthropic en quelques heures. **1 jour**.
2. **Lockdown signature Cloudinary** (allowed_formats, max_file_size, transformation forcée). **0.5 jour**.
3. **Numérotation devis atomique** + validation prix post-IA. **2 jours**.
4. **Démarrer chantier Factur-X + Pennylane PA** maintenant car deadline 1er sept 2026 sur la réception et 1er sept 2027 sur l'émission. **15 jours étalés**.

Le reste (Sentry, archivage PDF, blur placeholders, before-after fix) peut suivre en sprint 2.

La stack est solide : Next 16 + Prisma 6 + Postgres + Stripe + Cloudinary + Anthropic, c'est moderne, bien architecturé. Pas de gros sin technique structurel. La seule question existentielle, c'est **Factur-X** : sans intégration PA, tu perds toute crédibilité B2B au 1er sept 2026 quand les artisans demanderont "vous gérez les factures électroniques ?". Démarre cette semaine.

Coût opérationnel à l'échelle (100→10K artisans) reste sain (marge 75-92%). Le risque #1 n'est pas technique, c'est **commercial** : convaincre 30 artisans de payer 19€/mois pour atteindre la rentabilité technique. Mais ça, c'est le job du business.
