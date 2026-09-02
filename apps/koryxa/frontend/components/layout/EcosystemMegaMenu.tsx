"use client";

import Link from "next/link";
import {
  Bot,
  BriefcaseBusiness,
  Building2,
  CircuitBoard,
  Code2,
  GraduationCap,
  PackageCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Compass,
  Wallet,
  Globe,
  Radio,
} from "lucide-react";
import { productList } from "@/app/produits/data";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

const PRODUCT_ICONS: Record<string, typeof Bot> = {
  merqalor: Wallet,
  "service-ia": Globe,
  flowcore: Radio,
  chatlaya: Bot,
  cora: Sparkles,
  "partner-portal": Building2,
  api: Code2,
  formation: GraduationCap,
  neurokap: CircuitBoard,
  corabiz: BriefcaseBusiness,
  "services-ia": Globe,
};

export default function EcosystemMegaMenu({
  onClose,
}: {
  onClose?: () => void;
}) {
  return (
    <div
      className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white/98 p-6 text-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-2xl dark:border-[#234b33] dark:bg-[#07190f]/95 dark:text-white dark:shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#86efac]">
              Produits Autonomes de la Suite KORYXA
            </span>
            <Link
              href={PUBLIC_ROUTES.produits}
              onClick={onClose}
              className="text-xs font-bold text-[#00a86b] dark:text-[#4ade80] hover:underline inline-flex items-center gap-1"
            >
              Tout le catalogue ({productList.length}) →
            </Link>
          </div>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {productList.map((product) => {
              const Icon = PRODUCT_ICONS[product.slug] || Sparkles;
              return (
                <a
                  key={product.slug}
                  href={product.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onClose}
                  className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-2.5 transition hover:border-[#00a86b] hover:bg-white hover:shadow-sm dark:border-white/5 dark:bg-white/5 dark:hover:border-[#4ade80]/40 dark:hover:bg-[#0d2818]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00a86b]/15 text-[#00a86b] group-hover:bg-[#00a86b] group-hover:text-white transition mt-0.5 dark:bg-[#00a86b]/20 dark:text-[#4ade80]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-[#00a86b]">
                        {product.name}
                      </span>
                      <span className="rounded bg-[#00a86b]/10 dark:bg-white/10 px-1.5 py-0.2 text-[9px] font-bold text-[#008b58] dark:text-[#86efac]">
                        {product.badge || "Actif"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {product.tagline}
                    </p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#00a86b] shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right side: Quick Access & Gateway */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-gradient-to-b from-[#f8faf8] to-[#edf5ef] p-6 shadow-sm dark:border-white/10 dark:bg-gradient-to-b dark:from-[#0d2818] dark:to-[#040f09]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#008b58] dark:text-[#86efac]">
              <ShieldCheck className="h-4 w-4" />
              <span>Pass Universel KORYXA</span>
            </div>
            <h4 className="mt-2 font-serif text-lg font-bold text-slate-900 dark:text-white">
              Une seule identité pour tous vos espaces
            </h4>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Connectez-vous une fois pour accéder à MERQALOR, FlowCore, ChatLAYA, CoraBiz, la formation et vos clés d’API.
            </p>
          </div>

          <div className="mt-6 space-y-2.5">
            <a
              href={KORYXA_ACCOUNT_URL}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#008b58]"
            >
              Accéder à mon compte
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <Link
              href={PUBLIC_ROUTES.casUsage}
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Compass className="h-3.5 w-3.5" />
              Trouver par profil ou besoin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
