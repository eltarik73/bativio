"use client";

export default function ParametresPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-anthracite mb-6">Param&egrave;tres</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-[14px] p-6 border border-g100">
          <h2 className="font-display text-lg font-bold text-anthracite mb-4">Compte</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-anthracite mb-1">Email</label>
              <input
                type="email"
                defaultValue="jp.martin@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-g200 bg-g50 text-g500"
                readOnly
              />
            </div>
            <button className="text-sm text-terre hover:underline">Modifier le mot de passe</button>
          </div>
        </div>

        <div className="bg-white rounded-[14px] p-6 border border-g100">
          <h2 className="font-display text-lg font-bold text-anthracite mb-4">Abonnement</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-terre/10 text-terre rounded-full text-sm font-medium">Plan Pro</span>
            <span className="text-sm text-g400">49 EUR/mois</span>
          </div>
          <ul className="space-y-1 text-sm text-g500 mb-4">
            <li>&#10003; URL perso (vitrine complete)</li>
            <li>&#10003; Photos illimitees</li>
            <li>&#10003; QR Code vitrine</li>
            <li>&#10003; Mini-CRM clients</li>
            <li>&#10003; Support prioritaire</li>
          </ul>
          <button className="px-4 py-2 border border-anthracite/20 rounded-lg text-sm text-anthracite hover:bg-anthracite hover:text-white transition-colors">
            Changer de plan
          </button>
        </div>

        <div className="bg-white rounded-[14px] p-6 border border-g100">
          <h2 className="font-display text-lg font-bold text-anthracite mb-4">Ma page</h2>
          <div className="flex items-center gap-2 p-3 bg-g50 rounded-lg mb-4">
            <code className="text-sm text-anthracite flex-1">bativio.fr/chambery/martin-plomberie</code>
            <button className="px-3 py-1 bg-terre/10 text-terre rounded text-xs font-medium hover:bg-terre/20 transition-colors">
              Copier
            </button>
          </div>
          <p className="text-xs text-g300">QR Code disponible avec le plan Pro</p>
        </div>

        <div className="bg-white rounded-[14px] p-6 border border-g100 border border-red-100">
          <h2 className="font-display text-lg font-bold text-red-600 mb-2">Zone de danger</h2>
          <p className="text-sm text-g400 mb-4">
            La desactivation masquera votre page de l&apos;annuaire. Vous pourrez la reactiver a tout moment.
          </p>
          <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors">
            Desactiver mon compte
          </button>
        </div>
      </div>
    </div>
  );
}
