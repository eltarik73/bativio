const C: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", padding: 20 };

const stats = [
  { label: "Vues totales", value: "2 847", trend: "+12%", color: "#1C1C1E" },
  { label: "Demandes de devis", value: "156", trend: "+8%", color: "#C4531A" },
  { label: "Taux de conversion", value: "5.5%", trend: "+0.3%", color: "#E8A84C" },
  { label: "Artisans actifs", value: "5", trend: "+2", color: "#22c55e" },
];

const topArtisans = [
  { nom: "Martin Plomberie", devis: 47, vues: 834 },
  { nom: "Alpes Ma\u00e7onnerie", devis: 38, vues: 712 },
  { nom: "\u00c9lec Savoie", devis: 32, vues: 567 },
  { nom: "Dupont Peinture", devis: 21, vues: 423 },
  { nom: "Savoie Carrelage", devis: 18, vues: 311 },
];

const topTravaux = [
  { nom: "R\u00e9novation salle de bain", recherches: 234 },
  { nom: "D\u00e9pannage plomberie", recherches: 189 },
  { nom: "Peinture int\u00e9rieure", recherches: 156 },
  { nom: "Mise aux normes \u00e9lectriques", recherches: 134 },
  { nom: "Installation PAC", recherches: 98 },
];

export default function StatistiquesPage() {
  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Statistiques</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} style={C}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#22c55e", background: "rgba(34,197,94,.08)", padding: "2px 8px", borderRadius: 4 }}>{s.trend}</span>
            </div>
            <p style={{ fontSize: 13, color: "#9B9590", marginTop: 6 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Top artisans */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #EDEBE7" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#1C1C1E" }}>Top artisans</span>
          </div>
          {topArtisans.map((a, i) => (
            <div key={a.nom} style={{ padding: "12px 20px", borderBottom: "1px solid #F7F5F2", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: i < 3 ? "#C4531A" : "#EDEBE7", color: i < 3 ? "#fff" : "#9B9590", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{a.nom}</span>
              <span style={{ fontSize: 13, color: "#C4531A", fontWeight: 600 }}>{a.devis} devis</span>
              <span style={{ fontSize: 12, color: "#C5C0B9" }}>{a.vues} vues</span>
            </div>
          ))}
        </div>

        {/* Top travaux */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #EDEBE7" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#1C1C1E" }}>Top types de travaux</span>
          </div>
          {topTravaux.map((t, i) => (
            <div key={t.nom} style={{ padding: "12px 20px", borderBottom: "1px solid #F7F5F2", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: i < 3 ? "#E8A84C" : "#EDEBE7", color: i < 3 ? "#fff" : "#9B9590", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{t.nom}</span>
              <span style={{ fontSize: 13, color: "#9B9590" }}>{t.recherches} recherches</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
