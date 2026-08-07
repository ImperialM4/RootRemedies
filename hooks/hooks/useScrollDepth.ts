"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics/track";

export function useScrollDepth() {
  const pathname = usePathname();
  const fired    = useRef(new Set<number>());

  useEffect(() => {
    fired.current.clear();

    const onScroll = () => {
      const scrolled   = window.scrollY + window.innerHeight;
      const total      = document.documentElement.scrollHeight;
      const pct        = Math.round((scrolled / total) * 100);

      for (const milestone of [25, 50, 75, 100] as const) {
        if (pct >= milestone && !fired.current.has(milestone)) {
          fired.current.add(milestone);
          track.scrollDepth(milestone, pathname);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
}
