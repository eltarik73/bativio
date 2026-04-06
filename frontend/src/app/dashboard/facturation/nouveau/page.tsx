"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Suspense } from "react";

interface Ligne {
  id: string;
  designation: string;
  quantite: number;
  prixUnitaireHT: number;
  tauxTVA: number;
}

let counter = 0;
function newLigne(): Ligne {
  return { id: `l-${++counter}-${Date.now()}`, designation: "", quantite: 1, prixUnitaireHT: 0, tauxTVA: 20 };
}

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

function NouveauContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const { fetchWithAuth } = useAuth();

  const demandeId = searchParams.get("demandeId");
  const descriptionParam = searchParams.get("description");
  const isAvoir = typeParam === "avoir";
  const fromInvoiceNum = searchParams.get("fromNum") || "";
  const fromInvoiceId = searchParams.get("fromInvoice") || "";
  const [docType, setDocType] = useState<"DEVIS" | "FACTURE">(typeParam === "facture" || typeParam === "avoir" ? "FACTURE" : "DEVIS");
  const [clientNom, setClientNom] = useState(searchParams.get("clientNom") || searchParams.get("fromClient") || "");
  const [clientEmail, setClientEmail] = useState(searchParams.get("clientEmail") || "");
  const [clientTel, setClientTel] = useState(searchParams.get("clientTelephone") || "");
  const [clientAdresse, setClientAdresse] = useState("");
  const [lignes, setLignes] = useState<Ligne[]>([newLigne()]);
  const [notes, setNotes] = useState(isAvoir && fromInvoiceNum ? `Avoir sur facture n\u00b0${fromInvoiceNum}` : descriptionParam || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Client autocomplete
  const [clientSuggestions, setClientSuggestions] = useState<Array<{ id: string; nom: string; email: string | null; telephone: string | null; adresse: string | null; ville: string | null }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  async function searchClients(q: string) {
    setClientNom(q);
    if (q.length < 2) { setClientSuggestions([]); setShowSuggestions(false); return; }
    try {
      const data = await fetchWithAuth(`/artisans/me/clients?q=${encodeURIComponent(q)}`);
      const results = Array.isArray(data) ? data : [];
      setClientSuggestions(results as typeof clientSuggestions);
      setShowSuggestions(results.length > 0);
    } catch { setClientSuggestions([]); }
  }

  function selectClient(c: typeof clientSuggestions[0]) {
    setClientNom(c.nom);
    setClientEmail(c.email || "");
    setClientTel(c.telephone || "");
    setClientAdresse(c.adresse ? `${c.adresse}${c.ville ? `, ${c.ville}` : ""}` : "");
    setShowSuggestions(false);
  }

  const totals = useMemo(() => {
    let totalHT = 0, totalTVA = 0;
    for (const l of lignes) {
      const ht = l.quantite * l.prixUnitaireHT;
      totalHT += ht;
      totalTVA += ht * (l.tauxTVA / 100);
    }
    return {
      totalHT: Math.round(totalHT * 100) / 100,
      totalTVA: Math.round(totalTVA * 100) / 100,
      totalTTC: Math.round((totalHT + totalTVA) * 100) / 100,
    };
  }, [lignes]);

  function updateLigne(idx: number, field: keyof Ligne, value: string | number) {
    setLignes((prev) => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  }

  function removeLigne(idx: number) {
    if (lignes.length <= 1) return;
    setLignes((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave(finalize: boolean) {
    setError("");
    if (!clientNom.trim()) { setError("Le nom du client est requis"); return; }
    const validLignes = lignes.filter((l) => l.designation.trim());
    if (validLignes.length === 0) { setError("Ajoutez au moins une ligne"); return; }

    setSaving(true);
    try {
      // Save via Invoquo embed API (which already handles numbering, etc.)
      const tokenRes = await fetchWithAuth("/facturation/refresh-token");
      const { token, siret } = tokenRes as { token: string; siret: string };

      // First create client if needed
      const INVOQUO_URL = process.env.NEXT_PUBLIC_INVOQUO_URL || "https://invoquo.vercel.app";
      const embedHeaders = { "Content-Type": "application/json", "x-embed-token": token };

      const clientRes = await fetch(`${INVOQUO_URL}/api/v1/embed/clients`, {
        method: "POST",
        headers: embedHeaders,
        body: JSON.stringify({ type: "company", companyName: clientNom, email: clientEmail || undefined, phone: clientTel || undefined, address: clientAdresse || undefined }),
      });
      const clientData = await clientRes.json();
      if (!clientData.success) throw new Error(clientData.error || "Erreur création client");
      const clientId = clientData.data.client.id;

      // Create document
      const endpoint = docType === "FACTURE" ? "invoices" : "quotes";
      const body: Record<string, unknown> = {
        clientId,
        date: new Date().toISOString().slice(0, 10),
        operationCategory: "services",
        ...(isAvoir ? { type: "credit_note" } : {}),
        lines: validLignes.map((l) => ({
          description: l.designation,
          quantity: l.quantite,
          unitPriceHT: l.prixUnitaireHT,
          vatRate: l.tauxTVA,
        })),
        notes: notes || undefined,
        finalize,
      };

      if (docType === "FACTURE") {
        body.dueDate = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
        body.paymentTerms = "30_days";
      } else {
        body.validUntil = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
      }

      const docRes = await fetch(`${INVOQUO_URL}/api/v1/embed/${endpoint}`, {
        method: "POST",
        headers: embedHeaders,
        body: JSON.stringify(body),
      });
      const docData = await docRes.json();
      if (!docData.success) throw new Error(docData.error || "Erreur création document");

      // Mark demande as replied if this devis was created from a demande
      if (demandeId) {
        try {
          await fetchWithAuth(`/artisans/me/devis/${demandeId}`, {
            method: "PUT",
            body: JSON.stringify({ statut: "REPONDU" }),
          });
        } catch { /* non-blocking */ }
      }

      router.push(`/dashboard/facturation?tab=${docType === "FACTURE" ? "factures" : "devis"}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/dashboard/facturation" style={{ color: "#9C958D", textDecoration: "none", fontSize: 14 }}>&larr; Retour</Link>
          <div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#3D2E1F", display: "inline" }}>
              {isAvoir ? "Nouvel avoir" : docType === "DEVIS" ? "Nouveau devis" : "Nouvelle facture"}
            </h1>
            {isAvoir && fromInvoiceNum && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRadius: 8, background: "rgba(220,38,38,.06)", border: "1px solid rgba(220,38,38,.15)", marginLeft: 12, fontSize: 13, color: "#DC2626", fontWeight: 600, verticalAlign: "middle" }}>
                Facture n&deg;{fromInvoiceNum}
              </span>
            )}
          </div>
        </div>
        {/* Type toggle */}
        <div style={{ display: "flex", borderRadius: 10, border: "1px solid #E8D5C0", overflow: "hidden" }}>
          {(["DEVIS", "FACTURE"] as const).map((t) => (
            <button key={t} onClick={() => setDocType(t)} style={{
              padding: "8px 16px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
              background: docType === t ? "#C4531A" : "#fff",
              color: docType === t ? "#fff" : "#6B6560",
              transition: "all .15s",
            }}>{t === "DEVIS" ? "Devis" : "Facture"}</button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "#fce8e7", color: "#D9453D", fontSize: 13, marginBottom: 20 }}>{error}</div>
      )}

      {/* 2-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }} className="max-md:!grid-cols-1">
        {/* Left — Form */}
        <div>
          {/* Client */}
          <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: "24px", marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#8A8A8E", marginBottom: 14 }}>Client</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="max-md:!grid-cols-1">
              <div>
                <label style={labelStyle}>Nom / Entreprise <span style={{ color: "#C4531A" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <input style={inputStyle} placeholder="Ex: Marie Laurent" value={clientNom} onChange={(e) => searchClients(e.target.value)} onFocus={() => { if (clientSuggestions.length > 0) setShowSuggestions(true); }} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} />
                  {showSuggestions && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "#fff", borderRadius: "0 0 10px 10px", border: "1px solid #E8D5C0", borderTop: "none", boxShadow: "0 4px 12px rgba(0,0,0,.08)", maxHeight: 200, overflow: "auto" }}>
                      {clientSuggestions.map(c => (
                        <button key={c.id} type="button" onMouseDown={() => selectClient(c)} style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", background: "none", border: "none", borderBottom: "1px solid #F3F4F6", cursor: "pointer", fontSize: 13 }}>
                          <div style={{ fontWeight: 600, color: "#3D2E1F" }}>{c.nom}</div>
                          <div style={{ fontSize: 11, color: "#9C958D" }}>{[c.telephone, c.email, c.ville].filter(Boolean).join(" \u00b7 ")}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="client@email.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>T&eacute;l&eacute;phone</label>
                <input style={inputStyle} placeholder="06 12 34 56 78" value={clientTel} onChange={(e) => setClientTel(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Adresse</label>
                <input style={inputStyle} placeholder="12 rue des Artisans, 73000 Chambéry" value={clientAdresse} onChange={(e) => setClientAdresse(e.target.value)} />
              </div>
            </div>
          </section>

          {/* Lignes */}
          <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: "24px", marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#8A8A8E", marginBottom: 14 }}>Prestations</div>

            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 120px 90px 36px", gap: 8, paddingBottom: 8, borderBottom: "1px solid rgba(0,0,0,.06)" }} className="max-md:!hidden">
              <span style={colHeaderStyle}>D&eacute;signation</span>
              <span style={{ ...colHeaderStyle, textAlign: "center" }}>Qt&eacute;</span>
              <span style={{ ...colHeaderStyle, textAlign: "right" }}>Prix HT</span>
              <span style={{ ...colHeaderStyle, textAlign: "center" }}>TVA</span>
              <span />
            </div>

            {/* Rows */}
            {lignes.map((ligne, i) => {
              const lineHT = ligne.quantite * ligne.prixUnitaireHT;
              return (
                <div key={ligne.id} style={{ display: "grid", gridTemplateColumns: "2fr 80px 120px 90px 36px", gap: 8, padding: "10px 0", alignItems: "center", borderBottom: i < lignes.length - 1 ? "1px solid rgba(0,0,0,.03)" : "none" }} className="max-md:!grid-cols-1 max-md:!gap-6 max-md:!py-4 max-md:!border-b max-md:!border-sable">
                  <input style={{ ...inputStyle, fontSize: 14, fontWeight: 500 }} placeholder="Ex: Remplacement écran iPhone 15" value={ligne.designation} onChange={(e) => updateLigne(i, "designation", e.target.value)} />
                  <input style={{ ...inputStyle, textAlign: "center" }} type="number" min="1" step="1" value={ligne.quantite} onChange={(e) => updateLigne(i, "quantite", Number(e.target.value) || 1)} />
                  <input style={{ ...inputStyle, textAlign: "right", fontFamily: "monospace" }} type="number" min="0" step="0.01" placeholder="0.00" value={ligne.prixUnitaireHT || ""} onChange={(e) => updateLigne(i, "prixUnitaireHT", Number(e.target.value) || 0)} />
                  <select style={{ ...inputStyle, textAlign: "center", cursor: "pointer" }} value={ligne.tauxTVA} onChange={(e) => updateLigne(i, "tauxTVA", Number(e.target.value))}>
                    <option value={20}>20%</option>
                    <option value={10}>10%</option>
                    <option value={5.5}>5,5%</option>
                    <option value={0}>0%</option>
                  </select>
                  <button onClick={() => removeLigne(i)} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", fontSize: 14, color: "#9C958D", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#fce8e7"; e.currentTarget.style.color = "#D9453D"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9C958D"; }}
                  >&times;</button>
                  {lineHT > 0 && (
                    <div style={{ gridColumn: "1 / -1", textAlign: "right", paddingRight: 44, fontSize: 11, color: "#C5C0B9" }}>{fmt(lineHT)} HT</div>
                  )}
                </div>
              );
            })}

            {/* Add line */}
            <button onClick={() => setLignes((p) => [...p, newLigne()])} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px dashed rgba(0,0,0,.08)", background: "transparent", fontSize: 12, fontWeight: 600, color: "#C4531A", cursor: "pointer", marginTop: 10, transition: "all .15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f4e0d4"; e.currentTarget.style.borderColor = "#C4531A"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(0,0,0,.08)"; }}
            >+ Ajouter une ligne</button>
          </section>

          {/* Notes */}
          <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: "24px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#8A8A8E", marginBottom: 10 }}>Notes</div>
            <textarea style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} placeholder="Conditions particulières, délai, remarques..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </section>
        </div>

        {/* Right — Summary */}
        <div>
          <div style={{ position: "sticky", top: 24 }}>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: "24px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#8A8A8E", marginBottom: 16 }}>R&eacute;sum&eacute;</div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: "#9C958D" }}>Total HT</span>
                <span style={{ fontFamily: "monospace", fontWeight: 600, color: "#3D2E1F" }}>{fmt(totals.totalHT)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 12 }}>
                <span style={{ color: "#9C958D" }}>TVA</span>
                <span style={{ fontFamily: "monospace", color: "#9C958D" }}>{fmt(totals.totalTVA)}</span>
              </div>
              <div style={{ height: 1, background: "#EDEBE7", marginBottom: 12 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F" }}>Total TTC</span>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "#C4531A" }}>{fmt(totals.totalTTC)}</span>
              </div>

              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => handleSave(true)} disabled={saving} style={{ width: "100%", height: 44, borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: saving ? "wait" : "pointer", opacity: saving ? 0.6 : 1, transition: "opacity .15s" }}>
                  {saving ? "Enregistrement..." : docType === "DEVIS" ? "Valider le devis" : "Valider la facture"}
                </button>
                <button onClick={() => handleSave(false)} disabled={saving} style={{ width: "100%", height: 44, borderRadius: 10, background: "#fff", color: "#6B6560", fontSize: 14, fontWeight: 600, border: "1px solid #E8D5C0", cursor: "pointer" }}>
                  Enregistrer en brouillon
                </button>
              </div>

              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #EDEBE7" }}>
                <p style={{ fontSize: 10, color: "#C5C0B9", lineHeight: 1.5 }}>
                  P&eacute;nalit&eacute;s de retard : 3&times; le taux l&eacute;gal<br />
                  Indemnit&eacute; de recouvrement : 40 &euro;<br />
                  Escompte : N&eacute;ant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#6B6560", marginBottom: 4 };
const inputStyle: React.CSSProperties = { width: "100%", height: 40, borderRadius: 8, border: "1px solid #E8D5C0", padding: "0 12px", fontSize: 13, color: "#3D2E1F", background: "#fff", outline: "none", transition: "border-color .15s", fontFamily: "'Karla', sans-serif" };
const colHeaderStyle: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: "#8A8A8E", textTransform: "uppercase", letterSpacing: 0.5 };

export default function NouveauPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40vh" }}><div style={{ width: 28, height: 28, border: "3px solid #E5E0DB", borderTopColor: "#C4531A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>}>
      <NouveauContent />
    </Suspense>
  );
}
