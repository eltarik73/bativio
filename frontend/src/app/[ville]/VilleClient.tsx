"use client";

import { useState } from "react";
import ArtisanCard from "@/components/ArtisanCard";
import type { ArtisanPublic, MetierData } from "@/lib/api";

export default function VilleClient({
  artisans,
  villeSlug,
  metiers,
}: {
  artisans: ArtisanPublic[];
  villeSlug: string;
  metiers: MetierData[];
}) {
  const [metierFilter, setMetierFilter] = useState("all");

  const filtered = metierFilter === "all"
    ? artisans
    : artisans.filter((a) => {
        const ms = a.metierNom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
        return ms === metierFilter;
      });

  return (
    <>
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
          {metiers.map((m) => (
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
              <ArtisanCard key={a.id} artisan={a} villeSlug={villeSlug} />
            ))}
          </div>
        ) : (
          <div className="text-center py-14">
            <h3 className="font-display text-lg mb-[6px]">Aucun artisan trouve</h3>
            <p className="text-[13px] text-g400">De nouveaux artisans s&apos;inscrivent chaque semaine.</p>
          </div>
        )}
      </div>
    </>
  );
}
