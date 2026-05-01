import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentions légales — Bativio",
  description:
    "Éditeur, hébergeur, propriété intellectuelle, données personnelles et cookies du site bativio.fr. Conforme art. 6 LCEN et RGPD.",
  alternates: { canonical: "https://www.bativio.fr/mentions-legales" },
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  const Section = ({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) => (
    <section id={id} style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 14, fontFamily: "'Fraunces',serif" }}>{title}</h2>
      <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.75 }}>{children}</div>
    </section>
  );

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Mentions légales</h1>
        <p style={{ fontSize: 13, color: "#9C958D", marginBottom: 32 }}>Dernière mise à jour&nbsp;: 21 avril 2026</p>

        <Section title="1. Éditeur du site" id="editeur">
          <p style={{ marginBottom: 8 }}><strong>Raison sociale&nbsp;:</strong> KLIKPHONE SAS (exploite la marque « Bativio »)</p>
          <p style={{ marginBottom: 8 }}><strong>Forme juridique&nbsp;:</strong> Société par actions simplifiée</p>
          <p style={{ marginBottom: 8 }}><strong>Siège social&nbsp;:</strong> 79 place Saint-Léger, 73000 Chambéry, France</p>
          <p style={{ marginBottom: 8 }}><strong>SIRET (siège)&nbsp;:</strong> 813 961 141 00013</p>
          <p style={{ marginBottom: 8 }}><strong>SIREN&nbsp;:</strong> 813 961 141</p>
          <p style={{ marginBottom: 8 }}><strong>RCS&nbsp;:</strong> Chambéry 813 961 141</p>
          <p style={{ marginBottom: 8 }}><strong>Téléphone&nbsp;:</strong> <a href="tel:+33479000000" style={{ color: "#C4531A" }}>+33 (0)4 79 00 00 00</a></p>
          <p style={{ marginBottom: 8 }}><strong>Email&nbsp;:</strong> <a href="mailto:contact@bativio.fr" style={{ color: "#C4531A" }}>contact@bativio.fr</a></p>
          <p><strong>Directeur de la publication&nbsp;:</strong> Tarik Boudefar</p>
        </Section>

        <Section title="2. Hébergement" id="hebergement">
          <p style={{ marginBottom: 8 }}>Le site bativio.fr est hébergé par&nbsp;:</p>
          <p style={{ marginBottom: 8 }}><strong>Vercel Inc.</strong></p>
          <p style={{ marginBottom: 8 }}>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
          <p style={{ marginBottom: 8 }}>Téléphone&nbsp;: +1 (650) 285-9676</p>
          <p>Site web&nbsp;: <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: "#C4531A" }}>vercel.com</a></p>
        </Section>

        <Section title="3. Propriété intellectuelle" id="propriete">
          <p>L&apos;ensemble des contenus présents sur le site bativio.fr (textes, images, logos, base de données, code source, design, charte graphique) sont la propriété exclusive de KLIKPHONE SAS (exploite la marque « Bativio ») ou font l&apos;objet d&apos;une autorisation d&apos;utilisation. Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, est interdite sans l&apos;autorisation écrite préalable de KLIKPHONE SAS (exploite la marque « Bativio »), sauf exceptions prévues par la loi (art. L. 122-5 du Code de la propriété intellectuelle).</p>
        </Section>

        <Section title="4. Données personnelles (RGPD)" id="confidentialite">
          <p style={{ marginBottom: 12 }}>Conformément au Règlement Général sur la Protection des Données (UE 2016/679) et à la loi Informatique et Libertés modifiée, vous disposez des droits suivants sur vos données personnelles&nbsp;:</p>
          <ul style={{ marginLeft: 20, marginBottom: 12 }}>
            <li>Droit d&apos;accès, de rectification et d&apos;effacement</li>
            <li>Droit à la limitation et à l&apos;opposition au traitement</li>
            <li>Droit à la portabilité de vos données</li>
            <li>Droit de définir des directives post-mortem</li>
            <li>Droit d&apos;introduire une réclamation auprès de la CNIL</li>
          </ul>
          <p style={{ marginBottom: 12 }}><strong>Délégué à la Protection des Données (DPO)&nbsp;:</strong> Tarik Boudefar — <a href="mailto:dpo@bativio.fr" style={{ color: "#C4531A" }}>dpo@bativio.fr</a></p>
          <p style={{ marginBottom: 12 }}><strong>Finalités du traitement&nbsp;:</strong> mise en relation client/artisan, génération de devis, facturation, support utilisateur, statistiques d&apos;usage anonymes.</p>
          <p style={{ marginBottom: 12 }}><strong>Durée de conservation&nbsp;:</strong> 3 ans après la dernière interaction client (prospect), 10 ans après facturation (obligation comptable art. L. 123-22 Code de commerce).</p>
          <p style={{ marginBottom: 12 }}><strong>Destinataires&nbsp;:</strong> équipe Bativio, artisans destinataires des demandes (uniquement coordonnées de contact), prestataires techniques (Vercel hébergement, Resend emails, Stripe paiements, Cloudinary stockage images) sous accord de traitement RGPD.</p>
          <p>Pour exercer vos droits, contactez <a href="mailto:dpo@bativio.fr" style={{ color: "#C4531A" }}>dpo@bativio.fr</a> en justifiant votre identité. Réponse sous 1 mois (art. 12 RGPD).</p>
        </Section>

        <Section title="5. Cookies" id="cookies">
          <p style={{ marginBottom: 12 }}>Le site bativio.fr utilise uniquement des cookies <strong>techniques strictement nécessaires</strong> au fonctionnement du service&nbsp;:</p>
          <ul style={{ marginLeft: 20, marginBottom: 12 }}>
            <li><code style={{ background: "#F3F4F6", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>bativio-session</code> — JWT d&apos;authentification, durée 7 jours, HttpOnly, Secure, SameSite Lax</li>
          </ul>
          <p style={{ marginBottom: 12 }}>Aucun cookie publicitaire, aucun cookie de mesure d&apos;audience tiers (Google Analytics, Meta Pixel, etc.) n&apos;est déposé. Le site n&apos;utilise pas de profilage marketing.</p>
          <p>Conformément à la délibération CNIL n° 2020-091, les cookies strictement nécessaires sont exemptés de consentement préalable.</p>
        </Section>

        <Section title="6. Médiation de la consommation" id="mediation">
          <p style={{ marginBottom: 12 }}>Conformément à l&apos;article L. 612-1 du Code de la consommation, en cas de litige avec KLIKPHONE SAS (exploite la marque « Bativio ») et après une tentative de résolution amiable, vous pouvez recourir gratuitement au médiateur de la consommation suivant&nbsp;:</p>
          <p style={{ marginBottom: 8 }}><strong>CNPM Médiation Consommation</strong></p>
          <p style={{ marginBottom: 8 }}>27 avenue de la Libération — 42400 Saint-Chamond</p>
          <p>Site web&nbsp;: <a href="https://www.cnpm-mediation-consommation.eu" target="_blank" rel="noopener noreferrer" style={{ color: "#C4531A" }}>cnpm-mediation-consommation.eu</a></p>
          <p style={{ marginTop: 12 }}>Plateforme européenne de règlement en ligne des litiges&nbsp;: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: "#C4531A" }}>ec.europa.eu/consumers/odr</a></p>
        </Section>

        <Section title="7. Loi applicable" id="loi">
          <p>Les présentes mentions légales sont régies par le droit français. Tout litige sera de la compétence des tribunaux de Chambéry, sauf disposition légale impérative contraire.</p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
