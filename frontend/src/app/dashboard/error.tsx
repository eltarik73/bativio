"use client";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh", padding: 32 }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#dc2626" }}>Une erreur est survenue</p>
        <p style={{ fontSize: 13, color: "#9C958D", marginTop: 8 }}>Veuillez r&eacute;essayer ou contacter le support.</p>
        <button onClick={reset} style={{ marginTop: 16, padding: "10px 20px", background: "#F7F5F2", borderRadius: 8, border: "none", fontSize: 13, color: "#5C4A3A", cursor: "pointer", fontWeight: 600 }}>
          R&eacute;essayer
        </button>
      </div>
    </div>
  );
}
