# Stratégie SEO Bativio.fr — Note exécutive

**Auteur** : Head of SEO senior
**Date** : 1er mai 2026
**Audience** : Tarik (fondateur)
**Horizon** : 90 jours (12 sprints)

---

## 1. Verdict en 1 paragraphe

Bativio est un site neuf, techniquement propre, sans aucune visibilité organique constatée à date. La SERP locale Rhône-Alpes est dominée par 7 acteurs nationaux (PagesJaunes, Travaux.com, Habitatpresto, Bilik, Lesbonsartisans, StarOfService, Obat) sans vainqueur sur les communes secondaires : c'est l'angle d'attaque. Stratégie gagnante : prendre l'océan bleu local hyper-précis (334 communes/quartiers x 8 métiers = 2700 pages templatisées), monter en autorité sur les guides Top 50 (réassurance + prix + litige + aides), et asseoir une grammaire d'URL avec modificateurs commerciaux que personne n'occupe (urgence, RGE, prix par ville). 90 jours pour passer de 0 à ~1500 URLs indexées et 5000 sessions/mois ; ensuite c'est l'effet réseau backlinks + GMB qui prend le relais.

---

## 2. État des lieux

### 2.1 Indexation et trafic

- **Google Index** : 0 URL constatée le 01/05/2026 (à confirmer dans Search Console — cette mesure est urgente).
- **Sitemap** : 179 URLs publiées, 102 routes uniques exploitables.
- **Backlinks** : 0 référent identifié.
- **Mots-clés rankés** : 0 en top 100.
- **GMB / annuaires locaux** : non créés.

### 2.2 Concurrence

| Concurrent | Volume pages annuaire | Force | Faille exploitable |
|---|---|---|---|
| PagesJaunes | Plusieurs millions | Brand + maille tous CP France | Pas d'expertise éditoriale, UX vieillissante |
| Travaux.com | ~500k–1M | Guides prix + jobs | Bloqué Cloudflare (proxy parfois lent) |
| Habitatpresto | ~500k + 5000 articles | Mag éditorial dense, lastmod actif | Annuaire sur sous-domaine (link juice fragmenté) |
| Bilik | ~500k+ | Chambéry/Lyon/Annecy bien posé | Bloque GPTBot/ClaudeBot — invisible aux LLMs |
| Lesbonsartisans | ~5000–8000 | Pattern original metier-region | Faible content marketing |
| StarOfService | inconnu | Mass-disallow tactique | URL `/annubis/` repoussante, anciennes régions |
| Obat | ~30k–50k | Guides solides | Sous-domaine (autorité diluée) |

**Insight clé** : aucun concurrent ne fait du quartier. Aucun ne fait `{ville}/{metier}-urgence` ou `/prix/{metier}/{ville}`. Aucun ne combine couverture locale fine + GEO/AEO (LLM) + tickets de réassurance.

### 2.3 Forces actuelles Bativio

- Grammaire d'URL clean : `/[ville]/[metier]`, `/prix/[metier]`, `/travaux/[slug]`, `/comparatif/[slug]`.
- Schema.org déjà déployé : Article, OfferCatalog, Service, ItemList, ContactPage, HowTo.
- robots.txt favorable aux bots IA (GPTBot, ClaudeBot, PerplexityBot autorisés) — différenciateur fort vs Bilik et StarOfService.
- Stack Next.js 16 + ISR-ready : capable d'absorber 2700 pages générées sans coût d'opex.

### 2.4 Faiblesses

- **Couverture géo limitée à 5 villes** : Chambéry, Annecy, Grenoble, Lyon, Valence. Le bassin réel (334 zones) est 67x plus large.
- **Pas de hub département** (`/savoie`, `/rhone`, etc.) — manqué chez 6/8 concurrents.
- **Pas de modificateurs** : aucune page `/{ville}/{metier}-urgence` ni `/{ville}/{metier}-rge`.
- **Forum / signaux UGC = 0** : aucun avis, aucun témoignage, aucune Q&R communautaire.
- **0 backlinks** : aucun signal d'autorité externe.

---

## 3. Stratégie en 4 piliers

### Pilier 1 — Local hyper-précis (océan bleu)

**Thèse** : capturer la longue traîne `{commune secondaire ou quartier} + {metier}` que personne n'occupe sérieusement.

- **Inventaire cible** : 334 zones (file `04-communes-quartiers.md`) × 8 métiers prioritaires (plombier, électricien, maçon, peintre, carreleur, menuisier, couvreur, chauffagiste) = ~2670 pages.
- **Template existant à étendre** : `[ville]/[metier]` déjà en place. Génération via `generateStaticParams` Next.js + contenu unique par zone (population INSEE + faits locaux + liste artisans réels ou placeholder qualitatif).
- **Risque "macon"** : "macon" sans cédille déclenche la ville Mâcon (71). Imposer "maçon" partout ou "artisan maçon" en H1.
- **Effet réseau attendu** : volumes individuels faibles mais agrégés = 80% du trafic local longue traîne. Suggest Google retourne souvent une seule suggestion (`plombier bissy`, `plombier la bridoire`) = faible concurrence = rank rapide possible.

### Pilier 2 — Modificateurs commerciaux

**Thèse** : capturer les intentions transactionnelles que Google Suggest signale (urgence, RGE, prix, devis) mais que les concurrents ignorent dans leurs URL.

Grammaire à ouvrir :

| Pattern | Volume estimé | Pages | Priorité |
|---|---|---|---|
| `/{ville}/{metier}-urgence` | 5 villes x 8 métiers | 40 | Haute |
| `/{ville}/{metier}-rge` | 5 villes x 8 métiers | 40 | Haute |
| `/prix/{metier}/{ville}` | 8 métiers x 5 villes | 40 | Très haute |
| `/{ville}/{metier}-pas-cher` | À tester sur 3 metiers | 15 | Moyenne |
| `/{ville}/{metier}-devis` | 5 villes x 8 métiers | 40 | Moyenne |

Total ~175 pages dédiées aux modificateurs.

**Argument pour `/prix/{metier}/{ville}` plutôt que `/{ville}/{metier}-prix`** : reprend le pattern `/prix/{metier}` déjà présent et ajoute juste un sous-segment ville. Maintien d'une silo prix isolé. Ne perturbe pas la grammaire `/[ville]/[slug-artisan]` existante.

### Pilier 3 — Guides à fort volume informationnel

**Thèse** : le Top 50 questions du fichier 05 (artisan-fiable, RGE, MaPrimeRénov 2026, comparer-devis, malfaçon, urgence) capte de la longue traîne info massive et asseoit l'autorité topique (E-E-A-T) indispensable pour les LLM.

- **Tier 1 (15 articles, 2500 mots, mai)** : artisan-fiable, prix-renovation-salle-de-bain, verifier-rge-artisan, maprimerenov-2026, comparer-devis, fuite-eau, prix/plombier+electricien, negocier-devis, acompte-travaux-legal, recours-malfacon, garanties-travaux, pac-vs-gaz, ite-vs-iti, artisan-disparu-recours.
- **Tier 2 (20 articles, 1500 mots, juin)** : SIRET, TVA 5,5, mise-en-demeure, médiateur, plombier-urgence-arnaque, etc.
- **Tier 3 (15 articles, 1000 mots, juillet)** : longue traîne maillage interne.

Chaque guide :
- Schema FAQPage + HowTo si procédural.
- 3+ liens internes vers `/prix/[metier]` et `/[ville]`.
- Encadré CTA "Trouver un artisan vérifié à [ville]" géolocalisé.
- Citation explicite des USP Bativio (vérification SIRET / RGE / décennale).

### Pilier 4 — Comparatifs offensifs + GEO/AEO

**Thèse** : élargir les 5 comparatifs existants à 15 (toutes les marketplaces nationales) + ouvrir les pages "alternative à X" + optimiser pour LLMs.

- **Comparatifs à créer** : Bativio vs PagesJaunes, vs Travaux.com, vs Habitatpresto, vs Bilik, vs Lesbonsartisans, vs StarOfService, vs Obat, vs 123devis, vs Allotravaux, vs Hemea (10 comparatifs offensifs).
- **Pages "alternative à"** : `/alternative-a-{concurrent}` pour les 10 concurrents = 10 pages.
- **Optimisation LLM** :
  - Garder GPTBot/ClaudeBot/PerplexityBot autorisés (déjà fait).
  - Ajouter blocs Q&R `## Q : ... \n A : ...` dans chaque comparatif (formats préférés des LLM).
  - Citer SIRET 813961141 (KLIKPHONE SAS), Rhône-Alpes, fondateur Tarik BOUDEFAR — facilite la citation par les LLM (entité claire).

---

## 4. Roadmap 90 jours (S+0 → S+12)

| Sprint | Dates | Objectif principal | Livrable | KPI sprint |
|---|---|---|---|---|
| 1 | S+0 → S+1 | Indexation + quick wins | 80 pages prio + GSC + GMB lancé | 50 URLs indexées |
| 2 | S+1 → S+2 | Communes Chambéry + Annecy | 200 pages templatisées | +200 URLs sitemap |
| 3 | S+2 → S+3 | Communes Grenoble + Lyon | 200 pages templatisées | +200 URLs sitemap |
| 4 | S+3 → S+4 | Lyon arrondissements + Valence | 200 pages templatisées | +200 URLs sitemap |
| 5 | S+4 → S+5 | Modificateurs urgence + RGE | 50 pages ville x métier | +5 backlinks |
| 6 | S+5 → S+6 | Prix par ville + métier | 50 pages prix locales | 500 URLs indexées |
| 7 | S+6 → S+7 | Guides Top 1-25 | 25 articles longs | +10 backlinks |
| 8 | S+7 → S+8 | Guides Top 26-50 | 25 articles longs | 1000 URLs indexées |
| 9 | S+8 → S+9 | Hub départements + comparatifs | 10 hubs + 10 comparatifs | 100 mots-clés rankés |
| 10 | S+9 → S+10 | Quartiers Lyon/Grenoble/Chambéry | 100 pages quartiers | +20 backlinks |
| 11 | S+10 → S+11 | Pages travaux spécifiques | 50 pages /travaux/ | 1500 URLs indexées |
| 12 | S+11 → S+12 | "Alternative à" + finalisation maillage | 50 pages + audit | 5000 sessions/mois |

**Cadence de publication** : 200 pages/semaine maximum (au-delà = signal de spam). Étalement sur les 12 semaines pour éviter la pénalité site neuf qui publie 3000 pages d'un coup.

---

## 5. KPI cibles

| Métrique | S+0 (now) | S+4 | S+8 | S+12 |
|---|---|---|---|---|
| URLs indexées Google | 0 | 250 | 1000 | 1500+ |
| Sessions organiques / mois | 0 | 500 | 2000 | 5000 |
| Mots-clés top 100 | 0 | 80 | 250 | 500+ |
| Mots-clés top 10 | 0 | 5 | 30 | 80 |
| Backlinks référents | 0 | 5 | 15 | 30 |
| Mentions LLM (ChatGPT/Perplexity/Claude) | 0 | 1 | 3 | 5 |
| Domain Rating (Ahrefs estimé) | 0 | 3 | 8 | 15 |

**Hypothèses sous-jacentes** :
- Un site neuf ranke en 8-12 semaines sur la longue traîne ultra locale (faible concurrence = effet rapide).
- Sandbox Google estimé 4 semaines → visibilité réelle à partir de S+4.
- Conversion sessions → demandes devis : non un KPI SEO mais à monitorer en parallèle (cible 1-2%).

---

## 6. Risques et mitigations

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| "macon" homonyme avec ville Mâcon (71) pollue les SERPs | Élevée | Moyen | Toujours "maçon" cédille en H1 + slug `/macon` mais H1 "Maçon à {ville}" + contenu mentionne explicitement "métier de la maçonnerie" |
| Duplicate content sur 2700 pages similaires | Élevée | Élevé | Templates avec données INSEE par commune (population, code postal, distance ville hub), faits locaux uniques (chef-lieu de canton, intercommunalité), liste artisans réelle ou placeholder qualifié, pas de boilerplate identique |
| Pénalité site neuf qui publie trop vite | Moyenne | Élevé | Cadence ≤ 200 pages/sem, staging sur sitemap par lots de 50, lastmod réaliste |
| Cannibalisation entre `/prix/[metier]` (national) et `/prix/[metier]/[ville]` (local) | Faible | Moyen | Canonical local→national désactivé, contenu différencié (national = comparaison, local = tarifs spécifiques) |
| Mass-publication détectée comme thin content | Moyenne | Élevé | Min 600 mots/page commune secondaire, 1200 mots/quartier, 2500 mots/guide. JSON-LD systématique |
| Bing/Yandex ne suit pas (PagesJaunes domine sans contestation) | Faible | Faible | Bing Webmaster Tools dès S+1 + IndexNow API |
| Sandbox Google long (>12 sem) | Moyenne | Moyen | Backlinks rapides (LinkedIn fondateur, GMB, partenaires CCI Rhône-Alpes) + signaux PR (1 communiqué TPE/PME local) |

---

## 7. Actions immédiates (cette semaine)

Liste ordonnée, à exécuter avant S+1.

1. **Configurer Google Search Console** sur bativio.fr (DNS TXT) + soumettre sitemap.xml. Vérifier indexation actuelle réelle (suspect : 0 mais besoin de la donnée GSC).
2. **Demander indexation manuelle** des 20 pages prioritaires : `/`, `/chambery`, `/annecy`, `/grenoble`, `/lyon`, `/valence`, `/chambery/plombier`, `/chambery/electricien`, `/annecy/plombier`, `/annecy/electricien`, `/prix/plombier`, `/prix/electricien`, `/prix/macon`, `/comparatif/...` (5 existants), `/facturation-electronique`, `/maprimerenov`, `/urgence`, `/faq`.
3. **Bing Webmaster Tools** : créer compte, soumettre sitemap, activer IndexNow.
4. **Google Business Profile** : créer 5 fiches GMB (KLIKPHONE SAS) sur les 5 villes hubs avec catégorie "Service de référencement d'artisans". Attention : SIRET unique mais 5 adresses différentes nécessaires (faisable avec adresses postales partenaires ou CCI).
5. **Premier post LinkedIn fondateur** (Tarik) : annonce lancement Bativio.fr avec lien direct + tag CCI Savoie / Auvergne-Rhône-Alpes. Backlink + signal social.
6. **Inscription dans 5 annuaires locaux gratuits** : annuaire CCI Savoie, annuaire CMA Auvergne-Rhône-Alpes, le-bon-pro.fr, viaMichelin Pro, kompass.fr.
7. **Audit technique express** : Lighthouse > 90 sur les 5 villes hubs, vérifier `<title>` / `<meta description>` / hreflang absent (fr-FR seul) / canonical / Open Graph.
8. **robots.txt** : vérifier explicitement que GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended sont bien autorisés. Bloquer `/dashboard/*`, `/admin/*`, `/api/*`.
9. **Schema Organization racine** : publier dans `layout.tsx` un Schema.org Organization avec name="Bativio", legalName="KLIKPHONE SAS", taxID="813961141", areaServed="Rhône-Alpes", founder="Tarik BOUDEFAR".
10. **Tracker d'indexation** : créer un Google Sheet ou Notion qui liste les 102 URLs actuelles avec colonnes [URL, soumise GSC, indexée, position cible, position actuelle]. Mise à jour hebdomadaire automatique via API GSC.

**Budget estimé semaine 1** : 0 € (tout faisable en interne) + 2-3 jours de dev pour Schema Organization + tracker. Ajouter Ahrefs ou Semrush (~150 €/mois) en S+2 pour monitorer mots-clés.

---

## Annexe A — Arbitrages tranchés

### A.1 Hub département : `/savoie` ou `/savoie-73` ?

Recommandation : `/savoie` sans suffixe code département. PagesJaunes utilise `-69`, Habitatpresto utilise `-69` aussi, mais Bilik et Obat n'utilisent pas le code → 50/50 dans les concurrents. L'argument décisif : URL plus propre, plus lisible, plus partageable.

### A.2 Modificateur prix : `/{ville}/{metier}-prix` ou `/prix/{metier}/{ville}` ?

Recommandation : `/prix/{metier}/{ville}`. Reprend le pattern `/prix/{metier}` déjà existant (silo prix cohérent). Évite de polluer le pattern `/[ville]/[metier]` qui sert l'annuaire artisan. Maintient une distinction nette entre intent local (annuaire) et intent transactionnel (prix).

### A.3 Quartiers Lyon : `/lyon-3/plombier` ou `/lyon/quartier-3/plombier` ?

Recommandation : `/lyon-3/plombier` (style Bilik / Travaux.com). C'est le pattern dominant chez la concurrence et le pattern Google Suggest retourne (`plombier lyon 3`, `plombier lyon 7`). 9 arrondissements x 8 métiers = 72 pages immédiates.

### A.4 Annuaire entité : `KLIKPHONE SAS` vs `Bativio` partout ?

Recommandation : Schema.org `Organization` mentionne KLIKPHONE SAS comme `legalName` mais `name` reste "Bativio". Footer mentions légales : KLIKPHONE SAS 813961141. Cohérent avec ce qui est déjà fait.
