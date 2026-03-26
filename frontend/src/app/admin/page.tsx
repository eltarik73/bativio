export default function AdminDashboard() {
  const stats = [
    { label: "Total artisans", value: "5", color: "text-anthracite" },
    { label: "Inscriptions ce mois", value: "2", color: "text-terre" },
    { label: "Devis ce mois", value: "12", color: "text-or" },
    { label: "Revenus estimes", value: "216 EUR", color: "text-green-600" },
  ];

  const planData = [
    { plan: "Gratuit", count: 1, color: "bg-gray-300" },
    { plan: "Essentiel", count: 2, color: "bg-or" },
    { plan: "Pro", count: 1, color: "bg-terre" },
    { plan: "Pro+", count: 1, color: "bg-anthracite" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-anthracite mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-[14px] p-5 border border-g100">
            <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-g400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[14px] p-6 border border-g100">
          <h2 className="font-display text-lg font-bold text-anthracite mb-4">Repartition par plan</h2>
          <div className="space-y-3">
            {planData.map((p) => (
              <div key={p.plan} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${p.color}`} />
                <span className="text-sm text-g500 flex-1">{p.plan}</span>
                <span className="text-sm font-medium">{p.count}</span>
                <div className="w-24 h-2 bg-g50 rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full`} style={{ width: `${(p.count / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[14px] p-6 border border-g100">
          <h2 className="font-display text-lg font-bold text-anthracite mb-4">Repartition par ville</h2>
          <div className="space-y-3">
            {[
              { ville: "Chambery", count: 5 },
              { ville: "Annecy", count: 0 },
              { ville: "Grenoble", count: 0 },
              { ville: "Lyon", count: 0 },
              { ville: "Valence", count: 0 },
            ].map((v) => (
              <div key={v.ville} className="flex items-center gap-3">
                <span className="text-sm text-g500 flex-1">{v.ville}</span>
                <span className="text-sm font-medium">{v.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
