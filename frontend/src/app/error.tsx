"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: 32 }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <p style={{ fontFamily: "'Fraunces',serif", fontSize: 64, fontWeight: 700, color: "rgba(196,83,26,.15)", lineHeight: 1 }}>500</p>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#3D2E1F", marginTop: 12 }}>Une erreur est survenue</h1>
        <p style={{ fontSize: 14, color: "#9C958D", marginTop: 8 }}>Nous nous en occupons. Veuillez r&eacute;essayer.</p>
        <button onClick={reset} style={{ marginTop: 20, padding: "10px 24px", background: "#C4531A", color: "#fff", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          R&eacute;essayer
        </button>
      </div>
    </main>
  );
}
