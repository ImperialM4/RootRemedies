// IngredientTable — renders only the ingredients section of a remedy.
// Wired to the remedyMap in MDXComponents.tsx.
// This file defines the visual; the data lookup is in the MDX registry.
import { cn } from "@/lib/utils";
import type { Remedy } from "@/types";

interface IngredientTableProps { remedy: Remedy; className?: string; }

export function IngredientTable({ remedy, className }: IngredientTableProps) {
  return (
    <div className={cn("my-6 not-prose rounded-xl border border-bark-200 dark:border-bark-700 overflow-hidden", className)}>
      <div className="px-4 py-3 bg-bark-50 dark:bg-bark-800 border-b border-bark-200 dark:border-bark-700">
        <h4 className="text-sm font-semibold text-primary">Ingredients — {remedy.title}</h4>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-bark-200 dark:border-bark-700">
            <th className="text-left px-4 py-2 text-muted font-medium w-1/3">Amount</th>
            <th className="text-left px-4 py-2 text-muted font-medium">Ingredient</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bark-100 dark:divide-bark-800">
          {remedy.ingredients.map((ing, i) => (
            <tr key={i} className="hover:bg-bark-50 dark:hover:bg-bark-800/50 transition-colors">
              <td className="px-4 py-2.5 text-muted font-mono text-xs">{ing.amount ?? "—"}</td>
              <td className="px-4 py-2.5 text-body">
                {ing.item}
                {ing.notes && <span className="text-faint italic ml-1.5">({ing.notes})</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
