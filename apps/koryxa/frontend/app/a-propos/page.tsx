import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Eye,
  Globe2,
  HeartHandshake,
  Layers3,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "À propos de KORYXA | Vision, Mission et Souveraineté IA en Afrique",
  description:
    "Découvrez l'histoire, la vision et l'engagement de KORYXA : bâtir une infrastructure d'intelligence artificielle souveraine ancrée dans les réalités africaines.",
};

const coreValues = [
  {
    icon: Globe2,
    title: "Ancrage & Réalités Africaines",
    description: "Nos solutions sont conçues pour et par le continent : intégration native des moyens de paiement Mobile Money, gestion multicanale WhatsApp et prise en compte des contextes linguistiques et économiques locaux.",
  },
  {
    icon: ShieldCheck,
    title: "Souveraineté & Sécurité des Données",
    description: "Nous assurons une gouvernance stricte sur la confidentialité des flux de données avec des protocoles mTLS, une gestion multi-tenant étanche et un contrôle total sur nos modèles d'inférence.",
  },
  {
    icon: Layers3,
    title: "Autonomie & Cohérence Systémique",
    description: "Chaque produit de la suite (MERQALOR, FlowCore, ChatLAYA, CoraBiz) résout un problème précis de manière autonome, tout en partageant une identité unique et une interopérabilité instantanée.",
  },
  {
    icon: Target,
    title: "Utilité & Impact Mesurable",
    description: "Nous rejetons les démonstrateurs sans lendemain : l'intelligence artificielle n'a de valeur que si elle automatise des tâches réelles, génère du chiffre d'affaires et autonomise les talents.",
  },
];

export default function AProposPage() {
  return (
    <main className="kx-pie-page kx-about-page">
      {/* 1. Hero Section — Centered & Authoritative */}
      <section className="kx-about-hero relative overflow-hidden text-center py-16 sm:py-24">
        <div className="kx-pie-blob kx-pie-blob-one" />
        <div className="kx-pie-blob kx-pie-blob-two" />

        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center">
          <div className="kx-pie-badge inline-flex items-center justify-center gap-2 mb-6">
            <span className="kx-pie-dot" />
            <span>Vision & Mission Fondatrice</span>
          </div>

          <h1 className="max-w-4xl mx-auto font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            L'intelligence artificielle souveraine, utile et ancrée en Afrique.
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-[#e2f5ea] leading-relaxed">
            KORYXA est née d'une conviction fondamentale : l'Afrique ne doit pas être une simple consommatrice de modèles importés, mais le terrain d'avant-garde d'une infrastructure IA orchestrée pour transformer l'économie réelle.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <Link
              href={PUBLIC_ROUTES.ecosysteme}
              className="kx-pie-btn kx-pie-btn-gold w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-bold"
            >
              Comprendre l'écosystème
              <ArrowRight size={18} />
            </Link>
            <Link
              href={PUBLIC_ROUTES.produits}
              className="kx-pie-btn kx-pie-btn-outline-white w-full sm:w-auto inline-flex items-center justify-center text-sm font-bold"
            >
              Explorer les produits
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Vision & Mission Split Cards */}
      <section className="py-20 sm:py-28 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors duration-200">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <article className="flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-white/95 dark:bg-[#07190f]/90 p-8 sm:p-10 shadow-md">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80] mb-6">
                  <Eye className="h-7 w-7" />
                </div>
                <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
                  Notre Vision
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold font-serif tracking-tight">
                  Devenir la référence continentale de l'orchestration technologique.
                </h2>
                <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Permettre à chaque entrepreneur, PME, institution et développeur africain de disposer d'une suite complète d'outils intelligents interconnectés, réduisant les barrières de coût et de complexité pour libérer le potentiel humain.
                </p>
              </div>
            </article>

            <article className="flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-white/95 dark:bg-[#07190f]/90 p-8 sm:p-10 shadow-md">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80] mb-6">
                  <Target className="h-7 w-7" />
                </div>
                <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
                  Notre Mission
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold font-serif tracking-tight">
                  Orchestrer l'IA pour résoudre les défis économiques immédiats.
                </h2>
                <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Structurer les flux financiers quotidiens avec MERQALOR, automatiser la prospection multicanale avec FlowCore, outiller la réflexion stratégique avec ChatLAYA et former des milliers de talents avec KORYXA Formation.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 3. Core Values Section */}
      <section className="py-20 sm:py-28 bg-white dark:bg-[#050b08] text-slate-900 dark:text-white transition-colors duration-200">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
              Piliers Déontologiques
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-serif tracking-tight">
              Ce qui guide chaque ligne de code chez KORYXA
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Une éthique d'ingénierie rigoureuse pour garantir la pérennité et la souveraineté de nos systèmes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {coreValues.map((val) => {
              const Icon = val.icon;
              return (
                <article
                  key={val.title}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-[#faf9f5] dark:bg-[#07190f]/90 p-7 sm:p-8 shadow-sm transition hover:border-[#00a86b]"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80] mb-5">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                      {val.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA Section */}
      <section className="py-16 sm:py-20 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 transition-colors">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-[#dfe5d8] dark:border-[#234b33] bg-gradient-to-r from-[#f7fbf8] to-[#edf6f0] dark:from-[#07190f] dark:to-[#040f09] p-8 sm:p-12 shadow-xl">
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Rejoignez le mouvement KORYXA
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Créez votre compte unique ou prenez contact avec nos équipes pour participer à la transformation de l'écosystème.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <a
                href={KORYXA_ACCOUNT_URL}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#008b58]"
              >
                Créer mon compte KORYXA
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href={PUBLIC_ROUTES.contact}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-white transition hover:bg-slate-50 dark:hover:bg-white/10"
              >
                Contacter l'équipe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
