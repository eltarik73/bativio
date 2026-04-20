# Plan Devis IA Bativio — V1 pragmatique

**Objectif** : Le client décrit son projet → IA qualifie + génère un pré-devis chiffré → le webmaster route aux artisans pertinents → les artisans reçoivent la demande enrichie + peuvent confirmer/ajuster le devis → envoi PDF conforme au client.

**Contraintes** : V1 sans budget Batiprix. On s'appuie sur grille tarifaire artisan (priorité absolue) + moyennes marché Rhône-Alpes + INSEE BT + OpenBTP/Hemea (scrapés mensuellement).

---

## 1. Architecture bout-en-bout

```
┌──────────────┐    ┌─────────────────┐    ┌──────────────┐    ┌──────────────┐
│  CLIENT      │    │  BATIVIO        │    │  WEBMASTER   │    │  ARTISANS    │
│              │    │                 │    │              │    │              │
│ 1. Chat IA   │───▶│ 2. Demande      │───▶│ 3. Route     │───▶│ 4. Reçoit    │
│    qualif    │    │    qualifiée    │    │    (manuel   │    │    demande   │
│              │    │    + pré-devis  │    │    ou auto)  │    │    enrichie  │
│              │    │    fourchette   │    │              │    │              │
│              │    │                 │    │              │    │ 5. Génère    │
│              │    │                 │    │              │    │    devis     │
│              │    │                 │    │              │    │    perso via │
│              │    │                 │    │              │    │    Claude +  │
│              │    │                 │    │              │    │    sa grille │
│              │    │                 │    │              │    │              │
│ 7. Reçoit    │◀───│ 6. PDF          │◀───│              │◀───│ 6. Envoi PDF │
│    devis PDF │    │    conforme     │    │              │    │    au client │
└──────────────┘    └─────────────────┘    └──────────────┘    └──────────────┘
```

**4 agents Claude** :
- **Agent 1 (Qualif)** : conversation client, détecte métier, collecte quantités
- **Agent 2 (Pré-devis)** : fourchette basée sur moyennes marché (affiché au client dès la qualif)
- **Agent 3 (Routage)** : suggère les artisans les plus pertinents au webmaster
- **Agent 4 (Devis final)** : génère devis ligne par ligne pour un artisan donné, avec sa grille + RAG marché + mentions légales

---

## 2. Schéma Prisma complet (V1)

Ajouter à `frontend/prisma/schema.prisma` :

```prisma
// ═══════════════════════════════════════════════════════════
// GRILLE TARIFAIRE ARTISAN
// ═══════════════════════════════════════════════════════════
model GrilleTarifaire {
  id                 String   @id @default(cuid())
  artisanId          String   @unique @map("artisan_id")
  artisan            Artisan  @relation(fields: [artisanId], references: [id], onDelete: Cascade)

  tarifHoraire       Decimal? @db.Decimal(10, 2) @map("tarif_horaire")      // ex: 55.00
  tarifUrgence       Decimal? @db.Decimal(10, 2) @map("tarif_urgence")      // tarif majoré dépannage
  minimumFacture     Decimal? @db.Decimal(10, 2) @map("minimum_facture")    // minimum forfaitaire
  minimumHeures      Decimal? @db.Decimal(5, 2)  @map("minimum_heures")     // min heures
  fraisDeplacement   Decimal? @db.Decimal(10, 2) @map("frais_deplacement")  // forfait déplacement
  prixKm             Decimal? @db.Decimal(5, 2)  @map("prix_km")
  majorationMat      Decimal? @db.Decimal(5, 2)  @map("majoration_mat")     // % ex: 25.00
  tvaDefault         Decimal? @db.Decimal(4, 2)  @map("tva_default")        // 10.00 / 20.00
  indiceBtRef        String?  @map("indice_bt_ref")                         // ex: "BT01"

  zonesIntervention  Json?    @map("zones_intervention")                    // ["chambery","annecy"] ou rayon km
  notesTarif         String?  @map("notes_tarif") @db.Text                  // texte libre visible Claude

  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  forfaits           Forfait[]

  @@map("grille_tarifaire")
}

// Forfaits prédéfinis par l'artisan (ex: "Pose chauffe-eau 200L = 650€ HT")
model Forfait {
  id           String   @id @default(cuid())
  grilleId     String   @map("grille_id")
  grille       GrilleTarifaire @relation(fields: [grilleId], references: [id], onDelete: Cascade)

  label        String                                    // "Pose chauffe-eau 200L"
  description  String?  @db.Text
  prixHt       Decimal  @db.Decimal(10, 2) @map("prix_ht")
  tva          Decimal  @db.Decimal(4, 2)                // 10.00
  unite        String?                                   // "unité", "m²", "mètre linéaire"
  metierSlug   String?  @map("metier_slug")              // pour filtrer

  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("forfait")
  @@index([metierSlug])
}

// ═══════════════════════════════════════════════════════════
// DEMANDE PROJET (client → Bativio)
// ═══════════════════════════════════════════════════════════
model DemandeProjet {
  id              String   @id @default(cuid())

  // Description client
  description     String   @db.Text
  villeLabel      String?  @map("ville_label")
  villeSlug       String?  @map("ville_slug")
  lat             Float?
  lon             Float?

  // Qualif IA
  metierDetecte   String?  @map("metier_detecte")           // "carreleur", "plombier"...
  qualifJson      Json?    @map("qualif_json")              // réponses aux questions
  qualifScore     Int?     @map("qualif_score")             // 0-100 fiabilité de la qualif
  preDevisJson    Json?    @map("pre_devis_json")           // fourchette estimative

  // Contact client
  contactNom      String?  @map("contact_nom")
  contactEmail    String?  @map("contact_email")
  contactTel      String?  @map("contact_tel")

  // Statut
  statut          DemandeStatut @default(NOUVELLE)
  source          String?                                   // "landing", "demo-a", "api"...

  // Photos
  photos          Json?                                     // URLs Cloudinary

  // Routage
  modeRoutage     ModeRoutage @default(MANUEL) @map("mode_routage")
  routageBy       String?  @map("routage_by")               // userId webmaster
  routageAt       DateTime? @map("routage_at")

  envois          DemandeEnvoi[]
  devisGeneres    DevisGenere[]

  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("demande_projet")
  @@index([statut])
  @@index([metierDetecte])
  @@index([createdAt])
}

enum DemandeStatut {
  NOUVELLE       // créée par client, pas encore vue par webmaster
  EN_ATTENTE     // vue par webmaster, pas encore routée
  ROUTEE         // envoyée à des artisans
  DEVIS_ENVOYE   // au moins 1 devis envoyé au client
  CLOTUREE       // projet signé ou annulé
}

enum ModeRoutage {
  MANUEL             // webmaster sélectionne
  AUTO_TOUS          // tous les artisans du métier + ville
  AUTO_CONCERNES     // match métier + zone intervention
  AUTO_PRO           // artisans plan PRO ou plus
  AUTO_BUSINESS      // artisans plan BUSINESS uniquement
}

// Relation demande ↔ artisans destinataires (many-to-many avec méta)
model DemandeEnvoi {
  id          String   @id @default(cuid())
  demandeId   String   @map("demande_id")
  demande     DemandeProjet @relation(fields: [demandeId], references: [id], onDelete: Cascade)
  artisanId   String   @map("artisan_id")
  artisan     Artisan  @relation(fields: [artisanId], references: [id], onDelete: Cascade)

  sentAt      DateTime @default(now()) @map("sent_at")
  seenAt      DateTime? @map("seen_at")                      // artisan a ouvert l'email/notif
  respondedAt DateTime? @map("responded_at")                 // a généré un devis
  rejectedAt  DateTime? @map("rejected_at")                  // a décliné

  emailId     String?  @map("email_id")                      // ID Resend pour tracking

  @@map("demande_envoi")
  @@unique([demandeId, artisanId])
  @@index([artisanId])
}

// ═══════════════════════════════════════════════════════════
// DEVIS GÉNÉRÉ (par artisan via IA, pour un client)
// ═══════════════════════════════════════════════════════════
model DevisGenere {
  id              String   @id @default(cuid())
  numero          String   @unique                           // "BTV-2026-0042"

  demandeId       String   @map("demande_id")
  demande         DemandeProjet @relation(fields: [demandeId], references: [id], onDelete: Cascade)
  artisanId       String   @map("artisan_id")
  artisan         Artisan  @relation(fields: [artisanId], references: [id], onDelete: Cascade)

  // Généré par Claude
  lignesJson      Json     @map("lignes_json")               // [{label, qte, unite, puHt, totalHt, tva}]
  totalHt         Decimal  @db.Decimal(10, 2) @map("total_ht")
  totalTva        Decimal  @db.Decimal(10, 2) @map("total_tva")
  totalTtc        Decimal  @db.Decimal(10, 2) @map("total_ttc")
  validiteJours   Int      @default(30) @map("validite_jours")

  // Conformité
  mentionsJson    Json?    @map("mentions_json")             // les 16 mentions obligatoires cochées
  siretArtisan    String?  @map("siret_artisan")
  assuranceRef    String?  @map("assurance_ref")

  // Claude meta
  promptVersion   String?  @map("prompt_version")            // "v1.2"
  modelUsed       String?  @map("model_used")                // "claude-opus-4-7"
  tokensIn        Int?     @map("tokens_in")
  tokensOut       Int?     @map("tokens_out")
  costEur         Decimal? @db.Decimal(10, 4) @map("cost_eur")

  // PDF
  pdfUrl          String?  @map("pdf_url")                   // Cloudinary

  // Statut
  statut          DevisStatut @default(BROUILLON)
  envoyeAt        DateTime?   @map("envoye_at")
  acceptedAt      DateTime?   @map("accepted_at")
  rejectedAt      DateTime?   @map("rejected_at")

  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("devis_genere")
  @@index([statut])
  @@index([artisanId])
}

enum DevisStatut {
  BROUILLON       // généré, pas encore validé par artisan
  VALIDE          // artisan a relu/ajusté
  ENVOYE          // envoyé au client
  ACCEPTE         // client a signé
  REFUSE          // client a refusé
  EXPIRE          // 30 jours dépassés
}

// ═══════════════════════════════════════════════════════════
// KNOWLEDGE BASE (documents pour RAG)
// ═══════════════════════════════════════════════════════════
model KbDocument {
  id          String   @id @default(cuid())
  slug        String   @unique                               // "bt01-2026-12"
  type        KbDocType
  title       String
  content     String   @db.Text
  metadata    Json?
  source      String?                                        // URL origine
  periodeRef  String?  @map("periode_ref")                   // "2026-Q1"
  validFrom   DateTime @default(now()) @map("valid_from")
  validTo     DateTime? @map("valid_to")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("kb_document")
  @@index([type])
  @@index([validFrom])
}

enum KbDocType {
  INDICE_BT         // INSEE (BT01, BT02...)
  TARIF_MARCHE      // moyennes compilées (plombier 55€/h Rhône-Alpes)
  MENTION_LEGALE    // les 16 mentions obligatoires
  TVA_TAUX          // 5.5 / 10 / 20 BTP
  DTU_NORME         // résumé DTU
  EXEMPLE_DEVIS     // devis conformes modèles
  PRIX_MATERIAU     // prix matériaux scrapés OpenBTP/Hemea
  GUIDE_QUANTITE    // guide calcul quantités (m² peinture par pièce)
}

// ═══════════════════════════════════════════════════════════
// SETTINGS WEBMASTER (routage auto)
// ═══════════════════════════════════════════════════════════
model RoutageSettings {
  id                String   @id @default(cuid())
  scope             String   @unique                          // "global" ou ville/métier
  modeDefault       ModeRoutage @default(MANUEL) @map("mode_default")
  delaiManuelMin    Int?     @map("delai_manuel_min")         // 120 = après 2h sans action, auto
  emailTemplate     String?  @db.Text @map("email_template")

  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  @@map("routage_settings")
}
```

**Relations à ajouter au modèle `Artisan` existant** :
```prisma
grilleTarifaire  GrilleTarifaire?
demandesRecues   DemandeEnvoi[]
devisGeneres     DevisGenere[]
```

---

## 3. API endpoints (V1)

### Côté public (client)
```
POST /api/v1/public/demandes
  body: { description, ville, photos? }
  → crée DemandeProjet, lance Agent 1 qualif (stream)

POST /api/v1/public/demandes/:id/qualif
  body: { questionId, answer }
  → enregistre réponse, Agent 1 pose question suivante ou clôture

POST /api/v1/public/demandes/:id/contact
  body: { nom, email, tel }
  → finalise la demande (statut NOUVELLE), envoie email conf au client

GET /api/v1/public/demandes/:id/pre-devis
  → fourchette estimative (Agent 2)
```

### Côté webmaster (admin)
```
GET /api/v1/admin/demandes
  query: statut?, metier?, ville?
  → liste

GET /api/v1/admin/demandes/:id
  → détail complet + pré-devis + artisans suggérés

POST /api/v1/admin/demandes/:id/route
  body: { artisanIds: string[] } OU { mode: "AUTO_PRO" }
  → crée DemandeEnvoi pour chaque, envoie emails

POST /api/v1/admin/routage-settings
  body: { modeDefault, delaiManuelMin, emailTemplate }
```

### Côté artisan (espace pro)
```
GET /api/v1/artisans/me/grille
POST /api/v1/artisans/me/grille
  body: { tarifHoraire, minimumFacture, ..., forfaits: [] }

GET /api/v1/artisans/me/demandes
  → liste des DemandeEnvoi reçus

POST /api/v1/artisans/me/demandes/:id/generer-devis
  → Agent 4 génère devis perso (Claude)
  → retourne DevisGenere en brouillon

PATCH /api/v1/artisans/me/devis/:id
  → ajuster lignes, valider

POST /api/v1/artisans/me/devis/:id/envoyer
  → génère PDF (pdf-lib), upload Cloudinary, email client
```

### Cron (mise à jour KB)
```
GET /api/v1/cron/insee-bt          (mensuel 1er jour du mois)
GET /api/v1/cron/scraper-openbtp   (mensuel)
GET /api/v1/cron/scraper-hemea     (mensuel)
```

---

## 4. Prompts Claude (4 agents)

### Agent 1 — Qualifieur
Modèle : `claude-opus-4-7` (plus fin pour conv) ou `claude-sonnet-4-6` (moins cher)

```
Tu es l'assistant Bativio qui qualifie un projet de travaux. Tu poses des
questions courtes et ciblées pour comprendre le besoin, en <= 5-7 questions
au total. Tu privilégies les choix multiples pour aller vite.

Étapes :
1. Détecte le(s) métier(s) concerné(s) : plombier, électricien, peintre,
   carreleur, maçon, menuisier, couvreur, chauffagiste, serrurier, cuisiniste.
2. Selon le métier, pose les 3-5 questions clés pour estimer (surface,
   type, urgence, état actuel).
3. Demande délai et budget si non évoqué.
4. Clôture avec demande contact (nom, email, tél).

Tu réponds UNIQUEMENT en JSON :
{
  "step": "question" | "done",
  "metier": string | null,
  "question": { "id": string, "prompt": string, "type": "choices|text|contact", "choices"?: [...] } | null,
  "collected": { [id]: value },
  "next_action": "ask" | "contact" | "finish"
}
```

### Agent 2 — Pré-devis fourchette
Modèle : `claude-sonnet-4-6`

```
Tu génères une fourchette indicative (min-max) à partir de la qualif client
et des moyennes marché. Tu ne donnes PAS de devis ferme — c'est une
estimation pour aider le client à se situer.

INPUT :
- Qualif collectée : {...}
- Moyennes marché Rhône-Alpes (RAG) : {...}
- Indices BT actuels : {...}

OUTPUT JSON :
{
  "fourchetteHt": { "min": number, "max": number },
  "explication": string (2-3 phrases),
  "facteurs": [ "surface X m²", "type Y"... ],
  "disclaimer": "Estimation indicative. Devis ferme après échange avec l'artisan."
}
```

### Agent 3 — Routage (suggestion artisans)
Modèle : `claude-sonnet-4-6`

```
Propose les 3-5 artisans les plus pertinents pour cette demande, parmi
la liste fournie. Critères :
- Métier match
- Ville/zone intervention couvre
- Disponibilité (dernière activité < 7j)
- Note moyenne >= 4.0
- Plan (bonus si PRO/BUSINESS)

OUTPUT JSON :
{
  "suggestions": [
    { "artisanId": string, "score": 0-100, "raison": string }
  ]
}
```

### Agent 4 — Devis final (LE CŒUR)
Modèle : `claude-opus-4-7` OBLIGATOIREMENT (précision chiffrage)

```
Tu es DevisIA, expert chiffrage BTP Bativio. Tu génères un devis 100%
conforme et réaliste pour un artisan donné.

RÈGLES ABSOLUES :
1. Priorité 1 : grille tarifaire de l'artisan (fournie dans le contexte).
   Si un forfait existe pour cette prestation → tu l'utilises tel quel.
2. Priorité 2 : si tarif artisan manquant, moyennes marché Rhône-Alpes
   2026 (RAG). Dans ce cas tu flagge la ligne avec "fallback_marche": true
   et l'artisan pourra l'ajuster.
3. Tu appliques indice BT01 déc. 2025 = 133.7 pour révision si demandé.
4. Tu calcules HT + TVA (selon type travaux : 10% rénovation / 20% neuf /
   5.5% économie énergie).
5. Tu inclus les 16 mentions obligatoires 2026 (voir KB).
6. Tu ne hallucines jamais : si info manquante, tu retournes "need_clarif".

INPUT :
- Grille tarifaire artisan : {...}
- Demande qualifiée : {...}
- KB marché : {...}
- Mentions légales : {...}

OUTPUT JSON :
{
  "status": "ok" | "need_clarif",
  "clarifications"?: [string],
  "numero": string,
  "lignes": [
    {
      "label": string,
      "description"?: string,
      "qte": number,
      "unite": string,
      "puHt": number,
      "totalHt": number,
      "tva": number,
      "source": "grille_artisan" | "forfait" | "fallback_marche",
      "fallback_marche"?: true
    }
  ],
  "sousTotaux": { "mo": number, "mat": number, "deplacement": number },
  "totalHt": number,
  "totalTva": number,
  "totalTtc": number,
  "mentionsObligatoires": { [id: string]: "ok" }
}
```

---

## 5. UI essentielles

### 1. Artisan — "Ma grille tarifaire"
**Route** : `/dashboard/tarifs`

Sections :
- **Tarifs de base** : horaire, urgence, minimum facture, déplacement
- **Forfaits** : liste CRUD (label, description, prix, unité)
- **Zone intervention** : villes cochables ou rayon km
- **TVA par défaut** : 10% / 20%
- **Notes libres** (texte visible par Claude)

UX : progress bar "Grille remplie à 60% — encore 4 infos pour un devis complet"

### 2. Client — Chat qualifieur
**Route** : `/demande` (ou mode dans `/`)

UI inspirée Intercom / Typeform :
- Bulle assistant avec avatar Bativio
- Questions choix multiples par bubbles cliquables
- Barre progression en haut
- Fin : récap + "Voir pré-devis" → modal avec fourchette

### 3. Webmaster — Dashboard demandes
**Route** : `/admin/demandes-projets`

- Liste : filtres statut, métier, ville, date
- Détail : full qualif + pré-devis + suggestions Agent 3
- Actions : routage manuel (multi-select) OU "Activer mode auto"
- Settings modal : paramètres routage auto global

### 4. Artisan — Inbox demandes
**Route** : `/dashboard/demandes` (existe déjà, à enrichir)

- Chaque demande reçue : qualif + pré-devis + bouton "Générer devis"
- Click "Générer" : appelle Agent 4 → affiche devis brouillon éditable
- Actions : ajuster lignes, valider, envoyer PDF au client

---

## 6. Roadmap incrémentale

| Phase | Durée | Contenu | Livrable |
|---|---|---|---|
| **P1** | 3-4h | Schéma Prisma + migration + seed mentions/indices/tarifs marché | DB prête |
| **P2** | 4-6h | UI artisan "Ma grille tarifaire" (CRUD) + API | Artisan peut renseigner ses prix |
| **P3** | 4-6h | Chat qualifieur client (Agent 1) + Agent 2 pré-devis | Client peut qualifier projet + voir fourchette |
| **P4** | 3-4h | Dashboard webmaster + routage manuel/auto | Demandes traitables |
| **P5** | 6-8h | Agent 4 devis + PDF conforme + envoi | Devis complets générés |
| **P6** | 2-3h | Crons ingestion KB (INSEE, OpenBTP, Hemea) | KB auto-maintenue |

**Total V1 : 22-31h** — faisable sur 4-6 jours de dev.

---

## 7. Sécurité & conformité

- **Isolation artisans** : Claude ne voit jamais la grille d'un autre artisan
- **Rate limit** : 20 devis/jour/artisan max (évite abus IA)
- **Logs complets** : chaque appel Claude stocké (input, output, coût)
- **Consentement RGPD** : case à cocher avant qualif client
- **Mentions légales 2026** : 16 mentions vérifiées par Claude + check final côté back
- **Signature** : espace signature PDF + possibilité signature électronique (v1.1)

---

## 8. Coût estimé API Claude

Par devis généré (Agent 4 Opus 4.7) :
- Input ~3k tokens (grille + qualif + RAG) × $0.015/1k = **$0.045**
- Output ~2k tokens (devis JSON) × $0.075/1k = **$0.15**
- **≈ 0,20 € par devis**

Qualif (Agent 1 Sonnet 4.6) : ~0,02 € par session
Pré-devis (Agent 2 Sonnet) : ~0,01 € par demande

**Marge saine même si facturé 2€/devis à l'artisan.**

---

## 9. Décisions à prendre

- [ ] On priorise Agent 4 Opus 4.7 OU on teste d'abord Sonnet 4.6 (3x moins cher) pour le devis final ?
- [ ] Génération PDF : `pdf-lib` (léger, en Node) ou `react-pdf` (si on veut des maquettes plus visuelles) ?
- [ ] Stockage PDF : Cloudinary (déjà en place) ou S3 ?
- [ ] On envoie email via Resend (déjà en place) — OK pour V1
- [ ] Signature électronique : V1 = case à cocher + email confirmation / V2 = DocuSign ou équivalent
- [ ] Mode auto routage : on laisse "MANUEL" par défaut en V1 (safer) puis on active auto après retour d'expérience

---

## 10. Action immédiate proposée

**Je code la Phase 1 maintenant** (~3-4h) :
1. Ajout des modèles au `schema.prisma`
2. `npx prisma migrate dev --name devis-ia-v1`
3. Seed initial : 16 mentions obligatoires + indice BT01 déc. 2025 + tarifs marché Rhône-Alpes compilés de ton brief
4. Types TypeScript générés + helpers `@/lib/devis-ia/*`

À la fin tu pourras vérifier la DB via `npx prisma studio` et on passe à P2 (UI grille tarifaire).

**Tu dis "go P1" et je pars.**
