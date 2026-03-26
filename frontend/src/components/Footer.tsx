import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-7 py-7 flex items-center justify-between text-[11px] text-g400 max-md:flex-col max-md:gap-3 max-md:text-center max-md:px-4">
      <span className="font-display text-[15px] font-bold text-terre">Bativio</span>
      <div className="flex gap-4">
        <Link href="/" className="text-g400 hover:text-anthracite transition-colors">Accueil</Link>
        <Link href="#" className="text-g400 hover:text-anthracite transition-colors">Mentions legales</Link>
        <Link href="#" className="text-g400 hover:text-anthracite transition-colors">Contact</Link>
      </div>
      <span>&copy; 2026 Bativio &middot; Zero commission.</span>
    </footer>
  );
}
