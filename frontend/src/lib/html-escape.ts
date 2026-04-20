export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Serialize data for safe inclusion in <script> JSON-LD.
 * Escapes `</script>` and U+2028/U+2029 to prevent script break-out XSS.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Sanitize HTML content stored in DB (admin-edited) for safe rendering.
 * Strips <script>, <iframe>, inline handlers (on*), javascript: URLs.
 * Keeps h1-h6, p, strong, em, ul, ol, li, a (with safe href), br.
 */
export function sanitizeAdminHtml(html: string): string {
  if (!html) return "";
  let cleaned = html
    // Supprimer les tags dangereux complets
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "");

  // Supprimer les event handlers inline (onclick, onerror, onload, etc.)
  cleaned = cleaned.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  // Supprimer les href/src en javascript:/data:/vbscript:
  cleaned = cleaned.replace(
    /\s+(href|src)\s*=\s*(?:"(?:\s*(?:javascript|data|vbscript):[^"]*)"|'(?:\s*(?:javascript|data|vbscript):[^']*)')/gi,
    "",
  );

  return cleaned;
}
