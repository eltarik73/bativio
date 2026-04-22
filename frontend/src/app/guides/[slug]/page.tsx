import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { safeJsonLd } from "@/lib/html-escape";

interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  updatedAt: string;
  sections: { h: string; p: string }[];
  relatedGuides?: string[];
  cta?: { label: string; href: string };
}

const GUIDES: Record<string, Guide> = {
  "trouver-bon-artisan": {
    slug: "trouver-bon-artisan",
    title: "Comment trouver un bon artisan en Rhône-Alpes en 2026",
    metaTitle: "Trouver un bon artisan en Rhône-Alpes — Guide complet 2026",
    description: "8 critères pour identifier un artisan sérieux : SIRET, assurance décennale, avis vérifiés, certifications RGE, devis détaillé, délai, garantie. Exemples concrets Chambéry/Annecy/Lyon.",
    updatedAt: "2026-04-22",
    sections: [
      { h: "1. Vérifier le SIRET à l'INSEE", p: "Tout artisan pro a un numéro SIRET à 14 chiffres (9 SIREN + 5 NIC établissement). Saisissez-le sur recherche-entreprises.api.gouv.fr : vous voyez la raison sociale, l'activité (code NAF), l'état (actif/cessé), la date de création. Méfiez-vous des entreprises créées il y a moins de 6 mois — elles n'ont pas encore de réputation. Sur Bativio, le SIRET est vérifié automatiquement à l'inscription." },
      { h: "2. Demander l'attestation d'assurance décennale", p: "Obligatoire pour tous travaux liés au gros œuvre, au clos-couvert, ou aux équipements indissociables. L'assurance décennale couvre 10 ans les défauts qui compromettent la solidité ou rendent inhabitable le bâtiment. Demandez l'attestation AVANT signature du devis (elle doit couvrir l'année en cours et le métier concerné). Sans assurance, vous ne pourrez pas être indemnisé en cas de sinistre." },
      { h: "3. Checker les certifications RGE / Qualibat / Qualifelec", p: "RGE (Reconnu Garant de l'Environnement) = condition obligatoire pour MaPrimeRénov', éco-PTZ, TVA réduite 5,5%. Qualibat = qualité structure/gros œuvre. Qualifelec = électriciens qualifiés. Ces certifications coûtent à l'artisan, elles sont un signal de sérieux. Vérifiez sur france-renov.gouv.fr ou qualibat.com." },
      { h: "4. Lire les avis clients vérifiés", p: "Méfiez-vous des avis 5 étoiles trop parfaits. Les vrais avis mélangent 4-5 étoiles avec quelques 3 étoiles. Lisez les commentaires, pas juste la note. Sur Bativio, les avis sont collectés post-chantier auprès de clients réels (pas de faux avis plantés). Sur Google, vérifiez que l'artisan a au moins 20 avis étalés sur 2+ ans." },
      { h: "5. Comparer 3 devis pour le même projet", p: "Règle d'or : jamais un seul devis. Demandez 3 devis écrits avec le même cahier des charges (surface, matériaux, finitions). Comparez : prix TTC avec détail TVA, délai intervention, durée chantier, marques matériaux, pénalités de retard, acomptes. Un devis 30% moins cher = suspect (matériaux bas de gamme, travail au noir, sous-estimation volontaire)." },
      { h: "6. Vérifier l'ancienneté et la zone d'intervention", p: "Un artisan qui existe depuis 10+ ans a prouvé sa stabilité. Préférez un artisan local (< 30 km) : meilleure réactivité, meilleure connaissance du contexte (matériaux, fournisseurs, spécificités climatiques). Un plombier basé à 1h30 de route = risque de délais de SAV énormes." },
      { h: "7. Exiger un devis détaillé (pas une estimation)", p: "Un vrai devis comporte : nom et SIRET de l'artisan, numéro TVA intracommunautaire, adresse chantier, nature précise des travaux (avec quantités, surfaces), matériaux (marque, référence), main d'œuvre détaillée (nombre d'heures), prix HT + TVA + TTC, délai d'exécution, date de validité, conditions de paiement. Si le devis tient sur 1/2 page, refusez." },
      { h: "8. Privilégier un artisan qui vous pose des questions", p: "Un bon artisan avant de chiffrer vous pose 10+ questions : état du support, niveau d'humidité, contraintes d'accès (étage, parking), horaires autorisés par la copro, attentes esthétiques. Un artisan qui donne un prix en 30 secondes sans question = soit il sous-estime, soit il ne sait pas chiffrer correctement." },
    ],
    relatedGuides: ["prix-renovation-salle-bain", "maprimerenov-demarches"],
    cta: { label: "Voir les artisans de ma ville", href: "/" },
  },
  "prix-renovation-salle-bain": {
    slug: "prix-renovation-salle-bain",
    title: "Prix d'une rénovation de salle de bain 2026",
    metaTitle: "Rénovation salle de bain : prix 2026 (6m², 10m², avec douche italienne)",
    description: "Fourchettes détaillées par surface et niveau de gamme. Plomberie, carrelage, sanitaires, électricité. Exemples chiffrés Rhône-Alpes avec ou sans douche italienne.",
    updatedAt: "2026-04-22",
    sections: [
      { h: "Prix moyen d'une rénovation complète salle de bain (2026)", p: "Pour une salle de bain de 6m² à Rhône-Alpes, comptez entre 7 500 € et 18 000 € TTC. La variation dépend du niveau de gamme (entrée 1 250 €/m², milieu de gamme 2 000 €/m², premium 3 000 €/m²+). Ces prix incluent plomberie, carrelage, sanitaires, électricité et main d'œuvre. La TVA est à 10% (rénovation > 2 ans) ou 5,5% (rénovation énergétique RGE)." },
      { h: "Détail poste par poste (salle de bain 6m²)", p: "Dépose de l'existant : 500-1200 €. Plomberie (tuyaux cuivre + évacuations) : 1 500-3 000 €. Électricité (4 prises + luminaires + VMC) : 600-1 200 €. Carrelage sol + mur (25m² total) : 2 000-5 000 €. Douche italienne (receveur extra-plat + paroi + robinetterie) : 1 500-3 500 €. WC suspendu : 600-1 400 €. Meuble vasque + miroir : 500-2 500 €. Main d'œuvre posée : ~30% du total matériaux." },
      { h: "Douche italienne vs baignoire : impact prix", p: "Une douche italienne coûte en moyenne 500 à 1 500 € DE PLUS qu'une douche classique avec receveur haut, car elle nécessite : chape à la pente, étanchéité renforcée (SPEC), siphon de sol, parfois surélévation du sol attenant. À l'inverse, supprimer une baignoire pour une douche peut faire gagner de l'espace (800-1 200 € de dépose + évacuations)." },
      { h: "Matériaux : où mettre le budget", p: "Le grès cérame pleine masse (40-80 €/m²) vieillit mieux que le grès émaillé (20-40 €/m²). Une robinetterie Grohe ou Hansgrohe (150-400 €) dure 20+ ans contre 5-10 ans pour une robinetterie bas de gamme (40-80 €). Un receveur extra-plat résine (400-800 €) est plus solide qu'un receveur acrylique (150-300 €). Économisez sur la faïence, pas sur la plomberie." },
      { h: "Aides financières 2026", p: "Pour un changement de chauffe-eau solaire ou thermodynamique dans le cadre d'une rénovation, vous pouvez cumuler MaPrimeRénov' (jusqu'à 4 000 € ménages très modestes), les CEE (100-500 €), l'éco-PTZ (jusqu'à 15 000 € sans intérêts), et la TVA réduite à 5,5%. Pour une rénovation esthétique pure (pas de geste énergétique), les aides se limitent à la TVA 10%." },
      { h: "Délai et durée du chantier", p: "Comptez 2 à 4 semaines de travaux en continu pour une salle de bain 6m² complète, incluant les temps de séchage chape/enduit/joints. Ajoutez 3-8 semaines pour la commande de matériaux (surtout carrelage import). Au total, prévoyez 2-3 mois entre signature du devis et fin du chantier. En urgence, certains artisans peuvent réduire à 10 jours (coût +15-20%)." },
    ],
    relatedGuides: ["trouver-bon-artisan", "maprimerenov-demarches"],
    cta: { label: "Demander 3 devis gratuits", href: "/demande" },
  },
  "maprimerenov-demarches": {
    slug: "maprimerenov-demarches",
    title: "MaPrimeRénov' 2026 : démarches et astuces",
    metaTitle: "MaPrimeRénov' 2026 : 7 étapes pour demander votre aide (démarches, délais)",
    description: "Guide complet pour demander MaPrimeRénov' en 2026 : éligibilité, DPE, devis, dépôt de dossier en ligne, travaux, paiement, contrôle. Astuces pour maximiser l'aide.",
    updatedAt: "2026-04-22",
    sections: [
      { h: "1. Vérifier l'éligibilité du logement et des travaux", p: "MaPrimeRénov' concerne les logements de plus de 15 ans, résidence principale ou locatif (sous conditions). Les travaux éligibles : isolation (combles, murs, planchers), chauffage (pompe à chaleur, chaudière biomasse, poêle), ventilation double flux, chauffe-eau solaire, fenêtres (bouquet uniquement depuis 2024). Pas éligibles : gestes isolés peu performants, climatiseurs seuls, panneaux photovoltaïques." },
      { h: "2. Faire réaliser un DPE (Diagnostic de Performance Énergétique)", p: "Obligatoire depuis 2024 pour les gestes d'ampleur (plusieurs travaux combinés). Coût : 100-250 € (souvent gratuit si inclus dans l'accompagnement Mon Accompagnateur Rénov'). Le DPE classe votre logement de A à G selon sa consommation énergétique. Les logements F et G (passoires thermiques) bénéficient d'aides majorées." },
      { h: "3. Calculer son profil (Bleu/Jaune/Violet/Rose)", p: "Les 4 catégories dépendent du revenu fiscal de référence et de la composition du ménage. Bleu = très modestes (aides maxi). Jaune = modestes. Violet = intermédiaires. Rose = aisés (aides limitées aux gestes d'ampleur). Simulation officielle : france-renov.gouv.fr/aides/simulateur. Pour un couple en Rhône-Alpes (2 enfants), le seuil Violet/Rose est autour de 80 000 € de RFR." },
      { h: "4. Choisir un artisan RGE et récupérer son devis", p: "OBLIGATOIRE : l'artisan doit avoir la certification RGE dans le métier concerné (RGE Qualibat, Qualit'ENR, Qualibois, etc.). Vérifiez sa validité sur france-renov.gouv.fr. Le devis doit détailler précisément les travaux, les matériaux, les performances (résistance thermique R pour isolation, SCOP pour pompe à chaleur). Conservez le devis signé pour le dossier." },
      { h: "5. Déposer le dossier en ligne AVANT travaux", p: "Attention : la demande MaPrimeRénov' doit être déposée sur maprimerenov.gouv.fr AVANT le début des travaux. Documents requis : devis signé, avis d'imposition, RIB, photo de la façade (pour ITE). Délai d'instruction : 15 jours à 2 mois selon profondeur du dossier. Vous recevez un accord de principe avec le montant définitif de l'aide." },
      { h: "6. Réaliser les travaux + conserver les factures", p: "Les travaux doivent commencer dans les 8 mois après acceptation et être finis dans les 3 ans. Conservez scrupuleusement toutes les factures (l'ANAH peut les demander). Pour les gestes d'ampleur, Mon Accompagnateur Rénov' peut superviser le chantier (obligatoire pour les bouquets depuis 2024)." },
      { h: "7. Demander le paiement après travaux", p: "Une fois les travaux terminés, connectez-vous sur maprimerenov.gouv.fr, uploadez la facture finale signée par vous et l'artisan. Le paiement est effectué sous 15 jours à 2 mois sur votre compte bancaire (ou directement à l'artisan si vous avez demandé l'avance de 70% pour les ménages modestes)." },
      { h: "Astuce : cumuler avec les CEE et l'éco-PTZ", p: "MaPrimeRénov' est cumulable avec les Certificats d'Économies d'Énergie (100-1 500 €) versés par votre fournisseur d'énergie, l'éco-PTZ (prêt à taux zéro jusqu'à 50 000 € sur 20 ans), et les aides locales (Région AuRA, département, commune). Non cumulable avec le crédit d'impôt CITE (supprimé en 2020)." },
    ],
    relatedGuides: ["trouver-bon-artisan", "prix-renovation-salle-bain"],
    cta: { label: "Trouver un artisan RGE", href: "/maprimerenov" },
  },
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = GUIDES[slug];
  if (!g) notFound();
  return {
    title: g.metaTitle,
    description: g.description,
    alternates: { canonical: `https://www.bativio.fr/guides/${slug}` },
    openGraph: {
      title: g.metaTitle,
      description: g.description,
      url: `https://www.bativio.fr/guides/${slug}`,
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = GUIDES[slug];
  if (!g) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    datePublished: "2026-04-01",
    dateModified: g.updatedAt,
    author: { "@type": "Organization", name: "Bativio" },
    publisher: { "@type": "Organization", name: "Bativio", logo: { "@type": "ImageObject", url: "https://www.bativio.fr/icons/icon-192.png" } },
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--creme,#FAF8F5)", paddingBottom: 80 }}>
        <article style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px" }}>
          <nav style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginBottom: 16 }}>
            <Link href="/" style={{ color: "var(--pierre,#9C958D)", textDecoration: "none" }}>Accueil</Link>
            <span style={{ margin: "0 6px" }}>/</span>
            <span>Guide</span>
          </nav>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, lineHeight: 1.15, color: "var(--anthracite,#1C1C1E)", marginBottom: 18 }}>
            {g.title}
          </h1>
          <p style={{ fontSize: 12, color: "var(--pierre,#9C958D)", marginBottom: 32 }}>
            Mis à jour le {new Date(g.updatedAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })} · Lecture ~{Math.ceil(g.sections.reduce((acc, s) => acc + s.p.length, 0) / 1000)} min
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {g.sections.map((s, i) => (
              <section key={i}>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 10, lineHeight: 1.25 }}>
                  {s.h}
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--bois-mid,#5C4A3A)" }}>
                  {s.p}
                </p>
              </section>
            ))}
          </div>

          {g.cta && (
            <div style={{ marginTop: 40, padding: "24px 28px", background: "var(--anthracite,#1C1C1E)", borderRadius: 16, textAlign: "center" }}>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.8)", marginBottom: 16 }}>
                Prêt à passer à l&apos;action ?
              </p>
              <Link href={g.cta.href} style={{ display: "inline-block", padding: "12px 26px", background: "var(--terre,#C4531A)", color: "#fff", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                {g.cta.label} →
              </Link>
            </div>
          )}

          {g.relatedGuides && g.relatedGuides.length > 0 && (
            <div style={{ marginTop: 40, borderTop: "1px solid var(--sable,#E8D5C0)", paddingTop: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                Articles liés
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {g.relatedGuides.map((s) => {
                  const rg = GUIDES[s];
                  if (!rg) return null;
                  return (
                    <Link key={s} href={`/guides/${s}`} style={{ fontSize: 15, color: "var(--terre,#C4531A)", textDecoration: "none", fontWeight: 500 }}>
                      → {rg.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLd) }} />
    </>
  );
}
