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
