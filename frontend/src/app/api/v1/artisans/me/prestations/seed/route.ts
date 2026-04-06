import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { defaultPrestations } from "@/lib/default-prestations";

export async function POST() {
  try {
    const session = await requireAuth();
    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: { metier: true },
    });
    if (!artisan || artisan.deletedAt) return apiError("Artisan introuvable", 404);

    // Only seed if 0 prestations
    const count = await prisma.prestationType.count({ where: { artisanId: artisan.id } });
    if (count > 0) return apiSuccess({ seeded: 0, message: "Prestations d\u00e9j\u00e0 configur\u00e9es" });

    // Find defaults for this metier
    const metierSlug = (artisan.metier?.slug || artisan.metier?.nom || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Try exact match, then partial
    let defaults: typeof defaultPrestations[string] | undefined = defaultPrestations[metierSlug];
    if (!defaults) {
      const key = Object.keys(defaultPrestations).find(k => metierSlug.includes(k) || k.includes(metierSlug));
      defaults = key ? defaultPrestations[key] : undefined;
    }

    if (!defaults || defaults.length === 0) {
      return apiSuccess({ seeded: 0, message: "Pas de tarifs par d\u00e9faut pour ce m\u00e9tier" });
    }

    // Create prestations
    await prisma.prestationType.createMany({
      data: defaults.map(d => ({
        artisanId: artisan.id,
        designation: d.designation,
        unite: d.unite,
        prixUnitaire: d.prixUnitaire,
        categorie: d.categorie,
        inclutFourniture: d.inclutFourniture,
        isCustom: false,
      })),
    });

    return apiSuccess({ seeded: defaults.length });
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("Seed prestations error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}
