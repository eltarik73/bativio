"use client";

import { useState, useEffect, use } from "react";

interface DevisPoste {
  designation: string;
  unite?: string;
  quantite: number;
  prixUnitaire?: number;
  prixUnitaireHT?: number;
  totalHT: number;
}

interface DevisData {
  numero: string;
  objet: string;
  clientNom: string;
  clientEmail: string | null;
  clientTelephone: string | null;
  clientAdresse: string | null;
  postes: DevisPoste[];
  totalHT: number;
  tauxTVA: number;
  montantTVA: number;
  totalTTC: number;
  dureeEstimee: string | null;
  conditionsPaiement: string | null;
  notes: string | null;
  mentionSousReserve: boolean;
  validiteJours: number;
  createdAt: string;
  artisan: {
    nomAffichage: string;
    telephone: string | null;
    adresse: string | null;
    ville: string | null;
    codePostal: string | null;
    siret: string;
    metier: string | null;
  };
}

function fmt(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function DevisPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [devis, setDevis] = useState<DevisData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/v1/public/devis/${id}`);
        const json = await res.json();
        if (json.success) setDevis(json.data);
        else setError(true);
      } catch { setError(true); }
    })();
  }, [id]);

  useEffect(() => {
    if (devis) setTimeout(() => window.print(), 500);
  }, [devis]);

  if (error) return <div style={{ padding: 40, textAlign: "center" }}>Devis introuvable</div>;
  if (!devis) return <div style={{ padding: 40, textAlign: "center" }}>Chargement...</div>;

  const a = devis.artisan;
  const validUntil = new Date(devis.createdAt);
  validUntil.setDate(validUntil.getDate() + devis.validiteJours);

  return (
    <>
      <style>{`
        @media print { body { margin: 0; } .no-print { display: none !important; } }
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Karla', Arial, sans-serif; color: #1C1C1E; font-size: 12px; line-height: 1.5; }
      `}</style>

      <div className="no-print" style={{ padding: "12px 24px", background: "#FAF8F5", borderBottom: "1px solid #E8D5C0", display: "flex", justifyContent: "center", gap: 12 }}>
        <button onClick={() => window.print()} style={{ padding: "10px 24px", borderRadius: 8, background: "#C4531A", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
          Imprimer / Sauvegarder en PDF
        </button>
        <button onClick={() => window.close()} style={{ padding: "10px 24px", borderRadius: 8, background: "#fff", color: "#6B6560", fontSize: 14, fontWeight: 600, border: "1px solid #E8D5C0", cursor: "pointer" }}>
          Fermer
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 32px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32, paddingBottom: 16, borderBottom: "2px solid #C4531A" }}>
          <div>
            <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>DEVIS</h1>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#C4531A" }}>N&deg; {devis.numero}</p>
            <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Date : {fmtDate(devis.createdAt)}</p>
            <p style={{ fontSize: 12, color: "#6B7280" }}>Valide jusqu&apos;au : {fmtDate(validUntil.toISOString())}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 16, fontWeight: 700 }}>{a.nomAffichage}</p>
            {a.metier && <p style={{ fontSize: 12, color: "#6B7280" }}>{a.metier}</p>}
            {a.adresse && <p style={{ fontSize: 12, color: "#6B7280" }}>{a.adresse}</p>}
            {(a.codePostal || a.ville) && <p style={{ fontSize: 12, color: "#6B7280" }}>{a.codePostal} {a.ville}</p>}
            {a.telephone && <p style={{ fontSize: 12, color: "#6B7280" }}>{a.telephone}</p>}
            <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>SIRET : {a.siret}</p>
          </div>
        </div>

        {/* Client */}
        <div style={{ background: "#F9FAFB", borderRadius: 8, padding: 16, marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>Client</p>
          <p style={{ fontSize: 14, fontWeight: 600 }}>{devis.clientNom}</p>
          {devis.clientAdresse && <p style={{ fontSize: 12, color: "#6B7280" }}>{devis.clientAdresse}</p>}
          {devis.clientTelephone && <p style={{ fontSize: 12, color: "#6B7280" }}>{devis.clientTelephone}</p>}
          {devis.clientEmail && <p style={{ fontSize: 12, color: "#6B7280" }}>{devis.clientEmail}</p>}
        </div>

        {/* Objet */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", marginBottom: 4 }}>Objet</p>
          <p style={{ fontSize: 14 }}>{devis.objet}</p>
        </div>

        {/* Lignes */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E5E7EB" }}>D&eacute;signation</th>
              <th style={{ padding: "10px 12px", textAlign: "center", fontSize: 11, fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E5E7EB" }}>Qt&eacute;</th>
              <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 11, fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E5E7EB" }}>P.U. HT</th>
              <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 11, fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E5E7EB" }}>Total HT</th>
            </tr>
          </thead>
          <tbody>
            {devis.postes.map((p, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #F3F4F6", fontSize: 13 }}>{p.designation}</td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #F3F4F6", fontSize: 13, textAlign: "center" }}>{p.quantite} {p.unite || ""}</td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #F3F4F6", fontSize: 13, textAlign: "right" }}>{fmt(p.prixUnitaire || p.prixUnitaireHT || 0)} &euro;</td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #F3F4F6", fontSize: 13, textAlign: "right", fontWeight: 600 }}>{fmt(p.totalHT)} &euro;</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totaux */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <div style={{ width: 260 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span style={{ color: "#6B7280" }}>Total HT</span>
              <span style={{ fontWeight: 600 }}>{fmt(devis.totalHT)} &euro;</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span style={{ color: "#6B7280" }}>TVA ({devis.tauxTVA}%)</span>
              <span>{fmt(devis.montantTVA)} &euro;</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "2px solid #1C1C1E", marginTop: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>Total TTC</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#C4531A" }}>{fmt(devis.totalTTC)} &euro;</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {devis.notes && (
          <div style={{ marginBottom: 24, padding: 12, background: "#FFFBEB", borderRadius: 6, border: "1px solid #FEF3C7" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#92400E", marginBottom: 4 }}>Notes</p>
            <p style={{ fontSize: 12, color: "#374151" }}>{devis.notes}</p>
          </div>
        )}

        {devis.dureeEstimee && <p style={{ fontSize: 12, color: "#6B7280" }}><strong>Dur&eacute;e estim&eacute;e :</strong> {devis.dureeEstimee}</p>}

        {/* Mentions legales */}
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #E5E7EB", fontSize: 10, color: "#9CA3AF", lineHeight: 1.6 }}>
          <p>{a.nomAffichage} &mdash; SIRET {a.siret}{a.adresse ? ` &mdash; ${a.adresse}` : ""}{a.ville ? `, ${a.codePostal} ${a.ville}` : ""}</p>
          <p>TVA non applicable, art. 293 B du CGI (si applicable)</p>
          <p>P&eacute;nalit&eacute;s de retard : 3x le taux l&eacute;gal &mdash; Indemnit&eacute; de recouvrement : 40 &euro;</p>
          {devis.mentionSousReserve && <p>Ce devis est &eacute;tabli sous r&eacute;serve de visite technique.</p>}
          <p>Devis valable {devis.validiteJours} jours &agrave; compter du {fmtDate(devis.createdAt)}.</p>
          <p style={{ marginTop: 12 }}>Signature du client pr&eacute;c&eacute;d&eacute;e de la mention &laquo; Bon pour accord &raquo; :</p>
          <div style={{ height: 60, border: "1px dashed #D1D5DB", borderRadius: 6, marginTop: 8 }} />
        </div>
      </div>
    </>
  );
}
