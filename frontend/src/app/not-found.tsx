import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center px-4">
        <p className="font-display text-8xl font-bold text-terre/20">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-anthracite">Page introuvable</h1>
        <p className="mt-2 text-anthracite/50 text-sm max-w-md mx-auto">
          La page que vous cherchez n&apos;existe pas ou a ete deplacee.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block px-6 py-3 bg-terre text-white rounded-lg font-medium hover:bg-terre-light transition-colors"
        >
          Retour a l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
