import { cn } from "@/lib/utils";

interface VideoEmbedProps { src: string; title: string; caption?: string; poster?: string; className?: string; }

export function VideoEmbed({ src, title, caption, poster, className }: VideoEmbedProps) {
  return (
    <figure className={cn("my-8 rounded-xl overflow-hidden border border-bark-200 dark:border-bark-700", className)}>
      <video
        controls preload="metadata" poster={poster}
        className="w-full aspect-video bg-bark-900"
        aria-label={title}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video element.
      </video>
      {caption && (
        <figcaption className="px-4 py-3 text-sm text-muted italic bg-bark-50 dark:bg-bark-800 border-t border-bark-200 dark:border-bark-700">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
