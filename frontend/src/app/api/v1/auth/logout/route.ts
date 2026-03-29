import { clearAuthCookie } from "@/lib/auth-server";
import { apiSuccess } from "@/lib/api-response";

export async function POST() {
  await clearAuthCookie();
  return apiSuccess({ message: "Déconnexion réussie" });
}
