import { Metadata } from "next";
import Link from "next/link";
import { TRAVAUX } from "@/lib/travaux-data";
import { MOCK_ARTISANS } from "@/lib/mock-data";
import ArtisanCard from "@/components/ArtisanCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return TRAVAUX.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = TRAVAUX.find((x) => x.slug === slug);
  if (!t) return { title: "Travaux introuvables" };
  return {
    title: `${t.nom} à Chambéry | Devis gratuit`,
    description: `Trouvez un artisan qualifié pour votre ${t.nom.toLowerCase()} à Chambéry. Profils vérifiés, avis clients, devis gratuit sous 24h. Zéro commission.`,
    alternates: { canonical: `/travaux/${slug}` },
    openGraph: {
      title: `${t.nom} à Chambéry | Bativio`,
      description: `Devis gratuit pour votre ${t.nom.toLowerCase()}. Zéro commission.`,
      url: `https://bativio.fr/travaux/${slug}`,
      images: [{ url: t.photo, width: 600, height: 400, alt: t.nom }],
    },
  };
}

export default async function TravauxPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = TRAVAUX.find((x) => x.slug === slug);
  if (!t) return <div>Travaux introuvables</div>;

  const artisans = MOCK_ARTISANS.filter((a) => {
    const ms = a.metierNom.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
    return t.metiers.includes(ms);
  });

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{ position: "relative", overflow: "hidden", background: "#1C1C1E", padding: "48px 32px 56px" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(28,28,30,.6), rgba(28,28,30,.9))" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,.1)", color: "#16a34a", fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 20, marginBottom: 16 }}>
              &#9889; Devis gratuit en 24h
            </div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 10 }}>
              {t.nom} &agrave; Chamb&eacute;ry
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.5)", maxWidth: 600 }}>
              {artisans.length} artisan{artisans.length > 1 ? "s" : ""} qualifi&eacute;{artisans.length > 1 ? "s" : ""} disponible{artisans.length > 1 ? "s" : ""}
            </p>
            <Link href="/inscription" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, padding: "14px 28px", background: "#C4531A", color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              Demander un devis gratuit
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </section>

        {/* Description */}
        <section style={{ background: "#fff", padding: "48px 32px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ width: 44, height: 2, background: "#C4531A", marginBottom: 16 }} />
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>&Agrave; propos</h2>
            <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.7 }}>{t.description}</p>
          </div>
        </section>

        {/* Artisans */}
        {artisans.length > 0 && (
          <section style={{ background: "#FAF8F5", padding: "48px 32px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>
                Artisans disponibles
              </h2>
              <div className="grid" style={{ maxWidth: 1100 }}>
                {artisans.map((a) => <ArtisanCard key={a.id} artisan={a} villeSlug="chambery" />)}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {t.faq.length > 0 && (
          <section style={{ background: "#fff", padding: "48px 32px" }}>
            <div style={{ maxWidth: 700, margin: "0 auto" }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Questions fr&eacute;quentes</h2>
              {t.faq.map((f, i) => (
                <div key={i} style={{ borderBottom: "1px solid #EDEBE7", padding: "18px 0" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>{f.q}</h3>
                  <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ background: "#1C1C1E", padding: "48px 32px", textAlign: "center" }}>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Besoin d&apos;un devis ?</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", marginBottom: 24 }}>Gratuit &middot; Sans engagement &middot; R&eacute;ponse sous 24h</p>
            <Link href="/inscription" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "#C4531A", color: "#fff", borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: "none" }}>
              Demander un devis gratuit
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: t.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />
    </>
  );
}
