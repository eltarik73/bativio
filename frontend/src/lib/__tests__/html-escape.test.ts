import { describe, expect, it } from "vitest";
import { escapeHtml, safeJsonLd, sanitizeAdminHtml } from "../html-escape";

describe("escapeHtml", () => {
  it("escapes HTML metacharacters", () => {
    expect(escapeHtml('<script>alert("XSS")</script>')).toBe(
      "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;",
    );
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("L'apostrophe")).toBe("L&#39;apostrophe");
  });

  it("escapes ampersand first to avoid double encoding", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
    expect(escapeHtml("&amp;")).toBe("&amp;amp;"); // intentional re-encoding
  });

  it("returns empty string on null / undefined", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });

  it("coerces non-strings to string", () => {
    expect(escapeHtml(42)).toBe("42");
    expect(escapeHtml(true)).toBe("true");
  });

  it("preserves accents and unicode", () => {
    expect(escapeHtml("é à ç ô")).toBe("é à ç ô");
    expect(escapeHtml("日本語")).toBe("日本語");
  });
});

describe("safeJsonLd", () => {
  it("escapes </script> close tag (XSS break-out)", () => {
    const json = safeJsonLd({ x: "</script><img src=x onerror=alert(1)>" });
    expect(json).not.toContain("</script>");
    expect(json).toContain("\\u003c/script\\u003e");
  });

  it("escapes < and > generically", () => {
    expect(safeJsonLd({ x: "<b>hi</b>" })).toContain("\\u003cb\\u003e");
  });

  it("escapes ampersand for HTML safety", () => {
    expect(safeJsonLd({ x: "a&b" })).toContain("\\u0026");
  });

  it("escapes U+2028 / U+2029 line separators (JS hazard)", () => {
    expect(safeJsonLd({ x: "line1 line2" })).toContain("\\u2028");
    expect(safeJsonLd({ x: "para1 para2" })).toContain("\\u2029");
  });

  it("produces valid JSON parseable after un-escape", () => {
    const obj = { name: "Bativio", founded: 2025 };
    const escaped = safeJsonLd(obj);
    // The browser HTML parser will decode < etc back to <, then JSON.parse
    expect(JSON.parse(escaped)).toEqual(obj);
  });
});

describe("sanitizeAdminHtml", () => {
  it("strips <script> tags entirely", () => {
    expect(sanitizeAdminHtml("<p>ok</p><script>alert(1)</script>")).toBe(
      "<p>ok</p>",
    );
  });

  it("strips <iframe> tags", () => {
    expect(
      sanitizeAdminHtml('<p>ok</p><iframe src="evil.com"></iframe>'),
    ).toBe("<p>ok</p>");
  });

  it("strips <style> blocks", () => {
    expect(sanitizeAdminHtml("<p>ok</p><style>body{display:none}</style>")).toBe(
      "<p>ok</p>",
    );
  });

  it("strips inline event handlers (onerror, onclick, onload)", () => {
    expect(sanitizeAdminHtml('<img src=x onerror="alert(1)">')).toBe(
      "<img src=x>",
    );
    expect(sanitizeAdminHtml('<a onclick="alert(1)">x</a>')).toBe("<a>x</a>");
    expect(sanitizeAdminHtml('<body onload=alert(1)>')).toBe("<body>");
  });

  it("strips javascript: URLs in href/src", () => {
    expect(sanitizeAdminHtml('<a href="javascript:alert(1)">x</a>')).toBe(
      "<a>x</a>",
    );
    expect(sanitizeAdminHtml('<a href="JavaScript:alert(1)">x</a>')).toBe(
      "<a>x</a>",
    );
  });

  it("strips data: and vbscript: URLs", () => {
    expect(
      sanitizeAdminHtml('<a href="data:text/html,<script>alert(1)</script>">x</a>'),
    ).toBe("<a>x</a>");
    expect(sanitizeAdminHtml('<a href="vbscript:msgbox(1)">x</a>')).toBe("<a>x</a>");
  });

  it("preserves safe tags h1-h6, p, ul, ol, li, strong, em, br", () => {
    const safe = "<h2>Titre</h2><p><strong>Gras</strong> et <em>italique</em></p><ul><li>Item</li></ul>";
    expect(sanitizeAdminHtml(safe)).toBe(safe);
  });

  it("returns empty string on falsy input", () => {
    expect(sanitizeAdminHtml("")).toBe("");
  });
});
