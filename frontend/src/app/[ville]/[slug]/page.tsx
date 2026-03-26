import { Metadata } from "next";
import { MOCK_ARTISANS, MOCK_VILLES } from "@/lib/mock-data";
import { VILLES } from "@/lib/constants";
import { METIER_PHOTOS } from "@/lib/metier-config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DevisForm from "@/components/DevisForm";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const params: { ville: string; slug: string }[] = [];
  for (const v of VILLES) {
    const artisans = MOCK_ARTISANS.filter(
      (a) => a.ville.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "") === v.slug
    );
    for (const a of artisans) {
      params.push({ ville: v.slug, slug: a.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = MOCK_ARTISANS.find((x) => x.slug === slug);
  if (!a) return { title: "Artisan introuvable" };
  return {
    title: `${a.nomAffichage} \u2014 ${a.metierNom} \u00e0 ${a.ville}`,
    description: a.description,
  };
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
      <main>
        {/* Hero */}
        <section className="artisan-hero">
          <div className="artisan-hero-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" />
          </div>
          <div className="artisan-hero-overlay" />
          <div className="artisan-hero-inner">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="artisan-rating-chip">
                <svg viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {a.noteMoyenne.toFixed(1)}
              </span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.45)" }}>{a.nombreAvis} avis</span>
            </div>
            <h1>{a.nomAffichage}</h1>
            <p className="subtitle">{a.metierNom} &agrave; {a.ville}</p>
            <div className="cta-row">
              <a href="#devis" className="cta-primary">Devis gratuit</a>
              <a href={`tel:${a.telephone.replace(/\s/g, "")}`} className="cta-secondary">{a.telephone}</a>
            </div>
          </div>
        </section>

        {/* Badges */}
        {a.badgesNoms.length > 0 && (
          <div className="artisan-badges">
            <div className="artisan-badges-inner hide-scroll">
              {a.badgesNoms.map((b) => <span key={b}>{b}</span>)}
            </div>
          </div>
        )}

        {/* Pr&eacute;sentation + stats */}
        <div style={{ background: "var(--creme)" }}>
          <div className="artisan-section">
            <div className="sep" />
            <h2>Pr&eacute;sentation</h2>
            <p style={{ fontSize: 14, color: "var(--g500)", lineHeight: 1.7 }}>{a.description}</p>
            <div className="artisan-stats" style={{ marginTop: 28 }}>
              {a.experienceAnnees && (
                <div className="artisan-stat">
                  <div className="n">{a.experienceAnnees}</div>
                  <div className="l">ann&eacute;es d&apos;exp&eacute;rience</div>
                </div>
              )}
              <div className="artisan-stat">
                <div className="n">{a.nombreAvis}</div>
                <div className="l">avis clients</div>
              </div>
              <div className="artisan-stat">
                <div className="n">{a.zoneRayonKm} km</div>
                <div className="l">rayon d&apos;intervention</div>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        {a.services.length > 0 && (
          <div style={{ background: "var(--blanc)" }}>
            <div className="artisan-section">
              <div className="sep" />
              <h2>Services</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {a.services.map((s, i) => (
                  <div key={s.id} className={`service-card ${i === 0 ? "featured" : "normal"}`} style={i === 0 ? { gridColumn: "1 / -1" } : {}}>
                    <h3>{s.titre}</h3>
                    <p className="desc">{s.description}</p>
                    {s.prixIndicatif && <p className="price">{s.prixIndicatif}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Zone intervention */}
        {a.zones.length > 0 && (
          <div style={{ background: "var(--creme)" }}>
            <div className="artisan-section">
              <div className="sep" />
              <h2>Zone d&apos;intervention</h2>
              <div>
                {a.zones.map((z) => <span key={z} className="zone-chip">{z}</span>)}
              </div>
              <p style={{ fontSize: 12, color: "var(--g400)", marginTop: 12 }}>
                Rayon d&apos;intervention : {a.zoneRayonKm} km autour de {a.ville}
              </p>
            </div>
          </div>
        )}

        {/* Devis + Contact */}
        <div id="devis" style={{ background: "var(--creme)" }}>
          <div className="artisan-section">
            <div className="devis-grid">
              <div className="devis-form-wrap">
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Demander un devis</h2>
                <DevisForm slug={slug} />
              </div>
              <div className="devis-contact-wrap">
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Contact</h2>
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
                        <div key={h.jourSemaine} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "2px 0" }}>
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

        {/* Footer SIRET */}
        <div className="artisan-footer-siret">
          {a.nomAffichage} &middot; Propuls&eacute; par Bativio
        </div>

        {/* Sticky CTA mobile */}
        <div className="artisan-cta-mobile">
          <a href={`tel:${a.telephone.replace(/\s/g, "")}`} className="call">Appeler</a>
          <a href="#devis" className="devis">Devis gratuit</a>
        </div>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: a.nomAffichage,
            description: a.description,
            telephone: a.telephone,
            url: `https://bativio.fr/${villeSlug}/${a.slug}`,
            address: { "@type": "PostalAddress", addressLocality: a.ville, postalCode: a.codePostal, addressCountry: "FR" },
            aggregateRating: { "@type": "AggregateRating", ratingValue: a.noteMoyenne, reviewCount: a.nombreAvis, bestRating: 5 },
          }),
        }}
      />
    </>
  );
}
