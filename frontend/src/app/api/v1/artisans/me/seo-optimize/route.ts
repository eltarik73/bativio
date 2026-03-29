import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

export async function POST(_request: NextRequest) {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: {
        metier: true,
        services: true,
        badges: true,
      },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    // Check plan — PRO_PLUS only
    if (artisan.plan !== "PRO_PLUS") {
      return apiError(
        "L'optimisation SEO est réservée au plan Pro+. Passez au plan supérieur pour en profiter.",
        403
      );
    }

    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      return apiError("Service IA indisponible", 503);
    }

    // Build context for AI
    const servicesText = artisan.services.map((s) => s.titre).join(", ") || "non renseignés";
    const badgesText = artisan.badges.map((b) => b.nom).join(", ") || "aucun";

    const prompt = `Tu es un expert SEO local pour les artisans du bâtiment en France.

Artisan : ${artisan.nomAffichage}
Métier : ${artisan.metier?.nom || "non renseigné"}
Ville : ${artisan.ville || "non renseignée"}
Description actuelle : ${artisan.description || "aucune"}
Services : ${servicesText}
Qualifications : ${badgesText}

Génère :
1. Une meta description SEO optimisée (max 160 caractères) pour la vitrine de cet artisan sur bativio.fr. Elle doit inclure le métier, la ville, et un appel à l'action.
2. Une liste de 10 mots-clés SEO locaux pertinents, séparés par des virgules.

Réponds en JSON avec exactement cette structure :
{"seoDescription": "...", "seoKeywords": "mot1, mot2, mot3, ..."}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic API error:", response.status, await response.text());
      return apiError("Erreur du service IA", 502);
    }

    const aiResponse = await response.json();
    const textContent = aiResponse.content?.[0]?.text || "";

    // Parse JSON from AI response
    let seoData: { seoDescription: string; seoKeywords: string };
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      seoData = JSON.parse(jsonMatch[0]);
    } catch {
      return apiError("Erreur de traitement de la réponse IA", 502);
    }

    // Save to artisan
    const updatedArtisan = await prisma.artisan.update({
      where: { id: artisan.id },
      data: {
        seoDescription: seoData.seoDescription,
        seoKeywords: seoData.seoKeywords,
      },
    });

    return apiSuccess({
      seoDescription: updatedArtisan.seoDescription,
      seoKeywords: updatedArtisan.seoKeywords,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("SEO optimize error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
