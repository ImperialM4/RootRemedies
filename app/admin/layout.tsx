import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — RootRemedies",
  robots: { index: false, follow: false },
};

// The admin section is protected by a password check in app/admin/login and
// a server-verified ADMIN_SECRET header on every /api/analytics* request —
// see app/admin/page.tsx and app/admin/login/page.tsx.
//
// This layout is nested inside the root layout (app/layout.tsx), not a
// separate route group, so it must NOT render its own <html>/<body> — there
// is already exactly one of each for the whole app. Instead it just applies
// the admin section's dark theme to a wrapping <div>; SiteChrome (in the
// root layout) is what keeps the public Navbar/Newsletter/Footer off of
// every route under /admin.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bark-950 text-bark-100 font-sans antialiased">
      {children}
    </div>
  );
}
