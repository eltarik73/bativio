"use client";

import { useState } from "react";

const C: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", overflow: "hidden" };

const DOT: Record<string, string> = { NOUVEAU: "#C4531A", VU: "#E8A84C", REPONDU: "#22c55e", ARCHIVE: "#C5C0B9" };
const LABEL: Record<string, string> = { NOUVEAU: "Nouveau", VU: "En attente", REPONDU: "Trait\u00e9", ARCHIVE: "Archiv\u00e9" };

const mockDevis = [
  { id: "1", nom: "Sophie Martin", tel: "06 12 34 56 78", email: "sophie@mail.fr", desc: "Fuite sous \u00e9vier cuisine, eau qui coule en permanence. Urgence.", statut: "NOUVEAU", date: "Il y a 15 min" },
  { id: "2", nom: "Pierre Durand", tel: "06 23 45 67 89", email: "", desc: "R\u00e9novation compl\u00e8te salle de bains, douche italienne + double vasque", statut: "VU", date: "Hier" },
  { id: "3", nom: "Marie Leroy", tel: "06 34 56 78 90", email: "marie.l@mail.fr", desc: "Remplacement chauffe-eau \u00e9lectrique par thermodynamique", statut: "REPONDU", date: "22 mars" },
  { id: "4", nom: "Thomas Bernard", tel: "06 45 67 89 01", email: "t.bernard@mail.fr", desc: "Installation radiateurs salle de s\u00e9jour, 3 unit\u00e9s", statut: "ARCHIVE", date: "18 mars" },
];

export default function DevisPage() {
  const [filter, setFilter] = useState("TOUS");
  const filtered = filter === "TOUS" ? mockDevis : mockDevis.filter((d) => d.statut === filter);

  const pills = ["TOUS", "NOUVEAU", "VU", "REPONDU", "ARCHIVE"];

  const avgMinutes = 134; // 2h14 mock
  const avgHours = Math.floor(avgMinutes / 60);
  const avgMins = avgMinutes % 60;
  const gaugeColor = avgMinutes < 120 ? "#16a34a" : avgMinutes <= 360 ? "#E8A84C" : "#dc2626";
  const gaugeLabel = avgMinutes < 120 ? "Excellent" : avgMinutes <= 360 ? "Correct" : "A am\u00e9liorer";
  const gaugePercent = Math.min(100, (avgMinutes / 480) * 100);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Demandes de devis</h1>

      {/* Response time indicator */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", padding: "20px 24px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="20" height="20" fill="none" stroke={gaugeColor} strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E" }}>Votre temps de r&eacute;ponse moyen : <span style={{ color: gaugeColor }}>{avgHours}h{String(avgMins).padStart(2, "0")}</span></span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: `${gaugeColor}1A`, color: gaugeColor }}>{gaugeLabel}</span>
        </div>
        <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#EDEBE7", overflow: "hidden" }}>
          <div style={{ width: `${gaugePercent}%`, height: "100%", borderRadius: 3, background: gaugeColor, transition: "width .6s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: "#16a34a" }}>&lt; 2h</span>
          <span style={{ fontSize: 11, color: "#E8A84C" }}>2-6h</span>
          <span style={{ fontSize: 11, color: "#dc2626" }}>&gt; 6h</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto" }} className="hide-scroll">
        {pills.map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s", border: "none",
            background: filter === s ? "#1C1C1E" : "#fff",
            color: filter === s ? "#fff" : "#6B6560",
            ...(filter !== s ? { border: "1.5px solid #E0DDD8" } : {}),
          }}>
            {s === "TOUS" ? "Tous" : LABEL[s] || s}
            {s === "NOUVEAU" && <span style={{ marginLeft: 6, width: 6, height: 6, borderRadius: "50%", background: "#C4531A", display: "inline-block" }} />}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((d) => {
            const isNew = d.statut === "NOUVEAU";
            return (
              <div key={d.id} style={{ ...C, padding: "20px 24px", transition: "all .25s cubic-bezier(.22,1,.36,1)", cursor: "pointer", ...(isNew ? { borderColor: "#C4531A", borderWidth: "1.5px" } : {}) }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  {/* Dot + info */}
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: DOT[d.statut], flexShrink: 0, marginTop: 6, ...(isNew ? { animation: "pulse 1.5s infinite" } : {}) }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E" }}>{d.nom}</span>
                      {isNew && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "rgba(196,83,26,.08)", color: "#C4531A" }}>Nouveau !</span>}
                      <span style={{ fontSize: 12, color: "#C5C0B9", marginLeft: "auto", flexShrink: 0 }}>{d.date}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{d.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                      <a href={`tel:${d.tel.replace(/\s/g, "")}`} style={{ height: 36, padding: "0 16px", borderRadius: 8, background: "#C4531A", color: "#fff", fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", transition: "all .15s" }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                        Appeler
                      </a>
                      <span style={{ fontSize: 13, color: "#9B9590" }}>{d.tel}</span>
                      {d.email && <span style={{ fontSize: 13, color: "#9B9590" }}>&middot; {d.email}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "56px 20px" }}>
          <svg width="56" height="56" fill="none" stroke="#E0DDD8" strokeWidth="1" viewBox="0 0 24 24" style={{ margin: "0 auto 16px" }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></svg>
          <p style={{ fontSize: 15, color: "#9B9590" }}>Aucune demande de devis</p>
          <p style={{ fontSize: 13, color: "#C5C0B9", marginTop: 4 }}>Les nouvelles demandes appara&icirc;tront ici.</p>
        </div>
      )}
    </div>
  );
}
