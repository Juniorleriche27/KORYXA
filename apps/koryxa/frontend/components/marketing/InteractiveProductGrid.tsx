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
  Layers3,
} from "lucide-react";
import { productList, type ProductInfo } from "@/app/produits/data";

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

const CATEGORIES = [
  { id: "all", label: "Tous les produits" },
  { id: "direct", label: "Usage Direct & IA" },
  { id: "business", label: "Entreprise & Gestion" },
  { id: "education", label: "Formation & Talents" },
  { id: "infra", label: "APIs & Système" },
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

    if (selectedCategory === "direct") {
      list = list.filter((p) => ["chatlaya", "neurokap"].includes(p.slug));
    } else if (selectedCategory === "business") {
      list = list.filter((p) =>
        ["corabiz", "services-ia", "partner-portal"].includes(p.slug),
      );
    } else if (selectedCategory === "education") {
      list = list.filter((p) => p.slug === "formation");
    } else if (selectedCategory === "infra") {
      list = list.filter((p) => p.slug === "api");
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
    <div className="w-full">
      {/* Search & Filter Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = cat.id === selectedCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  isSelected
                    ? "bg-[#00a86b] text-white shadow-[0_4px_16px_rgba(0,168,107,0.3)]"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Local Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrer par nom, cible..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:border-[#4ade80] focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-slate-400">
          <p className="text-sm">Aucun produit ne correspond à vos critères.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => {
            const Icon = PRODUCT_ICONS[product.slug] || Sparkles;

            return (
              <article
                key={product.slug}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#234b33] bg-[#07190f]/90 p-6 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-[#4ade80]/50 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,168,107,0.15)]"
              >
                <div>
                  {/* Top row: Icon & Status Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#4ade80]/30 bg-[#00a86b]/15 text-[#4ade80] group-hover:bg-[#00a86b] group-hover:text-white transition shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-[#00a86b]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#86efac] border border-[#00a86b]/40">
                      {product.status}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mt-4">
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#86efac] transition">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-[#86efac]">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Summary */}
                  <p className="mt-3 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {product.summary}
                  </p>

                  {/* Target Audience Pill */}
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Public Cible
                    </span>
                    <span className="block text-xs font-bold text-white mt-0.5 truncate">
                      {product.audience}
                    </span>
                  </div>

                  {/* Highlights */}
                  <div className="mt-4 space-y-1.5">
                    {product.highlights.slice(0, 2).map((highlight) => (
                      <div key={highlight} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#4ade80] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2">
                  <Link
                    href={`/produits/${product.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#00a86b] px-4 py-2.5 text-xs font-bold text-white shadow-[0_4px_16px_rgba(0,168,107,0.25)] transition hover:bg-[#008b58]"
                  >
                    Voir la fiche
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href={product.href}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-white/15"
                  >
                    Ouvrir
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
