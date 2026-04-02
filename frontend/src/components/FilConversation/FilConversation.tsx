"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import s from "./FilConversation.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FilConversationProps {
  demandeId?: string;
  clientToken?: string;
  isArtisan?: boolean;
}

interface Message {
  id: string;
  contenu: string;
  auteur: string; // "client" or "artisan" from API
  expediteur?: string; // legacy compat
  photoUrl?: string | null;
  createdAt: string;
}

interface DemandeData {
  id: string;
  nomClient: string;
  telephoneClient: string;
  emailClient: string;
  descriptionBesoin: string;
  statut: string;
  urgence?: string;
  villeClient?: string | null;
  createdAt: string;
  artisan?: {
    nomAffichage: string;
    metierNom?: string | null;
  };
  messages: Message[];
}

// ---------------------------------------------------------------------------
// Statut colors + labels
// ---------------------------------------------------------------------------

const STATUT_DOT: Record<string, string> = {
  NOUVEAU: "#dc2626",
  VU: "#E8A84C",
  REPONDU: "#2563EB",
  ACCEPTE: "#16a34a",
  REFUSE: "#9B9590",
  ARCHIVE: "#C5C0B9",
};

const STATUT_LABEL: Record<string, string> = {
  NOUVEAU: "Nouveau",
  VU: "En attente",
  REPONDU: "Repondu",
  ACCEPTE: "Accepte",
  REFUSE: "Refuse",
  ARCHIVE: "Archive",
};

const STATUT_BG: Record<string, string> = {
  NOUVEAU: "rgba(220,38,38,.08)",
  VU: "rgba(232,168,76,.08)",
  REPONDU: "rgba(37,99,235,.08)",
  ACCEPTE: "rgba(22,163,74,.08)",
  REFUSE: "rgba(155,149,144,.08)",
  ARCHIVE: "rgba(197,192,185,.08)",
};

// ---------------------------------------------------------------------------
// Relative date formatter
// ---------------------------------------------------------------------------

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "A l'instant";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor((today.getTime() - msgDay.getTime()) / 86400000);

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FilConversation({
  demandeId,
  clientToken,
  isArtisan = false,
}: FilConversationProps) {
  const { fetchWithAuth } = useAuth();
  const router = useRouter();

  const [demande, setDemande] = useState<DemandeData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMessageDateRef = useRef<string | null>(null);

  // -----------------------------------------------------------------------
  // Scroll to bottom
  // -----------------------------------------------------------------------

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  // -----------------------------------------------------------------------
  // Fetch demande data
  // -----------------------------------------------------------------------

  const fetchDemande = useCallback(async () => {
    try {
      let data: DemandeData;

      if (clientToken) {
        const res = await fetch(`/api/v1/public/demandes/${clientToken}`);
        const json = await res.json();
        if (!json.success) {
          setError(json.error || "Conversation introuvable.");
          return;
        }
        data = json.data;
      } else if (demandeId && isArtisan) {
        data = (await fetchWithAuth(
          `/artisan/demandes/${demandeId}`
        )) as DemandeData;
      } else {
        setError("Parametres manquants.");
        return;
      }

      setDemande(data);
      const msgs = data.messages || [];
      setMessages(msgs);
      if (msgs.length > 0) {
        lastMessageDateRef.current = msgs[msgs.length - 1].createdAt;
      }
    } catch {
      setError("Erreur de chargement. Veuillez reessayer.");
    } finally {
      setLoading(false);
    }
  }, [clientToken, demandeId, isArtisan, fetchWithAuth]);

  // -----------------------------------------------------------------------
  // Poll for new messages
  // -----------------------------------------------------------------------

  const pollNewMessages = useCallback(async () => {
    if (!demande) return;

    try {
      const after = lastMessageDateRef.current || "";
      let newMsgs: Message[] = [];

      if (clientToken) {
        const res = await fetch(
          `/api/v1/public/demandes/${clientToken}/messages?after=${encodeURIComponent(after)}`
        );
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          newMsgs = json.data;
        }
      } else if (demandeId && isArtisan) {
        const data = (await fetchWithAuth(
          `/artisans/me/demandes/${demandeId}/messages?after=${encodeURIComponent(after)}`
        )) as Message[];
        if (Array.isArray(data)) {
          newMsgs = data;
        }
      }

      if (newMsgs.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const filtered = newMsgs.filter((m) => !existingIds.has(m.id));
          if (filtered.length === 0) return prev;
          return [...prev, ...filtered];
        });
        lastMessageDateRef.current = newMsgs[newMsgs.length - 1].createdAt;
        scrollToBottom();
      }
    } catch {
      // Silently ignore poll errors
    }
  }, [demande, clientToken, demandeId, isArtisan, fetchWithAuth, scrollToBottom]);

  // -----------------------------------------------------------------------
  // Init + polling
  // -----------------------------------------------------------------------

  useEffect(() => {
    fetchDemande();
  }, [fetchDemande]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!demande) return;

    pollIntervalRef.current = setInterval(pollNewMessages, 10000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [demande, pollNewMessages]);

  // -----------------------------------------------------------------------
  // Send message
  // -----------------------------------------------------------------------

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || sending) return;

    setSending(true);
    setInputValue("");

    // Optimistic add
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      contenu: text,
      auteur: isArtisan ? "artisan" : "client",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    scrollToBottom();

    try {
      if (clientToken) {
        const res = await fetch(
          `/api/v1/public/demandes/${clientToken}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contenu: text }),
          }
        );
        const json = await res.json();
        if (!json.success) throw new Error(json.error);

        // Replace optimistic with real message
        if (json.data) {
          setMessages((prev) =>
            prev.map((m) => (m.id === optimisticMsg.id ? json.data : m))
          );
          lastMessageDateRef.current = json.data.createdAt;
        }
      } else if (demandeId && isArtisan) {
        const data = (await fetchWithAuth(
          `/artisan/demandes/${demandeId}/messages`,
          {
            method: "POST",
            body: JSON.stringify({ contenu: text }),
          }
        )) as Message;

        if (data) {
          setMessages((prev) =>
            prev.map((m) => (m.id === optimisticMsg.id ? data : m))
          );
          lastMessageDateRef.current = data.createdAt;
        }
      }
    } catch {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setInputValue(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // -----------------------------------------------------------------------
  // Initials helper
  // -----------------------------------------------------------------------

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // -----------------------------------------------------------------------
  // Group messages by date
  // -----------------------------------------------------------------------

  const renderMessages = () => {
    const elements: React.ReactNode[] = [];
    let lastDateLabel = "";

    messages.forEach((msg) => {
      const dateLabel = formatDateLabel(msg.createdAt);
      if (dateLabel !== lastDateLabel) {
        lastDateLabel = dateLabel;
        elements.push(
          <div key={`date-${msg.createdAt}`} className={s.dateSep}>
            <div className={s.dateSepLine} />
            <span className={s.dateSepLabel}>{dateLabel}</span>
            <div className={s.dateSepLine} />
          </div>
        );
      }

      const sender = (msg.auteur || msg.expediteur || "").toLowerCase();
      const isSelf = isArtisan
        ? sender === "artisan"
        : sender === "client";

      elements.push(
        <div
          key={msg.id}
          className={isSelf ? s.bubbleWrapClient : s.bubbleWrapArtisan}
        >
          {msg.photoUrl && (
            <img
              src={msg.photoUrl}
              alt=""
              className={s.messagePhoto}
              loading="lazy"
            />
          )}
          <div className={isSelf ? s.bubbleClient : s.bubbleArtisan}>
            {msg.contenu}
          </div>
          <span className={isSelf ? s.messageMetaRight : s.messageMeta}>
            {formatTime(msg.createdAt)}
          </span>
        </div>
      );
    });

    return elements;
  };

  // -----------------------------------------------------------------------
  // Render: Loading
  // -----------------------------------------------------------------------

  if (loading) {
    return (
      <div className={s.container}>
        <div className={s.loadingWrap}>
          <div className={s.spinner} />
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render: Error
  // -----------------------------------------------------------------------

  if (error || !demande) {
    return (
      <div className={s.container}>
        <div className={s.errorWrap}>
          <svg
            width="48"
            height="48"
            fill="none"
            stroke="var(--sable, #E8D5C0)"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <div className={s.errorTitle}>Conversation introuvable</div>
          <div className={s.errorSub}>
            {error || "Ce lien n'est plus valide."}
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Derive header info
  // -----------------------------------------------------------------------

  const headerName = isArtisan
    ? demande.nomClient
    : demande.artisan?.nomAffichage || "Artisan";

  const headerMetier = isArtisan ? undefined : demande.artisan?.metierNom;
  const initials = getInitials(headerName);
  const statut = demande.statut;

  // -----------------------------------------------------------------------
  // Render: Main
  // -----------------------------------------------------------------------

  return (
    <div className={s.container}>
      {/* Header */}
      <div className={s.header}>
        {isArtisan && (
          <button
            className={s.headerBack}
            onClick={() => router.push("/dashboard/devis")}
            aria-label="Retour"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className={s.headerAvatar}>{initials}</div>

        <div className={s.headerInfo}>
          <div className={s.headerName}>{headerName}</div>
          {headerMetier && (
            <div className={s.headerMetier}>{headerMetier}</div>
          )}
        </div>

        <span
          className={s.statusBadge}
          style={{
            background: STATUT_BG[statut] || STATUT_BG.ARCHIVE,
            color: STATUT_DOT[statut] || STATUT_DOT.ARCHIVE,
          }}
        >
          <span
            className={s.statusDot}
            style={{
              background: STATUT_DOT[statut] || STATUT_DOT.ARCHIVE,
            }}
          />
          {STATUT_LABEL[statut] || statut}
        </span>
      </div>

      {/* Messages area */}
      <div className={s.messages} ref={messagesContainerRef}>
        {/* Initial demande card */}
        <div className={s.demandeCard}>
          <div className={s.demandeTitle}>
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            Demande de devis
          </div>

          <div className={s.demandeDescription}>
            {demande.descriptionBesoin}
          </div>

          <div className={s.demandeMeta}>
            {demande.urgence === "urgent" && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: "rgba(220,38,38,.1)",
                  color: "#dc2626",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Urgent
              </span>
            )}
            {demande.villeClient && (
              <span>{demande.villeClient}</span>
            )}
            <span>{timeAgo(demande.createdAt)}</span>
          </div>
        </div>

        {/* Messages */}
        {renderMessages()}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className={s.inputBar}>
        <input
          type="text"
          className={s.inputField}
          placeholder="Votre message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
          autoFocus={isArtisan}
        />
        <button
          className={s.sendButton}
          onClick={handleSend}
          disabled={!inputValue.trim() || sending}
          aria-label="Envoyer"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
