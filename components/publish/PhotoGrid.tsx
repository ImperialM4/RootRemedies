import Image from "next/image";
import { cn } from "@/lib/utils";

interface Photo { src: string; alt: string; }
interface PhotoGridProps { photos: Photo[]; caption?: string; columns?: 2|3|4|5; className?: string; }

const colMap = { 2:"grid-cols-2", 3:"grid-cols-3", 4:"grid-cols-2 sm:grid-cols-4", 5:"grid-cols-3 sm:grid-cols-5" };

export function PhotoGrid({ photos, caption, columns = 4, className }: PhotoGridProps) {
  return (
    <figure className={cn("my-8", className)}>
      <div className={cn("grid gap-2", colMap[columns])}>
        {photos.map((photo, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-md bg-bark-100 dark:bg-bark-800">
            <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="20vw" />
          </div>
        ))}
      </div>
      {caption && <figcaption className="text-sm text-muted italic mt-3 text-center">{caption}</figcaption>}
    </figure>
  );
}
