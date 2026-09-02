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
  }[];
  steps: string[];
  ctaText: string;
  ctaHref: string;
  isExternal?: boolean;
}

const PERSONAS: PersonaConfig[] = [
  {
    id: "business",
    label: "Entreprise & Organisation",
    badge: "B2B & PME",
    icon: Building2,
    title: "Optimisez vos opérations et structurez vos flux IA",
    description:
      "Vous dirigez une entreprise, une institution ou une PME : KORYXA centralise vos outils de gestion intelligente, automatise vos processus et sécurise vos données.",
    recommendedProducts: [
      {
        name: "CoraBiz",
        slug: "corabiz",
        tagline: "ERP IA & Automatisation PME",
        icon: BriefcaseBusiness,
      },
      {
        name: "Services IA",
        slug: "services-ia",
        tagline: "Projets et intégrations sur-mesure",
        icon: Sparkles,
      },
      {
        name: "Portail Partenaire",
        slug: "partner-portal",
        tagline: "Supervision et gestion d'accès",
        icon: Building2,
      },
    ],
    steps: [
      "Création du compte d'organisation KORYXA",
      "Activation de l'espace CoraBiz ou audit de projet IA",
      "Connexion sécurisée aux outils existants (API / Connecteurs)",
    ],
    ctaText: "Déployer pour mon organisation",
    ctaHref: "/produits/corabiz",
  },
  {
    id: "individual",
    label: "Utilisateur & Créateur",
    badge: "Usage Quotidien",
    icon: Bot,
    title: "Discutez, créez et accélérez vos projets au quotidien",
    description:
      "Vous souhaitez converser avec une IA intelligente en français et contextes africains, rédiger des documents, structurer des idées ou apprendre plus vite.",
    recommendedProducts: [
      {
        name: "ChatLAYA",
        slug: "chatlaya",
        tagline: "Assistant conversationnel intelligent",
        icon: Bot,
      },
      {
        name: "Compte KORYXA",
        slug: "account",
        tagline: "Pass universel pour tous vos accès",
        icon: ShieldCheck,
      },
    ],
    steps: [
      "Connexion instantanée avec votre Compte KORYXA",
      "Ouverture de ChatLAYA sans configuration complexe",
      "Sauvegarde centralisée de vos sessions et espaces",
    ],
    ctaText: "Ouvrir ChatLAYA gratuitement",
    ctaHref: "/produits/chatlaya",
  },
  {
    id: "finance",
    label: "Finance & Marchés",
    badge: "Analytique & Data",
    icon: CircuitBoard,
    title: "Exploitez l'intelligence prédictive sur les marchés",
    description:
      "Pour les analystes, investisseurs et institutions financières qui nécessitent des insights précis sur les tendances économiques et financières africaines.",
    recommendedProducts: [
      {
        name: "NeuroKap",
        slug: "neurokap",
        tagline: "Intelligence financière et marchés",
        icon: CircuitBoard,
      },
      {
        name: "KORYXA API",
        slug: "api",
        tagline: "Flux de données et modèles temps réel",
        icon: Code2,
      },
    ],
    steps: [
      "Identification des sources et indicateurs clés",
      "Accès aux tableaux de bord analytiques NeuroKap",
      "Intégration des flux prédictifs par API",
    ],
    ctaText: "Découvrir NeuroKap",
    ctaHref: "/produits/neurokap",
  },
  {
    id: "talent",
    label: "Étudiant & Talent IA",
    badge: "Formation & Upskilling",
    icon: GraduationCap,
    title: "Montez en compétences sur les technologies de demain",
    description:
      "Vous souhaitez vous former aux outils d'IA générative, à l'ingénierie de prompt ou développer des solutions concrètes pour le marché du travail.",
    recommendedProducts: [
      {
        name: "KORYXA Formation",
        slug: "formation",
        tagline: "Programmes certifiants et ateliers pratiques",
        icon: GraduationCap,
      },
      {
        name: "ChatLAYA Lab",
        slug: "chatlaya",
        tagline: "Environnement d'expérimentation IA",
        icon: Bot,
      },
    ],
    steps: [
      "Évaluation de votre niveau et de vos objectifs",
      "Inscription à une cohorte ou un parcours e-learning",
      "Validation de certification officielle KORYXA",
    ],
    ctaText: "Consulter les formations",
    ctaHref: "/produits/formation",
  },
  {
    id: "developer",
    label: "Développeur & Tech",
    badge: "API & Infrastructure",
    icon: Code2,
    title: "Bâtissez sur l'infrastructure d'orchestration KORYXA",
    description:
      "Accédez à nos endpoints d'inférence, SDKs et passerelles de données pour intégrer des fonctionnalités IA robustes dans vos propres applications.",
    recommendedProducts: [
      {
        name: "KORYXA API",
        slug: "api",
        tagline: "Endpoints unifiés et connecteurs souverains",
        icon: Code2,
      },
      {
        name: "Compte KORYXA Developer",
        slug: "account",
        tagline: "Gestion des clés d'API et quotas",
        icon: ShieldCheck,
      },
    ],
    steps: [
      "Génération de vos clés d'accès développeur",
      "Test des endpoints via la documentation interactive",
      "Déploiement en production avec supervision des quotas",
    ],
    ctaText: "Accéder à l’API KORYXA",
    ctaHref: "/produits/api",
  },
];

export default function InteractivePersonaRouter() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("business");
  const currentPersona = PERSONAS.find((p) => p.id === selectedPersonaId) || PERSONAS[0];

  return (
    <div className="w-full rounded-3xl border border-[#234b33] bg-[#07190f]/90 p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      {/* Persona Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-5">
        {PERSONAS.map((persona) => {
          const isSelected = persona.id === selectedPersonaId;
          const Icon = persona.icon;
          return (
            <button
              key={persona.id}
              onClick={() => setSelectedPersonaId(persona.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                isSelected
                  ? "bg-[#00a86b] text-white shadow-[0_4px_16px_rgba(0,168,107,0.35)] scale-102"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{persona.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Persona Detail Grid */}
      <div className="mt-6 grid gap-8 lg:grid-cols-2 items-center">
        {/* Left: Persona narrative & recommended products */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4ade80]/30 bg-[#00a86b]/15 px-3 py-1 text-xs font-bold text-[#86efac]">
            <Compass className="h-3.5 w-3.5" />
            <span>Orientation : {currentPersona.badge}</span>
          </div>

          <h3 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl leading-snug">
            {currentPersona.title}
          </h3>

          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            {currentPersona.description}
          </p>

          <div className="mt-6">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Produits recommandés pour ce profil :
            </span>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {currentPersona.recommendedProducts.map((prod) => {
                const Icon = prod.icon;
                return (
                  <Link
                    key={prod.slug}
                    href={`/produits/${prod.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-[#4ade80]/40 hover:bg-[#0d2818]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00a86b]/20 text-[#4ade80] group-hover:bg-[#00a86b] group-hover:text-white transition">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-white truncate">
                        {prod.name}
                      </span>
                      <span className="block text-[10px] text-slate-400 truncate">
                        {prod.tagline}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Step-by-Step Trajectory Card */}
        <div className="rounded-2xl border border-[#234b33] bg-gradient-to-b from-[#0d2818] to-[#040f09] p-6 shadow-inner">
          <span className="block font-serif text-xs font-bold uppercase tracking-widest text-[#86efac]">
            Trajectoire d’activation KORYXA
          </span>

          <div className="mt-4 space-y-3.5">
            {currentPersona.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00a86b] text-xs font-black text-white shadow-sm">
                  {index + 1}
                </div>
                <p className="text-xs text-slate-200 font-medium pt-0.5 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={currentPersona.ctaHref}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-5 py-3 text-xs font-bold text-white shadow-[0_8px_24px_rgba(0,168,107,0.35)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
            >
              {currentPersona.ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={KORYXA_ACCOUNT_URL}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/10"
            >
              Compte KORYXA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
