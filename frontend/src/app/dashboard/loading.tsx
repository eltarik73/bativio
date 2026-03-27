export default function DashboardLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header skeleton */}
      <div><div className="skeleton" style={{ width: 180, height: 28, marginBottom: 8 }} /><div className="skeleton" style={{ width: 140, height: 16 }} /></div>
      {/* Completion bar */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
        <div className="skeleton" style={{ width: 56, height: 56, borderRadius: "50%" }} />
        <div style={{ flex: 1 }}><div className="skeleton" style={{ width: 200, height: 16, marginBottom: 8 }} /><div className="skeleton" style={{ width: 280, height: 12 }} /></div>
      </div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", padding: 20 }}>
            <div className="skeleton" style={{ width: 60, height: 32, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 100, height: 12 }} />
          </div>
        ))}
      </div>
      {/* Demandes */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7" }}>
        <div style={{ padding: "16px 20px" }}><div className="skeleton" style={{ width: 160, height: 18 }} /></div>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ padding: "14px 20px", borderTop: "1px solid #F7F5F2", display: "flex", gap: 12 }}>
            <div className="skeleton" style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 6 }} />
            <div style={{ flex: 1 }}><div className="skeleton" style={{ width: 140, height: 14, marginBottom: 6 }} /><div className="skeleton" style={{ width: "80%", height: 12 }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
