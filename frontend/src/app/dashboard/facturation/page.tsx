"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { hasFeature } from "@/lib/plans";
import type { PlanType } from "@/lib/plans";
import PricingGrid from "@/components/pricing/PricingGrid";

const INVOQUO_URL = process.env.NEXT_PUBLIC_INVOQUO_URL || "https://invoquo.vercel.app";

interface InvDoc {
  id: string;
  invoiceNumber?: string;
  quoteNumber?: string;
  status: string;
  date: string;
  totalTTC: number;
  client: { companyName: string | null; firstName: string | null; lastName: string | null } | null;
}

interface InvClient {
  id: string;
  type: string;
  companyName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  city: string | null;
  createdAt: string;
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  draft: { bg: "#F2F2F7", color: "#8A8A8E", label: "Brouillon" },
  pending: { bg: "#e3eefa", color: "#3B7DD8", label: "En attente" },
  sent: { bg: "#e3eefa", color: "#3B7DD8", label: "Envoyé" },
  transmitted: { bg: "#e0f0ff", color: "#2563EB", label: "Transmis" },
  accepted: { bg: "#e0f5ea", color: "#2D8B55", label: "Accepté" },
  paid: { bg: "#e0f5ea", color: "#2D8B55", label: "Payé" },
  overdue: { bg: "#fce8e7", color: "#D9453D", label: "En retard" },
  rejected: { bg: "#F2F2F7", color: "#6b7280", label: "Refusé" },
  expired: { bg: "#F2F2F7", color: "#6b7280", label: "Expiré" },
};

function clientName(c: { companyName: string | null; firstName: string | null; lastName: string | null } | null): string {
  if (!c) return "—";
  return c.companyName || [c.firstName, c.lastName].filter(Boolean).join(" ") || "Sans nom";
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function fmtMoney(n: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function getInitials(name: string): string {
  const w = name.trim().split(/\s+/);
  return w.length === 1 ? w[0][0]?.toUpperCase() || "?" : (w[0][0] + w[w.length - 1][0]).toUpperCase();
}

function FacturationContent() {
  const { user, fetchWithAuth } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "devis";

  const plan = ((user?.plan as string) || "GRATUIT") as PlanType;
  const hasReception = hasFeature(plan, "invoquo_reception");

  const [embedToken, setEmbedToken] = useState("");
  const [invoices, setInvoices] = useState<InvDoc[]>([]);
  const [quotes, setQuotes] = useState<InvDoc[]>([]);
  const [clients, setClients] = useState<InvClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const inv = user as unknown as { invoquoEnabled?: boolean } | null;

  useEffect(() => {
    if (!user || !hasReception || !inv?.invoquoEnabled) {
      setLoading(false);
      return;
    }

    // Fetch embed token + data in parallel
    Promise.all([
      fetchWithAuth("/facturation/refresh-token").catch(() => null),
      fetchWithAuth("/facturation/data").catch(() => null),
    ]).then(([tokenData, factuData]) => {
      if (tokenData) {
        const t = tokenData as { token: string };
        setEmbedToken(t.token);
      }
      if (factuData) {
        const d = factuData as { invoices: InvDoc[]; quotes: InvDoc[]; clients: InvClient[] };
        setInvoices(d.invoices || []);
        setQuotes(d.quotes || []);
        setClients(d.clients || []);
      }
    }).catch(() => setError("Impossible de charger les données"))
      .finally(() => setLoading(false));
  }, [user, fetchWithAuth, hasReception, inv?.invoquoEnabled]);

  // Upsell
  if (!hasReception) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg, #1C1C1E 0%, #2d1a0e 50%, #C4531A 100%)", borderRadius: 20, padding: "48px 40px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(220,38,38,.2)", border: "1px solid rgba(220,38,38,.3)", padding: "6px 14px", borderRadius: 20, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#fca5a5" }}>Obligation septembre 2026</span>
            </div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,4vw,36px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 10 }}>
              La facturation papier, c&apos;est bient&ocirc;t fini.
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)", lineHeight: 1.6, maxWidth: 480 }}>
              Toutes les entreprises du b&acirc;timent devront recevoir leurs factures au format &eacute;lectronique.
            </p>
          </div>
        </div>
        <PricingGrid currentPlan={plan} ctaHref="/dashboard/parametres" />
      </div>
    );
  }

  // Not activated
  if (!inv?.invoquoEnabled) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
        <div style={{ maxWidth: 440, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(196,83,26,.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="28" height="28" fill="none" stroke="#C4531A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
          </div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#3D2E1F", marginBottom: 8 }}>Facturation &eacute;lectronique</h2>
          <p style={{ fontSize: 14, color: "#9C958D", marginBottom: 24 }}>Activez le module pour cr&eacute;er vos devis et factures conform&eacute;ment &agrave; la r&eacute;forme 2026.</p>
          <button onClick={async () => { await fetchWithAuth("/facturation/activate", { method: "POST" }); window.location.reload(); }} style={{ padding: "12px 28px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>
            Activer la facturation
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40vh" }}>
        <div style={{ width: 28, height: 28, border: "3px solid #E5E0DB", borderTopColor: "#C4531A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const docs = tab === "factures" ? invoices : quotes;
  const totalEnAttente = invoices.filter(i => ["pending", "sent"].includes(i.status)).reduce((s, i) => s + Number(i.totalTTC), 0);
  const totalPaye = invoices.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.totalTTC), 0);
  const totalRetard = invoices.filter(i => i.status === "overdue").reduce((s, i) => s + Number(i.totalTTC), 0);

  const embedIframeUrl = embedToken ? `${INVOQUO_URL}/embed/${(user as unknown as { invoquoSiret?: string; siret?: string })?.invoquoSiret || (user as unknown as { siret?: string })?.siret || ""}/${tab === "factures" ? "invoices" : tab === "clients" ? "clients" : "quotes"}/new?token=${embedToken}&accent=C4531A` : "";

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#3D2E1F" }}>Facturation</h1>
        <a href={embedIframeUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
          {tab === "factures" ? "Nouvelle facture" : tab === "clients" ? "Nouveau client" : "Nouveau devis"}
        </a>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #EDEBE7", marginBottom: 20 }}>
        {[
          { key: "devis", label: "Devis", count: quotes.length },
          { key: "factures", label: "Factures", count: invoices.length },
          { key: "clients", label: "Clients", count: clients.length },
        ].map((t) => (
          <Link key={t.key} href={`/dashboard/facturation?tab=${t.key}`} prefetch={false}
            style={{
              padding: "10px 20px", fontSize: 14, fontWeight: tab === t.key ? 700 : 500,
              color: tab === t.key ? "#C4531A" : "#9C958D",
              borderBottom: tab === t.key ? "3px solid #C4531A" : "3px solid transparent",
              marginBottom: -2, textDecoration: "none", transition: "all .15s",
            }}
          >
            {t.label} <span style={{ fontSize: 12, opacity: 0.6 }}>({t.count})</span>
          </Link>
        ))}
      </div>

      {/* Stats bar (factures only) */}
      {tab === "factures" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "En attente", value: totalEnAttente, color: "#3B7DD8", bg: "#e3eefa" },
            { label: "Payé", value: totalPaye, color: "#2D8B55", bg: "#e0f5ea" },
            { label: "En retard", value: totalRetard, color: "#D9453D", bg: "#fce8e7" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8D5C0", padding: "16px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: s.color, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginTop: 4 }}>{fmtMoney(s.value)}</div>
            </div>
          ))}
        </div>
      )}

      {error && <div style={{ padding: 16, borderRadius: 10, background: "#fce8e7", color: "#D9453D", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {/* Table or clients list */}
      {tab === "clients" ? (
        /* Clients list */
        clients.length === 0 ? (
          <EmptyState type="client" href={embedIframeUrl} />
        ) : (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <th style={thStyle}>Client</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Ville</th>
                  <th style={thStyle}>Ajouté le</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #F7F5F2" }}>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#C4531A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{getInitials(clientName(c))}</span>
                        </div>
                        <span style={{ fontWeight: 600, color: "#3D2E1F" }}>{clientName(c)}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: "#9C958D" }}>{c.email || "—"}</td>
                    <td style={{ ...tdStyle, color: "#9C958D" }}>{c.city || "—"}</td>
                    <td style={{ ...tdStyle, color: "#C5C0B9" }}>{fmtDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        /* Documents table */
        docs.length === 0 ? (
          <EmptyState type={tab === "factures" ? "facture" : "devis"} href={embedIframeUrl} />
        ) : (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <th style={thStyle}>N°</th>
                  <th style={thStyle}>Client</th>
                  <th style={thStyle}>Date</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Montant TTC</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => {
                  const st = STATUS_STYLE[d.status] || STATUS_STYLE.draft;
                  const num = d.invoiceNumber || d.quoteNumber || "—";
                  return (
                    <tr key={d.id} style={{ borderBottom: "1px solid #F7F5F2", cursor: "default" }}>
                      <td style={tdStyle}><span style={{ fontWeight: 600, color: "#3D2E1F", fontFamily: "monospace" }}>{num}</span></td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#E8A84C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{getInitials(clientName(d.client))}</span>
                          </div>
                          <span style={{ color: "#3D2E1F" }}>{clientName(d.client)}</span>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, color: "#9C958D" }}>{fmtDate(d.date)}</td>
                      <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, color: "#1C1C1E", fontFamily: "monospace" }}>{fmtMoney(Number(d.totalTTC))}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: st.bg, color: st.color }}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#9C958D", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "left" };
const tdStyle: React.CSSProperties = { padding: "12px 16px" };

function EmptyState({ type, href }: { type: string; href: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: "48px 32px", textAlign: "center" }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(196,83,26,.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <svg width="24" height="24" fill="none" stroke="#C4531A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
      </div>
      <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#3D2E1F", marginBottom: 6 }}>Aucun {type} pour le moment</h3>
      <p style={{ fontSize: 13, color: "#9C958D", marginBottom: 20 }}>Cr&eacute;ez votre premier {type} en quelques clics</p>
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
        Cr&eacute;er un {type}
      </a>
    </div>
  );
}

export default function FacturationPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40vh" }}><div style={{ width: 28, height: 28, border: "3px solid #E5E0DB", borderTopColor: "#C4531A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>}>
      <FacturationContent />
    </Suspense>
  );
}
