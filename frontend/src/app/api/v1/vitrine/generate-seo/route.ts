import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { requireFeature } from "@/lib/auth-server";

export async function POST(_request: NextRequest) {
  try {
    const { artisan } = await requireFeature("agent_ia");

    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      return apiError("Service IA indisponible", 503);
    }

    // Check rate limit: max 1 generation per day
    if (artisan.seoGeneratedAt) {
      const lastGen = new Date(artisan.seoGeneratedAt);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (lastGen > oneDayAgo) {
        // Return existing data
        return apiSuccess({
          seoGenerated: artisan.seoGenerated,
          cached: true,
          message: "SEO d\u00e9j\u00e0 g\u00e9n\u00e9r\u00e9 aujourd'hui",
        });
      }
    }

    // Load full artisan data
    const full = await prisma.artisan.findUnique({
      where: { id: artisan.id },
      include: {
        metier: true,
        services: true,
        badges: true,
        photos: { take: 10, orderBy: { ordre: "asc" } },
        prestationTypes: true,
      },
    });

    if (!full) return apiError("Artisan introuvable", 404);

    const servicesText = full.services.map(s => s.titre).join(", ") || "non renseign\u00e9s";
    const prestationsText = full.prestationTypes.map(p => `${p.designation} (${p.prixUnitaire}\u20ac/${p.unite})`).join(", ");
    const badgesText = full.badges.map(b => b.nom).join(", ") || "aucun";
    const photosCount = full.photos.length;

    const prompt = `Tu es un expert SEO local pour artisans du b\u00e2timent en France.

Donn\u00e9es de l'artisan :
- Nom : ${full.nomAffichage}
- M\u00e9tier : ${full.metier?.nom || "non renseign\u00e9"} (${full.metier?.label || ""})
- Ville : ${full.ville || "non renseign\u00e9e"} (${full.codePostal || ""})
- Exp\u00e9rience : ${full.experienceAnnees || "non renseign\u00e9e"} ans
- Services : ${servicesText}
- Prestations avec tarifs : ${prestationsText || "non renseign\u00e9es"}
- Qualifications : ${badgesText}
- Note : ${full.noteMoyenne}/5 (${full.nombreAvis} avis)
- Zone : ${full.zoneRayonKm || 25}km autour de ${full.ville || "sa ville"}
- Description actuelle : ${full.description || "aucune"}
- Nombre de photos : ${photosCount}

G\u00e9n\u00e8re en JSON :
{
  "title": "Title SEO optimis\u00e9 (50-60 caract\u00e8res max). Format: 'M\u00e9tier Ville \u2014 Sp\u00e9cialit\u00e9 | Nom Artisan'",
  "metaDescription": "Meta description SEO (150-160 caract\u00e8res max). Inclure m\u00e9tier, ville, appel \u00e0 l'action, note si bonne.",
  "aboutText": "Texte de pr\u00e9sentation professionnel (150-200 mots). Ton local, rassurant, \u00e9crit comme si c'\u00e9tait l'artisan qui parle. Mention de la ville, de l'exp\u00e9rience, des sp\u00e9cialit\u00e9s. Pas de formules marketing agressives.",
  "faq": [
    { "question": "Question SEO locale pertinente", "answer": "R\u00e9ponse informative (2-3 phrases)" }
  ],
  "keywords": ["mot-cl\u00e9 1", "mot-cl\u00e9 2"]
}

IMPORTANT :
- G\u00e9n\u00e8re 5 questions FAQ ciblant les recherches locales r\u00e9elles (ex: "Combien co\u00fbte un [m\u00e9tier] \u00e0 [ville] ?", "Quel [m\u00e9tier] contacter en urgence \u00e0 [ville] ?")
- 10 mots-cl\u00e9s SEO locaux (inclure [m\u00e9tier] [ville], [m\u00e9tier] [code postal], urgence [m\u00e9tier] [ville], etc.)
- Le aboutText doit sembler \u00e9crit par l'artisan, PAS par une IA
- R\u00e9ponds UNIQUEMENT en JSON valide`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic API error:", response.status, await response.text());
      return apiError("Erreur du service IA", 502);
    }

    const aiResponse = await response.json();
    const textContent = aiResponse.content?.[0]?.text || "";

    // Parse JSON
    let seoData: Record<string, unknown>;
    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      seoData = JSON.parse(jsonMatch[0]);
    } catch {
      return apiError("Erreur de traitement de la r\u00e9ponse IA", 502);
    }

    // Save to artisan
    await prisma.artisan.update({
      where: { id: artisan.id },
      data: {
        seoGenerated: seoData as Record<string, string | string[] | Array<{ question: string; answer: string }>>,
        seoGeneratedAt: new Date(),
        // Also update the simple fields for backward compat
        seoDescription: (seoData.metaDescription as string) || null,
        seoKeywords: Array.isArray(seoData.keywords) ? (seoData.keywords as string[]).join(", ") : null,
      },
    });

    return apiSuccess({ seoGenerated: seoData, cached: false });
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("Generate SEO error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}
