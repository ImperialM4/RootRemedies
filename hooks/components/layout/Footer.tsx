import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-bark-200 dark:border-bark-800 mt-16 bg-bark-50 dark:bg-bark-900/50">
      <div className="site-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors w-fit group">
              <div className="w-7 h-7 rounded-md bg-[#F8F1F0] flex items-center justify-center p-1 transition-transform group-hover:scale-105">
                <Image
                  src="/images/brand/logo-icon.png"
                  alt=""
                  width={28}
                  height={31}
                  className="h-full w-auto"
                />
              </div>
              <span className="font-serif font-semibold">RootRemedies</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Traditional home remedies documented by Maanav Kakkad. Not medical advice.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-faint mb-4">Explore</h3>
            <ul className="space-y-2">
              {[
                { label: "All Conditions", href: "/conditions" },
                { label: "Categories",     href: "/categories" },
                { label: "About",          href: "/about" },
                { label: "Playground",     href: "/playground" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-faint mb-4">Legal</h3>
            <ul className="space-y-2">
              {[
                { label: "Disclaimer", href: "/disclaimer" },
                { label: "Contact",   href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-bark-200 dark:border-bark-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-faint">
          <p>© {currentYear} Maanav Kakkad. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Not medical advice.{" "}
            <Link href="/disclaimer" className="underline hover:text-muted transition-colors">Read our disclaimer.</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
