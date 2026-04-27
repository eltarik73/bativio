import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET obligatoire en production");
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-in-production");
const COOKIE_NAME = "bativio-session";

// Whitelist des routes top-level reconnues (statiques + dossiers réservés).
// Tout slug single-segment qui n'est PAS dans cette liste, ni une ville Bativio,
// ni un format métier-ville composite (ex: "plombier-lyon"), retourne HTTP 404.
//
// Critique SEO 2026 : empêche le soft-404 (Google détecte mais déprécie l'autorité)
// et bloque le duplicate content cross-slug.
const RESERVED_TOP_PATHS = new Set([
  "", // home
  "a-propos",
  "admin", // /admin (back-office) + /admin/*
  "annuaire",
  "artisan",
  "auth", // /auth/magic
  "cgu",
  "connexion",
  "d", // /d/[token] — partage devis privé
  "dashboard",
  "demande",
  "demo",
  "demo-a",
  "demo-b",
  "demo-c",
  "demo-light",
  "devis",
  "facturation-electronique",
  "favicon.ico",
  "icons",
  "inscription",
  "magic-link",
  "manifest.json",
  "mentions-legales",
  "mot-de-passe-oublie",
  "onboarding",
  "prix",
  "rejoindre",
  "reinitialiser-mot-de-passe",
  "robots.txt",
  "sitemap.xml",
  "tarifs",
  "travaux",
  "videos",
  "_next",
]);

// Villes Bativio (synchro avec lib/constants.ts VILLES + VILLES_SECONDAIRES).
// Hardcoded ici car middleware Edge Runtime ne peut pas importer Prisma/big modules.
// HUB_VILLES (5) : pages /[ville] avec annuaire complet (autorite SEO max)
// ALL_VILLES_SLUGS (35) : utilisees pour valider /[metier]-[ville] (long tail SEO)

// HUB only : ces villes ont leur propre page /[ville] (annuaire). Le slug single = whitelist.
const KNOWN_VILLES = new Set(["chambery", "annecy", "grenoble", "lyon", "valence"]);

// HUB + secondaires : utilisees uniquement pour valider les slugs /[metier]-[ville]
// (ex: /electricien-aix-les-bains, /plombier-saint-jean-de-maurienne).
// /aix-les-bains tout seul reste un 404 propre car aucune page d'annuaire n'existe.
const ALL_VILLES_SLUGS = new Set([
  "chambery", "annecy", "grenoble", "lyon", "valence",
  // Savoie
  "aix-les-bains", "albertville", "saint-jean-de-maurienne", "challes-les-eaux",
  "bourg-saint-maurice", "la-motte-servolex", "cognin",
  "pont-de-beauvoisin", "la-bridoire", "yenne", "les-echelles", "novalaise",
  // Haute-Savoie
  "annemasse", "thonon-les-bains", "cluses", "sallanches",
  "evian-les-bains", "rumilly", "la-roche-sur-foron",
  // Isere
  "echirolles", "saint-martin-d-heres", "voiron", "bourgoin-jallieu", "vienne", "meylan",
  // Rhone
  "villeurbanne", "venissieux", "caluire-et-cuire", "bron", "saint-priest", "vaulx-en-velin",
  // Drome
  "romans-sur-isere", "montelimar", "bourg-les-valence", "pierrelatte",
]);

const VALID_METIER_PREFIXES = [
  "plombier", "electricien", "peintre", "macon", "carreleur",
  "menuisier", "couvreur", "chauffagiste", "serrurier", "cuisiniste",
  "reparation-mobile",
];

/**
 * True si le slug single-segment correspond à un format métier-ville reconnu
 * (ex: "plombier-lyon", "electricien-aix-les-bains", "plombier-saint-jean-de-maurienne").
 *
 * Optimisation : on iter sur les prefixes metier (court) plutot que sur les villes
 * pour gerer les villes a slug compose (saint-jean-de-maurienne, etc.).
 */
function isMetierVilleSlug(slug: string): boolean {
  for (const metier of VALID_METIER_PREFIXES) {
    if (slug.startsWith(metier + "-")) {
      const ville = slug.slice(metier.length + 1);
      if (ALL_VILLES_SLUGS.has(ville)) return true;
    }
  }
  return false;
}

// Hubs SEO geographiques : /artisans-{ville|departement|region}.
// Ex: /artisans-chambery, /artisans-savoie, /artisans-rhone-alpes
const ARTISANS_HUB_VALID_SUFFIXES = new Set([
  ...ALL_VILLES_SLUGS,
  "savoie", "haute-savoie", "isere", "rhone", "drome", // departements couverts
  "rhone-alpes", // region
]);

function isArtisansHubSlug(slug: string): boolean {
  if (!slug.startsWith("artisans-")) return false;
  const suffix = slug.slice("artisans-".length);
  return ARTISANS_HUB_VALID_SUFFIXES.has(suffix);
}

async function verify(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { sub: string; role: string };
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
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

  // SEO 404: bloque les slugs single-segment non whitelistés.
  // /lyon, /a-propos, /tarifs, /chambery → OK (whitelisted)
  // /cgv, /contact, /random → 404 propre (HTTP 404 + page not-found)
  // Pas de match pour multi-segment (/lyon/test-plombier-lyon, etc.) — géré par les routes elles-mêmes.
  // Pas de match pour fichiers (.css, .png, ...) — déjà filtrés.
  if (!pathname.startsWith("/api/") && !pathname.startsWith("/_next/")) {
    const segments = pathname.replace(/^\/+|\/+$/g, "").split("/");
    if (segments.length === 1 && segments[0] !== "") {
      const slug = segments[0];
      const isFile = /\.[a-z0-9]{2,5}$/i.test(slug);
      const isReserved = RESERVED_TOP_PATHS.has(slug);
      const isVille = KNOWN_VILLES.has(slug);
      const isMetierVille = isMetierVilleSlug(slug);
      const isArtisansHub = isArtisansHubSlug(slug);
      if (!isFile && !isReserved && !isVille && !isMetierVille && !isArtisansHub) {
        // Re-route vers la page 404 native Next pour HTTP 404 propre.
        // On utilise rewrite vers /not-found pour que Next sache que c'est un 404.
        const url = req.nextUrl.clone();
        url.pathname = `/_not-found-${slug}`; // forcera le route handler 404
        return NextResponse.rewrite(url, { status: 404 });
      }
    }
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
