"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { login, sendMagicLink } from "@/lib/auth";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(email, password);
      router.push(data.artisan ? "/dashboard" : "/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) { setError("Entrez votre email"); return; }
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
      <><Navbar />
      <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "85vh", padding: 16 }}>
        <div className="bv-card bv-card-form" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#9993;</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>Lien envoy&eacute; !</h1>
          <p style={{ fontSize: 15, color: "#9B9590", lineHeight: 1.6 }}>
            Si un compte existe avec cet email, un lien de connexion a &eacute;t&eacute; envoy&eacute;. V&eacute;rifiez votre bo&icirc;te mail.
          </p>
        </div>
      </main></>
    );
  }

  return (
    <><Navbar />
    <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "85vh", padding: 16 }}>
      <div className="bv-card" style={{ maxWidth: 420, width: "100%", padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#C4531A", letterSpacing: -0.5 }}>Bativio</h1>
          <p style={{ marginTop: 8, fontSize: 15, color: "#9B9590" }}>Connectez-vous &agrave; votre espace</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label htmlFor="email" className="bv-label">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bv-input" placeholder="votre@email.fr" />
          </div>
          <div>
            <label htmlFor="password" className="bv-label">Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input id="password" type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="bv-input" placeholder="Votre mot de passe" style={{ paddingRight: 48 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9B9590", fontSize: 13 }}>
                {showPw ? "Masquer" : "Voir"}
              </button>
            </div>
          </div>

          {error && <p style={{ color: "#dc2626", fontSize: 14 }}>{error}</p>}

          <button type="submit" disabled={loading} className="bv-btn bv-btn-primary bv-btn-full">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="bv-separator"><span>ou</span></div>

        <button onClick={handleMagicLink} disabled={loading} className="bv-btn bv-btn-secondary bv-btn-full">
          Recevoir un magic link
        </button>

        <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "#9B9590" }}>
          Pas encore inscrit ?{" "}
          <Link href="/inscription" className="bv-link">Cr&eacute;er mon espace</Link>
        </p>
      </div>
    </main></>
  );
}
