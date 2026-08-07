// ─────────────────────────────────────────────────────────────────────────────
// components/icons/CategoryIcons.tsx
// Hand-drawn line icons for each condition category, styled to match the
// bold, rounded-stroke look of the site's brand mark (mortar & pestle logo).
// Each icon uses `currentColor` so it can be tinted per-category via CSS.
// ─────────────────────────────────────────────────────────────────────────────
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Digestive — stomach with a small intestinal coil. */
export function DigestiveIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M23 6c0 0-.5 4 0 7 .5 3 3 3.5 6 5 4 2 5.5 6 4.5 10-1.1 4.3-5.5 7-10 6.3-4-.6-6.5-3.8-6.2-7.5" />
      <path d="M17.3 26.8c-1.7.3-3.3-.8-3.5-2.7-.2-1.9 1.2-3.5 3.1-3.6 1.9-.1 3.3 1.3 3.4 3.1" />
    </svg>
  );
}

/** Respiratory — lungs with a trachea. */
export function RespiratoryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 8v12" />
      <path d="M24 15c0 0-3 .5-4.5 2.5-1.5 2-1.2 4.5-1.2 4.5" />
      <path d="M24 15c0 0 3 .5 4.5 2.5 1.5 2 1.2 4.5 1.2 4.5" />
      <path d="M18.3 21c-2.8-.7-5.8 1-6.3 5-.5 4.5 1.5 9.5 5.5 10.5 2.5.6 4-1 4-3.5l-.2-10.5" />
      <path d="M29.7 21c2.8-.7 5.8 1 6.3 5 .5 4.5-1.5 9.5-5.5 10.5-2.5.6-4-1-4-3.5l.2-10.5" />
    </svg>
  );
}

/** Ear Health — outer ear (auricle). */
export function EarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M27 10c-6 0-11 5-11 12 0 5 3 6.5 3 10.5 0 3 2 5.5 5 5.5s5-2.5 5-5.5" />
      <path d="M27 10c6 0 10 5.5 9.5 12-.3 4.5-3.5 5.5-5 2.5-1-2-4-2-5 .5-.8 2-3.5 2-4-.5-.4-1.9 1-3.7 3-3.5 1.5.2 1.8 1.7.8 2.5" />
    </svg>
  );
}

/** General Health — heart with a pulse line. */
export function GeneralHealthIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 35c0 0-14-8.5-14-17.5 0-5 3.8-8 8-8 3 0 5 1.8 6 4 1-2.2 3-4 6-4 4.2 0 8 3 8 8 0 9-14 17.5-14 17.5z" />
      <path d="M13 20h5l2.5-4.5 3 9.5 2.5-6 2 3 2.5-2h5" />
    </svg>
  );
}

/** Fallback — small sprig/leaf, echoes the logo's leaf motif. */
export function GeneralIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 34c-2-10 2-22 16-25 3-.7 5 0 5 0s.5 2.5-.5 6c-3 11-14.5 17-20.5 19z" />
      <path d="M14 34c4-7 10-13 18-18" />
    </svg>
  );
}
