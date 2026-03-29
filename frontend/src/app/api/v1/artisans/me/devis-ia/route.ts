import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import crypto from "crypto";

const devisIASchema = z.object({
  description: z.string().min(10, "La description doit contenir au moins 10 caracteres"),
  clientNom: z.string().min(2, "Le nom du client est requis"),
  clientEmail: z.string().email().optional(),
  clientTelephone: z.string().optional(),
  clientAdresse: z.string().optional(),
  surface: z.string().optional(),
  niveauGamme: z.enum(["standard", "premium"]).default("standard"),
  devisRequestId: z.string().optional(),
});

export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const devisList = await prisma.devis.findMany({
      where: { artisanId: artisan.id },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(devisList);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Get devis IA list error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: {
        metier: true,
        tarification: true,
        prestationTypes: true,
      },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    if (!artisan.tarification) {
      return apiError("Configurez d'abord votre tarification", 400);
    }

    const body = await request.json();
    const parsed = devisIASchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Donnees invalides";
      return apiError(firstError, 400);
    }

    const {
      description,
      clientNom,
      clientEmail,
      clientTelephone,
      clientAdresse,
      surface,
      niveauGamme,
      devisRequestId,
    } = parsed.data;

    const tarif = artisan.tarification;
    const metierNom = artisan.metier?.nom || "artisan du batiment";

    // Build prestations library string
    const prestationsLib = artisan.prestationTypes.length > 0
      ? artisan.prestationTypes
          .map(
            (p) =>
              `- ${p.designation}: ${p.prixUnitaire}EUR/${p.unite}${p.categorie ? ` (${p.categorie})` : ""}${p.inclutFourniture ? " fourniture incluse" : ""}`
          )
          .join("\n")
      : "Aucune prestation type configuree.";

    const systemPrompt = `Tu es un assistant specialise dans la generation de devis pour les artisans du batiment.
Tu generes des devis pour un(e) ${metierNom}.

Tarification de l'artisan :
- Tarif horaire : ${tarif.tarifHoraire}EUR/h
- Frais de deplacement : ${tarif.fraisDeplacementMontant}EUR (${tarif.fraisDeplacementType})
- Marge fournitures : ${tarif.margeFournitures}%
- TVA par defaut : ${tarif.tvaDefault}%

Bibliotheque de prestations :
${prestationsLib}

IMPORTANT : Tu dois repondre UNIQUEMENT avec du JSON valide, sans texte avant ou apres. Le JSON doit suivre exactement cette structure :
{"objet":"description courte du devis", "postes":[{"categorie":"categorie du poste", "designation":"description du poste", "quantite":1, "unite":"forfait", "prixUnitaireHT":120, "totalHT":120, "inclutFourniture":false}], "totalHT":5000, "dureeEstimee":"5 jours", "notes":"remarques ou conditions particulieres"}

Regles :
- Utilise les prestations de la bibliotheque quand c'est pertinent, sinon cree de nouveaux postes.
- Les prix doivent etre realistes pour le marche francais.
- Adapte les prix au niveau de gamme demande.
- Le totalHT doit correspondre a la somme des totalHT des postes.
- Chaque poste doit avoir un totalHT = quantite * prixUnitaireHT.`;

    const userPrompt = `Genere un devis pour les travaux suivants :

Description : ${description}
${surface ? `Surface : ${surface}` : ""}
Niveau de gamme : ${niveauGamme}

Reponds uniquement avec le JSON.`;

    // Call Claude API
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      return apiError("Configuration IA manquante", 500);
    }

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!claudeResponse.ok) {
      console.error("Claude API error:", claudeResponse.status, await claudeResponse.text());
      return apiError("Erreur lors de la generation du devis IA", 500);
    }

    const claudeData = await claudeResponse.json();
    const textContent = claudeData.content?.find(
      (c: { type: string }) => c.type === "text"
    );

    if (!textContent?.text) {
      return apiError("Reponse IA invalide", 500);
    }

    // Parse JSON from Claude response
    let devisIA: {
      objet: string;
      postes: Array<{
        categorie: string;
        designation: string;
        quantite: number;
        unite: string;
        prixUnitaireHT: number;
        totalHT: number;
        inclutFourniture: boolean;
      }>;
      totalHT: number;
      dureeEstimee: string;
      notes: string;
    };

    try {
      // Try to extract JSON from the response (handle potential markdown wrapping)
      let jsonText = textContent.text.trim();
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim();
      }
      devisIA = JSON.parse(jsonText);
    } catch {
      console.error("Failed to parse Claude response:", textContent.text);
      return apiError("Impossible de parser la reponse IA", 500);
    }

    // Calculate TVA and TTC
    const tauxTVA = tarif.tvaDefault;
    const totalHT = devisIA.postes.reduce((sum, p) => sum + p.totalHT, 0);
    const montantTVA = Math.round(totalHT * (tauxTVA / 100) * 100) / 100;
    const totalTTC = Math.round((totalHT + montantTVA) * 100) / 100;

    // Generate devis numero: {year}-{count+1 padded 4}
    const year = new Date().getFullYear();
    const devisCount = await prisma.devis.count({
      where: {
        artisanId: artisan.id,
        numero: { startsWith: `${year}-` },
      },
    });
    const numero = `${year}-${String(devisCount + 1).padStart(4, "0")}`;

    // Create devis in DB
    const devis = await prisma.devis.create({
      data: {
        artisanId: artisan.id,
        numero,
        clientNom,
        clientEmail: clientEmail || null,
        clientTelephone: clientTelephone || null,
        clientAdresse: clientAdresse || null,
        objet: devisIA.objet,
        niveauGamme,
        postes: devisIA.postes,
        totalHT: Math.round(totalHT * 100) / 100,
        tauxTVA,
        montantTVA,
        totalTTC,
        dureeEstimee: devisIA.dureeEstimee || null,
        notes: devisIA.notes || null,
        viewToken: crypto.randomUUID(),
        devisRequestId: devisRequestId || null,
      },
    });

    return apiSuccess(devis, 201);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Generate devis IA error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
