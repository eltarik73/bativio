"use client";

import Link from "next/link";

const stats = [
  { label: "Vues ce mois", value: "124", color: "text-anthracite" },
  { label: "Demandes de devis", value: "8", color: "text-terre" },
  { label: "RDV ce mois", value: "3", color: "text-or" },
  { label: "Note moyenne", value: "4.8", color: "text-terre" },
];

const recentDevis = [
  { id: "1", nom: "Sophie Martin", date: "Il y a 2h", statut: "NOUVEAU", description: "Fuite sous evier cuisine" },
  { id: "2", nom: "Pierre Durand", date: "Hier", statut: "VU", description: "Renovation salle de bains complete" },
  { id: "3", nom: "Marie Leroy", date: "Il y a 3 jours", statut: "REPONDU", description: "Installation chauffe-eau" },
];

const statutColors: Record<string, string> = {
  NOUVEAU: "bg-terre",
  VU: "bg-or",
  REPONDU: "bg-green-500",
  ARCHIVE: "bg-gray-400",
};

export default function DashboardPage() {
  return (
    <div>
      {/* Profile completion */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#E5E7EB" strokeWidth="4" />
              <circle
                cx="32" cy="32" r="28" fill="none" stroke="#C4531A" strokeWidth="4"
                strokeDasharray={`${85 * 1.76} 176`} strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-terre">85%</span>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-anthracite">Profil presque complet</h2>
            <p className="text-sm text-anthracite/50">Ajoutez des photos pour atteindre 100%</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
            <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-anthracite/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent devis */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-anthracite">Dernieres demandes</h2>
          <Link href="/dashboard/devis" className="text-sm text-terre hover:underline">Voir tout</Link>
        </div>
        <div className="space-y-3">
          {recentDevis.map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-3 bg-creme rounded-lg">
              <div className={`w-2 h-2 rounded-full ${statutColors[d.statut]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-anthracite truncate">{d.nom}</p>
                <p className="text-xs text-anthracite/50 truncate">{d.description}</p>
              </div>
              <span className="text-xs text-anthracite/40 whitespace-nowrap">{d.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Ajouter photos", href: "/dashboard/photos", icon: "&#128247;" },
          { label: "Modifier profil", href: "/dashboard/profil", icon: "&#9998;" },
          { label: "Partager ma page", href: "#", icon: "&#128279;" },
          { label: "Voir ma page", href: "/chambery/martin-plomberie", icon: "&#128065;" },
        ].map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="bg-white rounded-xl p-5 shadow-sm text-center card-hover"
          >
            <span className="text-2xl" dangerouslySetInnerHTML={{ __html: a.icon }} />
            <p className="mt-2 text-sm text-anthracite/70">{a.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
