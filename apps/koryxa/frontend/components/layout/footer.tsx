"use client";

import Link from "next/link";
import BrandLogo from "@/components/layout/BrandLogo";
import { SocialLinks } from "@/components/layout/SocialLinks";
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
    <footer className="border-t border-[#e4f2ea] bg-[linear-gradient(180deg,#ffffff_0%,#f5fbf7_100%)] text-[#17231d]">
      <div className="mx-auto grid w-full max-w-[var(--marketing-max-w)] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_2fr] lg:px-8 lg:py-14">
        <div>
          <div className="flex items-center gap-3">
            <BrandLogo className="h-12 w-12 rounded-2xl border border-[#e4f2ea] bg-white shadow-[0_10px_28px_rgba(0,107,67,0.08)]" />
            <div>
              <p className="kx-display text-xl font-semibold tracking-[-0.05em] text-[#070b18]">
                KORY<span className="text-[#00a86b]">XA</span>
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#006b43]">
                Orchestration IA en Afrique
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#52615c]">
            KORYXA est la première plateforme d'orchestration IA en Afrique : une vitrine claire,
            un accès unique et un écosystème de produits autonomes connectés.
          </p>
          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#006b43]">Suivre KORYXA</p>
            <SocialLinks compact />
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#006b43]">{group.title}</p>
              <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-[#17231d]">
                {group.links.map((link) =>
                  "external" in link && link.external ? (
                    <a key={link.href} href={link.href} className="transition hover:text-[#00a86b]">
                      {link.label}
                    </a>
                  ) : (
                    <Link key={link.href} href={link.href} className="transition hover:text-[#00a86b]">
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#e4f2ea] bg-white/70">
        <div className="mx-auto flex w-full max-w-[var(--marketing-max-w)] flex-col gap-2 px-4 py-5 text-xs text-[#65746d] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright {year} KORYXA. Tous droits réservés.</p>
          <p>Compte unique. Produits autonomes. Écosystème connecté.</p>
        </div>
      </div>
    </footer>
  );
}
