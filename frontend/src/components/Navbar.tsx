"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function getInitials(name: string): string {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

function formatPlan(plan: string): string {
  if (!plan) return "Gratuit";
  const p = plan.toLowerCase();
  if (p === "gratuit" || p === "free") return "Gratuit";
  if (p === "starter") return "Starter";
  if (p === "essentiel" || p === "essential") return "Starter";
  if (p === "business") return "Business";
  if (p === "pro_plus" || p === "proplus" || p === "pro+") return "Business";
  if (p === "pro") return "Pro";
  return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
}

const ARTISAN_MENU = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/dashboard/profil", label: "Mon profil" },
  { href: "/dashboard/vitrine", label: "Ma vitrine" },
  { href: "/dashboard/demandes", label: "Demandes" },
  { href: "/dashboard/photos", label: "Mes photos" },
  { href: "/dashboard/parametres", label: "Paramètres" },
];

const ADMIN_MENU = [
  { href: "/admin", label: "Administration" },
  { href: "/admin/artisans", label: "Gérer les artisans" },
  { href: "/admin/statistiques", label: "Statistiques" },
];

export default function Navbar() {
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  // Close on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const menuItems = isAdmin ? ADMIN_MENU : ARTISAN_MENU;

  return (
    <nav className="nav">
      {/* Logo */}
      <Link href="/" className="nav-logo" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img src="/icons/icon.svg" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
        <span><span style={{ color: "#1C1C1E" }}>B</span>ativio</span>
      </Link>

      {/* Desktop right side */}
      <div className="nav-r" style={{ position: "relative" }}>
        {/* STATE 1: Loading */}
        {loading && (
          <div style={{ width: 120, height: 36 }} />
        )}

        {/* STATE 2: Not connected */}
        {!loading && !isAuthenticated && (
          <>
            <Link href="/" className="nav-link">Annuaire</Link>
            <Link href="/metiers" className="nav-link">Métiers</Link>
            <Link href="/guides" className="nav-link">Guides</Link>
            <Link href="/urgence" className="nav-link" style={{ color: "#dc2626", fontWeight: 600 }}>Urgence 24/7</Link>
            <Link href="/artisan" className="nav-link">Je suis artisan</Link>
            <Link href="/connexion" className="nav-link">Connexion</Link>
            <Link href="/connexion" className="nav-cta">Espace artisan</Link>
          </>
        )}

        {/* STATE 3: Connected */}
        {!loading && isAuthenticated && user && (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            {/* Avatar trigger */}
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              {/* Circle avatar */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#C4531A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  lineHeight: 1,
                }}>
                  {getInitials(user.nomAffichage)}
                </span>
              </div>

              {/* Company name — hidden on mobile */}
              <span className="nav-user-name" style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#1C1C1E",
                maxWidth: 160,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {user.nomAffichage}
              </span>

              {/* Chevron */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, transition: "transform .2s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)" }}>
                <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#9B9590" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 220,
                background: "#FFFFFF",
                borderRadius: 14,
                border: "1px solid #EDEBE7",
                boxShadow: "0 8px 32px rgba(0,0,0,.1)",
                padding: 8,
                zIndex: 1000,
              }}>
                {/* User info block */}
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.nomAffichage}
                  </div>
                  <div style={{ fontSize: 12, color: "#9B9590", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.email}
                  </div>
                  <span style={{
                    display: "inline-block",
                    background: "rgba(196,83,26,.06)",
                    color: "#C4531A",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 6,
                    marginTop: 6,
                  }}>
                    {formatPlan(user.plan)}
                  </span>
                </div>

                {/* Separator */}
                <div style={{ height: 1, background: "#F7F5F2", margin: "4px 8px" }} />

                {/* Menu items */}
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px 12px",
                      borderRadius: 8,
                      fontSize: 14,
                      color: "#1C1C1E",
                      textDecoration: "none",
                      transition: "background .15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F7F5F2"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Separator */}
                <div style={{ height: 1, background: "#F7F5F2", margin: "4px 8px" }} />

                {/* Logout */}
                <button
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#DC2626",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background .15s",
                    fontFamily: "'Karla', sans-serif",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,.04)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  Se d&eacute;connecter
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile hamburger — only shown on small screens via CSS */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileMenuOpen((v) => !v)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
          }}
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="1.8" strokeLinecap="round">
            {mobileMenuOpen ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          style={{
            position: "fixed",
            top: 56,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,.3)",
            zIndex: 999,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setMobileMenuOpen(false); }}
        >
          <div style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #EDEBE7",
            boxShadow: "0 8px 32px rgba(0,0,0,.1)",
            padding: "8px 16px 16px",
            maxHeight: "calc(100dvh - 56px)",
            overflowY: "auto",
          }}>
            {/* Connected state: user info */}
            {isAuthenticated && user && (
              <>
                <div style={{ padding: "12px 4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#C4531A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        lineHeight: 1,
                      }}>
                        {getInitials(user.nomAffichage)}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user.nomAffichage}
                      </div>
                      <div style={{ fontSize: 12, color: "#9B9590", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    display: "inline-block",
                    background: "rgba(196,83,26,.06)",
                    color: "#C4531A",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 6,
                    marginTop: 8,
                    marginLeft: 46,
                  }}>
                    {formatPlan(user.plan)}
                  </span>
                </div>
                <div style={{ height: 1, background: "#F7F5F2", margin: "4px 0" }} />
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "12px 4px",
                      fontSize: 15,
                      color: "#1C1C1E",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
                <div style={{ height: 1, background: "#F7F5F2", margin: "4px 0" }} />
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px 4px",
                    fontSize: 15,
                    color: "#DC2626",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontWeight: 500,
                    fontFamily: "'Karla', sans-serif",
                  }}
                >
                  Se d&eacute;connecter
                </button>
              </>
            )}

            {/* Not connected state */}
            {!isAuthenticated && (
              <>
                <Link
                  href="/urgence"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "12px 4px",
                    fontSize: 15,
                    color: "#dc2626",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Urgence 24/7
                </Link>
                <Link
                  href="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "12px 4px",
                    fontSize: 15,
                    color: "#1C1C1E",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "12px 4px",
                    fontSize: 15,
                    color: "#C4531A",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Espace artisan
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Inline style for mobile hamburger visibility and hiding desktop elements on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .nav-hamburger { display: flex !important; }
          .nav-user-name { display: none !important; }
          /* Mobile : cacher tous les liens desktop, ne garder que le hamburger.
             Sinon les liens (Annuaire / Metiers / Guides / Urgence / Je suis artisan / CTA)
             debordent l'ecran et chevauchent le logo Bativio. */
          .nav .nav-r .nav-link,
          .nav .nav-r .nav-cta { display: none !important; }
          /* Padding plus serre sur mobile pour gagner de la place */
          .nav { padding: 0 16px !important; }
        }
      `}</style>
    </nav>
  );
}
