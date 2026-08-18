"use client";

import { useId, useRef, useState } from "react";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "loading" | "success" | "error";

interface NewsletterSignupProps {
  className?: string;
  /** Renders just the form card without the surrounding section chrome —
   *  useful for embedding inline inside an article or sidebar. */
  bare?: boolean;
}

function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submittingRef = useRef(false);

  const inputId = useId();
  const errorId = useId();
  const statusId = useId();

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Guard against double-submits (double click, Enter + click, etc.)
    if (submittingRef.current || isLoading) return;

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    submittingRef.current = true;
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(
          typeof data?.error === "string"
            ? data.error
            : "Something went wrong. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Check your connection and try again.");
    } finally {
      submittingRef.current = false;
    }
  }

  if (isSuccess) {
    return (
      <div
        role="status"
        id={statusId}
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg border border-sage-300 dark:border-sage-800 bg-sage-50 dark:bg-sage-950/30 px-4 py-3.5 text-sm font-medium text-sage-800 dark:text-sage-300",
          className
        )}
      >
        <CheckCircle2 className="w-4.5 h-4.5 shrink-0" aria-hidden />
        You&apos;re subscribed! Check your inbox to confirm.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("w-full", className)}
    >
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
        <div className="flex-1">
          <label htmlFor={inputId} className="sr-only">
            Email address
          </label>
          <input
            id={inputId}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            disabled={isLoading}
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? errorId : undefined}
            className={cn(
              "w-full h-11 px-4 rounded-lg border bg-white dark:bg-bark-800 text-sm text-bark-900 dark:text-bark-50 placeholder:text-bark-400 dark:placeholder:text-bark-500 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-bark-900",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              status === "error"
                ? "border-red-400 dark:border-red-700"
                : "border-bark-300 dark:border-bark-700"
            )}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0",
            "bg-sage-600 text-white hover:bg-sage-700 active:bg-sage-800 dark:bg-sage-500 dark:hover:bg-sage-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-bark-900",
            "disabled:opacity-60 disabled:pointer-events-none"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
              Subscribing…
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </div>

      <div role="status" aria-live="polite" className="sr-only" id={statusId}>
        {isLoading ? "Submitting your email…" : ""}
      </div>

      {status === "error" && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden />
          {errorMessage}
        </p>
      )}
    </form>
  );
}

/**
 * Site-wide newsletter signup, backed by beehiiv (see /api/newsletter and
 * lib/newsletter/beehiiv.ts). Rendered as a full section by default; pass
 * `bare` to embed just the form elsewhere (e.g. inside an article).
 */
export function NewsletterSignup({ className, bare = false }: NewsletterSignupProps) {
  if (bare) {
    return <NewsletterForm className={className} />;
  }

  return (
    <section
      className={cn(
        "border-y border-bark-200 dark:border-bark-800 bg-white dark:bg-bark-900/60",
        className
      )}
    >
      <div className="site-container py-14">
        <div className="max-w-xl mx-auto text-center">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--color-accent-light)" }}
          >
            <Mail className="w-5 h-5" style={{ color: "var(--color-accent)" }} aria-hidden />
          </div>
          <h2
            className="font-serif text-2xl font-semibold mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            Get remedies in your inbox
          </h2>
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            New remedies, seasonal picks, and traditional-medicine notes — no spam, unsubscribe anytime.
          </p>

          <div className="max-w-sm mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
