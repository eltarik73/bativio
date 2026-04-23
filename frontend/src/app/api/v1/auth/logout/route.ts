import { NextResponse } from "next/server";

const COOKIE_NAME = "bativio-session";

function buildClearResponse(redirect?: string) {
  const body = redirect
    ? null
    : { success: true, data: { message: "Déconnexion réussie" }, timestamp: new Date().toISOString() };
  const response = redirect
    ? NextResponse.redirect(new URL(redirect, "https://www.bativio.fr").toString(), { status: 303 })
    : NextResponse.json(body, { status: 200 });
  // Set-Cookie avec maxAge 0 + expires epoch : force le navigateur à supprimer
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}

export async function POST() {
  return buildClearResponse();
}

// GET /api/v1/auth/logout?next=/connexion → clear cookie + 303 redirect.
// Permet un lien direct cliquable (bypass boucle Safari quand Set-Cookie dans fetch n'est pas appliqué).
export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/connexion";
  return buildClearResponse(next);
}
