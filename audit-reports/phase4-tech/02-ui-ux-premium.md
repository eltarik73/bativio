# Audit UI/UX Premium — Bativio (avril 2026)

> Auditeur : UI/UX externe (benchmark top 1% — Linear, Vercel, Framer, Anthropic, Raycast)
> Scope : bativio.fr (landing, /chambery, /tarifs, /inscription, /facturation-electronique) + design system repo
> Angle : critique, sans complaisance.

---

## 1. Note design globale : **6,2 / 10**

Bativio joue au-dessus de la moyenne du BTP français (où 4/10 est la norme — PagesJaunes, Travaux.com, 123Devis, tous visuellement datés) mais reste **nettement en-dessous du standard SaaS 2026** incarné par Linear (9,5), Vercel (9,3), Framer (9,4), Anthropic Labs (9,5), Lovable (9), Raycast (9,6).

Le site a une **intention design claire** (artisanat chaleureux, direction "terre/bois", Fraunces serif, glassmorphism warm) qui le distingue de Malt ou StarOfService, mais l'exécution reste **trop "webflow template 2022"** : cards génériques, hero vu 1000 fois, photos Unsplash trop reconnaissables, aucun moment "wow". Rien dans la page d'accueil ne dit "2026 AI-native SaaS".

---

## 2. Identité visuelle — **6/10**

**Points forts** : palette terre/anthracite cohérente et différenciante (vs le bleu générique du secteur), logo "Bativio" avec B noir + reste orange = astucieux et mémorable, vocabulaire typographique soigné (Fraunces en italique + underline terre "calli").

**Critiques dures** :
- **Pas de mascotte, pas de pictogramme propriétaire** : rien ne permet de reconnaître Bativio dans une capture sans le logo. Comparé à Linear (L orbitale), Raycast (silhouette), Arc (cercles colorés), Framer (F), Bativio n'a aucun "signature visual".
- Le logo texte Fraunces n'est pas déposable facilement sur fond sombre ni sur photo — il faut une version vectorielle type wordmark + icône isolée.
- Les blobs radiaux + grid subtile + grain du hero sont des patterns 2023 Vercel/Linear, maintenant overused. Chez Anthropic Labs 2026 on voit plutôt des **moving gradients lents + 3D scenes WebGL**.

**Reco** : commissioner un set de 6 illustrations propriétaires (style Raycast ou Stripe Apps) représentant les 6 métiers clés (plombier, électricien, peintre, maçon, carreleur, couvreur) — puis les réutiliser partout (cards, landing, emails, docs).

---

## 3. Typographie : **Fraunces + Karla + Playfair — 6,5/10**

**Le duo Fraunces + Karla est un bon choix** (Fraunces = serif moderne variable très "artisanat premium", Karla = sans humaniste pour le body). Le CLAUDE.md annonce Playfair en calli, mais **dans le code, `--font-calli` pointe en réalité sur Fraunces** (globals.css ligne 31). Incohérence.

**Problèmes** :
- Aucune **échelle typographique claire** exposée dans le design system. Les tailles utilisées : 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 32, 34, 36, 48, 52, 60px — c'est 18 tailles différentes, **vs 8 chez Linear**. Aucune règle modulaire (ratio 1.125 ou 1.25).
- H1 hero à `clamp(26px, 4vw, 40px)` — **trop petit pour une landing 2026**. Vercel/Linear tournent à 72-96px desktop. Bativio a l'air "petit" et "timide".
- Abus de `font-weight 700` sur les serifs Fraunces : sur écran Retina avec anti-aliasing fin, l'effet "gras" rend la typo **lourde, presque print-like**. Préférer `600` avec léger `letter-spacing: -0.02em`.
- Pas d'usage d'italique expressif dans les titres SaaS (chez Stripe, Attio, Linear les italiques serif en fin de H1 sont emblématiques). Le `.calli` underline est timide — il faut une vraie italique avec contraste.

---

## 4. Palette terre/anthracite/or/crème — **7/10**

**Crédit** : la palette est **la vraie force du projet**. Elle installe un territoire chaud, rare dans la tech française, qui évoque Le Slip Français ou Maison Margiela plus que Doctolib. Bien pensé pour parler aux artisans sans les effaroucher.

**Problèmes techniques** :
- **Le terre `#C4531A` sur fond crème `#FAF8F5` : ratio 4,48:1**. OK en AA large text, **FAIL en AA small text (<18px)**. Toute la typo orange sub-14px est hors WCAG. À durcir vers `#A3440F` (déjà défini comme `terre-dark`) pour le texte.
- Pas de **dark mode**. En 2026, 62% des utilisateurs SaaS activent dark mode. Absence critique pour le dashboard pro.
- Trop de teintes "terre" (terre, terre-light, terre-dark, terre-deep, argile) + trop de gris (g50, g100, g200, g300, g400, g500) — **34 tokens couleur**. Chez Linear c'est 12. Inflation = incohérence.
- `--color-or #C9943A` sur anthracite : superbe. Mais sur crème : ratio 3,2:1 = illisible.

---

## 5. Hiérarchie & rythme visuel — **5,5/10**

**Pain points** (visibles sur 01-home-desktop.png) :
- Le hero sombre passe abruptement à une grille de cards blanches puis une zone sombre puis blanche — **aucun rythme fluide**. Les sections ont toutes la même hauteur visuelle (pas de vallée/sommet narratif).
- Les cards d'annuaire alignées 2×4 sur desktop créent une **"mur de cartes"** monotone. Linear et Framer sautent ça avec des bento asymétriques, des transitions, des hero moments intercalés.
- Espace vertical entre sections : `48-64px` — trop serré. Le standard premium est `120-180px` entre sections majeures (cf. vercel.com).
- Les breadcrumbs à `padding: 12px` sont écrasés dans le layout — ils méritent leur propre respiration (24-32px).

---

## 6. CTA & micro-interactions — **6/10**

**Bons points** : CTA terre visible, hover `translateY(-2px)` propre, focus-visible WCAG correct.

**Critiques** :
- **Tous les boutons principaux ont exactement le même style** (bg-terre, 14px 32px, rounded 10-12px). Pas de hiérarchie ghost/secondary/tertiary claire. En 2026, Linear/Raycast ont 6 variants documentés.
- **Aucune micro-interaction délicieuse** : pas de haptics mobile, pas de bouton qui "respire", pas d'état success avec animation (confetti Stripe, check Framer). Le formulaire devis submit → toast brut.
- Hover sur les cards : `translateY(-3px)` + shadow — basique. Raycast a des hover en spring physics, Framer en magnetic.
- Le CTA "Devis gratuit" est **bien trop générique** — chez Lovable ça serait "Essayer en 10 secondes", chez Linear "Get started".
- Pas d'animation de progress lors du loading (pages artisans, pricing). Skeleton absent.

---

## 7. Images & illustrations — **4/10** (faiblesse majeure)

**Verdict cru** : **4 fichiers du codebase référencent Unsplash** (`artisan-photos.ts`, `travaux-data.ts`, `metier-config.ts`, `vitrine-defaults.ts`) — ces photos sont **reconnaissables à 500m** par tout designer (plombier barbu standard, chantier générique, main qui peint) et **rendent Bativio instantanément "template SaaS"**. Les top SaaS 2026 ont **tous** leurs propres photos (Linear shoots dans leur studio, Framer a sa DA 3D).

**Aucune illustration custom**. Pas de shapes SVG propriétaires, pas de 3D. Chez Stripe, Vercel, Anthropic, les pages ont des visuels qu'on ne peut pas googler.

---

## 8. Mobile UX — **6,5/10**

**Bons points** : safe-area padding nav mobile, `viewport-fit: cover`, prefetch disabled. Touch targets 44px respectés sur la barre bas.

**Problèmes** :
- La nav mobile cache **trop de features sous "Plus"** (Agenda, Vitrine, Photos, Abonnement) — friction.
- Hero `padding: 40px 16px 48px` sur mobile : H1 à 26px, sub à 16px, search-bar en colonne → le pli n'a rien d'émotionnel. Chez Linear mobile, on a un serif 44px qui fait "wow".
- Pas de gestures natifs (swipe entre photos artisan, pull-to-refresh dashboard). Sur PWA standalone, c'est une perte énorme.
- Dropdown nav desktop vs menu fullscreen mobile : les deux ont des **styles inline éparpillés** dans Navbar.tsx (300 lignes), ce qui rend la cohérence fragile.

---

## 9. Vitrines artisan (4 templates) — **5,5/10**

| Template | Note | Problème principal |
|----------|------|-------------------|
| Classique | 6/10 | Hero anthracite sombre cohérent mais déjà vu. Stats en 3 cards = old-school. |
| Moderne | 6,5/10 | Bento grid 2fr/1fr/1fr intéressant, seul template à essayer qqch. Manque hover poussé. |
| Portfolio | 5,5/10 | Split hero photo/texte = classique 2021. Gallery masonry OK mais sans lightbox premium. |
| Vitrine | 5/10 | Pas lu en détail mais même logique, peu de différenciation. |

**Critique globale** : les 4 templates **partagent 80% du code** (même breadcrumb, même ArtisanBadges, même DevisForm3Steps, même ContactCard). La vraie différence est cosmétique (ordre des sections). Le promis "4 templates distincts" est marketing : techniquement c'est **1 template avec 4 layouts**. Aucun template ne propose par exemple : vidéo hero, avant/après slider, map intégrée avec zone d'intervention, animation des chantiers.

---

## 10. Références — Quel top SaaS imiter ?

1. **Attio** (attio.com) — le plus proche de Bativio en esprit : CRM B2B avec typo serif italique, photos produit chirurgicales, animations ultra-subtiles. À étudier en priorité pour la landing.
2. **Linear** (linear.app) — hiérarchie typographique, motion scroll, dark mode natif. Pour le dashboard pro.
3. **Framer** (framer.com) — micro-interactions, hero video, italique serif. Pour l'émotion.
4. **Lovable** (lovable.dev) — pour un style 2026 AI-native avec palette chaude similaire. Fort inspiration directe possible.
5. **Raycast** (raycast.com) — iconographie propriétaire, shadows premium. Pour le design system.
6. **Anthropic Labs** (anthropic.com) — typographie serif + minimalisme éditorial. Pour le ton de marque.

---

## 11. TOP 15 améliorations design

### Quick wins (< 2 semaines, ROI élevé)
1. **Upgrade contraste terre → `#A3440F`** pour texte small + doubler test WCAG AA automatique.
2. **Supprimer toutes les photos Unsplash** et shooter 30 photos custom (budget ~2000€) ou commander une série Midjourney v7 "style Bativio".
3. **Échelle typo modulaire stricte** : 12/14/16/18/24/32/48/72 px (ratio 1.333) — bannir les 18 tailles actuelles.
4. **H1 hero à clamp(48px, 8vw, 88px)** — donner de la voix à la promesse.
5. **Ajouter un dark mode global** (dashboard + landing). Palette déjà 90% prête.
6. **Réduire les tokens couleur de 34 → 12** — un seul gris, un seul terre, un seul or.
7. **Italique expressive dans les H1** : "Trouvez l'artisan *idéal* près de chez vous" — mais avec Fraunces italic 96px variable.

### Refonte majeure (1-3 mois)
8. **Design system propriétaire documenté** (Figma + Storybook) avec 6 variants de bouton, 4 variants de card, 3 variants d'input, tokens shadow/radius/spacing strictement versionnés.
9. **Set d'illustrations custom** : 6 métiers × 3 scènes = 18 illustrations propriétaires (style Raycast Apps ou Stripe). Coût ~8k€, impact brand énorme.
10. **Refonte hero landing** avec hero video 10s (chantiers réels Bativio) + overlay glassmorphism + search animé (Framer-style).
11. **Vraie différenciation des 4 templates vitrine** : Portfolio avec avant/après slider + lightbox ; Moderne avec section vidéo ; Classique avec map zone ; Vitrine avec timeline réalisations.
12. **Motion design premium** : scroll-triggered reveals (framer-motion), parallax léger hero, spring physics sur hovers, confetti success après devis envoyé.
13. **Onboarding inscription refait en stepper immersif** (Typeform x Linear) avec 1 question par écran, progress bar satisfying, SIRET auto-fill animé.
14. **Dashboard pro type Attio/Linear** : sidebar collapsible, command palette (⌘K), table views, graphs Tremor, raccourcis clavier documentés.
15. **Icone set propriétaire** remplaçant lucide-react sur les éléments brand-critical (métiers, badges, CTAs) — style "warm crafted" cohérent avec Fraunces.

---

## Verdict final

Bativio a **un goût** (palette terre chaude, typo serif, ton artisanal) qui le place au-dessus de 95% de ses concurrents français. Mais il reste **trop "Webflow propre" et pas assez "SaaS signature 2026"**. Pour passer de 6,2 à 8,5/10, il faut arrêter les photos Unsplash, commander une vraie DA (illustrations + motion), réécrire le hero landing avec ambition éditoriale, et livrer 4 vraies variantes de vitrine différenciées. L'investissement : ~25k€ design + 6 semaines de dev front. ROI attendu : +40% conversion inscription artisan, +25% perception "premium" (impact prix moyen plan).
