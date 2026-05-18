"use client";

/**
 * /admin/villes — liste des villes Bativio avec compteur artisans REELS DB.
 *
 * Source des compteurs : /api/v1/admin/stats (renvoie villes [{slug, count}])
 * Source de la liste villes : src/lib/constants.ts VILLES (5 villes V1)
 *
 * BUGFIX 18/05/2026 (Tarik) : avant l'affichage etait HARDCODE en dur
 * dans un array statique (Chambéry: 5 / Annecy: 0 / Grenoble: 0 / Lyon: 0
 * / Valence: 0). Maintenant fetch live depuis la DB.
 */

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth";
import { VILLES } from "@/lib/constants";

interface AdminStats {
  villes: Array<{ slug: string; count: number }>;
}

const VILLE_DEPARTEMENTS: Record<string, string> = {
  chambery: "Savoie",
  annecy: "Haute-Savoie",
  grenoble: "Isère",
  lyon: "Rhône",
  valence: "Drôme",
};

export default function AdminVillesPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await authFetch<AdminStats>("/admin/stats");
        if (!active) return;
        const map: Record<string, number> = {};
        for (const v of data.villes) map[v.slug] = v.count;
        setCounts(map);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const villesActives = VILLES.slice(0, 5); // 5 villes V1
  const totalAutres = counts.autres ?? 0;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>Villes</h1>
          <p style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginTop: 4 }}>
            Compteur artisans temps réel depuis la DB
          </p>
        </div>
      </div>

      {loading && <div style={{ background: "#fff", padding: 32, borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", textAlign: "center", color: "#9B9590" }}>Chargement…</div>}

      {error && <div style={{ background: "#fff", padding: 32, borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", color: "#dc2626" }}>Erreur : {error}</div>}

      {!loading && !error && (
        <>
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #EDEBE7", background: "#FAF8F5" }}>
                  <th style={{ textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Nom</th>
                  <th style={{ textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Slug</th>
                  <th style={{ textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Département</th>
                  <th style={{ textAlign: "right", padding: "12px 20px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Artisans actifs</th>
                </tr>
              </thead>
              <tbody>
                {villesActives.map((v) => {
                  const count = counts[v.slug] ?? 0;
                  return (
                    <tr key={v.slug} style={{ borderBottom: "1px solid #F7F5F2" }}>
                      <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{v.nom}</td>
                      <td style={{ padding: "14px 20px", fontSize: 12, color: "var(--pierre,#9C958D)", fontFamily: "monospace" }}>{v.slug}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--bois-mid,#5C4A3A)" }}>{VILLE_DEPARTEMENTS[v.slug] || "—"}</td>
                      <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 700, color: count > 0 ? "#C4531A" : "#9B9590", textAlign: "right" }}>
                        {count.toLocaleString("fr-FR")}
                      </td>
                    </tr>
                  );
                })}
                {totalAutres > 0 && (
                  <tr style={{ background: "#FAF8F5" }}>
                    <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "var(--bois-mid,#5C4A3A)", fontStyle: "italic" }}>
                      Autres villes
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 12, color: "var(--pierre,#9C958D)" }}>—</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--bois-mid,#5C4A3A)" }}>Hors V1</td>
                    <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 700, color: "#C4531A", textAlign: "right" }}>
                      {totalAutres.toLocaleString("fr-FR")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 12, background: "rgba(196,83,26,.04)", border: "1px solid rgba(196,83,26,.15)", fontSize: 13, color: "var(--bois-mid,#5C4A3A)" }}>
            <strong>Note :</strong> Les villes V1 (Chambéry, Annecy, Grenoble, Lyon, Valence) sont définies dans <code style={{ background: "rgba(0,0,0,.05)", padding: "1px 5px", borderRadius: 3 }}>src/lib/constants.ts</code>. Les ~180 zones SEO (banlieues, communes Tier 4) sont gérées séparément dans <code style={{ background: "rgba(0,0,0,.05)", padding: "1px 5px", borderRadius: 3 }}>src/lib/zones.ts</code>.
          </div>
        </>
      )}
    </div>
  );
}
