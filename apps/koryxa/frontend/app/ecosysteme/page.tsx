import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CircuitBoard,
  Compass,
  DatabaseZap,
  Globe2,
  KeyRound,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles,
  Workflow,
  ExternalLink,
  CheckCircle2,
  Wallet,
  Globe,
  Radio,
  Bot,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
} from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";
import { productList } from "@/app/produits/data";
import EcosystemOrchestrationVisualizer from "@/components/marketing/EcosystemOrchestrationVisualizer";
import LiveEcosystemMetrics from "@/components/marketing/LiveEcosystemMetrics";

export const metadata: Metadata = {
  title: "Écosystème KORYXA | Architecture d'Orchestration IA en Afrique",
  description:
    "Découvrez l'architecture et les couches de l'écosystème KORYXA : identité unifiée, produits autonomes interconnectés, passerelles de données et gouvernance souveraine.",
};

const architectureLayers = [
  {
    icon: Globe2,
    badge: "Couche 01",
    title: "Gouvernance & Vitrine Unifiée",
    description: "Le point d'ancrage officiel qui structure l'orientation, certifie les briques logicielles et garantit la conformité des données.",
    items: ["Orientation intelligente", "Standards de sécurité", "Supervision publique", "Transparence"],
  },
  {
    icon: KeyRound,
    badge: "Couche 02",
    title: "Identité & Authentification SSO",
    description: "Le Compte KORYXA offre un passeport universel multi-tenant pour naviguer d'un produit à l'autre sans friction d'authentification.",
    items: ["Single Sign-On (SSO)", "Gestion des rôles", "Sécurité Clerk / mTLS", "Profil unifié"],
  },
  {
    icon: Layers3,
    badge: "Couche 03",
    title: "Suite de Produits Autonomes",
    description: "Chaque application dispose de sa propre logique métier tout en héritant des services transversaux de l'écosystème KORYXA.",
    items: ["MERQALOR (Finance)", "FlowCore (CRM)", "ChatLAYA (IA)", "CoraBiz (ERP)", "Formation"],
  },
  {
    icon: DatabaseZap,
    badge: "Couche 04",
    title: "Passerelles, Connecteurs & APIs",
    description: "Connecteurs haute disponibilité reliant les modèles d'inférence aux passerelles Mobile Money (Wave, OM, MTN), WhatsApp et ERP.",
    items: ["Passerelle gRPC / REST", "Webhooks n8n / Make", "APIs Télécoms & Banques", "Orchestrateur"],
  },
  {
    icon: Building2,
    badge: "Couche 05",
    title: "Réseau Institutionnel & Partenaires",
    description: "Espaces dédiés aux entreprises, universités et incubateurs pour piloter des déploiements régionaux et des cohortes apprenantes.",
    items: ["Portail Partenaires", "Campus & Cohortes", "Grands Comptes", "Institutions publiques"],
  },
];

const orchestrationFlow = [
  {
    step: "01",
    label: "Comprendre & Qualifier",
    description: "Analyser le besoin spécifique de l'utilisateur, de l'entreprise ou de l'institution pour déterminer la trajectoire adaptée.",
  },
  {
    step: "02",
    label: "Structurer l'Accès",
    description: "Attribuer les droits et les permissions adéquates via le Compte KORYXA sans dispersion des données.",
  },
  {
    step: "03",
    label: "Activer les Solutions",
    description: "Déployer la brique autonome requise : pilotage financier, prospection autopilot, modèle de dialogue ou formation.",
  },
  {
    step: "04",
    label: "Interconnecter les Flux",
    description: "Synchroniser les flux de trésorerie, les leads commerciaux ou les données analytiques via nos connecteurs sécurisés.",
  },
  {
    step: "05",
    label: "Mesurer & Scaler",
    description: "Suivre en temps réel la performance, la disponibilité et l'impact opérationnel sur le terrain.",
  },
];

const PRODUCT_ICONS: Record<string, typeof Bot> = {
  merqalor: Wallet,
  "service-ia": Globe,
  flowcore: Radio,
  chatlaya: Bot,
  corabiz: BriefcaseBusiness,
  formation: GraduationCap,
  neurokap: CircuitBoard,
  "partner-portal": Building2,
  api: Code2,
  cora: Sparkles,
  "services-ia": Globe,
};

export default function EcosystemePage() {
  return (
    <div className="kx-pie-page kx-ecosystem-page">
      {/* 1. Hero Section — Centered & Modern */}
      <section className="kx-ecosystem-hero relative overflow-hidden text-center py-16 sm:py-24">
        <div className="kx-pie-blob kx-pie-blob-one" />
        <div className="kx-pie-blob kx-pie-blob-two" />

        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center">
          <div className="kx-pie-badge inline-flex items-center justify-center gap-2 mb-6">
            <span className="kx-pie-dot" />
            <span>Architecture & Orchestration</span>
          </div>

          <h1 className="max-w-4xl mx-auto font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Une architecture unifiée. Des technologies autonomes.
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-[#e2f5ea] leading-relaxed">
            KORYXA n'est pas un agrégat désordonné d'outils. C'est la plateforme d'orchestration qui relie vos applications métier, votre identité et vos flux de données sous un standard d'excellence souverain.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <Link
              href={PUBLIC_ROUTES.produits}
              className="kx-pie-btn kx-pie-btn-gold w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-bold"
            >
              Découvrir la suite de produits
              <ArrowRight size={18} />
            </Link>
            <a
              href={KORYXA_ACCOUNT_URL}
              className="kx-pie-btn kx-pie-btn-outline-white w-full sm:w-auto inline-flex items-center justify-center text-sm font-bold"
            >
              Accéder au Compte KORYXA
            </a>
          </div>

          {/* Interactive Visualizer integrated right into the Hero */}
          <div className="mt-14 sm:mt-16 w-full text-left">
            <EcosystemOrchestrationVisualizer />
          </div>
        </div>
      </section>

      {/* 2. Continuous Marquee Ticker */}
      <section className="kx-pie-marquee-section" aria-label="Produits de l'écosystème KORYXA">
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
                  <span className="font-bold text-slate-900 dark:text-white">{product.name}</span>
                  <span className="rounded-full bg-[#00a86b]/10 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-[#008b58] dark:text-[#86efac]">
                    {product.badge || "Actif"}
                  </span>
                </div>
                <small className="truncate text-slate-600 dark:text-[#86efac]">{product.tagline}</small>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The 5 Architectural Layers */}
      <section className="py-20 sm:py-28 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors duration-200">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
              Structure de la Plateforme
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-serif tracking-tight">
              Les 5 couches fondamentales de KORYXA
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Chaque couche assure une fonction précise : gouverner, sécuriser les identités, exécuter les applications, interconnecter les systèmes et animer le réseau.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {architectureLayers.map((layer) => {
              const Icon = layer.icon;
              return (
                <article
                  key={layer.title}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-white/95 dark:bg-[#07190f]/90 p-7 shadow-sm transition hover:-translate-y-1.5 hover:border-[#00a86b] hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-xs font-bold text-[#008b58] dark:text-[#86efac]">
                        {layer.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 font-serif text-xl font-bold">{layer.title}</h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {layer.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {layer.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Orchestration Flow */}
      <section className="py-20 sm:py-28 bg-white dark:bg-[#050b08] text-slate-900 dark:text-white transition-colors duration-200">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] items-center">
            <div>
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
                Fluidité Opérationnelle
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-serif tracking-tight">
                Comment KORYXA orchestre vos flux sans friction.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                De l'évaluation initiale du besoin jusqu'à l'exécution automatisée, KORYXA élimine la complexité technique pour offrir une expérience fluide aux décideurs, équipes et développeurs.
              </p>

              <div className="mt-8">
                <LiveEcosystemMetrics />
              </div>
            </div>

            <div className="space-y-4">
              {orchestrationFlow.map((step) => (
                <div
                  key={step.step}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200/90 dark:border-[#234b33] bg-[#faf9f5] dark:bg-[#07190f]/80 p-5 transition hover:border-[#00a86b]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00a86b] font-mono text-sm font-bold text-white shadow-sm">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">
                      {step.label}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Autonomous Products Overview */}
      <section className="py-20 sm:py-28 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors duration-200">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
              Applications en Production
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-serif tracking-tight">
              Des produits spécialisés, un standard d'ingénierie partagé.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Chaque produit conserve son autonomie fonctionnelle tout en bénéficiant de l'identité unifiée et des passerelles KORYXA.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productList.map((product) => {
              const Icon = PRODUCT_ICONS[product.slug] || Sparkles;
              return (
                <article
                  key={product.slug}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-white/95 dark:bg-[#07190f]/90 p-6 shadow-sm transition hover:-translate-y-1.5 hover:border-[#00a86b] hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-[#00a86b]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#008b58] dark:text-[#86efac]">
                        {product.status}
                      </span>
                    </div>

                    <h3 className="mt-4 font-serif text-xl font-bold">{product.name}</h3>
                    <p className="mt-1 text-xs font-bold text-[#008b58] dark:text-[#86efac]">
                      {product.tagline}
                    </p>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {product.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <Link
                      href={`/produits/${product.slug}`}
                      className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#00a86b]"
                    >
                      Fiche complète →
                    </Link>
                    <a
                      href={product.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#00a86b] dark:text-[#4ade80] hover:underline"
                    >
                      Accéder au produit
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Account Gateway Banner */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#050b08] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 transition-colors">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#dfe5d8] dark:border-[#234b33] bg-gradient-to-r from-[#f7fbf8] to-[#edf6f0] dark:from-[#07190f] dark:to-[#040f09] p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 text-center sm:text-left">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#008b58] dark:text-[#86efac] mx-auto sm:mx-0">
                <ShieldCheck className="h-4 w-4" />
                <span>Identité Unique Souveraine</span>
              </div>
              <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Un seul compte pour ouvrir toute la suite KORYXA.
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Connectez-vous une seule fois pour piloter votre trésorerie sur MERQALOR, lancer vos campagnes d'autopilot sur FlowCore, échanger avec ChatLAYA ou gérer vos équipes sur CoraBiz.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto">
              <a
                href={KORYXA_ACCOUNT_URL}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-6 py-4 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-[#008b58]"
              >
                Créer mon compte KORYXA
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href={PUBLIC_ROUTES.casUsage}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 px-6 py-4 text-xs sm:text-sm font-bold text-slate-800 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/15"
              >
                Voir les cas d'usage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
