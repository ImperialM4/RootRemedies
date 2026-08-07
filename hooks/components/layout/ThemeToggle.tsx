"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder the same size to avoid layout shift
    return <div className={cn("w-8 h-8", className)} aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "p-2 rounded-lg transition-colors duration-150",
        "text-bark-500 hover:text-bark-800 hover:bg-bark-100",
        "dark:text-bark-400 dark:hover:text-bark-100 dark:hover:bg-bark-800",
        className
      )}
    >
      {isDark
        ? <Sun  className="w-4 h-4" />
        : <Moon className="w-4 h-4" />
      }
    </button>
  );
}
