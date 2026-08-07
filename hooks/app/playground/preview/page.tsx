// /playground/preview?component=Quote
// Isolated component renderer used by the Playground iframe previews.
import { notFound } from "next/navigation";
import { getComponentEntry } from "@/components/publish/registry";
import { PreviewRenderer } from "./PreviewRenderer";

interface PreviewPageProps {
  searchParams: Promise<{ component?: string }>;
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const { component } = await searchParams;
  if (!component) notFound();

  const entry = getComponentEntry(component);
  if (!entry) notFound();

  return <PreviewRenderer entry={entry} />;
}
