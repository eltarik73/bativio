"use client";

import { useState } from "react";

export default function NewsletterFooter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMsg("");
    try {
      const res = await fetch("/api/v1/public/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const json = await res.json();
      if (json.success) {
        setState("success");
        setMsg("Merci, à bientôt.");
        setEmail("");
      } else {
        setState("error");
        setMsg(json.error || "Erreur. Réessayez.");
      }
    } catch {
      setState("error");
      setMsg("Erreur réseau.");
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginBottom: 4 }}>
        Newsletter Bativio · 1 email/mois · résiliable en 1 clic
      </p>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre.email@exemple.fr"
          aria-label="Email pour newsletter"
          disabled={state === "loading" || state === "success"}
          style={{
            flex: 1,
            minWidth: 0,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,.15)",
            background: "rgba(255,255,255,.06)",
            color: "#fff",
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={state === "loading" || state === "success" || !email}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            background: state === "success" ? "#22c55e" : "var(--terre,#C4531A)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: state === "loading" ? "wait" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {state === "loading" ? "…" : state === "success" ? "✓" : "S'inscrire"}
        </button>
      </div>
      {msg && (
        <p
          style={{
            fontSize: 12,
            color: state === "error" ? "#fca5a5" : "rgba(255,255,255,.7)",
            margin: 0,
          }}
          role={state === "error" ? "alert" : "status"}
        >
          {msg}
        </p>
      )}
    </form>
  );
}
