import Link from "next/link";
import { PLANS, VILLES } from "@/lib/constants";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-creme py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-7xl font-bold text-anthracite tracking-tight leading-tight">
            Trouvez l&apos;artisan ideal<br className="hidden md:block" /> pres de chez vous
          </h1>
          <p className="mt-6 text-lg md:text-xl text-anthracite/70 max-w-2xl mx-auto">
            Plombier, electricien, peintre, macon... Comparez les artisans de votre ville, consultez les avis et demandez un devis. Zero commission.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            {VILLES.map((v) => (
              <Link
                key={v.slug}
                href={`/${v.slug}`}
                className="px-5 py-2.5 bg-white rounded-lg border border-black/10 text-anthracite font-medium text-sm hover:border-terre hover:text-terre transition-colors"
              >
                {v.nom}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ca marche */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-10 h-0.5 bg-terre mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-anthracite">Comment ca marche</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "1", title: "Recherchez", desc: "Trouvez des artisans qualifies dans votre ville par metier." },
              { num: "2", title: "Comparez", desc: "Consultez les profils, avis et qualifications pour faire le bon choix." },
              { num: "3", title: "Contactez", desc: "Demandez un devis gratuit directement depuis la plateforme." },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-terre/10 flex items-center justify-center text-terre font-display font-bold text-xl mx-auto">
                  {step.num}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-anthracite">{step.title}</h3>
                <p className="mt-2 text-anthracite/60 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zero commission */}
      <section className="py-20 bg-anthracite text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="font-display text-7xl md:text-9xl font-bold text-or">0%</p>
          <h2 className="mt-4 font-display text-3xl font-bold">Zero commission</h2>
          <p className="mt-4 text-white/70 max-w-lg mx-auto">
            Vos revenus restent vos revenus. Abonnement fixe, transparent, sans surprise. Pas de commission sur vos devis ni vos chantiers.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-creme">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-10 h-0.5 bg-terre mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-anthracite">Nos offres</h2>
            <p className="mt-2 text-anthracite/60">Un plan adapte a chaque artisan</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-xl p-6 shadow-sm border ${
                  "populaire" in plan && plan.populaire ? "border-terre ring-2 ring-terre/20" : "border-black/5"
                } relative`}
              >
                {"populaire" in plan && plan.populaire && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terre text-white text-xs font-medium px-3 py-1 rounded-full">
                    Le + populaire
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-anthracite">{plan.nom}</h3>
                <div className="mt-2">
                  <span className="font-display text-4xl font-bold text-anthracite">
                    {plan.prix === 0 ? "Gratuit" : `${plan.prix}\u20AC`}
                  </span>
                  {plan.prix > 0 && <span className="text-anthracite/50 text-sm">/mois</span>}
                </div>
                <p className="mt-2 text-sm text-anthracite/60">{plan.description}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="text-terre mt-0.5">&#10003;</span>
                      <span className="text-anthracite/70">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/inscription"
                  className={`mt-6 block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    "populaire" in plan && plan.populaire
                      ? "bg-terre text-white hover:bg-terre-light"
                      : "border border-anthracite/20 text-anthracite hover:bg-anthracite hover:text-white"
                  }`}
                >
                  {plan.prix === 0 ? "Commencer gratuitement" : "Choisir ce plan"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-anthracite">
            Vous etes artisan ?
          </h2>
          <p className="mt-4 text-anthracite/60">
            Rejoignez Bativio gratuitement et rendez-vous visible aupres de milliers de clients potentiels dans votre ville.
          </p>
          <Link
            href="/inscription"
            className="mt-8 inline-block px-8 py-3.5 bg-terre text-white rounded-lg font-medium hover:bg-terre-light transition-colors"
          >
            Inscription gratuite
          </Link>
        </div>
      </section>
    </main>
  );
}
