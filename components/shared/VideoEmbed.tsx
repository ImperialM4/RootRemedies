"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { getYouTubeThumbnail, getYouTubeEmbedUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface VideoEmbedProps { videoId: string; title: string; caption?: string; className?: string; }

export function VideoEmbed({ videoId, title, caption, className }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className={cn("my-6 rounded-xl overflow-hidden border border-bark-200 dark:border-bark-700", className)}>
      <div className="relative aspect-video bg-bark-900">
        {playing ? (
          <iframe src={`${getYouTubeEmbedUrl(videoId)}&autoplay=1`} title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen className="absolute inset-0 w-full h-full" />
        ) : (
          <>
            <Image src={getYouTubeThumbnail(videoId, "hq")} alt={`Video: ${title}`}
              fill className="object-cover" sizes="(max-width:768px) 100vw, 720px" />
            <div className="absolute inset-0 bg-bark-900/30" />
            <button onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group" aria-label={`Play: ${title}`}>
              <div className="w-16 h-16 bg-white/90 group-hover:bg-white rounded-full flex items-center justify-center transition-all duration-base shadow-lg group-hover:scale-105">
                <Play className="w-7 h-7 text-bark-900 ml-1" fill="currentColor" />
              </div>
            </button>
          </>
        )}
      </div>
      {caption && (
        <figcaption className="px-4 py-2.5 bg-bark-50 dark:bg-bark-800 text-xs text-muted border-t border-bark-200 dark:border-bark-700">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
