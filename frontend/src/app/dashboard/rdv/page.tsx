export default function RdvPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-anthracite mb-6">Mes rendez-vous</h1>
      <div className="bg-white rounded-xl p-12 shadow-sm text-center">
        <p className="text-5xl mb-4">&#128197;</p>
        <h2 className="font-display text-xl font-bold text-anthracite">Bientot disponible</h2>
        <p className="mt-2 text-anthracite/50 text-sm max-w-md mx-auto">
          Gerez vos rendez-vous directement depuis Bativio. Agenda visible 24/7, prise de RDV en ligne, rappels SMS automatiques.
        </p>
        <div className="mt-6 inline-block px-4 py-2 bg-creme rounded-lg text-sm text-anthracite/50">
          Disponible avec le plan Essentiel et superieur
        </div>
      </div>
    </div>
  );
}
