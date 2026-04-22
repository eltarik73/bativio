# Audit concurrentiel — SaaS pro artisans BTP

**Date :** 22 avril 2026
**Périmètre :** Obat, Tolteck, Kizeo Forms, Sage Batigest Connect, Fizen vs Bativio

---

## 1. Pricing détaillé

| Solution | Entrée de gamme | Haut de gamme | Par user ? | Facturation élec. incluse |
|----------|-----------------|---------------|------------|---------------------------|
| **Obat** | 25-49€/mois (Pro) | 85-129€/mois (Booster) | 1 compte owner | Oui (anti-fraude 2024, pas PA explicite) |
| **Tolteck** | 19€/mois annuel (25€/mois HT mensuel) | idem (plan unique) | Non précisé | Partiel, roadmap 2026 floue |
| **Kizeo Forms** | 15€/user/mois (annuel) | 25€/user/mois (Business) | **Oui, par user** | Non (formulaires terrain, pas facturation) |
| **Sage Batigest Connect** | 30€/user/mois (Essentials) | 102€/user/mois (Enterprise) | **Oui, par user** | Oui, PA Sage incluse + 12 000 flux/an |
| **Fizen** | Site indisponible ce jour | — | — | — |
| **Bativio** | 0€ → 19€ (Starter) | 59€ (Business) | 1 artisan | Oui, via Invoquo embed |

**Insight :** Bativio est **le seul à proposer un plan gratuit** et est **positionné sous Obat/Sage** tout en embarquant facturation élec. Sage devient vite cher dès 2 users (60-204€/mois).

---

## 2. Features signature

- **Obat :** Bibliothèque Batichiffrage (30 000 prix BTP), 300 modèles devis, signature électronique, URSSAF, connexion bancaire. **Le plus complet pour artisan seul.**
- **Tolteck :** Simplicité radicale, offline natif, bibliothèque ouvrages, multi-device. **Le plus ergonomique.**
- **Kizeo Forms :** Formulaires terrain, OCR photo, saisie vocale IA, 200+ intégrations. **Roi du chantier mobile, pas de devis/facture.**
- **Sage Batigest Connect :** Comptabilité intégrée, PA native, déboursé sec, métré. **Le plus "corporate", lourd.**
- **Bativio :** Annuaire public SEO + vitrine web artisan + devis/facturation Invoquo + CRM + RDV. **Seul à combiner acquisition + gestion.**

---

## 3. Forces/Faiblesses (Trustpilot, forums)

| Solution | Forces | Faiblesses |
|----------|--------|------------|
| Obat | 4,9/5 Google, 20 000 clients, support réactif | Prix au-dessus marché, limité multi-chantier/équipe |
| Tolteck | 4,8/5 Trustpilot, 28 000 clients, simplicité | **App mobile limitée** (pas de pointage, pas d'intervention), pas d'ERP |
| Kizeo Forms | Terrain-first, IA intégrée | Pas de devis/facture, prix par user qui explose |
| Sage Batigest | Robuste, PA incluse, 9,6/10 expert | **Pas d'app mobile propre** (dépend d'Alobees/Gesquo), prix élevé |

---

## 4. UX mobile

- **Tolteck :** app viewable mais dégradée vs desktop — pas de pointage d'heures.
- **Obat :** app iOS/Android correcte, focus devis/facture, pas de vrai suivi chantier.
- **Kizeo Forms :** mobile-first, champion absolu du terrain (signature, géoloc, photos).
- **Sage Batigest :** pas d'app native — **faiblesse majeure** en 2026.
- **Bativio :** PWA installable, nav bottom bar, viewport-fit cover — bon niveau, à pousser sur captures terrain (photos chantier, signature client).

---

## 5. Support facturation électronique 2026

- **Obligation :** réception 1er sept 2026 (tous), émission 1er sept 2027 (TPE/artisans).
- **Sage :** PA propriétaire, gratuite pour clients, 12 000 flux/an. Leader conformité.
- **Pennylane :** PA agréée, écosystème BTP (Graneet intégré). **Référence du marché.**
- **Obat/Tolteck :** communication floue, pas de PA propriétaire annoncée → dépendance PPF/partenaire.
- **Kizeo :** hors scope facture.
- **Bativio via Invoquo :** positionnement embed, **doit clarifier sa PA** (propriétaire vs Pennylane). Cf. skill `pennylane-pa`.

---

## 6. Ce que Bativio DOIT avoir

1. **PA officielle** (propriétaire ou Pennylane partner) communiquée clairement dès la home.
2. **Factur-X natif** (PDF/A-3 + XML CII) généré par Invoquo, pas juste affichage.
3. **App mobile devis chantier** : photo + signature client tactile + géoloc + mode offline (gap Tolteck/Sage).
4. **Bibliothèque prix BTP** (type Batichiffrage) — grand absent aujourd'hui vs Obat.
5. **Pointage heures chantier** multi-ouvriers (gap Tolteck/Obat).
6. **Import INSEE/SIRET** automatique (déjà fait, à valoriser).
7. **Attestation éditeur NF525/ISCA** (skill `nf525-isca`) dès que devis engageants.

---

## 7. Trou de marché

**Personne ne combine bien :**

- **Acquisition client** (annuaire SEO + vitrine web indexable) **+ gestion** (devis, facture, CRM, RDV). Obat/Tolteck/Sage sont pure gestion ; PagesJaunes/StarOfService sont pure acquisition.
- **Vitrine artisan SEO-ready par ville** — 20M visiteurs/mois cherchent sur annuaires BTP, aucun SaaS de gestion n'en profite.
- **Devis IA conversationnel grand public** où le client décrit son besoin en langage naturel et reçoit une fourchette avant contact artisan (gap total).
- **Plan gratuit crédible** pour convertir le micro-entrepreneur sceptique → funnel que seul Bativio peut jouer.

**Positionnement Bativio :** *"Le seul SaaS qui te trouve des clients ET les facture"* — angle unique face aux concurrents pure gestion.

---

## Sources

- [Obat pricing](https://www.obat.fr/tarifs) · [Obat avis 2026](https://tool-advisor.fr/logiciel-facturation/comparatif/obat/) · [Obat Trustpilot](https://www.trustpilot.com/review/obat.fr)
- [Tolteck pricing](https://www.tolteck.com/tarifs) · [Tolteck avis 2026](https://outilios.fr/avis-tolteck/) · [Tolteck Trustpilot](https://www.trustpilot.com/review/tolteck.com)
- [Kizeo Forms tarifs](https://www.kizeo-forms.com/fr/tarifs/) · [Kizeo BTP](https://www.kizeo-forms.com/fr/secteurs/btp/)
- [Sage Batigest Connect avis](https://www.appvizer.fr/construction/btp/sage-batigest-i7) · [Sage facturation élec. 2026](https://www.sage.com/fr-fr/dematerialisation/facture-electronique/)
- [Pennylane PA BTP](https://help.pennylane.com/fr/articles/630036-la-facturation-electronique-pour-le-secteur-du-btp-enjeux-et-solutions-avec-pennylane) · [Graneet PA 2026](https://www.graneet.com/fr/article/facturation-electronique-dans-le-btp-comment-choisir-sa-plateforme-agreee-pour-2026)
- [Obat annuaires BTP](https://www.obat.fr/blog/annuaire-artisans-du-batiment/) · [Payflo comparatif 2026](https://payflo.fr/blog/meilleurs-logiciels-gestion-artisan-btp-guide-complet/)
