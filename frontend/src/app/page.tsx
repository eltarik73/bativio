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
  { name: "Gratuit", price: "0€", per: "", desc: "Pour découvrir Bativio", pop: false, btn: "ghost",
    feats: ["Fiche sur l’annuaire", "Formulaire de devis", "3 photos max", "2 badges"] },
  { name: "Essentiel", price: "19€", per: "/mois", desc: "Pour être visible et joignable", pop: false, btn: "ghost",
    feats: ["10 photos + avant/après", "Badges illimités", "Agenda + RDV en ligne", "SMS rappel + relance 20min", "Réception factures PA"] },
  { name: "Pro", price: "49€", per: "/mois", desc: "Votre site vitrine complet", pop: true, btn: "fill",
    feats: ["<strong>URL perso (site vitrine)</strong>", "Photos illimitées", "QR Code + bouton Google", "Mini-CRM clients", "Transmission PA", "Export comptable"] },
  { name: "Pro+", price: "79€", per: "/mois", desc: "L’artisan boosté par l’IA", pop: false, btn: "ghost",
    feats: ["<strong>Agent IA répondeur</strong>", "<strong>Devis IA automatique</strong>", "Création factures", "Support dédié"] },
];

const TESTIMONIALS = [
  { text: "Depuis que je suis sur Bativio, j’ai 30% de demandes de devis en plus.", name: "Jean M.", role: "plombier à Chambéry", initials: "JM" },
  { text: "J’ai trouvé un électricien de confiance en 5 minutes. Travaux impeccables.", name: "Sophie L.", role: "Annecy", initials: "SL" },
  { text: "Simple, rapide, et surtout gratuit. Je recommande à tous les artisans du coin.", name: "Pierre D.", role: "peintre à Grenoble", initials: "PD" },
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
    const vs = (a.ville || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
    if (villeFilter && (!a.ville || vs !== villeFilter)) return false;
    if (metierFilter !== "all") {
      if (!a.metierNom) return false;
      const ms = (a.metierNom || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
      if (ms !== metierFilter) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!(a.nomAffichage || "").toLowerCase().includes(q) && !(a.metierNom || "").toLowerCase().includes(q) && !(a.description || "").toLowerCase().includes(q)) return false;
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
          <div className="hero-badge">&#10022; Plus de 50 artisans v&eacute;rifi&eacute;s en Rh&ocirc;ne-Alpes</div>
          <h1>Trouvez l&apos;artisan <span style={{ color: "var(--terre)" }}>id&eacute;al</span> pr&egrave;s de chez vous</h1>
          <p className="hero-sub">Des artisans de confiance, v&eacute;rifi&eacute;s et not&eacute;s par leurs clients. Devis gratuit en 24h.</p>
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
          <p className="hero-popular">&#128269; Recherches populaires : r&eacute;novation salle de bain, plombier urgent, peinture int&eacute;rieure</p>
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

      <section className="testimonials">
        <div className="testimonials-inner">
          <h2 className="testimonials-title">La confiance de nos artisans et de leurs clients</h2>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-quote">&ldquo;&rdquo;</div>
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div className="testimonial-info">
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                  <div className="testimonial-stars">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} viewBox="0 0 20 20"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z" /></svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-artisan">
        <div className="cta-artisan-inner">
          <h2>Vous &ecirc;tes artisan ? Rejoignez la 1&egrave;re plateforme de confiance en <em>Rh&ocirc;ne-Alpes</em></h2>
          <p className="cta-artisan-sub">Gratuit &middot; Sans engagement &middot; Sans carte bancaire</p>
          <Link href="/inscription" className="cta-artisan-btn">Cr&eacute;er ma page gratuitement</Link>
        </div>
      </section>

      <section className="artisan-banner" onClick={togglePricing}>
        <div className="artisan-inner">
          <div className="zero-chip">&#10022; Z&eacute;ro commission &mdash; Abonnement fixe</div>
          <h2>D&eacute;couvrez nos <em>offres</em></h2>
          <p>Choisissez le plan adapt&eacute; &agrave; votre activit&eacute;. &Eacute;voluez &agrave; tout moment.</p>
          <div className="pricing-preview">
            <div className="pricing-mini">
              <div className="pricing-mini-name">Gratuit</div>
              <div className="pricing-mini-price">0&euro;</div>
            </div>
            <div className="pricing-mini">
              <div className="pricing-mini-name">Essentiel</div>
              <div className="pricing-mini-price">19&euro;<small>/mois</small></div>
            </div>
            <div className="pricing-mini highlight">
              <div className="pricing-mini-name">Pro</div>
              <div className="pricing-mini-price">49&euro;<small>/mois</small></div>
            </div>
            <div className="pricing-mini">
              <div className="pricing-mini-name">Pro+</div>
              <div className="pricing-mini-price">79&euro;<small>/mois</small></div>
            </div>
          </div>
          <button className={`toggle-btn ${pricingOpen ? "open" : ""}`} onClick={(e) => { e.stopPropagation(); togglePricing(); }}>
            {pricingOpen ? "Masquer les offres" : "Découvrir les offres"}
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
                {p.price === "0€" ? "Commencer" : "Choisir"}
              </Link>
            </div>
          ))}
        </div>
        <div className="pricing-note">
          Pas de commission. Pas de co&ucirc;t par devis. Pas de frais cach&eacute;s. <strong style={{ color: "rgba(255,255,255,.4)" }}>Jamais.</strong>
        </div>
      </div>

      <Footer />

      {/* JSON-LD WebSite + Organization */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "WebSite", name: "Bativio", url: "https://bativio.fr", potentialAction: { "@type": "SearchAction", target: "https://bativio.fr/?search={search_term_string}", "query-input": "required name=search_term_string" } },
        { "@context": "https://schema.org", "@type": "Organization", name: "Bativio", url: "https://bativio.fr", logo: "https://bativio.fr/og-image.png", description: "La plateforme des artisans du bâtiment en Rhône-Alpes. Zéro commission.", areaServed: { "@type": "State", name: "Rhône-Alpes" } }
      ]) }} />
    </>
  );
}
