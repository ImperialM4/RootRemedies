import Image from "next/image";
import { VideoEmbed } from "@/components/shared/VideoEmbed";
import { cn } from "@/lib/utils";
import type { Remedy } from "@/types";

interface RemedyCardProps {
  remedy: Remedy;
  className?: string;
}

// Renders the practical details of a remedy: the image + ingredients/preparation
// as a single cohesive recipe-card unit, followed by "How to use" and any notes/
// safety notes as regular flowing article text underneath (not boxed in the card).
// The remedy's name and description are handled by the SectionHeader that precedes
// this in the article, so they are intentionally not repeated here.
export function RemedyCard({ remedy, className }: RemedyCardProps) {
  const asides = [remedy.notes, ...(remedy.safetyNotes ?? [])].filter(
    (v): v is string => Boolean(v)
  );

  return (
    <div className={cn("my-4", className)}>
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">
        {/* Image column — ~45% on desktop, full-width stacked above on tablet/mobile */}
        <div className="group relative w-full lg:w-[45%] shrink-0 aspect-[4/3] lg:aspect-auto overflow-hidden">
          {remedy.image ? (
            <>
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={remedy.image}
                  alt={remedy.imageAlt || remedy.title}
                  width={remedy.imageWidth ?? 1100}
                  height={remedy.imageHeight ?? 900}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                />
              </div>
              {/* Hover watermark treatment */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-md bg-white/95 flex items-center justify-center p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <Image
                  src="/images/brand/logo-icon.png"
                  alt=""
                  width={28}
                  height={31}
                  className="w-full h-auto"
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src="/images/brand/logo-mat-fallback.png"
                alt={`${remedy.title} — photo coming soon`}
                width={320}
                height={320}
                className="w-2/3 max-w-[200px] h-auto opacity-90"
              />
            </div>
          )}
        </div>

        {/* Recipe column — ~55% on desktop */}
        <div className="flex-1 lg:w-[55%] flex flex-col justify-center min-w-0">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
              Ingredients
            </h4>
            <ul className="space-y-1.5 text-sm text-body leading-relaxed">
              {remedy.ingredients.map((ing, i) => (
                <li key={i}>
                  {ing.amount && (
                    <span className="font-medium text-primary">{ing.amount} </span>
                  )}
                  {ing.item}
                  {ing.notes && <span className="text-muted italic"> ({ing.notes})</span>}
                </li>
              ))}
            </ul>

            {remedy.equipment?.length ? (
              <>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mt-3.5 mb-2">
                  Equipment
                </h4>
                <ul className="space-y-1.5 text-sm text-body leading-relaxed">
                  {remedy.equipment.map((eq, i) => (
                    <li key={i}>
                      {eq.item}
                      {eq.notes && <span className="text-muted italic"> ({eq.notes})</span>}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
              Preparation
            </h4>
            <ol className="space-y-1.5 text-sm text-body leading-relaxed list-decimal list-outside pl-4 marker:text-muted">
              {remedy.preparationSteps.map((step, i) => (
                <li key={step.step ?? i}>
                  {step.instruction}
                  {step.tip && (
                    <span className="block text-xs text-accent italic mt-0.5">
                      Tip: {step.tip}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <p className="mt-5 leading-relaxed">
        <span className="font-semibold text-primary">How to use: </span>
        {remedy.usageInstructions}
      </p>

      {asides.length > 0 && (
        <p className="mt-3 text-sm text-muted italic leading-relaxed">
          {asides.join(" ")}
        </p>
      )}

      {remedy.videoId && (
        <div className="mt-4">
          <VideoEmbed
            videoId={remedy.videoId}
            title={`Video: ${remedy.title}`}
            caption={`Demonstration: ${remedy.title}`}
          />
        </div>
      )}
    </div>
  );
}
