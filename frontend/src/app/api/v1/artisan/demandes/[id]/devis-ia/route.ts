import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { hasFeature } from "@/lib/plans";
import type { PlanType } from "@/lib/plans";
import { getEffectivePlan } from "@/lib/plan-gates";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    // 1. Get authenticated artisan with tarification and metier
    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: {
        metier: true,
        tarification: true,
      },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    // 2. Plan gate: BUSINESS only (uses effective plan for overrides)
    if (!hasFeature(getEffectivePlan(artisan).toUpperCase() as PlanType, "devis_ia")) {
      return apiError("Le devis IA est réservé au plan Business", 403);
    }

    // 3. Find the DemandeDevis, verify ownership, include messages and tarification
    const demande = await prisma.demandeDevis.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!demande || demande.artisanId !== artisan.id) {
      return apiError("Demande de devis introuvable", 404);
    }

    // 4. Check API key
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      return apiError("Configuration IA manquante", 500);
    }

    // 5. Build the prompt — split into a static system prompt (cacheable via
    //    Anthropic prompt caching, 5-min TTL) and a per-request user context.
    //    With ~10 BUSINESS artisans generating devis in parallel windows, the
    //    cache hit rate easily covers its overhead and saves ~90% of the
    //    system tokens on each subsequent call.
    const tarification = artisan.tarification;
    const metierNom = artisan.metier?.nom || "artisan du bâtiment";

    const messagesText = demande.messages.length > 0
      ? demande.messages.map((m) => `${m.auteur}: ${m.contenu}`).join("\n")
      : "Aucun message échangé.";

    const userContext = `CONTEXTE :
- Artisan : ${artisan.nomAffichage}, ${metierNom}, ${artisan.ville || "non renseignée"}
- Tarif horaire : ${tarification?.tarifHoraire ? `${tarification.tarifHoraire}€/h` : "45€/h (moyenne marché)"}
- Marge fournitures : ${tarification?.margeFournitures ? `${tarification.margeFournitures}%` : "25%"}

DEMANDE CLIENT :
- Client : ${demande.nomClient}, ${demande.clientVille || "non renseignée"}
- Type de travaux : ${demande.descriptionBesoin}
- Urgence : ${demande.urgence}
- Réponses structurées : ${demande.reponses ? JSON.stringify(demande.reponses) : "aucune"}

Messages échangés :
${messagesText}`;

    // 6. Call Claude API (system prompt cached for 5 min)
    const devisIA = await callClaudeForDevis(anthropicApiKey, userContext);

    // 7. Update the demande with devis IA — devisIA is now Zod-validated
    await prisma.demandeDevis.update({
      where: { id },
      data: {
        devisIA,
        devisIAGenere: true,
      },
    });

    // 8. Return the parsed devis
    return apiSuccess(devisIA);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("POST /api/v1/artisan/demandes/[id]/devis-ia error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}

// ---------- Helpers ----------

const DevisIALigneSchema = z.object({
  description: z.string().min(1).max(500),
  type: z.string().max(50),
  quantite: z.number().nonnegative(),
  unite: z.string().max(20),
  prixUnitaireHT: z.number().nonnegative(),
  totalHT: z.number().nonnegative(),
});

const DevisIAResultSchema = z.object({
  lignes: z.array(DevisIALigneSchema).min(1).max(50),
  totalHT: z.number().nonnegative(),
  tva: z.object({
    taux: z.number().min(0).max(100),
    montant: z.number().nonnegative(),
  }),
  totalTTC: z.number().nonnegative(),
  delaiEstime: z.string().max(200),
  notes: z.string().max(2000),
});

type DevisIAResult = z.infer<typeof DevisIAResultSchema>;

// Static system prompt — eligible for prompt caching (5-min TTL).
// Keep this stable: any change invalidates the cache for everyone.
const DEVIS_IA_SYSTEM_PROMPT = `Tu es un expert en chiffrage de travaux du bâtiment en France, spécialisé dans la zone Rhône-Alpes.

INSTRUCTIONS :
1. Génère un devis détaillé avec des lignes de prestation à partir du contexte fourni par l'utilisateur.
2. Pour chaque ligne : description, quantité, unité, prix unitaire HT, total HT.
3. Sépare main d'œuvre, fournitures et déplacement (un type par ligne).
4. Applique la TVA correcte :
   - 10 % rénovation de logement de plus de 2 ans
   - 20 % construction neuve
   - 5,5 % travaux d'amélioration énergétique éligibles
5. Inclus une ligne de déplacement si pertinent.
6. Les prix doivent être réalistes pour la zone Rhône-Alpes.
7. Donne des prix précis, jamais de fourchettes.

RÉPONDS UNIQUEMENT EN JSON VALIDE (pas de markdown, pas de commentaires) au format :
{
  "lignes": [
    { "description": "...", "type": "main_oeuvre|fourniture|deplacement", "quantite": 1, "unite": "forfait|h|m²|ml|u", "prixUnitaireHT": 0, "totalHT": 0 }
  ],
  "totalHT": 0,
  "tva": { "taux": 10, "montant": 0 },
  "totalTTC": 0,
  "delaiEstime": "2-3 jours",
  "notes": "Remarques pour l'artisan"
}`;

async function callClaudeForDevis(
  apiKey: string,
  userContext: string,
  isRetry = false
): Promise<DevisIAResult> {
  const userMessage = isRetry
    ? userContext +
      "\n\nATTENTION : Ta réponse précédente n'était pas du JSON valide. Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte, markdown ou commentaire avant ou après."
    : userContext;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      // Mark the system block as cacheable — the same prompt across all
      // BUSINESS artisans hits the same 5-minute cache.
      system: [
        {
          type: "text",
          text: DEVIS_IA_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Claude API error:", response.status, errorText);
    throw new ClaudeAPIError(
      `Erreur du service IA (${response.status})`,
      response.status
    );
  }

  const data = await response.json();
  const textContent = data.content?.find(
    (c: { type: string }) => c.type === "text"
  );

  if (!textContent?.text) {
    throw new ClaudeAPIError("Réponse IA vide", 502);
  }

  // Parse + Zod-validate Claude's JSON. Claude sometimes wraps the JSON in
  // ```json``` fences; strip those first. We retry once with a stricter prompt
  // before giving up — Claude usually self-corrects.
  let jsonText = textContent.text.trim();
  const fenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) jsonText = fenceMatch[1].trim();

  let raw: unknown;
  try {
    raw = JSON.parse(jsonText);
  } catch {
    if (!isRetry) {
      console.warn("First JSON parse failed, retrying with stricter prompt");
      return callClaudeForDevis(apiKey, userContext, true);
    }
    console.error("Failed to parse Claude response after retry:", textContent.text);
    throw new ClaudeAPIError("Impossible de parser la réponse IA", 502);
  }

  const validated = DevisIAResultSchema.safeParse(raw);
  if (!validated.success) {
    if (!isRetry) {
      console.warn("Schema validation failed, retrying with stricter prompt:", validated.error.issues[0]?.message);
      return callClaudeForDevis(apiKey, userContext, true);
    }
    console.error("Schema validation failed after retry:", validated.error.issues);
    throw new ClaudeAPIError("Structure de devis IA invalide", 502);
  }
  return validated.data;
}

class ClaudeAPIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ClaudeAPIError";
    this.status = status;
  }
}
