"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ParametresPage() {
  const [copied, setCopied] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const router = useRouter();
  const { user, logout, fetchWithAuth } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const email = user?.email || "";
  const plan = (user?.plan || "GRATUIT") as string;
  const slug = user?.slug || "";
  const ville = user?.ville ? (user.ville as string).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-") : "";
  const url = slug && ville ? `bativio.fr/${ville}/${slug}` : "";

  const copyUrl = () => {
    if (!url) return;
    navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChangePassword = async () => {
    if (newPw.length < 8) { setPwMsg("Le mot de passe doit contenir au moins 8 caractères"); return; }
    setPwLoading(true);
    setPwMsg("");
    try {
      await fetchWithAuth("/artisans/me/change-password", {
        method: "POST",
        body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw }),
      });
      setPwMsg("Mot de passe modifié !");
      setOldPw("");
      setNewPw("");
      setPwOpen(false);
    } catch (err) {
      setPwMsg(err instanceof Error ? err.message : "Erreur");
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Êtes-vous sûr de vouloir désactiver votre compte ? Votre page ne sera plus visible dans l'annuaire.")) return;
    try {
      await fetchWithAuth("/artisans/me", {
        method: "PUT",
        body: JSON.stringify({ actif: false }),
      });
      alert("Votre compte a été désactivé. Votre page n'est plus visible.");
    } catch { /* empty */ }
  };

  const downloadQR = () => {
    if (!url) return;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://${url}`;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `qr-${slug}.png`;
    a.click();
  };

  const CARD: React.CSSProperties = {
    background: "#fff", borderRadius: 16, border: "1.5px solid #EDEBE7", padding: 28, marginBottom: 20,
  };

  const planLabel = plan === "PRO_PLUS" ? "Pro+" : plan === "PRO" ? "Pro" : plan === "ESSENTIEL" ? "Essentiel" : "Gratuit";
  const planPrice = plan === "PRO_PLUS" ? "79" : plan === "PRO" ? "49" : plan === "ESSENTIEL" ? "19" : "0";

  const features: Record<string, string[]> = {
    GRATUIT: ["Fiche annuaire", "Formulaire devis", "3 photos max"],
    ESSENTIEL: ["10 photos + avant/après", "Badges illimités", "Agenda + RDV en ligne", "SMS rappel"],
    PRO: ["URL perso (vitrine complète)", "Photos illimitées", "QR Code vitrine", "Mini-CRM clients", "Support prioritaire"],
    PRO_PLUS: ["URL perso (vitrine complète)", "Photos illimitées", "QR Code vitrine", "Agent IA répondeur", "Devis IA automatique", "Support dédié"],
  };

  return (
    <div style={{ maxWidth: 700, padding: 32, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: "#1C1C1E", marginBottom: 28 }}>Paramètres</h1>

      {/* Compte */}
      <div style={CARD}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Compte</h2>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9B9590", marginBottom: 6 }}>Email</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E" }}>{email}</div>
        </div>
        {!pwOpen ? (
          <button onClick={() => setPwOpen(true)} style={{ border: "1.5px solid #C4531A", color: "#C4531A", background: "transparent", height: 40, borderRadius: 8, padding: "0 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Modifier le mot de passe
          </button>
        ) : (
          <div style={{ background: "#FAF8F5", borderRadius: 10, padding: 16 }}>
            <input type="password" placeholder="Mot de passe actuel" value={oldPw} onChange={(e) => setOldPw(e.target.value)} style={{ width: "100%", height: 40, padding: "0 12px", borderRadius: 8, border: "1.5px solid #E0DDD8", fontSize: 14, marginBottom: 8 }} />
            <input type="password" placeholder="Nouveau mot de passe (min 8 car.)" value={newPw} onChange={(e) => setNewPw(e.target.value)} style={{ width: "100%", height: 40, padding: "0 12px", borderRadius: 8, border: "1.5px solid #E0DDD8", fontSize: 14, marginBottom: 12 }} />
            {pwMsg && <p style={{ fontSize: 13, color: pwMsg.includes("modifié") ? "#16a34a" : "#dc2626", marginBottom: 8 }}>{pwMsg}</p>}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setPwOpen(false); setPwMsg(""); }} style={{ flex: 1, height: 40, borderRadius: 8, border: "1.5px solid #E0DDD8", background: "none", fontSize: 13, fontWeight: 600, color: "#6B6560", cursor: "pointer" }}>Annuler</button>
              <button onClick={handleChangePassword} disabled={pwLoading} style={{ flex: 1, height: 40, borderRadius: 8, background: "#C4531A", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: pwLoading ? 0.5 : 1 }}>{pwLoading ? "..." : "Confirmer"}</button>
            </div>
          </div>
        )}
      </div>

      {/* Abonnement */}
      <div style={CARD}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Abonnement</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ background: "rgba(196,83,26,.06)", color: "#C4531A", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Plan {planLabel}</span>
          <span style={{ fontSize: 15, color: "#9B9590" }}>{planPrice} €/mois</span>
        </div>
        <div style={{ marginBottom: 20 }}>
          {(features[plan] || features.GRATUIT).map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
              <span style={{ color: "#16a34a", fontSize: 16 }}>&#10003;</span>
              <span style={{ fontSize: 14, color: "#6B6560" }}>{f}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#9B9590" }}>Pour changer de plan, contactez-nous à support@bativio.fr</p>
      </div>

      {/* Ma page */}
      {url && (
        <div style={CARD}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Ma page</h2>
          <div style={{ background: "#F7F5F2", borderRadius: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontFamily: "monospace", color: "#1C1C1E" }}>{url}</span>
            <button onClick={copyUrl} style={{ background: "#C4531A", color: "#fff", padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>{copied ? "Copié !" : "Copier"}</button>
          </div>
          {(plan === "PRO" || plan === "PRO_PLUS") && (
            <button onClick={downloadQR} style={{ border: "1.5px solid #C4531A", color: "#C4531A", background: "transparent", height: 40, borderRadius: 8, padding: "0 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>
              Télécharger mon QR Code
            </button>
          )}
        </div>
      )}

      {/* Zone de danger */}
      <div style={{ background: "rgba(220,38,38,.02)", borderRadius: 16, border: "1.5px solid rgba(220,38,38,.15)", padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#DC2626", marginBottom: 10 }}>Zone de danger</h2>
        <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.6, marginBottom: 16 }}>La désactivation masquera votre page de l&apos;annuaire. Vous pourrez la réactiver à tout moment.</p>
        <button onClick={handleDeactivate} style={{ border: "1.5px solid #DC2626", color: "#DC2626", background: "transparent", height: 40, borderRadius: 8, padding: "0 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Désactiver mon compte</button>
      </div>

      <button onClick={handleLogout} style={{ width: "100%", height: 48, border: "1.5px solid #DC2626", color: "#DC2626", background: "transparent", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 20 }}>Se déconnecter</button>
    </div>
  );
}
