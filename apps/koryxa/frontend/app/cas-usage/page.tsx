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
} from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";
import InteractivePersonaRouter from "@/components/marketing/InteractivePersonaRouter";

export const metadata: Metadata = {
  title: "Cas d’usage KORYXA | Trouver le Produit et la Trajectoire Adaptés",
  description:
    "Trouvez le bon produit KORYXA selon votre besoin : converser avec une IA souveraine, optimiser vos flux d'entreprise, former des équipes, intégrer des APIs ou devenir partenaire.",
};

const useCases = [
  {
    icon: Bot,
    title: "Je veux converser avec une IA intelligente",
    description: "Explorer une idée, rédiger des synthèses, cadrer une demande ou accélérer votre travail au quotidien.",
    product: "ChatLAYA",
    href: "/produits/chatlaya",
    action: "Découvrir ChatLAYA",
    tag: "Conversation & Assistants",
  },
  {
    icon: BriefcaseBusiness,
    title: "Je veux automatiser la gestion de mon entreprise",
    description: "Facturation intelligente, stocks, comptabilité et suivi de trésorerie connectés.",
    product: "CoraBiz",
    href: "/produits/corabiz",
    action: "Découvrir CoraBiz",
    tag: "ERP & Automatisation",
  },
  {
    icon: GraduationCap,
    title: "Je veux former ou certifier mes talents",
    description: "Acquisition de compétences pratiques en IA, ingénierie de prompt et automatisation pour équipes et apprenants.",
    product: "KORYXA Formation",
    href: "/produits/formation",
    action: "Voir les Formations",
    tag: "Talents & Écoles",
  },
  {
    icon: Code2,
    title: "Je veux intégrer des modèles IA par API",
    description: "Endpoints d'inférence sécurisés, connecteurs de données et passerelle d'orchestration pour vos applications.",
    product: "KORYXA API",
    href: "/produits/api",
    action: "Consulter la documentation API",
    tag: "Système & Infrastructure",
  },
  {
    icon: Building2,
    title: "Je veux superviser un réseau d'utilisateurs ou une cohorte",
    description: "Espace institutionnel pour universités, incubateurs et ministères afin de piloter les accès à grande échelle.",
    product: "Portail Partenaire",
    href: "/produits/partner-portal",
    action: "Accéder au Portail",
    tag: "Institution & Réseau",
  },
  {
    icon: Rocket,
    title: "Je veux déployer un projet IA sur-mesure",
    description: "Accompagnement expert pour concevoir et intégrer un pipeline IA adapté aux spécificités de votre organisation.",
    product: "Services IA",
    href: "/produits/services-ia",
    action: "Découvrir les Services IA",
    tag: "Projets & Accompagnement",
  },
  {
    icon: KeyRound,
    title: "Je veux gérer mon identité et mes abonnements",
    description: "Un seul compte KORYXA pour sécuriser vos accès, vos espaces produits et vos quotas d'utilisation.",
    product: "Compte KORYXA",
    href: KORYXA_ACCOUNT_URL,
    action: "Ouvrir mon Compte",
    tag: "Identité & Sécurité",
    external: true,
  },
  {
    icon: Network,
    title: "Je veux devenir partenaire écosystème",
    description: "Collaborer avec KORYXA en tant qu'entreprise technologique, école, fonds d'investissement ou acteur régional.",
    product: "Partenaires",
    href: PUBLIC_ROUTES.partenaires,
    action: "Rejoindre le Réseau",
    tag: "Alliance Stratégique",
  },
];

export default function UseCasesPage() {
  return (
    <main className="kx-pie-page kx-usecases-page">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#06150c] via-[#081f13] to-[#040c07] pt-12 pb-20 text-white sm:pt-16 sm:pb-28">
        <div className="kx-pie-blob kx-pie-blob-one opacity-30" />
        <div className="kx-pie-blob kx-pie-blob-two opacity-20" />

        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4ade80]/40 bg-[#00a86b]/15 px-4 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#ecfff4]">
                Routeur Intelligent de Besoins
              </span>
            </div>

            <h1 className="mt-6 font-serif text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Trouvez la solution adaptée à votre situation.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#e2f5ea] leading-relaxed max-w-2xl mx-auto">
              L'écosystème KORYXA est conçu pour clarifier vos choix : explorez par profil d'utilisateur ou par intention précise.
            </p>
          </div>
        </div>
      </section>

      {/* 1. Interactive Persona Router */}
      <section className="py-16 sm:py-24 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#00a86b] dark:text-[#4ade80]">
              Étape 1 : Choisissez votre profil
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-bold">
              Une trajectoire guidée pour chaque acteur
            </h2>
          </div>

          <InteractivePersonaRouter />
        </div>
      </section>

      {/* 2. Intent-Based Specific Use Case Grid */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#050b08] text-slate-900 dark:text-white transition-colors">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#00a86b] dark:text-[#4ade80]">
              Étape 2 : Exploration par intention directe
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-bold">
              Que souhaitez-vous accomplir ?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Chaque cas d'usage vous relie directement à l'espace produit ou au compte correspondant.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((item, index) => {
              const Icon = item.icon;
              const isExternal = "external" in item && item.external;

              return (
                <article
                  key={item.title}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-[#234b33] bg-white dark:bg-[#07190f]/90 p-5 shadow-sm dark:shadow-md transition hover:-translate-y-1 hover:border-[#00a86b]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80] group-hover:bg-[#00a86b] group-hover:text-white transition">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-[#86efac]">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="mt-4 font-serif text-base font-bold group-hover:text-[#00a86b] dark:group-hover:text-[#86efac] transition">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-xs">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Solution Cible
                      </span>
                      <strong className="block text-slate-900 dark:text-white mt-0.5">
                        {item.product}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/10">
                    {isExternal ? (
                      <a
                        href={item.href}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#00a86b] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#008b58]"
                      >
                        {item.action}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#00a86b] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#008b58]"
                      >
                        {item.action}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
