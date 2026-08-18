import { Leaf, Wrench } from "lucide-react";
import type { RemedyIngredient, RemedyEquipment } from "@/types";
import { cn } from "@/lib/utils";

interface IngredientListProps {
  ingredients: RemedyIngredient[];
  equipment?: RemedyEquipment[];
  className?: string;
}

export function IngredientList({ ingredients, equipment, className }: IngredientListProps) {
  return (
    <div className={cn("grid sm:grid-cols-2 gap-6", className)}>
      <div>
        <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted mb-3">
          <Leaf className="w-3.5 h-3.5 text-accent" aria-hidden /> Ingredients
        </h4>
        <ul className="space-y-2">
          {ingredients.map((ing, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="shrink-0 w-4 h-4 mt-0.5 rounded border border-bark-300 dark:border-bark-600 bg-surface-card inline-block" aria-hidden />
              <span className="text-body leading-snug">
                {ing.amount && <span className="font-medium text-primary mr-1">{ing.amount}</span>}
                {ing.item}
                {ing.notes && <span className="text-muted italic ml-1">({ing.notes})</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {equipment?.length ? (
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted mb-3">
            <Wrench className="w-3.5 h-3.5 text-muted" aria-hidden /> Equipment
          </h4>
          <ul className="space-y-2">
            {equipment.map((eq, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="shrink-0 w-4 h-4 mt-0.5 rounded border border-bark-300 dark:border-bark-600 bg-surface-card inline-block" aria-hidden />
                <span className="text-body leading-snug">
                  {eq.item}
                  {eq.notes && <span className="text-muted italic ml-1">({eq.notes})</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
