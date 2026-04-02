import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// In-memory IP rate limiter: max 10 requests per hour per IP
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Cleanup stale entries every hour to avoid memory leaks
let lastCleanup = Date.now();
function cleanupRateLimitMap() {
  const now = Date.now();
  if (now - lastCleanup < RATE_LIMIT_WINDOW_MS) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

function isRateLimited(ip: string): boolean {
  cleanupRateLimitMap();
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// Parse CLOUDINARY_URL  —  cloudinary://API_KEY:API_SECRET@CLOUD_NAME
// ---------------------------------------------------------------------------
function parseCloudinaryUrl(url: string) {
  const match = url.match(
    /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/
  );
  if (!match) return null;
  return {
    apiKey: match[1],
    apiSecret: match[2],
    cloudName: match[3],
  };
}

// ---------------------------------------------------------------------------
// POST /api/v1/upload/signature
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return apiError(
        "Trop de requêtes. Veuillez réessayer dans une heure.",
        429
      );
    }

    // Parse Cloudinary credentials from env
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    if (!cloudinaryUrl) {
      console.error("CLOUDINARY_URL is not configured");
      return apiError("Service de téléchargement indisponible", 500);
    }

    const creds = parseCloudinaryUrl(cloudinaryUrl);
    if (!creds) {
      console.error("CLOUDINARY_URL format invalid");
      return apiError("Service de téléchargement indisponible", 500);
    }

    const folder = "bativio/devis";
    const timestamp = Math.floor(Date.now() / 1000);

    // Build the string to sign: alphabetical params + api_secret
    // Cloudinary requires: all params (except file, api_key, resource_type,
    // cloud_name) sorted alphabetically, joined with &, then append api_secret.
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + creds.apiSecret)
      .digest("hex");

    return apiSuccess({
      signature,
      timestamp,
      cloudName: creds.cloudName,
      apiKey: creds.apiKey,
      folder,
    });
  } catch (error) {
    console.error("POST /api/v1/upload/signature error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
