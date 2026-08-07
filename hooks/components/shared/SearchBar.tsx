"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SearchDialog } from "./SearchDialog";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * A standalone search bar that opens the SearchDialog on click.
 * Embed anywhere — homepage hero, conditions page header, etc.
 */
export function SearchBar({
  placeholder = "Search conditions, remedies, symptoms…",
  className,
  size = "md",
}: SearchBarProps) {
  const [open, setOpen] = useState(false);

  const sizeClass = {
    sm: "py-2 text-sm",
    md: "py-3 text-base",
    lg: "py-4 text-lg",
  }[size];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "w-full flex items-center gap-3 px-4 bg-white border border-bark-200 rounded-xl",
          "text-bark-400 hover:border-bark-300 hover:text-bark-500 transition-colors",
          "shadow-sm hover:shadow-md transition-shadow",
          sizeClass,
          className
        )}
        aria-label="Open search"
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left truncate">{placeholder}</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 text-xs bg-bark-50 text-bark-300 border border-bark-200 rounded px-1.5 py-0.5 font-mono shrink-0">
          <span>⌘</span><span>K</span>
        </kbd>
      </button>

      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
