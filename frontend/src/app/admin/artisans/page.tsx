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
  ESSENTIEL: "bg-or/10 text-or",
  PRO: "bg-terre/10 text-terre",
  PRO_PLUS: "bg-anthracite/10 text-anthracite",
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
    border: "1px solid #EDEBE7",
    overflow: "hidden",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E" }}>Artisans</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ height: 42, padding: "0 16px", borderRadius: 10, border: "1.5px solid #E0DDD8", fontSize: 14, fontFamily: "'Karla',sans-serif", color: "#1C1C1E", outline: "none", transition: "border-color .2s", width: 220 }}
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
                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Nom</th>
                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Email</th>
                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Ville</th>
                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Plan</th>
                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Statut</th>
                <th style={{ textAlign: "right", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "32px 24px", textAlign: "center", fontSize: 14, color: "#9B9590" }}>
                    Chargement...
                  </td>
                </tr>
              ) : artisans.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "32px 24px", textAlign: "center", fontSize: 14, color: "#9B9590" }}>
                    Aucun artisan trouve
                  </td>
                </tr>
              ) : (
                artisans.map((a, idx) => (
                  <tr key={a.id} style={{ borderBottom: idx < artisans.length - 1 ? "1px solid #F7F5F2" : "none", transition: "background .15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#FAF8F5"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{a.nomAffichage}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "#6B6560" }}>{a.user?.email || a.email || "-"}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "#6B6560" }}>{a.ville || "-"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: a.plan === "PRO_PLUS" ? "rgba(28,28,30,.06)" : a.plan === "PRO" ? "rgba(196,83,26,.08)" : a.plan === "ESSENTIEL" ? "rgba(232,168,76,.1)" : "#F7F5F2",
                        color: a.plan === "PRO_PLUS" ? "#1C1C1E" : a.plan === "PRO" ? "#C4531A" : a.plan === "ESSENTIEL" ? "#E8A84C" : "#6B6560",
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
              style={{ fontSize: 14, color: "#9B9590", background: "none", border: "none", cursor: "pointer", opacity: page === 0 ? 0.3 : 1, fontFamily: "'Karla',sans-serif", fontWeight: 500 }}
            >
              Precedent
            </button>
            <span style={{ fontSize: 14, color: "#9B9590" }}>
              Page {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              style={{ fontSize: 14, color: "#9B9590", background: "none", border: "none", cursor: "pointer", opacity: page >= totalPages - 1 ? 0.3 : 1, fontFamily: "'Karla',sans-serif", fontWeight: 500 }}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
