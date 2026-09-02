"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  BriefcaseBusiness,
  Building2,
  CircuitBoard,
  Code2,
  GraduationCap,
  Sparkles,
  Workflow,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  Network,
  Wallet,
  Globe,
  Radio,
} from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

interface NodeData {
  id: string;
  name: string;
  category: string;
  layer: string;
  tagline: string;
  protocol: string;
  status: "Opérationnel" | "Production" | "Autopilot 24/7";
  audience: string;
  summary: string;
  icon: typeof Bot;
  href: string;
  externalHref: string;
  color: string;
  accentBg: string;
  x: number; // percentage in SVG
  y: number; // percentage in SVG
}

const NODES: NodeData[] = [
  {
    id: "merqalor",
    name: "MERQALOR",
    category: "Finance & Mobile Money",
    layer: "Couche Trésorerie & IA Financière",
    tagline: "Pilotage financier intelligent Wave, OM, MTN et banques",
    protocol: "Open Banking / Mobile Money APIs",
    status: "Opérationnel",
    audience: "Particuliers, freelances, PME, commerçants",
    summary: "Centralisation des comptes bancaires et Mobile Money, prévisions automatiques de trésorerie et 4 conseillers IA dédiés.",
    icon: Wallet,
    href: "/produits/merqalor",
    externalHref: "https://merqalor.koryxa.fr",
    color: "#10b981",
    accentBg: "rgba(16, 185, 129, 0.15)",
    x: 18,
    y: 20,
  },
  {
    id: "service-ia",
    name: "Service IA & Web",
    category: "Studio Numérique & Projets",
    layer: "Couche Delivery & Intégrations",
    tagline: "Le web, l’IA et l’automatisation pour votre entreprise",
    protocol: "Custom Stack / Next.js / Python API",
    status: "Production",
    audience: "Entreprises, startups, institutions, marques",
    summary: "Conception sur-mesure d’applications web, d’agents IA et de systèmes intelligents intégrés à vos opérations.",
    icon: Globe,
    href: "/produits/service-ia",
    externalHref: "https://service-ia.koryxa.fr",
    color: "#06b6d4",
    accentBg: "rgba(6, 182, 212, 0.15)",
    x: 82,
    y: 18,
  },
  {
    id: "flowcore",
    name: "FlowCore",
    category: "CRM & Autopilot Prospection",
    layer: "Couche Automatisation Multicanale",
    tagline: "Autopilot Intelligence & CRM WhatsApp / Email",
    protocol: "Baileys / Webhooks / n8n / Make",
    status: "Autopilot 24/7",
    audience: "Équipes commerciales, agences, PME",
    summary: "Prospection automatisée, WhatsApp Gateway, Email Outreach B2B, Telegram Instant Bot et capture continue de prospects.",
    icon: Radio,
    href: "/produits/flowcore",
    externalHref: "https://flowcore.koryxa.fr",
    color: "#8b5cf6",
    accentBg: "rgba(139, 92, 246, 0.15)",
    x: 88,
    y: 55,
  },
  {
    id: "chatlaya",
    name: "ChatLAYA",
    category: "Conversation & Modèles Souverains",
    layer: "Couche Dialogue & Expérience",
    tagline: "Assistant conversationnel et espace Founder Lab",
    protocol: "WebSocket / Streaming SSE",
    status: "Production",
    audience: "Grand public, créateurs, fondateurs, étudiants",
    summary: "Assistant conversationnel souverain pour explorer des idées, analyser des données et structurer des projets complets.",
    icon: Bot,
    href: "/produits/chatlaya",
    externalHref: "https://chatlaya.koryxa.fr",
    color: "#34d399",
    accentBg: "rgba(52, 211, 153, 0.15)",
    x: 12,
    y: 55,
  },
  {
    id: "corabiz",
    name: "CoraBiz",
    category: "ERP & Gestion Commerciale",
    layer: "Couche Opérations PME",
    tagline: "ERP intelligent et agents IA pour la croissance",
    protocol: "GraphQL / Event Bus",
    status: "Production",
    audience: "PME, commerçants, entreprises",
    summary: "Automatisation de la facturation, gestion des stocks, devis et suivi des ventes sous une seule interface connectée.",
    icon: BriefcaseBusiness,
    href: "/produits/corabiz",
    externalHref: "https://corabiz.koryxa.fr",
    color: "#f59e0b",
    accentBg: "rgba(245, 158, 11, 0.15)",
    x: 78,
    y: 84,
  },
  {
    id: "formation",
    name: "KORYXA Formation",
    category: "Talents & Certifications",
    layer: "Couche Montée en Compétences",
    tagline: "Formations pratiques en Data, IA et Automatisation",
    protocol: "LMS Connect / Cohortes",
    status: "Opérationnel",
    audience: "Étudiants, professionnels, équipes d'entreprise",
    summary: "Parcours certifiants, ateliers pratiques et mentorat pour maîtriser l’IA appliquée et le prompt engineering.",
    icon: GraduationCap,
    href: "/produits/formation",
    externalHref: "https://formation.koryxa.fr",
    color: "#ec4899",
    accentBg: "rgba(236, 72, 153, 0.15)",
    x: 22,
    y: 84,
  },
  {
    id: "api",
    name: "KORYXA API",
    category: "Passerelle & Connecteurs",
    layer: "Couche Système & Orchestration",
    tagline: "Moteur d’orchestration et connecteurs unifiés",
    protocol: "gRPC / OpenAPI v3 / mTLS",
    status: "Production",
    audience: "Développeurs, architectes système, CTOs",
    summary: "Points d'accès haute performance pour interconnecter vos applications d'entreprise aux modèles d'IA souverains.",
    icon: Code2,
    href: "/produits/api",
    externalHref: "https://api.koryxa.fr",
    color: "#38bdf8",
    accentBg: "rgba(56, 189, 248, 0.15)",
    x: 50,
    y: 92,
  },
  {
    id: "partner-portal",
    name: "Portail Partenaire",
    category: "Gouvernance & Réseau",
    layer: "Couche Supervision Régionale",
    tagline: "Espace officiel pour universités, partenaires et cohortes",
    protocol: "SSO Multi-Tenant / mTLS",
    status: "Opérationnel",
    audience: "Institutions, universités, incubateurs, ambassadeurs",
    summary: "Supervision des déploiements régionaux, gestion des cohortes apprenantes et partenariats institutionnels.",
    icon: Building2,
    href: "/produits/partner-portal",
    externalHref: "https://partenaires.koryxa.fr",
    color: "#eab308",
    accentBg: "rgba(234, 179, 8, 0.15)",
    x: 50,
    y: 10,
  },
];

export default function EcosystemOrchestrationVisualizer() {
  const [activeNodeId, setActiveNodeId] = useState<string>("merqalor");
  const [activeTab, setActiveTab] = useState<"network" | "layers">("network");

  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[0];
  const ActiveIcon = activeNode.icon;

  return (
    <div className="w-full">
      {/* Mode Switcher Tabs */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <button
            type="button"
            onClick={() => setActiveTab("network")}
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeTab === "network"
                ? "bg-[#00a86b] text-white shadow-[0_4px_14px_rgba(0,168,107,0.35)]"
                : "bg-white/70 text-slate-700 hover:bg-white hover:text-black dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            Graphe Réseau Interactif
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("layers")}
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeTab === "layers"
                ? "bg-[#00a86b] text-white shadow-[0_4px_14px_rgba(0,168,107,0.35)]"
                : "bg-white/70 text-slate-700 hover:bg-white hover:text-black dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Couches de la Suite ({NODES.length})
          </button>
        </div>

        <div className="hidden items-center gap-2 text-xs font-semibold text-[#008b58] dark:text-[#86efac] sm:flex">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
          </span>
          Écosystème temps réel synchronisé
        </div>
      </div>

      {activeTab === "network" ? (
        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr] items-stretch">
          {/* SVG Interactive Canvas */}
          <div className="relative min-h-[420px] sm:min-h-[480px] w-full overflow-hidden rounded-3xl border border-[#dfe5d8] bg-gradient-to-b from-[#f7fbf8] to-[#edf6f0] p-4 shadow-xl dark:border-[#234b33] dark:bg-gradient-to-b dark:from-[#07190f] dark:to-[#040f09]">
            {/* Background Grid Accent */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.15] dark:opacity-[0.12]"
              style={{
                backgroundImage: "radial-gradient(#00a86b 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Central Orbital Rings with CSS Spin */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00a86b]/20 dark:border-[#4ade80]/15" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-88 w-88 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#00a86b]/15 dark:border-[#4ade80]/10 animate-[spin_80s_linear_infinite]" />

            {/* SVG Connecting Beams */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="beamGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00a86b" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {NODES.map((node) => {
                const isActive = node.id === activeNodeId;
                return (
                  <g key={node.id}>
                    <line
                      x1="50"
                      y1="50"
                      x2={node.x}
                      y2={node.y}
                      stroke={isActive ? "url(#beamGradientLight)" : "rgba(0, 168, 107, 0.22)"}
                      strokeWidth={isActive ? "0.9" : "0.4"}
                      strokeDasharray={isActive ? "2, 1" : "none"}
                    />
                    {isActive && (
                      <circle r="1.3" fill="#00a86b" className="animate-pulse">
                        <animateMotion
                          path={`M 50 50 L ${node.x} ${node.y}`}
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Central Hub Node */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => setActiveNodeId("merqalor")}
            >
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border-2 border-[#00a86b] bg-gradient-to-br from-[#00a86b] to-[#0a4625] shadow-[0_0_35px_rgba(0,168,107,0.4)] transition duration-300 group-hover:scale-105">
                <div className="text-center text-white">
                  <Workflow className="mx-auto h-6 w-6 sm:h-7 sm:w-7 animate-pulse" />
                  <span className="block font-serif text-[11px] sm:text-xs font-black tracking-tight mt-1">
                    KORYXA
                  </span>
                  <span className="block text-[8px] font-bold uppercase tracking-widest text-[#86efac]">
                    Kernel Hub
                  </span>
                </div>
              </div>
            </div>

            {/* Orbiting Satellite Nodes */}
            {NODES.map((node) => {
              const isActive = node.id === activeNodeId;
              const Icon = node.icon;

              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNodeId(node.id)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 rounded-xl border p-2 text-left transition-all duration-200 ${
                    isActive
                      ? "scale-110 border-[#00a86b] bg-white dark:bg-[#0d2e1c] shadow-[0_4px_24px_rgba(0,168,107,0.35)] ring-2 ring-[#00a86b]/40"
                      : "border-slate-200 bg-white/90 text-slate-800 hover:border-[#00a86b]/50 hover:bg-white dark:border-white/15 dark:bg-[#07160e]/90 dark:text-white dark:hover:border-white/40 dark:hover:bg-[#0d2818]"
                  }`}
                  aria-label={`Inspecter ${node.name}`}
                >
                  <div
                    className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg shadow-sm"
                    style={{ backgroundColor: node.accentBg, color: node.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block pr-1">
                    <span className="block font-bold text-xs leading-tight text-slate-900 dark:text-white">
                      {node.name}
                    </span>
                    <span className="block text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                      {node.category.split("&")[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Node Inspector Panel */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#dfe5d8] bg-white/95 p-6 shadow-xl backdrop-blur-xl transition dark:border-[#234b33] dark:bg-[#07190f]/95 text-slate-900 dark:text-white">
            <div>
              {/* Header Inspector */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className="flex h-13 w-13 items-center justify-center rounded-2xl border border-black/10 dark:border-white/20 shadow-md"
                    style={{ backgroundColor: activeNode.accentBg, color: activeNode.color }}
                  >
                    <ActiveIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {activeNode.name}
                      </h3>
                      <span className="rounded-full bg-[#00a86b]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#008b58] dark:text-[#86efac] border border-[#00a86b]/30">
                        {activeNode.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                      {activeNode.layer}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tagline & Summary */}
              <div className="mt-4 space-y-2.5">
                <p className="text-sm font-bold text-[#008b58] dark:text-[#86efac]">
                  « {activeNode.tagline} »
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeNode.summary}
                </p>
              </div>

              {/* Tech Specs Matrix */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Protocole & Stack
                  </span>
                  <span className="block font-mono text-[11px] font-bold text-slate-900 dark:text-white mt-1 truncate">
                    {activeNode.protocol}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Cible Principale
                  </span>
                  <span className="block text-[11px] font-bold text-slate-900 dark:text-white mt-1 truncate">
                    {activeNode.audience}
                  </span>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-[#00a86b] dark:text-[#4ade80] shrink-0" />
                  <span>Accès unifié via le <strong>Compte KORYXA</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-[#00a86b] dark:text-[#4ade80] shrink-0" />
                  <span>Déploiement pan-africain et haute disponibilité</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5 pt-4 border-t border-slate-100 dark:border-white/10">
              <a
                href={activeNode.externalHref}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-4 py-3 text-xs font-bold text-white shadow-[0_4px_16px_rgba(0,168,107,0.3)] transition hover:bg-[#008b58]"
              >
                Ouvrir {activeNode.name}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href={activeNode.href}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-white/10 px-4 py-3 text-xs font-bold text-slate-800 dark:text-white transition hover:bg-slate-200 dark:hover:bg-white/20"
              >
                Fiche détaillée
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Architecture Layers View */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NODES.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-[#234b33] bg-white/95 dark:bg-[#07190f]/95 p-5 transition hover:-translate-y-1 hover:border-[#00a86b] shadow-md text-slate-900 dark:text-white"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: node.accentBg, color: node.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#00a86b]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#008b58] dark:text-[#86efac]">
                      {node.status}
                    </span>
                  </div>
                  <h4 className="mt-3 font-serif text-lg font-bold">{node.name}</h4>
                  <p className="text-xs font-semibold text-[#008b58] dark:text-[#86efac] mt-0.5">
                    {node.layer}
                  </p>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {node.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    {node.protocol.split("/")[0]}
                  </span>
                  <a
                    href={node.externalHref}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#00a86b] dark:text-[#4ade80] hover:underline inline-flex items-center gap-1"
                  >
                    Lancer →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
