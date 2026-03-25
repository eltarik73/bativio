"use client";

import { useState } from "react";
import { submitDevis } from "@/lib/api";

export default function DevisForm({ slug }: { slug: string }) {
  const [form, setForm] = useState({
    nomClient: "",
    telephoneClient: "",
    emailClient: "",
    descriptionBesoin: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await submitDevis(slug, form);
      setSuccess(true);
      setForm({ nomClient: "", telephoneClient: "", emailClient: "", descriptionBesoin: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="font-display text-xl font-bold text-green-800">Demande envoyee !</p>
        <p className="text-green-700 mt-2 text-sm">L&apos;artisan reviendra vers vous rapidement.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-anthracite mb-1">Nom *</label>
        <input
          id="nom"
          type="text"
          required
          value={form.nomClient}
          onChange={(e) => setForm({ ...form, nomClient: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-black/10 bg-white text-anthracite focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none transition"
          placeholder="Votre nom"
        />
      </div>
      <div>
        <label htmlFor="tel" className="block text-sm font-medium text-anthracite mb-1">Telephone *</label>
        <input
          id="tel"
          type="tel"
          required
          value={form.telephoneClient}
          onChange={(e) => setForm({ ...form, telephoneClient: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-black/10 bg-white text-anthracite focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none transition"
          placeholder="06 12 34 56 78"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-anthracite mb-1">Email</label>
        <input
          id="email"
          type="email"
          value={form.emailClient}
          onChange={(e) => setForm({ ...form, emailClient: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-black/10 bg-white text-anthracite focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none transition"
          placeholder="votre@email.fr"
        />
      </div>
      <div>
        <label htmlFor="besoin" className="block text-sm font-medium text-anthracite mb-1">Decrivez votre besoin *</label>
        <textarea
          id="besoin"
          required
          rows={3}
          value={form.descriptionBesoin}
          onChange={(e) => setForm({ ...form, descriptionBesoin: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-black/10 bg-white text-anthracite focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none transition resize-none"
          placeholder="Decrivez vos travaux..."
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-terre text-white rounded-lg font-body font-medium hover:bg-terre-light transition-colors disabled:opacity-50"
      >
        {loading ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}
