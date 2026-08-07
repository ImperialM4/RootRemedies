import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="site-container py-24 text-center">
      <Leaf className="w-12 h-12 text-bark-200 dark:text-bark-700 mx-auto mb-6" />
      <h1 className="font-serif text-4xl font-bold text-primary mb-3">Page not found</h1>
      <p className="text-muted mb-8 max-w-sm mx-auto">
        This condition doesn&apos;t exist yet, or the URL may have changed.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/conditions"
          className="bg-sage-600 dark:bg-sage-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-sage-700 dark:hover:bg-sage-400 transition-colors">
          Browse all conditions
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-primary underline transition-colors">Go home</Link>
      </div>
    </div>
  );
}
