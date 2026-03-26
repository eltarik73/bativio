import { Metadata } from "next";
import { MOCK_ARTISANS } from "@/lib/mock-data";
import { VILLES } from "@/lib/constants";
import { METIER_PHOTOS } from "@/lib/metier-config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DevisForm from "@/components/DevisForm";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const p: { ville: string; slug: string }[] = [];
  for (const v of VILLES) {
    MOCK_ARTISANS.filter((a) => a.ville.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "") === v.slug)
      .forEach((a) => p.push({ ville: v.slug, slug: a.slug }));
  }
  return p;
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = MOCK_ARTISANS.find((x) => x.slug === slug);
  if (!a) return { title: "Artisan introuvable" };
  return { title: `${a.nomAffichage} \u2014 ${a.metierNom} \u00e0 ${a.ville}`, description: a.description };
}

const JOURS = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default async function ArtisanPage({ params }: { params: Promise<{ ville: string; slug: string }> }) {
  const { ville: villeSlug, slug } = await params;
  const a = MOCK_ARTISANS.find((x) => x.slug === slug);
  if (!a) notFound();
  const ms = a.metierNom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  const photo = METIER_PHOTOS[ms] || METIER_PHOTOS.plombier;

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Hero */}
        <section className="artisan-hero">
          <div className="artisan-hero-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" />
          </div>
          <div className="artisan-hero-overlay" />
          <div className="artisan-hero-inner">
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span className="artisan-rating-chip">
                <svg viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {a.noteMoyenne.toFixed(1)}
              </span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.45)" }}>{a.nombreAvis} avis</span>
            </div>
            <h1>{a.nomAffichage}</h1>
            <p className="subtitle">{a.metierNom} &agrave; {a.ville}</p>
            {/* Badges IN hero — frosted glass */}
            {a.badgesNoms.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                {a.badgesNoms.map((b) => (
                  <span key={b} style={{ background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500 }}>{b}</span>
                ))}
              </div>
            )}
            <div className="cta-row">
              <a href="#devis" className="cta-primary">Devis gratuit</a>
              <a href={`tel:${a.telephone.replace(/\s/g, "")}`} className="cta-secondary">{a.telephone}</a>
            </div>
          </div>
        </section>

        {/* Stats — individual cards */}
        <div style={{ background: "var(--creme)", padding: "48px 28px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {a.experienceAnnees && (
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #EDEBE7", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, color: "#C4531A" }}>{a.experienceAnnees}</div>
                  <div style={{ fontSize: 13, color: "#9B9590", marginTop: 4 }}>ann&eacute;es d&apos;exp&eacute;rience</div>
                </div>
              )}
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #EDEBE7", textAlign: "center" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, color: "#C4531A" }}>{a.nombreAvis}</div>
                <div style={{ fontSize: 13, color: "#9B9590", marginTop: 4 }}>avis clients</div>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #EDEBE7", textAlign: "center" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, color: "#C4531A" }}>{a.zoneRayonKm} km</div>
                <div style={{ fontSize: 13, color: "#9B9590", marginTop: 4 }}>rayon d&apos;intervention</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pr&eacute;sentation */}
        <div style={{ background: "#fff", padding: "48px 28px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ width: 44, height: 2, background: "#C4531A", marginBottom: 16 }} />
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>Pr&eacute;sentation</h2>
            <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.7 }}>{a.description}</p>
          </div>
        </div>

        {/* Services — all cr&egrave;me */}
        {a.services.length > 0 && (
          <div style={{ background: "var(--creme)", padding: "48px 28px" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <div style={{ width: 44, height: 2, background: "#C4531A", marginBottom: 16 }} />
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Services</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {a.services.map((s) => (
                  <div key={s.id} style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 14, padding: 24, transition: "all .25s cubic-bezier(.22,1,.36,1)", cursor: "default" }}>
                    <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>{s.titre}</h3>
                    <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5 }}>{s.description}</p>
                    {s.prixIndicatif && <p style={{ fontSize: 13, fontWeight: 600, color: "#C4531A", marginTop: 10 }}>{s.prixIndicatif}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Zone */}
        {a.zones.length > 0 && (
          <div style={{ background: "#fff", padding: "48px 28px" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <div style={{ width: 44, height: 2, background: "#C4531A", marginBottom: 16 }} />
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>Zone d&apos;intervention</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {a.zones.map((z) => <span key={z} style={{ padding: "9px 18px", background: "var(--creme)", border: "1px solid #EDEBE7", borderRadius: 22, fontSize: 13, color: "#6B6560" }}>{z}</span>)}
              </div>
              <p style={{ fontSize: 13, color: "#9B9590", marginTop: 12 }}>Rayon : {a.zoneRayonKm} km autour de {a.ville}</p>
            </div>
          </div>
        )}

        {/* Devis + Contact */}
        <div id="devis" style={{ background: "var(--creme)", padding: "48px 28px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div className="devis-grid">
              <div style={{ background: "#fff", border: "1.5px solid #EDEBE7", borderRadius: 16, padding: 32, maxWidth: 560 }}>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Demander un devis</h2>
                <DevisForm slug={slug} />
              </div>
              <div className="devis-contact-wrap">
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Contact</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <p className="label">T&eacute;l&eacute;phone</p>
                    <p className="value"><a href={`tel:${a.telephone.replace(/\s/g, "")}`}>{a.telephone}</a></p>
                  </div>
                  <div>
                    <p className="label">Adresse</p>
                    <p className="value">{a.adresse}, {a.codePostal} {a.ville}</p>
                  </div>
                  {a.horaires.length > 0 && (
                    <div>
                      <p className="label" style={{ marginBottom: 6 }}>Horaires</p>
                      {a.horaires.map((h) => (
                        <div key={h.jourSemaine} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0" }}>
                          <span style={{ color: "rgba(255,255,255,.55)" }}>{JOURS[h.jourSemaine]}</span>
                          <span>{h.ouvert ? `${h.heureOuverture} - ${h.heureFermeture}` : "Ferm\u00e9"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="artisan-footer-siret">{a.nomAffichage} &middot; Propuls&eacute; par Bativio</div>
        <div className="artisan-cta-mobile">
          <a href={`tel:${a.telephone.replace(/\s/g, "")}`} className="call">Appeler</a>
          <a href="#devis" className="devis">Devis gratuit</a>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", name: a.nomAffichage, description: a.description, telephone: a.telephone, url: `https://bativio.fr/${villeSlug}/${a.slug}`, address: { "@type": "PostalAddress", addressLocality: a.ville, postalCode: a.codePostal, addressCountry: "FR" }, aggregateRating: { "@type": "AggregateRating", ratingValue: a.noteMoyenne, reviewCount: a.nombreAvis, bestRating: 5 } }) }} />
    </>
  );
}
