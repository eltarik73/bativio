"use client";

import { useState } from "react";
import Link from "next/link";
import ArtisanCard from "@/components/ArtisanCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MOCK_ARTISANS, MOCK_METIERS } from "@/lib/mock-data";
import { VILLES, PLANS } from "@/lib/constants";

const CHECK = <svg className="w-[13px] h-[13px] text-or flex-shrink-0 mt-[1px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>;

export default function Home() {
  const [villeFilter, setVilleFilter] = useState("");
  const [metierFilter, setMetierFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [pricingOpen, setPricingOpen] = useState(false);

  const filtered = MOCK_ARTISANS.filter((a) => {
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

  return (
    <>
    <Navbar />
    <main>
      <section className="bg-anthracite px-7 pt-10 pb-12 max-md:px-4 max-md:pt-7 max-md:pb-9 relative overflow-hidden">
        <div className="absolute -top-[120px] -right-[80px] w-[400px] h-[400px] rounded-full bg-[rgba(196,83,26,.06)]" />
        <div className="absolute -bottom-[100px] -left-[60px] w-[340px] h-[340px] rounded-full bg-[rgba(232,168,76,.04)]" />
        <div className="max-w-[680px] mx-auto text-center relative z-[1]">
          <h1 className="font-display text-[clamp(26px,4vw,38px)] font-bold text-white leading-[1.15] tracking-[-0.5px] mb-2">
            Trouvez votre <em className="not-italic text-or">artisan</em> en Rhone-Alpes
          </h1>
          <p className="text-sm text-white/40 mb-6">
            Profils verifies &middot; Avis clients &middot; Devis gratuit &middot; Zero commission
          </p>
          <div className="flex gap-[6px] bg-white/[.07] border border-white/[.08] rounded-xl p-[5px] max-w-[580px] mx-auto max-md:flex-col">
            <select
              value={villeFilter}
              onChange={(e) => setVilleFilter(e.target.value)}
              className="flex-1 max-w-[170px] max-md:max-w-full px-[14px] py-[11px] rounded-lg font-body text-[13px] bg-white text-g500 outline-none border-none cursor-pointer"
            >
              <option value="">Toutes les villes</option>
              {VILLES.map((v) => (
                <option key={v.slug} value={v.slug}>{v.nom}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Plombier, electricien, renovation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-[14px] py-[11px] rounded-lg font-body text-[13px] bg-white text-anthracite outline-none border-none min-w-0"
            />
            <button className="bg-terre text-white px-[22px] py-[11px] rounded-lg text-[13px] font-semibold transition-all hover:bg-terre-light whitespace-nowrap flex items-center gap-[6px]">
              <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="px-7 py-3 bg-white border-b border-g100 sticky top-14 max-md:top-[52px] z-[90] max-md:px-4 max-md:py-[10px]">
        <div className="max-w-[1200px] mx-auto flex items-center gap-[6px] overflow-x-auto hide-scroll">
          <button
            onClick={() => setMetierFilter("all")}
            className={`px-[14px] py-[7px] rounded-[20px] text-xs font-medium border whitespace-nowrap transition-all duration-150 ${
              metierFilter === "all"
                ? "bg-anthracite text-white border-anthracite"
                : "border-g200 text-g500 hover:border-g300 hover:text-anthracite bg-transparent"
            }`}
          >
            Tous
          </button>
          {MOCK_METIERS.map((m) => (
            <button
              key={m.slug}
              onClick={() => setMetierFilter(m.slug)}
              className={`px-[14px] py-[7px] rounded-[20px] text-xs font-medium border whitespace-nowrap transition-all duration-150 ${
                metierFilter === m.slug
                  ? "bg-anthracite text-white border-anthracite"
                  : "border-g200 text-g500 hover:border-g300 hover:text-anthracite bg-transparent"
              }`}
            >
              {m.nom}
            </button>
          ))}
          <span className="ml-auto text-xs text-g400 whitespace-nowrap font-medium">
            {filtered.length} artisan{filtered.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="px-7 pt-5 pb-14 max-w-[1264px] mx-auto max-md:px-4 max-md:pt-4 max-md:pb-10">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(420px,1fr))] max-[860px]:grid-cols-1 gap-4">
            {filtered.map((a) => (
              <ArtisanCard key={a.id} artisan={a} />
            ))}
          </div>
        ) : (
          <div className="text-center py-14">
            <h3 className="font-display text-lg mb-[6px]">Aucun artisan trouve</h3>
            <p className="text-[13px] text-g400">Essayez avec d&apos;autres criteres.</p>
          </div>
        )}
      </div>

      {/* Artisan Banner */}
      <section
        className="bg-anthracite px-7 py-12 max-md:px-4 max-md:py-9 text-center relative overflow-hidden cursor-pointer transition-colors hover:bg-[#252527]"
        onClick={() => setPricingOpen(!pricingOpen)}
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(120deg,transparent,transparent_60px,rgba(255,255,255,.008)_60px,rgba(255,255,255,.008)_120px)] pointer-events-none" />
        <div className="max-w-[600px] mx-auto relative z-[1]">
          <div className="inline-flex items-center gap-[5px] bg-[rgba(232,168,76,.1)] text-or text-xs font-semibold px-[14px] py-[5px] rounded-[20px] mb-4">
            &#10022; Zero commission — Abonnement fixe
          </div>
          <h2 className="font-display text-[clamp(22px,3.5vw,32px)] font-bold text-white mb-2 leading-[1.2]">
            Vous etes <em className="not-italic text-or">artisan</em> ?
          </h2>
          <p className="text-sm text-white/40 mb-5">
            Creez votre page pro en 3 minutes. Soyez visible aupres de milliers de clients.
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); setPricingOpen(!pricingOpen); }}
            className="inline-flex items-center gap-2 bg-terre text-white text-sm font-semibold px-7 py-3 rounded-[10px] transition-all hover:bg-terre-light hover:-translate-y-[2px]"
          >
            {pricingOpen ? "Masquer les offres" : "Decouvrir les offres"}
            <svg className={`w-4 h-4 transition-transform duration-300 ${pricingOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </section>

      {/* Pricing Panel */}
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(.22,1,.36,1)] bg-[#18181a] ${
          pricingOpen ? "max-h-[1200px]" : "max-h-0"
        }`}
      >
        <div className="max-w-[1080px] mx-auto px-7 pt-2 pb-10 grid grid-cols-4 gap-3 max-[1024px]:grid-cols-2 max-md:grid-cols-1 max-md:max-w-[340px] max-md:px-4">
          {PLANS.map((plan) => {
            const isPop = "populaire" in plan && plan.populaire;
            return (
              <div
                key={plan.id}
                className={`bg-white/[.03] border rounded-[14px] px-[18px] py-6 flex flex-col transition-all hover:bg-white/[.05] hover:border-white/10 ${
                  isPop ? "border-2 border-terre bg-[rgba(196,83,26,.05)] relative" : "border-white/[.06]"
                }`}
              >
                {isPop && (
                  <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 bg-terre text-white text-[9px] font-semibold px-3 py-[3px] rounded-[20px] whitespace-nowrap uppercase tracking-[0.5px]">
                    Le + populaire
                  </div>
                )}
                <div className="font-display text-[17px] font-semibold text-white">{plan.nom}</div>
                <div className="flex items-baseline gap-[2px] mt-[6px] mb-[3px]">
                  <span className="font-display text-[30px] font-bold text-white">
                    {plan.prix === 0 ? "0\u20AC" : `${plan.prix}\u20AC`}
                  </span>
                  {plan.prix > 0 && <span className="text-xs text-white/35">/mois</span>}
                </div>
                <div className="text-[11px] text-white/30 mb-4 leading-[1.4]">{plan.description}</div>
                <ul className="flex-1 mb-[18px] space-y-0">
                  {plan.features.map((f) => (
                    <li key={f} className="text-[11px] py-[3px] flex items-start gap-[5px] text-white/50">
                      {CHECK}
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/inscription"
                  className={`block text-center py-[10px] rounded-lg text-xs font-semibold transition-all ${
                    isPop
                      ? "bg-terre text-white hover:bg-terre-light"
                      : "border border-white/[.12] text-white/60 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {plan.prix === 0 ? "Commencer" : "Choisir"}
                </Link>
              </div>
            );
          })}
        </div>
        <div className="text-center px-7 pb-8 text-xs text-white/25 bg-[#18181a]">
          Pas de commission. Pas de cout par devis. Pas de frais caches. <strong className="text-white/40">Jamais.</strong>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
