import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

const METIERS_INFO: Record<string, { nom: string; pluriel: string; emoji: string; description: string; intro: string }> = {
  plombier: { nom: "Plombier", pluriel: "plombiers", emoji: "🔧", description: "Plomberie sanitaire, chauffe-eau, salle de bain", intro: "Les travaux de plomberie comprennent la pose, la réparation et l'entretien des installations sanitaires (robinets, WC, douches, canalisations) et la gestion du chauffe-eau." },
  electricien: { nom: "Électricien", pluriel: "électriciens", emoji: "⚡", description: "Tableau électrique, prises, domotique, mise aux normes", intro: "Un électricien intervient pour l'installation et la mise aux normes NF C 15-100 : tableau, prises, interrupteurs, points lumineux, VMC, domotique et bornes de recharge." },
  peintre: { nom: "Peintre", pluriel: "peintres", emoji: "🎨", description: "Peinture intérieure, façades, papier peint, crépi", intro: "Le peintre en bâtiment prépare les supports (rebouchage, ponçage, enduits), puis applique la peinture, le papier peint ou les revêtements décoratifs en intérieur et extérieur." },
  carreleur: { nom: "Carreleur", pluriel: "carreleurs", emoji: "🔲", description: "Carrelage sol/mur, faïence, parquet, sol souple", intro: "Le carreleur pose des revêtements de sol et de mur : carrelage céramique, grès cérame, mosaïque, faïence. Il intervient aussi pour parquets stratifiés, sols PVC et chapes de ragréage." },
  macon: { nom: "Maçon", pluriel: "maçons", emoji: "🧱", description: "Gros œuvre, extension, ouvertures, dalles, chapes", intro: "Le maçon réalise les travaux de gros œuvre : ouvertures (mur porteur + IPN), cloisons, dalles béton, extensions, fondations, ravalement." },
  menuisier: { nom: "Menuisier", pluriel: "menuisiers", emoji: "🪵", description: "Fenêtres, portes, parquet, escaliers, agencement", intro: "Le menuisier pose fenêtres (PVC, alu, bois), portes, volets, parquets, escaliers sur mesure, placards et terrasses bois. Il peut intervenir sur la charpente traditionnelle." },
  couvreur: { nom: "Couvreur", pluriel: "couvreurs", emoji: "🏠", description: "Toiture, tuiles, ardoises, zinguerie, gouttières", intro: "Le couvreur s'occupe de la toiture : pose et réfection des tuiles, ardoises, zinc, gouttières, velux. Il intervient aussi pour le démoussage, l'hydrofuge et l'isolation des combles." },
  chauffagiste: { nom: "Chauffagiste", pluriel: "chauffagistes", emoji: "🔥", description: "Chaudière, pompe à chaleur, climatisation, plancher chauffant", intro: "Le chauffagiste installe, remplace et entretient les systèmes de chauffage : chaudière gaz/fioul/bois, pompe à chaleur, poêle, plancher chauffant, VMC double flux." },
  serrurier: { nom: "Serrurier", pluriel: "serruriers", emoji: "🔑", description: "Serrures, portes blindées, portails, dépannage", intro: "Le serrurier remplace les cylindres, installe serrures A2P, portes blindées, grilles de protection, portails métalliques. Disponible en urgence 24/7 pour ouverture de porte." },
  cuisiniste: { nom: "Cuisiniste", pluriel: "cuisinistes", emoji: "🍳", description: "Cuisines équipées, salles de bain, aménagement", intro: "Le cuisiniste conçoit et installe cuisines équipées ou sur mesure, salles de bain complètes, aménagements buanderie. Il coordonne plomberie, électricité et revêtements." },
};

interface PageProps {
  params: Promise<{ metier: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { metier } = await params;
  const info = METIERS_INFO[metier];
  if (!info) return { title: "Métier introuvable" };
  return {
    title: `Prix ${info.nom} 2026 Rhône-Alpes — Tarifs travaux ${info.pluriel}`,
    description: `Découvrez les prix 2026 des travaux de ${info.nom.toLowerCase()} en Rhône-Alpes : ${info.description}. Fourchettes HT bas/moyen/haut par prestation.`,
  };
}

export default async function PrixMetierPage({ params }: PageProps) {
  const { metier } = await params;
  const info = METIERS_INFO[metier];
  if (!info) notFound();

  const prestations = await prisma.cataloguePrestation.findMany({
    where: { metierSlug: metier },
    orderBy: [{ categorie: "asc" }, { prixHtMoyen: "asc" }],
  });

  if (prestations.length === 0) notFound();

  const grouped = prestations.reduce<Record<string, typeof prestations>>((acc, p) => {
    const cat = p.categorie || "Général";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const moyenne = Math.round(prestations.reduce((sum, p) => sum + p.prixHtMoyen, 0) / prestations.length);

  return (
    <>
      <Navbar />
      <section className="cinema-light" style={{ padding: "64px 32px 40px", position: "relative" }}>
        <div className="cinema-blob-light cinema-blob-light-1" style={{ opacity: .25 }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 10 }}>
          <Link href="/prix" style={{ fontSize: 13, color: "var(--pierre)", marginBottom: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
            ← Tous les métiers
          </Link>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
            <div style={{ fontSize: 56 }}>{info.emoji}</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,4.5vw,46px)", fontWeight: 600, color: "var(--bois)", letterSpacing: -1, lineHeight: 1.05, marginBottom: 10 }}>
                Prix <span style={{ fontStyle: "italic", color: "var(--terre)" }}>{info.nom.toLowerCase()}</span> 2026
                <br />
                <span style={{ fontSize: "0.55em", fontWeight: 400, color: "var(--bois-mid)" }}>Rhône-Alpes — Base tarifaire</span>
              </h1>
              <p style={{ fontSize: 15, color: "var(--bois-mid)", lineHeight: 1.55, maxWidth: 720 }}>{info.intro}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 28 }} className="max-md:!grid-cols-1">
            <div className="liquid-glass" style={{ padding: 18, borderRadius: 14 }}>
              <div style={{ fontSize: 11, color: "var(--pierre)", textTransform: "uppercase", letterSpacing: .5, fontWeight: 600 }}>Prestations</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 30, fontWeight: 600, color: "var(--bois)", letterSpacing: -.5 }}>{prestations.length}</div>
            </div>
            <div className="liquid-glass" style={{ padding: 18, borderRadius: 14 }}>
              <div style={{ fontSize: 11, color: "var(--pierre)", textTransform: "uppercase", letterSpacing: .5, fontWeight: 600 }}>Prix moyen</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 30, fontWeight: 600, color: "var(--terre)", letterSpacing: -.5 }}>{moyenne.toLocaleString("fr-FR")} €</div>
            </div>
            <div className="liquid-glass" style={{ padding: 18, borderRadius: 14 }}>
              <div style={{ fontSize: 11, color: "var(--pierre)", textTransform: "uppercase", letterSpacing: .5, fontWeight: 600 }}>Mise à jour</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "var(--bois)", letterSpacing: -.3, lineHeight: 1.2 }}>INSEE BT01<br /><span style={{ fontSize: 13, color: "var(--bois-mid)" }}>Déc. 2025 · 133,7</span></div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 32px 64px", background: "var(--blanc)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "var(--bois)", marginBottom: 14, letterSpacing: -.3 }}>
                {cat} <span style={{ color: "var(--pierre)", fontWeight: 400, fontSize: 14 }}>({items.length})</span>
              </h2>
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 90px 100px 90px", padding: "10px 18px", background: "var(--creme)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, color: "var(--pierre)" }} className="max-md:!hidden">
                  <div style={{ width: 70 }}>Code</div>
                  <div>Prestation</div>
                  <div style={{ textAlign: "right" }}>Bas HT</div>
                  <div style={{ textAlign: "right" }}>Moyen HT</div>
                  <div style={{ textAlign: "right" }}>Haut HT</div>
                </div>
                {items.map((p) => (
                  <div key={p.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr 90px 100px 90px", padding: "14px 18px", borderTop: "1px solid #F2EAE0", alignItems: "center", fontSize: 14 }} className="max-md:!grid-cols-1 max-md:!gap-2">
                    <div style={{ width: 70 }}>
                      <code style={{ fontSize: 10, color: "var(--terre)", background: "rgba(196,83,26,.06)", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>{p.code}</code>
                    </div>
                    <div style={{ color: "var(--bois)", fontWeight: 500 }}>
                      {p.designation}
                      <span style={{ fontSize: 12, color: "var(--pierre)", marginLeft: 6 }}>/ {p.unite}</span>
                    </div>
                    <div style={{ textAlign: "right", color: "var(--bois-mid)", fontSize: 13 }}>{p.prixHtBas.toLocaleString("fr-FR")} €</div>
                    <div style={{ textAlign: "right", color: "var(--terre)", fontWeight: 700, fontSize: 14 }}>{p.prixHtMoyen.toLocaleString("fr-FR")} €</div>
                    <div style={{ textAlign: "right", color: "var(--bois-mid)", fontSize: 13 }}>{p.prixHtHaut.toLocaleString("fr-FR")} €</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 40, padding: 28, background: "linear-gradient(135deg, rgba(196,83,26,.06), rgba(201,148,58,.04))", borderRadius: 20, textAlign: "center", border: "1px solid rgba(196,83,26,.12)" }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--terre)", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Devis personnalisé</div>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 600, color: "var(--bois)", marginBottom: 10, letterSpacing: -.3 }}>
              Obtenez un devis <span style={{ fontStyle: "italic", color: "var(--terre)" }}>chiffré</span> en 5 min
            </h3>
            <p style={{ fontSize: 14, color: "var(--bois-mid)", marginBottom: 20, maxWidth: 520, margin: "0 auto 20px", lineHeight: 1.55 }}>
              Notre IA qualifie votre projet, affiche une estimation en temps réel, et route votre demande aux meilleurs {info.pluriel} de Rhône-Alpes.
            </p>
            <Link href="/demande" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "var(--terre)", color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", boxShadow: "0 10px 30px rgba(196,83,26,.22)" }}>
              Démarrer ma demande
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div style={{ marginTop: 20, fontSize: 11, color: "var(--pierre)", textAlign: "center", lineHeight: 1.5 }}>
            Prix HT indicatifs 2026 · Fourchettes basées sur les déclarations de nos artisans vérifiés et les moyennes marché Rhône-Alpes (sources : INSEE BT, FFB, Hemea, OpenBTP).<br />
            Prix fermes et définitifs établis après devis personnalisé.
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
