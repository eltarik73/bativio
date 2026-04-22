import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { safeJsonLd } from "@/lib/html-escape";

export const metadata: Metadata = {
  title: "Questions fréquentes — Comment fonctionne Bativio",
  description:
    "Toutes les réponses aux questions des particuliers et artisans : comment trouver un artisan, comparaison des devis, tarifs, garantie, assurance, RGE, facturation électronique 2026.",
  alternates: { canonical: "https://www.bativio.fr/faq" },
  openGraph: {
    title: "FAQ Bativio — Questions fréquentes",
    description: "Particuliers + artisans : toutes vos réponses.",
    url: "https://www.bativio.fr/faq",
  },
};

interface QA {
  q: string;
  a: string;
}

const PARTICULIERS: QA[] = [
  {
    q: "Comment trouver un artisan sur Bativio ?",
    a: "Consultez l'annuaire par ville (Chambéry, Annecy, Grenoble, Lyon, Valence) ou utilisez notre assistant IA qui vous pose 5 à 7 questions ciblées sur votre projet et vous estime le prix instantanément. Les artisans sélectionnés vous recontactent ensuite sous 24h.",
  },
  {
    q: "Combien coûte une demande de devis ?",
    a: "C'est gratuit, sans carte bancaire et sans engagement. Vous pouvez demander autant de devis que vous voulez. Bativio ne prend aucune commission sur les travaux.",
  },
  {
    q: "Les artisans sont-ils vérifiés ?",
    a: "Oui. Chaque artisan est vérifié à l'inscription : SIRET contrôlé via l'INSEE, code NAF BTP validé, assurance décennale demandée, certifications RGE/Qualibat/Qualifelec affichées quand disponibles. Les avis sont collectés uniquement post-chantier auprès de clients réels.",
  },
  {
    q: "Puis-je utiliser MaPrimeRénov' avec les artisans Bativio ?",
    a: "Oui, pour les travaux éligibles, l'artisan doit être certifié RGE (Reconnu Garant de l'Environnement). Filtrez les profils avec le badge RGE affiché sur leur fiche. MaPrimeRénov' concerne l'isolation, le chauffage (pompe à chaleur, chaudière biomasse), la ventilation double flux, le remplacement des fenêtres.",
  },
  {
    q: "Comment comparer plusieurs devis ?",
    a: "Pour un même projet, demandez 3 devis auprès d'artisans différents. Comparez : prix TTC avec détail TVA (5,5 % rénov énergétique RGE / 10 % rénov habitation / 20 % neuf), délai d'intervention, durée des travaux, garantie décennale active, matériaux proposés (marques, références). Méfiez-vous des devis trop bas (peut signaler matériaux bas de gamme ou travail au noir).",
  },
  {
    q: "Que faire si un artisan ne répond pas ou ne tient pas son engagement ?",
    a: "Contactez-nous à contact@bativio.fr pour signaler un artisan défaillant. Nous enquêtons systématiquement et pouvons désactiver un profil. Si un contrat signé n'est pas respecté, vous pouvez saisir la conciliation de consommation (gratuite en ligne) ou le tribunal judiciaire.",
  },
  {
    q: "Bativio propose-t-il une garantie ou une assurance ?",
    a: "Bativio met en relation mais n'est pas partie prenante au contrat de travaux. Chaque artisan est tenu d'avoir son assurance décennale (obligatoire) et son assurance responsabilité civile. Vérifiez toujours l'attestation avant signature du devis.",
  },
  {
    q: "À quelles villes Bativio s'adresse-t-il ?",
    a: "Actuellement Chambéry, Annecy, Grenoble, Lyon et Valence, avec une extension progressive à toute la région Auvergne-Rhône-Alpes. Notre objectif est de rester hyper-local pour garantir la qualité du réseau d'artisans.",
  },
];

const ARTISANS: QA[] = [
  {
    q: "Combien coûte un abonnement Bativio ?",
    a: "Plan Gratuit (0 €/mois) : fiche annuaire, 3 photos, 2 badges, formulaire de devis. Starter 19 €/mois : facturation électronique, CRM basique, 5 photos. Pro 39 €/mois : vitrine personnalisée, devis illimités, agenda, messagerie. Business 59 €/mois : devis IA, SEO premium, API, multi-utilisateurs. Aucun engagement, résiliation en un clic.",
  },
  {
    q: "Qui peut s'inscrire sur Bativio ?",
    a: "Les artisans du bâtiment avec un SIRET actif dans les divisions NAF BTP : 41 (construction de bâtiments), 42 (génie civil), 43 (travaux spécialisés : plomberie, électricité, peinture, carrelage, maçonnerie, menuiserie, couverture, chauffage). Les demandes avec un code NAF hors BTP passent en validation admin manuelle.",
  },
  {
    q: "Combien de temps pour être visible dans l'annuaire ?",
    a: "Environ 3 minutes pour créer votre compte (SIRET, infos, métier, zone, photos). Votre fiche devient visible dès que votre profil est complété à 50 % (nom, métier, ville, téléphone, description courte, 1 photo minimum). Pour un référencement premium, visez 100 % de complétion.",
  },
  {
    q: "Les demandes de devis sont-elles partagées avec d'autres artisans ?",
    a: "Non, contrairement aux plateformes type Habitatpresto ou Star of Service. Chez Bativio, le particulier choisit lui-même l'artisan qu'il contacte. Une demande ciblée = 1 seul artisan destinataire, pas 5 en concurrence.",
  },
  {
    q: "La facturation électronique 2026 est-elle gérée ?",
    a: "Oui, Bativio est intégré à Invoquo, plateforme agréée par la DGFiP (réforme PA de septembre 2026). Les plans Starter, Pro et Business incluent la réception et l'émission de factures électroniques au format Factur-X. Le Plan Gratuit permet de recevoir jusqu'à 5 factures par mois.",
  },
  {
    q: "Comment fonctionne l'IA pour les devis ?",
    a: "Sur le plan Business, notre assistant IA qualifie votre demande client via un questionnaire ultra-précis spécifique au métier (plombier, électricien, peintre, etc.), puis génère automatiquement une fourchette de prix à ± 10 % que vous pouvez éditer avant envoi. Vous gagnez ~20 minutes par devis.",
  },
  {
    q: "Puis-je personnaliser ma vitrine publique ?",
    a: "Oui, dès le plan Pro : 4 templates (Classique, Moderne, Portfolio, Vitrine), couleurs personnalisables, photos avant/après, témoignages clients, zones d'intervention, horaires. Le plan Business débloque la vitrine white-label (URL personnalisée sans mention Bativio).",
  },
  {
    q: "Y a-t-il une commission sur les chantiers ?",
    a: "Zéro commission. Les travaux sont facturés directement par l'artisan au client. Bativio facture uniquement l'abonnement mensuel fixe, sans pourcentage sur votre chiffre d'affaires.",
  },
];

const ALL_QA: QA[] = [...PARTICULIERS, ...ARTISANS];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL_QA.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.a,
      },
    })),
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--creme,#FAF8F5)", paddingBottom: 80 }}>
        <section style={{ background: "var(--bois,#3D2E1F)", padding: "56px 32px 48px", color: "#fff", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: "var(--argile,#D4956B)", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>FAQ</p>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, lineHeight: 1.12, marginBottom: 16 }}>
              Questions fréquentes
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.78)", lineHeight: 1.55, maxWidth: 560, margin: "0 auto" }}>
              Tout ce que particuliers et artisans doivent savoir sur Bativio.
            </p>
          </div>
        </section>

        <section style={{ maxWidth: 880, margin: "0 auto", padding: "48px 24px" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 24 }}>
            Pour les particuliers
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
            {PARTICULIERS.map((qa, i) => (
              <details key={i} style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 14, padding: "20px 22px" }}>
                <summary style={{ fontSize: 16, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", cursor: "pointer", listStyle: "none" }}>
                  {qa.q}
                </summary>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--bois-mid,#5C4A3A)", marginTop: 14 }}>{qa.a}</p>
              </details>
            ))}
          </div>

          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 24 }}>
            Pour les artisans
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
            {ARTISANS.map((qa, i) => (
              <details key={i} style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 14, padding: "20px 22px" }}>
                <summary style={{ fontSize: 16, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", cursor: "pointer", listStyle: "none" }}>
                  {qa.q}
                </summary>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--bois-mid,#5C4A3A)", marginTop: 14 }}>{qa.a}</p>
              </details>
            ))}
          </div>

          <div style={{ background: "var(--anthracite,#1C1C1E)", borderRadius: 16, padding: "32px 28px", color: "#fff", textAlign: "center" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.55)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              Vous ne trouvez pas votre réponse ?
            </p>
            <p style={{ fontSize: 17, marginBottom: 22, fontFamily: "'Fraunces',serif", fontStyle: "italic" }}>
              On vous rappelle. Sans pression, sans engagement.
            </p>
            <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <a href="tel:+33479000000" style={{ padding: "12px 24px", background: "var(--terre,#C4531A)", color: "#fff", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                04 79 00 00 00
              </a>
              <a href="mailto:contact@bativio.fr" style={{ padding: "12px 24px", background: "transparent", color: "#fff", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,.2)" }}>
                contact@bativio.fr
              </a>
              <Link href="/inscription" style={{ padding: "12px 24px", background: "var(--mousse,#4A6741)", color: "#fff", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                Créer mon espace
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
    </>
  );
}
