"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface Artisan {
  id: string;
  nomAffichage: string;
  slug: string;
  ville: string | null;
  telephone?: string;
  plan: string;
  noteMoyenne: number;
  nombreAvis: number;
  metier?: { nom: string; slug: string } | null;
  _score?: number;
  _recommended?: boolean;
  _alreadyContacted?: boolean;
}

interface Envoi {
  id: string;
  artisanId: string;
  sentAt: string;
  seenAt: string | null;
  respondedAt: string | null;
  artisan: Artisan;
}

interface Devis {
  id: string;
  numero: string;
  statut: string;
  totalTTC: number;
  artisanId: string;
  envoyeAt: string | null;
  accepteAt: string | null;
}

interface DevisStats { total: number; envoyes: number; acceptes: number; enBrouillon: number }

interface Demande {
  id: string;
  description: string;
  villeLabel: string | null;
  metierDetecte: string | null;
  qualifJson: Record<string, string> | null;
  qualifScore: number | null;
  preDevisJson: { fourchetteHt?: { min: number; max: number }; explication?: string; facteurs?: string[] } | null;
  contactNom: string | null;
  contactEmail: string | null;
  contactTel: string | null;
  photos: string[] | null;
  statut: string;
  modeRoutage: string;
  createdAt: string;
  webmasterJoignableA: string | null;
  webmasterContactType: string | null;
  webmasterContactResult: string | null;
  webmasterNotes: string | null;
  envois: Envoi[];
  devis: Devis[];
}

export default function AdminDemandeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { fetchWithAuth } = useAuth();
  const [demande, setDemande] = useState<Demande | null>(null);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [devisStats, setDevisStats] = useState<DevisStats>({ total: 0, envoyes: 0, acceptes: 0, enBrouillon: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [routing, setRouting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({ canal: "tel", note: "", result: "" });
  const [savingContact, setSavingContact] = useState(false);
  const [searchArtisan, setSearchArtisan] = useState("");
  const [showAllArtisans, setShowAllArtisans] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetchWithAuth(`/admin/demandes-projets/${id}`);
      const d = r as { demande: Demande; artisans: Artisan[]; devisStats: DevisStats };
      setDemande(d.demande);
      setArtisans(d.artisans || []);
      setDevisStats(d.devisStats || { total: 0, envoyes: 0, acceptes: 0, enBrouillon: 0 });
    } catch { setDemande(null); }
    finally { setLoading(false); }
  }, [fetchWithAuth, id]);

  useEffect(() => { load(); }, [load]);

  const toggleSelect = (aid: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(aid)) next.delete(aid);
      else next.add(aid);
      return next;
    });
  };

  const routeManual = async () => {
    if (selectedIds.size === 0) return;
    setRouting(true);
    try {
      await fetchWithAuth(`/admin/demandes-projets/${id}/route`, {
        method: "POST",
        body: JSON.stringify({ mode: "MANUAL", artisanIds: Array.from(selectedIds) }),
      });
      setSuccess(`Envoyée à ${selectedIds.size} artisan${selectedIds.size > 1 ? "s" : ""}`);
      setTimeout(() => setSuccess(null), 3000);
      setSelectedIds(new Set());
      await load();
    } catch { /* noop */ }
    finally { setRouting(false); }
  };

  const routeAuto = async (mode: string) => {
    if (!confirm(`Confirmer le routage automatique (${mode}) ?`)) return;
    setRouting(true);
    try {
      await fetchWithAuth(`/admin/demandes-projets/${id}/route`, {
        method: "POST",
        body: JSON.stringify({ mode }),
      });
      setSuccess("Routage auto effectué");
      setTimeout(() => setSuccess(null), 3000);
      await load();
    } catch { /* noop */ }
    finally { setRouting(false); }
  };

  const submitContact = async () => {
    setSavingContact(true);
    try {
      await fetchWithAuth(`/admin/demandes-projets/${id}/contact`, {
        method: "POST",
        body: JSON.stringify({
          canal: contactForm.canal,
          note: contactForm.note || null,
          result: contactForm.result || null,
        }),
      });
      setSuccess("Contact enregistré");
      setTimeout(() => setSuccess(null), 3000);
      setShowContact(false);
      setContactForm({ canal: "tel", note: "", result: "" });
      await load();
    } catch { /* noop */ }
    finally { setSavingContact(false); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60 }}>Chargement...</div>;
  if (!demande) return <div style={{ textAlign: "center", padding: 60 }}>Demande introuvable</div>;

  const qualifEntries: { label: string; value: string }[] = demande.qualifJson
    ? Object.entries(demande.qualifJson).map(([k, v]) => ({ label: k, value: String(v) }))
    : [];

  const filteredArtisans = artisans.filter((a) => {
    if (!searchArtisan) return true;
    const q = searchArtisan.toLowerCase();
    return a.nomAffichage.toLowerCase().includes(q) || (a.ville || "").toLowerCase().includes(q) || (a.metier?.nom || "").toLowerCase().includes(q);
  });

  const recommendedArtisans = filteredArtisans.filter((a) => a._recommended && !a._alreadyContacted);
  const otherArtisans = filteredArtisans.filter((a) => !a._recommended && !a._alreadyContacted);
  const visibleOtherArtisans = showAllArtisans ? otherArtisans : otherArtisans.slice(0, 6);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 0 60px" }}>
      <Link href="/admin/demandes-projets" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B6560", marginBottom: 16 }}>
        ← Toutes les demandes
      </Link>

      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ padding: "4px 12px", borderRadius: 999, background: demande.statut === "NOUVELLE" ? "rgba(196,83,26,.08)" : "rgba(74,103,65,.08)", color: demande.statut === "NOUVELLE" ? "#C4531A" : "#4A6741", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: .3 }}>
            {demande.statut}
          </span>
          {demande.metierDetecte && (
            <span style={{ padding: "4px 12px", borderRadius: 999, background: "rgba(196,83,26,.08)", color: "#C4531A", fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>{demande.metierDetecte}</span>
          )}
          {demande.villeLabel && <span style={{ fontSize: 13, color: "#9C958D" }}>📍 {demande.villeLabel}</span>}
          <span style={{ fontSize: 12, color: "#9C958D", marginLeft: "auto" }}>
            Reçue le {new Date(demande.createdAt).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 500, color: "#3D2E1F", lineHeight: 1.3, letterSpacing: -.3 }}>
          « {demande.description} »
        </h1>
      </div>

      {/* STATS DEVIS EN HAUT */}
      {devisStats.total > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }} className="max-md:!grid-cols-2">
          {[
            { label: "Devis générés", value: devisStats.total, color: "#3D2E1F" },
            { label: "Envoyés client", value: devisStats.envoyes, color: "#C4531A" },
            { label: "Acceptés", value: devisStats.acceptes, color: "#4A6741" },
            { label: "En brouillon", value: devisStats.enBrouillon, color: "#C9943A" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8D5C0", padding: 14 }}>
              <div style={{ fontSize: 10, color: "#9C958D", textTransform: "uppercase", letterSpacing: .5, fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 600, color: s.color, letterSpacing: -.3, marginTop: 2 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }} className="max-md:!grid-cols-1">
        {/* MAIN */}
        <div>
          {/* QUALIF */}
          {qualifEntries.length > 0 && (
            <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20, marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#3D2E1F", marginBottom: 14 }}>Qualification IA</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="max-md:!grid-cols-1">
                {qualifEntries.map((e) => (
                  <div key={e.label} style={{ padding: "10px 14px", background: "#FAF8F5", borderRadius: 10, border: "1px solid #F2EAE0" }}>
                    <div style={{ fontSize: 11, color: "#9C958D", textTransform: "uppercase", letterSpacing: .5, fontWeight: 600, marginBottom: 2 }}>{e.label}</div>
                    <div style={{ fontSize: 14, color: "#3D2E1F" }}>{e.value}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PHOTOS */}
          {demande.photos && demande.photos.length > 0 && (
            <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20, marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#3D2E1F", marginBottom: 14 }}>
                Photos du projet <span style={{ color: "#9C958D", fontWeight: 400 }}>({demande.photos.length})</span>
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
                {demande.photos.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: "1px solid #E8D5C0", display: "block" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* PRE-DEVIS */}
          {demande.preDevisJson?.fourchetteHt && (
            <section style={{ background: "linear-gradient(135deg, rgba(196,83,26,.06), rgba(201,148,58,.04))", borderRadius: 14, border: "1px solid rgba(196,83,26,.12)", padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: "#C4531A", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Estimation IA (fourchette marché)</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 600, color: "#3D2E1F", letterSpacing: -1, marginBottom: 6 }}>
                {demande.preDevisJson.fourchetteHt.min.toLocaleString("fr-FR")} – {demande.preDevisJson.fourchetteHt.max.toLocaleString("fr-FR")} <span style={{ fontSize: 16, color: "#9C958D" }}>€ HT</span>
              </div>
              {demande.preDevisJson.explication && <p style={{ fontSize: 13, color: "#5C4A3A", lineHeight: 1.55, marginBottom: 10 }}>{demande.preDevisJson.explication}</p>}
              {demande.preDevisJson.facteurs && (
                <div>
                  <div style={{ fontSize: 11, color: "#9C958D", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Facteurs variation</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 12, color: "#6B6560" }}>
                    {demande.preDevisJson.facteurs.map((f, i) => (
                      <li key={i} style={{ display: "flex", gap: 6 }}>
                        <span style={{ color: "#C4531A" }}>•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* ENVOIS EXISTANTS */}
          {demande.envois.length > 0 && (
            <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20, marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#3D2E1F", marginBottom: 14 }}>
                Artisans contactés <span style={{ color: "#9C958D", fontWeight: 400 }}>({demande.envois.length})</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {demande.envois.map((e) => {
                  const devisFromThisArtisan = demande.devis.find((d) => d.artisanId === e.artisanId);
                  return (
                    <div key={e.id} style={{ padding: "10px 14px", background: "#FAF8F5", borderRadius: 10, border: "1px solid #F2EAE0", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #C4531A, #C9943A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: 13, fontFamily: "'Fraunces',serif" }}>
                        {e.artisan.nomAffichage[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#3D2E1F" }}>{e.artisan.nomAffichage}</div>
                        <div style={{ fontSize: 12, color: "#9C958D" }}>{e.artisan.ville} · {e.artisan.plan} · envoyé {new Date(e.sentAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</div>
                      </div>
                      {devisFromThisArtisan ? (
                        <div style={{ fontSize: 12, color: "#4A6741", fontWeight: 600, textAlign: "right" }}>
                          💰 Devis {devisFromThisArtisan.numero}<br />
                          <span style={{ fontSize: 11, color: "#9C958D", fontWeight: 400 }}>{devisFromThisArtisan.totalTTC.toLocaleString("fr-FR")} € TTC</span>
                        </div>
                      ) : e.seenAt ? (
                        <div style={{ fontSize: 11, color: "#C9943A", fontWeight: 500 }}>👁 Vu, pas répondu</div>
                      ) : (
                        <div style={{ fontSize: 11, color: "#9C958D", fontWeight: 500 }}>En attente</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* LISTE TOUS ARTISANS */}
          <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#3D2E1F" }}>
                  Artisans disponibles <span style={{ color: "#9C958D", fontWeight: 400 }}>({artisans.filter((a) => !a._alreadyContacted).length})</span>
                </h2>
                <p style={{ fontSize: 12, color: "#9C958D", marginTop: 2 }}>Les recommandés (métier + ville match) sont en haut.</p>
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchArtisan}
                onChange={(e) => setSearchArtisan(e.target.value)}
                style={{ padding: "7px 12px", fontSize: 13, borderRadius: 8, border: "1px solid #E8D5C0", minWidth: 160 }}
              />
              {selectedIds.size > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={routeManual}
                  disabled={routing}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 10,
                    background: "#C4531A",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    border: "none",
                    cursor: routing ? "not-allowed" : "pointer",
                    opacity: routing ? 0.6 : 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {routing ? "Envoi..." : `Envoyer à ${selectedIds.size}`}
                  {!routing && <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>}
                </motion.button>
              )}
            </div>

            {recommendedArtisans.length > 0 && (
              <>
                <div style={{ fontSize: 11, color: "#C4531A", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  ⭐ Recommandés ({recommendedArtisans.length})
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16 }} className="max-md:!grid-cols-1">
                  {recommendedArtisans.map((a) => <ArtisanCard key={a.id} artisan={a} selected={selectedIds.has(a.id)} onToggle={() => toggleSelect(a.id)} highlight />)}
                </div>
              </>
            )}

            {otherArtisans.length > 0 && (
              <>
                <div style={{ fontSize: 11, color: "#9C958D", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  Autres artisans disponibles ({otherArtisans.length})
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }} className="max-md:!grid-cols-1">
                  {visibleOtherArtisans.map((a) => <ArtisanCard key={a.id} artisan={a} selected={selectedIds.has(a.id)} onToggle={() => toggleSelect(a.id)} />)}
                </div>
                {!showAllArtisans && otherArtisans.length > 6 && (
                  <button onClick={() => setShowAllArtisans(true)} style={{ marginTop: 12, padding: "8px 14px", borderRadius: 8, background: "#FAF8F5", color: "#5C4A3A", fontSize: 12, fontWeight: 600, border: "1px solid #E8D5C0", cursor: "pointer" }}>
                    Voir les {otherArtisans.length - 6} autres →
                  </button>
                )}
              </>
            )}
          </section>

          {/* ACTIONS AUTO */}
          <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20 }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#3D2E1F", marginBottom: 6 }}>Routage automatique</h2>
            <p style={{ fontSize: 12, color: "#9C958D", marginBottom: 12 }}>Envoyer en un clic à plusieurs artisans selon des critères.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => routeAuto("AUTO_CONCERNES")} disabled={routing} style={{ padding: "10px 14px", borderRadius: 10, background: "#FAF8F5", color: "#3D2E1F", fontSize: 13, fontWeight: 500, border: "1px solid #E8D5C0", cursor: "pointer", textAlign: "left" }}>
                ⚡ Artisans concernés (métier + ville) — tous plans
              </button>
              <button onClick={() => routeAuto("AUTO_PRO")} disabled={routing} style={{ padding: "10px 14px", borderRadius: 10, background: "#FAF8F5", color: "#3D2E1F", fontSize: 13, fontWeight: 500, border: "1px solid #E8D5C0", cursor: "pointer", textAlign: "left" }}>
                ⚡ Artisans PRO/BUSINESS (métier + ville)
              </button>
              <button onClick={() => routeAuto("AUTO_BUSINESS")} disabled={routing} style={{ padding: "10px 14px", borderRadius: 10, background: "#FAF8F5", color: "#3D2E1F", fontSize: 13, fontWeight: 500, border: "1px solid #E8D5C0", cursor: "pointer", textAlign: "left" }}>
                ⚡ Artisans BUSINESS uniquement (métier + ville)
              </button>
              <button onClick={() => routeAuto("AUTO_TOUS")} disabled={routing} style={{ padding: "10px 14px", borderRadius: 10, background: "#FAF8F5", color: "#3D2E1F", fontSize: 13, fontWeight: 500, border: "1px solid #E8D5C0", cursor: "pointer", textAlign: "left" }}>
                ⚡ Tous les artisans du métier (peu importe la ville)
              </button>
            </div>
          </section>
        </div>

        {/* SIDEBAR CLIENT */}
        <div>
          <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 600, color: "#3D2E1F", marginBottom: 12 }}>Client</h3>
            <div style={{ fontSize: 14, color: "#3D2E1F", marginBottom: 4, fontWeight: 500 }}>{demande.contactNom || "—"}</div>
            {demande.contactEmail && (
              <a href={`mailto:${demande.contactEmail}`} style={{ fontSize: 13, color: "#C4531A", display: "block", marginBottom: 2 }}>
                ✉️ {demande.contactEmail}
              </a>
            )}
            {demande.contactTel && (
              <a href={`tel:${demande.contactTel}`} style={{ fontSize: 13, color: "#C4531A", display: "block", marginBottom: 10 }}>
                📞 {demande.contactTel}
              </a>
            )}

            {demande.webmasterJoignableA && (
              <div style={{ padding: "8px 10px", background: "rgba(74,103,65,.08)", borderRadius: 8, fontSize: 12, color: "#4A6741", marginBottom: 10 }}>
                ✓ Client joint le {new Date(demande.webmasterJoignableA).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                {demande.webmasterContactType && <span> · {demande.webmasterContactType}</span>}
              </div>
            )}
            {demande.webmasterContactResult && demande.webmasterContactResult !== "joint" && (
              <div style={{ padding: "8px 10px", background: "rgba(201,148,58,.08)", borderRadius: 8, fontSize: 12, color: "#C9943A", marginBottom: 10 }}>
                Dernier essai : {demande.webmasterContactResult.replace("_", " ")}
              </div>
            )}

            <button
              onClick={() => setShowContact(true)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "#3D2E1F", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              📞 Contacter le client
            </button>
          </section>

          <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 600, color: "#3D2E1F", marginBottom: 12 }}>Méta</h3>
            <div style={{ fontSize: 12, color: "#6B6560", display: "flex", flexDirection: "column", gap: 6 }}>
              <div><span style={{ color: "#9C958D" }}>Score qualif :</span> <span style={{ fontWeight: 600, color: "#3D2E1F" }}>{demande.qualifScore ?? "—"}/100</span></div>
              <div><span style={{ color: "#9C958D" }}>Mode routage :</span> <span style={{ fontWeight: 600, color: "#3D2E1F" }}>{demande.modeRoutage}</span></div>
              <div><span style={{ color: "#9C958D" }}>Envois :</span> <span style={{ fontWeight: 600, color: "#3D2E1F" }}>{demande.envois.length}</span></div>
              <div><span style={{ color: "#9C958D" }}>Devis reçus :</span> <span style={{ fontWeight: 600, color: "#4A6741" }}>{devisStats.total}</span></div>
              {demande.photos && demande.photos.length > 0 && (
                <div><span style={{ color: "#9C958D" }}>Photos :</span> <span style={{ fontWeight: 600, color: "#3D2E1F" }}>{demande.photos.length}</span></div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* CONTACT MODAL */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContact(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 500, width: "100%" }}
            >
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, color: "#3D2E1F", marginBottom: 6 }}>
                Contacter <span style={{ fontStyle: "italic", color: "#C4531A" }}>{demande.contactNom}</span>
              </h2>
              <p style={{ fontSize: 12, color: "#6B6560", marginBottom: 18 }}>Enregistre ton contact pour le suivi. Utile pour affiner la qualif.</p>

              <label style={{ fontSize: 11, fontWeight: 600, color: "#5C4A3A", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>Canal</label>
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {[
                  { v: "tel", l: "📞 Téléphone", href: demande.contactTel ? `tel:${demande.contactTel}` : undefined },
                  { v: "email", l: "✉️ Email", href: demande.contactEmail ? `mailto:${demande.contactEmail}` : undefined },
                  { v: "sms", l: "💬 SMS", href: demande.contactTel ? `sms:${demande.contactTel}` : undefined },
                  { v: "plateforme", l: "🏷 Plateforme" },
                ].map((c) => (
                  <button
                    key={c.v}
                    onClick={() => {
                      setContactForm((f) => ({ ...f, canal: c.v }));
                      if (c.href) window.open(c.href, "_blank");
                    }}
                    style={{
                      flex: 1,
                      padding: "9px 10px",
                      borderRadius: 8,
                      border: `1.5px solid ${contactForm.canal === c.v ? "#C4531A" : "#E8D5C0"}`,
                      background: contactForm.canal === c.v ? "rgba(196,83,26,.06)" : "#fff",
                      color: contactForm.canal === c.v ? "#C4531A" : "#5C4A3A",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {c.l}
                  </button>
                ))}
              </div>

              <label style={{ fontSize: 11, fontWeight: 600, color: "#5C4A3A", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>Résultat</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {[
                  { v: "joint", l: "✓ Joint" },
                  { v: "non_joint", l: "✗ Non joint" },
                  { v: "message_laisse", l: "📝 Message laissé" },
                  { v: "rappel_prevu", l: "⏰ Rappel prévu" },
                ].map((r) => (
                  <button
                    key={r.v}
                    onClick={() => setContactForm((f) => ({ ...f, result: r.v }))}
                    style={{
                      padding: "7px 12px",
                      borderRadius: 8,
                      border: `1.5px solid ${contactForm.result === r.v ? "#4A6741" : "#E8D5C0"}`,
                      background: contactForm.result === r.v ? "rgba(74,103,65,.08)" : "#fff",
                      color: contactForm.result === r.v ? "#4A6741" : "#5C4A3A",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {r.l}
                  </button>
                ))}
              </div>

              <label style={{ fontSize: 11, fontWeight: 600, color: "#5C4A3A", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>Note (info récoltée, demandes du client...)</label>
              <textarea
                value={contactForm.note}
                onChange={(e) => setContactForm((f) => ({ ...f, note: e.target.value }))}
                rows={3}
                placeholder="Ex : Précise qu'il préfère un devis fin de semaine, budget 3500€ max"
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #E8D5C0", fontSize: 13, fontFamily: "inherit", resize: "vertical" }}
              />

              <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
                <button onClick={() => setShowContact(false)} style={{ padding: "10px 18px", borderRadius: 10, background: "#F7F5F2", color: "#5C4A3A", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
                  Annuler
                </button>
                <button onClick={submitContact} disabled={savingContact || !contactForm.result} style={{ padding: "10px 20px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: savingContact ? "not-allowed" : "pointer", opacity: savingContact || !contactForm.result ? 0.6 : 1 }}>
                  {savingContact ? "..." : "Enregistrer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {success && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#4A6741", color: "#fff", padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 500, boxShadow: "0 20px 60px rgba(74,103,65,.35)", zIndex: 100 }}
        >
          ✓ {success}
        </motion.div>
      )}
    </div>
  );
}

function ArtisanCard({ artisan, selected, onToggle, highlight }: { artisan: Artisan; selected: boolean; onToggle: () => void; highlight?: boolean }) {
  return (
    <div
      onClick={onToggle}
      style={{
        padding: 12,
        background: selected ? "rgba(196,83,26,.06)" : highlight ? "rgba(201,148,58,.04)" : "#FAF8F5",
        borderRadius: 10,
        border: `2px solid ${selected ? "#C4531A" : highlight ? "rgba(201,148,58,.2)" : "#F2EAE0"}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        transition: "all .15s",
      }}
    >
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: selected ? "#C4531A" : "#fff", border: selected ? "none" : "1px solid #E8D5C0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {selected && <svg width="11" height="11" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" /></svg>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{artisan.nomAffichage}</div>
        <div style={{ fontSize: 11, color: "#9C958D", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {artisan.metier?.nom || "–"} · {artisan.ville || "–"}
          {artisan.nombreAvis > 0 && <> · ⭐ {artisan.noteMoyenne.toFixed(1)}</>}
        </div>
      </div>
      <span style={{ padding: "2px 6px", borderRadius: 5, background: artisan.plan === "BUSINESS" ? "#3D2E1F" : artisan.plan === "PRO" || artisan.plan === "PRO_PLUS" ? "#C4531A" : "#F2EAE0", color: artisan.plan === "GRATUIT" || artisan.plan === "STARTER" ? "#5C4A3A" : "#fff", fontSize: 9, fontWeight: 700, textTransform: "uppercase", flexShrink: 0 }}>
        {artisan.plan}
      </span>
    </div>
  );
}
