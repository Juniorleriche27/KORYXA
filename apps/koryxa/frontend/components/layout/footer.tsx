"use client";

import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

const FOOTER_GROUPS = [
  {
    title: "Applications IA",
    links: [
      { label: "MERQALOR (Finance)", href: "https://merqalor.koryxa.fr", external: true },
      { label: "FlowCore (CRM & Autopilot)", href: "https://flowcore.koryxa.fr", external: true },
      { label: "Cora (Cockpit IA)", href: "https://cora.koryxa.fr", external: true },
      { label: "Service IA & Web", href: "https://service-ia.koryxa.fr", external: true },
      { label: "ChatLAYA (Conversation)", href: "https://chatlaya.koryxa.fr", external: true },
      { label: "CoraBiz (ERP PME)", href: "https://corabiz.koryxa.fr", external: true },
      { label: "KORYXA Formation", href: "https://formation.koryxa.fr", external: true },
    ],
  },
  {
    title: "Plateforme",
    links: [
      { label: "Catalogue des produits", href: PUBLIC_ROUTES.produits },
      { label: "Architecture Écosystème", href: PUBLIC_ROUTES.ecosysteme },
      { label: "Cas d’usage & Besoins", href: PUBLIC_ROUTES.casUsage },
      { label: "Portail Partenaire", href: "https://partenaires.koryxa.fr", external: true },
      { label: "KORYXA API", href: "https://api.koryxa.fr", external: true },
    ],
  },
  {
    title: "Institutionnel",
    links: [
      { label: "Partenariats & Alliances", href: PUBLIC_ROUTES.partenaires },
      { label: "Vision & À propos", href: PUBLIC_ROUTES.apropos },
      { label: "Contact officiel", href: PUBLIC_ROUTES.contact },
      { label: "Politique de confidentialité", href: PUBLIC_ROUTES.privacy },
      { label: "Mentions légales", href: PUBLIC_ROUTES.terms },
    ],
  },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="kx-site-footer border-t border-slate-200/90 bg-slate-50 text-slate-800 transition-colors duration-200 dark:border-[#1b3d29] dark:bg-[#040c07] dark:text-slate-200">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8 lg:py-16">
        {/* Left Column: Brand, Tagline, Socials */}
        <div>
          <div className="flex items-center gap-3">
            <BrandLogo className="h-10 w-10 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm" />
            <div>
              <p className="font-serif text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                KORY<span className="text-[#00a86b]">XA</span>
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#008b58] dark:text-[#86efac]">
                Orchestration IA en Afrique
              </p>
            </div>
          </div>

          <p className="mt-4 max-w-sm text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            La première plateforme d'orchestration IA en Afrique reliant applications spécialisées, identité unifiée et connecteurs sécurisés.
          </p>

          <div className="mt-6">
            <a
              href={KORYXA_ACCOUNT_URL}
              className="inline-flex items-center gap-2 rounded-xl bg-[#00a86b] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#008b58]"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Accéder au Compte KORYXA</span>
            </a>
          </div>

          <div className="mt-8">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Canaux Officiels
            </p>
            <SocialLinks compact />
          </div>
        </div>

        {/* Right Columns: Nav Links */}
        <div className="grid gap-8 sm:grid-cols-3">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="font-serif text-xs font-bold uppercase tracking-wider text-[#008b58] dark:text-[#86efac]">
                {group.title}
              </p>
              <div className="mt-4 flex flex-col gap-2.5 text-xs sm:text-sm font-medium">
                {group.links.map((link) =>
                  "external" in link && link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-[#00a86b] dark:text-slate-400 dark:hover:text-white transition"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-slate-600 hover:text-[#00a86b] dark:text-slate-400 dark:hover:text-white transition"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-footer copyright & legal */}
      <div className="border-t border-slate-200/80 bg-white/60 dark:border-white/5 dark:bg-black/30">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-2 px-4 py-4 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {year} KORYXA. Tous droits réservés.</p>
          <p className="font-medium text-slate-700 dark:text-slate-300">
            Plateforme souveraine d'orchestration IA en Afrique.
          </p>
        </div>
      </div>
    </footer>
  );
}
