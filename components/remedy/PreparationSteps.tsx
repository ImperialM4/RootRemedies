import type { RemedyStep } from "@/types";
import { cn } from "@/lib/utils";

interface PreparationStepsProps { steps: RemedyStep[]; className?: string; }

export function PreparationSteps({ steps, className }: PreparationStepsProps) {
  return (
    <div className={className}>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Preparation</h4>
      <ol className={cn("space-y-3")}>
        {steps.map((step, i) => (
          <li key={step.step ?? i} className="flex gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full bg-sage-100 dark:bg-sage-950/50 text-sage-700 dark:text-sage-400 text-xs font-bold flex items-center justify-center mt-0.5">
              {step.step ?? i + 1}
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-sm text-body leading-relaxed">{step.instruction}</p>
              {step.tip && <p className="mt-1 text-xs text-accent italic">💡 {step.tip}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
