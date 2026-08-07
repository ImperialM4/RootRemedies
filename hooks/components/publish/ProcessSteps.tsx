// ProcessSteps — renders only the preparation steps of a remedy.
import { cn } from "@/lib/utils";
import type { Remedy } from "@/types";

interface ProcessStepsProps { remedy: Remedy; className?: string; }

export function ProcessSteps({ remedy, className }: ProcessStepsProps) {
  return (
    <div className={cn("my-6 not-prose", className)}>
      <h4 className="text-sm font-semibold text-muted uppercase tracking-widest mb-4">
        Preparation — {remedy.title}
      </h4>
      <ol className="space-y-4">
        {remedy.preparationSteps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <div className="shrink-0 w-7 h-7 rounded-full bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-400 text-xs font-bold flex items-center justify-center mt-0.5">
              {step.step ?? i + 1}
            </div>
            <div className="pt-0.5">
              <p className="text-sm text-body leading-relaxed">{step.instruction}</p>
              {step.tip && <p className="text-xs text-accent italic mt-1">💡 {step.tip}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
