"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Stats {
  totalArtisansActif: number;
  totalArtisansAll: number;
  inscriptionsThisMonth: number;
  inscriptionsLastMonth: number;
  inscriptionsDeltaPct: number | null;
  totalDevisThisMonth: number;
  totalDevisLastMonth: number;
  devisDeltaPct: number | null;
  artisansEnAttente: number;
  revenusEstimes: number;
  plans: Record<string, number>;
  villes: Array<{ slug: string; count: number }>;
  generatedAt: string;
}

const VILLE_LABELS: Record<string, string> = {
  chambery: "Chambéry",
  annecy: "Annecy",
  grenoble: "Grenoble",
  lyon: "Lyon",
  valence: "Valence",
  autres: "Autres",
};

// Display order + label aliases (handles ESSENTIEL legacy → Starter, PRO_PLUS → Business)
const PLAN_DISPLAY = [
  { label: "Gratuit",  color: "#C5C0B9", keys: ["GRATUIT"] },
  { label: "Starter",  color: "#0F6E56", keys: ["STARTER", "ESSENTIEL"] },
  { label: "Pro",      color: "#185FA5", keys: ["PRO"] },
  { label: "Business", color: "#534AB7", keys: ["BUSINESS", "PRO_PLUS"] },
];

const VILLE_DISPLAY_ORDER = ["chambery", "annecy", "grenoble", "lyon", "valence"];

export default function AdminDashboard() {
  const { fetchWithAuth } = useAuth();
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = (await fetchWithAuth("/admin/stats")) as Stats;
        setData(res);
      } catch {
        /* leave data null */
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchWithAuth]);

  const fmt = (n: number) => n.toLocaleString("fr-FR");

  // KPI cards (same visual layout as the original — only the values are now live)
  const stats = [
    {
      label: "Total artisans",
      value: loading ? "—" : fmt(data?.totalArtisansActif ?? 0),
      color: "var(--bois,#3D2E1F)",
      icon: '<svg width="20" height="20" fill="none" stroke="#E0DDD8" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>',
    },
    {
      label: "Inscriptions ce mois",
      value: loading ? "—" : fmt(data?.inscriptionsThisMonth ?? 0),
      color: "var(--bois,#3D2E1F)",
      icon: '<svg width="20" height="20" fill="none" stroke="#E0DDD8" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    },
    {
      label: "Devis ce mois",
      value: loading ? "—" : fmt(data?.totalDevisThisMonth ?? 0),
      color: "var(--bois,#3D2E1F)",
      icon: '<svg width="20" height="20" fill="none" stroke="#E0DDD8" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
    },
    {
      label: "Revenus estimés",
      value: loading ? "—" : `${fmt(data?.revenusEstimes ?? 0)} €`,
      color: "#C4531A",
      icon: '<svg width="20" height="20" fill="none" stroke="#E0DDD8" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
    },
  ];

  // Live plan breakdown (legacy ESSENTIEL aggregated into Starter, PRO_PLUS into Business)
  const planData = PLAN_DISPLAY.map((p) => ({
    plan: p.label,
    count: p.keys.reduce((sum, k) => sum + (data?.plans[k] ?? 0), 0),
    color: p.color,
  }));
  const total = Math.max(planData.reduce((s, p) => s + p.count, 0), 1);

  // Live ville breakdown — always show the 5 main villes (even at 0), append "Autres" if any
  const villesMap = new Map((data?.villes || []).map((v) => [v.slug, v.count]));
  const villeData = VILLE_DISPLAY_ORDER.map((slug) => ({
    ville: VILLE_LABELS[slug],
    count: villesMap.get(slug) ?? 0,
  }));
  const autresCount = (data?.villes || [])
    .filter((v) => !VILLE_DISPLAY_ORDER.includes(v.slug))
    .reduce((s, v) => s + v.count, 0);
  if (autresCount > 0) villeData.push({ ville: "Autres", count: autresCount });

  const pendingCount = data?.artisansEnAttente ?? 0;

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 24 }}>
        Dashboard
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 32 }} className="max-md:grid-cols-1">
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", padding: 24, position: "relative" }}>
            <span style={{ position: "absolute", top: 20, right: 20 }} dangerouslySetInnerHTML={{ __html: s.icon }} />
            <p style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, lineHeight: 1, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginTop: 8 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }} className="max-md:grid-cols-1">
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", padding: 24 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 20 }}>
            Répartition par plan
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {planData.map((p) => (
              <div key={p.plan}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)" }}>{p.plan}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{p.count}</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "#F7F5F2", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: p.color, width: `${(p.count / total) * 100}%`, transition: "width .3s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", padding: 24 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 20 }}>
            Répartition par ville
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {villeData.map((v) => (
              <div key={v.ville} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", flex: 1 }}>{v.ville}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{v.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {pendingCount > 0 ? (
        <Link
          href="/admin/validations"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginTop: 24,
            background: "#fff",
            borderRadius: 14,
            border: "1px solid var(--sable,#E8D5C0)",
            padding: 24,
            textDecoration: "none",
            transition: "border-color .2s, box-shadow .2s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ display: "inline-flex", width: 36, height: 36, borderRadius: 10, background: "rgba(196,83,26,.1)", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" fill="none" stroke="#C4531A" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            </span>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>
                {pendingCount} artisan{pendingCount > 1 ? "s" : ""} en attente de validation
              </p>
              <p style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginTop: 2 }}>
                NAF à valider · scoring en attente de décision
              </p>
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#C4531A" }}>Valider →</span>
        </Link>
      ) : !loading ? (
        <div style={{ marginTop: 24, background: "#fff", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", padding: 24, textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "var(--pierre,#9C958D)" }}>Aucun artisan en attente de validation. Bonne nouvelle&nbsp;!</p>
        </div>
      ) : null}

      {data && (
        <p style={{ marginTop: 16, fontSize: 12, color: "var(--g400,#9B9590)", textAlign: "right" }}>
          Synchronisé à {new Date(data.generatedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}
    </div>
  );
}
