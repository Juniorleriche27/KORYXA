import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  DatabaseZap,
  Globe2,
  KeyRound,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";
import EcosystemOrchestrationVisualizer from "@/components/marketing/EcosystemOrchestrationVisualizer";
import InteractivePersonaRouter from "@/components/marketing/InteractivePersonaRouter";
import InteractiveProductGrid from "@/components/marketing/InteractiveProductGrid";
import LiveEcosystemMetrics from "@/components/marketing/LiveEcosystemMetrics";

export const metadata: Metadata = {
  title: "KORYXA | Première Plateforme d'Orchestration IA en Afrique",
  description:
    "KORYXA unifie et orchestre l'écosystème d'intelligence artificielle en Afrique : un compte unique, des produits autonomes (ChatLAYA, NeuroKap, CoraBiz) et une infrastructure souveraine.",
  keywords: [
    "KORYXA",
    "orchestration IA Afrique",
    "plateforme IA Afrique",
    "ChatLAYA",
    "NeuroKap",
    "CoraBiz",
    "compte KORYXA",
    "écosystème IA africain",
    "infrastructure IA souveraine",
  ],
  openGraph: {
    title: "KORYXA | Première Plateforme d'Orchestration IA en Afrique",
    description:
      "L’infrastructure souveraine qui relie produits IA autonomes, talents, entreprises et décideurs avec un compte unique.",
    url: "/",
    type: "website",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KORYXA",
  url: "https://koryxa.com",
  description: "La première plateforme d'orchestration IA en Afrique.",
  areaServed: "Africa",
  knowsAbout: [
    "Intelligence artificielle",
    "Orchestration de systèmes",
    "Produits autonomes",
    "Identité numérique souveraine",
    "Écosystème technologique africain",
  ],
};

const pillars = [
  {
    icon: Workflow,
    title: "Orchestrer",
    description:
      "KORYXA structure la complexité technologique en reliant chaque besoin au système ou produit adapté sans dispersion.",
  },
  {
    icon: KeyRound,
    title: "Accéder",
    description:
      "Un seul compte KORYXA sécurisé sert de passeport universel vers l'ensemble des univers, outils et espaces autorisés.",
  },
  {
    icon: Network,
    title: "Connecter",
    description:
      "Chaque produit conserve son autonomie et sa roadmap, tout en partageant la même identité, sécurité et architecture.",
  },
  {
    icon: Zap,
    title: "Déployer",
    description:
      "Transformez les talents, entreprises et institutions en organisations augmentées par une IA utile et ancrée dans le réel.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <main className="kx-pie-page">
        {/* 1. HERO SECTION WITH INTERACTIVE ARCHITECTURE VISUALIZER */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#06150c] via-[#081f13] to-[#040c07] pt-8 pb-16 text-white sm:pt-12 sm:pb-24">
          <div className="kx-pie-blob kx-pie-blob-one opacity-30" />
          <div className="kx-pie-blob kx-pie-blob-two opacity-20" />

          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            {/* Hero Top Copy */}
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#4ade80]/40 bg-[#00a86b]/15 px-4 py-1.5 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#ecfff4]">
                  Infrastructure & Hub IA Souverain
                </span>
              </div>

              <h1 className="mt-6 font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                L'orchestration IA pensée pour les réalités africaines.
              </h1>

              <p className="mt-5 text-base sm:text-lg text-[#e2f5ea] leading-relaxed max-w-2xl mx-auto">
                KORYXA relie vos produits autonomes (<strong>ChatLAYA</strong>, <strong>NeuroKap</strong>, <strong>CoraBiz</strong>), vos équipes et vos partenaires sous une identité unique et une gouvernance claire.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                <Link
                  href={PUBLIC_ROUTES.ecosysteme}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(0,168,107,0.35)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
                >
                  Explorer l’écosystème
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={KORYXA_ACCOUNT_URL}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Ouvrir mon Compte KORYXA
                </a>
              </div>
            </div>

            {/* Interactive Architecture Hub Visualizer */}
            <div className="mt-14 sm:mt-16">
              <EcosystemOrchestrationVisualizer />
            </div>

            {/* Live Metrics Bar */}
            <div className="mt-12 sm:mt-16">
              <LiveEcosystemMetrics />
            </div>
          </div>
        </section>

        {/* 2. SECTION ROUTEUR DE CAS D'USAGE GUIDÉ */}
        <section className="py-20 sm:py-28 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#00a86b] dark:text-[#4ade80]">
                Orientation Personnalisée
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-serif tracking-tight">
                Quel est votre objectif aujourd'hui ?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Sélectionnez votre profil pour découvrir la trajectoire produit KORYXA adaptée à vos besoins.
              </p>
            </div>

            <InteractivePersonaRouter />
          </div>
        </section>

        {/* 3. SECTION CATALOGUE PRODUITS INTERACTIF */}
        <section className="py-20 sm:py-28 bg-white dark:bg-[#050b08] text-slate-900 dark:text-white transition-colors">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#00a86b] dark:text-[#4ade80]">
                Catalogue de la Suite
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-serif tracking-tight">
                Des produits autonomes, une cohérence totale.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Chaque produit répond à un usage précis : conversation, analyse de marché, ERP, formation ou intégration API.
              </p>
            </div>

            <InteractiveProductGrid />
          </div>
        </section>

        {/* 4. SECTION POURQUOI KORYXA & PILIERS */}
        <section className="py-20 sm:py-28 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#00a86b] dark:text-[#4ade80]">
                Fondations Technologiques
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-serif tracking-tight">
                Pourquoi KORYXA est la plateforme mère.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                L’intelligence artificielle ne doit pas être une addition désordonnée d'outils. KORYXA apporte un cadre structuré et souverain.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-[#234b33] bg-white dark:bg-[#07190f]/90 p-6 shadow-sm dark:shadow-md transition hover:-translate-y-1 hover:border-[#00a86b]"
                  >
                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 font-serif text-xl font-bold">{item.title}</h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. CTA SECTION PREMIUM */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#081f13] to-[#040c07] py-20 sm:py-28 text-center text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,168,107,0.25),transparent_70%)]" />

          <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#86efac]">
              Rejoindre l’Écosystème
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Prenez part à la transformation IA en Afrique.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[#e2f5ea] leading-relaxed">
              Créez votre compte unique KORYXA pour accéder instantanément à tous les produits ou contactez notre équipe pour déployer une solution dédiée.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <a
                href={KORYXA_ACCOUNT_URL}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(0,168,107,0.35)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
              >
                Créer mon Compte KORYXA
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href={PUBLIC_ROUTES.contact}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
              >
                Contacter KORYXA
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
