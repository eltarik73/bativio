/**
 * Comparatif detaille des Plateformes Agreees orientees artisans BTP.
 *
 * Cible SEO : "comparatif plateforme agreee", "meilleure PA artisan",
 * "Pennylane vs Bativio", "Azopio Bativio comparatif", "PA pas chere artisan".
 */
import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 604800; // 7 jours

export const metadata: Metadata = {
  title: "Comparatif plateformes agréées 2026 pour artisans BTP",
  description: "Tableau comparatif des plateformes agréées : prix, fonctionnalités, intégration BTP, support. Le seul comparatif PA orienté artisans du bâtiment.",
  keywords: "comparatif plateforme agreee, comparatif PA, Pennylane, Dougs, Azopio, Sequino, IOPOLE, Tiime, EBP, Bativio, choisir PA artisan, meilleure PA BTP",
  alternates: { canonical: "https://www.bativio.fr/pro/comparatif-pa" },
  openGraph: {
    title: "Comparatif plateformes agréées 2026 — Artisans BTP | Bativio",
    description: "9 PA évaluées : prix, fonctionnalités, intégration BTP, support. Comparatif transparent par Bativio.",
    url: "https://www.bativio.fr/pro/comparatif-pa",
    type: "article",
    locale: "fr_FR",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Comparatif PA 2026" }],
  },
  twitter: { card: "summary_large_image", title: "Comparatif PA artisans 2026", description: "9 plateformes évaluées." },
};

interface PA {
  id: string;
  name: string;
  price: string;
  bestFor: string;
  btpFriendly: "OUI native" | "OUI" | "Limité" | "Non" | "n/a";
  integration: "OUI tout-en-un" | "Standalone" | "Backend (B2B2B)";
  supportFR: "OUI" | "Limité";
  immatriculation: string;
  rating: number; // /5
  pros: string[];
  cons: string[];
  verdict: string;
}

const PAS: PA[] = [
  {
    id: "bativio-invoquo",
    name: "Bativio + Invoquo",
    price: "19-59 €/mois",
    bestFor: "Artisans BTP TPE/PME",
    btpFriendly: "OUI native",
    integration: "OUI tout-en-un",
    supportFR: "OUI",
    immatriculation: "Sous réserve (via Invoquo)",
    rating: 4.5,
    pros: [
      "Tout-en-un : devis, factures, planning, CRM, vitrine SEO",
      "Multi-TVA (5,5/10/20 %) et auto-liquidation natifs",
      "Support FR, équipe basée à Chambéry (Savoie)",
      "Tarif transparent dès 19 €/mois",
      "Annuaire SEO local intégré (acquisition de clients)",
    ],
    cons: [
      "Pas une PA en direct (opère via Invoquo, qui s'appuie elle-même sur des PA agréées en backend)",
      "Cible spécifique BTP : non adapté aux secteurs hors bâtiment",
      "Encore récent : moins d'historique que Pennylane ou EBP",
    ],
    verdict: "Le meilleur rapport qualité/prix pour un artisan BTP en 2026 qui veut une solution clé en main sans expert-comptable.",
  },
  {
    id: "pennylane",
    name: "Pennylane",
    price: "30-60 €/mois",
    bestFor: "TPE/PME généraliste avec expert-comptable",
    btpFriendly: "Limité",
    integration: "Standalone",
    supportFR: "OUI",
    immatriculation: "Définitive",
    rating: 4.0,
    pros: [
      "Leader français, immatriculation définitive PA",
      "Très puissant comptablement (rapprochement bancaire, écritures)",
      "Excellente intégration avec experts-comptables",
      "Application mobile soignée",
    ],
    cons: [
      "Pas de templates BTP natifs (multi-TVA et sous-traitance à configurer manuellement)",
      "Plus cher que les solutions spécialisées artisans",
      "Pas de fonctionnalité acquisition de clients (annuaire, vitrine)",
      "Courbe d'apprentissage importante pour un artisan sans comptable",
    ],
    verdict: "Excellent si vous travaillez avec un cabinet d'expertise comptable. Surdimensionné pour un artisan TPE qui veut juste émettre des factures.",
  },
  {
    id: "dougs",
    name: "Dougs",
    price: "49-99 €/mois",
    bestFor: "TPE avec service compta intégré",
    btpFriendly: "Limité",
    integration: "Standalone",
    supportFR: "OUI",
    immatriculation: "Définitive",
    rating: 3.8,
    pros: [
      "PA + comptable digital intégré (forfait tout compris)",
      "Bon pour les TPE qui veulent déléguer la compta",
      "Tableau de bord financier clair",
    ],
    cons: [
      "Tarif élevé pour un artisan qui n'a pas besoin de service compta complet",
      "Pas spécialisé BTP",
      "Engagement annuel sur la formule comptable",
      "Pas d'annuaire SEO local",
    ],
    verdict: "Pertinent pour une TPE de 1-3 salariés qui veut déléguer 100 % la compta. Cher pour un artisan auto-entrepreneur.",
  },
  {
    id: "docaposte",
    name: "Docaposte / SERES",
    price: "Sur devis",
    bestFor: "Grand compte, B2G",
    btpFriendly: "Non",
    integration: "Standalone",
    supportFR: "OUI",
    immatriculation: "Définitive",
    rating: 3.5,
    pros: [
      "Acteur historique de la dématérialisation (groupe La Poste)",
      "Solidité opérationnelle et conformité réglementaire éprouvée",
      "Adapté aux grands comptes et marchés publics (B2G)",
    ],
    cons: [
      "Tarif sur devis (pas adapté aux TPE)",
      "Onboarding lourd",
      "Pas spécialisé BTP",
      "Trop puissant pour un artisan",
    ],
    verdict: "Pour entreprises de 50+ salariés ou marchés publics. Pas adapté aux artisans.",
  },
  {
    id: "azopio",
    name: "Azopio",
    price: "~30 €/mois",
    bestFor: "BTP, TP, PME bâtiment",
    btpFriendly: "OUI",
    integration: "Standalone",
    supportFR: "OUI",
    immatriculation: "Définitive",
    rating: 4.2,
    pros: [
      "Spécialisé BTP/TP : multi-TVA, sous-traitance, situations de travaux",
      "Immatriculation PA définitive",
      "Bonne intégration cabinet comptable",
      "Communauté BTP active",
    ],
    cons: [
      "Pas d'annuaire SEO local (vous ne gagnez pas de clients)",
      "Pas de vitrine artisan",
      "UX moins moderne que Pennylane ou Bativio",
    ],
    verdict: "Notre concurrent direct. Solide pour la facturation BTP pure. Bativio se distingue par le volet acquisition (annuaire SEO).",
  },
  {
    id: "sequino",
    name: "Sequino",
    price: "Backend (B2B2B)",
    bestFor: "Editeurs SaaS, plateformes",
    btpFriendly: "n/a",
    integration: "Backend (B2B2B)",
    supportFR: "OUI",
    immatriculation: "Définitive",
    rating: 3.0,
    pros: [
      "PA backend white-label utilisée par plusieurs SaaS français",
      "API moderne et bien documentée",
    ],
    cons: [
      "Pas accessible directement aux artisans (B2B2B)",
      "Vous l'utilisez sans le savoir si votre logiciel est connecté",
    ],
    verdict: "Vous ne l'utilisez pas en direct. Si votre logiciel devis-facture (par ex. Bativio via Invoquo, ou un autre SaaS) s'appuie sur Sequino, c'est transparent.",
  },
  {
    id: "iopole",
    name: "IOPOLE",
    price: "Backend (B2B2B)",
    bestFor: "Editeurs SaaS",
    btpFriendly: "n/a",
    integration: "Backend (B2B2B)",
    supportFR: "OUI",
    immatriculation: "Définitive",
    rating: 3.0,
    pros: [
      "PA backend solide utilisée par plusieurs éditeurs",
      "Conformité technique éprouvée",
    ],
    cons: [
      "Pas accessible directement aux artisans",
    ],
    verdict: "Vous ne l'utilisez pas en direct. Plateforme backend technique pour SaaS facturation.",
  },
  {
    id: "tiime",
    name: "Tiime",
    price: "29-79 €/mois",
    bestFor: "TPE en lien avec un expert-comptable",
    btpFriendly: "Limité",
    integration: "Standalone",
    supportFR: "OUI",
    immatriculation: "Définitive",
    rating: 3.7,
    pros: [
      "Modèle 'client base partagée' avec expert-comptable",
      "App mobile pour scan justificatifs",
      "Bon support",
    ],
    cons: [
      "Cible principalement TPE de services (pas BTP)",
      "Tarif élevé pour un artisan auto-entrepreneur",
      "Pas d'annuaire SEO",
    ],
    verdict: "Bien pour une TPE de services. Pas optimal pour un artisan BTP qui veut aussi gagner des clients.",
  },
  {
    id: "ebp",
    name: "EBP",
    price: "50-200 €/mois",
    bestFor: "PME établies, secteurs variés",
    btpFriendly: "OUI",
    integration: "Standalone",
    supportFR: "OUI",
    immatriculation: "Définitive",
    rating: 3.6,
    pros: [
      "Acteur historique du logiciel comptable français",
      "Module BTP disponible (devis, situations, retenue)",
      "Compatibilité ERP gros volume",
    ],
    cons: [
      "Tarif élevé (50-200 €/mois selon modules)",
      "UX datée (logiciel desktop d'origine)",
      "Onboarding long et formation requise",
      "Pas de vitrine SEO",
    ],
    verdict: "Pertinent pour une PME BTP de 5-20 salariés déjà équipée EBP. Surdimensionné pour un artisan TPE.",
  },
];

const FAQ = [
  { q: "Quelle PA recommandez-vous pour un artisan auto-entrepreneur ?", a: "Bativio (plan Gratuit puis Starter à 19 €/mois) reste le plus adapté : tout-en-un, BTP-friendly, sans engagement. Si vous travaillez déjà avec un cabinet comptable, Pennylane (30-60 €) ou Dougs (49-99 €) sont des alternatives solides mais plus chères et non spécialisées BTP." },
  { q: "Bativio est-il vraiment une plateforme agréée ?", a: "Bativio n'est PAS directement immatriculé comme PA par la DGFiP. Nous opérons via notre partenaire Invoquo (PA en cours d'immatriculation définitive), qui lui-même s'appuie sur des PA backend agréées (typiquement Sequino ou IOPOLE). Pour vous, c'est transparent : vous saisissez vos factures dans Bativio, elles sont émises et reçues conformément." },
  { q: "Quelle est la PA la moins chère pour démarrer ?", a: "Le PPF (Portail Public de Facturation) géré par l'AIFE est gratuit mais sans valeur ajoutée (pas de suivi de cycle de vie, pas d'intégration logiciel devis). Pour une vraie solution opérationnelle, Bativio Starter à 19 €/mois est le meilleur point d'entrée payant." },
  { q: "Comment sont notées les PA dans ce comparatif ?", a: "Notre note /5 combine 5 critères : (1) intégration logiciel devis-facture, (2) coût total mensuel, (3) spécificités BTP natives, (4) qualité du support FR, (5) pérennité (immatriculation définitive vs sous réserve). La note est subjective et orientée artisans BTP." },
  { q: "Le statut 'sous réserve' est-il problématique ?", a: "Non. La grande majorité des PA actuelles sont immatriculées 'sous réserve' jusqu'à la bascule de septembre 2026. Le statut 'définitif' sera attribué après vérification opérationnelle en conditions réelles. Une PA sous réserve peut être utilisée légalement pendant la période transitoire." },
  { q: "Pourquoi Bativio se compare-t-il aux concurrents directement ?", a: "Par transparence. Nous pensons qu'un comparatif honnête (avec nos points faibles explicités) est plus utile à un artisan qu'un comparatif partial. Si Pennylane ou Azopio convient mieux à votre profil, choisissez-les sans hésiter. Notre force est sur le créneau artisans BTP avec acquisition de clients SEO local intégrée." },
];

export default function ComparatifPaPage() {
  return (
    <>
      <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "#9C958D", marginBottom: 24 }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link href="/pro" style={{ color: "inherit", textDecoration: "none" }}>Pro</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#3D2E1F" }}>Comparatif PA</span>
      </nav>

      <article style={{ maxWidth: 900, margin: "0 auto" }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.15, marginBottom: 16 }}>
            Comparatif plateformes agr&eacute;&eacute;es 2026 pour artisans du b&acirc;timent
          </h1>
          <p style={{ fontSize: 17, color: "#6B6560", lineHeight: 1.6 }}>
            9 plateformes agr&eacute;&eacute;es &eacute;valu&eacute;es sur 5 crit&egrave;res
            sp&eacute;cifiques aux artisans BTP : prix, sp&eacute;cialisation BTP,
            int&eacute;gration logiciel devis, support FR, p&eacute;rennit&eacute;.
            Comparatif transparent par Bativio.
          </p>
          <div style={{ fontSize: 12, color: "#9C958D", marginTop: 12 }}>
            Mis &agrave; jour le 27 avril 2026 &middot; Lecture 14 min
          </div>
        </header>

        {/* Methodologie */}
        <section style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 8, padding: 20, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>
            M&eacute;thodologie &amp; transparence
          </h2>
          <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 8 }}>
            Nous &eacute;valuons chaque PA sur 5 crit&egrave;res &agrave; pond&eacute;ration &eacute;gale :
            (1) int&eacute;gration logiciel devis-facture, (2) co&ucirc;t total mensuel, (3)
            sp&eacute;cificit&eacute;s BTP natives (multi-TVA, sous-traitance, situations),
            (4) qualit&eacute; du support FR, (5) p&eacute;rennit&eacute; (immatriculation d&eacute;finitive
            vs sous r&eacute;serve, anciennet&eacute; de l&apos;entreprise).
          </p>
          <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 0 }}>
            <strong>Transparence :</strong> Bativio (notre solution) est inclus dans ce comparatif.
            Nous explicitons nos points faibles (pas de PA en direct, op&eacute;re via Invoquo)
            et &eacute;valuons les autres avec la m&ecirc;me grille. Date de derni&egrave;re v&eacute;rification :
            avril 2026.
          </p>
        </section>

        {/* Tableau comparatif */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            Tableau comparatif principal
          </h2>
          <div style={{ overflowX: "auto", marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 800 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #C4531A", background: "#FAF8F5" }}>
                  <th style={{ textAlign: "left", padding: "10px 8px", color: "#1C1C1E" }}>Plateforme</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", color: "#1C1C1E" }}>Prix /mois</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", color: "#1C1C1E" }}>BTP-friendly</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", color: "#1C1C1E" }}>Int&eacute;gration</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", color: "#1C1C1E" }}>Support FR</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", color: "#1C1C1E" }}>Statut PA</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", color: "#1C1C1E" }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {PAS.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #EDEBE7", background: p.id === "bativio-invoquo" ? "rgba(196,83,26,.04)" : "transparent" }}>
                    <td style={{ padding: "10px 8px", fontWeight: 700, color: p.id === "bativio-invoquo" ? "#C4531A" : "#1C1C1E" }}>
                      <a href={`#${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>{p.name}</a>
                    </td>
                    <td style={{ padding: "10px 8px" }}>{p.price}</td>
                    <td style={{ padding: "10px 8px", color: p.btpFriendly === "OUI native" ? "#16a34a" : (p.btpFriendly === "OUI" ? "#16a34a" : (p.btpFriendly === "Limité" ? "#9C958D" : "#9C958D")) }}>
                      {p.btpFriendly}
                    </td>
                    <td style={{ padding: "10px 8px" }}>{p.integration}</td>
                    <td style={{ padding: "10px 8px" }}>{p.supportFR}</td>
                    <td style={{ padding: "10px 8px" }}>{p.immatriculation}</td>
                    <td style={{ padding: "10px 8px", fontWeight: 700 }}>{p.rating} / 5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Analyses individuelles */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            Analyses d&eacute;taill&eacute;es par plateforme
          </h2>
          {PAS.map((p) => (
            <div id={p.id} key={p.id} style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 20, marginBottom: 16, scrollMarginTop: 80 }}>
              <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 19, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>
                {p.name} <span style={{ fontSize: 14, color: "#C4531A", fontWeight: 600 }}>{p.rating}/5</span>
              </h3>
              <p style={{ fontSize: 13, color: "#9C958D", marginBottom: 12 }}>
                {p.price} &middot; {p.bestFor}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Points forts</div>
                  <ul style={{ fontSize: 13, color: "#3D2E1F", lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
                    {p.pros.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#C4531A", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Points faibles</div>
                  <ul style={{ fontSize: 13, color: "#3D2E1F", lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
                    {p.cons.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6, fontStyle: "italic", borderLeft: "3px solid #C4531A", paddingLeft: 12, margin: 0 }}>
                <strong>Verdict :</strong> {p.verdict}
              </p>
            </div>
          ))}
        </section>

        {/* Cas d'usage par profil */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            Quelle PA pour quel profil d&apos;artisan ?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
            <div style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 18 }}>
              <div style={{ fontWeight: 700, color: "#C4531A", marginBottom: 8 }}>Auto-entrepreneur sans comptable</div>
              <p style={{ fontSize: 13, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 8 }}>
                Vous d&eacute;butez, peu de factures, pas de cabinet comptable.
              </p>
              <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.6 }}>
                <strong>Recommandation :</strong> Bativio Gratuit puis Starter (19 &euro;/mois). Ou si pure facturation, le PPF gratuit suffit.
              </p>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 18 }}>
              <div style={{ fontWeight: 700, color: "#C4531A", marginBottom: 8 }}>TPE 1-3 salari&eacute;s avec acquisition clients</div>
              <p style={{ fontSize: 13, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 8 }}>
                Activit&eacute; structur&eacute;e, besoin d&apos;acqu&eacute;rir des clients via web.
              </p>
              <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.6 }}>
                <strong>Recommandation :</strong> Bativio Pro (39 &euro;/mois) avec annuaire SEO et site internet.
              </p>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 18 }}>
              <div style={{ fontWeight: 700, color: "#C4531A", marginBottom: 8 }}>PME 5-20 salari&eacute;s avec sous-traitance</div>
              <p style={{ fontSize: 13, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 8 }}>
                Volume important, multi-TVA et auto-liquidation fr&eacute;quentes.
              </p>
              <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.6 }}>
                <strong>Recommandation :</strong> Bativio Business (59 &euro;/mois) ou Azopio si vous avez d&eacute;j&agrave; un comptable d&eacute;di&eacute;.
              </p>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 18 }}>
              <div style={{ fontWeight: 700, color: "#C4531A", marginBottom: 8 }}>Artisan multi-trades (plusieurs m&eacute;tiers)</div>
              <p style={{ fontSize: 13, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 8 }}>
                Plombier + &eacute;lectricien + chauffagiste, par exemple.
              </p>
              <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.6 }}>
                <strong>Recommandation :</strong> Bativio (catalogue prestations adaptable par m&eacute;tier) ou Azopio. &Eacute;vitez les solutions g&eacute;n&eacute;ralistes mal adapt&eacute;es.
              </p>
            </div>
          </div>
        </section>

        {/* Notre recommandation */}
        <section style={{ background: "linear-gradient(135deg, rgba(196,83,26,.06), rgba(201,148,58,.04))", border: "1px solid rgba(196,83,26,.2)", borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>
            Notre recommandation pour les artisans
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Pour la majorit&eacute; des artisans BTP en Rh&ocirc;ne-Alpes, <strong>Bativio
            (via Invoquo)</strong> est la solution la plus int&eacute;gr&eacute;e et
            &eacute;conomique : annuaire SEO local + devis-facture conforme + facturation
            &eacute;lectronique pour 19 &agrave; 59 &euro;/mois.
          </p>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Si vous &ecirc;tes d&eacute;j&agrave; client de Pennylane, Dougs ou EBP et que &ccedil;a vous va,
            inutile de migrer : tous ces outils seront conformes 2026. Si vous n&apos;avez
            <strong> pas encore d&apos;outil</strong> ou si votre solution actuelle est trop g&eacute;n&eacute;raliste pour le BTP,
            essayez Bativio gratuitement.
          </p>
          <Link href="/inscription" style={{ display: "inline-block", padding: "12px 24px", background: "#C4531A", color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            Tester Bativio gratuitement
          </Link>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            Questions fr&eacute;quentes
          </h2>
          {FAQ.map((f, i) => (
            <div key={i} style={{ borderBottom: "1px solid #EDEBE7", padding: "16px 0" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>{f.q}</h3>
              <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}
        </section>

        <section style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 24, marginTop: 40 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>
            &Agrave; lire aussi
          </h2>
          <ul style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 18 }}>
            <li><Link href="/pro/glossaire" style={{ color: "#C4531A" }}>Glossaire de la facturation &eacute;lectronique</Link></li>
            <li><Link href="/pro/facturation-electronique-2026" style={{ color: "#C4531A" }}>Guide complet de la r&eacute;forme 2026</Link></li>
            <li><Link href="/pro/sanctions-facturation-electronique" style={{ color: "#C4531A" }}>Sanctions facturation &eacute;lectronique</Link></li>
            <li><Link href="/pro/factur-x-artisan" style={{ color: "#C4531A" }}>Factur-X expliqu&eacute; aux artisans</Link></li>
          </ul>
        </section>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Comparatif plateformes agréées 2026 pour artisans du bâtiment",
        description: "9 PA évaluées sur 5 critères BTP : prix, intégration, support, pérennité, spécialisation.",
        author: { "@type": "Organization", name: "Bativio" },
        publisher: { "@type": "Organization", name: "Bativio" },
        datePublished: "2026-04-27",
        dateModified: "2026-04-27",
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.bativio.fr/pro/comparatif-pa" },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.bativio.fr" },
          { "@type": "ListItem", position: 2, name: "Pro", item: "https://www.bativio.fr/pro" },
          { "@type": "ListItem", position: 3, name: "Comparatif PA", item: "https://www.bativio.fr/pro/comparatif-pa" },
        ],
      }) }} />
    </>
  );
}
