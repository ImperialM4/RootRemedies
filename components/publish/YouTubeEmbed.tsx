"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getYouTubeThumbnail, getYouTubeEmbedUrl } from "@/lib/utils";
import { track } from "@/lib/analytics/track";

interface YouTubeEmbedProps { videoId: string; title: string; caption?: string; className?: string; }

export function YouTubeEmbed({ videoId, title, caption, className }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const pathname  = usePathname();
  const startTime = useRef<number>(0);

  const handlePlay = () => {
    setPlaying(true);
    startTime.current = Date.now();
    track.videoPlay(videoId, pathname);
  };

  // Listen for postMessage from the iframe to detect completion (YouTube API)
  useEffect(() => {
    if (!playing) return;
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        // YouTube sends {event:"onStateChange", info:0} when video ends
        if (data?.event === "onStateChange" && data?.info === 0) {
          track.videoComplete(videoId, pathname);
        }
      } catch { /* ignore non-JSON messages */ }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [playing, videoId, pathname]);

  return (
    <figure className={cn("my-8 rounded-xl overflow-hidden border border-bark-200 dark:border-bark-700", className)}>
      <div className="relative aspect-video bg-bark-900">
        {playing ? (
          <iframe
            src={`${getYouTubeEmbedUrl(videoId)}&autoplay=1&enablejsapi=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <>
            <Image
              src={getYouTubeThumbnail(videoId, "hq")}
              alt={`Thumbnail: ${title}`}
              fill className="object-cover"
              sizes="(max-width:768px) 100vw, 720px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bark-900/60 via-transparent to-transparent" />
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label={`Play: ${title}`}
            >
              <div className="w-16 h-16 bg-white/95 group-hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-base group-hover:scale-105">
                <Play className="w-7 h-7 text-bark-900 ml-1" fill="currentColor" />
              </div>
            </button>
          </>
        )}
      </div>
      {caption && (
        <figcaption className="px-4 py-3 text-sm text-muted italic bg-bark-50 dark:bg-bark-800 border-t border-bark-200 dark:border-bark-700">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
