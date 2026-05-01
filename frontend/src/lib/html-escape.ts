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
 *
 * Strategy = blocklist + tag whitelist. Anything outside the whitelist gets
 * HTML-escaped so it appears as text instead of being parsed as markup.
 *
 * The whitelist matches what the WYSIWYG editor actually emits (h1-h6, p,
 * strong, em, ul, ol, li, br, a). It's intentionally narrow — admins don't
 * need <table>, <form>, <video>, etc. for SEO copy.
 *
 * For richer needs, swap this for `isomorphic-dompurify` and a configured
 * allowlist. The current implementation is good enough for the single
 * admin-edited surface in the app today (Ville.contenuSeo).
 */
const ALLOWED_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "strong", "em", "u", "b", "i",
  "ul", "ol", "li",
  "br", "hr",
  "a",
  "blockquote", "code", "pre",
  "span", "div",
]);

// Tags whose content can be active (script, style, srcdoc-like) or whose mere
// presence in the DOM is risky (svg/math allow embedded scripts and CSS).
// We drop both the tag *and* its contents — escaping isn't enough because
// readers might still grep for things like `onload=` and assume risk.
const DANGEROUS_TAGS = new Set([
  "script", "style", "iframe", "object", "embed", "noscript",
  "svg", "math", "img", "video", "audio", "source", "track",
  "meta", "link", "base", "form", "input", "textarea", "select", "button",
]);

const ALLOWED_ATTRS_BY_TAG: Record<string, Set<string>> = {
  a: new Set(["href", "title", "rel", "target"]),
  span: new Set(["class"]),
  div: new Set(["class"]),
};

const SAFE_PROTOCOLS = /^(https?:|mailto:|tel:|\/|#)/i;

function sanitizeAttrs(tag: string, attrs: string): string {
  const allowed = ALLOWED_ATTRS_BY_TAG[tag];
  if (!allowed) return "";
  // Match `name="value"` or `name='value'` — name is ASCII letters / dash.
  const re = /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*("([^"]*)"|'([^']*)')/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrs)) !== null) {
    const name = m[1].toLowerCase();
    if (!allowed.has(name)) continue;
    const raw = (m[3] ?? m[4] ?? "").trim();
    // Drop href/src that don't have a known-safe protocol — kills
    // javascript:, data:, vbscript:, and any obscure scheme variants.
    if ((name === "href" || name === "src") && !SAFE_PROTOCOLS.test(raw)) continue;
    if (name === "target" && raw !== "_blank" && raw !== "_self") continue;
    out.push(`${name}="${escapeHtml(raw)}"`);
  }
  return out.length ? " " + out.join(" ") : "";
}

// Strip "<tag ...>...</tag>" entirely (including nested content) for the
// dangerous-tag set. Greedy enough to handle the common case; for nested
// dangerous-in-dangerous, the outer strip catches everything.
function stripDangerousBlocks(html: string): string {
  let out = html;
  for (const tag of DANGEROUS_TAGS) {
    // Self-closing variants and void elements (img, meta, link, etc.)
    out = out.replace(new RegExp(`<${tag}\\b[^>]*/?>`, "gi"), "");
    // Paired blocks (script, style, iframe, svg, …)
    out = out.replace(new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, "gi"), "");
  }
  return out;
}

export function sanitizeAdminHtml(html: string): string {
  if (!html) return "";

  // Pass 1: rip out anything in the dangerous-tag set (script, style, svg, …)
  // along with its contents. This makes it impossible for an attribute like
  // `onload=` or a `javascript:` URL inside one of these tags to survive into
  // the output even as escaped text.
  const stripped = stripDangerousBlocks(html);

  // Pass 2: walk what's left. Emit whitelisted tags with vetted attrs; escape
  // anything else (unknown tags, comments, CDATA, processing instructions).
  const TOKEN_RE = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>|[^<]+/g;
  let out = "";
  let m: RegExpExecArray | null;
  while ((m = TOKEN_RE.exec(stripped)) !== null) {
    const token = m[0];
    if (token.startsWith("<!--") || token.startsWith("<![CDATA[") || token.startsWith("<?")) {
      continue;
    }
    if (m[1]) {
      const tag = m[1].toLowerCase();
      const attrs = m[2] ?? "";
      const isClosing = token.startsWith("</");
      if (!ALLOWED_TAGS.has(tag)) {
        out += escapeHtml(token);
        continue;
      }
      out += isClosing ? `</${tag}>` : `<${tag}${sanitizeAttrs(tag, attrs)}>`;
    } else {
      out += token;
    }
  }
  return out;
}
