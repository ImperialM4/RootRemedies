import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bark: {
          50:  "#F7F4F0", 100: "#DCCEA8", 200: "#C7B48D", 300: "#C2B09A",
          400: "#A8917A", 500: "#8C7460", 600: "#6D5A4A", 700: "#4F4134",
          800: "#342B22", 900: "#1C1712", 950: "#100D0A",
        },
        sage: {
          50:  "#F8F1F0", 100: "#F0E0DB", 200: "#E6C6BC", 300: "#D79F8E",
          400: "#C87259", 500: "#A34D33", 600: "#843D27", 700: "#612C1C",
          800: "#3F1D12", 900: "#22110B", 950: "#120A07",
        },
        clay: {
          50:  "#FBF4EF", 100: "#F5E4D6", 200: "#EAC5AB", 300: "#DE9F7A",
          400: "#CF7649", 500: "#B85C2C", 600: "#924621", 700: "#6B3118",
          800: "#461F0E", 900: "#230F07", 950: "#150903",
        },
        cream: "#FAFAF7",
      },
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
        sans:  ["Inter", "system-ui", "sans-serif"],
        mono:  ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body":          "var(--color-text-body)",
            "--tw-prose-headings":      "var(--color-text-primary)",
            "--tw-prose-links":         "var(--color-accent)",
            "--tw-prose-bold":          "var(--color-text-primary)",
            "--tw-prose-counters":      "var(--color-text-muted)",
            "--tw-prose-bullets":       "var(--color-accent)",
            "--tw-prose-hr":            "var(--color-border)",
            "--tw-prose-quotes":        "var(--color-text-body)",
            "--tw-prose-quote-borders": "var(--color-accent)",
            "--tw-prose-code":          "var(--color-text-primary)",
            "--tw-prose-pre-code":      "var(--color-bg-subtle)",
            "--tw-prose-pre-bg":        "var(--color-bg-card)",
            "--tw-prose-captions":      "var(--color-text-muted)",
            maxWidth: "68ch",
            lineHeight: "1.8",
          },
        },
      },
      borderRadius: {
        lg: "0.5rem", md: "0.375rem", sm: "0.25rem",
      },
      transitionTimingFunction: {
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "fast": "150ms", "base": "250ms", "slow": "400ms",
      },
      animation: {
        "fade-up":  "fade-up  400ms cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":  "fade-in  250ms cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 250ms cubic-bezier(0.16,1,0.3,1) both",
      },
      keyframes: {
        "fade-up":  { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "fade-in":  { from: { opacity: "0" },                                to: { opacity: "1" } },
        "scale-in": { from: { opacity: "0", transform: "scale(0.96)" },      to: { opacity: "1", transform: "scale(1)" } },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
