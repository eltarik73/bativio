"use client";

import Link from "next/link";

const S = { card: { background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", overflow: "hidden" } as React.CSSProperties };

const stats = [
  { label: "Vues ce mois", value: "124", icon: '<svg width="20" height="20" fill="none" stroke="#E0DDD8" stroke-width="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' },
  { label: "Demandes de devis", value: "8", icon: '<svg width="20" height="20" fill="none" stroke="#E0DDD8" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>' },
  { label: "RDV ce mois", value: "3", icon: '<svg width="20" height="20" fill="none" stroke="#E0DDD8" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' },
  { label: "Note moyenne", value: "4.8", icon: '<svg width="20" height="20" fill="#E8A84C" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>', color: "#E8A84C" },
];

const devis = [
  { id: "1", nom: "Sophie Martin", date: "Il y a 2h", color: "#C4531A", desc: "Fuite sous \u00e9vier cuisine" },
  { id: "2", nom: "Pierre Durand", date: "Hier", color: "#E8A84C", desc: "R\u00e9novation salle de bains" },
  { id: "3", nom: "Marie Leroy", date: "3 jours", color: "#22c55e", desc: "Installation chauffe-eau" },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E" }}>Bonjour !</h1>
        <p style={{ fontSize: 15, color: "#9B9590", marginTop: 2 }}>Martin Plomberie</p>
      </div>

      {/* Completion */}
      <div style={{ ...S.card, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
        <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
          <svg width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="28" cy="28" r="24" fill="none" stroke="#EDEBE7" strokeWidth="4" />
            <circle cx="28" cy="28" r="24" fill="none" stroke="#C4531A" strokeWidth="4" strokeDasharray={`${85 * 1.508} 151`} strokeLinecap="round" />
          </svg>
          <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#C4531A" }}>85%</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E" }}>Profil presque complet</p>
          <p style={{ fontSize: 13, color: "#9B9590", marginTop: 2 }}>Ajoutez des photos pour atteindre 100%</p>
        </div>
        <Link href="/dashboard/photos" style={{ height: 36, padding: "0 16px", borderRadius: 8, border: "1.5px solid #E0DDD8", display: "inline-flex", alignItems: "center", fontSize: 13, fontWeight: 600, color: "#C4531A", textDecoration: "none", transition: "all .15s" }}>Compl&eacute;ter</Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }} className="max-md:grid-cols-2">
        {stats.map((s) => (
          <div key={s.label} style={{ ...S.card, padding: 20, transition: "all .2s", cursor: "default" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 800, color: s.color || "#1C1C1E", lineHeight: 1 }}>{s.value}</span>
              <span dangerouslySetInnerHTML={{ __html: s.icon }} style={{ display: "flex" }} />
            </div>
            <p style={{ fontSize: 13, color: "#9B9590", marginTop: 6 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Dernieres demandes */}
      <div style={{ ...S.card, marginBottom: 24 }}>
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#1C1C1E" }}>Derni&egrave;res demandes</span>
          <Link href="/dashboard/devis" style={{ fontSize: 13, color: "#C4531A", fontWeight: 500, textDecoration: "none" }}>Voir tout &rarr;</Link>
        </div>
        {devis.map((d) => (
          <div key={d.id} style={{ padding: "14px 20px", borderTop: "1px solid #F7F5F2", display: "flex", alignItems: "center", gap: 12, transition: "background .15s", cursor: "pointer" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{d.nom}</p>
              <p style={{ fontSize: 13, color: "#9B9590", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.desc}</p>
            </div>
            <span style={{ fontSize: 12, color: "#C5C0B9", whiteSpace: "nowrap", flexShrink: 0 }}>{d.date}</span>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }} className="max-md:grid-cols-2">
        {[
          { label: "Ajouter photos", href: "/dashboard/photos", icon: '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>' },
          { label: "Modifier profil", href: "/dashboard/profil", icon: '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' },
          { label: "Voir mes devis", href: "/dashboard/devis", icon: '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>' },
          { label: "Voir ma page", href: "/chambery/martin-plomberie", icon: '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' },
        ].map((a) => (
          <Link key={a.label} href={a.href} style={{ ...S.card, padding: 24, textAlign: "center", textDecoration: "none", transition: "all .2s", cursor: "pointer" }}>
            <span dangerouslySetInnerHTML={{ __html: a.icon }} style={{ display: "flex", justifyContent: "center", color: "#9B9590" }} />
            <p style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: "#1C1C1E" }}>{a.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
