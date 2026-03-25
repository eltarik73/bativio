"use client";

const artisans = [
  { id: "1", nom: "Martin Plomberie", email: "jp.martin@email.com", ville: "Chambery", plan: "PRO", actif: true, date: "15/03/2026" },
  { id: "2", nom: "Elec Savoie", email: "t.girard@email.com", ville: "Chambery", plan: "ESSENTIEL", actif: true, date: "16/03/2026" },
  { id: "3", nom: "Dupont Peinture", email: "m.dupont@email.com", ville: "Chambery", plan: "GRATUIT", actif: true, date: "17/03/2026" },
  { id: "4", nom: "Alpes Maconnerie", email: "p.blanc@email.com", ville: "Chambery", plan: "PRO_PLUS", actif: true, date: "18/03/2026" },
  { id: "5", nom: "Savoie Carrelage", email: "l.moreau@email.com", ville: "Chambery", plan: "ESSENTIEL", actif: true, date: "19/03/2026" },
];

const planBadge: Record<string, string> = {
  GRATUIT: "bg-gray-100 text-gray-600",
  ESSENTIEL: "bg-or/10 text-or",
  PRO: "bg-terre/10 text-terre",
  PRO_PLUS: "bg-anthracite/10 text-anthracite",
};

export default function AdminArtisansPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-anthracite">Artisans</h1>
        <input
          type="text"
          placeholder="Rechercher..."
          className="px-4 py-2 rounded-lg border border-black/10 text-sm focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5">
                <th className="text-left px-6 py-3 text-xs font-medium text-anthracite/50 uppercase">Nom</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-anthracite/50 uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-anthracite/50 uppercase">Ville</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-anthracite/50 uppercase">Plan</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-anthracite/50 uppercase">Statut</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-anthracite/50 uppercase">Inscrit le</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {artisans.map((a) => (
                <tr key={a.id} className="border-b border-black/5 last:border-0">
                  <td className="px-6 py-4 text-sm font-medium text-anthracite">{a.nom}</td>
                  <td className="px-6 py-4 text-sm text-anthracite/60">{a.email}</td>
                  <td className="px-6 py-4 text-sm text-anthracite/60">{a.ville}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${planBadge[a.plan]}`}>
                      {a.plan.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`w-2 h-2 inline-block rounded-full ${a.actif ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="ml-2 text-sm text-anthracite/60">{a.actif ? "Actif" : "Inactif"}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-anthracite/40">{a.date}</td>
                  <td className="px-6 py-4">
                    <button className="text-xs text-terre hover:underline">Actions</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
