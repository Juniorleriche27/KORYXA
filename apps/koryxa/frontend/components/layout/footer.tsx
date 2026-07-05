"use client";

import Link from "next/link";
import BrandLogo from "@/components/layout/BrandLogo";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

const FOOTER_GROUPS = [
  {
    title: "Plateforme",
    links: [
      { label: "Écosystème", href: PUBLIC_ROUTES.ecosysteme },
      { label: "Produits", href: PUBLIC_ROUTES.produits },
      { label: "Cas d’usage", href: PUBLIC_ROUTES.casUsage },
    ],
  },
  {
    title: "KORYXA",
    links: [
      { label: "Partenaires", href: PUBLIC_ROUTES.partenaires },
      { label: "À propos", href: PUBLIC_ROUTES.apropos },
      { label: "Contact", href: PUBLIC_ROUTES.contact },
    ],
  },
  {
    title: "Accès",
    links: [
      { label: "Compte KORYXA", href: KORYXA_ACCOUNT_URL, external: true },
      { label: "Confidentialité", href: PUBLIC_ROUTES.privacy },
      { label: "Mentions légales", href: PUBLIC_ROUTES.terms },
    ],
  },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#020617] text-slate-300">
      <div className="mx-auto grid w-full max-w-[var(--marketing-max-w)] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_2fr] lg:px-8 lg:py-14">
        <div>
          <div className="flex items-center gap-3">
            <BrandLogo className="h-12 w-12 rounded-2xl ring-1 ring-white/15" />
            <div>
              <p className="kx-display text-xl font-semibold tracking-[-0.05em] text-white">KORYXA</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-200/80">
                Orchestration IA en Afrique
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            KORYXA est la première plateforme d'orchestration IA en Afrique : une vitrine centrale,
            un accès unique et un écosystème de produits autonomes connectés.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{group.title}</p>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                {group.links.map((link) =>
                  "external" in link && link.external ? (
                    <a key={link.href} href={link.href} className="transition hover:text-sky-300">
                      {link.label}
                    </a>
                  ) : (
                    <Link key={link.href} href={link.href} className="transition hover:text-sky-300">
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--marketing-max-w)] flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright {year} KORYXA. Tous droits réservés.</p>
          <p>Compte unique. Produits autonomes. Orchestration centrale.</p>
        </div>
      </div>
    </footer>
  );
}
