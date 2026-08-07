export default function Loading() {
  return (
    <div className="site-container py-10 animate-pulse">
      <div className="flex gap-2 mb-6">
        <div className="h-4 w-12 bg-bark-200 dark:bg-bark-700 rounded" />
        <div className="h-4 w-4  bg-bark-100 dark:bg-bark-800 rounded" />
        <div className="h-4 w-24 bg-bark-200 dark:bg-bark-700 rounded" />
      </div>
      <div className="w-full aspect-[21/9] bg-bark-100 dark:bg-bark-800 rounded-xl mb-8" />
      <div className="h-10 bg-bark-200 dark:bg-bark-700 rounded w-3/4 mb-4" />
      <div className="h-6  bg-bark-100 dark:bg-bark-800 rounded w-full mb-2" />
      <div className="h-6  bg-bark-100 dark:bg-bark-800 rounded w-5/6 mb-8" />
      <div className="flex gap-4 mb-8">
        {[24, 32, 20].map((w, i) => <div key={i} className="h-4 bg-bark-100 dark:bg-bark-800 rounded" style={{ width: `${w * 4}px` }} />)}
      </div>
      <div className="space-y-3 max-w-3xl">
        {[100, 90, 95, 80, 100, 85, 92, 70].map((w, i) => (
          <div key={i} className="h-4 bg-bark-100 dark:bg-bark-800 rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
