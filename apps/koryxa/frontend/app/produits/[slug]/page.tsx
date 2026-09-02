import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CircuitBoard,
  Code2,
  ExternalLink,
  Globe,
  GraduationCap,
  Radio,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { productCatalog, removedProductSlugs, resolveProductSlug } from "@/app/produits/data";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

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

export async function generateMetadata(props: ProductPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const product = productCatalog[resolveProductSlug(slug)];
  return {
    title: `${product?.name ?? slug} | Écosystème KORYXA`,
    description: product?.summary ?? "Produit d'intelligence artificielle KORYXA",
  };
}

export default async function ProductDetailPage(props: ProductPageProps) {
  const { slug } = await props.params;
  if (removedProductSlugs.has(slug)) {
    redirect(PUBLIC_ROUTES.produits);
  }
  const product = productCatalog[resolveProductSlug(slug)];

  if (!product) {
    notFound();
  }

  const IconComponent = PRODUCT_ICONS[product.slug] || Sparkles;
  const isExternalPrimary = product.primaryCta.href.startsWith("http");

  return (
    <main className="kx-pie-page min-h-screen">
      {/* 1. Product Detail Hero — Centered & Immersive */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#07190f] to-[#040f09] text-white py-16 sm:py-24">
        <div className="kx-pie-blob kx-pie-blob-one opacity-30" />
        <div className="kx-pie-blob kx-pie-blob-two opacity-20" />

        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb navigation */}
          <nav className="mb-8 flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-[#86efac]" aria-label="Fil d'Ariane">
            <Link href={PUBLIC_ROUTES.home} className="hover:underline text-slate-300">
              Accueil
            </Link>
            <span>/</span>
            <Link href={PUBLIC_ROUTES.produits} className="hover:underline text-slate-300">
              Produits
            </Link>
            <span>/</span>
            <span className="text-white font-bold">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] items-center">
            {/* Left Hero Column */}
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00a86b]/40 bg-[#00a86b]/20 px-3.5 py-1 text-xs font-bold text-[#86efac] mb-5">
                <IconComponent className="h-3.5 w-3.5" />
                <span>{product.badge || product.status}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="mt-3 text-lg sm:text-xl font-bold text-[#86efac]">
                « {product.tagline} »
              </p>

              <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {product.summary}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5">
                {isExternalPrimary ? (
                  <a
                    href={product.primaryCta.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,168,107,0.35)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
                  >
                    <span>{product.primaryCta.label}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={product.primaryCta.href}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,168,107,0.35)] transition hover:bg-[#008b58] hover:-translate-y-0.5"
                  >
                    <span>{product.primaryCta.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}

                <a
                  href={KORYXA_ACCOUNT_URL}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Accéder via Compte KORYXA
                </a>
              </div>
            </div>

            {/* Right Card: Quick Identity Sheet */}
            <div className="rounded-3xl border border-[#234b33] bg-[#07190f]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-4 border-b border-white/10 pb-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#00a86b]/20 text-[#4ade80] border border-[#00a86b]/40">
                  <IconComponent className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">{product.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{product.audience}</p>
                </div>
              </div>

              {/* Stats matrix */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {product.stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <span className="block font-serif text-lg sm:text-xl font-bold text-[#86efac]">
                      {stat.value}
                    </span>
                    <span className="block text-[10px] font-semibold text-slate-400 mt-0.5 truncate">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Security info */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-[#4ade80] shrink-0" />
                  <span>Authentification sécurisée par <strong>Compte KORYXA</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Zap className="h-4 w-4 text-[#eab308] shrink-0" />
                  <span>Haute disponibilité et souveraineté des données</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Capabilities & Use Cases Section */}
      <section className="py-20 sm:py-28 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors duration-200">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {/* Features list */}
            <div>
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
                Capacités & Fonctionnalités
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-serif tracking-tight">
                Ce que {product.name} apporte à vos opérations.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Une solution prête à l'emploi, pensée pour s'intégrer directement dans vos habitudes professionnelles et financières.
              </p>

              <div className="mt-8 space-y-4">
                {product.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 dark:border-[#234b33] bg-white/95 dark:bg-[#07190f]/90 p-4 shadow-sm"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#00a86b] dark:text-[#4ade80] shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Use cases card */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-white/95 dark:bg-[#07190f]/90 p-8 shadow-md">
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
                Cas d'usage concrets
              </span>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold font-serif tracking-tight text-slate-900 dark:text-white">
                Scénarios d'activation
              </h3>

              <div className="mt-6 space-y-4">
                {product.useCases.map((useCase, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4"
                  >
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#008b58] dark:text-[#86efac]">
                      Scénario #{index + 1}
                    </span>
                    <p className="mt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {useCase}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Public concerné : <strong className="text-slate-800 dark:text-slate-200">{product.audience}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bottom CTA Banner */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#050b08] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 transition-colors">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-[#dfe5d8] dark:border-[#234b33] bg-gradient-to-r from-[#f7fbf8] to-[#edf6f0] dark:from-[#07190f] dark:to-[#040f09] p-8 sm:p-12 shadow-xl">
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Prêt à utiliser {product.name} ?
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Accédez directement à l'application ou connectez votre compte KORYXA pour synchroniser vos accès.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {isExternalPrimary ? (
                <a
                  href={product.primaryCta.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#008b58]"
                >
                  Lancer {product.name}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={product.primaryCta.href}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#008b58]"
                >
                  Lancer {product.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                href={PUBLIC_ROUTES.produits}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-white transition hover:bg-slate-50 dark:hover:bg-white/10"
              >
                Retour au catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
