"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_URL = "/api/v1";

interface DevisPoste {
  designation: string;
  unite: string;
  quantite: number;
  prixUnitaire: number;
  totalHT: number;
  tva?: number;
}

interface DevisData {
  id: string;
  numero: string;
  objet: string;
  clientNom: string;
  clientEmail: string | null;
  clientTelephone: string | null;
  clientAdresse: string | null;
  niveauGamme: string;
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
  statut: string;
  createdAt: string;
  envoyeAt: string | null;
  pdfUrl: string | null;
  artisan: {
    nomAffichage: string;
    telephone: string | null;
    adresse: string | null;
    ville: string | null;
    codePostal: string | null;
    siret: string;
    logo: string | null;
    metier: string | null;
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrice(amount: number): string {
  return amount.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function DevisContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [devis, setDevis] = useState<DevisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [responded, setResponded] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [showRefuseForm, setShowRefuseForm] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Lien invalide : token manquant.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `${API_URL}/public/devis/${id}?token=${encodeURIComponent(token)}`
        );
        const json = await res.json();

        if (!json.success) {
          setError(json.error || "Devis introuvable.");
        } else {
          setDevis(json.data);
        }
      } catch {
        setError("Erreur de chargement. Veuillez reessayer.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  const handleAction = async (action: "accept" | "refuse") => {
    if (!token) return;
    setSubmitting(true);

    try {
      const res = await fetch(
        `${API_URL}/public/devis/${id}?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            ...(action === "refuse" && commentaire
              ? { commentaire }
              : {}),
          }),
        }
      );
      const json = await res.json();

      if (json.success) {
        setResponseMessage(
          action === "accept"
            ? "Devis accepte ! L'artisan a ete notifie."
            : "Devis refuse. L'artisan a ete notifie."
        );
        setResponded(true);
      } else {
        setResponseMessage(json.error || "Erreur inattendue.");
        setResponded(true);
      }
    } catch {
      setResponseMessage("Erreur reseau. Veuillez reessayer.");
      setResponded(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 20px",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid #EDEBE7",
            borderTopColor: "#C4531A",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: 500,
          margin: "80px auto",
          textAlign: "center",
          padding: 20,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            margin: "0 auto 16px",
            background: "#FEF2F2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          !
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 20,
            fontWeight: 700,
            color: "#1C1C1E",
            marginBottom: 8,
          }}
        >
          Devis introuvable
        </h2>
        <p style={{ fontSize: 14, color: "#9B9590" }}>{error}</p>
      </div>
    );
  }

  if (!devis) return null;

  const isAlreadyResponded =
    devis.statut === "ACCEPTE" || devis.statut === "REFUSE";

  if (responded) {
    const isAccepted = responseMessage.includes("accepte");
    return (
      <div
        style={{
          maxWidth: 500,
          margin: "80px auto",
          textAlign: "center",
          padding: 20,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            margin: "0 auto 16px",
            background: isAccepted ? "#F0FDF4" : "#FEF2F2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          {isAccepted ? "\u2713" : "\u2717"}
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 22,
            fontWeight: 700,
            color: "#1C1C1E",
            marginBottom: 8,
          }}
        >
          {isAccepted ? "Devis accepte" : "Devis refuse"}
        </h2>
        <p style={{ fontSize: 14, color: "#9B9590", marginTop: 8 }}>
          {responseMessage}
        </p>
      </div>
    );
  }

  const postes: DevisPoste[] = Array.isArray(devis.postes)
    ? devis.postes
    : [];

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: "0 20px 60px",
      }}
    >
      {/* Header card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #EDEBE7",
          padding: "32px 32px 24px",
          marginBottom: 24,
        }}
      >
        {/* Artisan info row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {devis.artisan.logo ? (
              <img
                src={devis.artisan.logo}
                alt={devis.artisan.nomAffichage}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "#C4531A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontFamily: "'Fraunces', serif",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {devis.artisan.nomAffichage.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#1C1C1E",
                  margin: 0,
                }}
              >
                {devis.artisan.nomAffichage}
              </h2>
              {devis.artisan.metier && (
                <p
                  style={{
                    fontSize: 13,
                    color: "#9B9590",
                    margin: "2px 0 0",
                  }}
                >
                  {devis.artisan.metier}
                </p>
              )}
              {(devis.artisan.adresse || devis.artisan.ville) && (
                <p
                  style={{
                    fontSize: 13,
                    color: "#9B9590",
                    margin: "2px 0 0",
                  }}
                >
                  {[
                    devis.artisan.adresse,
                    [devis.artisan.codePostal, devis.artisan.ville]
                      .filter(Boolean)
                      .join(" "),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {devis.artisan.telephone && (
                <p
                  style={{
                    fontSize: 13,
                    color: "#9B9590",
                    margin: "2px 0 0",
                  }}
                >
                  {devis.artisan.telephone}
                </p>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#C4531A",
                margin: 0,
              }}
            >
              DEVIS N&deg; {devis.numero}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#9B9590",
                margin: "4px 0 0",
              }}
            >
              Date : {formatDate(devis.envoyeAt || devis.createdAt)}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#9B9590",
                margin: "2px 0 0",
              }}
            >
              Valable {devis.validiteJours} jours
            </p>
            {isAlreadyResponded && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background:
                    devis.statut === "ACCEPTE" ? "#F0FDF4" : "#FEF2F2",
                  color:
                    devis.statut === "ACCEPTE" ? "#16a34a" : "#dc2626",
                }}
              >
                {devis.statut === "ACCEPTE" ? "Accepte" : "Refuse"}
              </span>
            )}
          </div>
        </div>

        {/* Separator */}
        <div
          style={{
            width: 40,
            height: 2,
            background: "#C4531A",
            marginBottom: 20,
          }}
        />

        {/* Client info */}
        <div style={{ marginBottom: 16 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#9B9590",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              margin: "0 0 6px",
            }}
          >
            Client
          </p>
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#1C1C1E",
              margin: 0,
            }}
          >
            {devis.clientNom}
          </p>
          {devis.clientAdresse && (
            <p style={{ fontSize: 13, color: "#6B6560", margin: "2px 0 0" }}>
              {devis.clientAdresse}
            </p>
          )}
          {devis.clientTelephone && (
            <p style={{ fontSize: 13, color: "#6B6560", margin: "2px 0 0" }}>
              {devis.clientTelephone}
            </p>
          )}
          {devis.clientEmail && (
            <p style={{ fontSize: 13, color: "#6B6560", margin: "2px 0 0" }}>
              {devis.clientEmail}
            </p>
          )}
        </div>

        {/* Objet */}
        <div
          style={{
            background: "#FAF8F5",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#9B9590",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              margin: "0 0 4px",
            }}
          >
            Objet
          </p>
          <p style={{ fontSize: 15, color: "#1C1C1E", margin: 0 }}>
            {devis.objet}
          </p>
          {devis.dureeEstimee && (
            <p style={{ fontSize: 13, color: "#6B6560", margin: "6px 0 0" }}>
              Duree estimee : {devis.dureeEstimee}
            </p>
          )}
        </div>
      </div>

      {/* Postes table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #EDEBE7",
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#1C1C1E",
                  color: "#fff",
                }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  Designation
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "12px 16px",
                    fontWeight: 600,
                    fontSize: 13,
                    whiteSpace: "nowrap",
                  }}
                >
                  Unite
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "12px 16px",
                    fontWeight: 600,
                    fontSize: 13,
                    whiteSpace: "nowrap",
                  }}
                >
                  Qte
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "12px 16px",
                    fontWeight: 600,
                    fontSize: 13,
                    whiteSpace: "nowrap",
                  }}
                >
                  P.U. HT
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "12px 16px",
                    fontWeight: 600,
                    fontSize: 13,
                    whiteSpace: "nowrap",
                  }}
                >
                  Total HT
                </th>
              </tr>
            </thead>
            <tbody>
              {postes.map((poste, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid #EDEBE7",
                    background: i % 2 === 0 ? "#fff" : "#FAFAF8",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#1C1C1E",
                    }}
                  >
                    {poste.designation}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      color: "#6B6560",
                    }}
                  >
                    {poste.unite}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      color: "#6B6560",
                    }}
                  >
                    {poste.quantite}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      color: "#6B6560",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatPrice(poste.prixUnitaire)} &euro;
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontWeight: 600,
                      color: "#1C1C1E",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatPrice(poste.totalHT)} &euro;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div
          style={{
            borderTop: "2px solid #EDEBE7",
            padding: "16px 16px 20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ minWidth: 240 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                fontSize: 14,
                color: "#6B6560",
              }}
            >
              <span>Total HT</span>
              <span>{formatPrice(devis.totalHT)} &euro;</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                fontSize: 14,
                color: "#6B6560",
              }}
            >
              <span>TVA ({devis.tauxTVA}%)</span>
              <span>{formatPrice(devis.montantTVA)} &euro;</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0 0",
                borderTop: "2px solid #1C1C1E",
                marginTop: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1C1C1E",
                }}
              >
                Total TTC
              </span>
              <span
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#C4531A",
                }}
              >
                {formatPrice(devis.totalTTC)} &euro;
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes & conditions */}
      {(devis.notes || devis.conditionsPaiement || devis.mentionSousReserve) && (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #EDEBE7",
            padding: "24px 32px",
            marginBottom: 24,
          }}
        >
          {devis.notes && (
            <div style={{ marginBottom: devis.conditionsPaiement ? 16 : 0 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#9B9590",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  margin: "0 0 6px",
                }}
              >
                Notes
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#6B6560",
                  margin: 0,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {devis.notes}
              </p>
            </div>
          )}
          {devis.conditionsPaiement && (
            <div style={{ marginBottom: devis.mentionSousReserve ? 16 : 0 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#9B9590",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  margin: "0 0 6px",
                }}
              >
                Conditions de paiement
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#6B6560",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {devis.conditionsPaiement}
              </p>
            </div>
          )}
          {devis.mentionSousReserve && (
            <p
              style={{
                fontSize: 12,
                color: "#9B9590",
                fontStyle: "italic",
                margin: 0,
              }}
            >
              * Devis sous reserve de visite technique sur place. Les prix
              peuvent varier en fonction de contraintes non visibles.
            </p>
          )}
        </div>
      )}

      {/* SIRET footer */}
      <p
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#9B9590",
          marginBottom: 32,
        }}
      >
        SIRET : {devis.artisan.siret}
      </p>

      {/* Action buttons */}
      {!isAlreadyResponded && (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #EDEBE7",
            padding: 32,
          }}
        >
          <h3
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#1C1C1E",
              margin: "0 0 8px",
              textAlign: "center",
            }}
          >
            Votre decision
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "#9B9590",
              textAlign: "center",
              margin: "0 0 24px",
            }}
          >
            Acceptez ou refusez ce devis. L&apos;artisan sera notifie
            immediatement.
          </p>

          {showRefuseForm && (
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1C1C1E",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Raison du refus (facultatif)
              </label>
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                rows={3}
                placeholder="Prix trop eleve, delai trop long, autre prestataire..."
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "1.5px solid #E0DDD8",
                  fontSize: 14,
                  fontFamily: "'Karla', sans-serif",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => handleAction("accept")}
              disabled={submitting}
              style={{
                padding: "14px 32px",
                borderRadius: 10,
                border: "none",
                fontSize: 15,
                fontWeight: 600,
                cursor: submitting ? "wait" : "pointer",
                background: "#16a34a",
                color: "#fff",
                opacity: submitting ? 0.6 : 1,
                minWidth: 180,
                transition: "opacity 0.2s",
              }}
            >
              {submitting ? "Envoi..." : "Accepter le devis"}
            </button>

            {!showRefuseForm ? (
              <button
                onClick={() => setShowRefuseForm(true)}
                disabled={submitting}
                style={{
                  padding: "14px 32px",
                  borderRadius: 10,
                  border: "2px solid #dc2626",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "transparent",
                  color: "#dc2626",
                  minWidth: 180,
                  transition: "opacity 0.2s",
                }}
              >
                Refuser
              </button>
            ) : (
              <button
                onClick={() => handleAction("refuse")}
                disabled={submitting}
                style={{
                  padding: "14px 32px",
                  borderRadius: 10,
                  border: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: submitting ? "wait" : "pointer",
                  background: "#dc2626",
                  color: "#fff",
                  opacity: submitting ? 0.6 : 1,
                  minWidth: 180,
                  transition: "opacity 0.2s",
                }}
              >
                {submitting ? "Envoi..." : "Confirmer le refus"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DevisViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <>
      <Navbar />
      <DevisContent params={params} />
      <Footer />
    </>
  );
}
