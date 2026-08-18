import { cn } from "@/lib/utils";

interface CalloutProps {
  children: React.ReactNode;
  title?: string;
  icon?: string;
  className?: string;
}

export function Callout({ children, title, icon, className }: CalloutProps) {
  return (
    <div
      className={cn(
        "my-6 rounded-xl p-5 border",
        "bg-sage-50 dark:bg-sage-950/30 border-sage-200 dark:border-sage-800",
        className
      )}
    >
      {(icon || title) && (
        <div className="flex items-center gap-2 mb-2">
          {icon && (
            <span aria-hidden className="text-lg leading-none">
              {icon}
            </span>
          )}
          {title && (
            // <span> not <p> — title is always a plain string, never MDX children.
            // Using <p> here would produce <p><p>…</p></p> if this component
            // ever appeared inside prose-generated paragraph context.
            <span className="font-semibold text-sage-800 dark:text-sage-300 text-sm">
              {title}
            </span>
          )}
        </div>
      )}
      {/*
        <div> can contain <p> — valid HTML. MDX paragraph children render
        as <div><p>…</p></div> which is perfectly legal.
      */}
      <div className="text-sm text-sage-700 dark:text-sage-400 leading-relaxed [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
