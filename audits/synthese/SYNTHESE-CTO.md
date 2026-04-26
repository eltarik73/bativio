# SYNTHÈSE CTO — Bativio

**Date** : 2026-04-26
**Audit** : 4 rapports croisés (UX + Business + Tech + Concurrence)
**Auteur synthèse** : Ghost CTO Bativio
**Branche** : `claude/sharp-meninsky-5e0ca8` (mergée dans `main`)
**Live** : https://www.bativio.fr

---

## 1. Executive Summary

**État Bativio en 5 lignes** :
Bativio est en **soft-launch viable** (10 artisans actifs, stack moderne Next.js 16/Prisma/Anthropic, SEO 87 URLs sitemap, 40 tests passent, deploy auto). Le produit a **3 différenciants forts non encore exploités** : devis IA Opus ±10%, zéro commission transparente, intégration Invoquo facturation. Mais **3 trous critiques** menacent la mise à l'échelle au-delà de 100 artisans : rate-limit IA absent (risque coût Anthropic 240€/jour si abuse), Factur-X non implémenté (deadline 1er sept 2026 = 4 mois), avis clients vérifiés inexistants (gap universel marché). Le moat #1 est **conformité Factur-X PA agréée** dans la fenêtre 2026 — personne n'en parle, c'est l'opportunité de gagner 18 mois d'avance.

**Top 3 urgences absolues** :
1. **Rate-limit Upstash Redis sur `/api/v1/public/chat-qualif` et `/estimation-live`** (P0 sécu/coût — 1 jour)
2. **Factur-X via Pennylane PA partenariat** (P0 conformité — 12-15 jours, deadline réception 1er sept 2026)
3. **Avis clients vérifiés** (P0 trust — feature universelle marché, 9/10 concurrents l'ont)

**Top 3 opportunités stratégiques** :
1. **Bundle "Conformité 2026"** (Factur-X + signature eIDAS + 16 mentions) → +30€/mois sur Pro
2. **MaPrimeRénov / CEE auto-intégré** (+CAC -50% sur métiers RGE — couvreur, façadier, chauffagiste)
3. **Programme parrainage artisan** (15-30€/filleul → CAC <30€)

**Verdict** : **SHIP la V1 en l'état + bloquer 4 trucs avant 100 artisans** :
- Rate-limit IA (1j)
- Lockdown signature Cloudinary (0.5j)
- Numérotation devis atomique (0.5j)
- Démarrer chantier Factur-X (15j étalés)

Ne pas pivoter. Ne pas re-architecturer. **Faire les 4 fixes + densifier le marché ARA**.

---

## 2. Matrice de priorisation Impact × Effort

### 🔥 Quick wins (impact haut, effort bas) — **CETTE SEMAINE**

| # | Action | Source | Effort | Impact |
|---|--------|--------|--------|--------|
| 1 | Fix contraste `--pierre #9C958D → #7A736B` (WCAG AA fail global) | UX | 5 min | Conformité EAA + lisibilité 30% du texte |
| 2 | Persist chat IA `/demande` en `sessionStorage` (F5 = perte actuelle) | UX | 15 min | Conversion +15% estimée |
| 3 | Retirer emojis `📞 📄 ⚠️` du devis public `/d/[token]` | UX | 10 min | Cohérence brand Tiime |
| 4 | Sticky CTA mobile sur vitrines `[ville]/[slug]` | UX | 20 min | Conversion mobile +30% (data Houzz) |
| 5 | Hero landing : 1 seul CTA (vs 2 actuels) | UX | 30 min | Conversion +20% (Doctolib pattern) |
| 6 | TVA intracom corrigée (SIREN 9 chars + clé contrôle, pas SIRET 14) | Tech | 30 min | Conformité numéro TVA invalide actuellement |
| 7 | Numérotation devis atomique (transaction Serializable) | Tech | 30 min | Évite race-condition + crash unique constraint |
| 8 | Lockdown signature Cloudinary (allowed_formats + max_file_size) | Tech | 30 min | Empêche pollution compte Cloudinary |
| 9 | DELETE photo → `cloudinary.uploader.destroy(publicId)` | Tech | 20 min | Évite quota Cloudinary qui explose |
| 10 | React `cache()` sur triple `prisma.artisan.findMany` `[ville]/page.tsx` | Tech | 20 min | -66% queries DB Railway |

**Total effort** : ~3h de dev. Tous fixables aujourd'hui.

### 🚀 Big bets (impact haut, effort haut) — **ROADMAP Q1/Q2 2026**

| # | Action | Source | Effort | Impact |
|---|--------|--------|--------|--------|
| 11 | **Factur-X via Pennylane PA (skill `pennylane-pa` déjà présent)** | Tech + Business | 12-15j | Moat conformité + +30€/mois Pro = 360€/an/artisan upsell |
| 12 | **Avis clients vérifiés** (post-chantier email auto + display vitrine) | Concurrence | 5-7j | Feature universelle marché (9/10 concurrents) |
| 13 | **MaPrimeRénov / CEE auto-intégré** (formulaire + suivi dossier) | Business | 8-10j | +50% CAC réduit sur métiers RGE |
| 14 | **Rate-limit Upstash Redis sur tous les endpoints publics IA** | Tech | 1j | Évite 240€/jour de surcoût Anthropic en cas d'abuse |
| 15 | **Suivi chantier timeline + photos client** (gap concurrence majeur) | Concurrence + UX | 7-10j | Différenciant fort vs 8/10 concurrents qui ne l'ont pas |
| 16 | **Programme parrainage artisan (15€/filleul Bativio crédit)** | Business | 3-5j | CAC <30€, viralité network |
| 17 | **Validateur post-IA devis** (sanity check `qte × puHt = totalHt` + range catalogue) | Tech | 1.5j | Évite envoi devis halluciné Opus 50K€ |
| 18 | **Comparateur multi-devis client** (3 devis reçus côte à côte) | UX | 4j | Killer Habitatpresto, gap actuel Bativio |
| 19 | **Repricing Business 59€ → 79€** une fois Factur-X livré | Business | 0j (juste prix) | +34% revenu sur tier Business |
| 20 | **Vitrine sheet mobile (modal sans nav lourde)** type Planity | UX | 3j | UX best-in-class, conversion sheet vs page |

### 🧹 Hygiène (impact bas, effort bas) — **EN PASSANT**

- Sentry + Logflare/Axiom monitoring (Tech, 0.5j)
- Archivage PDF devis (Cloudinary raw upload après génération, Tech, 1j)
- Blur placeholder `next/image` sur PhotoGallery (Tech, 0.5j)
- Fix `BeforeAfterGallery` qui ignore `Photo.paireId` du schema (Tech, 0.5j)
- Magic-link only à l'inscription (skip mot de passe forcé) (UX, 1j)
- Inscription mobile `repeat(3,1fr) → repeat(2,1fr) <640px` (UX, 5 min)
- Progress bar `/demande` honnête (5/5 vraie progression) (UX, 30 min)
- PDF devis embarquer Fraunces (cohérence avec web) (UX, 1j)
- Réviser `claude-sonnet-4-20250514` modèle déprécié → `MODEL_SONNET` constant (Tech, 5 min)

### ❌ Pièges (impact bas, effort haut) — **NE PAS FAIRE**

| # | Idée à NE PAS faire | Raison |
|---|---------------------|--------|
| A | **Chat WebSocket temps réel artisan-client** | 50€/mois Pusher minimum, complexité serverless Vercel, ROI faible vs polling 30s |
| B | **App mobile native iOS+Android** | 80-150 jours dev, PWA déjà OK, attendre 1 000+ artisans pour justifier |
| C | **Marketplace matériaux (Manomano-style)** | Hors scope, partenariat ManoMano API plus rationnel |
| D | **Bativio Academy (formation gestion)** | Mauvais usage des forces (tech) vs production de contenu (marketing) |
| E | **Vidéos artisan dans vitrine via Cloudinary video plan +99€/mois** | YouTube embed gratuit suffit (analyse coût Tech) |
| F | **Re-écriture en monorepo / micro-services Spring Boot** | Stack actuelle Next.js 16 saine, pas de besoin |
| G | **Internationalisation (Belgique, Espagne)** avant 1 000 artisans ARA | Dilution focus, le marché Rhône-Alpes seul = 23 M€ ARR adressable |

---

## 3. Roadmap 90 jours

### **Semaines 1-2 (sprint bugs critiques)**
- ✅ Tous les Quick wins (10 actions, ~3h dev cumulé)
- ✅ Rate-limit Upstash Redis sur 3 endpoints publics IA
- ✅ Démarrer setup Pennylane PA (compte développeur, sandbox)
- ✅ Setup Sentry + Logflare (visibilité prod)
- ✅ Fix middleware → proxy Next 16 (déjà fait dans cette session)
- 📦 Deploy 1 par jour minimum, monitoring actif

### **Mois 1 (5 features killer priorisées)**
1. **Avis clients vérifiés** — 7 jours, gap concurrence universel
2. **Suivi chantier timeline + photos** — 10 jours, gap 8/10 concurrents
3. **Comparateur multi-devis client** — 4 jours, killer Habitatpresto
4. **Validateur post-IA devis** — 1.5 jours, sécurise output Opus
5. **Programme parrainage artisan** — 3 jours, lever CAC

**Livrable mois 1** : Bativio passe de "annuaire + devis IA" à "annuaire + devis IA + suivi chantier + avis vérifiés + comparateur" = parité fonctionnelle avec Habitatpresto sur les essentiels.

### **Mois 2-3 (différenciation atypique)**
1. **Factur-X via Pennylane PA** — 12-15 jours étalés, **moat conformité 2026**
2. **MaPrimeRénov / CEE auto-intégré** — 8-10 jours, killer feature RGE
3. **Bundle "Conformité 2026"** Pro/Business : Factur-X + signature eIDAS + 16 mentions = repricing Business 59€ → 79€
4. **SEO scaling** : passer de 50 combos métier-ville à 200 (extension Drôme, Isère sud, Ain)
5. **Boost vitrine** (29€/mois upsell) + **lead urgence prioritaire** (9€/lead) = 2 features payantes additionnelles

**Livrable trimestre** : MRR cible M+3 = ~3 000€ (50 artisans payants) → trajectoire vers 1.4 M€ ARR M+36.

---

## 4. Top 10 features killer à implanter (final synthèse)

### #1 — Factur-X PA agréée (Pennylane partnership)

**Description** : Bativio devient PA officielle ou s'intègre comme client d'une PA agréée (Pennylane). Émission/réception factures électroniques au format Factur-X (PDF + XML embarqué) via API Pennylane. Conforme RFE 1er sept 2026.

**Concurrents qui l'ont** : **AUCUN benchmarké** (Habitatpresto, Travaux.com, IZI, ManoMano, AlloVoisins... aucun ne communique dessus). Fenêtre tir 4-12 mois.

**Effort** : 12-15 jours-homme (skill `pennylane-pa` déjà présent dans `.claude/skills/`)

**Impact business** : acquisition (réflexe d'achat artisan), rétention (lock-in conformité), monétisation (+30€/mois sur Pro/Business)

**Risque** : moyen — dépendance Pennylane qui peut changer pricing

**Stub code** :
```ts
// frontend/src/lib/facturx/index.ts
import { generateFacturX } from "@bativio/facturx-pennylane";
import { prisma } from "@/lib/prisma";

export async function emitFacture({ devisId }: { devisId: string }) {
  const devis = await prisma.devis.findUnique({ where: { id: devisId }, include: { artisan: true } });
  if (!devis) throw new Error("Devis introuvable");
  // Génère PDF Factur-X + XML CII 16931 + transmet via Pennylane PA
  const { factureUrl, xmlPayload, pennylaneId } = await generateFacturX({
    artisan: devis.artisan,
    devis,
    target: process.env.FACTURX_PA_ENDPOINT, // Pennylane sandbox/prod
  });
  await prisma.facture.create({
    data: { devisId, factureUrl, pennylaneId, statut: "ENVOYEE", emiseAt: new Date() },
  });
  return { factureUrl, pennylaneId };
}
```

### #2 — Avis clients vérifiés post-chantier

**Description** : Après acceptation d'un devis + flag chantier "TERMINE" par artisan, email auto au client J+7 demandant note 1-5 + commentaire vérifié. Affichage agrégé sur vitrine + score Google Rich Results.

**Concurrents qui l'ont** : 9/10 (Habitatpresto, Travaux, ManoMano, IZI, AlloVoisins, MesDépanneurs, Maison Saint-Gobain, Bobex, Quotatis). **GAP UNIVERSEL Bativio**.

**Effort** : 5-7 jours

**Impact** : trust score Google + conversion vitrine, prérequis pour entrer dans le top des Google Local Pack

**Stub code** :
```prisma
// schema.prisma - nouveau modèle Avis
model Avis {
  id          String   @id @default(cuid())
  artisanId   String
  artisan     Artisan  @relation(fields: [artisanId], references: [id], onDelete: Cascade)
  devisId     String   @unique  // 1 avis = 1 devis = vérifié
  devis       Devis    @relation(fields: [devisId], references: [id], onDelete: Cascade)
  note        Int      // 1-5
  commentaire String?  @db.Text
  reponseArtisan String? @db.Text
  publiqueAt  DateTime?
  source      String   @default("EMAIL_AUTO") // ou "MANUEL_ADMIN"
  createdAt   DateTime @default(now())

  @@index([artisanId, publiqueAt])
}
```

### #3 — Suivi chantier timeline (jalons + photos)

**Description** : Après acceptation devis, page client `/ma-demande/[token]` avec timeline 4 jalons (Devis accepté → Chantier démarré → 50% → Réception). À chaque jalon, l'artisan upload 1-3 photos + commentaire. Notification email/SMS client à chaque update.

**Concurrents qui l'ont** : ManoMano Pro (lancé 2025), Maison Saint-Gobain (partiel). 8/10 absents.

**Effort** : 7-10 jours

**Impact** : trust + différenciant fort + capture data chantier (utile pour avis vérifiés #2)

**Stub code** :
```prisma
model ChantierJalon {
  id           String      @id @default(cuid())
  chantierId   String
  chantier     Chantier    @relation(fields: [chantierId], references: [id], onDelete: Cascade)
  type         JalonType   // DEMARRAGE, MID, RECEPTION, INCIDENT
  description  String      @db.Text
  photos       Json        // urls Cloudinary
  notifiedAt   DateTime?
  createdAt    DateTime    @default(now())
  @@index([chantierId, createdAt])
}

enum JalonType {
  DEMARRAGE
  AVANCEMENT_50
  RECEPTION
  INCIDENT
}
```

### #4 — Comparateur multi-devis client

**Description** : Page client `/comparer/[demandeId]` qui affiche jusqu'à 5 devis reçus côte à côte (objet, total, durée, garantie, note artisan, distance). Highlight différences. Choix final 1-clic.

**Concurrents qui l'ont** : Habitatpresto (killer feature). 9/10 absents.

**Effort** : 4 jours

**Impact** : conversion client (la confiance vient du choix éclairé)

**Stub code** :
```tsx
// frontend/src/app/comparer/[demandeId]/page.tsx
export default async function CompareDevis({ params }: { params: Promise<{ demandeId: string }> }) {
  const { demandeId } = await params;
  const demande = await prisma.demandeProjet.findUnique({
    where: { id: demandeId },
    include: { devis: { include: { artisan: { include: { tarification: true } } } } },
  });
  if (!demande) notFound();
  return <CompareTable devis={demande.devis} />;
}
```

### #5 — MaPrimeRénov / CEE auto-intégré

**Description** : Sur les devis flaggés "RGE" (artisan certifié), formulaire automatique de simulation MaPrimeRénov + CEE selon revenus client. Devis affiche "Reste à charge réel : XXX€" au lieu de juste TTC. Génération du dossier ANAH pré-rempli.

**Concurrents qui l'ont** : aucun benchmarké explicitement (IZI by EDF mais via captif EDF). Vide marché.

**Effort** : 8-10 jours (intégration API ANAH + formulaire + simulateur)

**Impact** : acquisition client RGE (couvreur, chauffagiste, façadier) + CAC -50%

### #6 — Rate-limit Upstash Redis sur endpoints IA publics

**Description** : Protection des endpoints `/api/v1/public/chat-qualif`, `/estimation-live`, `/demandes-projets` contre abuse (1 attaquant peut brûler le compte Anthropic en quelques heures à 240€/jour).

**Effort** : 1 jour

**Impact** : sécu + coût (économie potentielle 7 200€/mois en cas d'attaque ciblée)

**Stub code** :
```ts
// frontend/src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
export const ipLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 h"), // 20 req/IP/h
  analytics: true,
  prefix: "rl:bativio:public",
});

// Usage dans /api/v1/public/chat-qualif/route.ts
const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
const { success } = await ipLimiter.limit(ip);
if (!success) return apiError("Trop de requêtes, réessayez dans 1 heure", 429);
```

### #7 — Programme parrainage artisan

**Description** : Chaque artisan inscrit reçoit un lien `bativio.fr/r/[code]`. Chaque filleul qui passe en STARTER+ → 30€ de crédit Bativio (= 1 mois STARTER offert au parrain). Affiché dans dashboard.

**Concurrents qui l'ont** : aucun benchmarké explicitement. Pattern Doctolib/Notion gagnant.

**Effort** : 3-5 jours

**Impact** : CAC <30€, viralité network, lever critique de "10 artisans actuels → 250 cibles M+12"

### #8 — Boost vitrine ville (mise en avant SERP interne)

**Description** : Pour 29€/mois supplémentaire, l'artisan apparaît en position 1-3 sur sa ville/métier dans `/lyon`, `/lyon/plombier`. Badge "En vedette" + CTA mis en évidence.

**Concurrents qui l'ont** : Habitatpresto label Or +50€/mois. Bativio peut faire moins cher mais mieux ciblé.

**Effort** : 3 jours (logique de tri + badge UI + facturation Stripe)

**Impact** : revenu additionnel ~23 200€/mois à 800 artisans (estimation Business)

### #9 — Validateur post-IA devis (sanity check)

**Description** : Avant envoi du devis IA généré par Opus 4.7 au client, validation server-side : `qte × puHt = totalHt` (arrondi 2 décimales), prix dans range catalogue ±20%, total cohérent avec estimation pre-devis ±30%. Si fail → retry 1× ou flag admin pour review.

**Concurrents qui l'ont** : N/A (Bativio est seul à faire devis IA chiffré)

**Effort** : 1.5 jour

**Impact** : évite scandale "devis halluciné 50K€ envoyé client" — sécurité juridique

**Stub code** :
```ts
// frontend/src/lib/agents/devis-validator.ts
export function validateDevisIA(devis: DevisIAOutput, catalogue: CataloguePrestation[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const ligne of devis.lignes ?? []) {
    const expected = Math.round(ligne.qte * ligne.puHt * 100) / 100;
    if (Math.abs(expected - ligne.totalHt) > 0.02) {
      errors.push(`Ligne "${ligne.label}" : ${ligne.qte} × ${ligne.puHt} ≠ ${ligne.totalHt}`);
    }
    const cat = catalogue.find((c) => ligne.label.toLowerCase().includes(c.designation.toLowerCase().slice(0, 20)));
    if (cat && (ligne.puHt < cat.prixHtBas * 0.8 || ligne.puHt > cat.prixHtHaut * 1.2)) {
      errors.push(`Ligne "${ligne.label}" : prix ${ligne.puHt}€ hors range catalogue ${cat.prixHtBas}-${cat.prixHtHaut}€`);
    }
  }
  return { valid: errors.length === 0, errors };
}
```

### #10 — Bundle "Conformité 2026" Pro+ (repricing Business)

**Description** : Une fois Factur-X (#1) + Validateur (#9) + 16 mentions PDF + signature avancée eIDAS livrés, emballer en bundle "Conformité Pro 2026" et **upper le tier Business de 59€ → 79€** (ou créer tier Business+ à 99€).

**Concurrents qui l'ont** : aucun ne propose un bundle conformité explicite

**Effort** : 0 jour code (juste prix) + emailing artisans existants pour upgrade

**Impact** : +34% revenu sur tier Business (+ 20€ × 4000 artisans M+36 = +80 K€/an)

---

## 5. Critique méta : où les 3 audits convergent / divergent

### Convergence forte (les 3 d'accord)

1. **Factur-X 2026 = priorité absolue** — UX (mention indirecte), Business (CRITIQUE), Tech (P0). C'est LE moat à 18 mois.
2. **Avis clients = gap universel** — Concurrence (9/10 l'ont), UX (manque trust), Business (prérequis Google Local).
3. **Devis IA est un vrai différenciant** — UX (innovation), Business (Bativio seul à faire ±10%), Tech (prompt caching efficace -42%).

### Divergence

| Sujet | UX dit | Business dit | Tech dit |
|-------|--------|--------------|----------|
| **Hero landing 2 CTA** | À fusionner en 1 (Doctolib pattern, +20%) | OK actuel, segmente bien client search vs project | Pas un problème tech |
| **Cloudinary signed upload** | À VÉRIFIER en live | N/A | **P0 vulnérabilité** — pollution compte possible |
| **Repricing Business 59€** | N/A | "Sous-vendu, monter à 79-99€" | Cohérent avec coût IA actuel |
| **Mobile native app** | Pas mentionné | "Roadmap futur" | "Piège, PWA suffit jusqu'à 1000+ artisans" |
| **Suivi chantier** | Killer feature manquante | Opportunité produit prio 8 | Pas mentionné techniquement |

**Verdict du CTO** :
- **UX a raison** sur Hero 1 CTA + sticky mobile (data Doctolib + Houzz solides)
- **Business a raison** sur priorité Factur-X + parrainage + repricing tactique
- **Tech a raison** sur Cloudinary lockdown (vraie faille sécu) + rate-limit IA (vraie économie)
- **Tech sur-priorise** Sentry vs **UX sur-priorise** PDF Fraunces — les deux peuvent attendre Q2

### Hallucinations détectées

- Aucune hallucination majeure. Les chiffres marché Business sont tous sourcés (FFB, CAPEB, France Travail BMO 2025).
- Tech a fait une erreur mineure : a écrit "audits UX/Business introuvables" alors qu'ils ont été produits en parallèle (timing — tous les agents lancés simultanément).

### Ce que les 3 audits ont raté

- **Bug actif découvert dans cette synthèse** : Next.js 16 a déprécié `middleware.ts` → renommé en `proxy.ts`. Détecté dans les logs preview_logs lors du démarrage du dev server. Fix appliqué.
- **Vitest watch n'est pas un dev server long-running** (sort après tests). Remplacé par Vitest UI mode dans `.claude/launch.json`.

---

## 6. État dev environment (servers actifs)

| Server | Port | Status | Usage |
|--------|------|--------|-------|
| Bativio frontend (Next.js 16 dev) | 3000 | ✅ running | http://localhost:3000 |
| Bativio Prisma Studio (DB GUI) | 5555 | ✅ running | http://localhost:5555 |
| Bativio Vitest UI (tests web) | 51204 | ⚠️ démarré mais non listé | npx vitest --ui |

**Tests** : 40/40 passent (`html-escape` 19 + `schema-types` 5 + `claude` 16).

---

## 7. Conclusion CTO — décision d'architecte

**Bativio peut faire 1 M€ ARR à 36 mois** — c'est faisable, mais l'exécution est sur 3 vecteurs simultanés :

1. **Tech** (semaines 1-2) : 4 fixes P0 + setup Pennylane PA
2. **Produit** (mois 1) : 5 features killer (avis vérifiés, suivi chantier, comparateur, validateur IA, parrainage)
3. **Acquisition** (continu) : densifier ARA à 250 artisans M+12 via SEA + partenariats CAPEB locaux + parrainage

**Le seul vrai risque** = acquisition trop lente vs Habitatpresto/Google Local Pack. La tech est saine, le produit est différencié, les marges sont confortables (75-92% à partir de 100 artisans). Le moat Factur-X est unique et expire dans 12 mois — **ça doit être livré pour le 1er sept 2026 sans exception**.

**Ne pas pivoter. Ship.**

---

**Fichiers livrés** :
- `audits/PHASE-0-CONTEXTE.md` (baseline projet)
- `audits/concurrence/MATRICE-FEATURES.md` (10 concurrents benchmarkés)
- `audits/agent-1-ux/RAPPORT-UX.md` (Designer Senior, note 6.6/10)
- `audits/agent-2-business/RAPPORT-BUSINESS.md` (PM Senior, verdict 1M€ ARR atteignable)
- `audits/agent-3-tech/RAPPORT-TECH.md` (Ghost CTO, ship + 4 fixes)
- `audits/synthese/SYNTHESE-CTO.md` (ce fichier)

