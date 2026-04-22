import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Tous les métiers du bâtiment — Annuaire artisans Rhône-Alpes",
  description:
    "Plombier, électricien, peintre, maçon, carreleur, menuisier, couvreur, chauffagiste, serrurier, cuisiniste : trouvez l'artisan qu'il vous faut à Chambéry, Annecy, Grenoble, Lyon et Valence.",
  alternates: { canonical: "https://www.bativio.fr/metiers" },
  openGraph: {
    title: "Tous les métiers du bâtiment — Bativio",
    description: "10 métiers, 5 villes, 50 pages dédiées.",
    url: "https://www.bativio.fr/metiers",
  },
};

interface Metier {
  slug: string;
  nom: string;
  emoji: string;
  intro: string;
  travaux: string[];
  rge: boolean;
}

const METIERS: Metier[] = [
  {
    slug: "plombier",
    nom: "Plombier",
    emoji: "🔧",
    intro: "Installation et dépannage sanitaire, chauffe-eau, canalisations, salle de bain complète.",
    travaux: ["Fuite d'eau urgente", "Remplacement chauffe-eau", "Installation salle de bain", "Débouchage WC"],
    rge: true,
  },
  {
    slug: "electricien",
    nom: "Électricien",
    emoji: "⚡",
    intro: "Tableau électrique, prises, mise aux normes NF C 15-100, domotique, bornes de recharge VE.",
    travaux: ["Tableau électrique", "Prises / interrupteurs", "Borne recharge VE", "Domotique KNX"],
    rge: true,
  },
  {
    slug: "peintre",
    nom: "Peintre",
    emoji: "🎨",
    intro: "Peinture intérieure, façade, papier peint, enduits décoratifs, ravalement.",
    travaux: ["Peinture salon/chambre", "Ravalement façade", "Papier peint", "Enduit décoratif"],
    rge: false,
  },
  {
    slug: "carreleur",
    nom: "Carreleur",
    emoji: "🔲",
    intro: "Pose de carrelage sol et mur, faïence, grès cérame, mosaïque, chape de ragréage.",
    travaux: ["Carrelage salle de bain", "Faïence cuisine", "Grès cérame", "Chape ragréage"],
    rge: false,
  },
  {
    slug: "macon",
    nom: "Maçon",
    emoji: "🧱",
    intro: "Gros œuvre, extension, mur porteur IPN, dalles béton, fondations, ravalement.",
    travaux: ["Ouverture mur porteur", "Extension maison", "Dalle béton", "Fondations"],
    rge: true,
  },
  {
    slug: "menuisier",
    nom: "Menuisier",
    emoji: "🪵",
    intro: "Fenêtres PVC/alu/bois, portes, volets, parquet, escaliers sur mesure, placards.",
    travaux: ["Fenêtres double vitrage", "Pose parquet", "Escalier sur mesure", "Dressing"],
    rge: true,
  },
  {
    slug: "couvreur",
    nom: "Couvreur",
    emoji: "🏠",
    intro: "Toiture tuiles, ardoises, zinc, gouttières, Velux, démoussage, photovoltaïque.",
    travaux: ["Réfection toiture", "Zinguerie", "Velux", "Démoussage hydrofuge"],
    rge: true,
  },
  {
    slug: "chauffagiste",
    nom: "Chauffagiste",
    emoji: "🔥",
    intro: "Chaudière gaz/fioul/bois, pompe à chaleur, plancher chauffant, VMC double flux.",
    travaux: ["Pompe à chaleur air-eau", "Chaudière gaz condensation", "Plancher chauffant", "VMC double flux"],
    rge: true,
  },
  {
    slug: "serrurier",
    nom: "Serrurier",
    emoji: "🔑",
    intro: "Serrures A2P, portes blindées, portails métalliques, dépannage urgent 24/7.",
    travaux: ["Porte blindée Fichet", "Serrure A2P", "Ouverture porte claquée", "Portail alu"],
    rge: false,
  },
  {
    slug: "cuisiniste",
    nom: "Cuisiniste",
    emoji: "🍳",
    intro: "Cuisines équipées sur mesure, salles de bain clés en main, aménagement buanderie.",
    travaux: ["Cuisine équipée sur mesure", "Salle de bain clé en main", "Îlot central", "Meubles buanderie"],
    rge: false,
  },
];

const VILLES = [
  { slug: "chambery", nom: "Chambéry" },
  { slug: "annecy", nom: "Annecy" },
  { slug: "grenoble", nom: "Grenoble" },
  { slug: "lyon", nom: "Lyon" },
  { slug: "valence", nom: "Valence" },
];

export default function MetiersPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--creme,#FAF8F5)", paddingBottom: 80 }}>
        <section style={{ background: "var(--bois,#3D2E1F)", padding: "56px 24px 48px", color: "#fff", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: "var(--argile,#D4956B)", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>
              Annuaire des métiers
            </p>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(30px,4.5vw,48px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 18 }}>
              10 métiers du bâtiment, <span className="calli" style={{ color: "var(--argile,#D4956B)" }}>5 villes</span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: "rgba(255,255,255,.8)", maxWidth: 560, margin: "0 auto" }}>
              Tous les artisans BTP de Rhône-Alpes, classés par métier. Certifications RGE / Qualibat / Qualifelec affichées sur chaque fiche.
            </p>
          </div>
        </section>

        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {METIERS.map((m) => (
              <div key={m.slug} style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 14, padding: "22px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 30 }}>{m.emoji}</div>
                  <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", margin: 0 }}>
                    {m.nom}
                  </h2>
                  {m.rge && (
                    <span style={{ marginLeft: "auto", fontSize: 10, padding: "3px 8px", background: "rgba(74,103,65,.12)", color: "#4A6741", borderRadius: 99, fontWeight: 700 }}>
                      RGE possible
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5, marginBottom: 12 }}>
                  {m.intro}
                </p>
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                    Travaux courants
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {m.travaux.map((t, i) => (
                      <span key={i} style={{ fontSize: 11, padding: "3px 10px", background: "var(--creme,#FAF8F5)", borderRadius: 99, color: "var(--bois-mid,#5C4A3A)" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: "1px solid var(--sable,#E8D5C0)", paddingTop: 12, marginBottom: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                    Par ville
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {VILLES.map((v) => (
                      <Link
                        key={v.slug}
                        href={`/${v.slug}/${m.slug}`}
                        style={{ fontSize: 12, padding: "4px 10px", background: "var(--terre,#C4531A)", color: "#fff", borderRadius: 99, textDecoration: "none", fontWeight: 600 }}
                      >
                        {v.nom}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link href={`/prix/${m.slug}`} style={{ fontSize: 13, color: "var(--terre,#C4531A)", fontWeight: 600, textDecoration: "none" }}>
                  Voir les prix {m.nom.toLowerCase()} 2026 →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 48px", textAlign: "center" }}>
          <div style={{ background: "var(--anthracite,#1C1C1E)", borderRadius: 18, padding: "32px 28px", color: "#fff" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
              Votre métier n&apos;est pas listé ?
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", marginBottom: 22, lineHeight: 1.5 }}>
              Paysagiste, ferronnier, plaquiste, parqueteur, ravaleur de façade : d&apos;autres métiers sont accessibles via l&apos;inscription directe.
            </p>
            <Link href="/inscription" style={{ padding: "12px 24px", background: "var(--terre,#C4531A)", color: "#fff", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Créer ma page artisan →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
