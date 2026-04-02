"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function ConnexionPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading: authLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(isAdmin ? "/admin" : "/dashboard");
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(email, password);
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
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
      const res = await fetch("/api/v1/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Erreur");
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
      <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "85vh", padding: 16, background: "var(--creme)" }}>
        <div style={{ background: "var(--blanc)", borderRadius: 16, border: "1px solid var(--sable)", boxShadow: "0 4px 24px rgba(61,46,31,.04)", maxWidth: 440, width: "100%", padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#9993;</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois)", marginBottom: 8 }}>Lien envoy&eacute; !</h1>
          <p style={{ fontSize: 15, color: "var(--pierre)", lineHeight: 1.6 }}>
            Si un compte existe avec cet email, un lien de connexion a &eacute;t&eacute; envoy&eacute;. V&eacute;rifiez votre bo&icirc;te mail.
          </p>
        </div>
      </main></>
    );
  }

  return (
    <><Navbar />
    <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "85vh", padding: 16, background: "var(--creme)" }}>
      <div style={{ background: "var(--blanc)", borderRadius: 16, border: "1px solid var(--sable)", boxShadow: "0 4px 24px rgba(61,46,31,.04)", maxWidth: 440, width: "100%", padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "var(--terre)", letterSpacing: -0.5 }}>Bativio</h1>
          <p style={{ marginTop: 8, fontSize: 15, color: "var(--bois)", fontWeight: 600 }}>Connectez-vous &agrave; votre espace professionnel</p>
          <p style={{ marginTop: 4, fontSize: 14, color: "var(--pierre)" }}>G&eacute;rez vos demandes de devis, votre vitrine et vos clients</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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

          <div style={{ textAlign: "right", marginTop: -16, marginBottom: 8 }}>
            <Link
              href="/mot-de-passe-oublie"
              style={{
                fontSize: 13,
                color: "#C4531A",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Mot de passe oubli&eacute; ?
            </Link>
          </div>

          {error && <p style={{ color: "#dc2626", fontSize: 14 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ width: "100%", height: 48, background: "#C4531A", color: "#fff", border: "none", borderRadius: 10, fontFamily: "'Karla',sans-serif", fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "background .2s" }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#D4733A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#C4531A"; }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="bv-separator"><span>ou</span></div>

        <button onClick={handleMagicLink} disabled={loading} style={{ width: "100%", height: 48, background: "transparent", color: "#1C1C1E", border: "1.5px solid #E0DDD8", borderRadius: 10, fontFamily: "'Karla',sans-serif", fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all .2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C5C0B9"; e.currentTarget.style.background = "rgba(0,0,0,.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E0DDD8"; e.currentTarget.style.background = "transparent"; }}
        >
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
