"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: "default" | "primary";
}

export function CopyButton({ text, label = "Copy", variant = "default" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={cn(
        "flex items-center gap-1.5 text-xs rounded-md px-2.5 py-1.5 font-medium transition-all",
        variant === "primary"
          ? "bg-sage-600 text-white hover:bg-sage-700 dark:bg-sage-500 dark:hover:bg-sage-600"
          : "text-muted hover:text-primary bg-bark-100 dark:bg-bark-700 hover:bg-bark-200 dark:hover:bg-bark-600"
      )}
      aria-label={`Copy ${label}`}
    >
      {copied
        ? <><Check className="w-3 h-3 text-sage-400" />{label === "Copy" ? "Copied!" : `${label} copied!`}</>
        : <><Copy className="w-3 h-3" />{label}</>
      }
    </button>
  );
}
