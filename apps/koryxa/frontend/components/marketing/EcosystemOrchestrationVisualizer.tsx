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
} from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

interface NodeData {
  id: string;
  name: string;
  category: string;
  layer: string;
  tagline: string;
  protocol: string;
  status: "Production" | "Bêta active" | "SaaS Disponible";
  audience: string;
  summary: string;
  icon: typeof Bot;
  href: string;
  color: string;
  accentBg: string;
  x: number; // percentage in SVG
  y: number; // percentage in SVG
}

const NODES: NodeData[] = [
  {
    id: "chatlaya",
    name: "ChatLAYA",
    category: "Conversation & Agents",
    layer: "Couche Expérience & Dialogue",
    tagline: "Assistant IA conversationnel et cadrage d’idées",
    protocol: "WebSocket / Streaming SSE",
    status: "Production",
    audience: "Grand public, créateurs, professionnels",
    summary: "Plateforme conversationnelle souveraine pour explorer, rédiger, analyser et interagir avec l'IA en langage naturel.",
    icon: Bot,
    href: "/produits/chatlaya",
    color: "#34d399",
    accentBg: "rgba(52, 211, 153, 0.15)",
    x: 20,
    y: 22,
  },
  {
    id: "neurokap",
    name: "NeuroKap",
    category: "Finance & Marchés",
    layer: "Couche Intelligence Analytique",
    tagline: "Analyse prédictive et intelligence financière",
    protocol: "REST API / Kafka Event Stream",
    status: "Production",
    audience: "Investisseurs, analystes, banques",
    summary: "Moteur d'analyse financière et de traitement de données de marché adapté aux dynamiques économiques africaines.",
    icon: CircuitBoard,
    href: "/produits/neurokap",
    color: "#60a5fa",
    accentBg: "rgba(96, 165, 250, 0.15)",
    x: 80,
    y: 20,
  },
  {
    id: "corabiz",
    name: "CoraBiz",
    category: "ERP & Automatisation",
    layer: "Couche Entreprise & Opérations",
    tagline: "Gestion intelligente pour PME et entreprises",
    protocol: "GraphQL / Webhooks",
    status: "Bêta active",
    audience: "PME, commerçants, startups",
    summary: "Automatisation de la facturation, gestion des stocks et suivi d'activité connectée au compte unique KORYXA.",
    icon: BriefcaseBusiness,
    href: "/produits/corabiz",
    color: "#f59e0b",
    accentBg: "rgba(245, 158, 11, 0.15)",
    x: 88,
    y: 65,
  },
  {
    id: "formation",
    name: "KORYXA Formation",
    category: "Talents & Éducation",
    layer: "Couche Montée en Compétences",
    tagline: "Formation accélérée aux métiers et outils IA",
    protocol: "LMS Connect / SCORM Cloud",
    status: "SaaS Disponible",
    audience: "Étudiants, reconversions, équipes",
    summary: "Parcours certifiants et ateliers pratiques pour maîtriser l'ingénierie du prompt, le machine learning et l'automatisation.",
    icon: GraduationCap,
    href: "/produits/formation",
    color: "#a78bfa",
    accentBg: "rgba(167, 139, 250, 0.15)",
    x: 14,
    y: 68,
  },
  {
    id: "api",
    name: "KORYXA API",
    category: "Système & Infrastructure",
    layer: "Couche Passerelle & Orchestration",
    tagline: "Moteur d'orchestration et connecteurs IA",
    protocol: "gRPC / OpenAPI v3",
    status: "Production",
    audience: "Développeurs, architectes système",
    summary: "Points d'accès haute performance pour interconnecter vos applications d'entreprise aux modèles d'IA de l'écosystème.",
    icon: Code2,
    href: "/produits/api",
    color: "#38bdf8",
    accentBg: "rgba(56, 189, 248, 0.15)",
    x: 50,
    y: 88,
  },
  {
    id: "partner-portal",
    name: "Portail Partenaire",
    category: "Institution & Réseau",
    layer: "Couche Gouvernance & Collaboration",
    tagline: "Espace dédié aux institutions, écoles et partenaires",
    protocol: "mTLS / SSO Multi-Tenant",
    status: "SaaS Disponible",
    audience: "Institutions, universités, partenaires",
    summary: "Supervision des déploiements régionaux, gestion des cohortes apprenantes et partenariats stratégiques KORYXA.",
    icon: Building2,
    href: "/produits/partner-portal",
    color: "#f43f5e",
    accentBg: "rgba(244, 63, 94, 0.15)",
    x: 50,
    y: 12,
  },
];

export default function EcosystemOrchestrationVisualizer() {
  const [activeNodeId, setActiveNodeId] = useState<string>("chatlaya");
  const [activeTab, setActiveTab] = useState<"network" | "layers">("network");

  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[0];
  const ActiveIcon = activeNode.icon;

  return (
    <div className="w-full">
      {/* Mode Switcher */}
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("network")}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeTab === "network"
                ? "bg-[#00a86b] text-white shadow-[0_4px_12px_rgba(0,168,107,0.3)]"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            Graphe Réseau Interactif
          </button>
          <button
            onClick={() => setActiveTab("layers")}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeTab === "layers"
                ? "bg-[#00a86b] text-white shadow-[0_4px_12px_rgba(0,168,107,0.3)]"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Couches d’Architecture
          </button>
        </div>

        <div className="hidden items-center gap-2 text-[11px] font-medium text-[#86efac] sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
          </span>
          Nœuds synchronisés
        </div>
      </div>

      {activeTab === "network" ? (
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
          {/* SVG Interactive Canvas */}
          <div className="relative min-h-[380px] sm:min-h-[440px] w-full overflow-hidden rounded-2xl border border-[#234b33] bg-gradient-to-b from-[#07190f] to-[#040f09] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            {/* Background Grid Accent */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "radial-gradient(#4ade80 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Central Orbital Rings */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#4ade80]/15" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#4ade80]/10 animate-[spin_60s_linear_infinite]" />

            {/* SVG Connecting Beams */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00a86b" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#4ade80" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#86efac" stopOpacity="0.2" />
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
                      stroke={isActive ? "url(#beamGradient)" : "rgba(74, 222, 128, 0.18)"}
                      strokeWidth={isActive ? "0.8" : "0.35"}
                      strokeDasharray={isActive ? "2, 1" : "none"}
                    />
                    {isActive && (
                      <circle
                        r="1.2"
                        fill="#4ade80"
                        className="animate-pulse"
                      >
                        <animateMotion
                          path={`M 50 50 L ${node.x} ${node.y}`}
                          dur="1.8s"
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
              onClick={() => setActiveNodeId("chatlaya")}
            >
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border-2 border-[#4ade80]/60 bg-gradient-to-br from-[#00a86b] to-[#0d3b22] shadow-[0_0_35px_rgba(0,168,107,0.45)] transition group-hover:scale-105">
                <div className="text-center">
                  <Workflow className="mx-auto h-6 w-6 text-white sm:h-7 sm:w-7" />
                  <span className="block font-serif text-[11px] font-black tracking-tight text-white mt-1">
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
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${
                    isActive
                      ? "scale-110 border-[#4ade80] bg-[#0d2e1c] shadow-[0_0_24px_rgba(74,222,128,0.4)]"
                      : "border-white/15 bg-[#07160e]/90 hover:border-white/40 hover:bg-[#0d2818]"
                  }`}
                  aria-label={`Inspecter ${node.name}`}
                >
                  <div
                    className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: node.accentBg, color: node.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block pr-1">
                    <span className="block font-bold text-xs text-white leading-tight">
                      {node.name}
                    </span>
                    <span className="block text-[9px] font-semibold text-slate-400">
                      {node.category.split("&")[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Node Inspector Glass Panel */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#234b33] bg-[#07190f]/90 p-5 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
            <div>
              {/* Header Inspector */}
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 shadow-md"
                    style={{ backgroundColor: activeNode.accentBg, color: activeNode.color }}
                  >
                    <ActiveIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">
                        {activeNode.name}
                      </h3>
                      <span className="rounded-full bg-[#00a86b]/20 px-2 py-0.5 text-[10px] font-bold text-[#86efac] border border-[#00a86b]/40">
                        {activeNode.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      {activeNode.layer}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tagline & Summary */}
              <div className="mt-4 space-y-3">
                <p className="text-sm font-semibold text-[#86efac]">
                  « {activeNode.tagline} »
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeNode.summary}
                </p>
              </div>

              {/* Tech Specs Matrix */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Protocole Réseau
                  </span>
                  <span className="block font-mono text-[11px] font-bold text-white mt-1">
                    {activeNode.protocol}
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Public Cible
                  </span>
                  <span className="block text-[11px] font-bold text-white mt-1 truncate">
                    {activeNode.audience}
                  </span>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#4ade80] shrink-0" />
                  <span>Accès unifié via le <strong>Compte KORYXA</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#4ade80] shrink-0" />
                  <span>Chiffrement et isolation des flux de données</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-2 pt-3 border-t border-white/10">
              <Link
                href={activeNode.href}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(0,168,107,0.3)] transition hover:bg-[#008b58]"
              >
                Explorer {activeNode.name}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href={KORYXA_ACCOUNT_URL}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
              >
                Accès direct
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Architecture Layers View */
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NODES.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className="rounded-2xl border border-[#234b33] bg-[#07190f]/90 p-4 transition hover:border-[#4ade80]/40 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: node.accentBg, color: node.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[#86efac]">
                    {node.status}
                  </span>
                </div>
                <h4 className="mt-3 text-base font-bold text-white">{node.name}</h4>
                <p className="text-[11px] font-semibold text-[#86efac] mt-0.5">{node.layer}</p>
                <p className="mt-2 text-xs text-slate-300 line-clamp-2">{node.summary}</p>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-400">{node.protocol}</span>
                  <Link href={node.href} className="font-bold text-[#4ade80] hover:underline inline-flex items-center gap-1">
                    Voir la fiche →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
