"use client";

import { useEffect, useState } from "react";
import ArtisanCard from "@/components/ArtisanCard";
import { MOCK_ARTISANS, MOCK_METIERS } from "@/lib/mock-data";
import { getArtisans, getMetiers } from "@/lib/api";
import type { ArtisanPublic, MetierData } from "@/lib/api";

interface Props {
  search: string;
  villeFilter: string;
  villeLabel: string;
  villeCoords: { lat: number; lon: number } | null;
  columns?: 2 | 3;
  metierForce?: string | null;
  selectionMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}

export default function AnnuaireBlock({ search, villeFilter, villeLabel, villeCoords, columns = 2, metierForce = null, selectionMode = false, selectedIds, onToggleSelect }: Props) {
  const [allArtisans, setAllArtisans] = useState<ArtisanPublic[]>(MOCK_ARTISANS);
  const [allMetiers, setAllMetiers] = useState<MetierData[]>(MOCK_METIERS);
  const [metierFilterState, setMetierFilter] = useState("all");
  const metierFilter = metierForce ?? metierFilterState;

  useEffect(() => {
    getArtisans({ size: 100 })
      .then((page) => { if (page.content && page.content.length > 0) setAllArtisans(page.content); })
      .catch(() => {});
    getMetiers()
      .then((m) => { if (m && m.length > 0) setAllMetiers(m); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (villeCoords) {
      fetch(`/api/v1/public/artisans?lat=${villeCoords.lat}&lon=${villeCoords.lon}&radius=30&size=100`)
        .then(r => r.json())
        .then(d => { if (d.data?.content?.length > 0) setAllArtisans(d.data.content); })
        .catch(() => {});
    }
  }, [villeCoords]);

  const filtered = allArtisans.filter((a) => {
    if (villeFilter && !villeCoords) {
      const vs = (a.ville || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
      if (!a.ville || vs !== villeFilter) return false;
    }
    if (metierFilter !== "all") {
      if (!a.metierNom) return false;
      const ms = (a.metierNom || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
      if (ms !== metierFilter) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!(a.nomAffichage || "").toLowerCase().includes(q) && !(a.metierNom || "").toLowerCase().includes(q) && !(a.description || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <>
      {!metierForce && (
        <div className="filters">
          <div className="filters-inner hide-scroll">
            <button className={`pill ${metierFilter === "all" ? "active" : ""}`} onClick={() => setMetierFilter("all")}>Tous</button>
            {allMetiers.map((m) => (
              <button key={m.slug} className={`pill ${metierFilter === m.slug ? "active" : ""}`} onClick={() => setMetierFilter(m.slug)}>{m.nom}</button>
            ))}
            <span className="result-count">{filtered.length} artisan{filtered.length > 1 ? "s" : ""}{villeLabel ? ` à ${villeLabel}` : ""}</span>
          </div>
        </div>
      )}
      <div className="grid-wrap">
        <div className={columns === 3 ? "grid-3" : "grid"}>
          {filtered.length > 0 ? (
            filtered.map((a) => {
              const isSelected = selectedIds?.has(a.id || "") ?? false;
              if (!selectionMode) return <ArtisanCard key={a.id} artisan={a} />;
              return (
                <div
                  key={a.id}
                  onClick={() => onToggleSelect?.(a.id || "")}
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    borderRadius: 16,
                    transition: "all .25s",
                    transform: isSelected ? "translateY(-3px)" : undefined,
                    boxShadow: isSelected ? "0 0 0 3px var(--terre), 0 12px 32px rgba(196,83,26,.18)" : undefined,
                  }}
                >
                  <ArtisanCard artisan={a} />
                  <div style={{ position: "absolute", top: 12, right: 12, zIndex: 5, width: 32, height: 32, borderRadius: "50%", background: isSelected ? "var(--terre)" : "rgba(255,255,255,.95)", border: isSelected ? "none" : "1px solid var(--g200)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
                    {isSelected && <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" /></svg>}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty">
              <h3>Aucun artisan trouvé</h3>
              <p>Essayez avec d&apos;autres critères.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
