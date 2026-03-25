"use client";

import { METIERS } from "@/lib/constants";

export default function AdminMetiersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-anthracite">Metiers</h1>
        <button className="px-4 py-2 bg-terre text-white rounded-lg text-sm font-medium hover:bg-terre-light transition-colors">
          Ajouter un metier
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/5">
              <th className="text-left px-6 py-3 text-xs font-medium text-anthracite/50 uppercase">Icone</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-anthracite/50 uppercase">Nom</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-anthracite/50 uppercase">Slug</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {METIERS.map((m) => (
              <tr key={m.slug} className="border-b border-black/5 last:border-0">
                <td className="px-6 py-4 text-2xl">{m.icone}</td>
                <td className="px-6 py-4 text-sm font-medium text-anthracite">{m.nom}</td>
                <td className="px-6 py-4 text-sm text-anthracite/40 font-mono">{m.slug}</td>
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
