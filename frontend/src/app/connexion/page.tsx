"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, sendMagicLink } from "@/lib/auth";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(email, password);
      if (data.artisan) {
        router.push("/dashboard");
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError("Entrez votre email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendMagicLink(email);
      setMagicSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (magicSent) {
    return (
      <main className="flex items-center justify-center min-h-[80vh]">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4 text-center">
          <p className="font-display text-2xl font-bold text-anthracite">Lien envoye !</p>
          <p className="mt-3 text-anthracite/60 text-sm">
            Si un compte existe avec cet email, un lien de connexion a ete envoye. Verifiez votre boite mail.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-terre">Bativio</h1>
          <p className="mt-2 text-anthracite/60 text-sm">Connectez-vous a votre espace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-anthracite mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-black/10 bg-white text-anthracite focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-anthracite mb-1">Mot de passe</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-black/10 bg-white text-anthracite focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none transition"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-terre text-white rounded-lg font-medium hover:bg-terre-light transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-xs text-anthracite/40">ou</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <button
          onClick={handleMagicLink}
          disabled={loading}
          className="w-full py-3 border border-anthracite/20 text-anthracite rounded-lg font-medium hover:bg-anthracite hover:text-white transition-colors disabled:opacity-50"
        >
          Recevoir un magic link
        </button>

        <p className="mt-6 text-center text-sm text-anthracite/50">
          Pas encore inscrit ?{" "}
          <Link href="/inscription" className="text-terre font-medium hover:underline">
            Creer mon espace
          </Link>
        </p>
      </div>
    </main>
  );
}
