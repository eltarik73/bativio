import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-cols">
          <div className="footer-col">
            <span className="footer-logo">Bativio</span>
            <p className="footer-logo-desc">
              La plateforme des artisans du b&acirc;timent en Rh&ocirc;ne-Alpes.
              Z&eacute;ro commission, z&eacute;ro frais cach&eacute;s.
            </p>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Pour les particuliers</div>
            <Link href="/chambery">Artisans Chambéry</Link>
            <Link href="/annecy">Artisans Annecy</Link>
            <Link href="/grenoble">Artisans Grenoble</Link>
            <Link href="/lyon">Artisans Lyon</Link>
            <Link href="/valence">Artisans Valence</Link>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Pour les artisans</div>
            <Link href="/inscription">Cr&eacute;er ma page</Link>
            <Link href="/tarifs">Tarifs</Link>
            <Link href="/facturation-electronique">Facturation</Link>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Bativio</div>
            <Link href="/a-propos">&Agrave; propos</Link>
            <Link href="/rejoindre">Rejoindre l&apos;&eacute;quipe</Link>
            <a href="mailto:contact@bativio.fr">Contact</a>
            <Link href="/mentions-legales">Mentions l&eacute;gales</Link>
            <Link href="/cgu">CGU</Link>
          </div>
        </div>
        {/* Bloc SEO local — maillage interne large vers hubs ville/departement/region.
             Style discret (typo et opacite reduite) mais 100% present dans le HTML. */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 24, marginTop: 24, fontSize: 12, color: "rgba(255,255,255,.5)", lineHeight: 1.7 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            <div>
              <div style={{ fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: 6, textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Hubs villes</div>
              <Link href="/artisans-chambery" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Artisans à Chambéry</Link>
              <Link href="/artisans-aix-les-bains" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Artisans à Aix-les-Bains</Link>
              <Link href="/artisans-albertville" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Artisans à Albertville</Link>
              <Link href="/artisans-annecy" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Artisans à Annecy</Link>
              <Link href="/artisans-lyon" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Artisans à Lyon</Link>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: 6, textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Métiers populaires</div>
              <Link href="/chambery/plombier" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Plombier Chambéry</Link>
              <Link href="/chambery/electricien" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Électricien Chambéry</Link>
              <Link href="/chambery/peintre" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Peintre Chambéry</Link>
              <Link href="/chambery/macon" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Maçon Chambéry</Link>
              <Link href="/chambery/couvreur" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Couvreur Chambéry</Link>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: 6, textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Départements</div>
              <Link href="/artisans-savoie" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Artisans Savoie (73)</Link>
              <Link href="/artisans-haute-savoie" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Artisans Haute-Savoie (74)</Link>
              <Link href="/artisans-isere" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Artisans Isère (38)</Link>
              <Link href="/artisans-rhone" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Artisans Rhône (69)</Link>
              <Link href="/artisans-drome" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Artisans Drôme (26)</Link>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: 6, textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Région</div>
              <Link href="/artisans-rhone-alpes" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Artisans Rhône-Alpes</Link>
              <Link href="/prix" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Prix travaux 2026</Link>
              <Link href="/sitemap.xml" style={{ color: "inherit", textDecoration: "none", display: "block" }}>Plan du site</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-trust">
            Artisans v&eacute;rifi&eacute;s &middot; Donn&eacute;es prot&eacute;g&eacute;es &middot; Z&eacute;ro commission
          </div>
          <div className="footer-copy">
            &copy; 2026 Bativio &middot; Fabriqu&eacute; &agrave; Chamb&eacute;ry avec &#10084;&#65039;
          </div>
        </div>
      </div>
    </footer>
  );
}
