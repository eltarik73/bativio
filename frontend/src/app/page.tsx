"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ArtisanCard from "@/components/ArtisanCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MOCK_ARTISANS, MOCK_METIERS } from "@/lib/mock-data";
import { getArtisans, getMetiers } from "@/lib/api";
import type { ArtisanPublic, MetierData } from "@/lib/api";
import { VILLES } from "@/lib/constants";

const PLANS_DATA = [
  { name: "Gratuit", price: "0\u20AC", per: "", desc: "Pour d\u00e9marrer et tester", pop: false, btn: "ghost",
    feats: ["Fiche sur l\u2019annuaire", "Formulaire de devis", "3 photos max", "2 badges"] },
  { name: "Essentiel", price: "19\u20AC", per: "/mois", desc: "Visible et joignable", pop: false, btn: "ghost",
    feats: ["10 photos + avant/apr\u00e8s", "Badges illimit\u00e9s", "Agenda + RDV en ligne", "SMS rappel + relance 20min", "R\u00e9ception factures PA"] },
  { name: "Pro", price: "49\u20AC", per: "/mois", desc: "Vitrine compl\u00e8te + facturation", pop: true, btn: "fill",
    feats: ["<strong>URL perso (site vitrine)</strong>", "Photos illimit\u00e9es", "QR Code + bouton Google", "Mini-CRM clients", "Transmission PA", "Export comptable"] },
  { name: "Pro+", price: "79\u20AC", per: "/mois", desc: "Augment\u00e9 par l\u2019IA", pop: false, btn: "ghost",
    feats: ["<strong>Agent IA r\u00e9pondeur</strong>", "<strong>Devis IA automatique</strong>", "Cr\u00e9ation factures", "Support d\u00e9di\u00e9"] },
];

export default function Home() {
  const [villeFilter, setVilleFilter] = useState("");
  const [metierFilter, setMetierFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [pricingOpen, setPricingOpen] = useState(false);
  const ppRef = useRef<HTMLDivElement>(null);
  const [allArtisans, setAllArtisans] = useState<ArtisanPublic[]>(MOCK_ARTISANS);
  const [allMetiers, setAllMetiers] = useState<MetierData[]>(MOCK_METIERS);

  // Charger les vrais artisans depuis le backend
  useEffect(() => {
    getArtisans({ size: 100 })
      .then((page) => { if (page.content && page.content.length > 0) setAllArtisans(page.content); })
      .catch(() => {}); // fallback mock
    getMetiers()
      .then((m) => { if (m && m.length > 0) setAllMetiers(m); })
      .catch(() => {});
  }, []);

  const filtered = allArtisans.filter((a) => {
    const vs = a.ville.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
    if (villeFilter && vs !== villeFilter) return false;
    if (metierFilter !== "all") {
      const ms = a.metierNom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
      if (ms !== metierFilter) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!a.nomAffichage.toLowerCase().includes(q) && !a.metierNom.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const togglePricing = () => {
    const next = !pricingOpen;
    setPricingOpen(next);
    if (next) setTimeout(() => ppRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
  };

  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-inner">
          <h1>Trouvez votre <em>artisan</em> en Rh&ocirc;ne-Alpes</h1>
          <p className="hero-sub">Profils v&eacute;rifi&eacute;s &middot; Avis clients &middot; Devis gratuit &middot; Z&eacute;ro commission</p>
          <div className="search-bar">
            <select value={villeFilter} onChange={(e) => setVilleFilter(e.target.value)}>
              <option value="">Toutes les villes</option>
              {VILLES.map((v) => <option key={v.slug} value={v.slug}>{v.nom}</option>)}
            </select>
            <input
              type="text"
              placeholder="Plombier, électricien, rénovation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="search-btn">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              Rechercher
            </button>
          </div>
        </div>
      </section>

      <div className="filters">
        <div className="filters-inner hide-scroll">
          <button className={`pill ${metierFilter === "all" ? "active" : ""}`} onClick={() => setMetierFilter("all")}>Tous</button>
          {allMetiers.map((m) => (
            <button key={m.slug} className={`pill ${metierFilter === m.slug ? "active" : ""}`} onClick={() => setMetierFilter(m.slug)}>{m.nom}</button>
          ))}
          <span className="result-count">{filtered.length} artisan{filtered.length > 1 ? "s" : ""}</span>
        </div>
      </div>

      <div className="grid-wrap">
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

      <section className="artisan-banner" onClick={togglePricing}>
        <div className="artisan-inner">
          <div className="zero-chip">&#10022; Z&eacute;ro commission &mdash; Abonnement fixe</div>
          <h2>Vous &ecirc;tes <em>artisan</em> ?</h2>
          <p>Cr&eacute;ez votre page pro en 3 minutes. Soyez visible aupr&egrave;s de milliers de clients.</p>
          <button className={`toggle-btn ${pricingOpen ? "open" : ""}`} onClick={(e) => { e.stopPropagation(); togglePricing(); }}>
            {pricingOpen ? "Masquer les offres" : "D\u00e9couvrir les offres"}
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </section>

      <div ref={ppRef} className={`pricing-panel ${pricingOpen ? "open" : ""}`}>
        <div className="pricing-inner">
          {PLANS_DATA.map((p) => (
            <div key={p.name} className={`plan ${p.pop ? "pop" : ""}`}>
              {p.pop && <div className="plan-badge">Le + populaire</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-price"><span className="n">{p.price}</span>{p.per && <span className="p">{p.per}</span>}</div>
              <div className="plan-desc">{p.desc}</div>
              <ul className="plan-feat">
                {p.feats.map((f) => (
                  <li key={f}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                    <span dangerouslySetInnerHTML={{ __html: f }} />
                  </li>
                ))}
              </ul>
              <Link href="/inscription" className={`plan-btn ${p.btn}`}>
                {p.price === "0\u20AC" ? "Commencer" : "Choisir"}
              </Link>
            </div>
          ))}
        </div>
        <div className="pricing-note">
          Pas de commission. Pas de co&ucirc;t par devis. Pas de frais cach&eacute;s. <strong style={{ color: "rgba(255,255,255,.4)" }}>Jamais.</strong>
        </div>
      </div>

      <Footer />
    </>
  );
}
