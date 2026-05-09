# Concurrents — Structure d'URLs et stratégie SEO

> Analyse des sitemaps et patterns d'URL des 8 plus gros concurrents de Bativio.fr.
> Méthode : robots.txt → sitemaps déclarés → patterns dominants → exemples concrets.
> Date : mai 2026.

---

## 1) PagesJaunes (`pagesjaunes.fr`)

### 1.1 Sitemaps déclarés
- `robots.txt` ne déclare **aucun `Sitemap:`** explicitement (fichier sitemap.xml protégé Cloudflare/captcha).
- `/sitemap.xml` renvoie un challenge Cloudflare (HTML, pas XML).
- Découverte des patterns via Google `site:` operator.

### 1.2 Volume estimé
- **Géant** : France entière, toutes activités professionnelles, par commune ET par arrondissement ET par département. Plusieurs millions d'URLs indexables.

### 1.3 Patterns d'URL dominants

| # | Pattern | Description |
|---|---------|-------------|
| 1 | `/annuaire/{ville}-{cp_dept}/{metier}` | Listing artisans par ville + métier (cp_dept = code département 2 chiffres) |
| 2 | `/annuaire/{ville}-{n}{er,e}-arrondissement-{cp_dept}/{metier}` | Granularité arrondissement (Paris, Lyon, Marseille) |
| 3 | `/annuaire/departement/{nom-dept}-{cp_dept}` | Page département (parent) |
| 4 | `/annuaire/departement/{nom-dept}-{cp_dept}/{metier}` | Listing métier au niveau département |
| 5 | `/annuaire/departement/{nom-dept}-{cp_dept}/cote-particuliers` | Variante "côté particuliers" (segmentation B2C) |
| 6 | `/activites/{metier}.html` | Page hub par métier (national, top-down, paginée `/activites/{n}`) |
| 7 | `/pros/{slug-entreprise}` | Fiche entreprise/artisan |
| 8 | `/ville/{ville}/...` | Hub ville (annuaire + bons plans + dossiers — partiellement disallowed) |

### 1.4 Exemples concrets (5/pattern principal)
- `/annuaire/lyon-69/plombiers`
- `/annuaire/lyon-8e-arrondissement-69/plombiers`
- `/annuaire/lyon-69/plombier-chauffagiste`
- `/annuaire/lyon-69/depannage-plomberie`
- `/annuaire/lyon-69/outillage-et-fournitures-pour-plomberie`
- `/annuaire/paris-1er-arrondissement-75/plombiers`
- `/annuaire/departement/rhone-69`
- `/annuaire/departement/loire-atlantique-44`
- `/annuaire/departement/haute-garonne-31/cote-particuliers`
- `/annuaire/perigueux-24/fenetres`
- `/annuaire/venelles-13/artisan-menuisier`
- `/annuaire/queyrac-33/climatisation`
- `/annuaire/poitiers-86/traiteurs`
- `/activites/nettoyage-entreprises.html`
- `/activites/jardinerie.html`

### 1.5 Mots-clés / modificateurs détectés dans les URLs
- Modificateurs métier : `plombiers`, `plombier-chauffagiste`, `depannage-plomberie`, `artisan-menuisier`, `outillage-et-fournitures-pour-plomberie`, `climatisation`, `fenetres`, `traiteurs`, `carrossier`.
- **Le code département (-69, -75, -44, etc.) est SYSTÉMATIQUE** sur les URLs ville. Pas de slugs nus.
- Pas de modificateurs `/tarif/`, `/devis/`, `/prix/` dans les URLs (titres SEO l'utilisent par contre : "demandez un devis").

### 1.6 Fonctionnalités SEO observables
- Pages "côté particuliers" → **segmentation audience** dans l'URL (B2C vs B2B implicite).
- `/activites/{metier}-{n}` → **pagination index** (page 5, page 6 d'un index national).
- `/activites/{topic}.html` → extension `.html` conservée (legacy ASP/PHP).
- Hub vide `/annuaire/departement/{dept}` (parent sans métier) → utile pour distribuer le link juice vers les villes/métiers du département.

---

## 2) Travaux.com (`travaux.com`)

### 2.1 Sitemaps déclarés
- `robots.txt` déclare `Sitemap: https://www.travaux.com/sitemap.xml`.
- Fichier sitemap **bloqué par Cloudflare challenge** en accès direct sans navigateur.
- Patterns extraits via `site:travaux.com`.

### 2.2 Volume estimé
- **Très grand** : couverture toutes communes France + arrondissements Paris/Lyon/Marseille + nombreux guides prix par sous-tâche.

### 2.3 Patterns d'URL dominants

| # | Pattern | Description |
|---|---------|-------------|
| 1 | `/{categorie}/{metier}-professionnels/{ville}` | Listing pro par métier + ville |
| 2 | `/{categorie}/{metier}-professionnels/{ville}-{0n}` | Arrondissement avec préfixe à 2 chiffres (paris-01, lyon-07) |
| 3 | `/{categorie}/{metier}-professionnels` | Hub national du métier |
| 4 | `/{categorie}` | Hub catégorie (plomberie, electricite, peinture, menuiserie) |
| 5 | `/{categorie}/guide-des-prix/{nom-tache}` | Guide prix par sous-tâche |
| 6 | `/guide-des-prix/{categorie}` | Guide prix par catégorie globale |
| 7 | `/{categorie}/articles/{slug-article}` | Article éditorial avec exemples (devis, exemples) |
| 8 | `/{categorie}/jobs/{slug-job}` | Page projet/intent type "installer une douche" |
| 9 | `/{categorie}/{categorie}-neuf-et-renovation` | Page projet neuf vs rénovation |

### 2.4 Exemples concrets
- `/plomberie/plombier-professionnels/lyon-02`
- `/plomberie/plombier-professionnels/lyon-07`
- `/plomberie/plombier-professionnels/villeurbanne`
- `/plomberie/plombier-professionnels`
- `/electricite/electricien-professionnels/paris-08`
- `/electricite/electricien-professionnels/saint-denis`
- `/peinture/peintre-professionnels/marseille-13`
- `/plomberie/guide-des-prix/prix-dun-plombier`
- `/plomberie/guide-des-prix/prix-depannage-plomberie`
- `/plomberie/guide-des-prix/prix-dune-renovation-de-plomberie`
- `/plomberie/guide-des-prix/prix-plomberie-maison-neuve`
- `/plomberie/guide-des-prix/prix-de-linstallation-dune-conduite-deau`
- `/guide-des-prix/plomberie`
- `/plomberie/articles/exemple-de-devis-travaux-de-plomberie`
- `/plomberie/articles/exemple-de-devis-plomberie-sanitaire`
- `/plomberie/jobs/installation-plomberie-cuisine`
- `/plomberie/jobs/renovation-plomberie-appartement`
- `/salles-de-bain-sanitaires/jobs/installation-douche`
- `/salles-de-bain-sanitaires/jobs/installer-baignoire-avec-rebord`
- `/plomberie/plomberie-neuf-et-renovation`

### 2.5 Mots-clés / modificateurs
- **Modificateur "professionnels"** systématique sur les pages annuaire (ex : `plombier-professionnels`).
- Modificateurs prix : `prix-dun-plombier`, `prix-depannage-plomberie`, `prix-dune-renovation-de-plomberie`, `prix-plomberie-maison-neuve`.
- Sous-tâches très ciblées : `installation-douche`, `installer-baignoire-avec-rebord`, `installation-cabine-de-douche`, `installation-bidet`, `installation-plomberie-cuisine`.
- Distinction `neuf` vs `renovation` dans l'URL.

### 2.6 Fonctionnalités SEO observables
- **3 niveaux d'intent dans l'URL** : informationnel (`guide-des-prix/{x}`, `articles/{x}`), transactionnel (`jobs/{x}`), local (`{metier}-professionnels/{ville}`).
- Modificateur "Top 10" dans les title tags.
- Arrondissements normalisés en `paris-01` à `paris-20`, `lyon-01` à `lyon-09` (pas `paris-1er`).
- **Aucun pattern `/devis/{metier}/{ville}` dédié** — les devis sont des CTA sur les pages métier+ville, pas des landing pages séparées.

---

## 3) Bilik (`bilik.fr`)

### 3.1 Sitemaps déclarés
- `robots.txt` Cloudflare-managed déclare `Sitemap: https://www.bilik.fr/sitemap.xml`.
- Notable : **bloque ClaudeBot, GPTBot, Google-Extended, CCBot, Bytespider** (signal anti-IA-train). Mais autorise `search=yes`.
- `/sitemap.xml` est un sitemap-index avec :
  - 2 sitemaps généraux (`/sitemap.xml/0`, `/sitemap.xml/1`)
  - **~200 sub-sitemaps `/sitemap-trades/{n}`** (n de 1 à 225, un par métier).

### 3.2 Volume estimé
- ~200 métiers × milliers de communes France entière. **Estimation : plusieurs centaines de milliers d'URLs** (commune × métier).

### 3.3 Patterns d'URL dominants

| # | Pattern | Description |
|---|---------|-------------|
| 1 | `/{ville}/{metier}` | Listing artisan par ville + métier (URL minimaliste, pas de cp) |
| 2 | `/{ville}-{n}/{metier}` | Variante arrondissement (lyon-3, lyon-9) |
| 3 | `/{ville}-{cp}` | Page hub ville si commune homonyme (ex: abancourt-59268) |
| 4 | `/annuaire/villes/{ville}[-{cp}]` | Doublon canonique de la page ville |
| 5 | `/metiers/{metier}` | Page hub métier national |
| 6 | `/annuaire/metiers/{metier}` | Doublon canonique du hub métier |
| 7 | `/presentations/{id}-{slug-entreprise}` | Fiche artisan (id numérique + slug) |
| 8 | `/presentations/{id}-{slug}?zone={ville}&trade={tache}` | Variante avec paramètres zone/trade |
| 9 | `/sitemaps`, `/sitemaps/professionnels`, `/sitemaps/professionnels/rge`, `/sitemaps/metiers` | **Pages sitemap HTML pour utilisateurs** (link silos visibles) |

### 3.4 Exemples concrets
- `https://www.bilik.fr/lyon/plombier`
- `https://www.bilik.fr/lyon/electricien`
- `https://www.bilik.fr/lyon-3/electricien`
- `https://www.bilik.fr/lyon-9/electricien`
- `https://www.bilik.fr/lyon-3/depannage-plomberie`
- `https://www.bilik.fr/villeurbanne/salle-de-bain`
- `https://www.bilik.fr/chambery/salle-de-bain`
- `https://www.bilik.fr/bordeaux/salle-de-bain`
- `https://www.bilik.fr/annecy/salle-de-bain`
- `https://www.bilik.fr/peymeinade/plombier`
- `https://www.bilik.fr/cepet/plombier`
- `https://www.bilik.fr/abeilhan/ferronnier`
- `https://www.bilik.fr/agde/ferronnier`
- `https://www.bilik.fr/abancourt-59268`
- `https://www.bilik.fr/annuaire/villes/abancourt-59268`
- `https://www.bilik.fr/metiers/agencement`
- `https://www.bilik.fr/annuaire/metiers/agencement`
- `https://www.bilik.fr/presentations/1928-jfs-renovation`
- `https://www.bilik.fr/presentations/352-klenckelectricite`
- `https://www.bilik.fr/presentations/2198-creaspace?zone=val-de-virieu&trade=renovation-de-cuisine`
- `https://www.bilik.fr/sitemaps/professionnels/rge`

### 3.5 Mots-clés / modificateurs
- Métiers très granulaires : `plombier`, `electricien`, `depannage-plomberie`, `salle-de-bain`, `renovation-de-cuisine`, `agencement`, `ferronnier`.
- **Pas de "devis" / "tarif" / "urgence"** dans les URLs ville.
- Présence du **slug "rge"** (Reconnu Garant de l'Environnement) → segmentation qualité/certification dans l'URL via la page sitemap.

### 3.6 Fonctionnalités SEO observables
- **Double URL identique** sous `/{ville}/{metier}` ET `/annuaire/villes/{ville}/{metier}` → signe d'un canonical défini sur la version courte (sinon duplicate content). Inattendu mais visible dans le sitemap.
- Pages `/presentations/{id}-{slug}` avec slug numérique → URL stable même si l'entreprise change de nom (id = clé primaire).
- Pages "sitemap" HTML utilisateur (`/sitemaps/...`, `/sitemaps/professionnels/rge`) → **link silos visibles** = booster d'indexation et de discovery.
- Pas d'extension de fichier (clean URLs, Next.js-like).

---

## 4) Habitatpresto (`habitatpresto.com`)

### 4.1 Sitemaps déclarés
- `robots.txt` déclare `Sitemap: https://www.habitatpresto.com/sitemap.xml`.
- Disallow notable : `/prix/`, `/dialogue-prix-*`, `/lexique/`, `/pro/chantiers/`, `/pro/landing-chantier*`.
- `sitemap.xml` est un index avec 6 sub-sitemaps :
  - `/mag/sitemap.xml` (articles éditoriaux)
  - `/pro/conseils/sitemap.xml` (articles pour artisans)
  - `/mag/actu/sitemap.xml` (actualités)
  - `/sitemap-video.xml`
  - `/sitemap-formulaire-devis.xml`
  - `https://annuaire.habitatpresto.com/sitemap.xml` (annuaire géographique sur sous-domaine séparé)

### 4.2 Volume estimé
- **Annuaire** : 44 sub-sitemaps métier (un par métier sur sous-domaine `annuaire.`), chacun listant France entière par région+département+ville. Volume très important (plusieurs centaines de milliers de pages métier×ville).
- **Mag** : ~milliers d'articles éditoriaux datés (lastmod actif, contenus récents 2026).

### 4.3 Patterns d'URL dominants

| # | Pattern | Description |
|---|---------|-------------|
| 1 | `https://annuaire.habitatpresto.com/met/{metier}` | Hub métier national (sous-domaine dédié) |
| 2 | `https://annuaire.habitatpresto.com/met/{metier}/reg/{region}/dep/{dept}-{cp_dept}` | Métier × département |
| 3 | `https://annuaire.habitatpresto.com/met/{metier}/reg/{region}/dep/{dept}-{cp_dept}/vil/{ville}` | Métier × ville (4 niveaux : metier > région > département > ville) |
| 4 | `/mag/{categorie}/{slug-article}` | Article éditorial par catégorie |
| 5 | `/mag/{categorie}/{sous-categorie}/{slug-article}` | Article 3 niveaux (ex: revetement/mur/peinture-salle-de-bain) |
| 6 | `/pro/conseils/{rubrique}/{slug-article}` | Articles pour artisans (visibilité, pratiques, administratif-fiscalite) |
| 7 | `/devis-travaux-1` (et variantes) | Landing page devis |
| 8 | `/pro/conseils/pratiques/{slug}` | Conseils pratiques pour artisans |
| 9 | `/pro/conseils/visibilite/{slug}` | Conseils visibilité pour artisans |
| 10 | `/pro/conseils/administratif-fiscalite/{slug}` | Conseils admin pour artisans |

### 4.4 Exemples concrets
**Annuaire (4 niveaux, sous-domaine séparé)**
- `https://annuaire.habitatpresto.com/met/plombier`
- `https://annuaire.habitatpresto.com/met/electricien`
- `https://annuaire.habitatpresto.com/met/plombier/reg/auvergne-rh%C3%B4ne-alpes/dep/rhone-69/vil/lyon`
- `https://annuaire.habitatpresto.com/met/plombier/reg/ile-de-france/dep/paris-75/vil/paris-paris`
- `https://annuaire.habitatpresto.com/met/plombier/reg/provence-alpes-cote-d-azur/dep/bouches-du-rhone-13/vil/marseille`
- `https://annuaire.habitatpresto.com/met/alarme-installateur/reg/ile-de-france/dep/yvelines-78`

**Magazine éditorial**
- `/mag/plomberie/tarif-plombier`
- `/mag/plomberie/devis-plomberie`
- `/mag/plomberie/installation-plomberie-maison`
- `/mag/plomberie/prix-pose-wc`
- `/mag/plomberie/fuite-eau-prix-detection`
- `/mag/plomberie/trouver-un-bon-plombier`
- `/mag/chauffage/tarif-chauffagiste`
- `/mag/menuiserie/portail-portillon/prix-cloture`
- `/mag/terrasse-et-amenagements/couper-vent-terrasse`
- `/mag/agrandissement/extension-agrandissement-prix-m2`
- `/mag/climatisation/canicule-ouvrir-et-fermer-fenetres`
- `/mag/revetement/mur/peindre-mur-fonce`
- `/mag/revetement/mur/peinture-salle-de-bain`
- `/mag/renovation/lancement-pret-avance-renovation`
- `/mag/renovation/maprimerenov-copropriete`
- `/mag/renovation/prime-cee-2026`

**Pro (B2B vers les artisans)**
- `/pro/conseils/pratiques/coup-de-chaleur-salarie-chantier`
- `/pro/conseils/pratiques/trouver-chantiers`
- `/pro/conseils/pratiques/methode-5s-rangement`
- `/pro/conseils/pratiques/faire-ses-devis-a-distance`
- `/pro/conseils/visibilite/comment-faire-connaitre-entreprise-batiment`
- `/pro/conseils/visibilite/habitatpresto-avis-temoignages-pros`
- `/pro/conseils/administratif-fiscalite/devis-mentions-obligatoires`
- `/pro/conseils/administratif-fiscalite/certification-rge`
- `/pro/conseils/administratif-fiscalite/carte-btp`

### 4.5 Mots-clés / modificateurs
- Modificateurs prix très denses dans `/mag/` : `tarif-{metier}`, `prix-pose-{x}`, `prix-deplacer-{x}`, `prix-detection-{x}`, `cout-travaux`, `prix-m2`.
- Modificateurs aides : `aides-aux-travaux`, `maprimerenov-copropriete`, `prime-cee-2026`, `tva-travaux-taux-reduit`, `pret-avance-renovation`.
- Modificateurs artisan : `comment-faire-connaitre`, `trouver-chantiers`, `mentions-obligatoires`, `certification-rge`.

### 4.6 Fonctionnalités SEO observables
- **Annuaire géographique sur sous-domaine `annuaire.`** = silo SEO séparé (transfère mal le link juice mais évite de polluer le domaine principal avec UGC d'annuaire).
- 4 niveaux de profondeur géographique (metier > région > département > ville) = **maille très fine** mais URL longue (potentiel souci de profondeur).
- Encodage `auvergne-rh%C3%B4ne-alpes` (caractères spéciaux non normalisés) → **potentiel souci canonical**.
- Sitemap formulaire-devis dédié + sitemap vidéo = signaux d'investissement multimédia.
- Section `/pro/conseils/` complète = **stratégie de capture B2B des artisans** (Habitatpresto vit du recrutement d'artisans).
- Mag avec **lastmod récents** (2026-04-30) → signaux fraîcheur agressifs.
- Disallow `/prix/` (mais URLs `mag/.../prix-{x}` autorisées) → ancien path déprécié, ils ont migré tout le contenu prix vers `/mag/`.

---

## 5) Lesbonsartisans (`lesbonsartisans.fr`)

### 5.1 Sitemaps déclarés
- `robots.txt` (bloc Yoast) déclare `Sitemap: https://www.lesbonsartisans.fr/sitemap_index.xml`.
- 13 sub-sitemaps :
  - `post-sitemap.xml` (articles blog)
  - `page-sitemap.xml` à `page-sitemap8.xml` (8 sub-sitemaps de pages = annuaire ville)
  - `job-sitemap.xml` (déprécié, lastmod 2021)
  - `category-sitemap.xml`, `post_tag-sitemap.xml`, `author-sitemap.xml`

### 5.2 Volume estimé
- **8 sub-sitemaps de pages** (Yoast 1000 URLs/sitemap par défaut) → **~5000–8000 URLs** annuaire ville.
- ~150 articles blog.

### 5.3 Patterns d'URL dominants

| # | Pattern | Description |
|---|---------|-------------|
| 1 | `/{metier}-{region}/{ville}/` | Listing artisan par métier + région + ville (slash final) |
| 2 | `/{metier}-{region}-{cp_dept}/{ville}/` | Variante avec code département dans la région |
| 3 | `/{metier}-{region}-{cp_dept}/{ville}-{cp}/` | Variante full précision (ville + cp commune) |
| 4 | `/{metier}-{region}-{cp_dept}/` | Hub métier × région+département |
| 5 | `/prix-{metier}/` | Page prix nationale du métier |
| 6 | `/services/{slug-service}/` | Pages services transversales |
| 7 | `/{slug-article}/` | Article blog au niveau racine (URL plate WordPress) |
| 8 | `/blog/` | Hub blog |

### 5.4 Exemples concrets
**Annuaire**
- `/plombier-ile-de-france/paris/`
- `/plombier-hauts-de-france-59/lille/`
- `/plombier-grand-est/troyes/`
- `/plombier-bretagne/ploemeur/`
- `/plombier-ile-de-france-91/sainte-genevieve-des-bois/`
- `/plombier-normandie/rouen/`
- `/plombier-provence-alpes-cote-dazur-13/marseille/`
- `/plombier-hauts-de-france-59/douchy-les-mines-59282/`
- `/serrurier-ile-de-france/paris-75000/`
- `/serrurier-occitanie/toulouse-31100/`
- `/serrurier-grand-est/chaumont/`
- `/serrurier-ile-de-france-77/lieusaint/`
- `/serrurier-ile-de-france-91/`
- `/climatisation-auvergne-rhone-alpes/amberieu-en-bugey/`
- `/climatisation-bourgogne-franche-comte/cosne-cours-sur-loire/`
- `/climatisation-pays-de-la-loire/sainte-luce-sur-loire/`
- `/vitrier-auvergne-rhone-alpes-69/`
- `/vitrier-hauts-de-france-59/`

**Articles & services**
- `/prix-plombier/`
- `/services/installation-serrure-electrique/`
- `/serrure-electrique/`
- `/comprendre-le-fonctionnement-des-serrures-electriques/`
- `/blog/`
- `/triple-vitrage/`
- `/credit-d-impot-porte-d-entree/`
- `/economies-d-eau-nos-conseils/`

### 5.5 Mots-clés / modificateurs
- Modificateurs urgence/qualité dans titles : `Urgence Plombier`, `Top Artisan`, `Meilleur artisan`, `Devis gratuit`.
- Modificateur prix dans URL : `prix-plombier`.
- Pas de modificateur dans les URLs ville (juste `metier-region/ville/`).

### 5.6 Fonctionnalités SEO observables
- **Combo `metier-region` dans le même slug** (ex: `plombier-ile-de-france`) = pattern original = mot-clé long-tail tout-en-un.
- Présence du **code département collé à la région** (`-91`, `-59`, `-13`, `-69`) = sub-segmentation départementale dans le slug.
- Stack WordPress + Yoast = facile à reproduire mais URL plate (article blog au niveau racine, pas de hub `/blog/{slug}`).
- Nombre limité d'articles (150 vs 5000+ Habitatpresto) = **focus annuaire, pas content marketing**.

---

## 6) StarOfService (`starofservice.com`)

### 6.1 Sitemaps déclarés
- `starofservice.fr` redirect ou inactif (timeout / pas de robots.txt utile).
- `starofservice.com/robots.txt` ne déclare aucun sitemap, mais bloque massivement (Disallow `/api*`, `/annuaire/*`, `/specialistes/*`, `/businesses/*`, `/cities/*`, `/regions/*`, `/services/*`, `/pro_profiles/*`, `/work_schedule/*`, etc.). Bloque aussi quasi tous les bots SEO/IA (AhrefsBot, GPTBot, PerplexityBot, SemrushBot, DataForSeoBot, etc.).
- Patterns extraits via Google `site:`.

### 6.2 Volume estimé
- Indexation contrôlée (beaucoup de paths disallowed). Volume réel certainement réduit vs ce que la base contient.

### 6.3 Patterns d'URL dominants

| # | Pattern | Description |
|---|---------|-------------|
| 1 | `/annubis/{region}/{departement}/{ville}/{metier}` | Listing 4 niveaux |
| 2 | `/annubis/{region}/{departement}/{ville}/{metier-precis}` | Métier détaillé (peinture-interieure, revetement-de-sol-en-stratife-et-vinyl) |
| 3 | `/professionnel/{categorie}/{ville}/{id}/{slug-entreprise}` | Fiche entreprise |
| 4 | `/demandes/{region}/{categorie}` | Page demande de devis par région |

### 6.4 Exemples concrets
- `/annubis/aquitaine/gironde/perissac/peinture`
- `/annubis/ile-de-france/paris/paris/peinture-interieure`
- `/annubis/provence-alpes-cote-d-azur/alpes-maritimes/nice/peinture-interieure`
- `/annubis/haute-normandie/seine-maritime/rouen/plomberie`
- `/annubis/picardie/oise/crepy-en-valois/peinture`
- `/annubis/pays-de-la-loire/loire-atlantique/rouans/peinture`
- `/annubis/ile-de-france/seine-et-marne/mesnil-amelot/revetement-de-sol-en-stratife-et-vinyl`
- `/annubis/provence-alpes-cote-d-azur/bouches-du-rhone/alleins/bricolage`
- `/annubis/la-reunion/la-reunion/saint-denis/droit-de-l-immigration`
- `/annubis/picardie/oise/beauvais/ebenisterie`
- `/annubis/auvergne/cantal/aurillac/book-photo`
- `/professionnel/bricolage/orleans/172404216/batiprox`
- `/professionnel/programmation-web/plougasnou/172017859/intechs-fr`
- `/professionnel/chaudiere-et-radiateur/goncelin/178900398/poelesgranules-fr-bio-belledonne-granules`
- `/demandes/auvergne/peinture`

### 6.5 Mots-clés / modificateurs
- Beaucoup de **micro-niches** dans le slug métier : `peinture-interieure` (vs `peinture`), `revetement-de-sol-en-stratife-et-vinyl`, `chaudiere-et-radiateur`, `service-de-construction`, `service-de-revetement-en-goudron`.
- Pas de modificateurs prix/devis/urgence dans les URLs.
- Utilise les anciennes régions administratives (avant 2016 : `aquitaine`, `picardie`, `haute-normandie`, `pays-de-la-loire` correctes mais `auvergne` toute seule = pré-fusion 2016).

### 6.6 Fonctionnalités SEO observables
- **`/annubis/`** est leur path de base (probablement contraction "annuaire" + nom interne). Bizarre mais signature.
- 4 niveaux géographiques fixes : region/dept/ville/metier.
- Beaucoup de sous-paths bloqués (`/annuaire/*` disallow) → ils essaient de **focaliser le crawl** sur `/annubis/` uniquement.
- Le mass-disallow des bots SEO (AhrefsBot etc.) suggère qu'ils cachent leur profondeur réelle pour éviter d'être copiés.

---

## 7) Obat (`travaux.obat.fr`)

### 7.1 Sitemaps déclarés
- `robots.txt` minimaliste : Disallow `/api/`, `/recherche?*`. **Pas de Sitemap déclaré**.
- Patterns extraits via Google `site:`.

### 7.2 Volume estimé
- Couverture nationale, plus modeste que les géants (probablement plusieurs dizaines de milliers d'URLs).

### 7.3 Patterns d'URL dominants

| # | Pattern | Description |
|---|---------|-------------|
| 1 | `/{metier}` | Hub métier national |
| 2 | `/{metier}/{ville}` | Listing métier + ville |
| 3 | `/{metier}/{departement}` | Listing métier + département |
| 4 | `/{metier}/{ville-arr-2}` | Variante "tous arrondissements" (ex: paris-2) |
| 5 | `/pro/{id}-{slug-entreprise}` | Fiche entreprise (id numérique + slug) |
| 6 | `/guides/{slug-guide}` | Guides éditoriaux (prix, conseils) |

### 7.4 Exemples concrets
- `/plombier`
- `/plomberie/seine-saint-denis`
- `/plomberie/seine-et-marne`
- `/plomberie/ile-de-france`
- `/plomberie/lyon`
- `/plomberie/paris-2`
- `/plomberie/bonneville`
- `/plomberie/laval`
- `/plomberie/hauts-de-seine`
- `/plombier/montpellier`
- `/plombier/saint-maximin-la-sainte-baume`
- `/plombier/oise`
- `/plombier/seine-et-marne`
- `/pro/456094-pcr-plombier-chauffagiste`
- `/pro/453985-rplomberie`
- `/pro/471347-hd-bati-renov`
- `/guides/prix-renovation-maison-m2/`
- `/guides/estimation-travaux/`
- `/guides/prix-travaux-peinture/`
- `/guides/renovation-combles-couts/`
- `/guides/courtier-renovation/`
- `/guides/tarif-charpentier/`
- `/guides/tarif-architecte/`
- `/guides/aides-renovation-maison-ancienne/`
- `/guides/renovation-cheminee/`

### 7.5 Mots-clés / modificateurs
- **Distinction `/plombier` (singulier individu) vs `/plomberie` (catégorie) ambivalente** sur les URLs ville/département. Inconsistance détectée (les mêmes communes existent sous les 2).
- Modificateurs prix dans guides : `prix-renovation-maison-m2`, `prix-travaux-peinture`, `tarif-charpentier`, `tarif-architecte`, `cout-{x}`.
- Modificateurs aides : `aides-renovation-maison-ancienne`.

### 7.6 Fonctionnalités SEO observables
- URL **très courtes et plates** : `/plombier/{ville}` (2 segments seulement). Plus aérée que les concurrents.
- Pas de niveau région dans l'URL.
- Pages "Top 20" dans titles.
- Sous-domaine `travaux.obat.fr` (Obat est éditeur de logiciel, l'annuaire est une stratégie SEO secondaire).
- Architecture sous-domaine = isolement SEO + pas de pollution du domaine principal `obat.fr`.

---

## 8) 123devis (`123devis.com`)

### 8.1 Sitemaps déclarés
- `robots.txt` ABSENT ou bloqué (curl timeout).
- Patterns extraits via Google `site:`.

### 8.2 Volume estimé
- Couverture nationale métier × département × ville × tâche granulaire. Très probablement >100k pages.

### 8.3 Patterns d'URL dominants

| # | Pattern | Description |
|---|---------|-------------|
| 1 | `/s/{metier}/{cp_dept}/` | Listing métier par département |
| 2 | `/s/{cp_dept}/{ville}/{metier}/` | Listing métier + ville (avec cp_dept en préfixe) |
| 3 | `/s/{cp_dept}/{ville}/{metier}/{tache-precise}/` | Listing par tâche précise |
| 4 | `/d/{cp_dept}/{slug-entreprise}--{id}/` | Fiche entreprise (id en suffixe avec double tiret) |

### 8.4 Exemples concrets
- `/s/petits-travaux-plomberie/69/` (plombier petits travaux dpt 69)
- `/s/petits-travaux-plomberie/77/`
- `/s/petits-travaux-plomberie/13/`
- `/s/petits-travaux-plomberie/39/`
- `/s/petits-travaux-plomberie/75/`
- `/s/plomberie/69/` (plombier installation dpt 69)
- `/s/69/lyon-7/petits-travaux-plomberie/`
- `/s/69/lyon-1/ballon-chauffe-eau/chauffe-eau-installation-remplacement/`
- `/s/69/lyon-1/installation-sanitaires-lavabo-douche-baignoire-bidet/`
- `/s/69/lyon-3/ballon-chauffe-eau/`
- `/s/13/salon-de-provence/petits-travaux-plomberie/`
- `/s/71/lugny-les-charolles/plomberie/`
- `/s/34/faugeres/plomberie/`
- `/d/69/kadded-nordine--762313/`
- `/d/69/etablissements-pierre-darmet-et-cie--667541/`
- `/d/91/alexandre-pers-plombier-chauffagiste--1035830/`
- `/d/28/m-y-plombier--974094/`
- `/d/57/allo-plombier-jacquot-yannick--791388/`
- `/d/73/kcs-plomberie--651779/`
- `/d/92/monsieur-beakou-alain-choisy--924487/`

### 8.5 Mots-clés / modificateurs
- **Granularité tâche extrême** : `petits-travaux-plomberie` (vs simple `plomberie`), `chauffe-eau-installation-remplacement`, `installation-sanitaires-lavabo-douche-baignoire-bidet`, `ballon-chauffe-eau`.
- Pas de "devis" dans les URLs (paradoxal pour un site nommé "123devis").
- Métiers très spécifiques inclus dans des slugs longs (lavabo, douche, baignoire, bidet listés comme un seul keyword).

### 8.6 Fonctionnalités SEO observables
- **Slugs hyper-keyword-stuffed** : `installation-sanitaires-lavabo-douche-baignoire-bidet` = bourrage de mots-clés agressif.
- Préfixe `/s/` (search) et `/d/` (detail) = convention vintage type "search engine".
- 2 patterns concurrents pour le même besoin : `/s/{metier}/{cp_dept}/` (national-département) et `/s/{cp_dept}/{ville}/{metier}/` (ville-département).
- Code département en préfixe **avant** le nom de ville (ordre inverse de PagesJaunes qui le met en suffixe `-69`).
- Suffixe `--{id}` sur fiches entreprise = id stable mais URL un peu sale.

---

## SYNTHÈSE — Patterns dominants et recommandations Bativio

### A. Vue d'ensemble : qui utilise quel pattern ?

| Pattern type | PagesJaunes | Travaux.com | Bilik | Habitatpresto | Lesbonsartisans | StarOfService | Obat | 123devis |
|--------------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| `/{metier}/{ville}` | | partiel | | | | | OUI | |
| `/{ville}/{metier}` | | | OUI | | | | | |
| `/{ville}-{cp}/{metier}` | OUI | | | | | | | |
| `/{categorie}/{metier}-pros/{ville}` | | OUI | | | | | | |
| 4 niveaux geo (region+dept+ville) | | | | OUI | | OUI | | |
| `/{metier}-{region}/{ville}/` | | | | | OUI | | | |
| `/s/{metier}/{cp_dept}/{ville}/{tache}` | | | | | | | | OUI |
| Fiche pro `/pros/{slug}` ou `/d/...` ou `/presentations/{id}-{slug}` | OUI | OUI | OUI | OUI | (en page) | OUI | OUI | OUI |
| Hub métier national | OUI | OUI | OUI | OUI | OUI | | OUI | |
| Hub département | OUI | | | OUI | OUI | OUI | OUI | OUI |
| Hub région | | | | OUI | OUI | OUI | | |
| Hub arrondissement | OUI (paris-1er) | OUI (paris-01) | OUI (lyon-3) | | | | OUI (paris-2 = tous) | OUI (lyon-1) |
| Guides prix dédiés `/{metier}/guide-des-prix/...` | | OUI | | dans /mag/ | `/prix-{metier}/` | | `/guides/prix-...` | |
| Articles de fond `/mag/...` ou `/blog/...` | | OUI | | OUI (massif) | OUI | | OUI (guides) | |
| Section "pros" B2B (acquisition artisan) | | | | OUI | | | | |
| Pages "demandes/devis" dédiées | | | | OUI | | OUI | | |
| Sitemap HTML utilisateur | | | OUI | | | | | |

### B. Granularité géographique observée

| Niveau | Adoption |
|---|---|
| **Région** (slug long type "auvergne-rhone-alpes") | Habitatpresto, StarOfService, Lesbonsartisans (collé au métier dans le slug) |
| **Département** (slug + cp à 2 chiffres) | PagesJaunes (suffixe), 123devis (préfixe), Habitatpresto, Obat, StarOfService, Lesbonsartisans |
| **Ville (commune)** | TOUS sans exception |
| **Arrondissement** | PagesJaunes, Travaux.com, Bilik, Obat (en mode "tous"), 123devis (lyon-7) |
| **Quartier** | AUCUN (signal : Bativio peut prendre cet espace s'il existe en V2) |
| **Code postal commune (5 chiffres)** | PagesJaunes (paris-75000), Lesbonsartisans (douchy-les-mines-59282) |

### C. Modificateurs SEO récurrents

**Dans les URLs** (rare car URL = nom de la chose, pas l'intent) :
- `professionnels` (Travaux.com) — segmentation B2B/annuaire
- `prix-`, `tarif-`, `cout-` (Travaux.com guides, Habitatpresto mag, Obat guides, Lesbonsartisans `/prix-{metier}/`)
- `guide-des-prix/`, `/guides/`, `/mag/` (sections éditoriales prix)
- `petits-travaux-`, `installation-`, `renovation-`, `depannage-` (intent dans le slug métier)
- `urgence-` (StarOfService, Lesbonsartisans en title)
- `cote-particuliers` (PagesJaunes — segmentation B2C)
- `rge` (Bilik dans page sitemap)

**Dans les title tags** (très répandu) :
- "Top 10 / Top 20 / Top 5"
- "Devis gratuit"
- "Meilleur artisan"
- "À proximité"
- "Urgence"

### D. Fonctionnalités SEO transversales

1. **Hub triade obligatoire** chez 6/8 concurrents : `/metier`, `/metier/ville`, `/metier/departement`. Bativio a déjà `/metiers/{slug}` — vérifier qu'on a aussi le hub département.
2. **Pages prix** : Travaux.com, Habitatpresto, Obat, Lesbonsartisans investissent massivement (top revenue keywords). C'est une mine d'or content marketing.
3. **Articles "pratiques" / guides longs** : Habitatpresto domine avec ~5000 articles datés et fraîcheur agressive (lastmod quotidien).
4. **Section B2B pour acquérir artisans** : Habitatpresto a `/pro/conseils/...` (visibilité, pratiques, administratif). Pour Bativio, cette stratégie capture les artisans **avant** qu'ils signent ailleurs.
5. **Sitemaps HTML** : Bilik (`/sitemaps/...`) — boost discovery + UX. Bativio peut copier.
6. **Granularité tâche** : 123devis hyper-granulaire (`chauffe-eau-installation-remplacement`). Risque cannibalisation si trop poussé.

### E. Volume comparé (estimations)

| Concurrent | Estimation pages annuaire | Estimation pages éditoriales |
|---|---|---|
| PagesJaunes | Plusieurs millions | Modeste |
| Travaux.com | ~500k–1M | ~500–1500 (guides + articles + jobs) |
| Bilik | ~500k+ (200 métiers × milliers communes) | ~100 |
| Habitatpresto | ~300k–500k (annuaire sous-domaine) | ~5000+ articles datés |
| Lesbonsartisans | ~5000–8000 | ~150 articles |
| StarOfService | inconnu (mass-disallow) | Modeste |
| Obat | ~30k–50k | ~200 guides |
| 123devis | ~100k+ | Modeste |

### F. Recommandations actionnables pour Bativio

#### À IMITER

1. **Pattern URL `{ville}/{metier}` (style Bilik)** — clean, court, réplicable. Bativio a déjà `[ville]/[slug]` artisan, ajouter `[ville]/[metier]` pour les listings.
2. **Code département en suffixe ville** style PagesJaunes (`lyon-69`) **OU** le mettre invisible dans les titles. À éviter en path, à mettre en breadcrumb.
3. **Hub département** (`/{departement}`, `/{departement}/{metier}`) — manqué chez Bativio actuellement. Avec 5 villes en V1 + Rhône-Alpes, ouvrir `/rhone`, `/savoie`, `/haute-savoie`, `/isere`, `/drome` est trivial et capte du trafic régional.
4. **Pages prix par métier** (`/prix/{metier}` ou `/{metier}/prix-{tache}`) — combo guide-des-prix Travaux.com + dispatch Habitatpresto. Bativio a déjà `/prix/[metier]` (vu dans commit récent), continuer dans cette direction.
5. **Pages comparatifs** style "X vs Y" (déjà fait chez Bativio, vu dans commits) — à étendre.
6. **Sitemap HTML utilisateur** style Bilik (`/sitemaps`, `/sitemaps/metiers`, `/sitemaps/villes`) — gain SEO direct.
7. **Section B2B pour artisans** (`/pour-les-artisans/...` ou `/pro/conseils/...`) — capte les artisans avant inscription. Habitatpresto le fait très bien.
8. **Pages "{metier} {modificateur}"** : `depannage-{metier}`, `urgence-{metier}`, `{metier}-rge` — chacune capte une intent différente. PagesJaunes le fait beaucoup.
9. **Articles datés + lastmod actif** dans le sitemap (même pour vieux articles si touchés). Habitatpresto en fait un signal de fraîcheur agressif.
10. **Slug métier en variantes** (plombier ET plomberie ET depannage-plomberie) chez PagesJaunes — Bativio peut traiter `plombier`, `plomberie`, `urgence-plombier` comme métiers distincts (avec contenu différencié).

#### À ÉVITER

1. **4 niveaux de profondeur géographique** style Habitatpresto (`/met/x/reg/y/dep/z/vil/v`) — URL trop longue, profondeur de crawl pénalisante. Bativio ne couvre que Rhône-Alpes en V1, pas besoin.
2. **Annuaire sur sous-domaine séparé** style `annuaire.habitatpresto.com` — fragmente le link juice. Garder tout sur `bativio.fr`.
3. **Path préfixé `/annubis/`** style StarOfService — préfixes inhabituels créent friction utilisateur.
4. **Slugs hyper-stuffed** style 123devis (`installation-sanitaires-lavabo-douche-baignoire-bidet`) — pénalité Google possible et UX horrible.
5. **Doubler les URLs** style Bilik (`/lyon/plombier` ET `/annuaire/villes/lyon/plombier`) — duplicate content, gérer canonical impeccablement OU choisir un seul path.
6. **Ancien régions administratives** style StarOfService (`auvergne` seul, `picardie` seul) — depuis 2016 c'est `auvergne-rhone-alpes`, `hauts-de-france`. Bativio doit utiliser les nouvelles.
7. **Encodage caractères spéciaux** style Habitatpresto (`auvergne-rh%C3%B4ne-alpes`) — utiliser `auvergne-rhone-alpes` (sans accent, ASCII pur).
8. **Path déprécié massivement disallowed** style Habitatpresto qui disallow `/prix/` mais expose `/mag/.../prix-x` — sentir le legacy. Penser dès le départ une architecture qui survit à 5 ans.
9. **Bloquer GPTBot / ClaudeBot / PerplexityBot** style Bilik — Bativio doit au contraire embrasser les LLMs (ChatGPT search, Claude, Perplexity) car le trafic GEO/AEO grandit. Continuer la stratégie déjà en place.
10. **Mass-disallow des bots SEO** style StarOfService (cache toute la profondeur) — Bativio doit rester transparent avec Ahrefs/Semrush (utiles pour audits).

#### Priorités V2 Bativio (ordre d'impact estimé)

1. Hub département `/{dept}` et `/{dept}/{metier}` pour Rhône, Savoie, Haute-Savoie, Isère, Drôme.
2. Pages "{metier} {modificateur}" : `depannage-plombier`, `urgence-electricien`, `plombier-rge`.
3. Pages comparatif/alternative (`X vs Y`, `alternatives à X`) — déjà commencé.
4. Section `/pour-artisans/conseils/{rubrique}/{slug}` pour B2B artisan SEO.
5. Sitemap HTML `/plan-du-site` ou `/sitemaps/...` (boost discovery).
6. Articles de fond avec lastmod actif (signal fraîcheur).
7. Granularité quartier (V3 si Lyon/Grenoble s'agrandissent) — espace libre.

### G. Notes méthodo

- PagesJaunes et Travaux.com sont protégés Cloudflare → impossible de fetch leurs sitemap.xml directement. Patterns extraits via `site:` Google.
- Habitatpresto offre les sitemaps les plus exploitables (XML directement accessibles, lastmod fiables, structure claire).
- StarOfService et Bilik bloquent activement les bots IA → impossible d'utiliser WebFetch (qui passe par notre infra). Couvert via `site:` operator.
- Les 6 concurrents principaux ont tous une **fiche entreprise** unique mais 6 conventions différentes (`/pros/`, `/professionnel/`, `/presentations/`, `/d/`, `/pro/`, slug nu) → **aucune convention dominante**. Bativio peut garder `/{ville}/{slug-artisan}` qui est aussi propre que tout ce qui existe.

---

*Sources fetchées : robots.txt + sitemap.xml de chaque site quand accessible, sinon Google `site:` operator. Échantillons de sub-sitemaps (Bilik, Habitatpresto, Lesbonsartisans) inspectés directement.*
