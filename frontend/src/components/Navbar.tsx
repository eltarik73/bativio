import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-[100] bg-[rgba(250,248,245,.94)] backdrop-blur-[20px] border-b border-[rgba(28,28,30,.04)] px-7 h-14 flex items-center justify-between max-md:px-4 max-md:h-[52px]">
      <Link href="/" className="font-display text-[21px] font-bold text-terre tracking-[-0.5px]">
        Bativio
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/connexion" className="text-[13px] font-medium text-g500 hover:text-anthracite transition-colors">
          Connexion
        </Link>
        <Link
          href="/inscription"
          className="text-xs font-semibold text-white bg-terre px-[18px] py-2 rounded-lg hover:bg-terre-light transition-all tracking-[0.2px]"
        >
          Espace artisan
        </Link>
      </div>
    </nav>
  );
}
