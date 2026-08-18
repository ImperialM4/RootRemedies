"use client";
import { useScrollDepth } from "@/hooks/useScrollDepth";

// Invisible component — just activates the scroll depth hook.
// Mount anywhere in a page to start tracking scroll milestones.
export function ScrollDepthTracker() {
  useScrollDepth();
  return null;
}
