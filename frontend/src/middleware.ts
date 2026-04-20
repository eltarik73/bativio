import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET obligatoire en production");
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
  const { pathname } = req.nextUrl;

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
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/v1/artisans/:path*",
    "/api/v1/admin/:path*",
    "/connexion",
    "/inscription",
  ],
};
