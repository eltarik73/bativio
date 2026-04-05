"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface DevisRecent { id: string; nomClient: string; descriptionBesoin: string; statut: string; urgence?: string; createdAt: string }
interface Stats { vuesCeMois: number; demandesCeMois: number; rdvCeMois: number; noteMoyenne: number; nombreAvis: number }

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bon matin";
  if (h < 18) return "Bon après-midi";
  return "Bonne soirée";
}

function getFormattedDate(): string {
  const now = new Date();
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  return `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

function relativeDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  if (diff < 7) return `Il y a ${diff} jours`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function getInitials(name: string): string {
  if (!name) return "?";
  const w = name.trim().split(/\s+/);
  return w.length === 1 ? w[0][0].toUpperCase() : (w[0][0] + w[w.length - 1][0]).toUpperCase();
}

function getCompletionItems(artisan: { description?: string | null; metierNom?: string | null; [key: string]: unknown } | null) {
  return [
    { label: "Informations", done: true, href: "/dashboard/profil" },
    { label: "Métier", done: !!artisan?.metierNom, href: "/dashboard/profil" },
    { label: "Photos", done: false, href: "/dashboard/photos" },
    { label: "Description", done: !!artisan?.description, href: "/dashboard/profil" },
  ];
}

const STATUT_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  NOUVEAU: { bg: "rgba(234,88,12,.1)", color: "#ea580c", label: "Nouveau" },
  REPONDU: { bg: "rgba(37,99,235,.08)", color: "#2563EB", label: "Répondu" },
  CONVERTI: { bg: "rgba(22,163,74,.08)", color: "#16a34a", label: "Converti" },
  EN_ATTENTE: { bg: "rgba(155,149,144,.08)", color: "#9B9590", label: "En attente" },
  EXPIRE: { bg: "rgba(155,149,144,.08)", color: "#9B9590", label: "Expiré" },
};

const AVATAR_COLORS = ["#C4531A", "#2563EB", "#7c3aed", "#059669", "#E8A84C", "#dc2626"];

export default function DashboardPage() {
  const { user: artisan, fetchWithAuth } = useAuth();
  const [greeting, setGreeting] = useState("Bonjour");
  const [dateStr, setDateStr] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentDevis, setRecentDevis] = useState<DevisRecent[]>([]);

  useEffect(() => {
    setGreeting(getGreeting());
    setDateStr(getFormattedDate());
    fetchWithAuth("/artisans/me/stats").then((d) => setStats(d as Stats)).catch(() => {});
    fetchWithAuth("/artisans/me/devis?page=0&size=5").then((d) => {
      const data = d as { devis?: DevisRecent[]; content?: DevisRecent[] };
      setRecentDevis(data.devis || data.content || []);
    }).catch(() => {});
  }, [fetchWithAuth]);

  const displayName = artisan?.nomAffichage || "Artisan";
  const firstName = displayName.split(" ")[0];
  const completion = artisan?.profilCompletion ?? 0;
  const completionItems = getCompletionItems(artisan);
  const isPending = artisan?.actif === false;

  const statsValues = [
    { value: stats?.vuesCeMois ?? 0, label: "Vues ce mois", color: "#2563EB", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' },
    { value: stats?.demandesCeMois ?? 0, label: "Demandes", color: "#C4531A", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>' },
    { value: stats?.rdvCeMois ?? 0, label: "RDV ce mois", color: "#059669", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' },
    { value: stats?.noteMoyenne && stats.noteMoyenne > 0 ? stats.noteMoyenne.toFixed(1) : "-", label: "Note moyenne", color: "#E8A84C", icon: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>' },
  ];

  return (
    <div>
      {/* Pending banner */}
      {isPending && (
        <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", color: "#92400E", padding: 16, borderRadius: 12, marginBottom: 20, fontSize: 14, lineHeight: 1.5, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>&#9203;</span>
          <span>Votre profil est en attente de validation. Vous serez visible dans l&apos;annuaire d&egrave;s validation par notre &eacute;quipe.</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#3D2E1F" }}>{greeting}, {firstName} !</h1>
        {dateStr && <p style={{ fontSize: 13, color: "#C5C0B9", marginTop: 4 }}>{dateStr} &mdash; Votre activit&eacute;</p>}
      </div>

      {/* Actions rapides */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }} className="max-md:!grid-cols-2">
        {[
          { href: "/dashboard/facturation?tab=devis", label: "Nouveau devis", sub: "Créer un devis client", bg: "#C4531A", iconBg: "rgba(255,255,255,.2)", icon: '<svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>' },
          { href: "/dashboard/facturation?tab=factures", label: "Nouvelle facture", sub: "Facturer un client", bg: "#1C1C1E", iconBg: "rgba(255,255,255,.15)", icon: '<svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>' },
          { href: "/dashboard/facturation?tab=clients", label: "Ajouter client", sub: "Nouveau contact", bg: "#E8A84C", iconBg: "rgba(255,255,255,.2)", icon: '<svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6m3-3h-6"/></svg>' },
          { href: "/dashboard/facturation?tab=factures", label: "Mes factures", sub: "Voir le suivi", bg: "#fff", iconBg: "#FAF8F5", icon: '<svg width="18" height="18" fill="none" stroke="#1C1C1E" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>', dark: true },
        ].map((a) => (
          <Link key={a.label} href={a.href} prefetch={false} style={{ padding: "16px 18px", borderRadius: 12, background: a.bg, color: a.dark ? "#1C1C1E" : "#fff", textDecoration: "none", transition: "all .2s", border: a.dark ? "1px solid rgba(0,0,0,.08)" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: a.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <span dangerouslySetInnerHTML={{ __html: a.icon }} style={{ display: "flex" }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{a.label}</div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{a.sub}</div>
          </Link>
        ))}
      </div>

      {/* Completion bar */}
      {completion < 100 && (
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: "20px 24px", marginBottom: 24, boxShadow: "0 2px 12px rgba(61,46,31,.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
              <svg width="48" height="48" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="24" cy="24" r="20" fill="none" stroke="#EDEBE7" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="#C4531A" strokeWidth="4" strokeDasharray={`${completion * 1.257} 126`} strokeLinecap="round" />
              </svg>
              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, color: "#C4531A" }}>{completion}%</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#3D2E1F" }}>Compl&eacute;tez votre profil</p>
              <p style={{ fontSize: 12, color: "#9C958D", marginTop: 2 }}>Am&eacute;liorez votre visibilit&eacute; dans l&apos;annuaire</p>
            </div>
            <Link href="/dashboard/profil" style={{ height: 34, padding: "0 14px", borderRadius: 8, border: "1.5px solid #E0DDD8", display: "inline-flex", alignItems: "center", fontSize: 13, fontWeight: 600, color: "#C4531A", textDecoration: "none" }}>Compl&eacute;ter</Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14, paddingTop: 14, borderTop: "1px solid #F7F5F2" }}>
            {completionItems.map((item) => (
              <Link key={item.label} href={item.href} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, textDecoration: "none", background: item.done ? "rgba(34,197,94,.06)" : "rgba(155,149,144,.06)", color: item.done ? "#16a34a" : "#9B9590" }}>
                <span style={{ fontSize: 13 }}>{item.done ? "✓" : "○"}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }} className="max-md:!grid-cols-2">
        {statsValues.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: "20px 22px", boxShadow: "0 2px 12px rgba(61,46,31,.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "#1C1C1E", lineHeight: 1 }}>{s.value}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span dangerouslySetInnerHTML={{ __html: s.icon }} style={{ display: "flex", color: s.color }} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#9C958D", marginTop: 6 }}>{s.label}</p>
            <p style={{ fontSize: 11, color: "#C5C0B9", marginTop: 2 }}>&mdash; stable</p>
          </div>
        ))}
      </div>

      {/* Graphique CA + Demandes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }} className="max-md:!grid-cols-1">
        {/* Graphique CA */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: "22px 24px", boxShadow: "0 2px 12px rgba(61,46,31,.03)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#3D2E1F", marginBottom: 16, fontFamily: "'Fraunces',serif" }}>Chiffre d&apos;affaires</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {["Nov", "Déc", "Jan", "Fév", "Mars", "Avr"].map((m) => (
              <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: "100%", height: 4, borderRadius: 4, background: "#EDEBE7" }} />
                <span style={{ fontSize: 10, color: "#C5C0B9" }}>{m}</span>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 12, color: "#C5C0B9", marginTop: 16 }}>Cr&eacute;ez votre premi&egrave;re facture pour voir vos stats ici</p>
        </div>

        {/* Dernières demandes */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", boxShadow: "0 2px 12px rgba(61,46,31,.03)", overflow: "hidden" }}>
          <div style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#3D2E1F", fontFamily: "'Fraunces',serif" }}>Derni&egrave;res demandes</span>
            <Link href="/dashboard/demandes" prefetch={false} style={{ fontSize: 12, color: "#C4531A", fontWeight: 600, textDecoration: "none" }}>Tout voir &rarr;</Link>
          </div>
          {recentDevis.length > 0 ? (
            <div>
              {recentDevis.slice(0, 5).map((d, i) => {
                const st = STATUT_STYLE[d.statut] || STATUT_STYLE.EN_ATTENTE;
                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                return (
                  <Link key={d.id} href={`/dashboard/devis/${d.id}`} prefetch={false} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 22px", borderTop: "1px solid #F7F5F2", textDecoration: "none", transition: "background .1s" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{getInitials(d.nomClient)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.nomClient}</div>
                      <div style={{ fontSize: 11, color: "#9C958D", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.descriptionBesoin}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: st.bg, color: st.color }}>{st.label}</span>
                      <span style={{ fontSize: 10, color: "#C5C0B9" }}>{relativeDate(d.createdAt)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: 28, textAlign: "center", color: "#9C958D", fontSize: 13 }}>
              Aucune demande pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
