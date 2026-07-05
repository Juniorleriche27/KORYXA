"use client";

import type { SVGProps } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";
import { KORYXA_ACCOUNT_URL, MAIN_NAV_LINKS, PUBLIC_ROUTES } from "@/config/routes";

function isActive(pathname: string, href: string): boolean {
  if (href === PUBLIC_ROUTES.home) return pathname === PUBLIC_ROUTES.home;
  return pathname === href || pathname.startsWith(`${href}/`);
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

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/88 text-white shadow-[0_18px_60px_rgba(2,6,23,0.28)] backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-[var(--marketing-max-w)] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href={PUBLIC_ROUTES.home} className="group flex shrink-0 items-center gap-3" aria-label="Retour à l'accueil KORYXA">
          <BrandLogo className="h-10 w-10 rounded-2xl ring-1 ring-white/15 transition group-hover:ring-sky-300/60 sm:h-12 sm:w-12" />
          <div className="leading-none">
            <p className="kx-display text-[1.3rem] font-semibold tracking-[-0.06em] text-white sm:text-[1.55rem]">
              KORYXA
            </p>
            <p className="mt-1 hidden text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sky-200/85 sm:block">
              Orchestration IA
            </p>
          </div>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex" aria-label="Navigation principale">
          {MAIN_NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "relative shrink-0 whitespace-nowrap rounded-full px-3 py-2.5 text-[0.9rem] font-semibold tracking-[-0.02em] transition 2xl:px-4",
                  active
                    ? "bg-white/10 text-sky-100 ring-1 ring-white/15"
                    : "text-slate-300 hover:bg-white/8 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <a
            href={KORYXA_ACCOUNT_URL}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-[0.88rem] font-semibold text-slate-100 transition hover:border-sky-300/50 hover:bg-sky-400/10 hover:text-white"
          >
            Compte KORYXA
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Link
            href={PUBLIC_ROUTES.ecosysteme}
            className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#e0f2fe_0%,#38bdf8_45%,#0ea5e9_100%)] px-4 py-2.5 text-[0.88rem] font-bold text-slate-950 shadow-[0_16px_40px_rgba(56,189,248,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(56,189,248,0.28)]"
          >
            Explorer l’écosystème
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/8 text-white xl:hidden"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-slate-950/96 px-4 py-4 xl:hidden">
          <div className="mx-auto flex w-full max-w-[var(--marketing-max-w)] flex-col gap-2">
            {MAIN_NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "rounded-2xl border px-5 py-3.5 text-[1rem] font-semibold tracking-[-0.02em] transition",
                    active
                      ? "border-sky-300/40 bg-sky-400/15 text-sky-100"
                      : "border-white/10 bg-white/5 text-slate-200 hover:border-sky-300/40 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <a
                href={KORYXA_ACCOUNT_URL}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-[0.95rem] font-semibold text-white"
              >
                Compte KORYXA
                <ExternalLink className="h-4 w-4" />
              </a>
              <Link
                href={PUBLIC_ROUTES.ecosysteme}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-2xl bg-sky-300 px-4 py-3 text-[0.95rem] font-bold text-slate-950"
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
