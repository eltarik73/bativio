# Matrice features concurrence — Bativio

> Audit benchmark concurrentiel — recherche web réalisée le 26 avril 2026
> Périmètre : 10 plateformes mise en relation particuliers/artisans en France + Bativio
> Sources principales : Trustpilot, Pappers, Wikipedia, Pitchbook, presse spé BTP (LeMoniteur, Batiactu, Batiweb, Maddyness)

---

## 1. Tableau synthétique des features

Légende : O = oui (présent) / N = non (absent ou non documenté) / P = partiel / ? = MANQUANT

| # | Feature | Bativio | Habitatpresto | Travaux.com | ManoMano Pro | IZI by EDF | AlloVoisins | MesDépanneurs | Maison St-Gobain | Bobex | 123Devis | Quotatis |
|---|---------|---------|---------------|-------------|--------------|------------|-------------|---------------|------------------|-------|----------|----------|
| **MODÈLE ÉCO** | | | | | | | | | | | | |
| 1 | Zéro commission artisan | **O** | O (abo only) | N (lead) | O (free) | O (forfait) | O (depuis pivot) | N (15-20%) | N (séquestre) | O (lead) | O (abo only) | P (lead + abo) |
| 2 | Abonnement mensuel artisan | **O (0/19/39/59€)** | O (70-220€) | N | O SuperPro 59€ | N (gratuit) | O (membres) | N | N | N | O (50-100€) | O (Select Plus 179€) |
| 3 | Lead payant | N | N | O (1-99€/lead) | N | N | N | N | N | O | N | O |
| 4 | Freemium / page gratuite | **O** | N | N | O | N | N | N | N | N | N | O (Page Artisan) |
| 5 | Gratuit pour particulier | **O** | O | O | O (B2B only) | O | O | O | O | O | O | O |
| **OUTILS DEVIS / FACTURE** | | | | | | | | | | | | |
| 6 | Devis IA estimation | **O (Opus ±10%)** | P (Coach IA) | N | O (ManoPilot voice) | N | N | N | O (estimation tool) | N | N | N |
| 7 | PDF devis avec mentions légales | **O (16 mentions)** | ? | ? | ? | O | ? | ? | ? | ? | ? | ? |
| 8 | Signature électronique | **O ("Bon pour accord")** | N (signature offline) | ? | ? | O (devis client signé) | O (contrat auto) | ? | ? | ? | ? | ? |
| 9 | Conformité Factur-X 2026 | N (à faire) | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| 10 | Facturation électronique intégrée | **O (Invoquo embed)** | ? | ? | O (HT invoices) | ? | ? | ? | ? | ? | ? | ? |
| **MATCHING / VITRINE** | | | | | | | | | | | | |
| 11 | Vitrine artisan personnalisée | **O (4 templates)** | O | O | N | O (annuaire) | O | O | O | O | O | O |
| 12 | Annuaire SEO ville/métier | **O (5 villes RA)** | O (national) | O (national) | N | O (national) | O (national) | O | O | O | O | O |
| 13 | Chat in-app artisan/client | **O (qualif IA)** | O (messagerie) | ? | O (purchase asst) | N (conseiller) | O | O | O | O | N | O |
| 14 | Suivi chantier | N | P (dashboard) | N | O (track projects 2025) | O | N | N | O | N | N | N |
| **CONFIANCE / GARANTIES** | | | | | | | | | | | | |
| 15 | Vérification SIRET/RGE | **O (SIRET INSEE)** | O (vérif) | O | O (B2B) | O (RGE only) | O | O | O | O (Graydon) | O | O |
| 16 | Avis clients vérifiés | N (à faire) | O | O | O | O | O | O | P | O | O | O (Bazaarvoice) |
| 17 | Paiement séquestre | N | N | N | N | O (gestion bout en bout) | O (compte bloqué) | O | O (acompte sécurisé) | N | N | P (forfait pose) |
| 18 | Garantie / assurance plateforme | N | N | N | N | O (SAV EDF) | O (selon mission) | O | O | N | N | P |
| **MOBILE / PWA** | | | | | | | | | | | | |
| 19 | App mobile native | **O (PWA)** | ? | ? | O (iOS+Android) | O (Réseau IZI app) | O | P | ? | ? | ? | ? |
| **POSITIONNEMENT** | | | | | | | | | | | | |
| 20 | Couverture géographique | **5 villes Rhône-Alpes** | National | National | National | National | National | Grandes villes FR | National | France + Benelux | National | National + Europe |
| 21 | Année création | 2025 | 2005 | 1999 | 2013 (Pro 2019) | 2017 | 2013 | 2013 | 2014 | 1999 | 1999 | 1999 |
| 22 | Note Trustpilot | N (jeune) | 4.1/5 (1700+) | 4/5 (10000+) | 4.1/5 (90000+) | 4.7/5 (13000+) | 4+/5 (avis biaisés signalés) | ? | "mixte" (52 avis) | "Excellent" 4.5/5 (.be) | 8.3/10 (1860) | **2.6/5 (323) — ALERTE** |

---

## 2. Profil court de chaque concurrent (3 lignes)

### Bativio
- **Modèle** : zéro commission, abo artisan 0/19/39/59€/mois (4 paliers GRATUIT/STARTER/PRO/BUSINESS)
- **Différenciants** : devis IA Opus avec estimation marché ±10%, chat qualif IA, signature simple "Bon pour accord", PDF avec 16 mentions légales, intégration Invoquo facturation électronique
- **Cible** : artisans Rhône-Alpes (5 villes : Chambéry, Annecy, Grenoble, Lyon, Valence) — positionnement local hyper ciblé

### Habitatpresto
- Créé en 2005 (SAS Paris 75015), 5 000+ artisans inscrits, modèle abonnement fixe **70-220€ HT/mois** sans commission selon zone/métier (engagement 6 mois critiqué)
- USP : "5 devis gratuits en 48h", IA matching + Coach Travaux chatbot
- Faiblesse : 22% de notes 1 étoile sur Trustpilot (4.1/5 globale), engagement 6 mois jugé restrictif par artisans

### Travaux.com
- Créé en 1999, filiale **HomeAdvisor depuis 2008** + actionnaire Nexity, 48 000 pros / 40 000 projets/mois (national)
- USP : volume + ancienneté
- Faiblesse : modèle **lead payant 1-99€/lead** très critiqué côté artisans (paie avant signature), jusqu'à 10 artisans en concurrence sur même lead, modération avis biaisée

### ManoMano Pro
- Filiale ManoMano (créé 2013, **valorisé 2,6 Md$ en 2021**, levée 732 M$), B2B Pro lancé 2019
- Modèle : adhésion gratuite + abo SuperPro 59€/mois HT (livraison gratuite), pas de commission lead, **suite digitale Pro 2025** (devis + suivi chantier + IA ManoPilot vocal)
- USP : achat matériel pro + assistants IA — **pas un concurrent direct mise en relation client mais en train de pivoter**

### IZI by EDF
- Filiale EDF lancée 2017, **1 200 artisans RGE partenaires**, focus rénovation énergétique uniquement
- Modèle B2B2C unique : EDF vend le devis au client puis "balance" un chantier déjà signé à l'artisan, **commission 30% prélevée selon une source / 0% selon autre source — DONNÉE CONTRADICTOIRE**, paiement à 15 jours, forfait fixe par prestation
- USP : "chantiers déjà signés", note **4.7/5 Trustpilot (13 000+ avis)**, gestion SAV bout en bout

### AlloVoisins
- Créé 2013, **6M utilisateurs / 300k pros revendiqués en 2025**, levée 3M€ initiale
- **Pivot freemium 2024** : suppression commission 15%, modèle abo membres mensuel illimité, paiement séquestre intégré + assurance + contrat auto
- Faiblesse : Trustpilot a signalé sollicitation d'avis non conforme = biais possible, généraliste (pas spé BTP)

### MesDépanneurs.fr
- Créé 2013, racheté **10 M€ par Engie en 2017**, **revendu au fondateur en janvier 2025**
- 1 200 artisans, **commission 15-20%** par intervention, focus dépannage urgence 24/7 + petits travaux
- USP : intervention 3-20 min en grande ville, paiement client → reverse à l'artisan moins commission

### La Maison Saint-Gobain
- Marque du groupe Saint-Gobain (industriel matériaux), positionnement "rénovation sans stress" pour particuliers
- Modèle : 100% gratuit pour client, **paiement séquestre par la plateforme** + outil estimation budget intégré, conseiller dédié + transmission à pros agréés
- Faiblesse : seulement 52 avis Trustpilot (visibilité limitée), B2C-first, **DONNÉE MANQUANTE — recherche n'a pas trouvé** modèle de monétisation artisan exact

### Bobex
- Créé en **décembre 1999 à Bruxelles** par 2 ex-Arthur D. Little, présent FR + Benelux + reste Europe (24+ ans)
- Modèle "Lead Generation" : gratuit demandeur, pros paient au lead/résultat, vérification Graydon Creditsafe, multi-secteur (pas que BTP)
- Note Trustpilot Belgique : 4.5/5 "Excellent" — **DONNÉE MANQUANTE — recherche n'a pas trouvé** rating spécifique .fr ni détail tarifs leads

### 123Devis
- Créé en 1999, **filiale HomeAdvisor** (comme Travaux.com), envoie max 5 artisans par demande via SMS+email
- Modèle abo 50-100€/mois pour les artisans abonnés, gratuit particulier
- Note 8.3/10 Trustpilot (1 860 avis), faiblesses : faux contacts dénoncés par artisans, fraude sporadique

### Quotatis
- Créé 1999, **filiale Adeo (Leroy Merlin) depuis 2014**, n°1 européen pay-per-lead, 1M+ projets/an, 10k+ entreprises clientes, 6 000 pros qualifiés
- Modèle hybride : Page Artisan gratuite + Select Plus **179€/mois** + forfaits de pose depuis 2018
- **Trustpilot 2.6/5 — "Poor" (323 avis)** = signal alarmant pour leader européen, malgré gestion avis Bazaarvoice industrialisée

---

## 3. Top 5 features sous-exploitées (= opportunité Bativio)

1. **Conformité Factur-X 2026 / PA agréée**
   Aucun concurrent benchmarké ne communique clairement sur l'intégration native Factur-X obligatoire au 1er sept. 2026 (réception) / 2027 (émission TPE). Bativio + Invoquo a une fenêtre de 4-12 mois pour devenir LA réf "facturation conforme intégrée gratuitement à mon abo plateforme".

2. **Devis IA avec estimation marché chiffrée (±10%)**
   Habitatpresto a un "Coach Travaux" chatbot, ManoMano a ManoPilot vocal pour acheter du matos, mais **aucun concurrent ne propose une estimation chiffrée du marché par poste de travaux** (atout actuel Bativio Opus).

3. **Vrai zéro commission ET vrai abonnement transparent**
   Habitatpresto = abo opaque 70-220€ selon zone, Quotatis = 179€/mois Select Plus, IZI = info contradictoire 0/30%. Bativio peut écraser sur la transparence : "19/39/59€ point. Pas de fourchette, pas de zone, pas de surprise."

4. **Suivi chantier intégré (timeline + photos + jalons)**
   Seul ManoMano Pro et Maison Saint-Gobain commencent à proposer un dashboard suivi. Habitatpresto, Travaux.com, 123Devis, Quotatis, Bobex = absents. Une feature timeline + livraison photo + signature de réception serait différenciante.

5. **Plateforme agréée signature électronique conforme eIDAS**
   Le "Bon pour accord" Bativio est simple — aucun concurrent ne propose de signature avancée eIDAS qui aurait valeur juridique forte en cas de litige. Combiné à Factur-X = bundle conformité unique sur le marché TPE BTP.

---

## 4. Top 5 features universelles (= must-have non négociable)

1. **Annuaire SEO ville × métier** — Tous l'ont (10/10). Bativio doit rester compétitif sur le local Rhône-Alpes.
2. **Vitrine artisan publique** — 9/10 (sauf ManoMano Pro). Bativio OK avec 4 templates.
3. **Vérification SIRET / qualifications** — 10/10. Bativio OK (recherche-entreprises.api.gouv.fr).
4. **Chat / messagerie in-app artisan ↔ client** — 8/10. Bativio OK (chat qualif IA).
5. **Avis clients vérifiés** — 9/10 (sauf Bativio = à faire). **GAP CRITIQUE** : c'est un standard absolu du marché, à shipper en P0.

> Bonus sous-jacent : **gratuité particulier** est universelle (10/10) — jamais facturer le client final.

---

## 5. Carte de positionnement 2x2 (axe prix client × qualité matching)

```
Qualité matching ↑ (curation forte, conseillers, garantie)
                   |
                   |
   IZI by EDF *    |    * Maison Saint-Gobain
   (cher pour      |     (séquestre + conseillers)
    client final,  |
    forfait fixe)  |
                   |   * MesDépanneurs (urgence chère)
                   |
                   |
Prix client cher --+-------------------- Prix client low / gratuit
                   |
                   |
                   |   * Quotatis           * Bobex
                   |     (note 2.6/5...)     (multisectoriel)
                   |
                   |   * Habitatpresto    * Travaux.com  * 123Devis
                   |     (matching IA)      (volume        (HomeAdvisor
                   |                         lead payant)   filiale)
                   |
                   |   * AlloVoisins       * ManoMano Pro
                   |     (généraliste,       (B2B matos,
                   |      6M users)          pas matching pur)
                   |
                   |   * BATIVIO ←—— positionnement actuel
                   |     (zéro commission, abo transparent,
                   |     local RA, IA devis, freemium)
                   ↓
Qualité matching ↓ (mass-market, lead arrosé, peu de curation)
```

### Lecture stratégique

- **Quadrant haut-droit (qualité forte + prix bas particulier)** est PRESQUE VIDE — c'est le sweet spot où Bativio doit s'installer.
- IZI by EDF y est partiellement mais avec des prix client élevés et un focus rénovation énergétique uniquement.
- Habitatpresto/Travaux.com/123Devis dominent le bas-droit (lead arrosé, pas de garantie).
- **Stratégie recommandée Bativio** : monter en qualité matching (avis vérifiés, paiement séquestre optionnel, vraie sélection artisans Rhône-Alpes) tout en gardant le freemium et l'absence de commission. Combiné à la conformité Factur-X 2026 → narratif différenciant fort.

---

## Sources

- [Marty App — Avis Habitat Presto Pro 2026](https://www.marty-app.com/blog/avis-habitat-presto)
- [Habitatpresto Trustpilot](https://www.trustpilot.com/review/www.habitatpresto.com)
- [Pappers Habitatpresto](https://www.pappers.fr/entreprise/habitatpresto-483343356)
- [Travaux.com Trustpilot](https://www.trustpilot.com/review/travaux.com)
- [Marty App — Travaux.com](https://www.marty-app.com/blog/avis-travaux-com)
- [Coover — 123devis.com pour les pros](https://www.coover.fr/trouver-chantiers/123devis-com)
- [Coover — Quotatis pour les pros](https://www.coover.fr/trouver-chantiers/quotatis)
- [Quotatis Trustpilot](https://www.trustpilot.com/review/www.quotatis.fr)
- [French Hub — Quotatis Adeo](https://frenchhub.fr/quotatis-services-artisans-europe)
- [ManoMano Pro page officielle](https://www.manomano.fr/pro)
- [Zepros — SuperPro abonnement ManoMano](https://negoce.zepros.fr/actu-enseignes/abonnement-superpro-manomano-pro-veut-capter-plus-pros)
- [ConstructionBTP — ManoMano offre digitalisée 2025](https://www.constructionbtp.com/batiment/article/2025/05/05/152659/manomano-lance-une-offre-services-100-digitalisee)
- [Pitchbook — ManoMano valuation](https://pitchbook.com/profiles/company/94096-90)
- [L'Usine Nouvelle — ManoMano 2,6 Md$](https://www.usinenouvelle.com/article/manomano-valorise-plus-de-2-milliards-de-dollars-apres-une-nouvelle-levee-de-fonds.N1118934)
- [IZI by EDF site officiel](https://izi-by-edf.fr/)
- [IZI by EDF Trustpilot](https://www.trustpilot.com/review/izi-by-edf.fr)
- [Selectra — IZI by EDF avis](https://selectra.info/energie/fournisseurs/edf/izi-by-edf)
- [Coover — IZI pour les pros](https://www.coover.fr/trouver-chantiers/izi)
- [Blog Réseau IZI by EDF — chantiers signés](https://blog-reseau.izi-by-edf.fr/reseau-izi-by-edf-solution-trouver-chantiers-signes)
- [Le Journal des Entreprises — AlloVoisins suppression commission](https://www.lejournaldesentreprises.com/article/allovoisins-supprime-les-commissions-pour-ses-4-millions-de-membres-1889375)
- [AlloVoisins Trustpilot](https://www.trustpilot.com/review/www.allovoisins.com)
- [FrenchWeb — AlloVoisins freemium](https://www.frenchweb.fr/allovoisins-les-etapes-dun-passage-au-modele-freemium/396191)
- [Wikipedia — MesDépanneurs.fr](https://fr.wikipedia.org/wiki/MesD%C3%A9panneurs.fr_(entreprise))
- [Maddyness — MesDépanneurs racheté par fondateur 2025](https://www.maddyness.com/2025/01/16/le-fondateur-de-mesdepanneurs-fr-reprend-les-renes-de-sa-startup-sept-ans-apres-la-vente-a-engie/)
- [MesDépanneurs.fr site officiel](https://www.mesdepanneurs.fr/)
- [La Maison Saint-Gobain](https://www.lamaisonsaintgobain.fr/)
- [La Maison Saint-Gobain Trustpilot](https://fr.trustpilot.com/review/lamaisonsaintgobain.fr)
- [Wikipedia — Bobex](https://fr.wikipedia.org/wiki/Bobex)
- [Bobex.be Trustpilot](https://www.trustpilot.com/review/www.bobex.be)
- [Bobex.fr](https://www.bobex.fr/)
- [Service Public — Plateformes agréées Factur-X](https://entreprendre.service-public.gouv.fr/actualites/A18759)
- [Tolteck — Factur-X 2026 artisans](https://www.tolteck.com/fr-fr/facturation-electronique-tout-ce-que-les-artisans-du-batiment-doivent-savoir-avant-2026/)
- [Batappli — Facturation électronique BTP 2026](https://www.batappli.fr/facturation-electronique-btp-2026)
