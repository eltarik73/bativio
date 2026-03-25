export default function StarRating({ rating, count }: { rating: number; count?: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fill = rating >= i ? "full" : rating >= i - 0.5 ? "half" : "empty";
    stars.push(
      <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="none">
        {fill === "full" && (
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.45.91-5.33L2.27 6.62l5.34-.78L10 1z" fill="#E8A84C" />
        )}
        {fill === "half" && (
          <>
            <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.45.91-5.33L2.27 6.62l5.34-.78L10 1z" fill="#E5E7EB" />
            <path d="M10 1v12.27l-4.77 2.45.91-5.33L2.27 6.62l5.34-.78L10 1z" fill="#E8A84C" />
          </>
        )}
        {fill === "empty" && (
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.45.91-5.33L2.27 6.62l5.34-.78L10 1z" fill="#E5E7EB" />
        )}
      </svg>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {count !== undefined && (
        <span className="text-xs text-anthracite/50 ml-1">({count})</span>
      )}
    </div>
  );
}
