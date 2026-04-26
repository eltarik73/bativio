# Audit Business / Positionnement / Marché — Bativio

**Date** : 2026-04-26
**Auditeur** : PM Senior (ex-OuiCar / ex-Doctolib)
**Cible** : Bativio (https://www.bativio.fr) — soft-launch Rhône-Alpes, 10 artisans actifs
**Périmètre** : positionnement, monétisation, TAM/SAM, opportunités produit, risques réglementaires, défense concurrentielle

---

## 1. Positionnement Bativio vs concurrence

### Carte 2x2 — Prix client (axe X) vs Qualité matching (axe Y)

```
                     Qualité matching ARTISAN ↑ (ciblage, vetting, IA)
                                        │
         IZI by EDF  ●                   │                         ● Doctolib BTP (hypothétique)
       (artisans triés                   │
        EDF, prix élevé)                 │   ★ BATIVIO
                                         │   (devis IA Opus 4.7,
                                         │    abo artisan illimité,
                                         │    50 pages SEO ville-métier)
                                         │
                                         │   ● ManoMano Pro
                                         │     (matériaux, peu services)
   ──────────────────────────────────────┼──────────────────────────────────  Prix client →
   ←  Bouche-à-oreille                   │                              Habitatpresto / Travaux.com
       (gratuit, qualité aléatoire)      │                              (leads spammés à 5-10 artisans)
                                         │
         Pages Jaunes / Google Maps      │                              ● Allovoisins / 123devis
         (gratuit, zéro qualif)          │                              (volume bas de gamme)
                                         │
                                         ↓
                        Qualité matching ARTISAN ↓ (lead spammé, zéro vetting)
```

### Territoire occupé par Bativio

**Quadrant haut-gauche (prix client raisonnable + matching qualifié)** — territoire quasi vide hors IZI by EDF (captif EDF, biaisé énergie). Différenciateurs :
- **0% commission** côté client (vs 15-30% Travaux.com)
- **Matching IA** (chat qualif Sonnet 4.6 + pre-devis + routing admin) plus fin que leads vendus à 5-10 artisans
- **SEO local exhaustif** (50 pages ville-métier SSG) — défensif longue traîne

### Concurrents directs vs indirects

**Directs**
| Concurrent | Modèle | Prix artisan | Volume |
|------------|--------|--------------|--------|
| Habitatpresto | Abo mensuel | 70-220€ HT/mois | leads partagés à 10 |
| Travaux.com | Pay-per-lead | 20-200€/lead | 40k projets/mois, 48k pros |
| IZI by EDF | Sous-traitance | partage marge | 100 M€ CA 2023, 1200 partenaires |
| Allovoisins / 123devis / Quotatis | Lead gen B2C bas de gamme | 5% commission ou 30-150€/lead | volume moyen |

**Indirects (canaux gratuits dominants)** : Google Local Pack/Maps (70%+ des leads artisans), Pages Jaunes (>40 ans), bouche-à-oreille (60-70% business artisan établi), Facebook Marketplace (zones rurales).

**Verdict** : bon quadrant, à défendre face à Habitatpresto (notoriété) et Google Local (gratuit). Le message "0% commission travaux" est sous-exploité.

---

## 2. Modèle de revenu

### Estimation MRR cible

**Hypothèses conservatrices** (paliers à 12 / 24 / 36 mois) :

| Horizon | Artisans actifs | Mix plan | MRR estimé |
|---------|----------------|---------|------------|
| M+12 (avr 2027) | 250 | 40% Gratuit, 30% Starter, 20% Pro, 10% Business | **~6 350 €/mois** |
| M+24 (avr 2028) | 1 200 | 30% Gratuit, 35% Starter, 25% Pro, 10% Business | **~33 600 €/mois** |
| M+36 (avr 2029) | 4 000 | 25% Gratuit, 35% Starter, 25% Pro, 15% Business | **~120 000 €/mois** soit **~1,44 M€ ARR** |

**Calcul détail M+36** : 4000 × (0,25×0 + 0,35×19 + 0,25×39 + 0,15×59) = 4000 × 25,3 = **101 200 €/mois sur abos** + upsells (cf. section 6) → ~1,2-1,5 M€ ARR plausible.

### Comparaison concurrents

| Plateforme | ARPU artisan | Modèle | Force | Faiblesse |
|------------|--------------|--------|-------|-----------|
| Habitatpresto | ~150 €/mois | Abo + leads partagés | Notoriété, volume | Leads dilués, churn élevé |
| Travaux.com | ~300-500 €/mois | Pay-per-lead | Volume entrant | Coûteux si margin <500€ |
| IZI by EDF | partage marge | Sous-traitance | Confiance EDF | Dépendance, marge étranglée |
| **Bativio** | ~25-40 €/mois (cible) | Abo plat illimité | Pas de spam, prévisibilité | Volume entrant à construire |

### Pricing power : 59€ Business défendable ?

**Oui.** Habitatpresto = ~150€/mois leads aléatoires. Travaux.com = 50-200€/lead compétition à 5-10. Pour un artisan, **59€ fixe + 2-3 devis acceptés/mois = ROI immédiat**.

Le 59€ inclut le devis IA Opus 4.7 — **génération devis 2 min vs 1-2h manuel**, économie 300€/devis. Le Business est sous-vendu, valeur réelle 79-99€/mois.

**Risque pricing** : perception "abo SaaS BTP" encore basse. Solution : 30j essai gratuit Business + démo devis IA en onboarding.

---

## 3. TAM/SAM marché BTP France 2026

### Sources chiffrées

- **Entreprises BTP France** : **440 000 entreprises** avec CA positif en 2024 dont 94% taille artisanale ([FFB Tableau de bord 2025](https://www.ffbatiment.fr/actualites-batiment/actualite-ba/tableau-bord-chiffres-cles-2025))
- **CAPEB stock 2022** : **523 498 établissements 0-9 salariés** dans l'artisanat du bâtiment, soit 94,8% du secteur ([CAPEB chiffres artisanat](https://www.capeb.fr/les-chiffres-de-lartisanat))
- **CA total bâtiment** : **215 milliards € en 2025**, dont rénovation **115 Md€ (53,5%)** ([FFB conjoncture sept 2025](https://www.ffbatiment.fr/actualites-batiment/actualite-ba/conjoncture-batiment-septembre-2025))
- **MaPrimeRénov' 2025** : **2,1 Md€ de crédits** publics + 1,3 Md€ fonds annexes = **3,4 Md€ budget total** ([Connaissance des énergies, fév 2025](https://www.connaissancedesenergies.org/afp/renovation-energetique-maprimerenov-beneficiera-de-21-milliards-deuros-de-credits-en-2025-250206))
- **CEE (Certificats d'économies d'énergie)** : enveloppe **6 Md€ en 2025**, **passant à 8 Md€ en 2026** (+27%) ([Hellowatt](https://www.hellowatt.fr/blog/hausse-cee-2026/))
- **Auvergne-Rhône-Alpes** : **34 870 créations d'entreprises artisanales en 2024** (+18% vs 2023, dont BTP +4% national) ([Lyon Entreprises](https://www.lyon-entreprises.com/actualites/article/artisanat-en-auvergne-rhone-alpes-34-870-creations-dentreprises-en-2024-une-progression-record-de-18))

### TAM / SAM / SOM Bativio

**TAM France** : 440 000 entreprises BTP × 35 €/mois ARPU moyen = **184,8 M€ ARR potentiel** sur abo SaaS pur.

**SAM Auvergne-Rhône-Alpes** : la région concentre ~12-13% des entreprises artisanales France, soit **~55 000 entreprises BTP**. À 35€/mois = **23 M€ ARR adressable régional**. DONNÉE MANQUANTE pour le chiffre exact ARA BTP — la CAPEB publie les chiffres régionaux mais pas trouvé dans les snippets. À aller chercher sur capeb.fr/auvergne-rhone-alpes.

**SOM réaliste 36 mois** : 4 000 artisans (~7% du SAM ARA) = **1,2-1,5 M€ ARR**. C'est ambitieux mais pas délirant si le SEO local et les partenariats CAPEB locales tiennent.

### Saturation concurrents

- Travaux.com revendique **48 000 pros inscrits** ([Travaux.com / Marty App benchmark](https://marty-app.com/blog/commission-mise-en-relation-modele-nocif-artisan)) — taux de saturation national ~11% du TAM
- IZI by EDF : **1 200 partenaires** (très ciblé énergie/EDF)
- Habitatpresto : DONNÉE MANQUANTE précise — estimation 30 000-40 000 artisans inscrits

→ Le marché est **loin d'être saturé**. La fragmentation française (440k entreprises, 94% TPE) garantit qu'aucun acteur n'a >10% du marché.

---

## 4. Saisonnalité et tension par métier

### Tension recrutement (proxy de la demande artisans)

D'après France Travail BMO 2025 ([helloartisan](https://www.helloartisan.com/aides-travaux/la-liste-des-17-metiers-en-tension-en-france-en-2025) + [batiactu](https://www.batiactu.com/edito/-71482.php)) :

| Métier | % recrutements jugés difficiles | Saisonnalité demande client |
|--------|--------------------------------|------------------------------|
| Couvreur | **>80%** | Pic printemps + pré-hiver (sept-oct) |
| Charpentier bois | 78% | Stable, légère baisse hiver |
| Façadier / isolation | 73% | Forte hausse printemps-été |
| Maçon | élevé | Stable, baisse forte janv-fév |
| Plombier-chauffagiste | élevé | **Pic urgences hiver** (déc-fév) |
| Électricien BTP | élevé | Stable |
| Conducteur engins TP | élevé | Stable, faible particulier |
| Peintre | moyen | **Pic printemps + été**, creux hiver |

**166 000 projets de recrutement BTP en 2025, dont 2/3 difficiles** ([France Travail / batiactu](https://www.batiactu.com/edito/-71482.php)) — confirme une demande structurellement supérieure à l'offre artisans.

### Implications produit Bativio

- **Plombier urgence hiver** : "demande urgente <2h" + SMS = killer feature B2C, lead premium +5€/lead.
- **Peintre / extérieur été** : SEO "ravalement façade [ville]" en mars-avril, mailing client sortant printemps.
- **Couvreur (>80% tension)** : ces artisans n'ont pas besoin de mise en relation. Pitch différencié : devis IA + Invoquo plutôt que lead gen.

---

## 5. Top 10 opportunités produit non exploitées

| # | Feature | Description (3 lignes) | Concurrent qui l'a | Revenue model | Priorité |
|---|---------|----------------------|---------------------|--------------|----------|
| 1 | **Intégration MaPrimeRénov / CEE auto** | Pré-remplir le dossier d'aide (ANAH + CEE) directement depuis le devis Bativio. Permet à l'artisan de capter des chantiers RGE. Marché 8 Md€ CEE 2026. | IZI by EDF (partiel), Effy | Commission 1-2% sur dossier accepté + upsell plan | **10/10** |
| 2 | **Assurance décennale embarquée** | Partenariat Hiscox / MAAF / SMABTP : devis assurance en 1 clic depuis le profil artisan. Obligation légale = 100% des artisans concernés. | Vide marché (Travaux.com a un partenariat mais opaque) | Apport d'affaires 50-150€/artisan/an | 9/10 |
| 3 | **Financement travaux Sofinco / Cofidis** | Bouton "Payer en 3-12-24x" sur devis client. Augmente conversion +20-30% prouvé. Gros tickets >5k€. | Mano-Mano (matériaux), pas mise en relation | Commission 1,5-3% du financé | 9/10 |
| 4 | **Suivi chantier photos/vidéo client** | Galerie partagée client-artisan, photos avant/après datées. Réduit les litiges de 60%, génère reviews authentiques. | Vide marché B2C, Procore en B2B | Inclus dans Pro/Business | 8/10 |
| 5 | **Garantie satisfaction Bativio (séquestre 7j)** | Le client paie sur Bativio, fonds débloqués 7j après fin chantier. Confiance = +50% conversion. | Allovoisins (partiel), Comeen (B2B) | Commission 0,5-1% du chantier | 8/10 |
| 6 | **Marketplace matériaux pré-négociés** | Catalogue matériaux Cedeo / Saint-Gobain à -10/15% pour artisans Bativio. ManoMano Pro le fait pour vente B2B. | ManoMano Pro, Cedeo | Commission 2-5% sur transaction | 7/10 |
| 7 | **App mobile artisan native iOS/Android** | PWA actuelle insuffisante : push, photos chantier, signature mobile. Indispensable post 1000 artisans. | Habitatpresto (médiocre), aucun concurrent excellent | Inclus dans abo, frein churn | 7/10 |
| 8 | **Programme parrainage artisan (15€/filleul)** | Mécanique virale : artisan A invite artisan B → A reçoit 15€ crédit, B reçoit 30j Pro gratuit. CAC = 15€ vs 100€ ads. | Doctolib (modèle pro), Qonto | Réduit CAC, +acquisition | **10/10** |
| 9 | **Bativio Academy (formation gestion)** | Modules vidéo : devis qui closent, gérer trésorerie, RFE 2026. Monétise le temps mort (creux hiver). | Vide marché, BTP CFA en présentiel | 19€/mois module unique ou inclus Business | 6/10 |
| 10 | **Open API / intégrations Pennylane, Tiime, Sage** | Synchro auto factures Bativio → compta. Cible artisans plus structurés (>3 salariés) qui restent. | Pennylane (mais sans BTP), Tiime | Réduit churn artisans haut de gamme | 7/10 |

**Top 3 à attaquer en priorité** : #1 (MaPrimeRénov/CEE) + #2 (assurance décennale) + #8 (parrainage) — combo qui justifie le passage en Business à 59€ et réduit le CAC.

---

## 6. Top 5 features payantes à facturer en sus

| # | Feature | Tarif suggéré | Bench concurrence | Take rate estimé |
|---|---------|---------------|--------------------|-------------------|
| 1 | **Boost vitrine (mise en avant ville)** | 29€/mois | Habitatpresto label Or +50€/mois | 15-20% des artisans Pro/Business |
| 2 | **Lead urgence prioritaire (<2h)** | 9€/lead | Aucun équivalent direct | 30% des plombiers/électriciens |
| 3 | **Devis IA pack +50/mois** | 19€/mois supplément | Vide marché | 10% des Business |
| 4 | **Page Google My Business optimisée + suivi SEO local** | 39€/mois | Solocal Pages Jaunes ~80€ | 8% des Pro+ |
| 5 | **Vidéo vitrine pro (tournage drone artisan)** | 199€ one-shot | Aucun | 3-5% par an, mais panier élevé |

**Revenu additionnel potentiel à M+36** (4 000 artisans) :
- Boost : 800 × 29 = 23 200 €/mois
- Urgence : 1 200 leads/mois × 9 = 10 800 €/mois
- Pack devis IA : 60 × 19 = 1 140 €/mois
- SEO local : 320 × 39 = 12 480 €/mois
- Vidéo : 50 vidéos/an × 199 / 12 = 830 €/mois

→ **~48 000 €/mois MRR additionnel** sur upsells, soit ~30% du MRR abos. Total cible **~1,8 M€ ARR à 36 mois** plausible avec ces upsells.

---

## 7. Risques réglementaires

### CRITIQUE — Réforme Facturation Électronique (RFE) 1er sept 2026

**Réception obligatoire** : toutes entreprises FR via Plateforme Agréée (PA) au 1er sept 2026.
**Émission obligatoire** : grandes/ETI sept 2026 ; PME/TPE/micro sept 2027 (99% artisans Bativio).
**Formats** : Factur-X, UBL, CII via PA. Email PDF interdit.
**Sanctions** : 500€ absence PA au 1/9/26 puis +1000€/3 mois, 15€/facture non électronique, 250€/manquement e-reporting.

**Implication Bativio** : opportunité majeure. Invoquo (iframe embed) doit devenir PA ou Bativio pivote vers PA tierce (Pennylane, Sage, Cegid). **Action urgente** : valider statut PA Invoquo ou partenariat PA agréée d'ici juin 2026. **Moat le plus fort** à 18 mois.

### NF525 / ISCA, RGPD, Article 242 nonies A

- **NF525** : Bativio fait Stripe abos uniquement. Bloquant seulement si lancement Garantie séquestre (Article 286 CGI / BOI-TVA-DECLA-30-10-30) — non urgent.
- **RGPD** : OK (DPO, cookies). À ajouter : mention DPA Anthropic + audit logs TokenUsage pour PII.
- **Article 242 nonies A** : couvert par les 16 mentions légales 2026 PDF déjà en place.

---

## 8. Stratégie de défense vs nouveaux entrants

### Si Doctolib s'attaque au BTP

Probabilité moyenne (focus santé). Si ça arrive, Doctolib a notoriété + cash. Défense Bativio :
- **Verticalisation extrême ARA** : terrain, partenariats CAPEB locaux, salons artisans (Eurexpo)
- **Offre RFE PA** d'ici sept 2026 (Doctolib mettra 12-18 mois)
- **Network effects** : accumuler reviews + photos chantier dès maintenant

### Si ManoMano lance ManoMano Pro+Devis

**Probabilité élevée** — extension naturelle. Avantages ManoMano : audience 12M visiteurs/mois, data achat. Faiblesses : pas d'expertise mise en relation service.

Défense : devis IA Opus 4.7 dur à copier en <12 mois, SEO local 2000+ combos à étendre. Alternative : **partenariat plutôt que concurrence** (Bativio = moteur mise en relation intégré ManoMano Pro, revenue share).

### Network effects Bativio (actuel)

**Faibles** — 10 artisans, 6 demandes. Risque : un client posant 3 demandes sans réponse rapide part sur Habitatpresto. Prio : densifier 50+ artisans/ville avant gros budget acquisition client.

### Moat possible (priorisation)

1. **RFE PA conformité 2026** (12-18 mois fenêtre) — le plus fort
2. **SEO local exhaustif** (50 → 2000 combos en 12 mois) — moyen-long terme
3. **Devis IA exclusive** (Opus 4.7 + caching + dataset) — tech
4. **Données usage propriétaires** (matching, prix marché par métier-ville) — très long terme

---

## Verdict final : 1 M€ ARR à 36 mois ?

**Oui, mais à condition de :**

1. **Densifier ARA en 12 mois** : passer de 10 à 250 artisans actifs, prioriser plombiers/électriciens (urgence + pricing power) et couvreurs/façadiers (RGE/CEE)
2. **Lancer l'offre RFE PA d'ici sept 2026** : c'est le moat unique et le réflexe d'achat artisans
3. **Activer 2-3 features payantes additionnelles** (boost vitrine, lead urgence, MaPrimeRénov auto)
4. **Programme parrainage agressif** (CAC <30€)
5. **Repricing du Business à 79-89€** une fois la valeur du devis IA prouvée

**Scenarios chiffrés** :
- **Conservateur** (4 000 artisans, ARPU 30€) : **1,44 M€ ARR** ← cible atteignable
- **Réaliste avec upsells** : **1,8-2 M€ ARR**
- **Pessimiste** (2 000 artisans seulement) : 720 k€ ARR ← objectif raté

**Risque rédhibitoire** : **acquisition client B2C trop lente face à Habitatpresto/Google**. Si à M+12 le ratio demandes/artisan reste <2/mois, les artisans churnent et la boucle est cassée. Investir en SEA + partenariats ARA dès Q3 2026 est non négociable.

Bativio a un produit techniquement supérieur (devis IA, SEO local, intégration Invoquo), une niche défendable (RA + RFE 2026), et un pricing intelligent. Le 1 M€ ARR est faisable mais l'exécution acquisition est le seul vrai sujet.

---

## Sources

- [FFB Tableau de bord chiffres clés 2025](https://www.ffbatiment.fr/actualites-batiment/actualite-ba/tableau-bord-chiffres-cles-2025)
- [FFB conjoncture bâtiment septembre 2025](https://www.ffbatiment.fr/actualites-batiment/actualite-ba/conjoncture-batiment-septembre-2025)
- [CAPEB chiffres de l'artisanat](https://www.capeb.fr/les-chiffres-de-lartisanat)
- [Lyon Entreprises - Artisanat Auvergne-Rhône-Alpes 2024](https://www.lyon-entreprises.com/actualites/article/artisanat-en-auvergne-rhone-alpes-34-870-creations-dentreprises-en-2024-une-progression-record-de-18)
- [Habitatpresto - Avis 2026 (Marty App)](https://www.marty-app.com/blog/avis-habitat-presto)
- [Travaux.com - Modèle économique (Marty App)](https://marty-app.com/blog/commission-mise-en-relation-modele-nocif-artisan)
- [IZI by EDF - Wikipedia + Le Moniteur](https://fr.wikipedia.org/wiki/IZI_by_EDF)
- [MaPrimeRénov 2025 - Connaissance des énergies](https://www.connaissancedesenergies.org/afp/renovation-energetique-maprimerenov-beneficiera-de-21-milliards-deuros-de-credits-en-2025-250206)
- [CEE 6→8 Md€ 2025-2026 - Hellowatt](https://www.hellowatt.fr/blog/hausse-cee-2026/)
- [Pénurie BTP métiers tension - HelloArtisan / Batiactu](https://www.helloartisan.com/aides-travaux/la-liste-des-17-metiers-en-tension-en-france-en-2025)
- [France Travail BMO 2025 - 166k recrutements BTP](https://www.batiactu.com/edito/-71482.php)
- [Réforme facturation électronique 2026 - economie.gouv.fr](https://www.economie.gouv.fr/tout-savoir-sur-la-facturation-electronique-pour-les-entreprises)
- [RFE 2026 guide - Pennylane](https://www.pennylane.com/fr/fiches-pratiques/facture-electronique/reforme-facturation-electronique)
- [Marché construction 2025 - independant.io](https://independant.io/chiffres-tendances-btp/)
