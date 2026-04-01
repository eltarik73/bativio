"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

interface ArtisanAdmin {
  id: string;
  nomAffichage: string;
  user?: { email: string };
  email?: string;
  ville: string;
  plan: string;
  actif: boolean;
  visible: boolean;
  slug: string;
}

interface PageResponse {
  artisans: ArtisanAdmin[];
  pagination: { totalPages: number; total: number; page: number };
  // Legacy Spring Boot format fallback
  content?: ArtisanAdmin[];
  totalPages?: number;
}

const planBadge: Record<string, string> = {
  GRATUIT: "bg-gray-100 text-gray-600",
  STARTER: "bg-green-100 text-green-700",
  ESSENTIEL: "bg-green-100 text-green-700",
  PRO: "bg-blue-100 text-blue-700",
  BUSINESS: "bg-purple-100 text-purple-700",
  PRO_PLUS: "bg-purple-100 text-purple-700",
};

export default function AdminArtisansPage() {
  const { fetchWithAuth } = useAuth();
  const [artisans, setArtisans] = useState<ArtisanAdmin[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchArtisans = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), size: "20" });
      if (search) params.set("search", search);
      const data = await fetchWithAuth(`/admin/artisans?${params}`) as PageResponse;
      setArtisans(data.artisans || data.content || []);
      setTotalPages(data.pagination?.totalPages || data.totalPages || 0);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [page, search, fetchWithAuth]);

  useEffect(() => {
    fetchArtisans();
  }, [fetchArtisans]);

  const handleToggleActif = async (id: string, currentActif: boolean) => {
    setActionLoading(id);
    try {
      await fetchWithAuth(`/admin/artisans/${id}/statut`, {
        method: "PUT",
        body: JSON.stringify({ statut: currentActif ? "INACTIVE" : "ACTIVE" }),
      });
      await fetchArtisans();
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchArtisans();
  };

  const tableCard: React.CSSProperties = {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid var(--sable,#E8D5C0)",
    overflow: "hidden",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>Artisans</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ height: 42, padding: "0 16px", borderRadius: 10, border: "1.5px solid #E0DDD8", fontSize: 14, fontFamily: "'Karla',sans-serif", color: "var(--bois,#3D2E1F)", outline: "none", transition: "border-color .2s", width: 220 }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#C4531A"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196,83,26,.08)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#E0DDD8"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </form>
      </div>

      <div style={tableCard}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F7F5F2", borderBottom: "1px solid #EDEBE7" }}>
                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Nom</th>
                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Email</th>
                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Ville</th>
                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Plan</th>
                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Statut</th>
                <th style={{ textAlign: "center", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Visible</th>
                <th style={{ textAlign: "right", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "32px 24px", textAlign: "center", fontSize: 14, color: "var(--pierre,#9C958D)" }}>
                    Chargement...
                  </td>
                </tr>
              ) : artisans.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "32px 24px", textAlign: "center", fontSize: 14, color: "var(--pierre,#9C958D)" }}>
                    Aucun artisan trouve
                  </td>
                </tr>
              ) : (
                artisans.map((a, idx) => (
                  <tr key={a.id} style={{ borderBottom: idx < artisans.length - 1 ? "1px solid #F7F5F2" : "none", transition: "background .15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#FAF8F5"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{a.nomAffichage}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "var(--bois-mid,#5C4A3A)" }}>{a.user?.email || a.email || "-"}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "var(--bois-mid,#5C4A3A)" }}>{a.ville || "-"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: (a.plan === "BUSINESS" || a.plan === "PRO_PLUS") ? "rgba(83,74,183,.08)" : a.plan === "PRO" ? "rgba(24,95,165,.08)" : (a.plan === "STARTER" || a.plan === "ESSENTIEL") ? "rgba(5,150,105,.08)" : "#F7F5F2",
                        color: (a.plan === "BUSINESS" || a.plan === "PRO_PLUS") ? "#534AB7" : a.plan === "PRO" ? "#185FA5" : (a.plan === "STARTER" || a.plan === "ESSENTIEL") ? "#0F6E56" : "#6B6560",
                      }}>
                        {a.plan?.replace("_", " ") || "GRATUIT"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {a.actif ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: "rgba(34,197,94,.08)" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                          <span style={{ fontSize: 12, color: "#15803d", fontWeight: 600 }}>Actif</span>
                        </span>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: "rgba(245,158,11,.08)" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
                          <span style={{ fontSize: 12, color: "#b45309", fontWeight: 600 }}>En attente</span>
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <button
                        onClick={async () => {
                          try {
                            await fetchWithAuth(`/admin/artisans/${a.id}/visibility`, { method: "PATCH", body: JSON.stringify({ visible: !a.visible }) });
                            setArtisans((prev) => prev.map((x) => x.id === a.id ? { ...x, visible: !x.visible } : x));
                          } catch { /* empty */ }
                        }}
                        style={{ width: 36, height: 20, borderRadius: 10, padding: 2, border: "none", cursor: "pointer", background: a.visible !== false ? "#22c55e" : "#E0DDD8", transition: "background .2s", position: "relative" }}
                        title={a.visible !== false ? "Visible dans l'annuaire" : "Masqué de l'annuaire"}
                      >
                        <span style={{ display: "block", width: 16, height: 16, borderRadius: 8, background: "#fff", transition: "transform .2s", transform: a.visible !== false ? "translateX(16px)" : "translateX(0)" }} />
                      </button>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <button
                        onClick={() => handleToggleActif(a.id, a.actif)}
                        disabled={actionLoading === a.id}
                        style={{
                          padding: "6px 14px", height: 32, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                          border: a.actif ? "1px solid rgba(239,68,68,.2)" : "1px solid rgba(22,163,74,.2)",
                          background: "transparent",
                          color: a.actif ? "#dc2626" : "#15803d",
                          opacity: actionLoading === a.id ? 0.5 : 1,
                        }}
                      >
                        {actionLoading === a.id
                          ? "..."
                          : a.actif
                          ? "Desactiver"
                          : "Valider"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #F7F5F2" }}>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{ fontSize: 14, color: "var(--pierre,#9C958D)", background: "none", border: "none", cursor: "pointer", opacity: page === 0 ? 0.3 : 1, fontFamily: "'Karla',sans-serif", fontWeight: 500 }}
            >
              Precedent
            </button>
            <span style={{ fontSize: 14, color: "var(--pierre,#9C958D)" }}>
              Page {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              style={{ fontSize: 14, color: "var(--pierre,#9C958D)", background: "none", border: "none", cursor: "pointer", opacity: page >= totalPages - 1 ? 0.3 : 1, fontFamily: "'Karla',sans-serif", fontWeight: 500 }}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
