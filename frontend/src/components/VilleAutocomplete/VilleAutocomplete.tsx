"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./VilleAutocomplete.module.css";

export interface CommuneResult {
  nom: string;
  codeInsee: string;
  codesPostaux: string[];
  departement: string;
  codeDepartement: string;
  region: string;
  population: number;
  latitude: number | null;
  longitude: number | null;
  slug: string;
}

interface VilleAutocompleteProps {
  onSelect: (commune: CommuneResult) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export default function VilleAutocomplete({
  onSelect,
  placeholder = "Tapez votre ville ou code postal...",
  defaultValue = "",
  className,
}: VilleAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<CommuneResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCommunes = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setIsOpen(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const isPostalCode = /^\d+$/.test(q.trim());
      const param = isPostalCode ? `codePostal=${encodeURIComponent(q.trim())}` : `nom=${encodeURIComponent(q.trim())}`;
      const res = await fetch(`/api/v1/public/geo/communes?${param}&limit=7`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setResults(json.data);
        setIsOpen(json.data.length > 0);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    } catch {
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchCommunes(value);
    }, 300);
  };

  const handleSelect = (commune: CommuneResult) => {
    const cp = commune.codesPostaux[0] || "";
    setQuery(`${commune.nom}${cp ? ` (${cp})` : ""}`);
    setIsOpen(false);
    setResults([]);
    onSelect(commune);
  };

  // Update query when defaultValue changes externally
  useEffect(() => {
    if (defaultValue && !query) {
      setQuery(defaultValue);
    }
    // Only run when defaultValue changes, not query
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  return (
    <div className={`${styles.wrapper} ${className || ""}`} ref={wrapperRef}>
      <input
        type="text"
        className={styles.input}
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
        placeholder={placeholder}
        autoComplete="off"
      />
      {isOpen && (
        <div className={styles.dropdown}>
          {isLoading && (
            <div className={styles.loading}>
              <span className={styles.spinner} />
              Recherche...
            </div>
          )}
          {!isLoading && results.length === 0 && hasSearched && (
            <div className={styles.noResult}>Aucune commune trouvee</div>
          )}
          {!isLoading &&
            results.map((c) => (
              <div
                key={c.codeInsee}
                className={styles.item}
                onClick={() => handleSelect(c)}
              >
                <div>
                  <span className={styles.itemNom}>{c.nom}</span>{" "}
                  <span className={styles.itemCp}>
                    {c.codesPostaux[0] || ""}
                  </span>
                </div>
                <span className={styles.itemMeta}>
                  {c.departement}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
