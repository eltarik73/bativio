"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

/* ───── Types ───── */

interface Poste {
  categorie: string;
  designation: string;
  quantite: number;
  unite: string;
  prixUnitaireHT: number;
}

interface DevisGenerated {
  id: string;
  numero: string;
  objet: string;
  postes: Poste[];
  tauxTVA: number;
  notes: string;
  sousReserveVisite: boolean;
  duree: string;
  conditionsPaiement: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  clientAdresse: string;
}

/* ───── Helpers ───── */

function formatEuros(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

/* ───── Component ───── */

export default function NouveauDevisIAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { fetchWithAuth } = useAuth();

  /* Step 1 state */
  const [step, setStep] = useState<1 | 2>(1);
  const [clientNom, setClientNom] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientTelephone, setClientTelephone] = useState("");
  const [clientAdresse, setClientAdresse] = useState("");
  const [description, setDescription] = useState("");
  const [surface, setSurface] = useState("");
  const [niveauGamme, setNiveauGamme] = useState<"STANDARD" | "PREMIUM">(
    "STANDARD"
  );
  const [fournitureOption, setFournitureOption] = useState<"artisan_fournit" | "client_fournit" | "a_definir">("artisan_fournit");
  const [showFourniture, setShowFourniture] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  /* Step 2 state */
  const [devisId, setDevisId] = useState<string | null>(null);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [tauxTVA, setTauxTVA] = useState(20);
  const [notes, setNotes] = useState("");
  const [sousReserveVisite, setSousReserveVisite] = useState(true);
  const [duree, setDuree] = useState("");
  const [conditionsPaiement, setConditionsPaiement] = useState(
    "30% \u00e0 la commande, 40% au d\u00e9but des travaux, 30% \u00e0 la r\u00e9ception"
  );
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  /* Load tarification to check fourniture policy */
  useEffect(() => {
    fetchWithAuth("/artisans/me/tarification").then((data) => {
      const t = data as { fourniturePolicy?: string } | null;
      if (t?.fourniturePolicy === "client_peut_fournir" || t?.fourniturePolicy === "peu_importe") {
        setShowFourniture(true);
      }
    }).catch(() => {});
  }, [fetchWithAuth]);

  /* Load existing devis if editing */
  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const data = (await fetchWithAuth(
          `/artisans/me/devis-ia/${editId}`
        )) as DevisGenerated;
        setDevisId(data.id);
        setClientNom(data.clientNom || "");
        setClientEmail(data.clientEmail || "");
        setClientTelephone(data.clientTelephone || "");
        setClientAdresse(data.clientAdresse || "");
        setPostes(data.postes || []);
        setTauxTVA(data.tauxTVA || 20);
        setNotes(data.notes || "");
        setSousReserveVisite(data.sousReserveVisite ?? true);
        setDuree(data.duree || "");
        setConditionsPaiement(
          data.conditionsPaiement ||
            "30% \u00e0 la commande, 40% au d\u00e9but des travaux, 30% \u00e0 la r\u00e9ception"
        );
        setStep(2);
      } catch {
        /* empty */
      }
    })();
  }, [editId, fetchWithAuth]);

  /* ───── Calculations ───── */

  const totalHT = postes.reduce(
    (sum, p) => sum + p.quantite * p.prixUnitaireHT,
    0
  );
  const montantTVA = totalHT * (tauxTVA / 100);
  const totalTTC = totalHT + montantTVA;

  /* ───── Handlers ───── */

  const handleGenerate = useCallback(async () => {
    if (!clientNom.trim() || !description.trim()) return;
    setGenerating(true);
    setGenError("");
    try {
      const data = (await fetchWithAuth("/artisans/me/devis-ia", {
        method: "POST",
        body: JSON.stringify({
          clientNom,
          clientEmail,
          clientTelephone,
          clientAdresse,
          description,
          surface,
          niveauGamme,
          fournitureOption,
        }),
      })) as DevisGenerated;
      setDevisId(data.id);
      setPostes(data.postes || []);
      setTauxTVA(data.tauxTVA || 20);
      setNotes(data.notes || "");
      setSousReserveVisite(data.sousReserveVisite ?? true);
      setDuree(data.duree || "");
      if (data.conditionsPaiement) {
        setConditionsPaiement(data.conditionsPaiement);
      }
      setStep(2);
    } catch (err) {
      setGenError(
        err instanceof Error ? err.message : "Erreur lors de la g\u00e9n\u00e9ration"
      );
    } finally {
      setGenerating(false);
    }
  }, [
    clientNom,
    clientEmail,
    clientTelephone,
    clientAdresse,
    description,
    surface,
    niveauGamme,
    fetchWithAuth,
  ]);

  const handleUpdatePoste = (
    index: number,
    field: keyof Poste,
    value: string | number
  ) => {
    setPostes((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const handleRemovePoste = (index: number) => {
    setPostes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPoste = () => {
    setPostes((prev) => [
      ...prev,
      {
        categorie: "",
        designation: "",
        quantite: 1,
        unite: "u",
        prixUnitaireHT: 0,
      },
    ]);
  };

  const handleSave = useCallback(async () => {
    if (!devisId) return;
    setSaving(true);
    setSaveMsg("");
    try {
      await fetchWithAuth(`/artisans/me/devis-ia/${devisId}`, {
        method: "PUT",
        body: JSON.stringify({
          postes,
          tauxTVA,
          notes,
          sousReserveVisite,
          duree,
          conditionsPaiement,
        }),
      });
      setSaveMsg("Brouillon enregistr\u00e9");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("Erreur lors de l\u2019enregistrement");
    } finally {
      setSaving(false);
    }
  }, [
    devisId,
    postes,
    tauxTVA,
    notes,
    sousReserveVisite,
    duree,
    conditionsPaiement,
    fetchWithAuth,
  ]);

  const handleSend = useCallback(async () => {
    if (!devisId) return;
    setSending(true);
    try {
      await fetchWithAuth(`/artisans/me/devis-ia/${devisId}/send`, {
        method: "POST",
      });
      router.push("/dashboard/devis-ia");
    } catch {
      setSaveMsg("Erreur lors de l\u2019envoi");
    } finally {
      setSending(false);
    }
  }, [devisId, fetchWithAuth, router]);

  /* ───── Shared styles ───── */

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid #E0DDD8",
    fontSize: 14,
    fontFamily: "'Karla', sans-serif",
    color: "var(--bois,#3D2E1F)",
    outline: "none",
    background: "#fff",
    transition: "border-color .15s",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--bois,#3D2E1F)",
    marginBottom: 6,
    display: "block",
  };

  /* ───── Render ───── */

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Back link */}
      <Link
        href="/dashboard/devis-ia"
        style={{
          fontSize: 13,
          color: "var(--pierre,#9C958D)",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 20,
        }}
      >
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Retour aux devis
      </Link>

      <h1
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 24,
          fontWeight: 700,
          color: "var(--bois,#3D2E1F)",
          marginBottom: 24,
        }}
      >
        {editId ? "Modifier le devis" : "Nouveau devis IA"}
      </h1>

      {/* ──── STEP 1 ──── */}
      {step === 1 && (
        <div>
          {/* IA Hero */}
          <div style={{ background: "linear-gradient(135deg, #1C1C1E 0%, #2d1a0e 100%)", borderRadius: 16, padding: "32px 28px", marginBottom: 20, color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <svg width="24" height="24" fill="none" stroke="#E8A84C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.937A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.962 0L14.063 8.5A2 2 0 0015.5 9.937l6.135 1.582a.5.5 0 010 .962L15.5 14.063a2 2 0 00-1.437 1.437l-1.582 6.135a.5.5 0 01-.962 0L9.937 15.5z"/></svg>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#E8A84C", textTransform: "uppercase", letterSpacing: 1 }}>Intelligence artificielle</span>
            </div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, lineHeight: 1.2, marginBottom: 8 }}>
              D&eacute;crivez les travaux, l&apos;IA g&eacute;n&egrave;re le devis
            </h2>
            <p style={{ fontSize: 14, opacity: 0.5 }}>L&apos;IA analyse votre description et cr&eacute;e un devis d&eacute;taill&eacute; avec les postes, quantit&eacute;s et prix bas&eacute;s sur vos tarifs.</p>
          </div>

          {/* Description — the MAIN field */}
          <div style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 14, padding: 24, marginBottom: 16 }}>
            <label style={{ ...labelStyle, fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
              Que doit faire le client ? <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={"R\u00e9novation compl\u00e8te salle de bain 6m\u00b2 : d\u00e9pose carrelage, plomberie, pose fa\u00efence et douche italienne..."}
              rows={4}
              style={{ ...inputStyle, fontSize: 15, resize: "vertical", border: "2px solid #E8D5C0" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }} className="max-md:!grid-cols-1">
              <div>
                <label style={labelStyle}>Surface</label>
                <input type="text" value={surface} onChange={(e) => setSurface(e.target.value)} placeholder={"ex: 8m\u00b2"} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Niveau de gamme</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["STANDARD", "PREMIUM"] as const).map((level) => (
                    <button key={level} type="button" onClick={() => setNiveauGamme(level)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: niveauGamme === level ? "2px solid #C4531A" : "1.5px solid #E0DDD8", background: niveauGamme === level ? "rgba(196,83,26,.06)" : "#fff", color: niveauGamme === level ? "#C4531A" : "#6B6560" }}>
                      {level === "STANDARD" ? "Standard" : "Premium"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Client info — secondary */}
          <div style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 14, padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F", marginBottom: 12 }}>Client</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="max-md:!grid-cols-1">
              <div>
                <label style={labelStyle}>Nom <span style={{ color: "#dc2626" }}>*</span></label>
                <input type="text" value={clientNom} onChange={(e) => setClientNom(e.target.value)} placeholder="Jean Dupont" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="jean@exemple.fr" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{"T\u00e9l\u00e9phone"}</label>
                <input type="tel" value={clientTelephone} onChange={(e) => setClientTelephone(e.target.value)} placeholder="06 12 34 56 78" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Adresse</label>
                <input type="text" value={clientAdresse} onChange={(e) => setClientAdresse(e.target.value)} placeholder="Adresse du chantier" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Fourniture moved here */}

          {/* Fourniture option */}
          {showFourniture && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Le client fournit-il les matériaux ?</label>
              <div style={{ display: "flex", gap: 8 }}>
                {([
                  { value: "artisan_fournit", label: "Non — je fournis tout" },
                  { value: "client_fournit", label: "Oui — MO seule" },
                  { value: "a_definir", label: "Pas encore défini" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFournitureOption(opt.value)}
                    style={{
                      flex: 1, padding: "10px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      border: fournitureOption === opt.value ? "2px solid #C4531A" : "1.5px solid #E0DDD8",
                      background: fournitureOption === opt.value ? "rgba(196,83,26,.05)" : "#fff",
                      color: fournitureOption === opt.value ? "#C4531A" : "#6B6560",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {fournitureOption === "client_fournit" && (
                <p style={{ fontSize: 12, color: "var(--pierre,#9C958D)", marginTop: 6 }}>Le devis sera en main d&apos;œuvre seule. Les prix indicatifs des matériaux seront affichés à titre informatif.</p>
              )}
              {fournitureOption === "a_definir" && (
                <p style={{ fontSize: 12, color: "var(--pierre,#9C958D)", marginTop: 6 }}>L&apos;IA générera 2 options : fourni-posé et pose seule.</p>
              )}
            </div>
          )}

          {/* Error */}
          {genError && (
            <div
              style={{
                background: "rgba(220,38,38,.06)",
                border: "1px solid rgba(220,38,38,.2)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#dc2626",
                marginBottom: 16,
              }}
            >
              {genError}
            </div>
          )}

          {/* Generate button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !clientNom.trim() || !description.trim()}
            style={{
              width: "100%",
              padding: "16px 0",
              borderRadius: 12,
              background: generating || !clientNom.trim() || !description.trim()
                ? "#9CA3AF"
                : "linear-gradient(135deg, #C4531A 0%, #E8A84C 100%)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "'Karla', sans-serif",
              border: "none",
              cursor: generating || !clientNom.trim() || !description.trim()
                ? "not-allowed"
                : "pointer",
              opacity: generating ? 0.8 : 1,
              transition: "all .15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: generating ? "none" : "0 4px 16px rgba(196,83,26,.3)",
            }}
          >
            {generating && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  animation: "spin 1s linear infinite",
                }}
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="rgba(255,255,255,.3)"
                  strokeWidth="3"
                />
                <path
                  d="M12 2a10 10 0 019.95 9"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {generating
              ? "G\u00e9n\u00e9ration en cours..."
              : "G\u00e9n\u00e9rer le devis avec l\u2019IA \u2728"}
          </button>

          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* ──── STEP 2 ──── */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Client recap */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--sable,#E8D5C0)",
              borderRadius: 14,
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{ fontSize: 14, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}
            >
              {clientNom}
            </span>
            {clientEmail && (
              <span style={{ fontSize: 13, color: "var(--pierre,#9C958D)" }}>
                {clientEmail}
              </span>
            )}
            {clientTelephone && (
              <span style={{ fontSize: 13, color: "var(--pierre,#9C958D)" }}>
                &middot; {clientTelephone}
              </span>
            )}
          </div>

          {/* Postes table */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--sable,#E8D5C0)",
              borderRadius: 14,
              padding: 24,
              overflowX: "auto",
            }}
          >
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--bois,#3D2E1F)",
                marginBottom: 16,
              }}
            >
              D&eacute;tail des postes
            </h2>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1.5px solid #EDEBE7",
                    textAlign: "left",
                  }}
                >
                  <th
                    style={{
                      padding: "8px 6px",
                      color: "var(--pierre,#9C958D)",
                      fontWeight: 600,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Cat&eacute;gorie
                  </th>
                  <th
                    style={{
                      padding: "8px 6px",
                      color: "var(--pierre,#9C958D)",
                      fontWeight: 600,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    D&eacute;signation
                  </th>
                  <th
                    style={{
                      padding: "8px 6px",
                      color: "var(--pierre,#9C958D)",
                      fontWeight: 600,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      width: 70,
                    }}
                  >
                    Qt&eacute;
                  </th>
                  <th
                    style={{
                      padding: "8px 6px",
                      color: "var(--pierre,#9C958D)",
                      fontWeight: 600,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      width: 70,
                    }}
                  >
                    Unit&eacute;
                  </th>
                  <th
                    style={{
                      padding: "8px 6px",
                      color: "var(--pierre,#9C958D)",
                      fontWeight: 600,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      width: 100,
                    }}
                  >
                    PU HT
                  </th>
                  <th
                    style={{
                      padding: "8px 6px",
                      color: "var(--pierre,#9C958D)",
                      fontWeight: 600,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      width: 100,
                      textAlign: "right",
                    }}
                  >
                    Total HT
                  </th>
                  <th style={{ width: 36 }} />
                </tr>
              </thead>
              <tbody>
                {postes.map((p, i) => {
                  const rowTotal = p.quantite * p.prixUnitaireHT;
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid #F7F5F2",
                      }}
                    >
                      <td style={{ padding: "6px 4px" }}>
                        <input
                          value={p.categorie}
                          onChange={(e) =>
                            handleUpdatePoste(i, "categorie", e.target.value)
                          }
                          style={{
                            ...inputStyle,
                            padding: "6px 8px",
                            fontSize: 13,
                            border: "1px solid var(--sable,#E8D5C0)",
                          }}
                        />
                      </td>
                      <td style={{ padding: "6px 4px" }}>
                        <input
                          value={p.designation}
                          onChange={(e) =>
                            handleUpdatePoste(i, "designation", e.target.value)
                          }
                          style={{
                            ...inputStyle,
                            padding: "6px 8px",
                            fontSize: 13,
                            border: "1px solid var(--sable,#E8D5C0)",
                          }}
                        />
                      </td>
                      <td style={{ padding: "6px 4px" }}>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={p.quantite}
                          onChange={(e) =>
                            handleUpdatePoste(
                              i,
                              "quantite",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          style={{
                            ...inputStyle,
                            padding: "6px 8px",
                            fontSize: 13,
                            border: "1px solid var(--sable,#E8D5C0)",
                            textAlign: "right",
                          }}
                        />
                      </td>
                      <td style={{ padding: "6px 4px" }}>
                        <input
                          value={p.unite}
                          onChange={(e) =>
                            handleUpdatePoste(i, "unite", e.target.value)
                          }
                          style={{
                            ...inputStyle,
                            padding: "6px 8px",
                            fontSize: 13,
                            border: "1px solid var(--sable,#E8D5C0)",
                          }}
                        />
                      </td>
                      <td style={{ padding: "6px 4px" }}>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={p.prixUnitaireHT}
                          onChange={(e) =>
                            handleUpdatePoste(
                              i,
                              "prixUnitaireHT",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          style={{
                            ...inputStyle,
                            padding: "6px 8px",
                            fontSize: 13,
                            border: "1px solid var(--sable,#E8D5C0)",
                            textAlign: "right",
                          }}
                        />
                      </td>
                      <td
                        style={{
                          padding: "6px 4px",
                          textAlign: "right",
                          fontWeight: 600,
                          color: "var(--bois,#3D2E1F)",
                          fontSize: 13,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatEuros(rowTotal)}
                      </td>
                      <td style={{ padding: "6px 4px", textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => handleRemovePoste(i)}
                          title="Supprimer ce poste"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#dc2626",
                            fontSize: 18,
                            lineHeight: 1,
                            padding: 4,
                            borderRadius: 4,
                            transition: "background .15s",
                          }}
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Add row */}
            <button
              type="button"
              onClick={handleAddPoste}
              style={{
                marginTop: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                color: "#C4531A",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px 0",
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Ajouter un poste
            </button>
          </div>

          {/* Totals */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--sable,#E8D5C0)",
              borderRadius: 14,
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                maxWidth: 340,
                marginLeft: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: "var(--bois-mid,#5C4A3A)",
                }}
              >
                <span>Total HT</span>
                <span style={{ fontWeight: 600 }}>{formatEuros(totalHT)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                  color: "var(--bois-mid,#5C4A3A)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  TVA
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={tauxTVA}
                    onChange={(e) =>
                      setTauxTVA(parseFloat(e.target.value) || 0)
                    }
                    style={{
                      width: 56,
                      padding: "4px 6px",
                      borderRadius: 6,
                      border: "1px solid var(--sable,#E8D5C0)",
                      fontSize: 13,
                      textAlign: "right",
                      outline: "none",
                    }}
                  />
                  <span style={{ fontSize: 13 }}>%</span>
                </span>
                <span style={{ fontWeight: 600 }}>
                  {formatEuros(montantTVA)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--bois,#3D2E1F)",
                  borderTop: "2px solid #EDEBE7",
                  paddingTop: 10,
                }}
              >
                <span
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  Total TTC
                </span>
                <span style={{ fontFamily: "'Fraunces', serif" }}>
                  {formatEuros(totalTTC)}
                </span>
              </div>
            </div>
          </div>

          {/* Options */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--sable,#E8D5C0)",
              borderRadius: 14,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
              className="max-md:grid-cols-1"
            >
              <div>
                <label style={labelStyle}>Dur&eacute;e estim&eacute;e des travaux</label>
                <input
                  type="text"
                  value={duree}
                  onChange={(e) => setDuree(e.target.value)}
                  placeholder="ex: 3 jours"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Conditions de paiement</label>
                <input
                  type="text"
                  value={conditionsPaiement}
                  onChange={(e) => setConditionsPaiement(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                fontSize: 14,
                color: "var(--bois,#3D2E1F)",
              }}
            >
              <input
                type="checkbox"
                checked={sousReserveVisite}
                onChange={(e) => setSousReserveVisite(e.target.checked)}
                style={{
                  width: 18,
                  height: 18,
                  accentColor: "#C4531A",
                  cursor: "pointer",
                }}
              />
              Sous r&eacute;serve de visite de chantier
            </label>
          </div>

          {/* Save message */}
          {saveMsg && (
            <div
              style={{
                textAlign: "center",
                fontSize: 13,
                fontWeight: 600,
                color: saveMsg.includes("Erreur") ? "#dc2626" : "#16a34a",
                padding: "6px 0",
              }}
            >
              {saveMsg}
            </div>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "12px 28px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'Karla', sans-serif",
                background: "#fff",
                color: "var(--bois,#3D2E1F)",
                border: "1.5px solid #E0DDD8",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
                transition: "all .15s",
              }}
            >
              {saving ? "Enregistrement..." : "Enregistrer brouillon"}
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              style={{
                padding: "12px 28px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'Karla', sans-serif",
                background: sending ? "#D4733A" : "#C4531A",
                color: "#fff",
                border: "none",
                cursor: sending ? "not-allowed" : "pointer",
                opacity: sending ? 0.6 : 1,
                transition: "all .15s",
              }}
            >
              {sending ? "Envoi..." : "Envoyer au client"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
