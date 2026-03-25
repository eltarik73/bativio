import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-anthracite text-white/70 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-display text-xl font-bold text-white">Bativio</span>
            <p className="text-sm mt-1">La plateforme des artisans du batiment. Zero commission.</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <Link href="/chambery" className="hover:text-white transition-colors">Artisans</Link>
            <Link href="/inscription" className="hover:text-white transition-colors">Inscription</Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} Bativio. Tous droits reserves.
        </div>
      </div>
    </footer>
  );
}
