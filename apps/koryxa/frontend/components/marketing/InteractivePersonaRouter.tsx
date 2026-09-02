"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  CircuitBoard,
  Code2,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  Wallet,
  Globe,
  Radio,
  ExternalLink,
} from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

interface PersonaConfig {
  id: string;
  label: string;
  badge: string;
  icon: typeof Building2;
  title: string;
  description: string;
  recommendedProducts: {
    name: string;
    slug: string;
    tagline: string;
    icon: typeof Bot;
    href: string;
  }[];
  steps: string[];
  ctaText: string;
  ctaHref: string;
}

const PERSONAS: PersonaConfig[] = [
  {
    id: "finance",
    label: "Particulier & Trésorerie",
    badge: "Finance & Mobile Money",
    icon: Wallet,
    title: "Pilotez vos flux Wave, Orange Money, MTN et vos banques",
    description:
      "Centralisez tous vos comptes et bénéficiez de prévisions de trésorerie automatiques avec 4 conseillers IA dédiés pour faire grandir votre argent.",
    recommendedProducts: [
      {
        name: "MERQALOR",
        slug: "merqalor",
        tagline: "Pilotage financier intelligent",
        icon: Wallet,
        href: "https://merqalor.koryxa.fr",
      },
      {
        name: "ChatLAYA",
        slug: "chatlaya",
        tagline: "Assistant conversationnel souverain",
        icon: Bot,
        href: "https://chatlaya.koryxa.fr",
      },
    ],
    steps: [
      "Connexion sécurisée via votre Compte KORYXA",
      "Connexion automatique de vos comptes Wave, OM et banques",
      "Activation des alertes et conseils IA de trésorerie",
    ],
    ctaText: "Accéder à MERQALOR",
    ctaHref: "https://merqalor.koryxa.fr",
  },
  {
    id: "business",
    label: "Entreprise & Organisation",
    badge: "B2B & PME",
    icon: Building2,
    title: "Automatisez vos ventes, votre CRM et votre gestion globale",
    description:
      "Vous dirigez une entreprise ou une PME : KORYXA centralise la prospection multicanale, la facturation et les projets sur-mesure sous une seule gouvernance.",
    recommendedProducts: [
      {
        name: "FlowCore",
        slug: "flowcore",
        tagline: "Autopilot CRM WhatsApp / Email",
        icon: Radio,
        href: "https://flowcore.koryxa.fr",
      },
      {
        name: "CoraBiz",
        slug: "corabiz",
        tagline: "ERP IA & Gestion de facturation",
        icon: BriefcaseBusiness,
        href: "https://corabiz.koryxa.fr",
      },
      {
        name: "Service IA & Web",
        slug: "service-ia",
        tagline: "Studio d'ingénierie numérique",
        icon: Globe,
        href: "https://service-ia.koryxa.fr",
      },
    ],
    steps: [
      "Activation de votre espace d’organisation KORYXA",
      "Lancement de l'Autopilot CRM FlowCore ou CoraBiz",
      "Connexion aux passerelles WhatsApp et passerelles de paiement",
    ],
    ctaText: "Déployer pour mon organisation",
    ctaHref: "https://flowcore.koryxa.fr",
  },
  {
    id: "individual",
    label: "Créateur & Porteur de Projet",
    badge: "Conversation & Founder",
    icon: Bot,
    title: "Discutez, cadrez et accélérez vos projets en français & contextes locaux",
    description:
      "Pour les créateurs, fondateurs et professionnels qui souhaitent converser avec des modèles IA souverains et structurer un dossier d'entreprise complet.",
    recommendedProducts: [
      {
        name: "ChatLAYA",
        slug: "chatlaya",
        tagline: "Assistant conversationnel souverain",
        icon: Bot,
        href: "https://chatlaya.koryxa.fr",
      },
      {
        name: "Service IA & Web",
        slug: "service-ia",
        tagline: "Studio d'exécution digitale",
        icon: Globe,
        href: "https://service-ia.koryxa.fr",
      },
    ],
    steps: [
      "Connexion instantanée avec votre compte KORYXA",
      "Ouverture de ChatLAYA et de l'espace Founder",
      "Génération et export de vos livrables de projet",
    ],
    ctaText: "Ouvrir ChatLAYA",
    ctaHref: "https://chatlaya.koryxa.fr",
  },
  {
    id: "talent",
    label: "Étudiant & Talent IA",
    badge: "Formation & Upskilling",
    icon: GraduationCap,
    title: "Montez en compétences et validez des certifications pratiques",
    description:
      "Acquérez les compétences les plus recherchées du marché en Data Analysis, Prompt Engineering et automatisation d'agents IA par la pratique.",
    recommendedProducts: [
      {
        name: "KORYXA Formation",
        slug: "formation",
        tagline: "Formations pratiques certifiantes",
        icon: GraduationCap,
        href: "https://formation.koryxa.fr",
      },
      {
        name: "NeuroKap",
        slug: "neurokap",
        tagline: "Entraînement cognitif & score",
        icon: CircuitBoard,
        href: "https://neurokap.koryxa.fr",
      },
    ],
    steps: [
      "Choix du parcours certifiant (Python, IA, Data)",
      "Participation aux ateliers immersifs et mentorat",
      "Obtention de la certification KORYXA vérifiable",
    ],
    ctaText: "Consulter les formations",
    ctaHref: "https://formation.koryxa.fr",
  },
  {
    id: "developer",
    label: "Développeur & Tech",
    badge: "API & Infrastructure",
    icon: Code2,
    title: "Bâtissez sur l'infrastructure d'orchestration et connecteurs KORYXA",
    description:
      "Accédez aux endpoints d'inférence gRPC / REST, SDKs et passerelles de données pour intégrer des fonctionnalités IA robustes dans vos propres applications.",
    recommendedProducts: [
      {
        name: "KORYXA API",
        slug: "api",
        tagline: "Moteur et connecteurs unifiés",
        icon: Code2,
        href: "https://api.koryxa.fr",
      },
      {
        name: "Portail Partenaire",
        slug: "partner-portal",
        tagline: "Supervision et multi-tenant",
        icon: Building2,
        href: "https://partenaires.koryxa.fr",
      },
    ],
    steps: [
      "Génération de vos clés API sécurisées",
      "Intégration via les SDKs et connecteurs OpenAPI",
      "Déploiement en production avec supervision des quotas",
    ],
    ctaText: "Accéder à l’API",
    ctaHref: "https://api.koryxa.fr",
  },
];

export default function InteractivePersonaRouter() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("finance");
  const currentPersona = PERSONAS.find((p) => p.id === selectedPersonaId) || PERSONAS[0];

  return (
    <div className="w-full rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-8 shadow-[0_8px_30px_rgba(20,53,31,0.06)] backdrop-blur-xl dark:border-[#234b33] dark:bg-[#07190f]/95 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] text-slate-900 dark:text-white">
      {/* Persona Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none w-full sm:flex-wrap border-b border-slate-100 dark:border-white/10">
        {PERSONAS.map((persona) => {
          const isSelected = persona.id === selectedPersonaId;
          const Icon = persona.icon;
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => setSelectedPersonaId(persona.id)}
              className={`whitespace-nowrap inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                isSelected
                  ? "bg-[#00a86b] text-white shadow-[0_4px_16px_rgba(0,168,107,0.35)] scale-102"
                  : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#00a86b]/40 hover:bg-white hover:text-black dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{persona.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Persona Detail Grid */}
      <div className="mt-7 grid gap-8 lg:grid-cols-2 items-center">
        {/* Left: Persona narrative & recommended products */}
        <div className="text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00a86b]/30 bg-[#00a86b]/10 px-3.5 py-1 text-xs font-bold text-[#008b58] dark:bg-[#00a86b]/15 dark:text-[#86efac]">
            <Compass className="h-3.5 w-3.5" />
            <span>Orientation : {currentPersona.badge}</span>
          </div>

          <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentPersona.title}
          </h3>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentPersona.description}
          </p>

          <div className="mt-6">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Solutions recommandées :
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              {currentPersona.recommendedProducts.map((prod) => {
                const Icon = prod.icon;
                return (
                  <a
                    key={prod.name}
                    href={prod.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 transition hover:border-[#00a86b] hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-[#4ade80]/40 dark:hover:bg-[#0d2818]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00a86b]/15 text-[#00a86b] transition group-hover:bg-[#00a86b] group-hover:text-white dark:bg-[#00a86b]/20 dark:text-[#4ade80]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <span className="block text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#00a86b]">
                        {prod.name}
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {prod.tagline}
                      </span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#00a86b] shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Step-by-Step Trajectory Card */}
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-[#f8faf8] to-[#edf4f0] p-5 sm:p-7 shadow-md dark:border-[#234b33] dark:bg-gradient-to-b dark:from-[#0d2818] dark:to-[#040f09]">
          <span className="block font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#86efac] text-left">
            Trajectoire d’activation KORYXA
          </span>

          <div className="mt-4 space-y-3.5">
            {currentPersona.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00a86b] text-xs font-black text-white shadow-sm mt-0.5">
                  {index + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed text-left">
                  {step}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={currentPersona.ctaHref}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-5 py-3.5 text-xs font-bold text-white shadow-[0_8px_24px_rgba(0,168,107,0.35)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
            >
              {currentPersona.ctaText}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={KORYXA_ACCOUNT_URL}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-100 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Compte KORYXA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
