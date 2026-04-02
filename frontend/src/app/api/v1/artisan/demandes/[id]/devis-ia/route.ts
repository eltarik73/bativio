import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

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

    // 2. Plan gate: BUSINESS or PRO_PLUS only
    if (artisan.plan !== "BUSINESS" && artisan.plan !== "PRO_PLUS") {
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

    // 5. Build the prompt
    const tarification = artisan.tarification;
    const metierNom = artisan.metier?.nom || "artisan du bâtiment";

    const messagesText = demande.messages.length > 0
      ? demande.messages.map((m) => `${m.auteur}: ${m.contenu}`).join("\n")
      : "Aucun message échangé.";

    const prompt = `Tu es un expert en chiffrage de travaux du bâtiment en France.

CONTEXTE :
- Artisan : ${artisan.nomAffichage}, ${metierNom}, ${artisan.ville || "non renseignée"}
- Tarif horaire : ${tarification?.tarifHoraire ? `${tarification.tarifHoraire}€/h` : "45€/h (moyenne marché)"}
- Marge fournitures : ${tarification?.margeFournitures ? `${tarification.margeFournitures}%` : "25%"}

DEMANDE CLIENT :
- Client : ${demande.nomClient}, ${demande.clientVille || "non renseignée"}
- Type de travaux : ${demande.descriptionBesoin}
- Urgence : ${demande.urgence}
- Réponses structurées : ${demande.reponses ? JSON.stringify(demande.reponses) : "aucune"}

Messages échangés :
${messagesText}

INSTRUCTIONS :
1. Génère un devis détaillé avec des lignes de prestation
2. Pour chaque ligne : description, quantité, unité, prix unitaire HT, total HT
3. Sépare main d'œuvre et fournitures
4. Applique la TVA correcte (10% rénovation logement >2 ans, 20% neuf, 5.5% amélioration énergétique)
5. Inclus le déplacement si pertinent
6. Les prix doivent être réalistes pour la zone Rhône-Alpes
7. Donne des prix précis, pas de fourchettes

RÉPONDS UNIQUEMENT EN JSON VALIDE (pas de markdown, pas de commentaires) :
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

    // 6. Call Claude API
    const devisIA = await callClaudeForDevis(anthropicApiKey, prompt);

    // 7. Update the demande with devis IA
    await prisma.demandeDevis.update({
      where: { id },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        devisIA: devisIA as any,
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

interface DevisIALigne {
  description: string;
  type: string;
  quantite: number;
  unite: string;
  prixUnitaireHT: number;
  totalHT: number;
}

interface DevisIAResult {
  lignes: DevisIALigne[];
  totalHT: number;
  tva: { taux: number; montant: number };
  totalTTC: number;
  delaiEstime: string;
  notes: string;
}

async function callClaudeForDevis(
  apiKey: string,
  prompt: string,
  isRetry = false
): Promise<DevisIAResult> {
  const finalPrompt = isRetry
    ? prompt +
      "\n\nATTENTION : Ta réponse précédente n'était pas du JSON valide. Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte, markdown ou commentaire avant ou après."
    : prompt;

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
      messages: [{ role: "user", content: finalPrompt }],
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

  // Parse JSON from Claude response
  try {
    let jsonText = textContent.text.trim();
    // Handle potential markdown wrapping
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }
    const parsed: DevisIAResult = JSON.parse(jsonText);

    // Basic validation
    if (!parsed.lignes || !Array.isArray(parsed.lignes) || parsed.lignes.length === 0) {
      throw new Error("Structure de devis invalide : lignes manquantes");
    }
    if (typeof parsed.totalHT !== "number" || typeof parsed.totalTTC !== "number") {
      throw new Error("Structure de devis invalide : totaux manquants");
    }

    return parsed;
  } catch (parseError) {
    // Retry once with a stricter prompt if this was the first attempt
    if (!isRetry) {
      console.warn("First JSON parse failed, retrying with stricter prompt");
      return callClaudeForDevis(apiKey, prompt, true);
    }
    console.error("Failed to parse Claude response after retry:", textContent.text);
    throw new ClaudeAPIError("Impossible de parser la réponse IA", 502);
  }
}

class ClaudeAPIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ClaudeAPIError";
    this.status = status;
  }
}
