export default function AdminDashboard() {
  const stats = [
    { label: "Total artisans", value: "5", color: "#1C1C1E", icon: '<svg width="20" height="20" fill="none" stroke="#E0DDD8" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>' },
    { label: "Inscriptions ce mois", value: "2", color: "#1C1C1E", icon: '<svg width="20" height="20" fill="none" stroke="#E0DDD8" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>' },
    { label: "Devis ce mois", value: "12", color: "#1C1C1E", icon: '<svg width="20" height="20" fill="none" stroke="#E0DDD8" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>' },
    { label: "Revenus estimés", value: "216 €", color: "#C4531A", icon: '<svg width="20" height="20" fill="none" stroke="#E0DDD8" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>' },
  ];

  const planData = [
    { plan: "Gratuit", count: 1, color: "#C5C0B9" },
    { plan: "Starter", count: 2, color: "#0F6E56" },
    { plan: "Pro", count: 1, color: "#185FA5" },
    { plan: "Business", count: 1, color: "#534AB7" },
  ];

  const total = planData.reduce((s, p) => s + p.count, 0);

  const pendingCount = 0;

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 32 }} className="max-md:grid-cols-1">
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", padding: 24, position: "relative" }}>
            <span style={{ position: "absolute", top: 20, right: 20 }} dangerouslySetInnerHTML={{ __html: s.icon }} />
            <p style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, lineHeight: 1, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 13, color: "#9B9590", marginTop: 8 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }} className="max-md:grid-cols-1">
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", padding: 24 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Répartition par plan</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {planData.map((p) => (
              <div key={p.plan}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: "#6B6560" }}>{p.plan}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{p.count}</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "#F7F5F2", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: p.color, width: `${(p.count / total) * 100}%`, transition: "width .3s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", padding: 24 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Répartition par ville</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { ville: "Chambéry", count: 5 },
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

      {pendingCount === 0 && (
        <div style={{ marginTop: 24, background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", padding: 24, textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "#9B9590" }}>Aucun artisan en attente de validation. Bonne nouvelle ! 🎉</p>
        </div>
      )}
    </div>
  );
}
