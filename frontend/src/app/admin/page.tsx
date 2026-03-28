export default function AdminDashboard() {
  const stats = [
    { label: "Total artisans", value: "5", color: "text-anthracite" },
    { label: "Inscriptions ce mois", value: "2", color: "text-terre" },
    { label: "Devis ce mois", value: "12", color: "text-or" },
    { label: "Revenus estimes", value: "216 EUR", color: "text-green-600" },
  ];

  const planData = [
    { plan: "Gratuit", count: 1, color: "bg-gray-300" },
    { plan: "Essentiel", count: 2, color: "bg-or" },
    { plan: "Pro", count: 1, color: "bg-terre" },
    { plan: "Pro+", count: 1, color: "bg-anthracite" },
  ];

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    border: "1.5px solid #EDEBE7",
    boxShadow: "0 4px 24px rgba(28,28,30,.04)",
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }} className="max-md:grid-cols-2">
        {stats.map((s) => (
          <div key={s.label} style={{ ...cardStyle, padding: 28 }}>
            <p style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 800, lineHeight: 1, color: s.color === "text-terre" ? "#C4531A" : s.color === "text-or" ? "#E8A84C" : s.color === "text-green-600" ? "#16a34a" : "#1C1C1E" }}>{s.value}</p>
            <p style={{ fontSize: 13, color: "#9B9590", marginTop: 8 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }} className="max-md:grid-cols-1">
        <div style={{ ...cardStyle, padding: 28 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Repartition par plan</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {planData.map((p) => (
              <div key={p.plan} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color === "bg-gray-300" ? "#C5C0B9" : p.color === "bg-or" ? "#E8A84C" : p.color === "bg-terre" ? "#C4531A" : "#1C1C1E", flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "#6B6560", flex: 1 }}>{p.plan}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1C1C1E", minWidth: 20, textAlign: "right" }}>{p.count}</span>
                <div style={{ width: 96, height: 6, background: "#F7F5F2", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: p.color === "bg-gray-300" ? "#C5C0B9" : p.color === "bg-or" ? "#E8A84C" : p.color === "bg-terre" ? "#C4531A" : "#1C1C1E", width: `${(p.count / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...cardStyle, padding: 28 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Repartition par ville</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { ville: "Chambery", count: 5 },
              { ville: "Annecy", count: 0 },
              { ville: "Grenoble", count: 0 },
              { ville: "Lyon", count: 0 },
              { ville: "Valence", count: 0 },
            ].map((v) => (
              <div key={v.ville} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 14, color: "#6B6560", flex: 1 }}>{v.ville}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{v.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
