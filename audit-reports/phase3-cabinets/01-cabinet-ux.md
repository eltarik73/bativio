# Audit UX externe — Bativio.fr

**Cabinet indépendant senior | 22 avril 2026**
Périmètre : landing, annuaire Chambéry, tarifs, facturation électronique, inscription, connexion.

---

## 1. Note globale : **5.8 / 10**

Bon positionnement et onboarding malin, mais l'expérience annuaire — coeur du produit — est sous-dimensionnée, et la promesse B2B n'est pas encore tenue visuellement. Le produit est en avance sur son design.

Détail : Landing 6.5 / Annuaire 4.5 / Tarifs 6.5 / Facturation 6 / Inscription 8 / Connexion 7.

---

## 2. Top 5 problèmes UX bloquants

| # | Problème | Localisation | Sévérité |
|---|----------|--------------|----------|
| 1 | **Zéro avis/notation sur les artisans** alors que la home promet "notés par leurs clients" — promesse trahie | /chambery (cards) | Critique |
| 2 | **Aucun CTA direct sur les cards artisan** ("Demander devis", "Appeler"). L'utilisateur doit cliquer la card, charger la vitrine, rescanner — 3 clics minimum pour convertir | /chambery | Critique |
| 3 | **Profils incomplets affichés en prod** ("Cet artisan n'a pas encore complété son profil") — casse la confiance en moins de 3 secondes | /chambery | Haute |
| 4 | **Double CTA hero concurrents** ("Chercher" vs "Décrire mon projet IA") sans hiérarchie — l'utilisateur hésite, la loi de Hick s'applique. Aucun n'est visuellement dominant | / (hero) | Haute |
| 5 | **Facturation électronique = 100% texte**, zéro capture d'écran ni schéma. Vendre un produit complexe (PPF, Factur-X) sans visuel = taux de rebond élevé sur cible peu tech | /facturation-electronique | Haute |

---

## 3. Top 5 quick wins

1. **Ajouter "Demander un devis" en CTA secondaire sur chaque card artisan** (24h dev, +30% de conversion annuaire attendue).
2. **Filtrer les profils incomplets de l'annuaire public** ou les masquer jusqu'à complétion 70%. 1 ligne Prisma `where: { completionScore: { gte: 70 } }`.
3. **Hiérarchiser le CTA hero** : "Décrire mon projet" en solid terre, "Parcourir l'annuaire" en ghost. Un seul CTA dominant.
4. **Mock-up 3 screenshots produit** sur /facturation-electronique (dashboard factures reçues, génération devis, conformité) — sinon la page reste du cold copywriting.
5. **Ajouter un système étoiles moyennes + nombre d'avis** sur chaque card annuaire (même à 0 pour l'instant, avec "Aucun avis — soyez le premier"). Résout partiellement le #1.

---

## 4. Benchmark vs référents

| Référent | Ce qu'ils font que Bativio ne fait pas |
|----------|----------------------------------------|
| **Linear** | Hero minimaliste mono-CTA, densité contrôlée, typo display premium. Bativio = trop d'éléments compétitifs au-dessus de la ligne de flottaison. |
| **Stripe** | Screenshots produit dans toutes les pages feature, graphs animés. Bativio /facturation-electronique = austère, texte pur. |
| **Airbnb** | Cards avec photo 4:3, prix, avis, localisation, favori — toutes les infos de décision en un coup d'oeil. Bativio cards = photo + nom + ancienneté, insuffisant. |
| **Notion** | Pricing avec toggle mensuel/annuel interactif et economy visible en vert. Bativio = mentions "2 mois offerts" mais sans toggle dynamique apparent. |

Écart principal : **Bativio n'a pas encore défini son langage visuel "signature"**. La typo Fraunces est prometteuse mais sous-exploitée dans les sections basses.

---

## 5. Parcours critique : particulier cherche un plombier à Chambéry

| Étape | Note | Verdict |
|-------|------|---------|
| 1. Arrivée landing | 7/10 | Message clair, mais dual-CTA confus |
| 2. Clic "Chercher un artisan" | 6/10 | Sélection ville tardive dans le flow |
| 3. Arrivée /chambery | 4/10 | 5 artisans seulement, pas d'avis, pas de filtres (prix, distance, dispo) |
| 4. Filtre "Plombier" | 5/10 | Barre horizontale non-sticky, scroll forcé |
| 5. Choix artisan | 3/10 | **Aucun signal de différenciation** : pas d'avis, pas de tarif indicatif, pas de spécialité |
| 6. Clic card | 6/10 | Navigation vers vitrine, correct |
| 7. Demande de devis | N/A | Non évaluée (hors scope) |

**Moyenne parcours : 5.2/10** — l'utilisateur quitte avant l'étape 7.

---

## 6. Hiérarchie, typo, CTA clarity

- **Hiérarchie** : correcte sur landing, cassée sur /chambery (cards uniformes, rien ne ressort). Sur /tarifs le plan Pro est bien mis en avant.
- **Typographie** : Fraunces serif + Karla sans-serif = mix élégant mais **inconsistant** entre sections. Contraste des headings irrégulier (remonté par l'analyse).
- **CTA clarity** : verbes action corrects ("Choisir Pro", "Activer"), mais **redondance** entre les 4 CTA du pricing. Trop de "Choisir [Plan]" ne dit rien de l'engagement.

---

## 7. Mobile UX

Points positifs : nav bottom bar mobile, PWA configurée, `prefetch={false}` = perf correcte.

Points négatifs :
- **Barre métiers /chambery non sticky** : sur iPhone, une fois en bas de liste, impossible de filtrer sans re-scroll complet.
- **Hero avec double CTA** stacke mal sur 375px — aucun bouton dominant visuellement.
- **Absence de favoris/sauvegarde** : un artisan pertinent ne peut être "mis de côté" sur mobile, usage B2C typique.
- **Touch targets** : cards OK, mais filtres métiers probablement < 44px en hauteur sur mobile (à vérifier).

---

## Verdict final

Bativio est un **produit techniquement mûr porté par une UX encore immature**. Les fondations sont saines (design tokens, PWA, onboarding SIREN malin) mais le coeur de la proposition de valeur — trouver un artisan de confiance — manque des signaux essentiels (avis, CTA directs, filtres, différenciation). Priorité absolue : **refondre /chambery et les cards artisan**, c'est là que se gagne ou se perd la conversion B2C. La partie B2B (tarifs, facturation) est correcte mais benchmark Stripe/Linear non atteint.

*Audit indépendant — aucune relation commerciale avec Bativio.*
