import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <span className="footer-logo">Bativio</span>
      <div className="footer-links">
        <Link href="/">Accueil</Link>
        <Link href="#">Mentions l&eacute;gales</Link>
        <Link href="#">Contact</Link>
      </div>
      <span>&copy; 2026 Bativio &middot; Z&eacute;ro commission.</span>
    </footer>
  );
}
