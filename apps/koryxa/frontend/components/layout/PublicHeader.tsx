"use client";

import type { SVGProps } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { ExternalLink } from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { KORYXA_ACCOUNT_URL, MAIN_NAV_LINKS, PUBLIC_ROUTES } from "@/config/routes";

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
  const { isLoaded, isSignedIn } = useUser();
  const accountHref = buildAccountHref(pathname || "/");

  return (
    <header className="kx-public-header sticky top-0 z-50 border-b border-[#e8eadf] bg-[#fffdf6]/95 shadow-[0_2px_24px_rgba(13,27,56,0.08)] backdrop-blur-2xl">
      <div className="mx-auto grid h-[68px] w-full max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#14351f] transition hover:bg-[#f2f0df] xl:hidden"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          </button>

          <Link href={PUBLIC_ROUTES.home} className="group flex shrink-0 items-center gap-3" aria-label="Retour à l'accueil KORYXA">
            <BrandLogo className="h-10 w-10 rounded-xl object-cover shadow-[0_8px_20px_rgba(13,27,56,0.12)] transition group-hover:-translate-y-0.5" />
            <span className="font-serif text-[1.5rem] font-bold tracking-[-0.03em] text-[#10351f]">
              KORY<span className="text-[#00a86b]">XA</span>
            </span>
          </Link>
        </div>

        <nav className="hidden items-center justify-center gap-1 xl:flex" aria-label="Navigation principale">
          {MAIN_NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "inline-flex items-center justify-center rounded-lg px-3 py-2 text-[0.86rem] font-medium text-[#14351f] transition",
                  active ? "bg-[#f4f1df]" : "hover:bg-[#f5f6ee]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center justify-end gap-2 xl:flex">
          <ThemeToggle showLabel={false} className="kx-theme-toggle" />
          {isLoaded && isSignedIn ? (
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#dfe5d8] bg-white px-3 py-2 shadow-sm">
              <span className="text-[0.78rem] font-semibold text-[#14351f]">Compte actif</span>
              <UserButton />
            </div>
          ) : (
            <a
              href={accountHref}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#14351f] px-4 py-2.5 text-[0.84rem] font-semibold text-[#14351f] transition hover:bg-[#14351f] hover:text-white"
            >
              Compte KORYXA
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <Link
            href={PUBLIC_ROUTES.ecosysteme}
            className="inline-flex items-center justify-center rounded-lg bg-[#00a86b] px-4 py-2.5 text-[0.84rem] font-bold text-white shadow-[0_10px_28px_rgba(0,168,107,0.20)] transition hover:-translate-y-0.5 hover:bg-[#008b58]"
          >
            Explorer l’écosystème
          </Link>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#e8eadf] bg-[#fffdf6]/98 px-4 py-4 xl:hidden">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-2">
            {MAIN_NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "rounded-xl px-4 py-3 text-[1rem] font-semibold text-[#14351f] transition",
                    active ? "bg-[#f4f1df]" : "hover:bg-[#f5f6ee]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="inline-flex items-center justify-center rounded-xl border border-[#dfe5d8] bg-white px-4 py-2 dark:border-[#1f3d2c] dark:bg-[#0d1c13]">
                <ThemeToggle showLabel={true} className="kx-theme-toggle" />
              </div>
              {isLoaded && isSignedIn ? (
                <div className="inline-flex items-center justify-center gap-3 rounded-xl border border-[#dfe5d8] bg-white px-4 py-3 text-[0.95rem] font-semibold text-[#14351f]">
                  <span>Compte actif</span>
                  <UserButton />
                </div>
              ) : (
                <a
                  href={accountHref}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#14351f] px-4 py-3 text-[0.95rem] font-semibold text-[#14351f]"
                >
                  Compte KORYXA
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <Link
                href={PUBLIC_ROUTES.ecosysteme}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-xl bg-[#00a86b] px-4 py-3 text-[0.95rem] font-bold text-white"
              >
                Explorer l’écosystème
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
