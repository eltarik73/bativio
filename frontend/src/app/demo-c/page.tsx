"use client";

import { useState } from "react";
import Link from "next/link";
import AnnuaireBlock from "@/components/AnnuaireBlock";
import Footer from "@/components/Footer";
import VilleAutocomplete from "@/components/VilleAutocomplete/VilleAutocomplete";
import type { CommuneResult } from "@/components/VilleAutocomplete/VilleAutocomplete";

export default function DemoC() {
  const [search, setSearch] = useState("");
  const [villeFilter, setVilleFilter] = useState("");
  const [villeLabel, setVilleLabel] = useState("");
  const [villeCoords, setVilleCoords] = useState<{ lat: number; lon: number } | null>(null);

  const handleVilleSelect = (commune: CommuneResult) => {
    const slug = commune.slug || commune.nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
    setVilleFilter(slug);
    setVilleLabel(commune.nom);
    if (commune.latitude && commune.longitude) setVilleCoords({ lat: commune.latitude, lon: commune.longitude });
  };

  return (
    <>
      {/* ─── NAV CUSTOM AVEC SEARCH BAR INTÉGRÉE ─── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,248,245,.95)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(28,28,30,.06)", padding: "10px 24px", display: "flex", alignItems: "center", gap: 16, height: 68 }}>
        <Link href="/" style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "var(--terre)", letterSpacing: -.5, flexShrink: 0 }}>
          Bativio
        </Link>

        <div className="liquid-glass search-bar" style={{ flex: 1, maxWidth: 720, borderRadius: 12, padding: 4, margin: 0 }}>
          <div style={{ flex: 1, maxWidth: 180, minWidth: 0 }}>
            <VilleAutocomplete onSelect={handleVilleSelect} placeholder="Ville" defaultValue={villeLabel} className="search-bar-ville" />
          </div>
          <input type="text" placeholder="Plombier, électricien…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: "9px 12px", fontSize: 13 }} aria-label="Recherche" />
          <button className="search-btn" style={{ padding: "9px 18px", fontSize: 13 }} aria-label="Rechercher">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            OK
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <Link href="/inscription" style={{ fontSize: 13, fontWeight: 500, color: "var(--g500)" }}>Je suis artisan</Link>
          <Link href="/connexion" style={{ fontSize: 13, fontWeight: 500, color: "var(--g500)" }}>Connexion</Link>
        </div>
      </nav>

      {/* Bandeau résultats */}
      <div style={{ background: "var(--blanc)", padding: "14px 24px", borderBottom: "1px solid var(--g100)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "var(--bois)", letterSpacing: -.3 }}>
            Artisans {villeLabel ? `à ${villeLabel}` : "en Rhône-Alpes"}
          </h1>
          <div style={{ fontSize: 12, color: "var(--pierre)" }}>Triés par proximité • Mis à jour aujourd&apos;hui</div>
        </div>
      </div>

      <AnnuaireBlock search={search} villeFilter={villeFilter} villeLabel={villeLabel} villeCoords={villeCoords} />

      <Footer />
    </>
  );
}
