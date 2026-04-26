import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Conditions g\u00e9n\u00e9rales d'utilisation \u2014 Bativio",
  description: "CGU de la plateforme Bativio : artisans inscrits, particuliers utilisateurs, mise en relation, responsabilit\u00e9s, tarification.",
  alternates: { canonical: "https://www.bativio.fr/cgu" },
  robots: { index: true, follow: true },
};

export default function CGUPage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, color: "#1C1C1E", marginBottom: 32 }}>Conditions g&eacute;n&eacute;rales d&apos;utilisation</h1>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>1. Objet</h2>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
            Les pr&eacute;sentes CGU r&eacute;gissent l&apos;utilisation de la plateforme Bativio, un service de mise en relation entre artisans du b&acirc;timent et particuliers en Rh&ocirc;ne-Alpes.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>2. Acc&egrave;s au service</h2>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
            L&apos;acc&egrave;s &agrave; la plateforme est gratuit pour les particuliers. Les artisans acc&egrave;dent aux fonctionnalit&eacute;s selon leur formule d&apos;abonnement (Gratuit, Starter, Pro, Business).
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>3. Responsabilit&eacute;s</h2>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
            Bativio est un interm&eacute;diaire. Les artisans sont seuls responsables de la qualit&eacute; de leurs prestations, de leurs assurances et de leur conformit&eacute; r&eacute;glementaire. Bativio ne garantit pas les travaux r&eacute;alis&eacute;s.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>4. Propri&eacute;t&eacute; des donn&eacute;es</h2>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
            Chaque artisan reste propri&eacute;taire de ses donn&eacute;es (profil, photos, devis, factures). Bativio s&apos;engage &agrave; ne pas les partager avec des tiers sans consentement.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>5. Facturation et abonnements</h2>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
            Les abonnements sont factur&eacute;s mensuellement via Stripe. L&apos;artisan peut changer de formule ou r&eacute;silier &agrave; tout moment depuis son espace. La r&eacute;siliation prend effet en fin de p&eacute;riode.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>6. Contact</h2>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
            Pour toute question : contact@bativio.fr
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
