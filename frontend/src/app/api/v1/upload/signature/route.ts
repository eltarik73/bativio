import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { rateLimitUpload, getClientIp } from "@/lib/rate-limit";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Parse CLOUDINARY_URL  —  cloudinary://API_KEY:API_SECRET@CLOUD_NAME
// ---------------------------------------------------------------------------
function parseCloudinaryUrl(url: string) {
  const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!match) return null;
  return { apiKey: match[1], apiSecret: match[2], cloudName: match[3] };
}

/**
 * Cloudinary signed upload — endpoint public.
 *
 * SÉCURITÉ DURCIE :
 * - Rate-limit Upstash Redis (20 req/IP/h)
 * - Signature contrainte : allowed_formats, max_file_size, transformation
 *   forcée pour empêcher upload arbitraire (vidéo 100 MB, raw, PDF...)
 * - Folder dédié + timestamp pour limiter la fenêtre de validité
 *
 * Si l'attaquant tente d'uploader autre chose que image jpg/png/webp <10 MB,
 * Cloudinary REJETTE car la signature ne match pas (les params font partie
 * de la string-to-sign).
 */
export async function POST(request: NextRequest) {
  try {
    // SÉCU: rate-limit Upstash (fallback in-memory dev)
    const ip = getClientIp(request);
    const limit = await rateLimitUpload(ip);
    if (!limit.success) {
      return apiError(
        `Trop de requêtes upload. Réessayez après ${new Date(limit.reset).toLocaleTimeString("fr-FR")}.`,
        429,
      );
    }

    // Parse Cloudinary credentials
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

    // SÉCU CONTRAINTES UPLOAD :
    // - allowed_formats : jpg, png, webp, heic uniquement (pas vidéo, pas PDF, pas raw)
    // - max_file_size : 10 MB
    // - transformation : auto-quality + auto-format + max-width 2000px (compression server-side)
    const allowedFormats = "jpg,png,webp,heic";
    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    const transformation = "q_auto,f_auto,w_2000,c_limit";

    // Cloudinary string-to-sign : params alphabétiques, joints &, + api_secret
    const paramsToSign = `allowed_formats=${allowedFormats}&folder=${folder}&max_file_size=${maxFileSize}&timestamp=${timestamp}&transformation=${transformation}`;
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
      // Contraintes à renvoyer côté client (sinon signature rejetée par Cloudinary)
      allowedFormats,
      maxFileSize,
      transformation,
    });
  } catch (error) {
    console.error("POST /api/v1/upload/signature error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
