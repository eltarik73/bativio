const C: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", overflow: "hidden" };

const subs = [
  { nom: "Martin Plomberie", plan: "Pro", prix: "49\u20AC", statut: "Actif", date: "15/03/2026" },
  { nom: "\u00c9lec Savoie", plan: "Essentiel", prix: "19\u20AC", statut: "Actif", date: "16/03/2026" },
  { nom: "Dupont Peinture", plan: "Gratuit", prix: "0\u20AC", statut: "Gratuit", date: "17/03/2026" },
  { nom: "Alpes Ma\u00e7onnerie", plan: "Pro+", prix: "79\u20AC", statut: "Actif", date: "18/03/2026" },
  { nom: "Savoie Carrelage", plan: "Essentiel", prix: "19\u20AC", statut: "Actif", date: "19/03/2026" },
];

export default function AbonnementsPage() {
  const mrr = subs.reduce((s, a) => s + parseInt(a.prix), 0);
  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Abonnements</h1>
      {/* MRR */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ ...C, padding: 20 }}><div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "#1C1C1E" }}>{mrr}\u20AC</div><div style={{ fontSize: 13, color: "#9B9590", marginTop: 4 }}>MRR total</div></div>
        <div style={{ ...C, padding: 20 }}><div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "#22c55e" }}>4</div><div style={{ fontSize: 13, color: "#9B9590", marginTop: 4 }}>Abonn\u00e9s payants</div></div>
        <div style={{ ...C, padding: 20 }}><div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "#E8A84C" }}>1</div><div style={{ fontSize: 13, color: "#9B9590", marginTop: 4 }}>Plan gratuit</div></div>
      </div>
      <div style={C}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid #EDEBE7" }}>
            {["Artisan", "Plan", "Prix", "Statut", "Depuis"].map((h) => <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontSize: 12, fontWeight: 600, color: "#9B9590", textTransform: "uppercase" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.nom} style={{ borderBottom: "1px solid #F7F5F2" }}>
                <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{s.nom}</td>
                <td style={{ padding: "14px 20px" }}><span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: s.plan === "Pro" ? "rgba(196,83,26,.08)" : s.plan === "Pro+" ? "rgba(28,28,30,.06)" : s.plan === "Essentiel" ? "rgba(232,168,76,.1)" : "#F7F5F2", color: s.plan === "Pro" ? "#C4531A" : s.plan === "Pro+" ? "#1C1C1E" : s.plan === "Essentiel" ? "#E8A84C" : "#9B9590" }}>{s.plan}</span></td>
                <td style={{ padding: "14px 20px", fontSize: 14, color: "#1C1C1E", fontWeight: 600 }}>{s.prix}/mois</td>
                <td style={{ padding: "14px 20px" }}><span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: s.statut === "Actif" ? "rgba(34,197,94,.08)" : "#F7F5F2", color: s.statut === "Actif" ? "#16a34a" : "#9B9590" }}>{s.statut}</span></td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#C5C0B9" }}>{s.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
