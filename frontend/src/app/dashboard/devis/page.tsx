"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const DOT: Record<string, string> = { NOUVEAU: "#dc2626", VU: "#E8A84C", REPONDU: "#2563EB", ACCEPTE: "#16a34a", REFUSE: "#9B9590", ARCHIVE: "#C5C0B9" };
const LABEL: Record<string, string> = { NOUVEAU: "Nouveau", VU: "En attente", REPONDU: "Répondu", ACCEPTE: "Accepté", REFUSE: "Refusé", ARCHIVE: "Archivé" };
const BG: Record<string, string> = { NOUVEAU: "rgba(220,38,38,.08)", VU: "rgba(232,168,76,.08)", REPONDU: "rgba(37,99,235,.08)", ACCEPTE: "rgba(22,163,74,.08)", REFUSE: "rgba(155,149,144,.08)", ARCHIVE: "rgba(197,192,185,.08)" };

interface Devis {
  id: string;
  nomClient: string;
  telephoneClient: string;
  emailClient: string;
  descriptionBesoin: string;
  statut: string;
  createdAt: string;
}

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "A l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function DevisPage() {
  const { fetchWithAuth } = useAuth();
  const [devis, setDevis] = useState<Devis[]>([]);
  const [filter, setFilter] = useState("TOUS");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchDevis = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), size: "20" });
      if (filter !== "TOUS") params.set("statut", filter);
      const data = await fetchWithAuth(`/artisans/me/devis?${params}`) as { devis?: Devis[]; content?: Devis[]; totalPages?: number; pagination?: { totalPages: number } };
      setDevis(data.devis || data.content || []);
      setTotalPages(data.pagination?.totalPages || data.totalPages || 0);
    } catch { /* empty */ }
    finally { setLoading(false); }
  }, [page, filter, fetchWithAuth]);

  useEffect(() => { fetchDevis(); }, [fetchDevis]);

  const pills = ["TOUS", "NOUVEAU", "VU", "REPONDU", "ACCEPTE", "REFUSE"];
  const newCount = devis.filter((d) => d.statut === "NOUVEAU").length;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E" }}>Demandes de devis</h1>
        {newCount > 0 && (
          <span style={{ background: "#dc2626", color: "#fff", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 10 }}>{newCount} nouvelle{newCount > 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto" }} className="hide-scroll">
        {pills.map((s) => (
          <button key={s} onClick={() => { setFilter(s); setPage(0); }} style={{
            padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s",
            background: filter === s ? "#1C1C1E" : "#fff",
            color: filter === s ? "#fff" : "#6B6560",
            border: filter !== s ? "1.5px solid #E0DDD8" : "none",
          }}>
            {s === "TOUS" ? "Toutes" : LABEL[s] || s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#9B9590", fontSize: 14 }}>Chargement...</div>
      ) : devis.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {devis.map((d) => {
            const isNew = d.statut === "NOUVEAU";
            return (
              <Link key={d.id} href={`/dashboard/devis/${d.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#fff", borderRadius: 14, border: isNew ? "1.5px solid #C4531A" : "1px solid #EDEBE7",
                  padding: "20px 24px", transition: "all .2s", cursor: "pointer",
                }}
                  className="stat-card-hover"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: DOT[d.statut] || "#C5C0B9", flexShrink: 0, ...(isNew ? { animation: "pulse 1.5s infinite" } : {}) }} />
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: BG[d.statut] || BG.ARCHIVE, color: DOT[d.statut] || "#9B9590" }}>{LABEL[d.statut] || d.statut}</span>
                    <span style={{ fontSize: 12, color: "#C5C0B9", marginLeft: "auto" }}>{timeAgo(d.createdAt)}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1E", marginBottom: 4 }}>{d.nomClient}</div>
                  <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{d.descriptionBesoin}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                    <span style={{ fontSize: 13, color: "#9B9590" }}>{d.telephoneClient}</span>
                    {d.emailClient && <span style={{ fontSize: 13, color: "#9B9590" }}>&middot; {d.emailClient}</span>}
                    <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: "#C4531A" }}>Voir &rarr;</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "56px 20px" }}>
          <svg width="56" height="56" fill="none" stroke="#E0DDD8" strokeWidth="1" viewBox="0 0 24 24" style={{ margin: "0 auto 16px" }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></svg>
          <p style={{ fontSize: 15, color: "#9B9590" }}>Aucune demande de devis</p>
          <p style={{ fontSize: 13, color: "#C5C0B9", marginTop: 4 }}>Les nouvelles demandes appara&icirc;tront ici.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24 }}>
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} style={{ fontSize: 14, color: "#9B9590", background: "none", border: "none", cursor: "pointer", opacity: page === 0 ? 0.3 : 1 }}>Pr&eacute;c&eacute;dent</button>
          <span style={{ fontSize: 14, color: "#9B9590" }}>Page {page + 1} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} style={{ fontSize: 14, color: "#9B9590", background: "none", border: "none", cursor: "pointer", opacity: page >= totalPages - 1 ? 0.3 : 1 }}>Suivant</button>
        </div>
      )}
    </div>
  );
}
