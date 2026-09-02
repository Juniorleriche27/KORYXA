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
} from "lucide-react";
import { productList } from "@/app/produits/data";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

const PRODUCT_ICONS: Record<string, typeof Bot> = {
  chatlaya: Bot,
  cora: Sparkles,
  "partner-portal": Building2,
  api: Code2,
  formation: GraduationCap,
  neurokap: CircuitBoard,
  corabiz: BriefcaseBusiness,
  "services-ia": PackageCheck,
};

export default function EcosystemMegaMenu({
  onClose,
}: {
  onClose?: () => void;
}) {
  return (
    <div
      className="w-full max-w-4xl overflow-hidden rounded-2xl border border-[#234b33] bg-[#07190f]/95 p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#86efac]">
              Produits Autonomes KORYXA
            </span>
            <Link
              href={PUBLIC_ROUTES.produits}
              onClick={onClose}
              className="text-xs font-bold text-[#4ade80] hover:underline inline-flex items-center gap-1"
            >
              Tout le catalogue →
            </Link>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {productList.map((product) => {
              const Icon = PRODUCT_ICONS[product.slug] || Sparkles;
              return (
                <Link
                  key={product.slug}
                  href={`/produits/${product.slug}`}
                  onClick={onClose}
                  className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-2.5 transition hover:border-[#4ade80]/40 hover:bg-[#0d2818]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00a86b]/20 text-[#4ade80] group-hover:bg-[#00a86b] group-hover:text-white transition mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate">
                        {product.name}
                      </span>
                      <span className="rounded bg-white/10 px-1 py-0.2 text-[9px] font-semibold text-[#86efac]">
                        {product.status.split(" ")[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {product.tagline}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side: Quick Access & Gateway */}
        <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-gradient-to-b from-[#0d2818] to-[#040f09] p-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#86efac]">
              <ShieldCheck className="h-4 w-4" />
              <span>Pass Unique KORYXA</span>
            </div>
            <h4 className="mt-2 font-serif text-base font-bold text-white">
              Une seule identité pour tous vos espaces
            </h4>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Connectez-vous une fois pour accéder à ChatLAYA, NeuroKap, CoraBiz, la formation et vos clés d’API.
            </p>
          </div>

          <div className="mt-5 space-y-2">
            <a
              href={KORYXA_ACCOUNT_URL}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#008b58]"
            >
              Accéder à mon compte
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <Link
              href={PUBLIC_ROUTES.casUsage}
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Compass className="h-3.5 w-3.5" />
              Trouver le bon produit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
