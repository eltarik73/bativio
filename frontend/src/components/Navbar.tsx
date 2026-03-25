import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-display text-2xl font-bold text-terre">
            Bativio
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/chambery" className="text-anthracite/70 hover:text-anthracite font-body text-sm transition-colors">
              Trouver un artisan
            </Link>
            <Link
              href="/connexion"
              className="text-anthracite/70 hover:text-anthracite font-body text-sm transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="px-4 py-2 bg-terre text-white rounded-lg font-body text-sm font-medium hover:bg-terre-light transition-colors"
            >
              Inscription gratuite
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
