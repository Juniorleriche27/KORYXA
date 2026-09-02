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
import { productList } from "@/app/produits/data";
import EcosystemOrchestrationVisualizer from "@/components/marketing/EcosystemOrchestrationVisualizer";
import InteractivePersonaRouter from "@/components/marketing/InteractivePersonaRouter";
import InteractiveProductGrid from "@/components/marketing/InteractiveProductGrid";
import LiveEcosystemMetrics from "@/components/marketing/LiveEcosystemMetrics";

export const metadata: Metadata = {
  title: "KORYXA | La première plateforme d'orchestration IA en Afrique",
  description:
    "KORYXA est la première plateforme d'orchestration IA en Afrique. Un compte unique et un écosystème de produits autonomes connectés : MERQALOR, FlowCore, ChatLAYA, CoraBiz, KORYXA Formation et APIs.",
  keywords: [
    "KORYXA",
    "première plateforme d'orchestration IA en Afrique",
    "orchestration IA Afrique",
    "plateforme IA Afrique",
    "MERQALOR",
    "FlowCore",
    "ChatLAYA",
    "CoraBiz",
    "compte KORYXA",
    "écosystème IA africain",
    "infrastructure IA souveraine",
  ],
  openGraph: {
    title: "KORYXA | La première plateforme d'orchestration IA en Afrique",
    description:
      "La première plateforme d'orchestration IA en Afrique reliant produits autonomes, entreprises, créateurs et institutions sous une identité unique.",
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
    "Orchestration de systèmes IA",
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
      "KORYXA structure la complexité technologique en reliant chaque besoin au bon produit sans dispersion ni silos.",
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
      "Chaque produit conserve son autonomie et sa roadmap, tout en partageant la même identité, sécurité et passerelle.",
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
        {/* 1. HERO SECTION: REMOVED SMALL BADGE, REDUCED TOP PADDING, CLEAN LIGHT/DARK HERO */}
        <section className="kx-pie-hero relative overflow-hidden text-center pt-8 pb-16 sm:pt-12 sm:pb-24 transition-colors duration-200">
          <div className="kx-pie-blob kx-pie-blob-one" />
          <div className="kx-pie-blob kx-pie-blob-two" />

          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center">
            {/* Main Headline */}
            <h1 className="max-w-4xl mx-auto font-serif text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 dark:text-white leading-[1.06] tracking-tight">
              KORYXA
              <br />
              <em className="text-[#00a86b] dark:text-[#4ade80] not-italic">
                la première plateforme d'orchestration IA en Afrique.
              </em>
            </h1>

            {/* Paragraph lead */}
            <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-[#cbd5e1] leading-relaxed">
              KORYXA connecte et orchestre les produits autonomes de sa suite (<strong>MERQALOR</strong>, <strong>FlowCore</strong>, <strong>ChatLAYA</strong>, <strong>CoraBiz</strong>, <strong>Formation</strong>) sous un compte unique et une gouvernance claire.
            </p>

            {/* Centered Action CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
              <Link
                href={PUBLIC_ROUTES.produits}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,168,107,0.3)] transition hover:bg-[#008b58] hover:-translate-y-0.5 w-full sm:w-auto"
              >
                Explorer nos produits ({productList.length})
                <ArrowRight size={18} />
              </Link>
              <a
                href={KORYXA_ACCOUNT_URL}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 w-full sm:w-auto"
              >
                Accéder au Compte KORYXA
              </a>
            </div>

            {/* Live Interactive Architecture Visualizer */}
            <div className="mt-12 sm:mt-16 w-full text-left">
              <EcosystemOrchestrationVisualizer />
            </div>

            {/* Live Metrics Bar */}
            <div className="mt-10 sm:mt-14 w-full">
              <LiveEcosystemMetrics />
            </div>
          </div>
        </section>

        {/* 2. CONTINUOUS ANIMATED MARQUEE OF ALL PRODUCTS */}
        <section className="kx-pie-marquee-section" aria-label="Suite de produits KORYXA">
          <div className="kx-pie-marquee-track">
            <div className="kx-pie-marquee-inner">
              {[...productList, ...productList].map((product, index) => (
                <a
                  href={product.href}
                  target="_blank"
                  rel="noreferrer"
                  className="kx-pie-mini-card transition hover:border-[#00a86b] hover:scale-105"
                  key={`${product.slug}-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{product.name}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[#86efac]">
                      {product.badge || "Actif"}
                    </span>
                  </div>
                  <small className="truncate">{product.tagline}</small>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 3. SECTION ROUTEUR DE CAS D'USAGE GUIDÉ */}
        <section className="py-20 sm:py-28 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors duration-200">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 text-center sm:text-left">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
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

        {/* 4. SECTION CATALOGUE PRODUITS INTERACTIF */}
        <section className="py-20 sm:py-28 bg-white dark:bg-[#050b08] text-slate-900 dark:text-white transition-colors duration-200">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
                Catalogue Officiel de la Suite
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-serif tracking-tight">
                Des produits autonomes, une cohérence totale.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Chaque brique répond à un besoin concret : finance intelligente, prospection autopilot, conversation IA, ERP ou formation.
              </p>
            </div>

            <InteractiveProductGrid />
          </div>
        </section>

        {/* 5. SECTION POURQUOI KORYXA & PILIERS */}
        <section className="py-20 sm:py-28 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors duration-200">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
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
                    className="flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-white/95 dark:bg-[#07190f]/90 p-6 sm:p-7 shadow-sm transition hover:-translate-y-1.5 hover:border-[#00a86b] hover:shadow-lg text-center sm:text-left"
                  >
                    <div>
                      <div className="mx-auto sm:mx-0 flex h-13 w-13 items-center justify-center rounded-2xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80]">
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

        {/* 6. CTA SECTION PREMIUM */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#081f13] to-[#040c07] py-20 sm:py-28 text-center text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,168,107,0.3),transparent_70%)]" />

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

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
              <a
                href={KORYXA_ACCOUNT_URL}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-7 py-4 text-sm font-bold text-white shadow-[0_10px_28px_rgba(0,168,107,0.35)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
              >
                Créer mon Compte KORYXA
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href={PUBLIC_ROUTES.contact}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/15"
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
