"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import s from "./ChatDevis.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatDevisProps {
  artisanId: string;
  artisanNom: string;
  artisanMetierSlug?: string;
  artisanMetierNom?: string;
  onClose?: () => void;
  onSuccess?: (token: string) => void;
}

interface ArbreOption {
  label: string;
  value: string;
  next?: string;
}

interface ArbreQuestion {
  id: string;
  type: "single_choice" | "slider" | "free_text" | "photo_upload" | "summary";
  text: string;
  options?: ArbreOption[];
  min?: number;
  max?: number;
  default?: number;
  unit?: string;
  placeholder?: string;
  next?: string;
}

interface ArbreData {
  root: ArbreQuestion;
  questions: Record<string, ArbreQuestion>;
}

type MessageRole = "bot" | "user";

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
}

interface PhotoPreview {
  file: File;
  url: string;
}

interface ContactInfo {
  nom: string;
  email: string;
  tel: string;
  ville: string;
}

// ---------------------------------------------------------------------------
// Fallback arbre when API returns nothing
// ---------------------------------------------------------------------------

const FALLBACK_ARBRE: ArbreData = {
  root: {
    id: "root",
    type: "free_text",
    text: "Bonjour ! Decrivez-nous votre projet en quelques mots.",
    placeholder: "Ex: renovation salle de bain, fuite d'eau...",
    next: "summary",
  },
  questions: {
    summary: {
      id: "summary",
      type: "summary",
      text: "Voici le recapitulatif de votre demande :",
    },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChatDevis({
  artisanId,
  artisanNom,
  artisanMetierSlug,
  artisanMetierNom,
  onClose,
  onSuccess,
}: ChatDevisProps) {
  // State
  const [arbre, setArbre] = useState<ArbreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<ArbreQuestion | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [responses, setResponses] = useState<Record<string, { label: string; value: string | number }>>({});
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [sliderVal, setSliderVal] = useState<number>(0);
  const [freeText, setFreeText] = useState("");
  const [contact, setContact] = useState<ContactInfo>({ nom: "", email: "", tel: "", ville: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [responseToken, setResponseToken] = useState("");
  const [error, setError] = useState("");
  const [showSummaryForm, setShowSummaryForm] = useState(false);

  const messagesRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const msgCounter = useRef(0);

  // Helpers
  const nextMsgId = () => {
    msgCounter.current += 1;
    return `msg-${msgCounter.current}`;
  };

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });
  }, []);

  const initials = (artisanNom || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // -----------------------------------------------------------------------
  // Show a question with typing delay
  // -----------------------------------------------------------------------

  const showQuestion = useCallback(
    (question: ArbreQuestion) => {
      setIsTyping(true);
      scrollToBottom();

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: nextMsgId(), role: "bot", text: question.text },
        ]);
        setCurrentQuestion(question);

        // Initialize slider default
        if (question.type === "slider") {
          setSliderVal(question.default ?? question.min ?? 0);
        }

        // For summary, show the form immediately
        if (question.type === "summary") {
          setShowSummaryForm(true);
        }

        scrollToBottom();
      }, 800);
    },
    [scrollToBottom]
  );

  // -----------------------------------------------------------------------
  // Navigate to next question
  // -----------------------------------------------------------------------

  const goToNext = useCallback(
    (nextId: string | undefined) => {
      if (!arbre || !nextId) {
        // No next defined — default to summary
        const summaryQ = arbre?.questions["summary"];
        if (summaryQ) {
          showQuestion(summaryQ);
        }
        return;
      }

      const nextQ = arbre.questions[nextId];
      if (nextQ) {
        showQuestion(nextQ);
      }
    },
    [arbre, showQuestion]
  );

  // -----------------------------------------------------------------------
  // Fetch arbre on mount
  // -----------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function fetchArbre() {
      try {
        const slug = artisanMetierSlug || "_generique";
        const res = await fetch(`/api/v1/public/arbres/${encodeURIComponent(slug)}`);

        if (!res.ok) {
          // Use fallback on 404 or server error
          if (!cancelled) {
            setArbre(FALLBACK_ARBRE);
          }
          return;
        }

        const json = await res.json();
        if (!json.success || !json.data?.questions) {
          if (!cancelled) setArbre(FALLBACK_ARBRE);
          return;
        }

        // The API returns { questions: { root: {...}, questions: {...} } } in a Json column
        // The structure inside the Json column is the ArbreData
        const raw = json.data.questions;

        // Handle both shapes: { root, questions } or flat
        if (raw.root && raw.questions) {
          if (!cancelled) setArbre(raw as ArbreData);
        } else {
          if (!cancelled) setArbre(FALLBACK_ARBRE);
        }
      } catch {
        if (!cancelled) setArbre(FALLBACK_ARBRE);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchArbre();
    return () => {
      cancelled = true;
    };
  }, [artisanMetierSlug]);

  // -----------------------------------------------------------------------
  // Start the conversation once arbre is loaded
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (arbre && !loading && messages.length === 0) {
      showQuestion(arbre.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arbre, loading]);

  // -----------------------------------------------------------------------
  // Auto-scroll on new messages / typing
  // -----------------------------------------------------------------------

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showSummaryForm, scrollToBottom]);

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------

  const handleSingleChoice = (option: ArbreOption) => {
    if (!currentQuestion) return;

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: { label: option.label, value: option.value },
    }));

    setMessages((prev) => [
      ...prev,
      { id: nextMsgId(), role: "user", text: option.label },
    ]);

    setCurrentQuestion(null);

    // Option-level "next" takes precedence, then question-level "next"
    const nextId = option.next ?? currentQuestion.next;
    goToNext(nextId);
  };

  const handleSliderSubmit = () => {
    if (!currentQuestion) return;

    const unit = currentQuestion.unit || "";
    const display = `${sliderVal}${unit ? " " + unit : ""}`;

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: { label: display, value: sliderVal },
    }));

    setMessages((prev) => [
      ...prev,
      { id: nextMsgId(), role: "user", text: display },
    ]);

    setCurrentQuestion(null);
    goToNext(currentQuestion.next);
  };

  const handleFreeTextSubmit = () => {
    if (!currentQuestion || !freeText.trim()) return;

    const text = freeText.trim();
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: { label: text, value: text },
    }));

    setMessages((prev) => [
      ...prev,
      { id: nextMsgId(), role: "user", text },
    ]);

    setFreeText("");
    setCurrentQuestion(null);
    goToNext(currentQuestion.next);
  };

  const handlePhotoFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files)
      .filter((f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024)
      .slice(0, 5 - photos.length);

    const newPhotos = valid.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 5));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handlePhotoSubmit = (skipped: boolean) => {
    if (!currentQuestion) return;

    const label = skipped
      ? "Pas de photo"
      : `${photos.length} photo${photos.length > 1 ? "s" : ""} ajoutee${photos.length > 1 ? "s" : ""}`;

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: { label, value: skipped ? "skipped" : `${photos.length}_photos` },
    }));

    setMessages((prev) => [
      ...prev,
      { id: nextMsgId(), role: "user", text: label },
    ]);

    setCurrentQuestion(null);
    goToNext(currentQuestion.next);
  };

  // -----------------------------------------------------------------------
  // Build description from responses
  // -----------------------------------------------------------------------

  const buildDescription = (): string => {
    const lines: string[] = [];
    for (const [questionId, resp] of Object.entries(responses)) {
      // Find the question label from arbre
      const q =
        arbre?.root.id === questionId
          ? arbre.root
          : arbre?.questions[questionId];
      const qLabel = q?.text || questionId;
      lines.push(`${qLabel} : ${resp.label}`);
    }
    return lines.join("\n");
  };

  // -----------------------------------------------------------------------
  // Submit demande
  // -----------------------------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!contact.nom.trim() || contact.nom.trim().length < 2) {
      setError("Veuillez entrer votre nom (min. 2 caracteres).");
      return;
    }
    if (!contact.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      setError("Veuillez entrer un email valide.");
      return;
    }
    if (!contact.tel.trim() || !/^\d{10}$/.test(contact.tel.replace(/\s/g, ""))) {
      setError("Veuillez entrer un numero de telephone a 10 chiffres.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/v1/public/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artisanId,
          clientNom: contact.nom.trim(),
          clientEmail: contact.email.trim(),
          clientTel: contact.tel.replace(/\s/g, ""),
          clientVille: contact.ville.trim() || undefined,
          descriptionBesoin: buildDescription(),
          reponses: responses,
          urgence: "normal",
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (res.status === 429) {
          setError("Trop de demandes envoyees. Veuillez reessayer dans une heure.");
        } else {
          setError(json.error || "Une erreur est survenue. Veuillez reessayer.");
        }
        return;
      }

      const token = json.data?.responseToken || "";
      setResponseToken(token);
      setSubmitted(true);
      onSuccess?.(token);
    } catch {
      setError("Erreur de connexion. Verifiez votre connexion internet et reessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------------------------------------------------
  // Cleanup photo URLs on unmount
  // -----------------------------------------------------------------------

  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------------------------
  // Render: loading state
  // -----------------------------------------------------------------------

  if (loading) {
    return (
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.headerAvatar}>{initials}</div>
          <div className={s.headerInfo}>
            <div className={s.headerName}>{artisanNom}</div>
            {artisanMetierNom && <div className={s.headerMetier}>{artisanMetierNom}</div>}
          </div>
        </div>
        <div className={s.messages} style={{ alignItems: "center", justifyContent: "center" }}>
          <div className={s.typing}>
            <span className={s.dot} />
            <span className={s.dot} />
            <span className={s.dot} />
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render: submitted confirmation
  // -----------------------------------------------------------------------

  if (submitted) {
    return (
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.headerAvatar}>{initials}</div>
          <div className={s.headerInfo}>
            <div className={s.headerName}>{artisanNom}</div>
            {artisanMetierNom && <div className={s.headerMetier}>{artisanMetierNom}</div>}
          </div>
          {onClose && (
            <button className={s.headerClose} onClick={onClose} aria-label="Fermer">
              &times;
            </button>
          )}
        </div>
        <div className={s.messages}>
          <div className={s.confirmation}>
            <div className={s.confirmIcon}>
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={s.confirmTitle}>Demande envoyee !</div>
            <div className={s.confirmSub}>
              {artisanNom} a ete notifie et vous repondra dans les meilleurs delais.
            </div>
            {responseToken && (
              <a
                href={`/demandes/${responseToken}`}
                className={s.confirmLink}
              >
                Suivre ma demande &rarr;
              </a>
            )}
          </div>
        </div>
        <div className={s.privacy}>
          Vos donnees sont protegees et ne sont partagees qu&apos;avec cet artisan.
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render: current question interactive controls
  // -----------------------------------------------------------------------

  const renderCurrentControls = () => {
    if (!currentQuestion || isTyping) return null;

    switch (currentQuestion.type) {
      case "single_choice":
        return currentQuestion.options && currentQuestion.options.length > 0 ? (
          <div className={s.options}>
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.value}
                className={s.optionBtn}
                onClick={() => handleSingleChoice(opt)}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : null;

      case "slider":
        return (
          <div className={s.sliderWrap}>
            <div className={s.sliderValue}>
              {sliderVal}
              {currentQuestion.unit ? ` ${currentQuestion.unit}` : ""}
            </div>
            <input
              type="range"
              className={s.slider}
              min={currentQuestion.min ?? 0}
              max={currentQuestion.max ?? 100}
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
            />
            <div className={s.sliderLabels}>
              <span>
                {currentQuestion.min ?? 0}
                {currentQuestion.unit ? ` ${currentQuestion.unit}` : ""}
              </span>
              <span>
                {currentQuestion.max ?? 100}
                {currentQuestion.unit ? ` ${currentQuestion.unit}` : ""}
              </span>
            </div>
            <button
              type="button"
              className={s.continueBtn}
              onClick={handleSliderSubmit}
            >
              Continuer
            </button>
          </div>
        );

      case "photo_upload":
        return (
          <div className={s.photoUpload} onClick={() => fileRef.current?.click()}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => handlePhotoFiles(e.target.files)}
            />
            <svg
              className={s.photoUploadIcon}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M12 16V8m0 0l-3 3m3-3l3 3" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M3 16.5V18a3 3 0 003 3h12a3 3 0 003-3v-1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className={s.photoUploadText}>
              Ajoutez des photos{" "}
              <span className={s.photoUploadBrowse}>parcourir</span>
            </div>
            <div className={s.photoUploadHint}>
              JPG, PNG, WebP &middot; max 10 Mo &middot; max 5 photos
            </div>
            {photos.length > 0 && (
              <div
                className={s.photoPreviews}
                onClick={(e) => e.stopPropagation()}
              >
                {photos.map((p, i) => (
                  <div key={i} className={s.photoThumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt="Photo jointe" />
                    <button
                      type="button"
                      className={s.photoRemove}
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(i);
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className={s.actionRow} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={s.skipBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePhotoSubmit(true);
                }}
              >
                Passer
              </button>
              {photos.length > 0 && (
                <button
                  type="button"
                  className={s.continueBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePhotoSubmit(false);
                  }}
                >
                  Continuer
                </button>
              )}
            </div>
          </div>
        );

      case "summary":
        return (
          showSummaryForm && (
            <div className={s.summaryCard}>
              <div className={s.summaryTitle}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Recapitulatif
              </div>

              {Object.entries(responses).map(([qId, resp]) => {
                const q =
                  arbre?.root.id === qId ? arbre.root : arbre?.questions[qId];
                const label = q?.text || qId;
                return (
                  <div key={qId} className={s.summaryRow}>
                    <span className={s.summaryLabel}>{label}</span>
                    <span className={s.summaryValue}>{resp.label}</span>
                  </div>
                );
              })}

              <div className={s.contactSep} />

              <form className={s.contactForm} onSubmit={handleSubmit}>
                <div>
                  <label className={s.contactLabel}>
                    Nom <span className={s.contactRequired}>*</span>
                  </label>
                  <input
                    type="text"
                    className={s.contactInput}
                    placeholder="Votre nom complet"
                    value={contact.nom}
                    onChange={(e) => setContact((c) => ({ ...c, nom: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className={s.contactLabel}>
                    Email <span className={s.contactRequired}>*</span>
                  </label>
                  <input
                    type="email"
                    className={s.contactInput}
                    placeholder="votre@email.fr"
                    value={contact.email}
                    onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className={s.contactLabel}>
                    Telephone <span className={s.contactRequired}>*</span>
                  </label>
                  <input
                    type="tel"
                    className={s.contactInput}
                    placeholder="06 12 34 56 78"
                    value={contact.tel}
                    onChange={(e) => setContact((c) => ({ ...c, tel: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className={s.contactLabel}>Ville</label>
                  <input
                    type="text"
                    className={s.contactInput}
                    placeholder="Votre ville"
                    value={contact.ville}
                    onChange={(e) => setContact((c) => ({ ...c, ville: e.target.value }))}
                  />
                </div>

                {error && <div className={s.error}>{error}</div>}

                <button
                  type="submit"
                  className={s.submitBtn}
                  disabled={submitting}
                >
                  {submitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      Envoyer ma demande
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          )
        );

      default:
        return null;
    }
  };

  // -----------------------------------------------------------------------
  // Render: free_text input bar (shown at bottom)
  // -----------------------------------------------------------------------

  const renderInputBar = () => {
    if (!currentQuestion || currentQuestion.type !== "free_text" || isTyping) {
      return null;
    }

    return (
      <div className={s.inputWrap}>
        <input
          type="text"
          className={s.textInput}
          placeholder={currentQuestion.placeholder || "Votre reponse..."}
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleFreeTextSubmit();
            }
          }}
          autoFocus
        />
        <button
          type="button"
          className={s.sendBtn}
          disabled={!freeText.trim()}
          onClick={handleFreeTextSubmit}
          aria-label="Envoyer"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    );
  };

  // -----------------------------------------------------------------------
  // Main render
  // -----------------------------------------------------------------------

  return (
    <div className={s.container}>
      {/* Header */}
      <div className={s.header}>
        <div className={s.headerAvatar}>{initials}</div>
        <div className={s.headerInfo}>
          <div className={s.headerName}>{artisanNom}</div>
          {artisanMetierNom && <div className={s.headerMetier}>{artisanMetierNom}</div>}
        </div>
        {onClose && (
          <button className={s.headerClose} onClick={onClose} aria-label="Fermer">
            &times;
          </button>
        )}
      </div>

      {/* Messages */}
      <div className={s.messages} ref={messagesRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.role === "bot" ? s.bubbleBot : s.bubbleUser}
          >
            {msg.text}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className={s.typing}>
            <span className={s.dot} />
            <span className={s.dot} />
            <span className={s.dot} />
          </div>
        )}

        {/* Current question controls (options, slider, photo, summary) */}
        {renderCurrentControls()}
      </div>

      {/* Free text input bar at bottom */}
      {renderInputBar()}

      {/* Privacy */}
      <div className={s.privacy}>
        Vos donnees sont protegees et ne sont partagees qu&apos;avec cet artisan.
      </div>
    </div>
  );
}
