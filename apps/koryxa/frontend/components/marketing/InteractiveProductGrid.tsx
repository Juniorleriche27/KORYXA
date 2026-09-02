"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bot,
  BriefcaseBusiness,
  Building2,
  CircuitBoard,
  Code2,
  GraduationCap,
  PackageCheck,
  Search,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Wallet,
  Globe,
  Radio,
} from "lucide-react";
import { productList, type ProductInfo } from "@/app/produits/data";

const PRODUCT_ICONS: Record<string, typeof Bot> = {
  merqalor: Wallet,
  "service-ia": Globe,
  flowcore: Radio,
  chatlaya: Bot,
  corabiz: BriefcaseBusiness,
  formation: GraduationCap,
  neurokap: CircuitBoard,
  "partner-portal": Building2,
  api: Code2,
  cora: Sparkles,
  "services-ia": Globe,
};

const CATEGORIES = [
  { id: "all", label: "Tous les produits" },
  { id: "finance", label: "Finance & Pilotage" },
  { id: "ai", label: "Conversation & IA" },
  { id: "automation", label: "CRM & Autopilot" },
  { id: "studio", label: "Studio & Services" },
  { id: "education", label: "Formation & Talents" },
  { id: "infra", label: "APIs & Réseau" },
];

export default function InteractiveProductGrid({
  limit,
}: {
  limit?: number;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProducts = useMemo(() => {
    let list = productList;

    if (selectedCategory === "finance") {
      list = list.filter((p) => ["merqalor", "neurokap"].includes(p.slug));
    } else if (selectedCategory === "ai") {
      list = list.filter((p) => ["chatlaya"].includes(p.slug));
    } else if (selectedCategory === "automation") {
      list = list.filter((p) => ["flowcore", "corabiz", "cora"].includes(p.slug));
    } else if (selectedCategory === "studio") {
      list = list.filter((p) => ["service-ia", "services-ia"].includes(p.slug));
    } else if (selectedCategory === "education") {
      list = list.filter((p) => p.slug === "formation");
    } else if (selectedCategory === "infra") {
      list = list.filter((p) => ["api", "partner-portal"].includes(p.slug));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.audience.toLowerCase().includes(q),
      );
    }

    return limit ? list.slice(0, limit) : list;
  }, [selectedCategory, searchQuery, limit]);

  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden">
      {/* Search & Filter Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full max-w-full min-w-0">
        {/* Category Tabs — Mobile horizontal scroll without expanding parent */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full max-w-full min-w-0 shrink">
          {CATEGORIES.map((cat) => {
            const isSelected = cat.id === selectedCategory;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition duration-200 ${
                  isSelected
                    ? "bg-[#00a86b] text-white shadow-[0_4px_16px_rgba(0,168,107,0.35)] scale-102"
                    : "border border-slate-200 bg-white/90 text-slate-700 hover:border-[#00a86b]/40 hover:bg-white hover:text-black dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Local Search Input */}
        <div className="relative w-full sm:w-72 shrink-0 min-w-0">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/90 py-2.5 pl-10 pr-3 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:border-[#00a86b] focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-slate-400"
          />
        </div>
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          <p className="text-sm font-semibold">Aucun produit ne correspond à vos critères de recherche.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-full min-w-0">
          {filteredProducts.map((product) => {
            const Icon = PRODUCT_ICONS[product.slug] || Sparkles;

            return (
              <article
                key={product.slug}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-7 shadow-[0_8px_30px_rgba(20,53,31,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-[#00a86b] hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,168,107,0.18)] dark:border-[#234b33] dark:bg-[#07190f]/95 dark:shadow-[0_12px_36px_rgba(0,0,0,0.3)] dark:hover:border-[#4ade80] w-full max-w-full min-w-0 overflow-hidden box-border"
              >
                <div className="w-full min-w-0">
                  {/* Top row: Icon & Status Badge */}
                  <div className="flex items-center justify-between gap-2 w-full min-w-0">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border border-black/5 bg-[#00a86b]/10 text-[#00a86b] transition duration-300 group-hover:bg-[#00a86b] group-hover:text-white shadow-sm dark:border-white/10 dark:bg-[#00a86b]/20 dark:text-[#4ade80]">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span className="rounded-full bg-[#00a86b]/10 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-[#008b58] border border-[#00a86b]/20 dark:bg-[#00a86b]/20 dark:text-[#86efac] shrink-0 truncate max-w-[55%] text-right">
                      {product.badge || product.status}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mt-4 text-left w-full min-w-0">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 transition group-hover:text-[#00a86b] dark:text-white dark:group-hover:text-[#86efac] truncate">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs font-bold text-[#008b58] dark:text-[#86efac] leading-snug">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Summary */}
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed text-left">
                    {product.summary}
                  </p>

                  {/* Target Audience Pill */}
                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-left dark:border-white/10 dark:bg-white/5">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Public Cible
                    </span>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                      {product.audience}
                    </span>
                  </div>

                  {/* Highlights */}
                  <div className="mt-4 space-y-1.5 text-left">
                    {product.highlights.slice(0, 3).map((highlight) => (
                      <div key={highlight} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#00a86b] dark:text-[#4ade80] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <a
                    href={product.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#00a86b] px-4 py-3 text-xs font-bold text-white shadow-[0_4px_14px_rgba(0,168,107,0.3)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
                  >
                    Ouvrir l'application
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <Link
                    href={`/produits/${product.slug}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs font-bold text-slate-800 transition hover:bg-slate-100 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/15"
                  >
                    Fiche
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
