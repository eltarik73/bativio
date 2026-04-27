# SEO Audit — Bativio

Infrastructure d'audit SEO automatise du site `bativio.fr`.

**Cette infra ne modifie aucune page publique.** Elle est purement diagnostique.

## A quoi ca sert

A executer regulierement (hebdo / mensuel) pour mesurer :
- Sante technique des pages indexees (titles, meta, H1, JSON-LD, alts, liens brises)
- Performance Web Vitals (LCP, INP, CLS, TTFB)
- Couverture des mots-cles cibles (audience clients vs audience artisans)
- Detection de contenu duplique entre pages

Le rapport sert de base de travail pour les corrections SEO suivantes (ETAPE-SEO-02 et plus).

## Comment lancer l'audit

```bash
npm run seo:audit
```

Sortie :
- `seo-audit/reports/audit-{YYYY-MM-DD}.json` : donnees brutes
- `seo-audit/reports/audit-{YYYY-MM-DD}.md` : rapport humain (7 sections)
- `seo-audit/technical/audit-{date}.json` : detail audit technique (par page)
- `seo-audit/technical/perf-{date}.json` : detail Web Vitals
- `seo-audit/content/content-{date}.json` : densite mots-cles + hashes texte

Duree typique : **3-5 minutes** (depend de PageSpeed API + nombre URLs auditees).

## Comment interpreter le rapport

Le rapport markdown a 7 sections :

1. **Synthese executive** — score global /100 + decompte issues
2. **Problemes CRITIQUES** — 4xx, JSON-LD invalide, H1 manquant, liens brises
3. **Problemes MAJEURS** — title trop long/court, meta missing, alts manquants, hierarchie cassee
4. **Problemes mineurs** — canonical manquant, OG incomplet, twitter card, peu de mots
5. **Performance Web Vitals** — score PageSpeed Insights par URL prioritaire
6. **Couverture mots-cles** — top 25 mots-cles avec >0 occurrences (par audience)
7. **Contenu duplique** — pages avec hash MD5 identique (signal red flag SEO)

Ensuite vient une section **Top 10 actions prioritaires** : recommandations triees par impact/frequence.

### Score global

- **90-100** : excellent, pret pour acquisition organique
- **70-89** : bon mais quelques optimisations a faire
- **50-69** : moyen, a ameliorer avant push gros volume de contenu
- **<50** : critique, plusieurs chantiers urgents

## Variables d'environnement

| Variable | Defaut | Role |
|---|---|---|
| `SEO_AUDIT_BASE_URL` | `https://www.bativio.fr` | Domaine cible (peut pointer sur preview Vercel) |
| `PAGESPEED_API_KEY` | _(vide)_ | Cle Google PageSpeed Insights — optionnelle mais recommandee (sans : 1 req/sec, 25k req/jour quota anonyme) |

Pour generer une cle PageSpeed gratuite :
1. https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com
2. Activer l'API + creer une cle API
3. Mettre dans `.env.local` : `PAGESPEED_API_KEY=AIza...`

## Structure

```
seo-audit/
  README.md                   <-- ce fichier
  scripts/
    keywords.json             <-- mots-cles cibles par audience
    audit-technical.ts        <-- audit titles/meta/H1/JSON-LD/alts/liens
    audit-perf.ts             <-- audit Web Vitals via PageSpeed Insights
    audit-content.ts          <-- audit densite mots-cles + duplicate content
    run-audit.ts              <-- orchestrateur + generation rapport
  technical/                  <-- output detaille technique (gitignore)
  content/                    <-- output detaille contenu (gitignore)
  onpage/                     <-- reserve pour futures analyses
  reports/                    <-- output final JSON+MD (gitignore)
```

Les dossiers `technical/`, `content/`, `onpage/`, `reports/` sont exclus du deploiement Vercel (cf `.vercelignore`).

## URLs auditees

Le script decouvre dynamiquement les URLs depuis `https://www.bativio.fr/sitemap.xml`.
Selection prioritaire (max 30 URLs) :
- Homepage `/`
- Toutes les pages villes hub (Lyon, Chambery, Annecy, Grenoble, Valence)
- Pages metier-ville prioritaires (electricien-X, plombier-X, peintre-X, chauffagiste-X)
- Pages travaux/<slug>/<ville>
- `/facturation-electronique`, `/tarifs`

## Limitations connues

- L'audit performance prend ~10-15s par URL (PageSpeed API). Sans cle, throttling 1 req/sec.
- L'audit technique limite a 30 URLs pour eviter timeout. Augmente cette limite si besoin dans `audit-technical.ts` ligne `discoverUrls`.
- La detection de "contenu duplique" hash les 5000 premiers chars (assez pour signal pertinence, pas pour analyse fine).
- Les mots-cles avec accents sont compares en lowercase mais la detection est sensible aux variations (`électricien` != `electricien`).

## Prochaine etape

Une fois le rapport genere, valider avec Tarik puis lancer **ETAPE-SEO-02** (corrections on-page basees sur les findings).
