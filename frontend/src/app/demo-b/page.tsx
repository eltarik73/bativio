"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnuaireBlock from "@/components/AnnuaireBlock";
import VilleAutocomplete from "@/components/VilleAutocomplete/VilleAutocomplete";
import type { CommuneResult } from "@/components/VilleAutocomplete/VilleAutocomplete";
import { fadeUp } from "@/lib/motion";

export default function DemoB() {
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
      <Navbar />

      {/* ─── HERO CONDENSÉ (juste headline + search) ─── */}
      <section style={{ background: "linear-gradient(180deg, #FAF8F5 0%, #F2EAE0 100%)", padding: "32px 32px 24px", textAlign: "center", borderBottom: "1px solid rgba(61,46,31,.06)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <motion.h1
            {...fadeUp(0)}
            style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 600, color: "var(--bois)", lineHeight: 1.2, letterSpacing: -.5, marginBottom: 16 }}
          >
            L&apos;artisan{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--terre)" }}>idéal</span>
            {" "}près de chez vous, en 24h.
          </motion.h1>
          <motion.div
            {...fadeUp(0.06)}
            className="liquid-glass search-bar"
            style={{ maxWidth: 680, borderRadius: 14, padding: 6, margin: "0 auto" }}
          >
            <div style={{ flex: 1, maxWidth: 200, minWidth: 0 }}>
              <VilleAutocomplete onSelect={handleVilleSelect} placeholder="Ville ou code postal" defaultValue={villeLabel} className="search-bar-ville" />
            </div>
            <input type="text" placeholder="Plombier, électricien, peintre…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Recherche" />
            <button className="search-btn" aria-label="Rechercher">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              Rechercher
            </button>
          </motion.div>
        </div>
      </section>

      <AnnuaireBlock search={search} villeFilter={villeFilter} villeLabel={villeLabel} villeCoords={villeCoords} />

      <Footer />
    </>
  );
}
