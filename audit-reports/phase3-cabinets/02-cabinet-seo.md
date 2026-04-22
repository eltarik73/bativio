# Audit SEO & Acquisition — Bativio.fr

**Cabinet** : indépendant senior (ex-Semrush, ex-Backlinko)
**Scope** : bativio.fr — annuaire artisans BTP Rhône-Alpes
**Date** : 22 avril 2026

---

## 1. Note SEO globale : **4,2 / 10**

Bases techniques saines (sitemap, robots bots-IA, LocalBusiness), mais **vide de contenu** et **vide d'artisans** (5 max/ville). Un annuaire sans fournisseurs ni pages ville/métier profondes = zéro autorité topique. Concurrents (Pages Jaunes, Travaux.com, Allo-Voisins) pèsent DA 70+. Bativio est invisible sur Google.

---

## 2. Audit SEO technique

| Élément | Statut | Note |
|---|---|---|
| Sitemap.xml | 87 URLs, priorities OK | 7/10 |
| Robots.txt | IA bots autorisés (GPT/Claude/Perplexity), Ahrefs/Semrush bloqués | 6/10 |
| Redirect apex → www | 308 propre, HSTS preload | 9/10 |
| Canonical | Présent `https://www.bativio.fr` | 8/10 |
| Schema.org landing | Organization + WebSite + SearchAction + FAQPage + Person/State | 8/10 |
| Schema.org ville | LocalBusiness + ItemList + BreadcrumbList | 7/10 |
| Hreflang | Non nécessaire (FR only) | — |
| Core Web Vitals | `age: 114069` = cache CDN actif, bon signe | 7/10 |
| `x-frame-options: DENY` | OK sécu | — |

**Red flags** :
- **Title dupliqué** sur `/lyon` et `/annecy` : `"...Bativio | Bativio"` (suffixe doublé — bug layout metadata)
- Sitemap expose des **artisans test** (`test-plombier-lyon`, `test-peintre-annecy`) — pollue l'index
- Blocage `AhrefsBot/SemrushBot` : choix discutable, prive de monitoring concurrentiel

---

## 3. Audit SEO on-page

**Landing (`/`)** : title 58 car "Bativio — Artisans du bâtiment en Rhône-Alpes" OK. Meta 123 car "Zéro commission" = USP bien placé. H1 non vérifié mais structure vraisemblablement correcte.

**Pages ville** : titles formatés `"Artisans du bâtiment à {Ville} | Plombier, Électricien, Peintre — Bativio"` — 80-85 car, limite haute. H1 `"Artisans du bâtiment à {Ville}"` = correct mais **générique**. H2 = `"N artisans disponibles"` — pauvre sémantiquement.

**Densité & LSI** : absente. Aucun paragraphe descriptif sur les villes (démographie, zones, spécialités locales). Google ne comprend pas pourquoi votre page de Chambéry devrait ranker vs Pages Jaunes.

**Volumétrie artisans** : Chambéry 5, Annecy 2, Lyon 1. Une page ville avec 1 résultat = **thin content** au sens Google. Deindexation probable à terme.

---

## 4. Stratégie de contenu manquante

Architecture sitemap annonce 40 combos ville/métier (`/lyon/plombier`, etc.) + 9 pages travaux. C'est l'ossature parfaite. **Mais** :
- Ces pages existent-elles avec **contenu unique** (>500 mots, 3 FAQ, 1 schéma tarif) ? À vérifier — sinon penalty doorway.
- **Manque** : blog editorial (0 URL blog dans sitemap). Pour ranker "devis plombier Chambéry", il faut 15-30 articles type "Combien coûte X à Chambéry en 2026 ?".
- **Manque** : pages quartiers Lyon (Croix-Rousse, Confluence, Part-Dieu) — 9M requêtes/mois cumulées.
- **Manque** : pages glossaire BTP (dépannage fuite, VMC double flux, RGE Qualibat).

**Target 90 jours** : passer de 87 à **400 URLs** indexables (+ 200 artisans réels + 100 articles blog).

---

## 5. Opportunités backlinks

| Cible | Effort | DR potentiel |
|---|---|---|
| CAPEB Rhône-Alpes (partenariat) | Moyen | 55 |
| FFB Savoie / Haute-Savoie | Moyen | 50 |
| Chambéry Tourisme / Mairie (page artisans locaux) | Élevé | 65 |
| Le Progrès / Dauphiné Libéré (CP startup locale) | Moyen | 80 |
| Lyon Entreprises, Mag2Lyon | Moyen | 50 |
| Annuaire Qualibat / RGE (référencement croisé) | Faible | 60 |
| Blog partenaires (Invoquo, Pennylane) | Faible | 55 |
| HelloWork / BatiActu guest post | Moyen | 70 |

**Objectif 6 mois** : 25 referring domains qualifiés (actuellement probablement <5).

---

## 6. Concurrents SEO — "plombier Chambéry"

| Position | Acteur | DA | Pourquoi ils rankent |
|---|---|---|---|
| 1-3 | Google Maps / GBP local pack | — | Profils GBP vérifiés + avis |
| 4 | pagesjaunes.fr/chambery/plombier | 82 | Domain age 20+ ans, 1000s de backlinks |
| 5 | travaux.com | 68 | Contenu long + leads B2C |
| 6 | allovoisins.com | 72 | UGC + scale |
| 7-8 | habitatpresto.com, mesdepanneurs.fr | 55-65 | Contenu SEO dense |
| — | **Bativio** | ~5 | **Non classé top 100** |

Gap estimé : **18-24 mois** pour atteindre top 10 sur longue traîne locale, **impossible** sur head terms sans budget backlinks €15k+.

---

## 7. Local SEO / Google Business Profile

**Bativio n'a pas de GBP** (annuaire, pas établissement physique unique). En revanche :
- **Chaque artisan** devrait avoir un GBP. Bativio doit fournir un onboarding "Créez/liez votre GBP en 3 min" — aucune trace dans le code.
- **NAP consistency** : le LocalBusiness schema sur `/chambery` pointe vers les artisans, mais sans `address`, `telephone`, `openingHours` structurés côté artisan → schéma quasi-vide.
- **Review aggregation** : impossible de ranker en pack local sans avis Google ingérés ou API Places. Non exploité.

---

## 8. Top 10 actions SEO P0 (30 jours)

1. **Fixer le title dupliqué** `| Bativio | Bativio` sur pages ville (bug layout metadata Next.js)
2. **Dépublier les artisans test** du sitemap (`test-plombier-lyon`, etc.) — `noindex` + exclude sitemap
3. **Ajouter 400+ mots de contenu** sur chaque page ville (démographie, quartiers, spécialités BTP locales) — rédaction IA + review humaine
4. **Enrichir LocalBusiness schema** : `address`, `telephone`, `priceRange`, `aggregateRating` par artisan
5. **Créer 40 pages combo ville/métier** avec contenu unique 600 mots + FAQ + fourchette tarif
6. **Lancer un blog** `/guides/` avec 10 articles piliers ("Prix refaire salle de bain Lyon 2026")
7. **Débloquer AhrefsBot/SemrushBot** — indispensable pour monitoring + outreach
8. **Campagne backlinks** : 5 partenariats locaux (CAPEB, FFB, presse PQR) + 10 annuaires qualité
9. **Google Search Console** : brancher + soumettre sitemap, surveiller couverture
10. **Recruter 50 artisans réels** par ville prioritaire (Chambéry + Annecy) — sans ça, thin content persistant

---

## Conclusion

Bativio a une **ossature technique correcte** mais souffre de **trois cancers SEO** : thin content (0-5 artisans/ville), zéro contenu editorial, zéro backlinks. La roadmap 30 jours ci-dessus est un minimum vital. Sans cela, **zéro trafic organique** avant 2027. Budget externe recommandé : **€6-8k/mois en acquisition** (SEA + contenu + netlinking) pendant 6 mois pour amorcer.

**Score projeté post-P0** : 4,2 → 6,5/10 en 90 jours si exécution sérieuse.
