import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with RootRemedies.",
  alternates: { canonical: canonicalUrl("/contact") },
};

export default function ContactPage() {
  return (
    <div className="site-container py-10">
      <Breadcrumbs items={[{ label: "Contact" }]} className="mb-6" />

      <div className="max-w-lg">
        <h1 className="font-serif text-3xl font-bold text-bark-900 mb-4">Contact</h1>
        <p className="text-bark-600 mb-8 leading-relaxed">
          For corrections, questions, or feedback about the content on this site,
          please reach out.
        </p>

        {/* 
          Replace the email below with your real contact email.
          Or replace this entire section with a contact form.
        */}
        <div className="bg-white border border-bark-200 rounded-xl p-6">
          <p className="text-sm text-bark-500 mb-3">Email</p>
          <a
            href="mailto:hello@rootremedies.com"
            className="text-sage-600 hover:text-sage-700 font-medium underline underline-offset-2"
          >
            hello@rootremedies.com
          </a>
        </div>

        <p className="text-xs text-bark-400 mt-6">
          For medical questions, please consult a healthcare professional — we
          cannot give medical advice.
        </p>
      </div>
    </div>
  );
}
