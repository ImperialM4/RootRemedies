import { cn } from "@/lib/utils";

interface TwoColumnProps {
  children: React.ReactNode;
  ratio?: "1:1" | "2:1" | "1:2";
  gap?: "sm" | "md" | "lg";
  reverseOnMobile?: boolean;
  className?: string;
}

const ratioClasses: Record<string, string> = {
  "1:1": "md:grid-cols-2",
  "2:1": "md:grid-cols-[2fr_1fr]",
  "1:2": "md:grid-cols-[1fr_2fr]",
};
const gapClasses = { sm: "gap-6", md: "gap-8 md:gap-12", lg: "gap-12 md:gap-16" };

export function TwoColumn({ children, ratio = "1:1", gap = "md", reverseOnMobile = false, className }: TwoColumnProps) {
  return (
    <div className={cn(
      "grid grid-cols-1",
      ratioClasses[ratio],
      gapClasses[gap],
      reverseOnMobile && "flex flex-col-reverse md:grid",
      "my-8",
      className
    )}>
      {children}
    </div>
  );
}
