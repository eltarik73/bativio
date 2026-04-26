"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VilleAutocomplete from "@/components/VilleAutocomplete/VilleAutocomplete";
import type { CommuneResult } from "@/components/VilleAutocomplete/VilleAutocomplete";
import { fadeUp } from "@/lib/motion";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  questionId?: string;
  questionType?: "choices" | "text" | "contact";
  choices?: { label: string; value: string }[];
  placeholder?: string;
}

interface PreDevis {
  fourchetteHt: { min: number; max: number };
  explication: string;
  facteurs: string[];
  disclaimer: string;
}

type Phase = "initial" | "chat" | "photos" | "contact" | "sending" | "done";

interface UploadedPhoto {
  url: string;
  publicId: string;
  name: string;
}

export default function DemandePage() {
  const [phase, setPhase] = useState<Phase>("initial");
  const [description, setDescription] = useState("");
  const [villeLabel, setVilleLabel] = useState("");
  const [villeSlug, setVilleSlug] = useState("");
  const [villeCoords, setVilleCoords] = useState<{ lat: number; lon: number } | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [collected, setCollected] = useState<Record<string, string>>({});
  const [metier, setMetier] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState("");

  const [contact, setContact] = useState({ nom: "", email: "", tel: "" });
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [preDevis, setPreDevis] = useState<PreDevis | null>(null);
  const [demandeId, setDemandeId] = useState<string | null>(null);

  const [liveEstimation, setLiveEstimation] = useState<PreDevis | null>(null);
  const [loadingEstimation, setLoadingEstimation] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, phase]);

  const handleVilleSelect = (c: CommuneResult) => {
    const slug = c.slug || c.nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
    setVilleLabel(c.nom);
    setVilleSlug(slug);
    if (c.latitude && c.longitude) setVilleCoords({ lat: c.latitude, lon: c.longitude });
  };

  const startChat = async () => {
    if (description.trim().length < 8) return;
    setPhase("chat");
    await callAgent(description, [], {});
  };

  const callAgent = async (
    desc: string,
    history: { role: "user" | "assistant"; content: string }[],
    col: Record<string, string>,
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/public/chat-qualif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc, history, collected: col, ville: villeLabel || null }),
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.error);
      const data = j.data;

      if (data.metier && !metier) setMetier(data.metier);

      if (data.step === "done" || data.next_action === "contact" || data.next_action === "photos") {
        setPhase("photos");
      } else if (data.question) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: data.question.prompt,
            questionId: data.question.id,
            questionType: data.question.type,
            choices: data.question.choices,
            placeholder: data.question.placeholder,
          },
        ]);
      }
    } catch (e) {
      console.error(e);
      setMessages((m) => [...m, { role: "assistant", content: "Désolé, une erreur technique. Veuillez réessayer dans un instant." }]);
    } finally {
      setLoading(false);
    }
  };

  const answerQuestion = async (value: string, label: string, questionId: string) => {
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: label }];
    setMessages(newMessages);
    const newCol = { ...collected, [questionId]: value };
    setCollected(newCol);
    setTextInput("");
    const history = newMessages.map((m) => ({ role: m.role, content: m.content }));
    await callAgent(description, history, newCol);

    // Estimation live en arrière-plan dès qu'on a métier + 2+ infos
    if (metier && Object.keys(newCol).length >= 2) {
      fetchLiveEstimation(metier, newCol);
    }
  };

  const fetchLiveEstimation = async (metierSlug: string, data: Record<string, string>) => {
    setLoadingEstimation(true);
    try {
      const res = await fetch("/api/v1/public/estimation-live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metier: metierSlug,
          description,
          qualifData: data,
          ville: villeLabel || null,
        }),
      });
      const j = await res.json();
      if (j.success && !j.data.tooEarly && j.data.fourchetteHt) {
        setLiveEstimation(j.data);
      }
    } catch { /* silent */ }
    finally { setLoadingEstimation(false); }
  };

  const uploadPhoto = async (file: File) => {
    setUploadingPhoto(true);
    try {
      const sigRes = await fetch("/api/v1/upload/signature", { method: "POST" });
      const sigJ = await sigRes.json();
      if (!sigJ.success) throw new Error(sigJ.error);
      const { signature, timestamp, cloudName, apiKey, folder } = sigJ.data;

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", apiKey);
      fd.append("timestamp", String(timestamp));
      fd.append("signature", signature);
      fd.append("folder", folder);

      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const upJ = await upRes.json();
      if (upJ.secure_url) {
        setPhotos((p) => [...p, { url: upJ.secure_url, publicId: upJ.public_id, name: file.name }]);
      }
    } catch (e) {
      console.error("Upload photo error:", e);
      alert("Erreur upload photo. Réessayez.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotosSelected = async (files: FileList) => {
    const remaining = 5 - photos.length;
    for (let i = 0; i < Math.min(files.length, remaining); i++) {
      const f = files[i];
      if (f.size > 10 * 1024 * 1024) {
        alert(`La photo ${f.name} est trop lourde (max 10 Mo).`);
        continue;
      }
      await uploadPhoto(f);
    }
  };

  const removePhoto = (publicId: string) => {
    setPhotos((p) => p.filter((ph) => ph.publicId !== publicId));
  };

  const sendDemande = async () => {
    if (!contact.nom || !contact.email || !contact.tel) return;
    setPhase("sending");
    try {
      const res = await fetch("/api/v1/public/demandes-projets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          villeLabel: villeLabel || null,
          villeSlug: villeSlug || null,
          lat: villeCoords?.lat ?? null,
          lon: villeCoords?.lon ?? null,
          metierDetecte: metier,
          qualifJson: collected,
          photos: photos.map((p) => p.url),
          contactNom: contact.nom,
          contactEmail: contact.email,
          contactTel: contact.tel,
          source: "demande-chat",
        }),
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.error);
      setDemandeId(j.data.id);
      setPreDevis(j.data.preDevis ?? null);
      setPhase("done");
    } catch (e) {
      console.error(e);
      setPhase("contact");
      alert("Erreur technique, veuillez réessayer.");
    }
  };

  const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop();
  const questionCount = messages.filter((m) => m.role === "assistant" && m.questionType).length;

  return (
    <>
      <Navbar />

      {/* HEADER */}
      <section className="cinema-light" style={{ padding: "48px 32px 24px", textAlign: "center", position: "relative" }}>
        <div className="cinema-blob-light cinema-blob-light-1" style={{ opacity: .3 }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 10 }}>
          <motion.div
            {...fadeUp(0)}
            className="liquid-glass"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, marginBottom: 16, fontSize: 12, fontWeight: 500, color: "var(--terre-deep)", letterSpacing: 0.3 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terre)" }} />
            Bativio — Assistant IA
          </motion.div>
          {/* H1 sans framer-motion = LCP optimal */}
          <h1
            style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 600, color: "var(--bois)", lineHeight: 1.1, letterSpacing: -1, marginBottom: 10 }}
          >
            Décrivez votre projet,{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--terre)" }}>on s&apos;occupe du reste</span>.
          </h1>
          <motion.p
            {...fadeUp(0.12)}
            style={{ fontSize: 15, color: "var(--bois-mid)", maxWidth: 520, margin: "0 auto", lineHeight: 1.55 }}
          >
            5 à 7 questions, estimation immédiate à l&apos;écran. Les artisans s&eacute;lectionn&eacute;s vous recontactent ensuite sous 24h.
          </motion.p>
        </div>
      </section>

      {/* CHAT CONTAINER */}
      <section style={{ padding: "24px 32px 80px", minHeight: "60vh" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* Phase INITIAL */}
          {phase === "initial" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="liquid-glass"
              style={{ borderRadius: 20, padding: 22 }}
            >
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--bois)", marginBottom: 10, display: "block" }}>
                Votre projet en quelques mots
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex : Je voudrais refaire le carrelage de ma salle de bain (5m²), avec douche italienne"
                rows={4}
                style={{ width: "100%", padding: 14, borderRadius: 12, border: "1px solid rgba(61,46,31,.1)", fontSize: 15, fontFamily: "inherit", background: "var(--creme)", resize: "vertical", lineHeight: 1.5 }}
              />
              <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200, maxWidth: 280 }}>
                  <VilleAutocomplete onSelect={handleVilleSelect} placeholder="Votre ville" defaultValue={villeLabel} className="search-bar-ville" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startChat}
                  disabled={description.trim().length < 8}
                  style={{
                    flex: 1, minWidth: 180,
                    padding: "14px 24px",
                    borderRadius: 12,
                    background: "var(--terre)",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 600,
                    border: "none",
                    cursor: description.trim().length < 8 ? "not-allowed" : "pointer",
                    opacity: description.trim().length < 8 ? 0.5 : 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 10px 30px rgba(196,83,26,.22)",
                    fontFamily: "inherit",
                  }}
                >
                  Recevoir mon estimation
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                </motion.button>
              </div>
              <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Refaire carrelage sdb 5m²", "Remplacer chauffe-eau 200L", "Peindre salon et chambre 40m²"].map((ex) => (
                  <button key={ex} onClick={() => setDescription(ex)} style={{ padding: "5px 12px", borderRadius: 999, background: "rgba(255,255,255,.6)", border: "1px solid rgba(61,46,31,.08)", fontSize: 12, color: "var(--bois-mid)", cursor: "pointer", fontFamily: "inherit" }}>
                    « {ex} »
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Phase CHAT / PHOTOS / CONTACT */}
          {(phase === "chat" || phase === "photos" || phase === "contact" || phase === "sending") && (
            <>
              {/* Progress bar */}
              <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 12, color: "var(--pierre)", flexShrink: 0 }}>
                  {phase === "contact" ? "Étape 3/3 — Contact" : phase === "photos" ? "Étape 2/3 — Photos" : `Question ${questionCount}/6`}
                </div>
                <div style={{ flex: 1, height: 4, background: "rgba(61,46,31,.08)", borderRadius: 2, overflow: "hidden" }}>
                  <motion.div
                    animate={{ width: phase === "contact" ? "92%" : phase === "photos" ? "75%" : `${Math.min(questionCount * 14, 60)}%` }}
                    style={{ height: "100%", background: "linear-gradient(90deg, var(--terre), var(--or))" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                {metier && (
                  <div className="liquid-glass" style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, color: "var(--terre-deep)", fontWeight: 600, textTransform: "capitalize" }}>
                    {metier}
                  </div>
                )}
              </div>

              {/* Estimation live (apparaît dès que dispo) */}
              {phase === "chat" && liveEstimation && liveEstimation.fourchetteHt && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: .95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  style={{ background: "linear-gradient(135deg, rgba(196,83,26,.08), rgba(201,148,58,.05))", borderRadius: 14, padding: "12px 16px", marginBottom: 12, border: "1px solid rgba(196,83,26,.15)", display: "flex", alignItems: "center", gap: 12 }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--terre)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, letterSpacing: 1.5, color: "var(--terre-deep)", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>
                      Estimation en temps réel {loadingEstimation ? "(actualisation…)" : ""}
                    </div>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "var(--bois)", letterSpacing: -.3 }}>
                      {liveEstimation.fourchetteHt.min.toLocaleString("fr-FR")}–{liveEstimation.fourchetteHt.max.toLocaleString("fr-FR")} € HT
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--pierre)", fontStyle: "italic", maxWidth: 140, lineHeight: 1.3 }}>
                    Estimation indicative, affinée à chaque réponse
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              <div ref={chatRef} style={{ background: "var(--blanc)", borderRadius: 20, padding: 20, minHeight: 340, maxHeight: 540, overflowY: "auto", border: "1px solid rgba(61,46,31,.06)", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--terre), var(--or))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "'Fraunces',serif" }}>B</div>
                  <div style={{ background: "var(--creme)", padding: "10px 14px", borderRadius: 14, maxWidth: "80%", fontSize: 14, color: "var(--bois)", lineHeight: 1.5 }}>
                    Bonjour ! J&apos;ai bien noté votre projet : <span style={{ fontStyle: "italic", color: "var(--bois-mid)" }}>« {description} »</span>. Laissez-moi vous poser quelques questions pour mieux cerner votre besoin.
                  </div>
                </div>

                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", gap: 10, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}
                  >
                    {m.role === "assistant" && (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--terre), var(--or))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "'Fraunces',serif" }}>B</div>
                    )}
                    <div style={{
                      background: m.role === "user" ? "var(--terre)" : "var(--creme)",
                      color: m.role === "user" ? "#fff" : "var(--bois)",
                      padding: "10px 14px",
                      borderRadius: 14,
                      maxWidth: "80%",
                      fontSize: 14,
                      lineHeight: 1.5,
                      fontWeight: m.role === "user" ? 500 : 400,
                    }}>
                      {m.content}
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--terre), var(--or))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "'Fraunces',serif" }}>B</div>
                    <div style={{ background: "var(--creme)", padding: "14px 18px", borderRadius: 14, display: "flex", gap: 4 }}>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                          style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--terre)", opacity: 0.6 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input zone */}
              {phase === "chat" && lastAssistantMessage?.questionType && !loading && (
                <div style={{ marginTop: 14 }}>
                  {lastAssistantMessage.questionType === "choices" && lastAssistantMessage.choices && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {lastAssistantMessage.choices.map((c) => (
                        <motion.button
                          key={c.value}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => answerQuestion(c.value, c.label, lastAssistantMessage.questionId!)}
                          className="liquid-glass"
                          style={{ padding: "10px 18px", borderRadius: 999, fontSize: 14, color: "var(--bois)", cursor: "pointer", border: "none", fontFamily: "inherit", fontWeight: 500 }}
                        >
                          {c.label}
                        </motion.button>
                      ))}
                    </div>
                  )}
                  {lastAssistantMessage.questionType === "text" && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (textInput.trim()) answerQuestion(textInput, textInput, lastAssistantMessage.questionId!);
                      }}
                      className="liquid-glass"
                      style={{ display: "flex", gap: 8, borderRadius: 14, padding: 6 }}
                    >
                      <input
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={lastAssistantMessage.placeholder || "Votre réponse…"}
                        style={{ flex: 1, padding: "10px 14px", border: "none", outline: "none", background: "transparent", fontSize: 14, fontFamily: "inherit" }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={!textInput.trim()}
                        className="search-btn"
                        style={{ padding: "10px 18px", fontSize: 13, opacity: textInput.trim() ? 1 : 0.5 }}
                      >
                        Envoyer
                      </motion.button>
                    </form>
                  )}
                </div>
              )}

              {/* Phase PHOTOS (optionnel) */}
              {phase === "photos" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="liquid-glass"
                  style={{ marginTop: 14, borderRadius: 20, padding: 22 }}
                >
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 600, color: "var(--bois)", marginBottom: 4 }}>
                    Ajoutez des <span style={{ fontStyle: "italic", color: "var(--terre)" }}>photos</span> de votre projet
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--bois-mid)", marginBottom: 16 }}>
                    Les photos aident les artisans à chiffrer plus précisément. Facultatif, mais fortement recommandé (jusqu&apos;à 5).
                  </p>

                  {photos.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10, marginBottom: 14 }}>
                      {photos.map((p) => (
                        <div key={p.publicId} style={{ position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(61,46,31,.1)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            onClick={() => removePhoto(p.publicId)}
                            style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                            aria-label="Retirer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {photos.length < 5 && (
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        padding: "24px 20px",
                        borderRadius: 12,
                        border: "2px dashed rgba(196,83,26,.3)",
                        background: "rgba(196,83,26,.03)",
                        cursor: uploadingPhoto ? "not-allowed" : "pointer",
                        opacity: uploadingPhoto ? 0.6 : 1,
                        transition: "all .2s",
                        marginBottom: 14,
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploadingPhoto}
                        onChange={(e) => e.target.files && handlePhotosSelected(e.target.files)}
                        style={{ display: "none" }}
                      />
                      <svg width="28" height="28" fill="none" stroke="var(--terre)" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                      <span style={{ fontSize: 14, color: "var(--bois)", fontWeight: 500 }}>
                        {uploadingPhoto ? "Envoi en cours…" : `Ajouter des photos ${photos.length > 0 ? `(${photos.length}/5)` : ""}`}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--pierre)" }}>JPG, PNG, HEIC — max 10 Mo</span>
                    </label>
                  )}

                  <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
                    <button
                      onClick={() => setPhase("contact")}
                      style={{ padding: "12px 20px", borderRadius: 12, background: "transparent", color: "var(--bois-mid)", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Passer sans photo →
                    </button>
                    {photos.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setPhase("contact")}
                        style={{ padding: "12px 24px", borderRadius: 12, background: "var(--terre)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}
                      >
                        Continuer avec {photos.length} photo{photos.length > 1 ? "s" : ""}
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Phase CONTACT */}
              {phase === "contact" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="liquid-glass"
                  style={{ marginTop: 14, borderRadius: 20, padding: 22 }}
                >
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 600, color: "var(--bois)", marginBottom: 4 }}>
                    Comment les artisans peuvent-ils vous <span style={{ fontStyle: "italic", color: "var(--terre)" }}>joindre</span> ?
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--bois-mid)", marginBottom: 16 }}>
                    Vous recevrez un email de confirmation + les propositions d&apos;artisans sous 24h.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }} className="max-md:!grid-cols-1">
                    <input
                      value={contact.nom}
                      onChange={(e) => setContact((c) => ({ ...c, nom: e.target.value }))}
                      placeholder="Nom et prénom"
                      style={{ padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(61,46,31,.1)", fontSize: 14, fontFamily: "inherit", background: "var(--creme)" }}
                    />
                    <input
                      type="tel"
                      value={contact.tel}
                      onChange={(e) => setContact((c) => ({ ...c, tel: e.target.value }))}
                      placeholder="Téléphone"
                      style={{ padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(61,46,31,.1)", fontSize: 14, fontFamily: "inherit", background: "var(--creme)" }}
                    />
                  </div>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                    placeholder="Email"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(61,46,31,.1)", fontSize: 14, fontFamily: "inherit", background: "var(--creme)", marginBottom: 14 }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={sendDemande}
                    disabled={!contact.nom || !contact.email || !contact.tel}
                    style={{
                      width: "100%",
                      padding: "14px 24px",
                      borderRadius: 12,
                      background: "var(--terre)",
                      color: "#fff",
                      fontSize: 15,
                      fontWeight: 600,
                      border: "none",
                      cursor: !contact.nom || !contact.email || !contact.tel ? "not-allowed" : "pointer",
                      opacity: !contact.nom || !contact.email || !contact.tel ? 0.5 : 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: "0 10px 30px rgba(196,83,26,.22)",
                      fontFamily: "inherit",
                    }}
                  >
                    Envoyer ma demande
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </motion.button>
                  <p style={{ fontSize: 11, color: "var(--pierre)", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
                    En envoyant, vous acceptez que vos coordonnées soient partagées avec les artisans sélectionnés par Bativio.{" "}
                    <a href="/mentions-legales#confidentialite" style={{ color: "var(--terre)", textDecoration: "underline" }}>Politique de confidentialité</a>.
                  </p>
                </motion.div>
              )}

              {phase === "sending" && (
                <div style={{ textAlign: "center", marginTop: 30, color: "var(--bois-mid)" }}>
                  <div style={{ fontSize: 14 }}>Envoi en cours + génération de l&apos;estimation IA…</div>
                </div>
              )}
            </>
          )}

          {/* Phase DONE */}
          {phase === "done" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="liquid-glass"
              style={{ borderRadius: 24, padding: 32, textAlign: "center" }}
            >
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--mousse)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="32" height="32" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: "var(--bois)", letterSpacing: -.5, marginBottom: 10 }}>
                Votre demande est <span style={{ fontStyle: "italic", color: "var(--terre)" }}>envoyée</span> !
              </h2>
              <p style={{ fontSize: 15, color: "var(--bois-mid)", lineHeight: 1.55, marginBottom: 24, maxWidth: 440, margin: "0 auto 24px" }}>
                L&apos;équipe Bativio examine votre projet et va vous proposer les meilleurs artisans sous 24h. Un email de confirmation vous a été envoyé.
              </p>

              {preDevis && (
                <div style={{ background: "linear-gradient(135deg, rgba(196,83,26,.06), rgba(201,148,58,.04))", borderRadius: 18, padding: 24, marginBottom: 24, border: "1px solid rgba(196,83,26,.12)", textAlign: "left" }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--terre)", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
                    Estimation indicative IA
                  </div>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 600, color: "var(--bois)", letterSpacing: -1, marginBottom: 4 }}>
                    {preDevis.fourchetteHt.min.toLocaleString("fr-FR")} – {preDevis.fourchetteHt.max.toLocaleString("fr-FR")} €
                    <span style={{ fontSize: 14, color: "var(--pierre)", fontWeight: 400, marginLeft: 6 }}>HT</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--bois-mid)", lineHeight: 1.55, marginBottom: 12 }}>
                    {preDevis.explication}
                  </p>
                  {preDevis.facteurs && preDevis.facteurs.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: "var(--pierre)", fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>
                        Facteurs qui feront varier
                      </div>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 12, color: "var(--bois-mid)" }}>
                        {preDevis.facteurs.map((f, i) => (
                          <li key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                            <span style={{ color: "var(--terre)", flexShrink: 0 }}>•</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p style={{ fontSize: 11, color: "var(--pierre)", fontStyle: "italic", marginTop: 10 }}>
                    {preDevis.disclaimer}
                  </p>
                </div>
              )}

              <div style={{ fontSize: 12, color: "var(--pierre)", marginBottom: 14 }}>
                Réf. demande : <span style={{ fontFamily: "monospace", color: "var(--bois-mid)" }}>{demandeId?.slice(-10).toUpperCase()}</span>
              </div>
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "var(--creme)", color: "var(--bois)", borderRadius: 12, fontSize: 14, fontWeight: 500, border: "1px solid rgba(61,46,31,.1)" }}>
                Retour à l&apos;accueil
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
