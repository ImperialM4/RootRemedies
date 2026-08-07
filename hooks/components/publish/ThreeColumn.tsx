import { cn } from "@/lib/utils";

interface ThreeColumnProps {
  children: React.ReactNode;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const gapClasses = { sm: "gap-4", md: "gap-6 md:gap-8", lg: "gap-8 md:gap-12" };

export function ThreeColumn({ children, gap = "md", className }: ThreeColumnProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      gapClasses[gap],
      "my-8",
      className
    )}>
      {children}
    </div>
  );
}
