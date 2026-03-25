export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-creme">
      <h1 className="font-display text-5xl md:text-7xl font-bold text-anthracite tracking-tight">
        Bativio
      </h1>
      <p className="mt-4 text-lg text-anthracite/70 font-body max-w-md text-center">
        La plateforme des artisans du bâtiment. Zéro commission.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/chambery"
          className="px-6 py-3 bg-terre text-white rounded-lg font-body font-medium hover:bg-terre-light transition-colors"
        >
          Trouver un artisan
        </a>
        <a
          href="/inscription"
          className="px-6 py-3 border border-anthracite text-anthracite rounded-lg font-body font-medium hover:bg-anthracite hover:text-white transition-colors"
        >
          Espace pro
        </a>
      </div>
    </main>
  );
}
