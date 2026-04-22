import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("JWT_SECRET obligatoire (fallback accepté uniquement en NODE_ENV=development)");
  }
  console.warn("⚠️ middleware: JWT_SECRET absent — fallback dev utilisé");
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-in-production");
const COOKIE_NAME = "bativio-session";

async function verify(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { sub: string; role: string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const { pathname, search } = req.nextUrl;

  // SEO: 308 redirect uppercase URLs vers lowercase (anti duplicate content)
  // Exclut /api/, /_next/, /icons/, fichiers .ico/.png/.svg/.txt/.xml
  if (
    pathname !== pathname.toLowerCase() &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/_next/") &&
    !pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|avif|txt|xml|json|css|js|woff2?)$/i)
  ) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }

  // Dashboard routes — require auth
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/v1/artisans")) {
    if (!token) {
      return pathname.startsWith("/api/")
        ? NextResponse.json({ success: false, error: "Non autorise" }, { status: 401 })
        : NextResponse.redirect(new URL("/connexion", req.url));
    }
    const payload = await verify(token);
    if (!payload) {
      const res = pathname.startsWith("/api/")
        ? NextResponse.json({ success: false, error: "Session expiree" }, { status: 401 })
        : NextResponse.redirect(new URL("/connexion", req.url));
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
  }

  // Admin routes — require ADMIN role
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/v1/admin")) {
    if (!token) {
      return pathname.startsWith("/api/")
        ? NextResponse.json({ success: false, error: "Non autorise" }, { status: 401 })
        : NextResponse.redirect(new URL("/connexion", req.url));
    }
    const payload = await verify(token);
    if (!payload || payload.role !== "ADMIN") {
      return pathname.startsWith("/api/")
        ? NextResponse.json({ success: false, error: "Acces refuse" }, { status: 403 })
        : NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Redirect logged-in users away from login/register
  if (pathname === "/connexion" || pathname === "/inscription") {
    if (token) {
      const payload = await verify(token);
      if (payload) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Auth-protected
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/v1/artisans/:path*",
    "/api/v1/admin/:path*",
    "/connexion",
    "/inscription",
    // SEO: catch ALL pages publiques pour normaliser uppercase → lowercase
    // Exclut _next/, api/, fichiers statiques (gérés inline)
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|icons/|videos/).*)",
  ],
};
