"use client";

import { CheckCircle2, Globe2, Layers, Network, ShieldCheck, Zap } from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import { productList } from "@/app/produits/data";

export default function LiveEcosystemMetrics() {
  return (
    <div className="w-full">
      {/* Live System Status Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#234b33] bg-[#07190f]/80 px-5 py-3.5 backdrop-blur-xl shadow-md">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
          </span>
          <span className="text-xs font-bold text-white">
            Infrastructure KORYXA opérationnelle
          </span>
          <span className="hidden rounded bg-[#00a86b]/20 px-2 py-0.5 text-[10px] font-bold text-[#86efac] border border-[#00a86b]/40 sm:inline-block">
            99.98% uptime
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#4ade80]" />
            SSO Clerk Identity
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <Zap className="h-4 w-4 text-[#fbbf24]" />
            Réseau Souverain
          </span>
        </div>
      </div>

      {/* 4 Pillars Metric Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-[#234b33] bg-[#07190f]/90 p-4 sm:p-5 text-center transition hover:border-[#4ade80]/40">
          <div className="font-serif text-3xl sm:text-4xl font-black text-white">
            <CountUp to={productList.length} />
          </div>
          <p className="mt-1 text-xs font-bold text-[#86efac]">Produits actifs</p>
          <p className="mt-0.5 text-[11px] text-slate-400">interconnectés</p>
        </div>

        <div className="rounded-2xl border border-[#234b33] bg-[#07190f]/90 p-4 sm:p-5 text-center transition hover:border-[#4ade80]/40">
          <div className="font-serif text-3xl sm:text-4xl font-black text-white">
            1
          </div>
          <p className="mt-1 text-xs font-bold text-[#86efac]">Compte KORYXA</p>
          <p className="mt-0.5 text-[11px] text-slate-400">pass universel</p>
        </div>

        <div className="rounded-2xl border border-[#234b33] bg-[#07190f]/90 p-4 sm:p-5 text-center transition hover:border-[#4ade80]/40">
          <div className="font-serif text-3xl sm:text-4xl font-black text-white">
            5
          </div>
          <p className="mt-1 text-xs font-bold text-[#86efac]">Couches système</p>
          <p className="mt-0.5 text-[11px] text-slate-400">d’orchestration</p>
        </div>

        <div className="rounded-2xl border border-[#234b33] bg-[#07190f]/90 p-4 sm:p-5 text-center transition hover:border-[#4ade80]/40">
          <div className="font-serif text-3xl sm:text-4xl font-black text-white">
            100%
          </div>
          <p className="mt-1 text-xs font-bold text-[#86efac]">Vision Afrique</p>
          <p className="mt-0.5 text-[11px] text-slate-400">réalités terrain</p>
        </div>
      </div>
    </div>
  );
}
