"use client";

import { useState, useEffect, useCallback } from "react";
import { authFetch } from "@/lib/auth";

interface ArtisanAdmin {
  id: string;
  nomAffichage: string;
  email: string;
  ville: string;
  plan: string;
  actif: boolean;
  slug: string;
}

interface PageResponse {
  content: ArtisanAdmin[];
  totalElements: number;
  totalPages: number;
  number: number;
}

const planBadge: Record<string, string> = {
  GRATUIT: "bg-gray-100 text-gray-600",
  ESSENTIEL: "bg-or/10 text-or",
  PRO: "bg-terre/10 text-terre",
  PRO_PLUS: "bg-anthracite/10 text-anthracite",
};

export default function AdminArtisansPage() {
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
      const data = await authFetch<PageResponse>(`/admin/artisans?${params}`);
      setArtisans(data.content);
      setTotalPages(data.totalPages);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchArtisans();
  }, [fetchArtisans]);

  const handleToggleActif = async (id: string, currentActif: boolean) => {
    setActionLoading(id);
    try {
      await authFetch(`/admin/artisans/${id}/statut`, {
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-anthracite">Artisans</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border border-g200 text-sm focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none"
          />
        </form>
      </div>

      <div className="bg-white rounded-[14px] border border-g100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-g100">
                <th className="text-left px-6 py-3 text-xs font-medium text-g400 uppercase">Nom</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-g400 uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-g400 uppercase">Ville</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-g400 uppercase">Plan</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-g400 uppercase">Statut</th>
                <th className="px-6 py-3 text-xs font-medium text-g400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-g400">
                    Chargement...
                  </td>
                </tr>
              ) : artisans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-g400">
                    Aucun artisan trouve
                  </td>
                </tr>
              ) : (
                artisans.map((a) => (
                  <tr key={a.id} className="border-b border-g100 last:border-0">
                    <td className="px-6 py-4 text-sm font-medium text-anthracite">{a.nomAffichage}</td>
                    <td className="px-6 py-4 text-sm text-g500">{a.email || "-"}</td>
                    <td className="px-6 py-4 text-sm text-g500">{a.ville || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${planBadge[a.plan] || "bg-gray-100 text-gray-600"}`}>
                        {a.plan?.replace("_", " ") || "GRATUIT"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {a.actif ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-sm text-green-700 font-medium">Actif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-sm text-amber-700 font-medium">En attente</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleActif(a.id, a.actif)}
                        disabled={actionLoading === a.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          a.actif
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        } disabled:opacity-50`}
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
          <div className="flex items-center justify-between px-6 py-3 border-t border-g100">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-sm text-g400 hover:text-anthracite disabled:opacity-30"
            >
              Precedent
            </button>
            <span className="text-sm text-g400">
              Page {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="text-sm text-g400 hover:text-anthracite disabled:opacity-30"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
