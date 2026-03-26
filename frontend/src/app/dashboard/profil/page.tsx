"use client";

import { useState } from "react";

export default function ProfilPage() {
  const [form, setForm] = useState({
    nomAffichage: "Martin Plomberie",
    description: "Plombier a Chambery depuis 15 ans, specialise en renovation de salles de bains.",
    telephone: "04 79 12 34 56",
    adresse: "Chambery",
    codePostal: "73000",
    experienceAnnees: "15",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-anthracite mb-6">Mon profil</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-[14px] p-6 border border-g100">
          <h2 className="font-display text-lg font-bold text-anthracite mb-4">Informations</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-anthracite mb-1">Nom d&apos;affichage</label>
              <input
                type="text"
                value={form.nomAffichage}
                onChange={(e) => update("nomAffichage", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-g200 focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-anthracite mb-1">Telephone</label>
              <input
                type="tel"
                value={form.telephone}
                onChange={(e) => update("telephone", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-g200 focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-anthracite mb-1">Adresse</label>
              <input
                type="text"
                value={form.adresse}
                onChange={(e) => update("adresse", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-g200 focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-anthracite mb-1">Experience (annees)</label>
              <input
                type="number"
                value={form.experienceAnnees}
                onChange={(e) => update("experienceAnnees", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-g200 focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[14px] p-6 border border-g100">
          <h2 className="font-display text-lg font-bold text-anthracite mb-4">Description</h2>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-g200 focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none resize-none"
          />
        </div>

        <div className="bg-white rounded-[14px] p-6 border border-g100">
          <h2 className="font-display text-lg font-bold text-anthracite mb-4">Badges</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {["RGE", "Qualibat", "Assurance decennale"].map((b) => (
              <span key={b} className="frosted px-3 py-1.5 rounded-full text-sm text-anthracite border border-g100">
                {b}
              </span>
            ))}
          </div>
          <button className="text-sm text-terre hover:underline">+ Ajouter un badge</button>
        </div>

        <div className="bg-white rounded-[14px] p-6 border border-g100">
          <h2 className="font-display text-lg font-bold text-anthracite mb-4">Services</h2>
          <div className="space-y-3 mb-4">
            {["Depannage plomberie", "Renovation salle de bains", "Installation chauffage"].map((s) => (
              <div key={s} className="flex items-center justify-between p-3 bg-g50 rounded-lg">
                <span className="text-sm font-medium">{s}</span>
                <button className="text-xs text-red-500">Supprimer</button>
              </div>
            ))}
          </div>
          <button className="text-sm text-terre hover:underline">+ Ajouter un service</button>
        </div>

        <button className="w-full md:w-auto px-8 py-3 bg-terre text-white rounded-lg font-medium hover:bg-terre-light transition-colors">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
