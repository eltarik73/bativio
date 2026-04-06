import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Mentions l\u00e9gales" };

export default function MentionsLegalesPage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, color: "#1C1C1E", marginBottom: 32 }}>Mentions l&eacute;gales</h1>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>&Eacute;diteur du site</h2>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
            Le site www.bativio.fr est &eacute;dit&eacute; par Bativio.<br />
            Email : contact@bativio.fr
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>H&eacute;bergement</h2>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
            Le site est h&eacute;berg&eacute; par Vercel Inc., 440 N Baxter St, Covina, CA 91723, USA.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Propri&eacute;t&eacute; intellectuelle</h2>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
            L&apos;ensemble des contenus pr&eacute;sents sur le site (textes, images, logos, base de donn&eacute;es) sont prot&eacute;g&eacute;s par le droit d&apos;auteur. Toute reproduction est interdite sans autorisation pr&eacute;alable.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Donn&eacute;es personnelles</h2>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
            Conform&eacute;ment au RGPD, vous disposez d&apos;un droit d&apos;acc&egrave;s, de modification et de suppression de vos donn&eacute;es personnelles. Contactez-nous &agrave; contact@bativio.fr pour exercer vos droits.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Cookies</h2>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
            Le site utilise des cookies techniques n&eacute;cessaires au fonctionnement (authentification). Aucun cookie publicitaire ou de tracking tiers n&apos;est utilis&eacute;.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
