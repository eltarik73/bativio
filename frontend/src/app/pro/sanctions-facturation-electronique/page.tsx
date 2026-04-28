/**
 * Satellite 1 : sanctions facturation electronique 2026 (1500 mots).
 *
 * Cible SEO : "sanction facturation electronique", "amende facture papier 2026",
 * "50 euros facture non electronique", "sanction PA non designee".
 */
import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Sanctions facturation électronique 2026 : amendes et risques",
  description: "50€ par facture non électronique, 500€ pour non-désignation de PA : les sanctions prévues par la loi de finances 2026 expliquées aux artisans.",
  keywords: "sanction facture electronique, amende facture papier 2026, sanction PA non designee, 50 euros facture, plafond 15000, e-reporting amende",
  alternates: { canonical: "https://www.bativio.fr/pro/sanctions-facturation-electronique" },
  openGraph: {
    title: "Sanctions facturation électronique 2026 — Artisans | Bativio",
    description: "Le barème officiel des amendes et comment les éviter. Cas concrets pour artisans.",
    url: "https://www.bativio.fr/pro/sanctions-facturation-electronique",
    type: "article",
    locale: "fr_FR",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Sanctions facturation électronique 2026" }],
  },
  twitter: { card: "summary_large_image", title: "Sanctions facturation électronique 2026", description: "50€/facture, 500€ PA, 250€ e-reporting." },
};

const FAQ = [
  { q: "Suis-je sanctionné automatiquement dès septembre 2026 ?", a: "Non. La période 2026-2027 est annoncée comme tolérante par le ministère, avec une montée en charge progressive. Les premières sanctions seront appliquées en cas de manquements répétés et après mise en demeure. Les sanctions deviendront automatiques à partir de 2028." },
  { q: "Le plafond de 15 000 € s'applique-t-il par entreprise ou par facture ?", a: "Par entreprise et par année civile. Si vous accumulez 300 factures non conformes à 50 € chacune (= 15 000 €), vous atteignez le plafond. Au-delà, plus d'amende sur la même année (mais le risque de contrôle renforcé augmente). Pour un artisan typique, le plafond est rarement atteint." },
  { q: "Que se passe-t-il si mon client refuse une facture électronique ?", a: "Vous restez redevable de la sanction (50 €) si vous n'avez pas émis au format électronique. Le refus de votre client n'est pas une excuse. Si votre client n'a pas désigné de PA, la facture est routée par défaut vers le PPF (qui le notifiera). Vous devez en tout cas émettre au format électronique." },
  { q: "L'amende de 250 € pour e-reporting s'applique-t-elle à chaque facture ou par déclaration ?", a: "Par manquement à l'obligation de transmission. Si vous oubliez de transmettre les données de transactions B2C d'une journée, c'est une amende. Si vous n'avez jamais activé le e-reporting, c'est une amende par périodicité de déclaration manquée. La PA gère normalement le e-reporting automatiquement." },
  { q: "Comment réparer une infraction sans payer l'amende ?", a: "La 'clause de bienveillance' : si vous régularisez la situation dans les 30 jours suivant la mise en demeure de l'administration, l'amende est levée. C'est un dispositif d'incitation à la conformité, pas une sanction punitive. Mais ça ne fonctionne qu'une fois (récidive non tolérée)." },
];

export default function SanctionsPage() {
  return (
    <>
      <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "#9C958D", marginBottom: 24 }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link href="/pro" style={{ color: "inherit", textDecoration: "none" }}>Pro</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#3D2E1F" }}>Sanctions</span>
      </nav>

      <article style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.15, marginBottom: 16 }}>
            Sanctions facturation &eacute;lectronique 2026 : amendes et risques
          </h1>
          <p style={{ fontSize: 17, color: "#6B6560", lineHeight: 1.6 }}>
            50 &euro; par facture non &eacute;lectronique, 500 &euro; pour absence de PA, 250 &euro;
            par manquement e-reporting : tout ce que les artisans doivent savoir sur le
            bar&egrave;me officiel.
          </p>
          <div style={{ fontSize: 12, color: "#9C958D", marginTop: 12 }}>
            Mis &agrave; jour le 27 avril 2026 &middot; Lecture 6 min
          </div>
        </header>

        {/* 1. Bareme officiel */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            1. Le bar&egrave;me officiel des sanctions
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 16 }}>
            La loi de finances 2024 (article 91) et le d&eacute;cret n&deg; 2024-1361 ont
            d&eacute;fini 3 sanctions principales pour les manquements &agrave; la facturation
            &eacute;lectronique :
          </p>

          <div style={{ background: "rgba(220,38,38,.05)", border: "1px solid rgba(220,38,38,.2)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#C4531A", marginBottom: 8 }}>
              50 &euro; par facture non &eacute;mise au format &eacute;lectronique
            </h3>
            <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 8 }}>
              Sanction la plus fr&eacute;quente. Application : <strong>chaque facture
              papier ou PDF non transmis via une plateforme agr&eacute;&eacute;e</strong>
              apr&egrave;s la date d&apos;obligation (sept. 2026 grandes entreprises,
              sept. 2027 TPE/PME).
            </p>
            <p style={{ fontSize: 13, color: "#6B6560" }}>
              <strong>Plafond annuel :</strong> 15 000 &euro; par entreprise et par ann&eacute;e civile.
            </p>
          </div>

          <div style={{ background: "rgba(220,38,38,.05)", border: "1px solid rgba(220,38,38,.2)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#C4531A", marginBottom: 8 }}>
              500 &euro; pour absence de d&eacute;signation d&apos;une PA
            </h3>
            <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 8 }}>
              Si vous n&apos;avez d&eacute;sign&eacute; aucune plateforme agr&eacute;&eacute;e
              dans l&apos;annuaire central du PPF apr&egrave;s mise en demeure de
              l&apos;administration, vous &ecirc;tes passible d&apos;une amende de 500 &euro;.
            </p>
            <p style={{ fontSize: 13, color: "#6B6560" }}>
              <strong>Application :</strong> par manquement (amende unique, pas r&eacute;p&eacute;t&eacute;e).
              R&eacute;cup&eacute;rable apr&egrave;s d&eacute;signation d&apos;une PA.
            </p>
          </div>

          <div style={{ background: "rgba(220,38,38,.05)", border: "1px solid rgba(220,38,38,.2)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#C4531A", marginBottom: 8 }}>
              250 &euro; par manquement e-reporting
            </h3>
            <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 8 }}>
              Pour chaque oubli de transmission des donn&eacute;es de transactions B2C
              ou des donn&eacute;es de paiement &agrave; la DGFiP. Le e-reporting est
              g&eacute;n&eacute;ralement automatis&eacute; par votre PA, mais en cas de
              dysfonctionnement non corrig&eacute;, vous &ecirc;tes responsable.
            </p>
            <p style={{ fontSize: 13, color: "#6B6560" }}>
              <strong>Plafond annuel :</strong> 15 000 &euro; par entreprise et par ann&eacute;e civile.
            </p>
          </div>

          <div style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>
              Sanction indirecte : refus de d&eacute;duction TVA
            </h3>
            <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 0 }}>
              Une sanction non &eacute;crite mais redoutable : <strong>vos clients
              professionnels ne pourront plus d&eacute;duire la TVA</strong> de vos factures
              non conformes. Concr&egrave;tement, ils ne voudront plus travailler avec vous,
              ou exigeront un escompte. C&apos;est souvent plus dissuasif que l&apos;amende DGFiP.
            </p>
          </div>
        </section>

        {/* 2. Cas concrets */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            2. Cas concrets pour un artisan
          </h2>

          <div style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>
              Cas 1 : Artisan auto-entrepreneur, 30 factures B2B/an
            </h3>
            <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6 }}>
              Si vous &eacute;mettez 30 factures B2B en papier au lieu d&apos;&eacute;lectronique
              en 2027 :<br />
              30 &times; 50 &euro; = <strong>1 500 &euro; d&apos;amende</strong> (sous le plafond 15 000 &euro;).<br />
              + risque que vos clients pros refusent vos factures.
            </p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>
              Cas 2 : TPE 3 salari&eacute;s, 200 factures/an
            </h3>
            <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6 }}>
              Si vous &eacute;mettez les 200 factures en papier en 2027 :<br />
              200 &times; 50 &euro; = 10 000 &euro; d&apos;amende (sous le plafond).<br />
              + e-reporting non fait : 12 manquements (1 par mois) &times; 250 &euro; = 3 000 &euro;.<br />
              <strong>Total : 13 000 &euro; d&apos;amendes pour une ann&eacute;e</strong>, &agrave; comparer
              au co&ucirc;t d&apos;une PA &agrave; 19 &euro;/mois (228 &euro;/an).
            </p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>
              Cas 3 : PME 10 salari&eacute;s, 500 factures/an, sans PA d&eacute;sign&eacute;e
            </h3>
            <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6 }}>
              500 factures non &eacute;lectroniques : 25 000 &euro; (plafonn&eacute; &agrave; 15 000 &euro;).<br />
              Mise en demeure non suivie d&apos;effet : 500 &euro;.<br />
              E-reporting omis : 12 manquements &times; 250 &euro; = 3 000 &euro;.<br />
              <strong>Total : 18 500 &euro; d&apos;amendes</strong>, sans compter la perte de clients pros.
            </p>
          </div>
        </section>

        {/* 3. Clause de bienveillance */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            3. La clause de bienveillance
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Le l&eacute;gislateur a pr&eacute;vu un dispositif de cl&eacute;mence pour les
            premi&egrave;res infractions :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li>Si l&apos;administration vous notifie un manquement et que vous le <strong>r&eacute;parez dans les 30 jours</strong>, l&apos;amende est <strong>lev&eacute;e</strong>.</li>
            <li>Cette clause s&apos;applique aux 3 sanctions principales (50/500/250 &euro;).</li>
            <li>Elle ne fonctionne <strong>qu&apos;une seule fois</strong> : la r&eacute;cidive est sanctionn&eacute;e automatiquement.</li>
          </ul>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6, fontStyle: "italic" }}>
            En pratique : la p&eacute;riode 2026-2027 sera principalement p&eacute;dagogique,
            avec mise en demeure pr&eacute;alable. Les sanctions automatiques arrivent en 2028.
          </p>
        </section>

        {/* 4. Comment eviter */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            4. Comment &eacute;viter les sanctions
          </h2>
          <ol style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24 }}>
            <li><strong>D&eacute;signez une PA d&egrave;s aujourd&apos;hui</strong> dans l&apos;annuaire central. M&ecirc;me si vous n&apos;&eacute;mettez pas encore en &eacute;lectronique, votre adresse est connue pour la r&eacute;ception.</li>
            <li><strong>Anticipez la bascule</strong> : ne attendez pas septembre 2027. Commencez &agrave; &eacute;mettre en &eacute;lectronique d&egrave;s avril-mai 2027 pour roder votre processus.</li>
            <li><strong>Choisissez une PA fiable</strong> avec support FR r&eacute;actif. Les pannes techniques sont rares, mais en cas de pb vous devez avoir quelqu&apos;un &agrave; appeler.</li>
            <li><strong>V&eacute;rifiez le e-reporting</strong> : si vous travaillez en B2C, assurez-vous que votre PA transmet bien les donn&eacute;es de transaction et de paiement.</li>
            <li><strong>Conservez les factures non conformes</strong> &eacute;mises avant la bascule en archive (papier ou PDF). Elles restent valides.</li>
          </ol>
        </section>

        {/* 5. FAQ */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            5. FAQ
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
            <li><Link href="/pro/facturation-electronique-2026" style={{ color: "#C4531A" }}>Guide complet r&eacute;forme 2026</Link></li>
            <li><Link href="/pro/comparatif-pa" style={{ color: "#C4531A" }}>Comparatif des plateformes agr&eacute;&eacute;es</Link></li>
            <li><Link href="/pro/glossaire" style={{ color: "#C4531A" }}>Glossaire de la facturation &eacute;lectronique</Link></li>
            <li><Link href="/pro/auto-entrepreneur-batiment-2026" style={{ color: "#C4531A" }}>Auto-entrepreneur du b&acirc;timent et 2026</Link></li>
          </ul>
        </section>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Sanctions facturation électronique 2026 : amendes et risques",
        description: "Le barème officiel des amendes (50€/500€/250€) avec cas concrets pour artisans.",
        author: { "@type": "Organization", name: "Bativio" },
        publisher: { "@type": "Organization", name: "Bativio" },
        datePublished: "2026-04-27",
        dateModified: "2026-04-27",
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.bativio.fr/pro/sanctions-facturation-electronique" },
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
          { "@type": "ListItem", position: 3, name: "Sanctions", item: "https://www.bativio.fr/pro/sanctions-facturation-electronique" },
        ],
      }) }} />
    </>
  );
}
