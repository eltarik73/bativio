"use client";

const villes = [
  { id: "1", nom: "Chambéry", slug: "chambery", departement: "Savoie", artisans: 5, actif: true },
  { id: "2", nom: "Annecy", slug: "annecy", departement: "Haute-Savoie", artisans: 0, actif: true },
  { id: "3", nom: "Grenoble", slug: "grenoble", departement: "Isère", artisans: 0, actif: true },
  { id: "4", nom: "Lyon", slug: "lyon", departement: "Rhône", artisans: 0, actif: true },
  { id: "5", nom: "Valence", slug: "valence", departement: "Drôme", artisans: 0, actif: true },
];

export default function AdminVillesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-anthracite">Villes</h1>
        <button className="px-4 py-2 bg-terre text-white rounded-lg text-sm font-medium hover:bg-terre-light transition-colors">
          Ajouter une ville
        </button>
      </div>

      <div className="bg-white rounded-[14px] border border-g100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-g100">
              <th className="text-left px-6 py-3 text-xs font-medium text-g400 uppercase">Nom</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-g400 uppercase">Slug</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-g400 uppercase">Departement</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-g400 uppercase">Artisans</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-g400 uppercase">Statut</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {villes.map((v) => (
              <tr key={v.id} className="border-b border-g100 last:border-0">
                <td className="px-6 py-4 text-sm font-medium text-anthracite">{v.nom}</td>
                <td className="px-6 py-4 text-sm text-g300 font-mono">{v.slug}</td>
                <td className="px-6 py-4 text-sm text-g500">{v.departement}</td>
                <td className="px-6 py-4 text-sm text-g500">{v.artisans}</td>
                <td className="px-6 py-4">
                  <button className={`px-3 py-1 rounded-full text-xs font-medium ${v.actif ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {v.actif ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button className="text-xs text-terre hover:underline">Modifier</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
