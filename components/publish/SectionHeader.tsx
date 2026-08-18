import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ title, subtitle, align = "left", className }: SectionHeaderProps) {
  return (
    <div className={cn(
      "mb-8 mt-12",
      align === "center" && "text-center",
      className
    )}>
      <h2 className={cn(
        "font-serif text-2xl md:text-3xl font-bold text-primary tracking-tight",
        align === "center" && "mx-auto"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "mt-2 text-base text-muted leading-relaxed max-w-2xl",
          align === "center" && "mx-auto"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
