import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const metier = await prisma.metier.update({
      where: { id },
      data: {
        ...(body.nom !== undefined && { nom: body.nom }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.icone !== undefined && { icone: body.icone }),
      },
    });
    return apiSuccess(metier);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin update metier error:", err);
    return apiError("Erreur interne", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.metier.delete({ where: { id } });
    return apiSuccess({ message: "Métier supprimé" });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin delete metier error:", err);
    return apiError("Erreur interne", 500);
  }
}
