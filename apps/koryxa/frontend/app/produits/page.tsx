import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers3, Network, Sparkles, ShieldCheck, CheckCircle2, Zap } from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";
import { productList } from "@/app/produits/data";
import InteractiveProductGrid from "@/components/marketing/InteractiveProductGrid";

export const metadata: Metadata = {
  title: "Produits KORYXA | Suite Complète des Produits IA Autonomes",
  description:
    "Explorez les produits IA de l’écosystème KORYXA : MERQALOR, FlowCore, Service IA & Web, ChatLAYA, CoraBiz, KORYXA Formation, NeuroKap, Portail Partenaire et APIs.",
};

export default function ProductsPage() {
  return (
    <div className="kx-pie-page kx-products-page">
      {/* 1. Products Hero — Hyper Premium & Centered */}
      <section className="kx-products-hero relative overflow-hidden text-center py-16 sm:py-24">
        <div className="kx-pie-blob kx-pie-blob-one" />
        <div className="kx-pie-blob kx-pie-blob-two" />

        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center">
          <div className="kx-pie-badge inline-flex items-center justify-center gap-2 mb-6">
            <span className="kx-pie-dot" />
            <span>Suite Officielle & Briques Autonomes</span>
          </div>

          <h1 className="max-w-4xl mx-auto font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white leading-tight tracking-tight">
            La suite de technologies IA conçue pour performer.
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-[#cbd5e1] leading-relaxed">
            Chaque produit de l'écosystème KORYXA (<strong>MERQALOR</strong>, <strong>FlowCore</strong>, <strong>Service IA</strong>, <strong>ChatLAYA</strong>, <strong>CoraBiz</strong>) apporte une réponse ciblée avec son infrastructure dédiée et son compte unifié.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <a
              href={KORYXA_ACCOUNT_URL}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,168,107,0.3)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
            >
              Accéder au Compte KORYXA
              <ArrowRight size={18} />
            </a>
            <Link
              href={PUBLIC_ROUTES.casUsage}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Trouver le bon produit par besoin
            </Link>
          </div>

          {/* Quick Pillar Highlights */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 w-full max-w-3xl">
            <div className="rounded-2xl border border-slate-200/90 bg-white/95 dark:border-white/15 dark:bg-white/10 p-3.5 shadow-sm backdrop-blur-md">
              <span className="block font-serif text-xl sm:text-2xl font-bold text-[#00a86b] dark:text-white">10+</span>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-[#86efac]">Produits actifs</span>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-white/95 dark:border-white/15 dark:bg-white/10 p-3.5 shadow-sm backdrop-blur-md">
              <span className="block font-serif text-xl sm:text-2xl font-bold text-[#00a86b] dark:text-white">1</span>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-[#86efac]">Identité unique</span>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-white/95 dark:border-white/15 dark:bg-white/10 p-3.5 shadow-sm backdrop-blur-md">
              <span className="block font-serif text-xl sm:text-2xl font-bold text-[#00a86b] dark:text-white">24/7</span>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-[#86efac]">Autopilot CRM</span>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-white/95 dark:border-white/15 dark:bg-white/10 p-3.5 shadow-sm backdrop-blur-md">
              <span className="block font-serif text-xl sm:text-2xl font-bold text-[#00a86b] dark:text-white">100%</span>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-[#86efac]">Souveraineté</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Catalog Section */}
      <section className="py-20 sm:py-28 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
              Exploration & Filtres
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-bold tracking-tight">
              Tous les produits de la suite KORYXA
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Sélectionnez une catégorie ou effectuez une recherche pour accéder instantanément aux applications en production.
            </p>
          </div>

          <InteractiveProductGrid />
        </div>
      </section>

      {/* 3. Account Gateway Banner */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#050b08] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 transition-colors">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#dfe5d8] dark:border-[#234b33] bg-gradient-to-r from-[#f7fbf8] to-[#edf6f0] dark:from-[#07190f] dark:to-[#040f09] p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 text-center sm:text-left">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#008b58] dark:text-[#86efac] mx-auto sm:mx-0">
                <ShieldCheck className="h-4 w-4" />
                <span>Pass Universel KORYXA</span>
              </div>
              <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Un seul compte pour ouvrir toute la suite KORYXA.
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Ne multipliez plus les identifiants et les mots de passe. Votre compte KORYXA gère vos autorisations, vos abonnements et vos clés d'API de façon unifiée et sécurisée.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto">
              <a
                href={KORYXA_ACCOUNT_URL}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-6 py-4 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-[#008b58]"
              >
                Créer mon compte KORYXA
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href={PUBLIC_ROUTES.contact}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 px-6 py-4 text-xs sm:text-sm font-bold text-slate-800 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/15"
              >
                Contacter l'équipe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
