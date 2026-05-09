# Plan de création de pages — 12 semaines

**Document** : sprint backlog détaillé
**Période** : S+0 → S+12
**Volume cible total** : ~1010 nouvelles pages
**Cadence** : 200 pages/sem max (signal qualité Google)

---

## Sprint 1 (S+0 → S+1) — Quick wins indexation

**Objectif** : faire indexer le site et capturer 50 quick wins faciles.

### 1.1 Pages à créer (~80)

| URL | Type | Template | Mots-clés cibles | Priorité | Effort |
|---|---|---|---|---|---|
| `/savoie` | Hub département | `[departement]/page.tsx` (nouveau) | "artisan savoie", "annuaire artisans 73" | Très haute | M |
| `/haute-savoie` | Hub département | idem | "artisan haute-savoie", "annuaire artisans 74" | Très haute | M |
| `/isere` | Hub département | idem | "artisan isère", "annuaire artisans 38" | Très haute | M |
| `/rhone` | Hub département | idem | "artisan rhône", "annuaire artisans 69" | Très haute | M |
| `/drome` | Hub département | idem | "artisan drôme", "annuaire artisans 26" | Très haute | M |
| `/savoie/plombier` | Hub dept x métier | `[departement]/[metier]/page.tsx` | "plombier savoie" | Haute | S |
| `/savoie/electricien` | Hub dept x métier | idem | "electricien savoie" | Haute | S |
| `/savoie/macon` | Hub dept x métier | idem | "maçon savoie" | Haute | S |
| `/savoie/peintre` | Hub dept x métier | idem | "peintre savoie" | Haute | S |
| `/savoie/carreleur` | Hub dept x métier | idem | "carreleur savoie" | Haute | S |
| `/savoie/menuisier` | Hub dept x métier | idem | "menuisier savoie" | Haute | S |
| `/savoie/couvreur` | Hub dept x métier | idem | "couvreur savoie" | Haute | S |
| `/savoie/chauffagiste` | Hub dept x métier | idem | "chauffagiste savoie" | Haute | S |
| `/haute-savoie/{8 métiers}` | Hub dept x métier | idem | idem | Haute | S |
| `/isere/{8 métiers}` | Hub dept x métier | idem | idem | Haute | S |
| `/rhone/{8 métiers}` | Hub dept x métier | idem | idem | Haute | S |
| `/drome/{8 métiers}` | Hub dept x métier | idem | idem | Haute | S |
| `/guides/artisan-fiable` | Guide Tier 1 | `guides/[slug]/page.tsx` | "comment trouver un artisan fiable" | Très haute | L |
| `/guides/verifier-rge-artisan` | Guide Tier 1 | idem | "comment vérifier qu'un artisan est rge" | Très haute | L |
| `/guides/comparer-devis-travaux` | Guide Tier 1 | idem | "comment comparer 3 devis" | Très haute | L |
| `/guides/que-faire-fuite-eau` | Guide Tier 1 | idem | "que faire en cas de fuite d'eau" | Très haute | L |
| `/guides/maprimerenov-2026` | Guide Tier 1 | idem | "maprimerenov 2026 conditions" | Très haute | L |

Total Sprint 1 : 5 hubs département + 40 hub dept×métier + 5 guides = **50 pages structurelles**.
Plus enrichissement des 30 pages existantes (Schema, FAQ, maillage interne) = **80 pages touchées**.

### 1.2 Briefs de contenu — Top 5 stratégiques

#### Brief 1 — `/savoie`

- **H1** : "Artisans du bâtiment en Savoie (73) — Annuaire vérifié Bativio"
- **Meta title** (60 c) : "Artisans Savoie (73) : annuaire vérifié et avis | Bativio"
- **Meta description** (150 c) : "Trouvez un artisan vérifié en Savoie : SIRET, RGE et décennale contrôlés. Plombiers, électriciens, maçons sur Chambéry, Aix-les-Bains, Albertville."
- **Structure H2 obligatoire** :
  - H2 "Tous les métiers en Savoie" (liste des 8 métiers avec lien `/savoie/{metier}`)
  - H2 "Villes principales du département" (Chambéry, Aix-les-Bains, Albertville, Saint-Jean-de-Maurienne, Bourg-Saint-Maurice avec lien)
  - H2 "Pourquoi choisir un artisan vérifié Bativio en Savoie"
  - H2 "Aides à la rénovation en Savoie 2026" (MaPrimeRénov, éco-PTZ, aides régionales AURA)
  - H2 "Questions fréquentes" (FAQ Schema)
- **Mots-clés à placer** : "savoie", "73", "artisan", "annuaire", "RGE", "vérifié", "Chambéry", "Auvergne-Rhône-Alpes"
- **Schema.org** : `BreadcrumbList` + `CollectionPage` + `FAQPage`
- **Maillage interne** : `/chambery`, `/savoie/plombier`, `/savoie/electricien`, `/guides/artisan-fiable`, `/maprimerenov`
- **Longueur cible** : 1200 mots

#### Brief 2 — `/savoie/plombier`

- **H1** : "Plombier en Savoie (73) — Annuaire vérifié Bativio"
- **Meta title** : "Plombier Savoie (73) : artisans vérifiés et avis | Bativio"
- **Meta description** : "Trouvez un plombier en Savoie : SIRET, RGE et assurance vérifiés. Devis gratuits sur Chambéry, Aix-les-Bains, Albertville et toutes les communes."
- **Structure H2** :
  - H2 "Plombiers à Chambéry" (top 5 avec liens fiches)
  - H2 "Plombiers à Aix-les-Bains, Albertville et autres villes"
  - H2 "Tarifs plombier en Savoie en 2026" (lien `/prix/plombier`)
  - H2 "Plombier d'urgence en Savoie 24h/24"
  - H2 "Comment choisir un plombier RGE en Savoie"
  - H2 FAQ
- **Schema** : `ItemList` + `LocalBusiness` (chaque artisan listé) + `FAQPage`
- **Maillage** : `/chambery/plombier`, `/aix-les-bains/plombier` (S+2), `/prix/plombier`, `/guides/que-faire-fuite-eau`, `/savoie`
- **Longueur** : 1000 mots

#### Brief 3 — `/guides/artisan-fiable`

- **H1** : "Comment trouver un artisan fiable en 2026 : guide complet"
- **Meta title** : "Trouver un artisan fiable : guide complet 2026 | Bativio"
- **Meta description** : "10 critères pour reconnaître un artisan fiable : SIRET, RGE, décennale, avis, devis. Évitez les arnaques et choisissez en confiance avec Bativio."
- **Structure H2** :
  - H2 "Pourquoi 1 client sur 3 se sent floué par un artisan" (intro)
  - H2 "Vérifier le SIRET (en 30 secondes)" — HowTo schema
  - H2 "Vérifier le label RGE" — HowTo schema avec lien `/guides/verifier-rge-artisan`
  - H2 "L'assurance décennale : ce qu'il faut savoir"
  - H2 "Décrypter un devis : les 9 mentions obligatoires"
  - H2 "Les avis Google : comment les lire vraiment"
  - H2 "Le bouche-à-oreille local : encore un signal fort"
  - H2 "Méfiez-vous : les 5 red flags d'un mauvais artisan"
  - H2 "Comment Bativio vérifie chaque artisan"
  - H2 "Questions fréquentes"
- **Schema** : `Article` + `HowTo` (sur les sections de vérification) + `FAQPage`
- **Maillage** : `/guides/verifier-rge-artisan`, `/guides/comparer-devis-travaux`, `/guides/recours-malfacon` (S+8), `/savoie`, `/prix/plombier`, `/inscription`
- **Longueur** : 2500 mots
- **Source à citer** : service-public.gouv.fr (article SIRET), France Rénov', ANAH

#### Brief 4 — `/guides/maprimerenov-2026`

- **H1** : "MaPrimeRénov 2026 : conditions, montants, démarche complète"
- **Meta title** : "MaPrimeRénov 2026 : conditions et montants 2026 | Bativio"
- **Meta description** : "MaPrimeRénov 2026 : qui peut en bénéficier, montants par revenu, démarches en ligne. Tout savoir avant de lancer vos travaux de rénovation énergétique."
- **Structure H2** :
  - H2 "MaPrimeRénov 2026 en 3 phrases" (TL;DR)
  - H2 "Qui peut en bénéficier en 2026"
  - H2 "Les montants par tranche de revenus (bleu, jaune, violet, rose)"
  - H2 "Les travaux éligibles 2026 (ITE, PAC, fenêtres, etc.)"
  - H2 "Pourquoi votre artisan doit être RGE"
  - H2 "DPE obligatoire : ce qui change en 2026"
  - H2 "Rénovation d'ampleur vs travaux par geste"
  - H2 "Cumul avec CEE, éco-PTZ et TVA 5,5"
  - H2 "Démarche pas à pas (5 étapes)" — HowTo schema
  - H2 "Erreurs fréquentes qui font rejeter le dossier"
  - H2 FAQ (10 questions)
- **Schema** : `Article` + `HowTo` + `FAQPage`
- **Maillage** : `/guides/verifier-rge-artisan`, `/guides/dpe-obligatoire-2026` (S+8), `/maprimerenov`, `/savoie`, `/prix/plombier`
- **Longueur** : 2500 mots
- **Sources** : france-renov.gouv.fr, anah.fr, économie.gouv.fr

#### Brief 5 — `/guides/que-faire-fuite-eau`

- **H1** : "Fuite d'eau : que faire en urgence ? Le guide pas à pas"
- **Meta title** : "Fuite d'eau : que faire ? Guide d'urgence 2026 | Bativio"
- **Meta description** : "Fuite d'eau dans votre logement ? 6 gestes immédiats avant l'arrivée du plombier, comment couper l'arrivée d'eau, qui appeler en urgence."
- **Structure H2** :
  - H2 "En 30 secondes : couper l'arrivée d'eau" — HowTo (étapes : compteur général, robinet d'arrêt logement, vanne sous évier)
  - H2 "Les 6 gestes immédiats avant le plombier" — HowTo
  - H2 "Quand appeler le plombier d'urgence (et quand attendre demain matin)"
  - H2 "Combien coûte un plombier d'urgence en 2026"
  - H2 "Fuite chez le voisin du dessus : qui paie"
  - H2 "Déclarer le sinistre à l'assurance habitation"
  - H2 "Comment éviter les arnaques au plombier d'urgence"
  - H2 FAQ
  - H2 "Trouver un plombier vérifié près de chez vous" (CTA géoloc)
- **Schema** : `Article` + `HowTo` + `FAQPage`
- **Maillage** : `/prix/plombier`, `/{ville}/plombier-urgence` (S+5), `/urgence`, `/guides/plombier-urgence-arnaque` (S+7)
- **Longueur** : 1800 mots

---

## Sprint 2 (S+1 → S+2) — Communes Chambéry + Annecy bassin

**Objectif** : ouvrir 200 pages sur les bassins Chambéry (Savoie) + Annecy (Haute-Savoie).

### 2.1 Pages à créer (~200)

Communes ciblées (extrait du fichier 04 — bassin Chambéry/Aix-les-Bains et bassin Annecy/Annemasse) :

**Bassin Chambéry (12 communes × 8 métiers = 96 pages)** :
Aix-les-Bains, La Motte-Servolex, Cognin, Bissy, Bassens, Barberaz, Saint-Alban-Leysse, Sonnaz, Vimines, Jacob-Bellecombette, Challes-les-Eaux, La Ravoire.

**Bassin Annecy (13 communes × 8 métiers = 104 pages)** :
Annecy-le-Vieux, Cran-Gevrier, Seynod, Meythet, Pringy, Argonay, Poisy, Metz-Tessy, Chavanod, Annemasse, Cluses, Sallanches, Thonon-les-Bains.

### 2.2 Template à industrialiser

`src/app/[ville]/[metier]/page.tsx` étendu pour générer dynamiquement chaque commune via `generateStaticParams` qui lit la liste depuis `lib/communes.ts` (à créer à partir du fichier 04).

Données injectées par commune :
- Population INSEE
- Code postal
- Distance à la ville hub
- Intercommunalité
- 1-2 faits locaux (lac d'Annecy, thermes d'Aix, etc.)
- Liste des artisans inscrits desservant la zone (ou placeholder qualifié si vide en V1)

### 2.3 Briefs de contenu — Top 3 stratégiques

#### Brief 1 — `/aix-les-bains/plombier`

- **H1** : "Plombier à Aix-les-Bains (73100) — Artisans vérifiés Bativio"
- **Meta title** : "Plombier Aix-les-Bains : artisans vérifiés et devis | Bativio"
- **Meta description** : "Plombier à Aix-les-Bains (73100) : SIRET, RGE et décennale vérifiés. Devis gratuits, urgences 24h/24, artisans à proximité du lac du Bourget."
- **Structure H2** :
  - H2 "Plombiers vérifiés à Aix-les-Bains" (liste artisans)
  - H2 "Aix-les-Bains : 30 000 habitants, code postal 73100, à 14 km de Chambéry"
  - H2 "Tarifs plombier à Aix-les-Bains 2026" (lien `/prix/plombier/aix-les-bains` quand créé S+6)
  - H2 "Urgence plombier 24h/24 à Aix-les-Bains"
  - H2 "Communes desservies autour d'Aix-les-Bains" (Drumettaz, Méry, Tresserve, Brison-Saint-Innocent...)
  - H2 FAQ
- **Schema** : `LocalBusiness` (par artisan listé) + `Place` + `BreadcrumbList` + `FAQPage`
- **Maillage** : `/savoie/plombier`, `/chambery/plombier`, `/aix-les-bains/electricien`, `/prix/plombier`, `/guides/que-faire-fuite-eau`
- **Longueur** : 800 mots

#### Brief 2 — `/annecy-le-vieux/plombier`

- **H1** : "Plombier à Annecy-le-Vieux (74940) — Artisans vérifiés Bativio"
- **Meta description** : "Plombier à Annecy-le-Vieux (74940) : artisans vérifiés à 4 km du centre d'Annecy. Devis gratuit, intervention rapide."
- **Spécificités** : Annecy-le-Vieux est techniquement intégré à Annecy depuis 2017 → mentionner explicitement dans le contenu pour matcher l'intent utilisateur historique. Maillage fort vers `/annecy/plombier`.
- **Longueur** : 800 mots

#### Brief 3 — `/seynod/plombier`

- **H1** : "Plombier à Seynod (74600) — Artisans vérifiés Bativio"
- **Spécificités** : Seynod = ancienne commune fusionnée avec Annecy en 2017. Volume Suggest faible (1 suggestion Yahoo : "plombier seynod 74") → page facile à ranker. Maillage vers `/annecy/plombier`.
- **Longueur** : 700 mots

---

## Sprint 3 (S+2 → S+3) — Communes Grenoble + Lyon agglo

**Objectif** : 200 pages sur le bassin Grenoble (Isère) + Lyon agglo proche.

### 3.1 Pages à créer

**Bassin Grenoble (13 communes × 8 métiers = 104 pages)** :
Échirolles, Saint-Martin-d'Hères, Meylan, Eybens, Fontaine, Gières, Seyssins, Seyssinet-Pariset, La Tronche, Saint-Égrève, Saint-Martin-le-Vinoux, Sassenage, Pont-de-Claix.

**Lyon agglo proche (12 communes × 8 métiers = 96 pages)** :
Villeurbanne, Vénissieux, Bron, Caluire-et-Cuire, Vaulx-en-Velin, Saint-Priest, Décines-Charpieu, Meyzieu, Rillieux-la-Pape, Oullins, Sainte-Foy-lès-Lyon, Tassin-la-Demi-Lune.

### 3.2 Briefs Top 3

#### Brief 1 — `/villeurbanne/plombier`

- **H1** : "Plombier à Villeurbanne (69100) — Artisans vérifiés Bativio"
- **Meta description** : "Plombier à Villeurbanne (69100) : SIRET et décennale vérifiés. Tarifs 2026, urgences 24h/24, intervention rapide quartier Gratte-Ciel."
- **Spécificités** : Suggest Google retourne "plombier villeurbanne gratte ciel" → mentionner le quartier Gratte-Ciel. 152k habitants = volume fort.
- **Longueur** : 1000 mots (commune dense, méritent contenu plus riche)

#### Brief 2 — `/echirolles/plombier`

- **Spécificité** : 36k habitants, 2e ville de l'agglo Grenoble. Code postal 38130. Suggest faible → ranker rapide.

#### Brief 3 — `/saint-martin-dheres/plombier`

- **Spécificité** : 38400, université Grenoble Alpes (audience étudiants/locataires). 38k habitants.

---

## Sprint 4 (S+3 → S+4) — Lyon arrondissements + Valence bassin

**Objectif** : 200 pages — capture des intents très volumiques (`plombier lyon 7`).

### 4.1 Pages à créer

**Lyon arrondissements (9 arr. × 8 métiers = 72 pages)** :
`/lyon-1/plombier`, `/lyon-2/plombier`, ..., `/lyon-9/plombier` × 8 métiers.

**Bassin Valence (16 communes × 8 métiers = 128 pages)** :
Bourg-lès-Valence, Portes-lès-Valence, Guilherand-Granges, Saint-Marcel-lès-Valence, Beaumont-lès-Valence, Romans-sur-Isère, Bourg-de-Péage, Tain-l'Hermitage, Tournon-sur-Rhône, Châteauneuf-sur-Isère, Crest, Loriol-sur-Drôme, Livron-sur-Drôme, Pierrelatte, Montélimar, Nyons.

### 4.2 Briefs Top 3

#### Brief 1 — `/lyon-7/plombier`

- **H1** : "Plombier Lyon 7e arrondissement (69007) — Artisans vérifiés"
- **Meta description** : "Plombier Lyon 7e (Guillotière, Jean Macé, Gerland) : SIRET et RGE vérifiés. Devis gratuit, urgences 24h/24."
- **Spécificités** : Suggest Google = "plombier lyon 7" 1ère position → forte demande. Mentionner quartiers Guillotière, Jean Macé, Gerland.
- **Schema** : `LocalBusiness` + `Place` (avec `containedInPlace` Lyon)
- **Longueur** : 900 mots

#### Brief 2 — `/lyon-3/plombier`

- **Spécificité** : Suggest "plombier lyon 3" très fort. Quartiers Part-Dieu, Montchat, Préfecture.

#### Brief 3 — `/bourg-les-valence/plombier`

- **Spécificité** : Suggest "plombier bourg les valence" 4-5 suggestions = signal volume modéré. Bonne opportunité.

---

## Sprint 5 (S+4 → S+5) — Modificateurs urgence + RGE

**Objectif** : 50 pages capturant des intents transactionnels forts.

### 5.1 Pages à créer

**Urgence (5 villes × 5 métiers = 25 pages)** :
`/{ville}/plombier-urgence`, `/{ville}/electricien-urgence`, `/{ville}/serrurier-urgence`, `/{ville}/chauffagiste-urgence`, `/{ville}/couvreur-urgence`. Pour : chambery, annecy, grenoble, lyon, valence.

**RGE (5 villes × 5 métiers = 25 pages)** :
`/{ville}/{metier}-rge` pour les métiers éligibles MaPrimeRénov : plombier, electricien, chauffagiste, menuisier, isolation. Sur les 5 villes.

### 5.2 Briefs Top 3

#### Brief 1 — `/chambery/plombier-urgence`

- **H1** : "Plombier d'urgence à Chambéry — 24h/24, 7j/7"
- **Meta title** : "Plombier urgence Chambéry 24h/24 : tarifs et avis | Bativio"
- **Meta description** : "Plombier urgence à Chambéry 24h/24 et 7j/7 : tarifs transparents, intervention rapide, artisans vérifiés Bativio. Évitez les arnaques."
- **Structure H2** :
  - H2 "Plombiers d'urgence vérifiés à Chambéry" (liste)
  - H2 "Tarifs plombier urgence à Chambéry 2026" (semaine, soir, dimanche, jour férié)
  - H2 "Que faire avant l'arrivée du plombier" (lien `/guides/que-faire-fuite-eau`)
  - H2 "Comment éviter l'arnaque plombier urgence à Chambéry"
  - H2 "Devis obligatoire en urgence : ce que dit la loi"
  - H2 FAQ
- **Schema** : `Service` + `LocalBusiness` + `FAQPage`
- **Maillage** : `/chambery/plombier`, `/guides/que-faire-fuite-eau`, `/guides/plombier-urgence-arnaque` (S+7), `/prix/plombier`
- **Longueur** : 1200 mots

#### Brief 2 — `/chambery/plombier-rge`

- **H1** : "Plombier RGE à Chambéry — Artisans certifiés MaPrimeRénov"
- **Meta description** : "Plombier RGE à Chambéry : qualifications Qualibat, Qualigaz, Qualifelec vérifiées. Eligible MaPrimeRénov, CEE, éco-PTZ. Devis gratuit."
- **Structure** :
  - H2 "Plombiers RGE vérifiés à Chambéry"
  - H2 "Pourquoi RGE est obligatoire pour MaPrimeRénov"
  - H2 "Qualibat, Qualigaz, Qualifelec : quelle qualification pour quels travaux"
  - H2 "Les aides 2026 si votre plombier est RGE" (cumul MaPrimeRénov + CEE + TVA 5,5)
  - H2 "Comment vérifier le RGE de votre plombier" (lien `/guides/verifier-rge-artisan`)
- **Maillage** : `/chambery/plombier`, `/guides/verifier-rge-artisan`, `/guides/maprimerenov-2026`, `/maprimerenov`
- **Longueur** : 1100 mots

#### Brief 3 — `/lyon/serrurier-urgence`

- **Spécificité** : forum 05 = arnaques serrurier urgence très médiatisées. Page = pédagogique sur le piège, pas que listing artisans. Trafic à fort taux de clic.

---

## Sprint 6 (S+5 → S+6) — Prix par ville x métier

**Objectif** : 50 pages qui capturent l'intent transactionnel "prix" déjà en bas du funnel.

### 6.1 Pages à créer

`/prix/{metier}/{ville}` pour 5 métiers x 5 villes (25 combos) + 5 métiers x les 5 communes secondaires les plus fortes par ville hub (25 combos) = 50.

Métiers : plombier, electricien, peintre, carreleur, menuisier.

Villes principales : chambery, annecy, grenoble, lyon, valence.
Communes secondaires fortes : aix-les-bains, annecy-le-vieux, villeurbanne, echirolles, bourg-les-valence.

### 6.2 Briefs Top 3

#### Brief 1 — `/prix/plombier/chambery`

- **H1** : "Tarif plombier à Chambéry en 2026 : prix et devis"
- **Meta title** : "Prix plombier Chambéry 2026 : tarifs horaires et devis | Bativio"
- **Meta description** : "Tarif plombier Chambéry 2026 : prix horaire, déplacement, urgence. Comparez les devis de plombiers vérifiés. Économisez jusqu'à 30%."
- **Structure H2** :
  - H2 "Tarif horaire plombier à Chambéry en 2026" (tableau prix moyen, fourchette basse/haute)
  - H2 "Tarif déplacement plombier Chambéry"
  - H2 "Prix interventions courantes" (fuite, chauffe-eau, débouchage WC, robinetterie...)
  - H2 "Tarif plombier urgence à Chambéry" (majoration soir, dimanche, jours fériés)
  - H2 "Pourquoi les tarifs varient autant entre 2 plombiers"
  - H2 "Comparer 3 devis avant de signer" (lien `/guides/comparer-devis-travaux`)
  - H2 FAQ
- **Schema** : `Article` + `Offer` (par tâche) + `FAQPage`
- **Maillage** : `/chambery/plombier`, `/prix/plombier`, `/guides/comparer-devis-travaux`, `/guides/negocier-devis` (S+7)
- **Longueur** : 1500 mots

#### Brief 2 — `/prix/electricien/lyon`

- **Spécificité** : marché Lyon = prix plus élevés qu'agglo. Mention spéciale "Lyon vs Villeurbanne vs banlieue".

#### Brief 3 — `/prix/peintre/annecy`

- **Spécificité** : marché Annecy = saisonnalité forte (printemps/automne). Mention.

---

## Sprint 7 (S+6 → S+7) — Guides Top 25

**Objectif** : 25 articles longs Tier 1 + 2 du fichier 05 (rangs 6 à 30).

### 7.1 Pages à créer

(rangs 1-5 déjà créés en S+1)

| Rang | Slug | Tier |
|---|---|---|
| 6 | `/guides/que-faire-fuite-eau` | Tier 1 (déjà S+1) |
| 7-15 | `/guides/{slug}` Tier 1 restants | Tier 1 |
| 16-30 | Tier 2 | Tier 2 |

Liste à créer Sprint 7 (25 guides) :
`/guides/negocier-devis`, `/guides/acompte-travaux-legal`, `/guides/recours-malfacon-artisan`, `/guides/garanties-travaux`, `/guides/pompe-chaleur-vs-gaz`, `/guides/ite-vs-iti`, `/guides/artisan-disparu-recours`, `/guides/verifier-siret-artisan`, `/guides/tva-reduite-travaux`, `/guides/reception-chantier-reserves`, `/guides/mise-en-demeure-artisan`, `/guides/porter-plainte-artisan`, `/guides/mediateur-consommation-batiment`, `/guides/plombier-urgence-arnaque`, `/guides/serrurier-urgence-prix`, `/guides/devis-non-signe-travaux`, `/guides/annuler-devis-travaux`, `/guides/travail-noir-risques`, `/guides/artisan-refuse-facture`, `/guides/labels-qualibat-qualifelec`, `/guides/artisan-ae-vs-societe`, `/prix/menuisier/fenetres`, `/prix/isolation/combles`, `/prix/carreleur/pose-50m2`, `/prix/peintre/appartement`.

### 7.2 Briefs Top 3

#### Brief 1 — `/guides/recours-malfacon-artisan`

- **H1** : "Travaux mal faits : recours, garanties et démarches en 2026"
- **Meta description** : "Travaux mal faits par un artisan : 7 recours possibles, garantie décennale, mise en demeure, médiateur. Guide complet 2026 avec modèles."
- **Structure H2** :
  - H2 "Identifier la malfaçon : critères et délais"
  - H2 "Étape 1 : signaler par écrit (modèle inclus)"
  - H2 "Étape 2 : mise en demeure (modèle PDF)"
  - H2 "Étape 3 : médiateur de la consommation BTP"
  - H2 "Garantie décennale : comment l'activer"
  - H2 "Garantie biennale et parfait achèvement"
  - H2 "Tribunal de proximité ou de grande instance"
  - H2 "Coût d'une expertise judiciaire"
  - H2 FAQ
- **Schema** : `Article` + `HowTo` + `FAQPage`
- **Sources** : service-public.gouv.fr, signal.conso.gouv.fr, capeb.fr
- **Longueur** : 2500 mots

#### Brief 2 — `/guides/negocier-devis`

- Bouton de conversion fort + USP Bativio mis en avant.
- 1800 mots.

#### Brief 3 — `/guides/pompe-chaleur-vs-gaz`

- Schema `Article` + tableau comparatif HTML. 2200 mots.

---

## Sprint 8 (S+7 → S+8) — Guides Top 26-50

**Objectif** : 25 articles Tier 2/3 (rangs 31-50 du fichier 05) + finalisation maillage.

### 8.1 Pages à créer

Voir Tier 2/3 dans `/seo/research/05-intentions-forums.md` section I.

Slugs : `/guides/eco-ptz-comment-obtenir`, `/guides/travaux-supplementaires-devis`, `/guides/artisan-local-vs-loin`, `/guides/avis-google-vs-bao`, `/guides/premier-rdv-artisan`, `/guides/dpe-obligatoire-2026`, `/guides/renovation-ampleur`, `/guides/permis-vs-declaration`, `/guides/ouvrir-mur-porteur`, `/guides/vivre-pendant-travaux`, `/guides/fournir-materiaux-soi-meme`, `/guides/maitre-oeuvre-vs-architecte`, `/guides/expertise-judiciaire-travaux`, `/guides/norme-electrique-renovation`, `/guides/baignoire-en-douche-italienne`, `/guides/fissures-murs-grave`, `/guides/humidite-remontees-capillaires`, + 8 micro-guides sectoriels.

### 8.2 Brief stratégique — `/guides/dpe-obligatoire-2026`

- **H1** : "DPE 2026 : obligatoire avant travaux MaPrimeRénov ?"
- **Meta description** : "DPE 2026 : conditions, obligation pour MaPrimeRénov, prix, validité. Tout ce qui change pour les propriétaires en 2026."
- **Schema** : `Article` + `FAQPage`
- **Maillage** : `/guides/maprimerenov-2026`, `/guides/renovation-ampleur`, `/maprimerenov`
- **Longueur** : 1800 mots

---

## Sprint 9 (S+8 → S+9) — Hub + comparatifs offensifs

**Objectif** : 10 hubs département (ré-enrichissement) + 10 comparatifs/alternatives.

### 9.1 Pages à créer

**Comparatifs (10 nouveaux à ajouter aux 5 existants)** :
- `/comparatif/bativio-vs-pagesjaunes`
- `/comparatif/bativio-vs-travaux-com`
- `/comparatif/bativio-vs-habitatpresto`
- `/comparatif/bativio-vs-bilik`
- `/comparatif/bativio-vs-lesbonsartisans`
- `/comparatif/bativio-vs-starofservice`
- `/comparatif/bativio-vs-obat`
- `/comparatif/bativio-vs-123devis`
- `/comparatif/bativio-vs-allotravaux`
- `/comparatif/bativio-vs-hemea`

### 9.2 Brief stratégique — `/comparatif/bativio-vs-pagesjaunes`

- **H1** : "Bativio vs PagesJaunes : quelle plateforme pour trouver un artisan en 2026 ?"
- **Meta title** : "Bativio vs PagesJaunes : comparatif 2026 | Bativio"
- **Meta description** : "Bativio vs PagesJaunes : prix, vérification artisan, avis, géo, paiement. Comparatif honnête pour choisir la bonne plateforme en 2026."
- **Structure H2** :
  - H2 "Tableau comparatif en 30 secondes"
  - H2 "Vérification SIRET, RGE, décennale : qui contrôle vraiment"
  - H2 "Avis clients : authenticité et signalement"
  - H2 "Couverture géographique : national vs Rhône-Alpes"
  - H2 "Tarification artisans"
  - H2 "Devis gratuit pour le client"
  - H2 "Notre verdict honnête"
  - H2 FAQ
- **Schema** : `Article` + `FAQPage` + `Review` (auto-référent prudent : Bativio review de soi vs concurrent)
- **Ton** : factuel, pas de bashing, mettre en avant les faits différenciateurs (vérification, couverture régionale fine, GEO/AEO).
- **Longueur** : 1500 mots

---

## Sprint 10 (S+9 → S+10) — Quartiers intramuros

**Objectif** : 100 pages quartier × métier sur Lyon, Grenoble, Chambéry — espace que personne n'occupe.

### 10.1 Pages à créer

**Lyon quartiers (10 quartiers × 5 métiers = 50 pages)** :
Croix-Rousse, Vieux-Lyon, Confluence, Part-Dieu, Guillotière, Monchat, Gerland, Vaise, Saint-Just, Brotteaux.

**Grenoble quartiers (8 × 5 = 40 pages)** :
Berriat, Hyper-Centre, Île Verte, Capuche, Vigny-Musset, Mistral, Beauvert, Reynies.

**Chambéry quartiers (4 × 5 = 20 pages — car ville plus petite)** :
Centre-ville, Mâché, Bissy, Chambéry-le-Haut.

Total = 110 pages (cap à 100, restantes glissent S+11).

### 10.2 Brief stratégique — `/lyon/croix-rousse/plombier`

- **URL** : `/[ville]/[quartier]/[metier]` ou inscription comme commune ? Choix : `/lyon-croix-rousse/plombier` (plus court, style Bilik).
- **H1** : "Plombier à Lyon Croix-Rousse — Artisans vérifiés Bativio"
- **Spécificités** : quartier dense, immeubles anciens (forte demande sanitaires/chauffage). Mention de la pente, des canuts, du marché de la Croix-Rousse pour signal local.
- **Longueur** : 700 mots

---

## Sprint 11 (S+10 → S+11) — Travaux spécifiques

**Objectif** : 50 pages `/travaux/...` qui capturent l'intent technique précis (refection-toiture, isolation-combles, douche-italienne, ouverture-mur-porteur, etc.).

### 11.1 Pages à créer

Slugs (50 pages, basées sur Google Suggest + sous-tâches Travaux.com) :
- `/travaux/refection-toiture-{ville}` (5 villes)
- `/travaux/isolation-combles-{ville}` (5 villes)
- `/travaux/douche-italienne-{ville}` (5 villes)
- `/travaux/renovation-cuisine-{ville}` (5 villes)
- `/travaux/renovation-salle-de-bain-{ville}` (5 villes)
- `/travaux/ravalement-facade-{ville}` (5 villes)
- `/travaux/changement-fenetres-{ville}` (5 villes)
- `/travaux/installation-pompe-chaleur-{ville}` (5 villes)
- `/travaux/peinture-appartement-{ville}` (5 villes)
- `/travaux/tableau-electrique-{ville}` (5 villes)

### 11.2 Brief — `/travaux/renovation-salle-de-bain-chambery`

- **H1** : "Rénovation salle de bain à Chambéry : prix, artisans, démarche"
- **Meta description** : "Rénovation salle de bain Chambéry : prix au m², artisans vérifiés, douche italienne, baignoire, plomberie. Devis gratuit en 24h."
- **Structure** :
  - H2 "Prix rénovation salle de bain Chambéry 2026" (par m², par type)
  - H2 "Artisans vérifiés à Chambéry pour votre salle de bain"
  - H2 "Démarche : du devis à la réception"
  - H2 "Douche italienne, baignoire, sanitaires : choisir"
  - H2 "Aides MaPrimeAdapt seniors et accessibilité"
  - H2 FAQ
- **Schema** : `Service` + `Offer` + `FAQPage`
- **Maillage** : `/chambery/plombier`, `/chambery/carreleur`, `/prix/plombier/chambery`, `/guides/baignoire-en-douche-italienne`
- **Longueur** : 1500 mots

---

## Sprint 12 (S+11 → S+12) — Alternative + maillage

**Objectif** : 50 pages "alternative à" + audit + densification du maillage interne.

### 12.1 Pages à créer

**Alternative à (10 pages)** : `/alternative-a-pagesjaunes`, `/alternative-a-travaux-com`, `/alternative-a-habitatpresto`, `/alternative-a-bilik`, `/alternative-a-lesbonsartisans`, `/alternative-a-starofservice`, `/alternative-a-obat`, `/alternative-a-123devis`, `/alternative-a-allotravaux`, `/alternative-a-hemea`.

**Pages prix complémentaires (20 pages)** : `/prix/{metier}/aix-les-bains`, etc. — 20 combos manquants à compléter pour avoir une matrice complète prix × ville.

**Pages services Bativio (5 pages)** : `/services/verification-artisan`, `/services/garantie-bativio`, `/services/mediation-litige`, `/services/devis-comparable`, `/services/chat-securise`.

**Quartiers reliquat (15 pages)** : ce qui n'a pas tenu en S+10.

### 12.2 Travaux de densification maillage

- Ajouter dans chaque guide un encadré "Voir aussi" listant 5 guides connexes.
- Ajouter dans chaque page ville un encadré "Communes voisines" linkant 8 communes du même bassin.
- Ajouter dans chaque page métier un footer "Métiers complémentaires" linkant les métiers proches (plombier ↔ chauffagiste ↔ électricien).
- Sitemap HTML utilisateur `/plan-du-site` densifié avec arborescence visible (style Bilik).

### 12.3 Audit final

- Lighthouse > 95 sur 50 pages échantillon.
- Couverture mots-clés : tous les mots-clés Tier 1 (50) doivent ranker top 100 minimum.
- Indexation : audit GSC pour vérifier qu'au moins 1500 URLs sont indexées.
- Backlinks : push final sur 5 nouveaux backlinks (interviews TPE/PME, partenariats CCI).

---

## Récapitulatif volumes

| Sprint | Pages créées | Cumul |
|---|---|---|
| 1 | 50 + 30 enrichies | 50 nouvelles |
| 2 | 200 | 250 |
| 3 | 200 | 450 |
| 4 | 200 | 650 |
| 5 | 50 | 700 |
| 6 | 50 | 750 |
| 7 | 25 | 775 |
| 8 | 25 | 800 |
| 9 | 20 | 820 |
| 10 | 100 | 920 |
| 11 | 50 | 970 |
| 12 | 50 | 1020 |

**Total** : ~1020 nouvelles pages créées sur 12 semaines + 30 pages existantes enrichies.

---

## Standard de qualité par type de page

| Type | Min mots | Schema | FAQ | Maillage min | Longévité |
|---|---|---|---|---|---|
| Hub département | 1200 | CollectionPage + FAQPage | 8 questions | 10 liens | 12 mois |
| Hub dept x métier | 1000 | ItemList + FAQPage | 6 questions | 8 liens | 12 mois |
| Ville x métier (commune sec.) | 700-900 | LocalBusiness + Place + FAQPage | 5 questions | 6 liens | 18 mois |
| Quartier x métier | 600-800 | LocalBusiness + Place | 4 questions | 5 liens | 18 mois |
| Modificateur (urgence/RGE) | 1100-1300 | Service + LocalBusiness + FAQPage | 8 questions | 6 liens | 12 mois |
| Prix x ville | 1300-1700 | Article + Offer + FAQPage | 8 questions | 6 liens | 6 mois (refresh annuel) |
| Guide Tier 1 | 2200-2800 | Article + HowTo + FAQPage | 10 questions | 8 liens | 18 mois |
| Guide Tier 2 | 1400-1800 | Article + FAQPage | 8 questions | 6 liens | 12 mois |
| Guide Tier 3 | 900-1200 | Article + FAQPage | 6 questions | 5 liens | 12 mois |
| Comparatif | 1400-1800 | Article + FAQPage + Review | 8 questions | 5 liens | 18 mois |
| Alternative à | 1100-1400 | Article + FAQPage | 6 questions | 5 liens | 18 mois |
| Travaux x ville | 1300-1700 | Service + Offer + FAQPage | 8 questions | 7 liens | 12 mois |

---

## Notes opérationnelles

### Génération templatisée
Pour les sprints 2, 3, 4 (gros volumes communes secondaires), industrialiser via :
- `lib/communes.ts` : extrait du fichier 04 avec données INSEE, code postal, distance ville hub, intercommunalité.
- `app/[ville]/[metier]/page.tsx` étendu avec `generateStaticParams()` lisant `communes.ts`.
- `lib/page-generator.ts` : helpers pour générer le contenu unique par commune (paragraphes faits locaux, FAQ adaptée, JSON-LD dynamique).

### Validation qualité automatisée
- Script CI : pour chaque nouvelle page, vérifier longueur ≥ standard, présence Schema valide, ≥ 5 liens internes, meta description 130-160 caractères, H1 unique.
- Test Schema : `https://search.google.com/test/rich-results` automatisé via Puppeteer.

### Cadence et IndexNow
- Soumettre par lots de 50 URLs/jour à GSC (limite quotidienne URL Inspection API).
- Activer IndexNow (Bing) pour notification instantanée.
- `lastmod` du sitemap : timestamp réel du dernier édit (pas du build) pour garder un signal de fraîcheur exploitable.
