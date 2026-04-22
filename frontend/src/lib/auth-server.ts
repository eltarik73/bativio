import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("JWT_SECRET obligatoire (fallback accepté uniquement en NODE_ENV=development)");
  }
  console.warn("⚠️ auth-server: JWT_SECRET absent — fallback dev utilisé");
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-in-production");
const COOKIE_NAME = "bativio-session";

export async function createToken(userId: string, role: string) {
  return new SignJWT({ sub: userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { sub: string; role: string; exp: number };
  } catch {
    return null;
  }
}

export async function setAuthCookie(userId: string, role: string) {
  const token = await createToken(userId, role);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  return { userId: payload.sub, role: payload.role };
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.role !== "ADMIN") throw new Error("FORBIDDEN");
  return session;
}

/**
 * Require authenticated artisan with a specific plan feature.
 * Throws UNAUTHORIZED, ARTISAN_NOT_FOUND, or PLAN_REQUIRED:{feature}.
 */
export async function requireFeature(feature: import("@/lib/plans").FeatureKey) {
  const session = await requireAuth();
  const { prisma } = await import("@/lib/prisma");
  const { hasFeature } = await import("@/lib/plans");
  const { getEffectivePlan } = await import("@/lib/plan-gates");

  const artisan = await prisma.artisan.findUnique({
    where: { userId: session.userId },
  });
  if (!artisan) throw new Error("ARTISAN_NOT_FOUND");

  // Use effective plan (max of Stripe plan and admin override)
  const effectivePlan = getEffectivePlan(artisan);
  const plan = effectivePlan.toUpperCase() as import("@/lib/plans").PlanType;
  if (!hasFeature(plan, feature)) {
    throw new Error(`PLAN_REQUIRED:${feature}`);
  }

  return { session, artisan, plan };
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
