import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Medical and legal disclaimer for RootRemedies.",
  alternates: { canonical: canonicalUrl("/disclaimer") },
};

export default function DisclaimerPage() {
  return (
    <div className="site-container py-10">
      <Breadcrumbs items={[{ label: "Disclaimer" }]} className="mb-6" />
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl font-bold text-primary mb-6">Disclaimer</h1>
        <div className="space-y-5 text-sm text-body leading-relaxed">
          <p className="text-base font-medium text-primary">Last updated: {new Date().getFullYear()}</p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8 mb-3">Not Medical Advice</h2>
          <p>
            The content on RootRemedies is for informational purposes only. It does not constitute
            medical advice, diagnosis, or treatment. Nothing on this site should replace professional
            medical advice, diagnosis, or treatment from a qualified healthcare provider.
          </p>
          <p>
            Always seek the advice of your physician or another qualified health provider with any
            questions about a medical condition. Never disregard professional medical advice or delay
            in seeking it because of something you read here.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8 mb-3">No Endorsement</h2>
          <p>
            The remedies documented here are traditional and folk practices recorded for informational
            purposes. Their inclusion does not constitute an endorsement of their safety or effectiveness.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8 mb-3">Safety</h2>
          <p>
            Natural substances can cause allergic reactions, interact with medications, or be harmful
            in certain quantities or for certain individuals. Always consult a healthcare professional
            before trying any remedy.
          </p>

          <h2 className="font-serif text-xl font-semibold text-primary mt-8 mb-3">Accuracy</h2>
          <p>
            While we strive for accuracy in documenting traditional practices, we make no warranties
            about the completeness, reliability, or accuracy of any information on this site.
          </p>
        </div>
      </div>
    </div>
  );
}
