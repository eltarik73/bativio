"use client";

import { METIERS } from "@/lib/constants";

export default function AdminMetiersPage() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E" }}>Métiers</h1>
        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", transition: "background .15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#D4733A"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#C4531A"; }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          Ajouter un métier
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", overflow: "hidden", boxShadow: "0 2px 12px rgba(28,28,30,.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F5F2", borderBottom: "1px solid #EDEBE7" }}>
              <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5, width: 80 }}>Icône</th>
              <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Nom</th>
              <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Slug</th>
              <th style={{ padding: "14px 20px", width: 120 }}></th>
            </tr>
          </thead>
          <tbody>
            {METIERS.map((m, idx) => (
              <tr key={m.slug} style={{ borderBottom: idx < METIERS.length - 1 ? "1px solid #F7F5F2" : "none", background: idx % 2 === 1 ? "#FAF8F5" : "#fff", transition: "background .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F7F5F2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 1 ? "#FAF8F5" : "#fff"; }}
              >
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: "rgba(196,83,26,.06)", fontSize: 22 }}>{m.icone}</span>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{m.nom}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#9B9590", fontFamily: "monospace" }}>{m.slug}</td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>
                  <button style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #E0DDD8", background: "#fff", fontSize: 12, fontWeight: 600, color: "#6B6560", cursor: "pointer", transition: "all .15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C4531A"; e.currentTarget.style.color = "#C4531A"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E0DDD8"; e.currentTarget.style.color = "#6B6560"; }}
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
