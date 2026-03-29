"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const DOT: Record<string, string> = { NOUVEAU: "#dc2626", VU: "#E8A84C", REPONDU: "#2563EB", ACCEPTE: "#16a34a", REFUSE: "#9B9590", ARCHIVE: "#C5C0B9" };
const LABEL: Record<string, string> = { NOUVEAU: "Nouveau", VU: "En attente", REPONDU: "R\u00e9pondu", ACCEPTE: "Accept\u00e9", REFUSE: "Refus\u00e9", ARCHIVE: "Archiv\u00e9" };

interface Reply {
  id: string;
  message: string;
  attachmentUrl: string | null;
  attachmentFilename: string | null;
  type: string;
  createdAt: string;
}

interface DevisDetail {
  id: string;
  nomClient: string;
  telephoneClient: string;
  emailClient: string;
  descriptionBesoin: string;
  statut: string;
  createdAt: string;
  reponduAt: string | null;
  replies: Reply[];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) + " a " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function DevisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { fetchWithAuth, user } = useAuth();
  const [devis, setDevis] = useState<DevisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyOpen, setReplyOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [replyMsg, setReplyMsg] = useState("");
  const [pdfMsg, setPdfMsg] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const d = await fetchWithAuth(`/artisans/me/devis/${id}`) as DevisDetail;
        setDevis(d);
        // Mark as read if new
        if (d.statut === "NOUVEAU") {
          await fetchWithAuth(`/artisans/me/devis/${id}/mark-read`, { method: "PUT" });
          setDevis((prev) => prev ? { ...prev, statut: "VU" } : prev);
        }
      } catch { /* empty */ }
      finally { setLoading(false); }
    })();
  }, [id, fetchWithAuth]);

  const handleReply = async () => {
    if (!replyMsg.trim()) return;
    setSending(true);
    try {
      await fetchWithAuth(`/artisans/me/devis/${id}/reply`, {
        method: "POST",
        body: JSON.stringify({ message: replyMsg, type: "MESSAGE" }),
      });
      setSent(true);
      setReplyOpen(false);
      setReplyMsg("");
      // Refresh
      const d = await fetchWithAuth(`/artisans/me/devis/${id}`) as DevisDetail;
      setDevis(d);
    } catch { /* empty */ }
    finally { setSending(false); }
  };

  const handlePdfUpload = async () => {
    if (!pdfFile) return;
    setSending(true);
    try {
      // Upload PDF to Cloudinary via the photo upload endpoint (reuse)
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("titre", pdfFile.name);

      const API_URL = "/api/v1";
      const token = localStorage.getItem("bativio_token");
      const uploadRes = await fetch(`${API_URL}/artisans/me/devis/${id}/upload-quote`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.success) throw new Error(uploadJson.error || "Erreur upload");

      setSent(true);
      setPdfOpen(false);
      setPdfFile(null);
      setPdfMsg("");
      const d = await fetchWithAuth(`/artisans/me/devis/${id}`) as DevisDetail;
      setDevis(d);
    } catch { /* empty */ }
    finally { setSending(false); }
  };

  const handleArchive = async () => {
    try {
      await fetchWithAuth(`/artisans/me/devis/${id}/statut`, {
        method: "PUT",
        body: JSON.stringify({ statut: "ARCHIVE" }),
      });
      setDevis((prev) => prev ? { ...prev, statut: "ARCHIVE" } : prev);
    } catch { /* empty */ }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#9B9590" }}>Chargement...</div>;
  if (!devis) return <div style={{ padding: 40, textAlign: "center", color: "#9B9590" }}>Demande introuvable</div>;

  const C: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", padding: "24px 28px" };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Link href="/dashboard/devis" style={{ fontSize: 14, color: "#C4531A", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Retour aux demandes
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }} className="max-md:grid-cols-1">
        {/* Left — Details */}
        <div>
          <div style={C}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: DOT[devis.statut] }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: DOT[devis.statut] }}>{LABEL[devis.statut]}</span>
              <span style={{ fontSize: 13, color: "#C5C0B9", marginLeft: "auto" }}>{formatDate(devis.createdAt)}</span>
            </div>

            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Demande de {devis.nomClient}</h2>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Description du besoin</p>
              <div style={{ background: "#FAF8F5", borderRadius: 10, padding: 16 }}>
                <p style={{ fontSize: 14, color: "#1C1C1E", lineHeight: 1.6 }}>{devis.descriptionBesoin}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {devis.replies.length > 0 && (
            <div style={{ ...C, marginTop: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>Historique</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>&#128233;</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1C1C1E" }}>Demande re&ccedil;ue</p>
                    <p style={{ fontSize: 12, color: "#9B9590" }}>{formatDate(devis.createdAt)}</p>
                  </div>
                </div>
                {devis.replies.map((r) => (
                  <div key={r.id} style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{r.type === "QUOTE_UPLOAD" ? "\uD83D\uDCCE" : "\uD83D\uDCAC"}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#1C1C1E" }}>{r.type === "QUOTE_UPLOAD" ? "Devis envoy\u00e9" : "R\u00e9ponse envoy\u00e9e"}</p>
                      <p style={{ fontSize: 12, color: "#9B9590", marginBottom: 6 }}>{formatDate(r.createdAt)}</p>
                      <div style={{ background: "#F7F5F2", borderRadius: 8, padding: 12 }}>
                        <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5 }}>{r.message}</p>
                        {r.attachmentUrl && (
                          <a href={r.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 13, color: "#C4531A", fontWeight: 600, textDecoration: "none" }}>
                            &#128206; {r.attachmentFilename || "Pi\u00e8ce jointe"}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {devis.statut === "ACCEPTE" && (
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>&#9989;</span>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>Devis accept&eacute; par {devis.nomClient}</p>
                  </div>
                )}
                {devis.statut === "REFUSE" && (
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>&#10060;</span>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#dc2626" }}>Devis d&eacute;clin&eacute; par {devis.nomClient}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right — Client + Actions */}
        <div>
          <div style={C}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>Client</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15 }}>&#128100;</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{devis.nomClient}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 15 }}>&#128222;</span>
                  <span style={{ fontSize: 14, color: "#6B6560" }}>{devis.telephoneClient}</span>
                </div>
                <a href={`tel:${devis.telephoneClient.replace(/\s/g, "")}`} style={{ fontSize: 12, fontWeight: 600, color: "#C4531A", textDecoration: "none" }}>Appeler</a>
              </div>
              {devis.emailClient && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15 }}>&#128231;</span>
                    <span style={{ fontSize: 14, color: "#6B6560" }}>{devis.emailClient}</span>
                  </div>
                  <a href={`mailto:${devis.emailClient}`} style={{ fontSize: 12, fontWeight: 600, color: "#C4531A", textDecoration: "none" }}>Email</a>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ ...C, marginTop: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href={`tel:${devis.telephoneClient.replace(/\s/g, "")}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, borderRadius: 10, border: "1.5px solid #E0DDD8", fontSize: 14, fontWeight: 600, color: "#1C1C1E", textDecoration: "none" }}>
                &#128222; Appeler le client
              </a>
              <button onClick={() => { setReplyOpen(!replyOpen); setPdfOpen(false); setSent(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
                &#128172; R&eacute;pondre par message
              </button>
              <button onClick={() => { setPdfOpen(!pdfOpen); setReplyOpen(false); setSent(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, borderRadius: 10, border: "1.5px solid #C4531A", fontSize: 14, fontWeight: 600, color: "#C4531A", background: "none", cursor: "pointer" }}>
                &#128206; Envoyer un devis PDF
              </button>
              <button disabled style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, borderRadius: 10, border: "1.5px solid #E0DDD8", fontSize: 14, fontWeight: 600, color: "#C5C0B9", background: "none", cursor: "not-allowed", opacity: 0.6 }} title="Invoquo sera disponible prochainement">
                &#129534; Cr&eacute;er un devis Invoquo
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "rgba(232,168,76,.12)", color: "#E8A84C" }}>Bient&ocirc;t</span>
              </button>
              {devis.statut !== "ARCHIVE" && (
                <button onClick={handleArchive} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, borderRadius: 10, border: "1.5px solid #E0DDD8", fontSize: 14, fontWeight: 600, color: "#9B9590", background: "none", cursor: "pointer", marginTop: 8 }}>
                  &#128230; Archiver cette demande
                </button>
              )}
            </div>
          </div>

          {/* Reply form */}
          {replyOpen && (
            <div style={{ ...C, marginTop: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>R&eacute;pondre &agrave; {devis.nomClient}</h3>
              <textarea
                value={replyMsg}
                onChange={(e) => setReplyMsg(e.target.value)}
                placeholder="Votre message..."
                rows={6}
                style={{ width: "100%", padding: 14, borderRadius: 10, border: "1.5px solid #E0DDD8", fontSize: 14, fontFamily: "'Karla',sans-serif", color: "#1C1C1E", resize: "vertical", outline: "none" }}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button onClick={() => setReplyOpen(false)} style={{ flex: 1, height: 42, borderRadius: 8, border: "1.5px solid #E0DDD8", background: "none", fontSize: 14, fontWeight: 600, color: "#6B6560", cursor: "pointer" }}>Annuler</button>
                <button onClick={handleReply} disabled={sending || !replyMsg.trim()} style={{ flex: 1, height: 42, borderRadius: 8, background: "#C4531A", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: sending ? "wait" : "pointer", opacity: sending || !replyMsg.trim() ? 0.5 : 1 }}>
                  {sending ? "Envoi..." : "Envoyer \u2192"}
                </button>
              </div>
            </div>
          )}

          {/* PDF upload form */}
          {pdfOpen && (
            <div style={{ ...C, marginTop: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Envoyer un devis &agrave; {devis.nomClient}</h3>
              <div
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "#C4531A"; }}
                onDragLeave={(e) => { e.currentTarget.style.borderColor = "#E0DDD8"; }}
                onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "#E0DDD8"; const f = e.dataTransfer.files[0]; if (f && f.type === "application/pdf") setPdfFile(f); }}
                style={{ border: "2px dashed #E0DDD8", borderRadius: 10, padding: 24, textAlign: "center", cursor: "pointer", transition: "border-color .15s", marginBottom: 12 }}
                onClick={() => document.getElementById("pdf-input")?.click()}
              >
                {pdfFile ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>&#128196;</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{pdfFile.name}</span>
                    <span style={{ fontSize: 12, color: "#9B9590" }}>({(pdfFile.size / 1024).toFixed(0)} Ko)</span>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 14, color: "#6B6560", marginBottom: 4 }}>Glissez votre fichier PDF ici</p>
                    <p style={{ fontSize: 12, color: "#C5C0B9" }}>ou cliquez pour choisir &middot; Max 10 Mo</p>
                  </>
                )}
                <input id="pdf-input" type="file" accept="application/pdf" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) setPdfFile(f); }} />
              </div>
              <textarea
                value={pdfMsg}
                onChange={(e) => setPdfMsg(e.target.value)}
                placeholder="Message accompagnant (facultatif)"
                rows={3}
                style={{ width: "100%", padding: 12, borderRadius: 8, border: "1.5px solid #E0DDD8", fontSize: 14, fontFamily: "'Karla',sans-serif", color: "#1C1C1E", resize: "vertical", outline: "none", marginBottom: 12 }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setPdfOpen(false); setPdfFile(null); }} style={{ flex: 1, height: 42, borderRadius: 8, border: "1.5px solid #E0DDD8", background: "none", fontSize: 14, fontWeight: 600, color: "#6B6560", cursor: "pointer" }}>Annuler</button>
                <button onClick={handlePdfUpload} disabled={sending || !pdfFile} style={{ flex: 1, height: 42, borderRadius: 8, background: "#C4531A", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: sending || !pdfFile ? "not-allowed" : "pointer", opacity: sending || !pdfFile ? 0.5 : 1 }}>
                  {sending ? "Envoi..." : "Envoyer le devis \u2192"}
                </button>
              </div>
            </div>
          )}

          {sent && (
            <div style={{ marginTop: 12, padding: 14, background: "#F0FDF4", borderRadius: 10, border: "1px solid rgba(22,163,74,.15)", textAlign: "center" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#16a34a" }}>&#9989; R&eacute;ponse envoy&eacute;e !</p>
              {devis.emailClient && <p style={{ fontSize: 12, color: "#6B6560", marginTop: 4 }}>Un email a &eacute;t&eacute; envoy&eacute; &agrave; {devis.emailClient}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
