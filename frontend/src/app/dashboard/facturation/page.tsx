"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const tab = searchParams.get("tab") || "devis";

  const plan = ((user?.plan as string) || "GRATUIT") as PlanType;
  const hasReception = hasFeature(plan, "invoquo_reception");

  const [embedToken, setEmbedToken] = useState("");
  const [invoices, setInvoices] = useState<InvDoc[]>([]);
  const [quotes, setQuotes] = useState<InvDoc[]>([]);
  const [clients, setClients] = useState<InvClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [converting, setConverting] = useState<string | null>(null);

  async function handleConvert(quoteId: string) {
    if (!confirm("Convertir ce devis en facture ?")) return;
    setConverting(quoteId);
    try {
      const res = await fetchWithAuth("/facturation/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId }),
      });
      router.push("/dashboard/facturation?tab=factures");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur conversion");
    } finally {
      setConverting(null);
    }
  }

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

  // Reporting data
  const now = new Date();
  const thisMonth = invoices.filter(i => { const d = new Date(i.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const thisYear = invoices.filter(i => new Date(i.date).getFullYear() === now.getFullYear());
  const caMois = thisMonth.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.totalTTC), 0);
  const caAnnee = thisYear.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.totalTTC), 0);
  const devisAcceptes = quotes.filter(q => q.status === "accepted").length;
  const devisTotal = quotes.length;
  const tauxConversion = devisTotal > 0 ? Math.round((devisAcceptes / devisTotal) * 100) : 0;

  // Export FEC via Invoquo
  async function exportFEC() {
    try {
      const tokenRes = await fetchWithAuth("/facturation/refresh-token");
      const { token } = tokenRes as { token: string };
      const year = now.getFullYear();
      const url = `${INVOQUO_URL}/api/v1/embed/export?format=fec&periodStart=${year}-01-01&periodEnd=${year}-12-31`;
      const res = await fetch(url, { headers: { "x-embed-token": token } });
      if (!res.ok) throw new Error("Erreur export FEC");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `FEC_${year}.txt`;
      a.click();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur export FEC");
    }
  }

  // Export CSV
  function exportCSV() {
    const rows = [["Type", "Numero", "Client", "Date", "Montant TTC", "Statut"].join(";")];
    for (const inv of invoices) {
      rows.push(["Facture", inv.invoiceNumber || "", clientName(inv.client), fmtDate(inv.date), String(inv.totalTTC), inv.status].join(";"));
    }
    for (const q of quotes) {
      rows.push(["Devis", q.quoteNumber || "", clientName(q.client), fmtDate(q.date), String(q.totalTTC), q.status].join(";"));
    }
    const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-facturation-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const embedIframeUrl = embedToken ? `${INVOQUO_URL}/embed/${(user as unknown as { invoquoSiret?: string; siret?: string })?.invoquoSiret || (user as unknown as { siret?: string })?.siret || ""}/${tab === "factures" ? "invoices" : tab === "clients" ? "clients" : "quotes"}/new?token=${embedToken}&accent=C4531A` : "";

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#3D2E1F" }}>Facturation</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {tab === "reporting" ? (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={exportCSV} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, border: "1px solid #E8D5C0", background: "#fff", color: "#3D2E1F", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Export CSV
              </button>
              <button onClick={exportFEC} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, border: "1px solid #E8D5C0", background: "#fff", color: "#3D2E1F", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Export FEC
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              {tab === "factures" && (
                <Link href="/dashboard/facturation/nouveau?type=avoir" prefetch={false} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, border: "1px solid #E8D5C0", background: "#fff", color: "#3D2E1F", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                  Avoir
                </Link>
              )}
              <Link href={tab === "clients" ? embedIframeUrl : `/dashboard/facturation/nouveau?type=${tab === "factures" ? "facture" : "devis"}`} prefetch={false} {...(tab === "clients" ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
                {tab === "factures" ? "Nouvelle facture" : tab === "clients" ? "Nouveau client" : "Nouveau devis"}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #EDEBE7", marginBottom: 20 }}>
        {[
          { key: "devis", label: "Devis", count: quotes.length },
          { key: "factures", label: "Factures", count: invoices.length },
          { key: "clients", label: "Clients", count: clients.length },
          { key: "reporting", label: "Reporting", count: null },
        ].map((t) => (
          <Link key={t.key} href={`/dashboard/facturation?tab=${t.key}`} prefetch={false}
            style={{
              padding: "10px 20px", fontSize: 14, fontWeight: tab === t.key ? 700 : 500,
              color: tab === t.key ? "#C4531A" : "#9C958D",
              borderBottom: tab === t.key ? "3px solid #C4531A" : "3px solid transparent",
              marginBottom: -2, textDecoration: "none", transition: "all .15s",
            }}
          >
            {t.label}{t.count !== null && <span style={{ fontSize: 12, opacity: 0.6 }}> ({t.count})</span>}
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

      {/* Reporting */}
      {tab === "reporting" ? (
        <div>
          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 24 }}>
            {[
              { label: "CA ce mois", value: fmtMoney(caMois), color: "#16A34A", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 010 7H6" },
              { label: `CA ${now.getFullYear()}`, value: fmtMoney(caAnnee), color: "#2563EB", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 010 7H6" },
              { label: "Impay\u00e9es", value: fmtMoney(totalEnAttente + totalRetard), color: "#DC2626", icon: "M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" },
              { label: "Taux conversion devis", value: `${tauxConversion}%`, color: "#C4531A", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8D5C0", padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <svg width="18" height="18" fill="none" stroke={s.color} strokeWidth="1.5" viewBox="0 0 24 24"><path d={s.icon} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#9C958D", textTransform: "uppercase", letterSpacing: 0.3 }}>{s.label}</span>
                </div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 700, color: "#1C1C1E" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="max-md:!grid-cols-1">
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 24 }}>
              <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#3D2E1F", marginBottom: 16 }}>Factures</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Total", count: invoices.length },
                  { label: "Pay\u00e9es", count: invoices.filter(i => i.status === "paid").length, color: "#16A34A" },
                  { label: "En attente", count: invoices.filter(i => ["pending", "sent"].includes(i.status)).length, color: "#2563EB" },
                  { label: "En retard", count: invoices.filter(i => i.status === "overdue").length, color: "#DC2626" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6" }}>
                    <span style={{ fontSize: 13, color: r.color || "#6B6560" }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 24 }}>
              <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#3D2E1F", marginBottom: 16 }}>Devis</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Total", count: quotes.length },
                  { label: "Accept\u00e9s", count: quotes.filter(q => q.status === "accepted").length, color: "#16A34A" },
                  { label: "En attente", count: quotes.filter(q => ["pending", "sent"].includes(q.status)).length, color: "#2563EB" },
                  { label: "Refus\u00e9s/Expir\u00e9s", count: quotes.filter(q => ["rejected", "expired"].includes(q.status)).length, color: "#DC2626" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6" }}>
                    <span style={{ fontSize: 13, color: r.color || "#6B6560" }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export section */}
          <div style={{ marginTop: 24, background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 24 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#3D2E1F", marginBottom: 8 }}>Export comptable</h3>
            <p style={{ fontSize: 13, color: "#6B6560", marginBottom: 16 }}>T&eacute;l&eacute;chargez vos factures et devis au format CSV pour votre comptable.</p>
            <button onClick={exportCSV} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, border: "1px solid #E8D5C0", background: "#fff", color: "#3D2E1F", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              T&eacute;l&eacute;charger CSV ({invoices.length + quotes.length} documents)
            </button>
          </div>
        </div>
      ) : tab === "clients" ? (
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
          <EmptyState type={tab === "factures" ? "facture" : "devis"} href={`/dashboard/facturation/nouveau?type=${tab === "factures" ? "facture" : "devis"}`} />
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
                  {tab === "devis" && <th style={{ ...thStyle, textAlign: "right" }}></th>}
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
                      {tab === "devis" && (
                        <td style={{ ...tdStyle, textAlign: "right" }}>
                          {d.status !== "expired" && (
                            <button
                              onClick={() => handleConvert(d.id)}
                              disabled={converting === d.id}
                              title="Convertir en facture"
                              style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #1C1C1E", background: converting === d.id ? "#6b7280" : "#1C1C1E", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", opacity: converting === d.id ? 0.6 : 1 }}
                            >
                              {converting === d.id ? "..." : "↗ Facture"}
                            </button>
                          )}
                        </td>
                      )}
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
      <Link href={href} prefetch={false} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
        Cr&eacute;er un {type}
      </Link>
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
