"use client";

export default function PhotosPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-anthracite">Mes photos</h1>
        <span className="text-sm text-anthracite/50">0 / 3 photos (Gratuit)</span>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex gap-4 mb-6">
          <button className="px-4 py-2 bg-terre text-white rounded-lg text-sm font-medium">
            Photo simple
          </button>
          <button className="px-4 py-2 bg-white border border-black/10 rounded-lg text-sm text-anthracite/60">
            Avant / Apres
          </button>
        </div>

        <div className="border-2 border-dashed border-black/10 rounded-xl p-12 text-center">
          <p className="text-4xl mb-3">&#128247;</p>
          <p className="text-anthracite/50 text-sm">Glissez vos photos ici</p>
          <p className="text-anthracite/40 text-xs mt-1">JPG, PNG ou WebP, max 10 Mo</p>
          <button className="mt-4 px-4 py-2 bg-creme rounded-lg text-sm text-anthracite/70 hover:bg-terre/10 transition-colors">
            Choisir des photos
          </button>
        </div>
      </div>

      <div className="text-center py-12">
        <p className="text-anthracite/40">Vous n&apos;avez pas encore de photos</p>
        <p className="text-anthracite/30 text-sm mt-1">Ajoutez des photos de vos realisations pour attirer plus de clients</p>
      </div>
    </div>
  );
}
