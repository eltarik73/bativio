"use client";

import { useState } from "react";
import Link from "next/link";
import ArtisanCard from "@/components/ArtisanCard";
import type { ArtisanPublic, MetierData } from "@/lib/api";

function EmptyState({ villeNom, isFilter }: { villeNom: string; isFilter: boolean }) {
  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: "48px 32px", background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 20, textAlign: "center", boxShadow: "0 10px 30px rgba(28,28,30,.04)" }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>🏗️</div>
      <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 10, lineHeight: 1.15 }}>
        {isFilter ? `Pas encore d'artisan dans cette catégorie` : `Bativio arrive à ${villeNom}`}
      </h3>
      <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--bois-mid,#5C4A3A)", marginBottom: 28, maxWidth: 440, margin: "0 auto 28px" }}>
        {isFilter
          ? "Essayez un autre métier ou revenez bientôt — de nouveaux artisans s'inscrivent chaque semaine."
          : `Nous recrutons actuellement des artisans BTP à ${villeNom} et dans les environs. En attendant, utilisez notre assistant IA pour décrire votre projet — nous trouverons un artisan adapté dans votre zone.`}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 36 }}>
        <Link href="/demande" style={{ padding: "12px 24px", background: "var(--terre,#C4531A)", color: "#fff", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          Décrire mon projet →
        </Link>
        <Link href="/" style={{ padding: "12px 24px", background: "transparent", color: "var(--terre,#C4531A)", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid var(--terre,#C4531A)" }}>
          Voir autres villes
        </Link>
      </div>

      <div style={{ padding: "24px 24px", background: "var(--creme,#FAF8F5)", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--terre,#C4531A)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Vous êtes artisan à {villeNom} ?
        </p>
        <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5, marginBottom: 14 }}>
          Inscrivez-vous gratuitement et devenez le premier artisan référencé ici. Sans engagement, sans carte bancaire.
        </p>
        <Link href="/inscription" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", background: "var(--anthracite,#1C1C1E)", color: "#fff", borderRadius: 99, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Créer ma page artisan
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </div>
  );
}

export default function VilleClient({
  artisans,
  villeSlug,
  metiers,
  villeNom,
}: {
  artisans: ArtisanPublic[];
  villeSlug: string;
  metiers: MetierData[];
  villeNom?: string;
}) {
  const [metierFilter, setMetierFilter] = useState("all");

  const filtered = metierFilter === "all"
    ? artisans
    : artisans.filter((a) => {
        if (!a.metierNom) return false;
        const ms = a.metierNom.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
        return ms === metierFilter;
      });

  // N'afficher que les métiers réellement présents dans la liste d'artisans (évite la barre de 20+ métiers la plupart vides)
  const availableMetierSlugs = new Set(
    artisans
      .map((a) => a.metierNom?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, ""))
      .filter(Boolean)
  );
  const visibleMetiers = metiers.filter((m) => availableMetierSlugs.has(m.slug));

  return (
    <>
      {/* Filters — uniquement si au moins 1 artisan et au moins 2 métiers distincts */}
      {artisans.length > 0 && visibleMetiers.length >= 2 && (
        <div className="bg-white border-b border-g100 sticky top-14 max-md:top-[52px] z-[90]" style={{ padding: "10px 28px" }}>
          <div className="max-w-[1200px] mx-auto flex items-center gap-[6px] flex-wrap" style={{ rowGap: 8 }}>
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
            {visibleMetiers.map((m) => (
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
      )}

      {/* Grid */}
      <div className="px-7 pt-5 pb-14 max-w-[1264px] mx-auto max-md:px-4 max-md:pt-4 max-md:pb-10">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(420px,1fr))] max-[860px]:grid-cols-1 gap-4">
            {filtered.map((a) => (
              <ArtisanCard key={a.id} artisan={a} villeSlug={villeSlug} />
            ))}
          </div>
        ) : (
          <EmptyState villeNom={villeNom || villeSlug} isFilter={metierFilter !== "all"} />
        )}
      </div>
    </>
  );
}
