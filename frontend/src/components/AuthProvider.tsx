"use client";

// Backward-compatibility shim: re-export everything from the canonical
// AuthContext module so existing imports keep working.

export { AuthProvider as default, useAuth } from "@/context/AuthContext";
export type { User as ArtisanSessionData } from "@/context/AuthContext";
