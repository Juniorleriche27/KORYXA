"use client";

import type { SVGProps } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { ArrowRight, ArrowUpRight, ExternalLink, Search, Sparkles } from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import CommandMenu from "@/components/layout/CommandMenu";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

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
      {/* Fixed Full-Width Header with opaque backdrop to prevent text bleed */}
      <header className="kx-public-header fixed inset-x-0 top-0 z-50 w-full border-b border-slate-200/80 bg-[#faf9f5]/98 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-colors duration-200 dark:border-[#1b3d29] dark:bg-[#050b08]/98 dark:shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <div className="mx-auto flex h-16 sm:h-[68px] w-full max-w-[1240px] items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8">
          {/* Left: Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-slate-800 transition hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-white/10 lg:hidden"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <IconClose className="h-4 w-4" /> : <IconMenu className="h-4 w-4" />}
            </button>

            <Link
              href={PUBLIC_ROUTES.home}
              className="group flex shrink-0 items-center gap-2 sm:gap-2.5"
              aria-label="Accueil KORYXA"
            >
              <BrandLogo className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover shadow-sm transition group-hover:scale-105" />
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                KORY<span className="text-[#00a86b]">XA</span>
                <span className="text-[#00a86b] font-sans text-xs ml-0.5">•</span>
              </span>
            </Link>
          </div>

          {/* Center: Elegant Pill Navigation */}
          <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Navigation principale">
            <Link
              href={PUBLIC_ROUTES.produits}
              className={clsx(
                "rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-150",
                isActive(pathname, PUBLIC_ROUTES.produits)
                  ? "bg-slate-200/80 text-[#00a86b] dark:bg-[#00a86b]/20 dark:text-[#4ade80]"
                  : "text-slate-700 hover:bg-slate-200/50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
              )}
            >
              Produits
            </Link>

            <Link
              href={PUBLIC_ROUTES.casUsage}
              className={clsx(
                "rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-150",
                isActive(pathname, PUBLIC_ROUTES.casUsage)
                  ? "bg-slate-200/80 text-[#00a86b] dark:bg-[#00a86b]/20 dark:text-[#4ade80]"
                  : "text-slate-700 hover:bg-slate-200/50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
              )}
            >
              Cas d’usage
            </Link>

            {/* Distinctive Ecosystem Feature Pill */}
            <Link
              href={PUBLIC_ROUTES.ecosysteme}
              className={clsx(
                "inline-flex items-center gap-1 rounded-full px-4 py-1 text-xs font-bold transition-all duration-200 shadow-sm",
                isActive(pathname, PUBLIC_ROUTES.ecosysteme)
                  ? "bg-[#00a86b] text-white shadow-[0_2px_10px_rgba(0,168,107,0.35)]"
                  : "border border-[#00a86b]/30 bg-emerald-50 text-[#008b58] hover:bg-[#00a86b] hover:text-white hover:border-[#00a86b] dark:border-[#00a86b]/40 dark:bg-[#00a86b]/15 dark:text-[#86efac] dark:hover:bg-[#00a86b] dark:hover:text-white",
              )}
            >
              <span>Écosystème 1.0</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>

            <Link
              href={PUBLIC_ROUTES.partenaires}
              className={clsx(
                "rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-150",
                isActive(pathname, PUBLIC_ROUTES.partenaires)
                  ? "bg-slate-200/80 text-[#00a86b] dark:bg-[#00a86b]/20 dark:text-[#4ade80]"
                  : "text-slate-700 hover:bg-slate-200/50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
              )}
            >
              Partenaires
            </Link>

            <Link
              href={PUBLIC_ROUTES.apropos}
              className={clsx(
                "rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-150",
                isActive(pathname, PUBLIC_ROUTES.apropos)
                  ? "bg-slate-200/80 text-[#00a86b] dark:bg-[#00a86b]/20 dark:text-[#4ade80]"
                  : "text-slate-700 hover:bg-slate-200/50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
              )}
            >
              À propos
            </Link>
          </nav>

          {/* Right: Search Trigger, Theme Toggle & Pill CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Search Pill */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-[#00a86b]/50 hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
              title="Recherche rapide (Cmd + K)"
            >
              <Search className="h-3.5 w-3.5 text-[#00a86b]" />
              <span className="hidden md:inline text-[11px]">Recherche</span>
              <kbd className="hidden rounded bg-slate-200/70 px-1 py-0.2 text-[9px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-400 md:inline">
                ⌘K
              </kbd>
            </button>

            <ThemeToggle showLabel={false} className="kx-theme-toggle scale-85 sm:scale-95" />

            {/* Account Action Pill */}
            {isLoaded && isSignedIn ? (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-2.5 py-1 shadow-sm dark:border-white/15 dark:bg-white/5">
                <span className="hidden text-[11px] font-bold text-slate-800 dark:text-[#86efac] sm:inline">
                  Compte actif
                </span>
                <UserButton />
              </div>
            ) : (
              <a
                href={accountHref}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#00a86b] px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(0,168,107,0.3)] transition-all hover:bg-[#008b58] hover:scale-105 active:scale-95"
              >
                <span>Ouvrir le Compte</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Mobile Drawer Dropdown */}
        {mobileOpen ? (
          <div className="border-t border-slate-200/90 bg-[#faf9f5]/98 px-4 py-5 shadow-xl transition-all dark:border-[#1b3d29] dark:bg-[#050b08]/98 lg:hidden">
            <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setCommandOpen(true);
                }}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 shadow-sm"
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
                  "rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                  pathname === PUBLIC_ROUTES.home
                    ? "bg-slate-200/80 text-[#00a86b] dark:bg-[#00a86b]/20 dark:text-[#4ade80]"
                    : "text-slate-800 hover:bg-slate-200/40 dark:text-slate-200 dark:hover:bg-white/5",
                )}
              >
                Accueil
              </Link>

              <Link
                href={PUBLIC_ROUTES.produits}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                  isActive(pathname, PUBLIC_ROUTES.produits)
                    ? "bg-slate-200/80 text-[#00a86b] dark:bg-[#00a86b]/20 dark:text-[#4ade80]"
                    : "text-slate-800 hover:bg-slate-200/40 dark:text-slate-200 dark:hover:bg-white/5",
                )}
              >
                Produits (10 solutions)
              </Link>

              <Link
                href={PUBLIC_ROUTES.casUsage}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                  isActive(pathname, PUBLIC_ROUTES.casUsage)
                    ? "bg-slate-200/80 text-[#00a86b] dark:bg-[#00a86b]/20 dark:text-[#4ade80]"
                    : "text-slate-800 hover:bg-slate-200/40 dark:text-slate-200 dark:hover:bg-white/5",
                )}
              >
                Cas d’usage
              </Link>

              <Link
                href={PUBLIC_ROUTES.ecosysteme}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "flex items-center justify-between rounded-2xl border px-4 py-2.5 text-sm font-bold transition",
                  isActive(pathname, PUBLIC_ROUTES.ecosysteme)
                    ? "border-[#00a86b] bg-[#00a86b] text-white"
                    : "border-[#00a86b]/30 bg-emerald-50 text-[#008b58] dark:border-[#00a86b]/40 dark:bg-[#00a86b]/15 dark:text-[#86efac]",
                )}
              >
                <span>Écosystème 1.0</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href={PUBLIC_ROUTES.partenaires}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                  isActive(pathname, PUBLIC_ROUTES.partenaires)
                    ? "bg-slate-200/80 text-[#00a86b] dark:bg-[#00a86b]/20 dark:text-[#4ade80]"
                    : "text-slate-800 hover:bg-slate-200/40 dark:text-slate-200 dark:hover:bg-white/5",
                )}
              >
                Partenaires
              </Link>

              <Link
                href={PUBLIC_ROUTES.apropos}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                  isActive(pathname, PUBLIC_ROUTES.apropos)
                    ? "bg-slate-200/80 text-[#00a86b] dark:bg-[#00a86b]/20 dark:text-[#4ade80]"
                    : "text-slate-800 hover:bg-slate-200/40 dark:text-slate-200 dark:hover:bg-white/5",
                )}
              >
                À propos
              </Link>

              <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-white/10 flex flex-col gap-2">
                {isLoaded && isSignedIn ? (
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200 shadow-sm">
                    <span>Compte KORYXA actif</span>
                    <UserButton />
                  </div>
                ) : (
                  <a
                    href={accountHref}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#00a86b] px-4 py-3 text-sm font-bold text-white shadow-md"
                  >
                    <span>Ouvrir le Compte KORYXA</span>
                    <ArrowRight className="h-4 w-4" />
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
