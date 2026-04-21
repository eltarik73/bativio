import { apiError } from "@/lib/api-response";

/**
 * Catch-all 404 pour toutes les routes /api/v1/* non matchées.
 * Retourne JSON propre au lieu du HTML par défaut Next.js.
 */
export const GET = () => apiError("Route API introuvable", 404);
export const POST = () => apiError("Route API introuvable", 404);
export const PUT = () => apiError("Route API introuvable", 404);
export const PATCH = () => apiError("Route API introuvable", 404);
export const DELETE = () => apiError("Route API introuvable", 404);
