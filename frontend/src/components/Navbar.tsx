import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">Bativio</Link>
      <div className="nav-r">
        <Link href="/connexion" className="nav-link">Connexion</Link>
        <Link href="/inscription" className="nav-cta">Espace artisan</Link>
      </div>
    </nav>
  );
}
