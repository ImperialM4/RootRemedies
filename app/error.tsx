"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to your error reporting service here
    console.error("[RootRemedies] Unhandled error:", error);
  }, [error]);

  return (
    <div className="site-container py-24 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-7 h-7 text-red-400" />
      </div>

      <h1 className="font-serif text-2xl font-bold text-bark-900 mb-3">
        Something went wrong
      </h1>

      <p className="text-bark-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
        An unexpected error occurred. If this persists, try refreshing the page
        or going back to the home page.
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="bg-sage-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-sage-700 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-sm text-bark-600 hover:text-bark-900 underline"
        >
          Go home
        </Link>
      </div>

      {process.env.NODE_ENV === "development" && (
        <details className="mt-10 text-left max-w-xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
          <summary className="text-xs font-mono text-red-600 cursor-pointer mb-2">
            Error details (dev only)
          </summary>
          <pre className="text-xs text-red-700 overflow-auto whitespace-pre-wrap">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
    </div>
  );
}
