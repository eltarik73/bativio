import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { sanitizeAdminHtml } from "../src/lib/html-escape";

describe("sanitizeAdminHtml — XSS attack vectors", () => {
  it("strips <script> tags", () => {
    const out = sanitizeAdminHtml("<p>hi<script>alert(1)</script></p>");
    assert.match(out, /<p>hi/);
    assert.doesNotMatch(out, /<script/i);
  });

  it("strips <iframe>", () => {
    const out = sanitizeAdminHtml('<iframe src="evil"></iframe>');
    assert.doesNotMatch(out, /<iframe/i);
  });

  it("strips <svg> (can host onload, foreignObject, animate)", () => {
    const out = sanitizeAdminHtml('<svg onload="alert(1)"><script>x</script></svg>');
    assert.doesNotMatch(out, /<svg/i);
    assert.doesNotMatch(out, /<script/i);
    assert.doesNotMatch(out, /onload/i);
  });

  it("strips <img onerror=...>", () => {
    const out = sanitizeAdminHtml('<img src="x" onerror="alert(1)">');
    assert.doesNotMatch(out, /<img/i);
    assert.doesNotMatch(out, /onerror/i);
  });

  it("strips <meta http-equiv=refresh>", () => {
    const out = sanitizeAdminHtml('<meta http-equiv="refresh" content="0;url=javascript:alert(1)">');
    assert.doesNotMatch(out, /<meta/i);
    assert.doesNotMatch(out, /javascript:/i);
  });

  it("strips inline event handlers on allowed tags", () => {
    const out = sanitizeAdminHtml('<a href="https://x" onclick="alert(1)">x</a>');
    assert.doesNotMatch(out, /onclick/i);
    assert.match(out, /href="https:\/\/x"/);
  });

  it("rejects javascript: hrefs", () => {
    const out = sanitizeAdminHtml('<a href="javascript:alert(1)">x</a>');
    assert.doesNotMatch(out, /javascript:/i);
    // The <a> tag stays but without the bad href
    assert.match(out, /<a>x<\/a>/);
  });

  it("rejects data:text/html hrefs", () => {
    const out = sanitizeAdminHtml('<a href="data:text/html,<script>alert(1)</script>">x</a>');
    assert.doesNotMatch(out, /data:/i);
    assert.doesNotMatch(out, /<script/i);
  });

  it("rejects vbscript: hrefs", () => {
    const out = sanitizeAdminHtml('<a href="vbscript:msgbox(1)">x</a>');
    assert.doesNotMatch(out, /vbscript:/i);
  });

  it("strips <style> blocks (can host @import javascript:)", () => {
    const out = sanitizeAdminHtml('<style>@import "javascript:alert(1)";</style>');
    assert.doesNotMatch(out, /<style/i);
  });

  it("strips <object> and <embed>", () => {
    const out1 = sanitizeAdminHtml('<object data="evil.swf"></object>');
    const out2 = sanitizeAdminHtml('<embed src="evil.swf">');
    assert.doesNotMatch(out1, /<object/i);
    assert.doesNotMatch(out2, /<embed/i);
  });

  it("strips HTML comments (can hide payloads)", () => {
    const out = sanitizeAdminHtml("<!-- <script>alert(1)</script> -->");
    assert.doesNotMatch(out, /<script/i);
    assert.doesNotMatch(out, /<!--/);
  });

  it("strips CDATA sections", () => {
    const out = sanitizeAdminHtml("<![CDATA[<script>alert(1)</script>]]>");
    assert.doesNotMatch(out, /<script/i);
  });

  it("preserves allowlist tags + safe attrs", () => {
    const html = '<h2>Titre</h2><p>Texte <strong>gras</strong> <a href="https://bativio.fr" target="_blank">lien</a></p>';
    const out = sanitizeAdminHtml(html);
    assert.match(out, /<h2>Titre<\/h2>/);
    assert.match(out, /<strong>gras<\/strong>/);
    assert.match(out, /href="https:\/\/bativio\.fr"/);
    assert.match(out, /target="_blank"/);
  });

  it("rejects target values other than _blank/_self", () => {
    const out = sanitizeAdminHtml('<a href="https://x" target="javascript:alert(1)">x</a>');
    assert.doesNotMatch(out, /target=/);
  });

  it("strips disallowed attributes on allowed tags", () => {
    const out = sanitizeAdminHtml('<p style="background:url(javascript:alert(1))">x</p>');
    // <p> is allowed but style is not in its attr allowlist
    assert.match(out, /<p>x<\/p>/);
  });

  it("preserves unicode and accented text", () => {
    const out = sanitizeAdminHtml("<p>Plombier à Chambéry — œuvre & travaux</p>");
    assert.match(out, /Chambéry/);
    assert.match(out, /œuvre/);
  });

  it("keeps mailto: and tel: hrefs (safe protocols)", () => {
    const out = sanitizeAdminHtml('<a href="mailto:contact@bativio.fr">mail</a><a href="tel:+33123">tel</a>');
    assert.match(out, /mailto:contact/);
    assert.match(out, /tel:\+33123/);
  });

  it("handles nested attack: <p><script>...</script></p>", () => {
    const out = sanitizeAdminHtml("<p>before<script>alert(1)</script>after</p>");
    assert.match(out, /<p>before/);
    assert.match(out, /after<\/p>/);
    assert.doesNotMatch(out, /<script/i);
  });

  it("never returns the literal string 'javascript:'", () => {
    // common bypass: capital letters, mixed case
    const variants = [
      "JavaScript:alert(1)",
      "JAVASCRIPT:alert(1)",
      "Java\tscript:alert(1)",
    ];
    for (const v of variants) {
      const out = sanitizeAdminHtml(`<a href="${v}">x</a>`);
      assert.doesNotMatch(out, /javascript/i, `Failed on input: ${v}`);
    }
  });

  it("returns empty string on empty input", () => {
    assert.equal(sanitizeAdminHtml(""), "");
  });
});
