"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function MagicContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("Lien invalide.");
      return;
    }

    fetch("/api/v1/auth/magic-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setStatus("error");
          setErrorMsg(data.error || "Ce lien est invalide ou a expiré.");
        } else {
          setStatus("success");
          setTimeout(() => router.push(data.data?.redirect || "/dashboard"), 1500);
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("Une erreur est survenue.");
      });
  }, [token, router]);

  return (
    <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 16, background: "var(--creme,#FAF8F5)" }}>
      <div style={{ background: "var(--blanc,#fff)", borderRadius: 16, border: "1px solid var(--sable,#E8D5C0)", boxShadow: "0 4px 24px rgba(61,46,31,.04)", maxWidth: 440, width: "100%", padding: 40, textAlign: "center" }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/" style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "var(--terre,#C4531A)", textDecoration: "none" }}>Bativio</Link>
        </div>

        {status === "loading" && (
          <>
            <div style={{ width: 40, height: 40, border: "3px solid var(--sable,#E8D5C0)", borderTopColor: "var(--terre,#C4531A)", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 20px" }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>Connexion en cours...</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--mousse-light,#E8F0E6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24 }}>&#10003;</div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 8 }}>Vous &ecirc;tes connect&eacute;</h1>
            <p style={{ fontSize: 14, color: "var(--pierre,#9C958D)" }}>Redirection vers votre espace...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(220,38,38,.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24 }}>&#9888;</div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 8 }}>Lien invalide ou expir&eacute;</h1>
            <p style={{ fontSize: 14, color: "var(--pierre,#9C958D)", lineHeight: 1.6, marginBottom: 24 }}>{errorMsg || "Ce lien de connexion a expir&eacute; (15 minutes) ou a d&eacute;j&agrave; &eacute;t&eacute; utilis&eacute;."}</p>
            <Link href="/connexion" style={{ display: "inline-block", background: "var(--terre,#C4531A)", color: "#fff", padding: "12px 28px", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none", marginBottom: 12 }}>Demander un nouveau lien</Link>
            <br />
            <Link href="/connexion" style={{ fontSize: 13, color: "var(--pierre,#9C958D)", textDecoration: "none" }}>Se connecter avec un mot de passe</Link>
          </>
        )}
      </div>
    </main>
  );
}

export default function MagicLinkPage() {
  return (
    <Suspense fallback={
      <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--creme,#FAF8F5)" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #E8D5C0", borderTopColor: "#C4531A", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </main>
    }>
      <MagicContent />
    </Suspense>
  );
}
