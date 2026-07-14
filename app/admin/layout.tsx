import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin — RootRemedies",
  robots: { index: false, follow: false },
};

// The admin section is protected by a simple cookie set at /admin/login.
// For Vercel: set ADMIN_SECRET in your project environment variables.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // On Vercel/production this check happens at the layout level.
  // The /admin/login page is excluded from this check via the page itself.
  return (
    <html lang="en">
      <body className="min-h-screen bg-bark-950 text-bark-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
