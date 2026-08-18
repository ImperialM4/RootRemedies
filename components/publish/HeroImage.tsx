import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroImageProps {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  priority?: boolean;
  className?: string;
}

export function HeroImage({ src, alt, caption, credit, priority = false, className }: HeroImageProps) {
  return (
    <figure className={cn("my-8 -mx-4 sm:-mx-6 lg:-mx-8", className)}>
      <div className="relative w-full aspect-[21/9] overflow-hidden bg-bark-100 dark:bg-bark-800">
        <Image
          src={src} alt={alt} fill priority={priority}
          className="object-cover"
          sizes="100vw"
        />
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
