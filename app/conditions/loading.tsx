export default function ConditionsLoading() {
  return (
    <div className="site-container py-10 animate-pulse">
      <div className="h-4 w-40 bg-bark-200 rounded mb-6" />
      <div className="h-9 w-56 bg-bark-200 rounded mb-2" />
      <div className="h-4 w-32 bg-bark-100 rounded mb-8" />

      {/* Tag bar skeleton */}
      <div className="flex gap-2 mb-8 pb-6 border-b border-bark-100">
        {[60, 80, 50, 90, 70, 55, 75].map((w, i) => (
          <div key={i} className="h-6 bg-bark-100 rounded-full" style={{ width: `${w}px` }} />
        ))}
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-bark-200 overflow-hidden">
            <div className="aspect-[16/9] bg-bark-100" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-24 bg-bark-100 rounded" />
              <div className="h-5 w-full bg-bark-200 rounded" />
              <div className="h-4 w-5/6 bg-bark-100 rounded" />
              <div className="h-4 w-4/5 bg-bark-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
