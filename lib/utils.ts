// ─────────────────────────────────────────────────────────────────────────────
// lib/utils.ts
// ─────────────────────────────────────────────────────────────────────────────

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

// ---------------------------------------------------------------------------
// Tailwind class merging
// ---------------------------------------------------------------------------
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------
export function formatDate(isoString: string): string {
  try {
    return format(parseISO(isoString), "MMMM d, yyyy");
  } catch {
    return isoString;
  }
}

export function formatDateShort(isoString: string): string {
  try {
    return format(parseISO(isoString), "MMM yyyy");
  } catch {
    return isoString;
  }
}

// ---------------------------------------------------------------------------
// String helpers
// ---------------------------------------------------------------------------
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function titleCase(text: string): string {
  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

// ---------------------------------------------------------------------------
// Reading time display
// ---------------------------------------------------------------------------
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return "Less than 1 min read";
  return `${minutes} min read`;
}

// ---------------------------------------------------------------------------
// YouTube helpers
// ---------------------------------------------------------------------------
export function getYouTubeThumbnail(
  videoId: string,
  quality: "default" | "hq" | "maxres" = "hq"
): string {
  const qualityMap = {
    default: "default",
    hq: "hqdefault",
    maxres: "maxresdefault",
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}
