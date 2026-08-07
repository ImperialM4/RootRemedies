"use client";

import { useRef } from "react";
import Image from "next/image";
import { X, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

type Rounded = "none" | "sm" | "md" | "lg" | "full";
type Width   = "sm" | "md" | "lg" | "full";

interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  rounded?: Rounded;
  shadow?: boolean;
  border?: boolean;
  expandable?: boolean;
  width?: Width;
  className?: string;
}

const roundedMap: Record<Rounded, string> = {
  none: "rounded-none", sm: "rounded-sm", md: "rounded-md", lg: "rounded-xl", full: "rounded-full",
};
const widthMap: Record<Width, string> = {
  sm: "max-w-xs mx-auto", md: "max-w-md mx-auto", lg: "max-w-xl mx-auto", full: "w-full",
};

export function ImageWithCaption({
  src, alt, caption, credit, rounded = "md", shadow = false,
  border = false, expandable = false, width = "full", className,
}: ImageWithCaptionProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const imgClasses = cn(
    "object-cover w-full h-full transition-transform duration-slow",
    roundedMap[rounded],
    shadow && "shadow-lg",
    border && "border border-bark-200 dark:border-bark-700",
    expandable && "cursor-zoom-in hover:scale-[1.01]"
  );

  return (
    <>
      <figure className={cn("my-6", widthMap[width], className)}>
        <div
          className={cn("relative w-full aspect-[4/3] overflow-hidden", roundedMap[rounded])}
          onClick={() => expandable && dialogRef.current?.showModal()}
        >
          <Image src={src} alt={alt} fill className={imgClasses} sizes="(max-width:768px) 100vw, 720px" />
          {expandable && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/50 text-white rounded-md p-1.5 pointer-events-none">
              <Expand className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
        {(caption || credit) && (
          <figcaption className="flex items-start justify-between gap-3 pt-2.5">
            {caption && <span className="text-sm text-muted italic">{caption}</span>}
            {credit  && <span className="text-xs text-faint shrink-0">{credit}</span>}
          </figcaption>
        )}
      </figure>

      {/* Native dialog lightbox — zero dependency, fully accessible */}
      {expandable && (
        <dialog
          ref={dialogRef}
          className="w-screen h-screen flex items-center justify-center"
          onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current?.close(); }}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full mx-4 animate-scale-in">
            <button
              onClick={() => dialogRef.current?.close()}
              className="absolute -top-10 right-0 text-white/80 hover:text-white p-2 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={src} alt={alt} width={1200} height={800}
              className="object-contain rounded-lg max-h-[90vh] w-full"
            />
            {caption && <p className="text-center text-white/70 text-sm mt-3">{caption}</p>}
          </div>
        </dialog>
      )}
    </>
  );
}
