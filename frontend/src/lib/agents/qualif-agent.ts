import type Anthropic from "@anthropic-ai/sdk";
import { getClaude, MODEL_SONNET, extractJson, computeCost } from "@/lib/claude";
import { prisma } from "@/lib/prisma";

export interface QualifQuestion {
  id: string;
  prompt: string;
  type: "choices" | "text" | "contact";
  choices?: { label: string; value: string }[];
  placeholder?: string;
}

export interface QualifResponse {
  step: "question" | "done";
  metier: string | null;
  question: QualifQuestion | null;
  collected: Record<string, string>;
  next_action: "ask" | "contact" | "finish";
  reasoning?: string;
}

export interface QualifMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `Tu es l'assistant Bativio, qui aide les particuliers de Rhône-Alpes à décrire leur projet de travaux pour trouver le bon artisan.

Tu poses des questions courtes et ciblées (5-8 maximum) pour qualifier le besoin.

ÉTAPES (dans cet ordre) :
1. Détecte le(s) métier(s) concerné(s) : plombier, electricien, peintre, carreleur, macon, menuisier, couvreur, chauffagiste, serrurier, cuisiniste.
2. Pose 4-6 questions clés selon le métier (type, surface/m², état actuel, urgence).
3. Termine par délai et budget si pas encore évoqués.
4. Quand tu as assez d'infos, retourne "step": "done" avec "next_action": "photos".

RÈGLES DE TYPES DE QUESTIONS (TRÈS IMPORTANT) :
- **Surfaces (m², m³, ml)** → TOUJOURS type="text" avec placeholder suggérant un exemple + tolérance. Jamais de choix multiple pour les surfaces.
- **Quantités (nombre de pièces, nombre d'éléments)** → type="text" avec placeholder
- **Budget, délai** → type="choices" avec fourchettes
- **Type de travaux, matériau, type d'intervention** → type="choices"
- **Précisions libres** (existant, contraintes) → type="text"

Si le client ne sait pas la surface exacte, encourage-le à donner une estimation : "environ 5 m² (± 2-3 m²)", "plus ou moins 15 m²". Accepte les réponses approximatives sans re-poser la question.

RÈGLES GÉNÉRALES :
- Questions courtes, max 14 mots.
- Une seule question à la fois.
- Ton chaleureux mais efficace, pas de blabla.
- N'oublie JAMAIS d'inclure les m²/dimensions pour peintre/carreleur/couvreur/maçon.
- Ne fais PAS la question de contact ni photos — retourne juste "done" avec next_action="photos" et l'UI gère la suite.

FORMAT DE RÉPONSE (JSON strict, aucun texte hors JSON) :
{
  "step": "question" | "done",
  "metier": "plombier" | "electricien" | ... | null,
  "question": {
    "id": "slug_court_unique",
    "prompt": "Votre question ?",
    "type": "choices" | "text",
    "choices": [{"label": "Libellé", "value": "slug"}, ...],
    "placeholder": "texte d'aide + exemple (si type=text)"
  } | null,
  "collected": {"questionId": "valeur", ...},
  "next_action": "ask" | "photos" | "contact" | "finish"
}

EXEMPLES DE BONNES QUESTIONS :
- Carrelage : {id:"surface", prompt:"Quelle surface approximative en m² ?", type:"text", placeholder:"Ex : 5 m² (± 2-3 m² si vous ne savez pas précisément)"}
- Peinture : {id:"surface_murs", prompt:"Quelle surface de murs à peindre (m²) ?", type:"text", placeholder:"Ex : 40 m² ou \"tout un salon + chambre\""}
- Plomberie : {id:"type_install", prompt:"Quel type d'intervention ?", type:"choices", choices:[{label:"Fuite / urgence", value:"urgence"}, ...]}
- Maçon : {id:"volume", prompt:"Surface ou volume approximatif ?", type:"text", placeholder:"Ex : ouverture mur 3m, extension 25m², dalle 40m²"}

GUIDES PAR MÉTIER :
- plombier : type intervention, pièce, urgence, détail matériel
- carreleur : pièce, **surface m² (text)**, type carrelage, état support
- peintre : **surface m² (text)**, type (int/ext/bois), état murs, nombre couches
- electricien : type (normes/ajout/rénov/panne), **surface logement m² (text)**
- macon : type (ext/ouverture/dalle/fissure), **volume (text)**
- couvreur : type intervention, **surface toiture m² (text)**
- chauffagiste : installation (chaudière/PAC/clim/radiateur), existant
- menuisier : type (pose/parquet/escalier/placards), **nombre/dimensions (text si parquet)**`;

interface QualifInput {
  initialDescription: string;
  history: QualifMessage[];
  collected: Record<string, string>;
  ville?: string | null;
}

interface QualifResult {
  response: QualifResponse;
  cost: number;
  tokensIn: number;
  tokensOut: number;
  modelUsed: string;
  raw: string;
}

export async function runQualifAgent({
  initialDescription,
  history,
  collected,
  ville,
}: QualifInput): Promise<QualifResult> {
  const claude = getClaude();

  const userContext = `Description initiale : "${initialDescription}"
Ville : ${ville || "non renseignée"}
Données déjà collectées : ${JSON.stringify(collected)}

Historique :
${history.map((m) => `${m.role === "user" ? "CLIENT" : "ASSISTANT"}: ${m.content}`).join("\n")}

Que fais-tu ensuite ? Réponds en JSON uniquement.`;

  const result = await claude.messages.create({
    model: MODEL_SONNET,
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userContext }],
  });

  const text = result.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const parsed = extractJson<QualifResponse>(text);
  if (!parsed) {
    throw new Error(`Agent qualif: réponse non-JSON. Raw: ${text.slice(0, 300)}`);
  }

  const tokensIn = result.usage.input_tokens;
  const tokensOut = result.usage.output_tokens;
  const cost = computeCost(MODEL_SONNET, tokensIn, tokensOut);

  return { response: parsed, cost, tokensIn, tokensOut, modelUsed: MODEL_SONNET, raw: text };
}

/**
 * Injecte les guides qualif de la KB pour enrichir le prompt système.
 */
export async function buildSystemPromptWithKb(): Promise<string> {
  const guides = await prisma.kbDocument.findMany({
    where: { type: "GUIDE_QUALIF" },
    select: { title: true, content: true },
  });
  if (guides.length === 0) return SYSTEM_PROMPT;
  const kbBlock = guides.map((g) => `### ${g.title}\n${g.content}`).join("\n\n");
  return `${SYSTEM_PROMPT}\n\n--- GUIDES KB (référence complémentaire) ---\n${kbBlock}`;
}

