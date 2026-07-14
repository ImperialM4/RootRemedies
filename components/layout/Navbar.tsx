"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchDialog } from "@/components/shared/SearchDialog";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Conditions", href: "/conditions" },
  { label: "Categories", href: "/categories" },
  { label: "About",      href: "/about" },
];

export function Navbar() {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 w-full backdrop-blur-md border-b transition-all duration-200",
        "bg-white/90 dark:bg-bark-900/90",
        scrolled
          ? "shadow-sm border-bark-200 dark:border-bark-800"
          : "border-transparent"
      )}>
        <div className="site-container">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-9 h-9 rounded-lg bg-[#F8F1F0] flex items-center justify-center p-1 transition-transform group-hover:scale-105">
                <Image
                  src="/images/brand/logo-icon.png"
                  alt="RootRemedies"
                  width={36}
                  height={40}
                  className="h-full w-auto"
                  priority
                />
              </div>
              <span className="font-serif font-semibold text-lg tracking-tight text-bark-900 dark:text-bark-50 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
                RootRemedies
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5" aria-label="Primary navigation">
              {navLinks.map((link) => {
                const active = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link key={link.href} href={link.href} className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-sage-100 text-sage-700 dark:bg-sage-900/40 dark:text-sage-300"
                      : "text-bark-600 dark:text-bark-400 hover:text-bark-900 dark:hover:text-bark-100 hover:bg-bark-100 dark:hover:bg-bark-800"
                  )}>
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors",
                  "border-bark-200 dark:border-bark-700 bg-white/60 dark:bg-bark-800/60",
                  "text-bark-500 dark:text-bark-400 hover:text-bark-700 dark:hover:text-bark-200",
                  "hover:border-bark-300 dark:hover:border-bark-600"
                )}
                aria-label="Search conditions"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
                <kbd className="text-xs bg-bark-100 dark:bg-bark-700 text-bark-400 dark:text-bark-500 px-1.5 py-0.5 rounded border border-bark-200 dark:border-bark-600 font-mono">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 rounded-lg text-bark-500 dark:text-bark-400 hover:bg-bark-100 dark:hover:bg-bark-800 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              <ThemeToggle />

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-bark-600 dark:text-bark-400 hover:bg-bark-100 dark:hover:bg-bark-800 transition-colors"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-bark-200 dark:border-bark-800 bg-white dark:bg-bark-900 animate-fade-in">
            <nav className="site-container py-3 flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => {
                const active = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link key={link.href} href={link.href} className={cn(
                    "px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-sage-100 text-sage-700 dark:bg-sage-900/40 dark:text-sage-300"
                      : "text-bark-700 dark:text-bark-300 hover:bg-bark-100 dark:hover:bg-bark-800"
                  )}>
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
