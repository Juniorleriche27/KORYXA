"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Code2,
  ExternalLink,
  Globe,
  Radio,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { PUBLIC_ROUTES } from "@/config/routes";

const FLAGSHIP_PILLARS = [
  {
    id: "merqalor",
    name: "MERQALOR",
    category: "Finance & Mobile Money",
    badge: "Gestion Financière IA",
    tagline: "Pilotage intelligent de vos flux Wave, OM, MTN et comptes bancaires",
    description:
      "Centralisez l'ensemble de vos soldes et transactions en temps réel avec des prévisions automatiques de trésorerie et 4 conseillers IA spécialisés.",
    icon: Wallet,
    href: "https://merqalor.koryxa.fr",
    detailHref: "/produits/merqalor",
    color: "#10b981",
    accentBg: "rgba(16, 185, 129, 0.12)",
    features: [
      "Synchronisation multi-comptes Wave, Orange Money et banques",
      "Calcul prédictif de trésorerie à 30, 60 et 90 jours",
      "Alertes de trésorerie intelligentes et recommandations personnalisées",
    ],
    stat: "100% Souverain",
  },
  {
    id: "flowcore",
    name: "FlowCore",
    category: "CRM & Autopilot Prospection",
    badge: "Autopilot 24/7",
    tagline: "Prospection multicanale et CRM automatisé WhatsApp & Email",
    description:
      "Automatisez la capture, la qualification et la relance de vos prospects sur WhatsApp et Email sans intervention humaine manuelle.",
    icon: Radio,
    href: "https://flowcore.koryxa.fr",
    detailHref: "/produits/flowcore",
    color: "#8b5cf6",
    accentBg: "rgba(139, 92, 246, 0.12)",
    features: [
      "Passerelle WhatsApp Gateway intelligente avec réponses contextualisées",
      "Séquences de prospection Email B2B haute délivrabilité",
      "Supervision centralisée des leads et synchronisation CRM",
    ],
    stat: "24/7 Autonome",
  },
  {
    id: "chatlaya",
    name: "ChatLAYA",
    category: "IA Conversationnelle & Cadrage",
    badge: "IA Souveraine",
    tagline: "Assistant conversationnel souverain et cadrage d'idées",
    description:
      "Explorez, rédigez, analysez et structurez vos projets avec une IA conversationnelle souveraine adaptée aux langues et réalités locales.",
    icon: Bot,
    href: "https://chatlaya.koryxa.fr",
    detailHref: "/produits/chatlaya",
    color: "#06b6d4",
    accentBg: "rgba(6, 182, 212, 0.12)",
    features: [
      "Modèles conversationnels optimisés en français et contextes africains",
      "Espace Founder pour structurer et exporter des dossiers complets",
      "Analyses documentaires, synthèses stratégiques et cadrage de projets",
    ],
    stat: "Multi-Modèles",
  },
  {
    id: "infra",
    name: "KORYXA Infrastructure & APIs",
    category: "Infrastructure & Réseau",
    badge: "Passerelle Dev & Réseau",
    tagline: "Moteur d'orchestration, endpoints gRPC/REST et portail multi-tenant",
    description:
      "Intégrez les briques d'inférence, de facturation et de données KORYXA directement dans vos architectures avec une gouvernance unifiée.",
    icon: Code2,
    href: "https://api.koryxa.fr",
    detailHref: "/produits/api",
    color: "#f59e0b",
    accentBg: "rgba(245, 158, 11, 0.12)",
    features: [
      "Endpoints d'inférence haute performance et SDKs documentés",
      "Portail Partenaire officiel pour la supervision de cohortes et déploiements",
      "Authentification unique par Compte KORYXA universel (SSO)",
    ],
    stat: "99.98% Uptime",
  },
];

export default function FlagshipProductsSpotlight() {
  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden">
      {/* 2x2 Flagships Grid */}
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-2 w-full max-w-full min-w-0">
        {FLAGSHIP_PILLARS.map((pillar) => {
          const Icon = pillar.icon;

          return (
            <article
              key={pillar.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-8 shadow-[0_8px_30px_rgba(20,53,31,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-[#00a86b] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,168,107,0.15)] dark:border-[#234b33] dark:bg-[#07190f]/95 dark:shadow-[0_12px_36px_rgba(0,0,0,0.3)] dark:hover:border-[#4ade80] w-full max-w-full min-w-0 overflow-hidden box-border"
            >
              <div className="w-full min-w-0">
                {/* Header: Icon, Category & Badge */}
                <div className="flex items-center justify-between gap-2 w-full min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="flex h-11 w-11 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-2xl shadow-sm transition duration-300 group-hover:scale-105"
                      style={{ backgroundColor: pillar.accentBg, color: pillar.color }}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                        {pillar.category}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 transition group-hover:text-[#00a86b] dark:text-white dark:group-hover:text-[#86efac] truncate">
                        {pillar.name}
                      </h3>
                    </div>
                  </div>

                  <span className="rounded-full bg-[#00a86b]/10 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-[#008b58] border border-[#00a86b]/20 dark:bg-[#00a86b]/20 dark:text-[#86efac] shrink-0 truncate max-w-[45%] text-right">
                    {pillar.badge}
                  </span>
                </div>

                {/* Tagline */}
                <p className="mt-4 text-xs sm:text-sm font-bold text-[#008b58] dark:text-[#86efac] leading-snug">
                  « {pillar.tagline} »
                </p>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {pillar.description}
                </p>

                {/* Key Features List */}
                <div className="mt-5 space-y-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Capacités Clés :
                  </span>
                  {pillar.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-[#00a86b] dark:text-[#4ade80] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-7 pt-5 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href={pillar.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#00a86b] px-5 py-3 text-xs font-bold text-white shadow-[0_4px_14px_rgba(0,168,107,0.3)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
                  >
                    <span>Lancer {pillar.name.split(" ")[0]}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <Link
                    href={pillar.detailHref}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 transition hover:bg-slate-100 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/15"
                  >
                    <span>Fiche détaillée</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <Zap className="h-3.5 w-3.5 text-[#eab308]" />
                  <span>{pillar.stat}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Directory CTA Banner */}
      <div className="mt-10 rounded-3xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-6 sm:p-8 text-center shadow-sm dark:border-[#234b33] dark:bg-gradient-to-r dark:from-[#07190f] dark:via-[#05140c] dark:to-[#07190f]">
        <div className="mx-auto max-w-2xl">
          <h4 className="font-serif text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
            Besoin d’explorer l’ensemble des modules spécialisés ?
          </h4>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Découvrez le catalogue complet avec filtres par catégorie (Finance, CRM, IA, Studio, Formation, Infrastructure) et recherche instantanée.
          </p>
          <div className="mt-5">
            <Link
              href={PUBLIC_ROUTES.produits}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,168,107,0.3)] transition hover:bg-[#008b58] hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <span>Accéder au catalogue officiel (9 produits)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
