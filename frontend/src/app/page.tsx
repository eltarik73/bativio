"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ArtisanCard from "@/components/ArtisanCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MOCK_ARTISANS, MOCK_METIERS } from "@/lib/mock-data";
import { getArtisans, getMetiers } from "@/lib/api";
import { safeJsonLd } from "@/lib/html-escape";
import type { ArtisanPublic, MetierData } from "@/lib/api";
import { VILLES } from "@/lib/constants";
import VilleAutocomplete from "@/components/VilleAutocomplete/VilleAutocomplete";
import type { CommuneResult } from "@/components/VilleAutocomplete/VilleAutocomplete";
import { fadeUp } from "@/lib/motion";

const TESTIMONIALS = [
  { text: "J'ai trouvé un électricien de confiance en 5 minutes. Travaux impeccables.", name: "Sophie L.", role: "Particulier, Annecy", initials: "SL" },
  { text: "Depuis que je suis sur Bativio, j'ai 30% de demandes de devis en plus.", name: "Jean M.", role: "Plombier, Chambéry", initials: "JM" },
  { text: "Simple, rapide, et surtout gratuit. Je recommande à tous les artisans du coin.", name: "Pierre D.", role: "Peintre, Grenoble", initials: "PD" },
];

const TRUST = [
  { icon: <svg width="24" height="24" fill="none" stroke="#4A6741" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, label: "Artisans vérifiés", bg: "#E8F0E6" },
  { icon: <svg width="24" height="24" fill="none" stroke="#C9943A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" /></svg>, label: "Avis réels", bg: "#FDF5E8" },
  { icon: <svg width="24" height="24" fill="none" stroke="#C4531A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, label: "Devis en 24h", bg: "rgba(196,83,26,.08)" },
  { icon: <svg width="24" height="24" fill="none" stroke="#3D2E1F" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>, label: "Zéro commission", bg: "rgba(61,46,31,.06)" },
];

const STEPS = [
  { n: "1", title: "Décrivez votre besoin", desc: "Choisissez un métier, une ville, et décrivez votre projet en quelques mots." },
  { n: "2", title: "Comparez les artisans", desc: "Consultez les profils, photos, avis et badges de qualification." },
  { n: "3", title: "Recevez votre devis", desc: "Contactez l'artisan de votre choix. Réponse sous 24h garantie." },
];

export default function Home() {
  const [villeFilter, setVilleFilter] = useState("");
  const [villeLabel, setVilleLabel] = useState("");
  const [villeCoords, setVilleCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [metierFilter, setMetierFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [allArtisans, setAllArtisans] = useState<ArtisanPublic[]>(MOCK_ARTISANS);
  const [allMetiers, setAllMetiers] = useState<MetierData[]>(MOCK_METIERS);

  const handleVilleSelect = (commune: CommuneResult) => {
    const slug = commune.slug || commune.nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
    setVilleFilter(slug);
    setVilleLabel(commune.nom);
    if (commune.latitude && commune.longitude) {
      setVilleCoords({ lat: commune.latitude, lon: commune.longitude });
      // Fetch artisans by proximity
      fetch(`/api/v1/public/artisans?lat=${commune.latitude}&lon=${commune.longitude}&radius=30&size=100`)
        .then(r => r.json())
        .then(d => { if (d.data?.content?.length > 0) setAllArtisans(d.data.content); })
        .catch(() => {});
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`/api/v1/public/geo/communes?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&limit=1`);
          const json = await res.json();
          if (json.success && json.data?.length > 0) {
            handleVilleSelect(json.data[0]);
            sessionStorage.setItem('bativio_commune', JSON.stringify(json.data[0]));
            sessionStorage.setItem('bativio_coords', JSON.stringify({ lat: pos.coords.latitude, lon: pos.coords.longitude }));
          }
        } catch {
          // silently fail
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    const cached = sessionStorage.getItem('bativio_commune');
    if (cached) {
      try {
        const commune = JSON.parse(cached);
        handleVilleSelect(commune);
      } catch {}
    }

    getArtisans({ size: 100 })
      .then((page) => { if (page.content && page.content.length > 0) setAllArtisans(page.content); })
      .catch(() => {});
    getMetiers()
      .then((m) => { if (m && m.length > 0) setAllMetiers(m); })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = allArtisans.filter((a) => {
    // If we have coords, the API already filtered by proximity — don't filter by slug
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
      <a href="#contenu-principal" className="skip-link">Aller au contenu</a>
      <Navbar />

      <main id="contenu-principal">

      {/* ─── HERO CINEMATIC ─── */}
      <section className="hero-cinematic hero-grain" style={{ padding: "80px 32px 72px", textAlign: "center", overflow: "hidden" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div
            {...fadeUp(0)}
            className="liquid-glass"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, marginBottom: 22, fontSize: 12, fontWeight: 600, color: "var(--terre-deep)", letterSpacing: 0.3 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terre)" }} />
            Artisans locaux v&eacute;rifi&eacute;s &mdash; Rh&ocirc;ne-Alpes
          </motion.div>
          <motion.h1
            {...fadeUp(0.08)}
            style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(34px,5.5vw,56px)", fontWeight: 600, color: "var(--bois)", lineHeight: 1.05, letterSpacing: -1, marginBottom: 18 }}
          >
            Trouvez l&apos;artisan{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--terre)", fontFamily: "'Fraunces',serif" }}>id&eacute;al</span>
            <br />
            pr&egrave;s de chez vous.
          </motion.h1>
          <motion.p
            {...fadeUp(0.16)}
            style={{ fontSize: 17, color: "var(--bois-mid)", marginBottom: 28, lineHeight: 1.6, maxWidth: 560, margin: "0 auto 28px" }}
          >
            Des artisans de confiance, v&eacute;rifi&eacute;s et not&eacute;s par leurs clients. Devis gratuit en 24h, z&eacute;ro commission.
          </motion.p>

          {/* ─── 2 OPTIONS ─── */}
          <motion.div
            {...fadeUp(0.2)}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 640, margin: "0 auto 20px" }}
            className="max-md:!grid-cols-1"
          >
            <a
              href="#annuaire"
              onClick={(e) => { e.preventDefault(); document.getElementById("annuaire")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              className="liquid-glass"
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: 14, textDecoration: "none", cursor: "pointer", transition: "all .2s" }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(196,83,26,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" fill="none" stroke="var(--terre)" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 600, color: "var(--bois)" }}>Chercher un artisan</div>
                <div style={{ fontSize: 12, color: "var(--bois-mid)", marginTop: 2 }}>Annuaire par m&eacute;tier et ville</div>
              </div>
              <svg width="16" height="16" fill="none" stroke="var(--terre)" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
            </a>

            <Link
              href="/demande"
              className="liquid-glass"
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: 14, textDecoration: "none", cursor: "pointer", transition: "all .2s", background: "linear-gradient(135deg, rgba(196,83,26,.08), rgba(201,148,58,.04))", border: "1px solid rgba(196,83,26,.15)" }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, var(--terre), var(--or))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v12" /><path d="m8 13 3 3 7-7" /></svg>
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 600, color: "var(--bois)" }}>
                  D&eacute;crire mon projet{" "}
                  <span style={{ fontSize: 10, background: "var(--terre)", color: "#fff", padding: "2px 6px", borderRadius: 5, verticalAlign: "middle", marginLeft: 4, letterSpacing: 0.5 }}>IA</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--bois-mid)", marginTop: 2 }}>5 questions, devis estim&eacute; en 2 min</div>
              </div>
              <svg width="16" height="16" fill="none" stroke="var(--terre)" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
            </Link>
          </motion.div>

          <motion.div
            {...fadeUp(0.26)}
            style={{ fontSize: 11, color: "var(--pierre)", marginBottom: 24, letterSpacing: 0.3, textTransform: "uppercase", fontWeight: 600 }}
          >
            ou
          </motion.div>

          <motion.div
            {...fadeUp(0.3)}
            className="liquid-glass search-bar"
            style={{ maxWidth: 640, borderRadius: 16, padding: 8 }}
          >
            <div style={{ flex: 1, maxWidth: 200, minWidth: 0 }}>
              <VilleAutocomplete
                onSelect={handleVilleSelect}
                placeholder="Ville ou code postal"
                defaultValue={villeLabel}
                className="search-bar-ville"
              />
            </div>
            <input
              type="text"
              placeholder="Plombier, &eacute;lectricien, r&eacute;novation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Recherche de m&eacute;tier ou service"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="search-btn"
              aria-label="Rechercher des artisans"
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              Rechercher
            </motion.button>
          </motion.div>
          <motion.div
            {...fadeUp(0.32)}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 16, flexWrap: "wrap" }}
          >
            <button onClick={handleLocate} disabled={locating} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--terre)", background: "none", border: "none", cursor: "pointer", fontWeight: 500, fontFamily: "'Karla',sans-serif" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              {locating ? "Localisation..." : "Me localiser"}
            </button>
            {villeFilter && (
              <button onClick={() => { setVilleFilter(""); setVilleLabel(""); setVilleCoords(null); getArtisans({ size: 100 }).then(p => { if (p.content?.length) setAllArtisans(p.content); }).catch(() => {}); }} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--pierre)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Karla',sans-serif" }}>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                Toutes les villes
              </button>
            )}
          </motion.div>
          <motion.p
            {...fadeUp(0.4)}
            style={{ fontSize: 13, color: "var(--pierre)", marginTop: 12 }}
          >
            Recherches populaires : <Link href="/chambery" style={{ color: "var(--argile)", fontWeight: 500 }}>r&eacute;novation salle de bain</Link>, <Link href="/chambery" style={{ color: "var(--argile)", fontWeight: 500 }}>plombier urgent</Link>, <Link href="/chambery" style={{ color: "var(--argile)", fontWeight: 500 }}>peinture int&eacute;rieure</Link>
          </motion.p>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section style={{ background: "var(--creme)", padding: "24px 32px", borderTop: "1px solid var(--sable)", borderBottom: "1px solid var(--sable)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {TRUST.map((t) => (
            <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.icon}</div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--bois)" }}>{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FILTERS ─── */}
      <div id="annuaire" className="filters" style={{ scrollMarginTop: 80 }}>
        <div className="filters-inner hide-scroll">
          <button className={`pill ${metierFilter === "all" ? "active" : ""}`} onClick={() => setMetierFilter("all")}>Tous</button>
          {allMetiers.map((m) => (
            <button key={m.slug} className={`pill ${metierFilter === m.slug ? "active" : ""}`} onClick={() => setMetierFilter(m.slug)}>{m.nom}</button>
          ))}
          <span className="result-count">{filtered.length} artisan{filtered.length > 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* ─── ARTISANS GRID ─── */}
      <div className="grid-wrap">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "var(--bois)" }}>
            Artisans en <span className="calli">Rh&ocirc;ne-Alpes</span>
          </h2>
          <p style={{ fontSize: 14, color: "var(--pierre)", marginTop: 6 }}>Chamb&eacute;ry &middot; Annecy &middot; Grenoble &middot; Lyon &middot; Valence</p>
        </div>
        <div className="grid">
          {filtered.length > 0 ? (
            filtered.map((a) => <ArtisanCard key={a.id} artisan={a} />)
          ) : (
            <div className="empty">
              <h3>Aucun artisan trouv&eacute;</h3>
              <p>Essayez avec d&apos;autres crit&egrave;res.</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── COMMENT ÇA MARCHE ─── */}
      <section style={{ background: "var(--blanc)", padding: "88px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <motion.div {...fadeUp(0)} style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "var(--pierre)", marginBottom: 14 }}>Process</div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4.5vw,42px)", fontWeight: 600, color: "var(--bois)", letterSpacing: -0.5, lineHeight: 1.1 }}>
              Trois &eacute;tapes,{" "}
              <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--terre)" }}>z&eacute;ro friction</span>
            </h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }}>
            {STEPS.map((s, i) => (
              <motion.div key={s.n} {...fadeUp(i * 0.1)} style={{ textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", border: "1.5px solid var(--terre)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 600, color: "var(--terre)", marginBottom: 18, background: "rgba(196,83,26,.04)" }}>{s.n}</div>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "var(--bois)", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "var(--bois-mid)", lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TÉMOIGNAGES ─── */}
      <section style={{ background: "var(--creme)", padding: "88px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", right: "-80px", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,83,26,.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <motion.div {...fadeUp(0)} style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "var(--pierre)", marginBottom: 14 }}>T&eacute;moignages</div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4.5vw,42px)", fontWeight: 600, color: "var(--bois)", letterSpacing: -0.5, lineHeight: 1.1 }}>
              La confiance{" "}
              <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--terre)" }}>partag&eacute;e</span>
              <br />
              de nos clients.
            </h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp(i * 0.1)}
                className="liquid-glass"
                style={{
                  borderRadius: 20,
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  transform: i === 1 ? "translateY(-16px)" : undefined,
                }}
              >
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} width="16" height="16" viewBox="0 0 20 20" fill="var(--or)"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z" /></svg>
                  ))}
                </div>
                <p style={{ fontFamily: "'Fraunces',serif", fontSize: 17, color: "var(--bois)", lineHeight: 1.55, fontWeight: 400, flex: 1, letterSpacing: -0.2 }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(61,46,31,.08)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--terre), var(--argile))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 600, color: "#fff" }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--bois)" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--pierre)" }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VILLES ─── */}
      <section style={{ background: "var(--bois)", padding: "64px 32px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,4vw,32px)", fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 8 }}>
            Artisans disponibles en <span className="calli" style={{ color: "var(--argile)" }}>Rh&ocirc;ne-Alpes</span>
          </h2>
          <p style={{ textAlign: "center", fontSize: 15, color: "rgba(255,255,255,.5)", marginBottom: 36 }}>
            S&eacute;lectionnez votre ville
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {VILLES.map((v) => (
              <Link key={v.slug} href={`/${v.slug}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 12px", borderBottom: "1px solid rgba(255,255,255,.08)", color: "#fff", fontSize: 16, fontWeight: 500, transition: "all .2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "20px"; e.currentTarget.style.color = "var(--argile)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "12px"; e.currentTarget.style.color = "#fff"; }}
              >
                <span>{v.nom}</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BANDEAU ARTISAN ─── */}
      <section style={{ background: "var(--sable-light)", padding: "48px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "var(--bois)", marginBottom: 8 }}>
            Vous &ecirc;tes <span className="calli">artisan</span> ?
          </h2>
          <p style={{ fontSize: 15, color: "var(--bois-mid)", marginBottom: 20 }}>
            Rejoignez la 1&egrave;re plateforme de confiance en Rh&ocirc;ne-Alpes. Zéro commission.
          </p>
          <Link href="/artisan" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "var(--bois)", color: "#fff", borderRadius: 99, fontSize: 15, fontWeight: 600, transition: "all .2s" }}>
            D&eacute;couvrir l&apos;offre artisan
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      </main>

      <Footer />

      {/* JSON-LD WebSite + Organization */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd([
        { "@context": "https://schema.org", "@type": "WebSite", name: "Bativio", url: "https://www.bativio.fr", potentialAction: { "@type": "SearchAction", target: "https://www.bativio.fr/?search={search_term_string}", "query-input": "required name=search_term_string" } },
        { "@context": "https://schema.org", "@type": "Organization", name: "Bativio", url: "https://www.bativio.fr", logo: "https://www.bativio.fr/og-image.png", description: "La plateforme des artisans du bâtiment en Rhône-Alpes. Zéro commission.", areaServed: { "@type": "State", name: "Rhône-Alpes" } }
      ]) }} />
    </>
  );
}
