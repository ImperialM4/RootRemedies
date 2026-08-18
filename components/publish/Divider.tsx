import { cn } from "@/lib/utils";

interface DividerProps {
  style?: "line" | "dots" | "leaf";
  label?: string;
  className?: string;
}

export function Divider({ style = "line", label, className }: DividerProps) {
  if (style === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-2 my-10", className)} aria-hidden>
        {[0,1,2].map((i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-bark-300 dark:bg-bark-600" />
        ))}
      </div>
    );
  }

  if (style === "leaf") {
    return (
      <div className={cn("flex items-center gap-4 my-10", className)} aria-hidden>
        <div className="flex-1 h-px bg-bark-200 dark:bg-bark-700" />
        <span className="text-bark-400 dark:text-bark-500 text-sm select-none">
          {label ?? "✦"}
        </span>
        <div className="flex-1 h-px bg-bark-200 dark:bg-bark-700" />
      </div>
    );
  }

  return (
    <hr className={cn(
      "my-10 border-none h-px bg-bark-200 dark:bg-bark-700",
      className
    )} aria-hidden />
  );
}
