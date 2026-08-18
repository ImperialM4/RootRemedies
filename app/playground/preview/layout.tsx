// Isolated layout for the preview iframe.
// Opts out of the root layout (no Navbar, no Footer) so the iframe
// renders only the component on a clean canvas.
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-bark-900 antialiased p-8">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
