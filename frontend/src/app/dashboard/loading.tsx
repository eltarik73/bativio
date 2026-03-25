export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
        <div className="h-16 bg-creme rounded-lg" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm animate-pulse">
            <div className="h-8 bg-creme rounded w-16 mb-2" />
            <div className="h-3 bg-creme rounded w-24" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
        <div className="h-4 bg-creme rounded w-40 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-creme rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
