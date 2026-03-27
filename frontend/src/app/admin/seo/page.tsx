import { TRAVAUX } from "@/lib/travaux-data";

const C: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", overflow: "hidden" };

export default function SeoPage() {
  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Contenu SEO</h1>
      <div style={C}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
              <th style={{ textAlign: "left", padding: "12px 20px", fontSize: 12, fontWeight: 600, color: "#9B9590", textTransform: "uppercase" }}>Page</th>
              <th style={{ textAlign: "left", padding: "12px 20px", fontSize: 12, fontWeight: 600, color: "#9B9590", textTransform: "uppercase" }}>URL</th>
              <th style={{ textAlign: "left", padding: "12px 20px", fontSize: 12, fontWeight: 600, color: "#9B9590", textTransform: "uppercase" }}>Score</th>
              <th style={{ padding: "12px 20px" }}></th>
            </tr>
          </thead>
          <tbody>
            {TRAVAUX.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #F7F5F2" }}>
                <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{t.nom}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#9B9590", fontFamily: "monospace" }}>/travaux/{t.slug}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: t.description.length > 200 ? "rgba(34,197,94,.08)" : "rgba(232,168,76,.1)", color: t.description.length > 200 ? "#16a34a" : "#E8A84C" }}>
                    {t.description.length > 200 ? "Bon" : "Am\u00e9liorer"}
                  </span>
                </td>
                <td style={{ padding: "14px 20px" }}><button style={{ fontSize: 12, color: "#C4531A", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Modifier</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
