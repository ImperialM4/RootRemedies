"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics/track";

interface GalleryImage { src: string; alt: string; caption?: string; }

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const colMap = { 2: "grid-cols-2", 3: "grid-cols-2 md:grid-cols-3", 4: "grid-cols-2 md:grid-cols-4" };

export function ImageGallery({ images, columns = 3, className }: ImageGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const pathname = usePathname();

  const open = (i: number) => {
    setActiveIdx(i);
    dialogRef.current?.showModal();
    track.galleryInteraction(undefined, pathname);
  };
  const close = () => dialogRef.current?.close();
  const prev  = () => setActiveIdx((i) => (i - 1 + images.length) % images.length);
  const next  = () => setActiveIdx((i) => (i + 1) % images.length);

  return (
    <>
      <div className={cn("grid gap-3 my-8", colMap[columns], className)}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => open(i)}
            className="relative aspect-square overflow-hidden rounded-lg bg-bark-100 dark:bg-bark-800 cursor-zoom-in group"
            aria-label={`View: ${img.alt}`}
          >
            <Image
              src={img.src} alt={img.alt} fill
              className="object-cover transition-transform duration-slow group-hover:scale-105"
              sizes={`(max-width:768px) 50vw, ${Math.round(100/columns)}vw`}
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="w-screen h-screen flex items-center justify-center"
        onClick={(e) => { if (e.target === dialogRef.current) close(); }}
      >
        <div className="relative max-w-4xl w-full mx-4 animate-scale-in">
          <button onClick={close} className="absolute -top-10 right-0 text-white/80 hover:text-white p-2" aria-label="Close">
            <X className="w-6 h-6" />
          </button>
          <Image
            src={images[activeIdx].src} alt={images[activeIdx].alt}
            width={1200} height={800} className="object-contain rounded-lg max-h-[80vh] w-full"
          />
          {images[activeIdx].caption && (
            <p className="text-center text-white/70 text-sm mt-3">{images[activeIdx].caption}</p>
          )}
          {images.length > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button onClick={prev} className="p-2 text-white/70 hover:text-white transition-colors" aria-label="Previous">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-white/50 text-sm">{activeIdx + 1} / {images.length}</span>
              <button onClick={next} className="p-2 text-white/70 hover:text-white transition-colors" aria-label="Next">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
