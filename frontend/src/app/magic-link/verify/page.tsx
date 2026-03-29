"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAccessToken } from "@/lib/auth";
import { Suspense } from "react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setError("Lien invalide");
      return;
    }

    const apiUrl = "/api/v1";
    fetch(`${apiUrl}/auth/magic-link/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setAccessToken(json.data.accessToken);
          localStorage.setItem("bativio_refresh", json.data.refreshToken);
          router.push("/dashboard");
        } else {
          setError(json.error || "Lien invalide ou expire");
        }
      })
      .catch(() => setError("Erreur de verification"));
  }, [router, searchParams]);

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-[80vh]">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <p className="font-display text-xl font-bold text-red-600">Erreur</p>
          <p className="mt-2 text-anthracite/60 text-sm">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-terre border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-anthracite/60">Verification en cours...</p>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <main className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 border-2 border-terre border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <VerifyContent />
    </Suspense>
  );
}
