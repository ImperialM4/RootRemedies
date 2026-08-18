import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type WarningVariant = "warning" | "info" | "success" | "danger";

interface WarningBoxProps {
  variant?: WarningVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  WarningVariant,
  { container: string; title: string; text: string; Icon: React.ElementType }
> = {
  warning: {
    container: "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800",
    title:     "text-amber-800 dark:text-amber-300",
    text:      "text-amber-700 dark:text-amber-400",
    Icon: AlertTriangle,
  },
  info: {
    container: "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800",
    title:     "text-blue-800 dark:text-blue-300",
    text:      "text-blue-700 dark:text-blue-400",
    Icon: Info,
  },
  success: {
    container: "bg-sage-50 dark:bg-sage-950/30 border-sage-300 dark:border-sage-800",
    title:     "text-sage-800 dark:text-sage-300",
    text:      "text-sage-700 dark:text-sage-400",
    Icon: CheckCircle,
  },
  danger: {
    container: "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800",
    title:     "text-red-800 dark:text-red-300",
    text:      "text-red-700 dark:text-red-400",
    Icon: XCircle,
  },
};

export function WarningBox({
  variant = "warning",
  title,
  children,
  className,
}: WarningBoxProps) {
  const { container, title: titleCls, text, Icon } = variantConfig[variant];

  return (
    <div
      role="note"
      className={cn("flex gap-3 p-4 rounded-lg border", container, className)}
    >
      <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", titleCls)} aria-hidden />
      <div className="flex-1 min-w-0">
        {title && (
          // <span> + block display instead of <p>. The title is always a plain
          // string prop — never MDX children — but <p> inside a flex <div> that
          // itself lives inside MDX prose can still trigger nesting warnings in
          // strict HTML parsers. A block <span> is semantically equivalent here.
          <span
            className={cn(
              "block font-semibold text-sm mb-1",
              titleCls
            )}
          >
            {title}
          </span>
        )}
        {/*
          <div> wrapping MDX children is valid: div > p is legal HTML.
          The [&>p] selectors collapse the default MDX paragraph margins so
          the spacing inside the box stays tight and intentional.
        */}
        <div
          className={cn(
            "text-sm leading-relaxed [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0",
            text
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
