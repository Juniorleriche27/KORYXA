"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  BriefcaseBusiness,
  Building2,
  CircuitBoard,
  Code2,
  GraduationCap,
  Layers3,
  PackageCheck,
  Search,
  Sparkles,
  Workflow,
  X,
  ArrowRight,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import { productList } from "@/app/produits/data";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";
import { useTheme } from "@/components/theme/ThemeProvider";

interface CommandItem {
  id: string;
  title: string;
  category: "Produits" | "Navigation" | "Cas d’usage" | "Actions";
  description: string;
  icon: typeof Bot;
  href?: string;
  isExternal?: boolean;
  action?: () => void;
}

const STATIC_ITEMS: CommandItem[] = [
  {
    id: "nav-home",
    title: "Accueil KORYXA",
    category: "Navigation",
    description: "Porte d’entrée de la plateforme d’orchestration IA",
    icon: Sparkles,
    href: PUBLIC_ROUTES.home,
  },
  {
    id: "nav-eco",
    title: "Écosystème KORYXA",
    category: "Navigation",
    description: "Architecture, couches et orchestration",
    icon: Workflow,
    href: PUBLIC_ROUTES.ecosysteme,
  },
  {
    id: "nav-prods",
    title: "Tous les Produits",
    category: "Navigation",
    description: "Catalogue complet des produits autonomes",
    icon: Layers3,
    href: PUBLIC_ROUTES.produits,
  },
  {
    id: "nav-cases",
    title: "Cas d’usage & Besoins",
    category: "Cas d’usage",
    description: "Trouver le bon produit selon votre situation",
    icon: Sparkles,
    href: PUBLIC_ROUTES.casUsage,
  },
  {
    id: "nav-partners",
    title: "Partenaires & Institutions",
    category: "Navigation",
    description: "Rejoindre l’écosystème KORYXA",
    icon: Building2,
    href: PUBLIC_ROUTES.partenaires,
  },
  {
    id: "nav-about",
    title: "À propos de KORYXA",
    category: "Navigation",
    description: "Vision, mission et engagement Afrique",
    icon: Building2,
    href: PUBLIC_ROUTES.apropos,
  },
  {
    id: "nav-contact",
    title: "Contact officiel",
    category: "Navigation",
    description: "Email, WhatsApp et support KORYXA",
    icon: PackageCheck,
    href: PUBLIC_ROUTES.contact,
  },
  {
    id: "action-account",
    title: "Accéder au Compte KORYXA",
    category: "Actions",
    description: "Identité unique pour accéder à tous les produits",
    icon: ExternalLink,
    href: KORYXA_ACCOUNT_URL,
    isExternal: true,
  },
];

const PRODUCT_ICONS: Record<string, typeof Bot> = {
  chatlaya: Bot,
  cora: Workflow,
  "partner-portal": Building2,
  api: Code2,
  formation: GraduationCap,
  neurokap: CircuitBoard,
  corabiz: BriefcaseBusiness,
  "services-ia": PackageCheck,
};

export default function CommandMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Combine product items with static items
  const allItems = useMemo<CommandItem[]>(() => {
    const productItems: CommandItem[] = productList.map((p) => ({
      id: `prod-${p.slug}`,
      title: p.name,
      category: "Produits",
      description: `${p.tagline} — ${p.audience}`,
      icon: PRODUCT_ICONS[p.slug] || Sparkles,
      href: `/produits/${p.slug}`,
    }));

    const themeItem: CommandItem = {
      id: "action-theme",
      title: theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre",
      category: "Actions",
      description: `Actuellement en thème ${theme === "dark" ? "Sombre" : "Clair"}`,
      icon: theme === "dark" ? Sun : Moon,
      action: () => setTheme(theme === "dark" ? "light" : "dark"),
    };

    return [...productItems, ...STATIC_ITEMS, themeItem];
  }, [theme, setTheme]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    const lower = query.toLowerCase().trim();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower),
    );
  }, [allItems, query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1,
        );
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredItems[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  // Reset index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: CommandItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.isExternal && item.href) {
      window.open(item.href, "_blank", "noreferrer");
    } else if (item.href) {
      router.push(item.href);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-20 backdrop-blur-md transition-all sm:pt-28"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#234b33] bg-[#07160e]/95 text-white shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 border-b border-[#1b3d29] px-5 py-4">
          <Search className="h-5 w-5 text-[#4ade80]" />
          <input
            type="text"
            placeholder="Rechercher un produit, une fonction, un cas d’usage..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden rounded bg-white/10 px-2 py-0.5 text-xs text-slate-300 sm:inline-block">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm">Aucun résultat trouvé pour « {query} »</p>
              <p className="mt-1 text-xs text-slate-500">
                Essayez avec « ChatLAYA », « Formation », « API » ou « Compte »
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition ${
                      isSelected
                        ? "bg-[#00a86b]/20 text-white shadow-[inset_0_0_0_1px_rgba(74,222,128,0.4)]"
                        : "text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                          isSelected
                            ? "border-[#4ade80]/50 bg-[#00a86b]/30 text-[#4ade80]"
                            : "border-white/10 bg-white/5 text-slate-300"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">
                            {item.title}
                          </span>
                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-[#86efac]">
                            {item.category}
                          </span>
                        </div>
                        <p className="truncate text-xs text-slate-400 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="ml-3 shrink-0 text-slate-400">
                      {item.isExternal ? (
                        <ExternalLink className="h-4 w-4" />
                      ) : (
                        <ArrowRight
                          className={`h-4 w-4 transition ${
                            isSelected ? "translate-x-1 text-[#4ade80]" : "opacity-0"
                          }`}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-[#1b3d29] bg-[#05100a] px-5 py-2.5 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded bg-white/10 px-1.5 py-0.5">↑</kbd>{" "}
              <kbd className="rounded bg-white/10 px-1.5 py-0.5">↓</kbd> Naviguer
            </span>
            <span>
              <kbd className="rounded bg-white/10 px-1.5 py-0.5">↵</kbd> Ouvrir
            </span>
          </div>
          <span>KORYXA Hub Global</span>
        </div>
      </div>
    </div>
  );
}
