import { cn } from "@/lib/utils";

interface PullQuoteProps {
  children: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function PullQuote({ children, align = "left", className }: PullQuoteProps) {
  return (
    // <aside> can contain <p> — valid HTML, no nesting issue.
    // not-prose removes Tailwind prose overrides so pull-quote CSS applies cleanly.
    // [&>p] resets collapse MDX paragraph spacing so the aside controls all spacing.
    <aside
      className={cn(
        "pull-quote my-10 not-prose",
        "[&>p]:m-0 [&>p]:p-0",
        align === "center" &&
          "text-center border-l-0 border-t-4 border-b-4 border-x-0 py-6 px-0",
        className
      )}
    >
      {children}
    </aside>
  );
}
