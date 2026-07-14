import Image from "next/image";
import { cn } from "@/lib/utils";

interface FullWidthImageProps {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  height?: "sm" | "md" | "lg";
  className?: string;
}

const heightMap = { sm: "h-48 md:h-64", md: "h-64 md:h-96", lg: "h-80 md:h-[32rem]" };

export function FullWidthImage({ src, alt, caption, credit, height = "md", className }: FullWidthImageProps) {
  return (
    <figure className={cn("my-10 -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-16", className)}>
      <div className={cn("relative w-full overflow-hidden bg-bark-100 dark:bg-bark-900", heightMap[height])}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" />
      </div>
      {(caption || credit) && (
        <figcaption className="flex items-start justify-between gap-4 px-4 sm:px-6 lg:px-8 pt-3">
          {caption && <span className="text-sm text-muted italic">{caption}</span>}
          {credit  && <span className="text-xs text-faint shrink-0">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
