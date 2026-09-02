import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers3, Network, Sparkles, ShieldCheck } from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";
import { productList } from "@/app/produits/data";
import InteractiveProductGrid from "@/components/marketing/InteractiveProductGrid";

export const metadata: Metadata = {
  title: "Produits KORYXA | Suite Complète des Produits IA Autonomes",
  description:
    "Explorez les produits IA de l’écosystème KORYXA : ChatLAYA, NeuroKap, CoraBiz, KORYXA Formation, Portail Partenaire, APIs et Services IA.",
};

export default function ProductsPage() {
  return (
    <main className="kx-pie-page kx-products-page">
      {/* Products Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#06150c] via-[#081f13] to-[#040c07] pt-12 pb-20 text-white sm:pt-16 sm:pb-28">
        <div className="kx-pie-blob kx-pie-blob-one opacity-30" />
        <div className="kx-pie-blob kx-pie-blob-two opacity-20" />

        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4ade80]/40 bg-[#00a86b]/15 px-4 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#ecfff4]">
                Catalogue Officiel de la Suite
              </span>
            </div>

            <h1 className="mt-6 font-serif text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Des produits autonomes, une cohérence d’ensemble.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#e2f5ea] leading-relaxed max-w-2xl mx-auto">
              Chaque produit de la suite KORYXA est développé avec un périmètre d'excellence précis, tout en s'alignant sur l'identité unique et la passerelle d'orchestration commune.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <a
                href={KORYXA_ACCOUNT_URL}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_10px_28px_rgba(0,168,107,0.35)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
              >
                Accéder au Compte KORYXA
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href={PUBLIC_ROUTES.casUsage}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-white/15"
              >
                Trouver par besoin
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Catalog Section */}
      <section className="py-16 sm:py-24 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#00a86b] dark:text-[#4ade80]">
              Exploration & Filtres
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-bold">
              Tous les produits connectés
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Sélectionnez une catégorie ou effectuez une recherche par mot-clé.
            </p>
          </div>

          <InteractiveProductGrid />
        </div>
      </section>

      {/* Account Gateway Banner */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#050b08] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 transition-colors">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#234b33] bg-gradient-to-r from-[#07190f] to-[#040f09] p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#86efac]">
                <ShieldCheck className="h-4 w-4" />
                <span>Pass Universel</span>
              </div>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold">
                Un seul compte pour ouvrir toute la suite KORYXA.
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Ne multipliez plus les identifiants et les mots de passe. Votre compte KORYXA gère vos autorisations, vos abonnements et vos quotas d'API de façon unifiée.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <a
                href={KORYXA_ACCOUNT_URL}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-[#008b58]"
              >
                Créer mon compte KORYXA
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href={PUBLIC_ROUTES.contact}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition hover:bg-white/15"
              >
                Contacter l'équipe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
