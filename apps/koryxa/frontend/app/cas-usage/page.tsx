import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  Code2,
  Compass,
  GraduationCap,
  KeyRound,
  Layers3,
  Lightbulb,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wallet,
  Globe,
  Radio,
  ExternalLink,
} from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";
import InteractivePersonaRouter from "@/components/marketing/InteractivePersonaRouter";

export const metadata: Metadata = {
  title: "Cas d’usage KORYXA | Trouver le Produit et la Trajectoire Adaptés",
  description:
    "Trouvez le bon produit KORYXA selon votre besoin : piloter votre trésorerie (MERQALOR), automatiser vos ventes (FlowCore), converser avec une IA souveraine (ChatLAYA), ou former vos équipes.",
};

const useCases = [
  {
    icon: Wallet,
    title: "Je veux piloter ma trésorerie et mes Mobile Money",
    description: "Centraliser Wave, Orange Money, MTN et mes banques avec 4 conseillers IA dédiés.",
    product: "MERQALOR",
    href: "https://merqalor.koryxa.fr",
    action: "Ouvrir MERQALOR",
    tag: "Finance & Mobile Money",
    external: true,
  },
  {
    icon: Radio,
    title: "Je veux automatiser ma prospection WhatsApp & Email",
    description: "Autopilot 24/7, scoring de prospects, WhatsApp Gateway et relances automatiques.",
    product: "FlowCore",
    href: "https://flowcore.koryxa.fr",
    action: "Ouvrir FlowCore",
    tag: "CRM & Autopilot",
    external: true,
  },
  {
    icon: Globe,
    title: "Je veux concevoir une application ou un projet IA sur-mesure",
    description: "Conception web, intégration d'agents intelligents et automatisation de processus métier.",
    product: "Service IA & Web",
    href: "https://service-ia.koryxa.fr",
    action: "Lancer mon projet",
    tag: "Studio Numérique",
    external: true,
  },
  {
    icon: Bot,
    title: "Je veux converser avec une IA et cadrer un projet",
    description: "Assistant conversationnel en français et langues locales, espace Founder Lab pour structurer un projet.",
    product: "ChatLAYA",
    href: "https://chatlaya.koryxa.fr",
    action: "Découvrir ChatLAYA",
    tag: "Conversation Souveraine",
    external: true,
  },
  {
    icon: Sparkles,
    title: "Je veux un cockpit modulaire pour mes assistants et agents IA",
    description: "6 espaces de travail, assistants IA et agents opérationnels avec gouvernance des actions sensibles.",
    product: "Cora",
    href: "https://cora.koryxa.fr",
    action: "Ouvrir Cora",
    tag: "Cockpit IA Modulaire",
    external: true,
  },
  {
    icon: BriefcaseBusiness,
    title: "Je veux gérer la facturation et les stocks de ma PME",
    description: "ERP IA, devis instantanés, stocks et encaissements centralisés pour entreprises.",
    product: "CoraBiz",
    href: "https://corabiz.koryxa.fr",
    action: "Découvrir CoraBiz",
    tag: "ERP & Gestion",
    external: true,
  },
  {
    icon: GraduationCap,
    title: "Je veux former ou certifier mes talents",
    description: "Acquisition de compétences pratiques en Data, ingénierie de prompt et automatisation IA.",
    product: "KORYXA Formation",
    href: "https://formation.koryxa.fr",
    action: "Voir les Formations",
    tag: "Talents & Écoles",
    external: true,
  },
  {
    icon: Code2,
    title: "Je veux intégrer des modèles IA par API",
    description: "Endpoints d'inférence sécurisés, connecteurs de données et passerelle d'orchestration pour vos applications.",
    product: "KORYXA API",
    href: "https://api.koryxa.fr",
    action: "Consulter la doc API",
    tag: "Système & Infrastructure",
    external: true,
  },
  {
    icon: Building2,
    title: "Je veux superviser un réseau ou devenir partenaire",
    description: "Espace officiel pour universités, incubateurs et ministères pour piloter les accès à grande échelle.",
    product: "Portail Partenaire",
    href: "https://partenaires.koryxa.fr",
    action: "Rejoindre le Réseau",
    tag: "Institution & Réseau",
    external: true,
  },
];

export default function UseCasesPage() {
  return (
    <div className="kx-pie-page kx-usecases-page">
      {/* Hero Header — Centered & High Contrast */}
      <section className="kx-usecases-hero relative overflow-hidden text-center py-16 sm:py-24">
        <div className="kx-pie-blob kx-pie-blob-one" />
        <div className="kx-pie-blob kx-pie-blob-two" />

        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center">
          <div className="kx-pie-badge inline-flex items-center justify-center gap-2 mb-6">
            <span className="kx-pie-dot" />
            <span>Routeur Intelligent de Besoins</span>
          </div>

          <h1 className="max-w-4xl mx-auto font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white leading-tight tracking-tight">
            Trouvez la solution adaptée à votre situation.
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-[#cbd5e1] leading-relaxed">
            L'écosystème KORYXA est conçu pour clarifier vos choix : explorez par profil d'utilisateur ou par intention concrète.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <Link
              href={PUBLIC_ROUTES.produits}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,168,107,0.3)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
            >
              Voir tous les produits ({useCases.length})
              <ArrowRight size={18} />
            </Link>
            <a
              href={KORYXA_ACCOUNT_URL}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Mon Compte KORYXA
            </a>
          </div>
        </div>
      </section>

      {/* 1. Interactive Persona Router */}
      <section className="py-20 sm:py-28 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
              Étape 1 : Choisissez votre profil
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-bold tracking-tight">
              Une trajectoire guidée pour chaque acteur
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Chaque persona accède à une combinaison personnalisée d’outils et d’espaces d’action.
            </p>
          </div>

          <InteractivePersonaRouter />
        </div>
      </section>

      {/* 2. Intent-Based Specific Use Case Grid */}
      <section className="py-20 sm:py-28 bg-white dark:bg-[#050b08] text-slate-900 dark:text-white transition-colors">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
              Étape 2 : Exploration par intention directe
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-bold tracking-tight">
              Que souhaitez-vous accomplir aujourd'hui ?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Chaque cas d'usage vous relie directement à l'espace produit ou au compte correspondant.
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-full min-w-0">
            {useCases.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-6 shadow-[0_8px_30px_rgba(20,53,31,0.06)] transition hover:-translate-y-1.5 hover:border-[#00a86b] hover:shadow-lg dark:border-[#234b33] dark:bg-[#07190f]/90 text-slate-900 dark:text-white text-left w-full max-w-full min-w-0 overflow-hidden box-border"
                >
                  <div className="w-full min-w-0">
                    <div className="flex items-center justify-between gap-2 w-full min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80] group-hover:bg-[#00a86b] group-hover:text-white transition">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-[#86efac] shrink-0 truncate max-w-[55%] text-right">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="mt-4 font-serif text-base sm:text-lg font-bold group-hover:text-[#00a86b] dark:group-hover:text-[#86efac] transition leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2.5 text-xs">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Solution Cible
                      </span>
                      <strong className="block text-slate-900 dark:text-white mt-0.5 font-bold">
                        {item.product}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#00a86b] px-4 py-3 text-xs font-bold text-white shadow-[0_4px_14px_rgba(0,168,107,0.25)] transition hover:bg-[#008b58]"
                    >
                      {item.action}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
