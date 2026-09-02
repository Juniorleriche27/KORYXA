import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Handshake,
  Landmark,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Wrench,
  Zap,
} from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Partenaires KORYXA | Construire l’Infrastructure IA en Afrique",
  description:
    "Rejoignez le réseau de partenaires KORYXA : entreprises, universités, incubateurs, institutions publiques et partenaires technologiques.",
};

const partnerTiers = [
  {
    icon: Building2,
    badge: "B2B & Industrie",
    title: "Grands Comptes & Entreprises",
    description: "Intégrez des agents IA sur-mesure, automatisez vos processus CRM et connectez vos systèmes ERP à une gouvernance souveraine.",
    benefits: [
      "Déploiement dédié et mTLS",
      "SLA garanti 99.98%",
      "Formations des équipes incluses",
    ],
  },
  {
    icon: GraduationCap,
    badge: "Éducation & Recherche",
    title: "Universités & Grandes Écoles",
    description: "Formez la prochaine génération d'ingénieurs et de managers grâce à nos parcours certifiants en Data, IA et prompt engineering.",
    benefits: [
      "Accès aux laboratoires d'expérimentation",
      "Certifications vérifiables sur blockchain",
      "Mentorat d'experts praticiens",
    ],
  },
  {
    icon: Rocket,
    badge: "Innovation & Croissance",
    title: "Incubateurs, Hubs & Fonds",
    description: "Faites bénéficier vos startups incubées de crédits d'inférence, d'APIs souveraines et de passerelles de prospection multicanales.",
    benefits: [
      "Pack d'amorçage technologique",
      "Accès prioritaire aux APIs",
      "Accompagnement go-to-market",
    ],
  },
  {
    icon: Wrench,
    badge: "Infrastructure & Télécoms",
    title: "Partenaires Technologiques & Telcos",
    description: "Interconnectez vos passerelles de paiement (Mobile Money), réseaux télécoms ou datacenters à l'écosystème d'orchestration KORYXA.",
    benefits: [
      "Connecteurs natifs Wave / OM / MTN",
      "Interopérabilité gRPC et Webhooks",
      "Hébergement souverain régional",
    ],
  },
];

const onboardingSteps = [
  {
    step: "01",
    title: "Prise de Contact & Qualification",
    description: "Présentez vos objectifs stratégiques et le périmètre de votre organisation.",
  },
  {
    step: "02",
    title: "Cadrage Technique & Métier",
    description: "Définition des accès, des quotas d'API, des modules de formation ou des intégrations requises.",
  },
  {
    step: "03",
    title: "Activation sur le Portail Partenaire",
    description: "Ouverture de votre espace officiel de supervision multi-tenant sur partenaires.koryxa.fr.",
  },
  {
    step: "04",
    title: "Déploiement & Suivi Continu",
    description: "Lancement des opérations avec un support dédié et des revues de performance périodiques.",
  },
];

export default function PartenairesPage() {
  return (
    <div className="kx-pie-page kx-partners-page">
      {/* 1. Hero Section — Centered & Prestigious */}
      <section className="kx-partners-hero relative overflow-hidden text-center py-16 sm:py-24">
        <div className="kx-pie-blob kx-pie-blob-one" />
        <div className="kx-pie-blob kx-pie-blob-two" />

        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center">
          <div className="kx-pie-badge inline-flex items-center justify-center gap-2 mb-6">
            <span className="kx-pie-dot" />
            <span>Réseau & Alliances Stratégiques</span>
          </div>

          <h1 className="max-w-4xl mx-auto font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white leading-tight tracking-tight">
            Bâtir l'infrastructure IA africaine avec KORYXA.
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-[#cbd5e1] leading-relaxed">
            KORYXA fédère les leaders économiques, les institutions académiques et les pionniers technologiques autour d'un socle d'excellence et d'une vision d'impact partagée.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <a
              href="https://partenaires.koryxa.fr"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,168,107,0.3)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
            >
              Accéder au Portail Partenaire
              <ExternalLink size={16} />
            </a>
            <Link
              href={PUBLIC_ROUTES.contact}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Proposer un partenariat
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Partner Tiers Section */}
      <section className="py-20 sm:py-28 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors duration-200">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
              Programmes d'Alliance
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-serif tracking-tight">
              Un cadre d'engagement adapté à votre structure
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Que vous soyez une entreprise, une université ou un acteur de l'écosystème tech, KORYXA propose des modalités de collaboration concrètes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partnerTiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <article
                  key={tier.title}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-white/95 dark:bg-[#07190f]/90 p-6 sm:p-7 shadow-sm transition hover:-translate-y-1.5 hover:border-[#00a86b] hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-[#86efac]">
                        {tier.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 font-serif text-lg font-bold">{tier.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {tier.description}
                    </p>

                    <div className="mt-5 space-y-2 border-t border-slate-100 dark:border-white/10 pt-4">
                      {tier.benefits.map((b) => (
                        <div key={b} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#00a86b] dark:text-[#4ade80] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Onboarding Process Section */}
      <section className="py-20 sm:py-28 bg-white dark:bg-[#050b08] text-slate-900 dark:text-white transition-colors duration-200">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
              Méthode d'Intégration
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-serif tracking-tight">
              Comment rejoindre l'écosystème en 4 étapes
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Un processus transparent et réactif pour transformer l'intention en déploiement opérationnel.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {onboardingSteps.map((step) => (
              <div
                key={step.step}
                className="relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-[#faf9f5] dark:bg-[#07190f]/80 p-6 shadow-sm"
              >
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00a86b] font-mono text-sm font-bold text-white shadow-sm mb-4">
                    {step.step}
                  </span>
                  <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA Section */}
      <section className="py-16 sm:py-20 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 transition-colors">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-[#dfe5d8] dark:border-[#234b33] bg-gradient-to-r from-[#f7fbf8] to-[#edf6f0] dark:from-[#07190f] dark:to-[#040f09] p-8 sm:p-12 shadow-xl">
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Prêt à accélérer vos projets avec KORYXA ?
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Échangez directement avec notre équipe partenariats pour convenir d'une démonstration ou d'un cadrage technique.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href={PUBLIC_ROUTES.contact}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#008b58]"
              >
                Prendre contact
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://partenaires.koryxa.fr"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-white transition hover:bg-slate-50 dark:hover:bg-white/10"
              >
                Portail Partenaire officiel
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
