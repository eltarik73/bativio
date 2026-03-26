export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[14px] p-6 border border-g100 animate-pulse">
        <div className="h-16 bg-g50 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-[14px] p-5 border border-g100 animate-pulse">
            <div className="h-8 bg-g50 rounded w-16 mb-2" />
            <div className="h-3 bg-g50 rounded w-24" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-[14px] p-6 border border-g100 animate-pulse">
        <div className="h-4 bg-g50 rounded w-40 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-g50 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
