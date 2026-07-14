import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  cta?: { label: string; href: string };
  className?: string;
}

export function HeroSection({
  title, subtitle, eyebrow, align = "left", cta, className,
}: HeroSectionProps) {
  return (
    <section className={cn(
      "py-16 md:py-24",
      align === "center" && "text-center",
      className
    )}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-4 animate-fade-up">
          {eyebrow}
        </p>
      )}
      <h1 className={cn(
        "font-serif font-bold tracking-tight text-primary animate-fade-up stagger-1",
        "text-4xl sm:text-5xl lg:text-6xl leading-[1.1]",
        align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl"
      )}>
        {title}
      </h1>
      {subtitle && (
        <p className={cn(
          "mt-6 text-lg md:text-xl text-muted leading-relaxed animate-fade-up stagger-2",
          align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
        )}>
          {subtitle}
        </p>
      )}
      {cta && (
        <div className={cn("mt-8 animate-fade-up stagger-3", align === "center" && "flex justify-center")}>
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 bg-sage-600 dark:bg-sage-500 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-sage-700 dark:hover:bg-sage-400 transition-colors"
          >
            {cta.label}
          </Link>
        </div>
      )}
    </section>
  );
}
