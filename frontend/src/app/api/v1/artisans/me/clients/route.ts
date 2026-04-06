import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

// GET — search clients
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const artisan = await prisma.artisan.findUnique({ where: { userId: session.userId } });
    if (!artisan || artisan.deletedAt) return apiError("Artisan introuvable", 404);

    const q = request.nextUrl.searchParams.get("q") || "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { artisanId: artisan.id };

    if (q.length >= 1) {
      where.OR = [
        { nom: { contains: q, mode: "insensitive" } },
        { prenom: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { telephone: { contains: q, mode: "insensitive" } },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: q ? 10 : 50,
    });

    return apiSuccess(clients);
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("GET clients error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}

// POST — create a client
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const artisan = await prisma.artisan.findUnique({ where: { userId: session.userId } });
    if (!artisan || artisan.deletedAt) return apiError("Artisan introuvable", 404);

    const body = await request.json();
    const { nom, prenom, email, telephone, adresse, codePostal, ville, siret, notes } = body as Record<string, string>;

    if (!nom) return apiError("Le nom est requis", 400);

    // Check duplicate by email
    if (email) {
      const existing = await prisma.client.findFirst({ where: { artisanId: artisan.id, email } });
      if (existing) return apiSuccess(existing); // Return existing instead of error
    }

    const client = await prisma.client.create({
      data: {
        artisanId: artisan.id,
        nom, prenom: prenom || null, email: email || null,
        telephone: telephone || null, adresse: adresse || null,
        codePostal: codePostal || null, ville: ville || null,
        siret: siret || null, notes: notes || null,
      },
    });

    return apiSuccess(client, 201);
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("POST client error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}
