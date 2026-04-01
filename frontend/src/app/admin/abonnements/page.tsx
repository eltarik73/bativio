const C: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", overflow: "hidden" };

const subs = [
  { nom: "Martin Plomberie", plan: "Pro", prix: "39€", statut: "Actif", date: "15/03/2026" },
  { nom: "Élec Savoie", plan: "Starter", prix: "19€", statut: "Actif", date: "16/03/2026" },
  { nom: "Dupont Peinture", plan: "Gratuit", prix: "0€", statut: "Gratuit", date: "17/03/2026" },
  { nom: "Alpes Maçonnerie", plan: "Business", prix: "59€", statut: "Actif", date: "18/03/2026" },
  { nom: "Savoie Carrelage", plan: "Starter", prix: "19€", statut: "Actif", date: "19/03/2026" },
];

export default function AbonnementsPage() {
  const mrr = subs.reduce((s, a) => s + parseInt(a.prix), 0);
  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 20 }}>Abonnements</h1>
      {/* MRR */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ ...C, padding: 20 }}><div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "var(--bois,#3D2E1F)" }}>{mrr}€</div><div style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginTop: 4 }}>MRR total</div></div>
        <div style={{ ...C, padding: 20 }}><div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "#22c55e" }}>4</div><div style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginTop: 4 }}>Abonnés payants</div></div>
        <div style={{ ...C, padding: 20 }}><div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "#E8A84C" }}>1</div><div style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginTop: 4 }}>Plan gratuit</div></div>
      </div>
      <div style={C}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid #EDEBE7" }}>
            {["Artisan", "Plan", "Prix", "Statut", "Depuis"].map((h) => <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontSize: 12, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.nom} style={{ borderBottom: "1px solid #F7F5F2" }}>
                <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{s.nom}</td>
                <td style={{ padding: "14px 20px" }}><span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: s.plan === "Pro" ? "rgba(196,83,26,.08)" : s.plan === "Business" ? "rgba(83,74,183,.08)" : s.plan === "Starter" ? "rgba(5,150,105,.08)" : "#F7F5F2", color: s.plan === "Pro" ? "#C4531A" : s.plan === "Business" ? "#534AB7" : s.plan === "Starter" ? "#0F6E56" : "#9B9590" }}>{s.plan}</span></td>
                <td style={{ padding: "14px 20px", fontSize: 14, color: "var(--bois,#3D2E1F)", fontWeight: 600 }}>{s.prix}/mois</td>
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
