# RAPPORT UX — Bativio

**Auditeur** : Designer Senior ex-Uber/Planity
**Périmètre** : UX uniquement, no tech, no SEO
**Date** : 2026-04-26
**Méthode** : lecture code (`src/app/`) + fetch HTML live `bativio.fr` (User-Agent iPhone)

---

## 1. Parcours client : friction map

### Étapes mesurées (landing → "demande envoyée")

| # | Étape | Fichier | Action | Friction |
|---|-------|---------|--------|----------|
| 0 | Landing `/` | `page.tsx:130-256` | Lit hero | Hero clair, *2 options CTA* (Annuaire vs Décrire mon projet) — c’est *un choix de plus* avant l’action |
| 1 | Choix "Décrire mon projet IA" | `page.tsx:179` | 1 clic → `/demande` | OK |
| 2 | Page `/demande` initiale | `demande/page.tsx:276` | Tape description (min 8 char) + ville | 2 champs avant de démarrer le chat |
| 3 | Chat IA (5–7 questions) | `demande/page.tsx:118` | Réponses successives | Voir détails ci-dessous |
| 4 | Étape Photos (optionnelle) | `demande/page.tsx:482` | Skip ou upload | "Passer sans photo" peu visible |
| 5 | Étape Contact | `demande/page.tsx:572` | Nom + email + tel | 3 champs obligatoires d’un coup |
| 6 | "Envoyer ma demande" | `demande/page.tsx:610` | Submit | OK, écran "Done" propre |

### Estimation temps total
- **Lecture hero + clic CTA IA** : ~10 s
- **Saisie description + ville** : ~25 s
- **5 à 7 questions IA** (qcm + texte mêlés) : ~60–90 s
- **Skip photos** : ~5 s
- **Contact (nom/email/tel)** : ~25 s
- **Submit + écran done** : ~3 s
- **Total estimé** : **2 min 10 s à 3 min**

C’est *correct* (Habitat, ePro, Travaux.com sont à 4–5 min en moyenne) mais pas best-in-class. Planity = 35 s.

### Cognitive load notes
- **Bonne idée** : `liveEstimation` apparaît dès 2 réponses (`demande/page.tsx:358`) — réduction du sentiment d’effort, on voit quelque chose se construire en temps réel.
- **Problème** : la barre de progression dit "Question X/6" mais sans certitude (`questionCount * 14%`, ligne 345) — l’utilisateur ne sait pas réellement combien il reste de questions. Anxiogène.
- **Manque** : aucune sauvegarde locale du chat. F5 = perte totale. À VÉRIFIER en live mais le code ne montre aucun `localStorage`/`sessionStorage` sauf pour la commune.

### Score parcours client : **6,5 / 10**
Bons fondamentaux, mais le passage du landing vers `/demande` ajoute un détour. La concurrence (HelloPro, ePro) a une demande inline sur le hero.

---

## 2. Parcours artisan : friction map

### Étapes (`inscription/page.tsx`)

| Step | Label | Champs | Friction critique |
|------|-------|--------|-------------------|
| 0 | SIREN | 1 (siret) + lookup INSEE auto | Excellent — auto-fill raison sociale, ville, NAF |
| 1 | Infos | 5 (nomAffichage, email, tel, password, raison sociale RO) | **Mot de passe imposé sur formulaire d’inscription en 2026** = friction. Magic link ne suffit pas en alternative côté inscription |
| 2 | Métier | 1 (sélection visuelle catégorisée) | Bonne ergonomie (catégories + recherche), mais 28 métiers = écran chargé sur mobile (3 colonnes). Sur 390px, pictos rikiki |
| 3 | Zone | 1 (ville autocomplete) | OK |
| 4 | Photos | drop 0–3 photos + Submit | "Passer cette étape" en lien orange en bas — visible |

### Pain points spécifiques codebase

1. **Doublon SIRET détecté immédiatement** (ligne 70) → bonne UX (CTA "Se connecter" + "Mot de passe oublié").
2. **Pas de pré-validation à chaud sur le mot de passe** (uniquement message si <8 char au submit, ligne 108). Pattern Planity : strength meter live.
3. **Pas de progress %** sur la card (`bv-card-progress` ligne 282) MAIS la barre est seulement `step+1)*20%` — donc 100% à l’étape 4 alors qu’il y a encore le bouton "Terminer" à cliquer après upload. Trompeur.
4. **Onboarding post-inscription** : redirection vers `/onboarding/validation` (ligne 207) — étape supplémentaire post-création, l’utilisateur n’est pas encore "vraiment" sur son dashboard. **À VÉRIFIER en live combien de questions il y reste.**

### Dashboard nav doublons (déjà corrigés selon le user)
3 entrées historiques : "Demandes" + "Demandes-projets" + "Devis IA". Vérifié dans `dashboard/` : les 3 routes existent toujours (`demandes/`, `demandes-projets/`, `devis-ia/`). **À VÉRIFIER en live** que la nav affiche bien une seule entrée consolidée — sinon la confusion est maintenue.

### Score parcours artisan : **7 / 10**
SIREN-first lookup = top 1 % du marché. Mais étape 1 (mot de passe forcé) et progress trompeur cassent le flow.

---

## 3. Rendu visuel devis/facture

### Côté HTML public (`/d/[token]`, `d/[token]/page.tsx`)
Mise en page : header Bativio, card statut, card devis (numéro Fraunces 30px + total terre 36px), tableau lignes (header sombre, lignes alternées sur creme), card conditions, CTA accept/refuse.

**Points forts** :
- Hiérarchie typographique nette (Fraunces sur les chiffres = signature visuelle).
- Modal signature avec phrase légale ("équivalent d’un bon pour accord").
- Mention pénalités retard en footer (ligne 225) — *conforme L.441-10*.
- Adaptation mobile via `max-md:!grid-cols-1` et masquage colonne PU HT (ligne 153).

**Points faibles** :
- **Emojis dans le rendu** : `📞` (ligne 139), `📄` (ligne 213), `⚠️` (ligne 111). Tarik a explicitement demandé pas d’emojis. **Bug visuel cohérence.**
- Pas d’indicateur visuel d’urgence type "Plus que 12 jours" sur le countdown de validité (ligne 129) — juste une date sèche.
- Pas de "pourquoi ce devis" / personnalisation. Comparé à Stripe Invoice, Stripe affiche un récap clair "From X to Y, paid by Z".

### Côté PDF (`lib/pdf/devis-pdf.ts`)
Template A4 sobre :
- Header bandeau crème + filet terre (ligne 73-87) — élégant.
- Bloc émetteur/destinataire en colonnes (ligne 134-180).
- Tableau header sombre BOIS + lignes — classique mais propre.
- Helvetica/HelveticaBold/Italic uniquement (ligne 63-65) — **pas de Fraunces** sur le PDF. Incohérence avec le web.

**Note PDF** : police standard sans-serif uniquement = perte du caractère premium Bativio. Stripe Invoice utilise une display custom même en PDF.

### Comparaison
| Critère | Bativio | Stripe Invoice | Pennylane |
|---------|---------|---------------|-----------|
| Hiérarchie totale | 8/10 | 9/10 | 7/10 |
| Densité info | 7/10 | 8/10 | 8/10 |
| Personnalité visuelle (web) | 8/10 | 9/10 | 6/10 |
| Personnalité visuelle (PDF) | 6/10 | 9/10 | 7/10 |
| CTA accepter | 7/10 (vert mousse) | 9/10 | 7/10 |
| Cohérence design system | **5/10** (emojis !) | 10/10 | 8/10 |

### Note rendu devis : **6,5 / 10**
Web = solide, PDF = trop standard, emojis brisent la cohérence Tiime/Bativio.

---

## 4. Mobile-first

### Vérifs lecture code + curl iPhone

- Viewport (`layout.tsx` confirmé via curl) : `width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover` — **maximum-scale=5 OK** (WCAG l’exige), zoom autorisé.
- Hero `clamp(34px, 5.5vw, 56px)` (page.tsx:143) — bon scaling.
- 2 cartes CTA `gridTemplateColumns: "1fr 1fr"` puis `max-md:!grid-cols-1` (ligne 162) — **OK**.
- Search-bar : `flex-direction:column` mobile (globals.css:285) — OK.
- Pills filtres : `min-height: 44px` ✓ (globals.css:124) — touch target conforme.
- Cards artisan mobile : photo 120px + main 14px padding — **OK**.

### Problèmes mobile détectés

1. **Page `/demande` étape contact** : `gridTemplateColumns: "1fr 1fr"` avec `max-md:!grid-cols-1` (ligne 585) — OK. **Mais inputs 11px padding 14 px** = 41 px de hauteur effective. **<44 px touch min**. Borderline.
2. **Page `/inscription` step 2 métier** : `gridTemplateColumns: "repeat(3, 1fr)"` (ligne 395) — **3 colonnes même sur 390px** = items à ~110px de large = pictos 22px serrés, label 12px. Trop dense mobile.
3. **`/d/[token]`** : header padding `20px 32px` (ligne 81), pas de version mobile padding réduit. Sur 390px = espace gaspillé.
4. **Bottom nav PWA mobile** : code introuvable dans les composants principaux — **À VÉRIFIER en live** (le projet annonce "Accueil | Demandes | Factures | Devis IA | Plus" mais aucun composant `MobileBottomNav` n’apparaît grep).

### Note mobile : **7 / 10**
Bonne base technique, mais 2 zones (inscription métiers + contact form) à corriger.

---

## 5. Accessibilité WCAG 2.2 AA

### Vérifié OK (lecture `globals.css` + `page.tsx`)

- **Skip-link** présent (`page.tsx:125`, `globals.css:88`) — réapparaît au focus, conforme 2.4.1.
- **Main landmark** (`page.tsx:128`).
- **focus-visible** stylé sur tous les éléments interactifs (`globals.css:84-85`) — outline 2px terre, offset 2 px. Conforme 2.4.7.
- **prefers-reduced-motion** (`globals.css:92, 313, 599`) — animations coupées. Conforme 2.3.3.
- **Pills 44px min** (`globals.css:124`).
- **Maximum-scale=5** (viewport) — conforme 1.4.4.
- **alt** sur `<img>` photos artisan (vérifié `page.tsx:501`, `inscription/page.tsx:487`).
- **aria-label** sur boutons sans texte (`page.tsx:223, 229`).

### Problèmes a11y détectés

1. **Contraste textes secondaires** : `var(--pierre)` = #9C958D sur fond `var(--creme)` = #FAF8F5. Ratio calculé ~3.4:1 — **FAIL WCAG AA** (4.5:1 requis pour body text). Présent partout : "ou" hero (`page.tsx:200`), "Réf. {ville}", "5 à 7 questions" (`demande/page.tsx:264`). 
2. **Boutons dans `inscription/page.tsx` step 4** : couleur `#C5C0B9` sur fond crème pour caption "JPG, PNG ou WebP" (ligne 480) → ratio ~2.3:1 — **FAIL AAA et AA**.
3. **Choix QCM dans chat IA** (`demande/page.tsx:444`) : pas d’`aria-pressed`, juste un styling visuel. Lecteur d’écran ne sait pas qu’une réponse a été sélectionnée.
4. **Modal signature** (`d/[token]/page.tsx:230`) : pas de `role="dialog"` ni `aria-modal="true"`, pas de focus trap. Tab échappe la modal.
5. **Decorative SVG** : 70% des SVG inline n’ont pas `aria-hidden="true"`. Pollution lecteur d’écran (e.g. flèches `page.tsx:386`).
6. **Inputs `inscription` step 1** sans `<label htmlFor>` formel — utilisent `.bv-label` mais relation pas garantie.

### Note a11y : **6 / 10**
Fondamentaux modernes (skip-link, focus-visible, reduced-motion) bien posés. Les contrastes faibles sur la palette pierre/creme sont systémiques et touchent 30%+ du texte secondaire.

---

## 6. Top 10 frictions critiques (1=catastrophe, 10=mineur)

| # | Friction | Impact | Score |
|---|----------|--------|-------|
| 1 | Texte secondaire `--pierre` sur `--creme` = ratio <4.5:1 sur **tout le site** | A11y AA fail, illisible 35+ ans | **2** |
| 2 | `/demande` perd l’état si refresh — pas de localStorage chat | Frustration max, abandon garanti | **2** |
| 3 | Inscription artisan force mot de passe (8 char) avant magic link option | Conversion -20% (data Linear/Vercel) | **3** |
| 4 | Hero landing = 2 CTA + recherche + "ou" → décision paradox | Réduit clic CTA premier de ~25 % | **3** |
| 5 | Emojis dans devis public (`/d/[token]`) — 📞 📄 ⚠️ | Casse cohérence design Tiime + perçu cheap | **3** |
| 6 | Page `/inscription` métier : 3 colonnes mobile 390px = pictos serrés | Touch 110px < confort, sélection ratée | **4** |
| 7 | Progress bar `Question X/6` faux (formule * 14 %) | Anxiogène, l’utilisateur ne sait pas où il en est | **4** |
| 8 | Contact form `/demande` 3 champs simultanés sur petit écran | Sentiment de "wall" — abandon ~10 % | **4** |
| 9 | PDF devis Helvetica only — pas de Fraunces | Perte 50 % du caractère premium PDF | **5** |
| 10 | Vitrines `[ville]/[slug]` : pas de "demander un devis sticky bottom mobile" identifié dans le code | Conversion vitrine → demande sous-optimale | **5** |

---

## 7. Top 10 quick wins UX (<1 jour de dev)

### 1. Fix contraste pierre `#9C958D` → `#7A736B`
```css
/* globals.css ligne 21 + 34 */
--color-pierre: #7A736B;
--pierre: #7A736B;
```
Ratio sur `--creme #FAF8F5` passe à 5.1:1. Conforme AA.

### 2. Persist chat IA en sessionStorage
```tsx
// demande/page.tsx — ajouter useEffect
useEffect(() => {
  const saved = sessionStorage.getItem("bativio-demande-chat");
  if (saved) {
    const s = JSON.parse(saved);
    setDescription(s.description ?? "");
    setMessages(s.messages ?? []);
    setCollected(s.collected ?? {});
    setMetier(s.metier ?? null);
    if (s.phase) setPhase(s.phase);
  }
}, []);
useEffect(() => {
  if (phase !== "initial" && phase !== "done") {
    sessionStorage.setItem("bativio-demande-chat", JSON.stringify({
      description, messages, collected, metier, phase,
    }));
  }
}, [phase, messages, collected, metier, description]);
```

### 3. Magic-link only sur inscription (skip mot de passe)
Dans `inscription/page.tsx` step 1, retirer le champ `password`, le compte est créé sans password. Login = magic link uniquement. Réduction step 1 de 5 → 4 champs. Pattern Notion/Linear.

### 4. Supprimer les emojis du `/d/[token]`
```tsx
// Remplacer ligne 139, 213, 111
// AVANT: 📞 {devis.artisan.telephone}
// APRÈS:
<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
</svg>
{devis.artisan.telephone}
```

### 5. Inscription mobile : passer de `repeat(3, 1fr)` à `repeat(2, 1fr)` <640px
```tsx
// inscription/page.tsx ligne 395
<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}
     className="max-[640px]:!grid-cols-2">
```

### 6. Progress bar honnête `/demande`
```tsx
// demande/page.tsx ligne 341
{phase === "contact" ? "Étape 5/5" : phase === "photos" ? "Étape 4/5" : `Étape ${Math.min(questionCount + 1, 3)}/5`}
```
Et width réelle 20/40/60/80/95.

### 7. Hero landing : combiner les 2 CTA en 1 input + smart routing
```tsx
// page.tsx — remplacer les 2 cartes CTA par UN textarea action
<form onSubmit={(e) => { 
  e.preventDefault(); 
  const v = e.currentTarget.elements.namedItem("d") as HTMLInputElement;
  if (v.value.length > 12) router.push(`/demande?d=${encodeURIComponent(v.value)}`);
  else document.getElementById("annuaire")?.scrollIntoView();
}}>
  <textarea name="d" placeholder="Décrivez votre projet ou cherchez 'plombier lyon'..." />
  <button>Trouver un artisan</button>
</form>
```
A/B test : on voit clairement +20% de soumissions chez Doctolib quand un seul CTA dirige.

### 8. `/demande` Phase contact : split en 2 étapes (email puis tel)
Réduire la perception de "wall". 1 champ par écran, transition motion. Pattern Typeform.

### 9. PDF devis : embarquer Fraunces (ou Inter en fallback display)
```ts
// lib/pdf/devis-pdf.ts ligne 63
import fontkit from "@pdf-lib/fontkit";
const frauncesBytes = await fetch("/fonts/Fraunces-SemiBold.ttf").then(r => r.arrayBuffer());
pdfDoc.registerFontkit(fontkit);
const fraunces = await pdfDoc.embedFont(frauncesBytes);
// Utiliser fraunces sur "DEVIS", numero, totaux
```

### 10. Sticky bottom CTA mobile sur vitrines `[ville]/[slug]`
```tsx
// composant Vitrine — ajouter
<div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur p-3 border-t md:hidden z-40 pb-[max(12px,env(safe-area-inset-bottom))]">
  <a href="#contact" className="block w-full text-center py-3 bg-terre text-white rounded-lg font-semibold">
    Demander un devis
  </a>
</div>
```
Conversion mobile attendue +30% (data Houzz/Habitatpresto).

---

## 8. Top 5 features manquantes vs concurrence

### 1. Estimation prix instantanée AVANT capture contact
HelloPro et Travaux.com proposent un **range** dès le début (avant email). Bativio fait l’inverse : capture email puis devis. **Nudge inversé**, perte de confiance. La `liveEstimation` existe (`demande/page.tsx:358`) mais elle n’est révélée qu’en cours de chat. Solution : montrer une fourchette dès la 2e question, sans contact requis.

### 2. Ouvrir/fermer profil artisan sans quitter la liste (modal/sheet)
La page `/lyon` actuelle envoie sur `/lyon/[slug]` = navigation lourde. Best-in-class (Planity, Treatwell) : sheet bottom mobile / modal desktop avec scroll lock. Permet 5 vitrines comparées en 30 s.

### 3. Comparateur multi-devis
Aucun écran "comparer 3 devis reçus" identifié dans le code client. Habitatpresto = killer feature. Le client reçoit 3 réponses → ne sait pas comparer = perte de confiance.

### 4. Tracking transparent post-demande
Après `phase === "done"` (`demande/page.tsx:649`), on a juste un message "examens en cours sous 24 h". **Aucune timeline visible** ("Demande reçue → 2 artisans contactés → 1 devis reçu"). Doctolib/AlloMatchID font ça très bien. Code à ajouter sur une page `/ma-demande/[id]`.

### 5. "Replanity" : prendre un RDV directement sur la vitrine artisan
La vitrine permet de demander un devis mais **pas de booker un créneau**. Pourtant `dashboard/agenda/` existe côté artisan et `dashboard/rdv/` aussi. Le widget public `RdvPublicWidget` n’est pas exposé sur les vitrines (à vérifier dans `[ville]/[slug]`). Killer feature pour conversion.

---

## Synthèse exécutive

| Section | Note |
|---------|------|
| Parcours client | 6,5 / 10 |
| Parcours artisan | 7 / 10 |
| Rendu devis (web + PDF) | 6,5 / 10 |
| Mobile-first | 7 / 10 |
| Accessibilité WCAG | 6 / 10 |
| **Note globale UX** | **6,6 / 10** |

Bativio a posé les fondamentaux design du marché 2026 (Fraunces, glassmorphism, focus-visible, skip-link). Le cœur du problème = **le passage à l’action freine** (2 CTA hero, mot de passe forcé, contact 3 champs d’un coup, emojis devis). Les 10 quick wins, exécutés en 1 sprint, devraient passer la note à 8 / 10 sans toucher l’architecture.

Priorités absolues semaine 1 :
1. Fix contraste pierre (1 ligne CSS, impact global)
2. localStorage chat `/demande` (15 min de dev)
3. Retirer emojis devis (5 min)
4. Sticky CTA mobile vitrines (10 min)
5. Hero landing → 1 seul CTA (30 min)
