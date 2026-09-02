"use client";

import type { SVGProps } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { ExternalLink, Search } from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import CommandMenu from "@/components/layout/CommandMenu";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

const NAV_LINKS = [
  { href: PUBLIC_ROUTES.produits, label: "Produits" },
  { href: PUBLIC_ROUTES.casUsage, label: "Cas d’usage" },
  { href: PUBLIC_ROUTES.ecosysteme, label: "Écosystème" },
  { href: PUBLIC_ROUTES.partenaires, label: "Partenaires" },
  { href: PUBLIC_ROUTES.apropos, label: "À propos" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === PUBLIC_ROUTES.home) return pathname === PUBLIC_ROUTES.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function buildAccountHref(pathname: string) {
  const url = new URL(KORYXA_ACCOUNT_URL);
  url.searchParams.set("redirect_url", new URL(pathname || "/", "https://www.koryxa.fr").toString());
  return url.toString();
}

function IconMenu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconClose(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function PublicHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const { isLoaded, isSignedIn } = useUser();
  const accountHref = buildAccountHref(pathname || "/");

  // Listen for custom event from CommandMenu shortcut
  useEffect(() => {
    const handleOpenCommand = () => setCommandOpen(true);
    window.addEventListener("open-command-menu", handleOpenCommand);
    return () => window.removeEventListener("open-command-menu", handleOpenCommand);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="kx-public-header sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-[0_2px_20px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-colors duration-200 dark:border-[#1b3d29] dark:bg-[#07140c]/90 dark:shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
        <div className="mx-auto flex h-[68px] w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-800 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 lg:hidden"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>

            <Link href={PUBLIC_ROUTES.home} className="group flex shrink-0 items-center gap-2.5" aria-label="Accueil KORYXA">
              <BrandLogo className="h-9 w-9 rounded-xl object-cover shadow-sm transition group-hover:scale-105" />
              <span className="font-serif text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                KORY<span className="text-[#00a86b]">XA</span>
              </span>
            </Link>
          </div>

          {/* Center: Clean uncluttered Navigation */}
          <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors duration-150",
                    active
                      ? "bg-slate-100 text-[#00a86b] dark:bg-[#00a86b]/20 dark:text-[#4ade80]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Theme Toggle & Single Account CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compact Search Trigger */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#00a86b]/50 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
              title="Recherche rapide (Cmd + K)"
            >
              <Search className="h-3.5 w-3.5 text-[#00a86b]" />
              <span className="hidden sm:inline">Rechercher</span>
              <kbd className="hidden rounded bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-400 sm:inline">
                ⌘K
              </kbd>
            </button>

            <ThemeToggle showLabel={false} className="kx-theme-toggle" />

            {/* Single Account Action */}
            {isLoaded && isSignedIn ? (
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm dark:border-white/15 dark:bg-white/5">
                <span className="hidden text-xs font-bold text-slate-800 dark:text-[#86efac] sm:inline">
                  Compte actif
                </span>
                <UserButton />
              </div>
            ) : (
              <a
                href={accountHref}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#00a86b] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,168,107,0.25)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
              >
                <span>Compte KORYXA</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen ? (
          <div className="border-t border-slate-200 bg-white/98 px-4 py-5 shadow-xl transition-colors duration-200 dark:border-[#1b3d29] dark:bg-[#07140c]/98 lg:hidden">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setCommandOpen(true);
                }}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-[#00a86b]" />
                  <span>Recherche globale...</span>
                </div>
                <kbd className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  ⌘K
                </kbd>
              </button>

              <Link
                href={PUBLIC_ROUTES.home}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "rounded-xl px-4 py-3 text-base font-semibold transition",
                  pathname === PUBLIC_ROUTES.home
                    ? "bg-slate-100 text-[#00a86b] dark:bg-[#00a86b]/20 dark:text-[#4ade80]"
                    : "text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5",
                )}
              >
                Accueil
              </Link>

              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      "rounded-xl px-4 py-3 text-base font-semibold transition",
                      active
                        ? "bg-slate-100 text-[#00a86b] dark:bg-[#00a86b]/20 dark:text-[#4ade80]"
                        : "text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/10 flex flex-col gap-2">
                {isLoaded && isSignedIn ? (
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                    <span>Compte KORYXA actif</span>
                    <UserButton />
                  </div>
                ) : (
                  <a
                    href={accountHref}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-4 py-3 text-sm font-bold text-white shadow-md"
                  >
                    <span>Accéder au Compte KORYXA</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {/* Global Command Menu Dialog */}
      <CommandMenu isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}
