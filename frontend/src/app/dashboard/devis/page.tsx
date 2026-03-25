"use client";

import { useState } from "react";

const statutColors: Record<string, string> = {
  NOUVEAU: "bg-terre text-white",
  VU: "bg-or text-white",
  REPONDU: "bg-green-500 text-white",
  ARCHIVE: "bg-gray-400 text-white",
};

const mockDevis = [
  { id: "1", nomClient: "Sophie Martin", telephoneClient: "06 12 34 56 78", emailClient: "sophie@mail.fr", descriptionBesoin: "Fuite sous evier cuisine, eau qui coule en permanence", statut: "NOUVEAU", date: "25 mars 2026" },
  { id: "2", nomClient: "Pierre Durand", telephoneClient: "06 23 45 67 89", emailClient: "", descriptionBesoin: "Renovation complete salle de bains, douche italienne + double vasque", statut: "VU", date: "24 mars 2026" },
  { id: "3", nomClient: "Marie Leroy", telephoneClient: "06 34 56 78 90", emailClient: "marie.l@mail.fr", descriptionBesoin: "Remplacement chauffe-eau electrique par thermodynamique", statut: "REPONDU", date: "22 mars 2026" },
];

export default function DevisPage() {
  const [filter, setFilter] = useState("TOUS");

  const filtered = filter === "TOUS" ? mockDevis : mockDevis.filter((d) => d.statut === filter);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-anthracite mb-6">Demandes de devis</h1>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {["TOUS", "NOUVEAU", "VU", "REPONDU", "ARCHIVE"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === s ? "bg-terre text-white" : "bg-white border border-black/10 text-anthracite/60 hover:border-terre"
            }`}
          >
            {s === "TOUS" ? "Tous" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((d) => (
            <div key={d.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-anthracite">{d.nomClient}</h3>
                  <p className="text-xs text-anthracite/40 mt-0.5">{d.date}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statutColors[d.statut]}`}>
                  {d.statut}
                </span>
              </div>
              <p className="text-sm text-anthracite/70 mb-3">{d.descriptionBesoin}</p>
              <div className="flex items-center gap-4 text-sm">
                <a href={`tel:${d.telephoneClient.replace(/\s/g, "")}`} className="text-terre hover:underline">
                  {d.telephoneClient}
                </a>
                {d.emailClient && (
                  <span className="text-anthracite/50">{d.emailClient}</span>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1.5 text-xs bg-creme rounded-lg text-anthracite/60 hover:bg-terre/10 transition-colors">
                  Marquer comme vu
                </button>
                <button className="px-3 py-1.5 text-xs bg-terre/10 rounded-lg text-terre hover:bg-terre/20 transition-colors">
                  Marquer comme repondu
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-anthracite/40">Aucune demande de devis pour le moment</p>
        </div>
      )}
    </div>
  );
}
