import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, DatabaseZap, Globe2, KeyRound, Layers3, Network, ShieldCheck, Sparkles, Workflow, Zap } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";
import { productList } from "@/app/produits/data";

export const metadata: Metadata = {
  title: "KORYXA | La première plateforme d'orchestration IA en Afrique",
  description:
    "KORYXA est la première plateforme d'orchestration IA en Afrique. Une vitrine centrale, un compte unique et un écosystème de produits autonomes connectés.",
  keywords: [
    "KORYXA",
    "orchestration IA Afrique",
    "plateforme IA Afrique",
    "produits IA autonomes",
    "compte KORYXA",
    "écosystème IA africain",
  ],
  openGraph: {
    title: "KORYXA | La première plateforme d'orchestration IA en Afrique",
    description:
      "Un écosystème IA africain connecté par une vitrine centrale, un compte unique et des produits autonomes.",
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
  knowsAbout: ["Intelligence artificielle", "Orchestration", "Produits autonomes", "Écosystème numérique"],
};

const heroStats = [
  { value: "8", label: "produits autonomes" },
  { value: "1", label: "compte KORYXA" },
  { value: "4", label: "couches d’orchestration" },
  { value: "100%", label: "vision Afrique" },
];

const pillars = [
  {
    icon: Workflow,
    title: "Orchestrer",
    description: "KORYXA donne une lecture claire de l’écosystème et relie chaque besoin au bon produit.",
  },
  {
    icon: KeyRound,
    title: "Accéder",
    description: "Un seul compte KORYXA sert de porte d’entrée aux espaces, produits et services autorisés.",
  },
  {
    icon: Network,
    title: "Connecter",
    description: "Les produits restent autonomes, mais avancent sous une même identité et une même architecture.",
  },
  {
    icon: Zap,
    title: "Déployer",
    description: "L’écosystème transforme les idées, les talents et les organisations en systèmes IA utiles.",
  },
];

const processSteps = [
  "Comprendre le besoin",
  "Orienter vers le bon produit",
  "Accéder avec le compte KORYXA",
  "Activer l’espace autonome",
  "Suivre l’usage et l’impact",
];

const featuredProducts = productList.slice(0, 6);

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <main className="kx-pie-page">
        <section className="kx-pie-hero">
          <div className="kx-pie-blob kx-pie-blob-one" />
          <div className="kx-pie-blob kx-pie-blob-two" />
          <div className="kx-pie-hero-inner">
            <div className="kx-pie-hero-content kx-pie-animate">
              <div className="kx-pie-badge">
                <span className="kx-pie-dot" />
                <span>Plateforme d’orchestration IA en Afrique</span>
              </div>

              <h1>
                KORYXA
                <br />
                <em>la première plateforme d'orchestration IA en Afrique.</em>
              </h1>

              <p>
                KORYXA connecte les produits, les comptes, les talents, les partenaires et les systèmes autonomes
                de son écosystème pour rendre l’IA plus accessible, utile et organisée.
              </p>

              <div className="kx-pie-hero-ctas">
                <Link href={PUBLIC_ROUTES.ecosysteme} className="kx-pie-btn kx-pie-btn-gold">
                  Explorer l’écosystème
                  <ArrowRight size={18} />
                </Link>
                <Link href={PUBLIC_ROUTES.produits} className="kx-pie-btn kx-pie-btn-outline-white">
                  Voir les produits KORYXA
                </Link>
              </div>

              <div className="kx-pie-hero-note">
                <p>
                  <strong>Compte KORYXA</strong> : une seule identité pour accéder aux produits, espaces et services de l’écosystème.
                </p>
                <a href={KORYXA_ACCOUNT_URL}>Ouvrir le compte central →</a>
              </div>
            </div>

            <div className="kx-pie-hero-visual kx-pie-animate kx-pie-delay-2">
              <div className="kx-pie-stats-grid">
                {heroStats.map((stat, index) => (
                  <div className="kx-pie-stat-block" key={stat.label} style={{ animationDelay: `${0.28 + index * 0.1}s` }}>
                    <div className="kx-pie-stat-number">{stat.value}</div>
                    <div className="kx-pie-stat-desc">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="kx-pie-card kx-pie-card-top">
                <div className="kx-pie-card-header">
                  <div>
                    <div className="kx-pie-card-kicker">Orchestration centrale</div>
                    <div className="kx-pie-card-title">Écosystème KORYXA</div>
                  </div>
                  <div className="kx-pie-card-badge">● Actif</div>
                </div>
                <div className="kx-pie-progress-row">
                  <span>Connexion des produits</span>
                  <span>8 / 8</span>
                </div>
                <div className="kx-pie-bar"><span /></div>
                <div className="kx-pie-tags">
                  <span>Compte unique</span>
                  <span className="green">Produits autonomes</span>
                  <span>Afrique</span>
                </div>
              </div>

              <div className="kx-pie-card kx-pie-card-bottom">
                <div className="kx-pie-steps-label">Parcours d’orchestration</div>
                <div className="kx-pie-steps">
                  {processSteps.map((step, index) => (
                    <div className={index < 3 ? "kx-pie-step done" : "kx-pie-step pending"} key={step} style={{ animationDelay: `${0.95 + index * 0.1}s` }}>
                      <div className="kx-pie-step-icon">{index < 3 ? "✓" : index + 1}</div>
                      <div className="kx-pie-step-text">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="kx-pie-marquee-section" aria-label="Produits KORYXA">
          <div className="kx-pie-marquee-track">
            <div className="kx-pie-marquee-inner">
              {[...productList, ...productList].map((product, index) => (
                <div className="kx-pie-mini-card" key={`${product.slug}-${index}`}>
                  <span>{product.name}</span>
                  <small>{product.audience}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="kx-pie-section kx-pie-trust-band">
          <div className="kx-pie-container">
            <div className="kx-pie-section-header">
              <div className="kx-pie-section-label">Pourquoi KORYXA existe</div>
              <h2>Un point central pour un écosystème qui ne doit pas être dispersé.</h2>
              <p>
                L’IA avance vite. Les outils, comptes, produits et projets se multiplient. KORYXA organise cette complexité
                avec une vitrine claire, un compte central et des produits autonomes connectés.
              </p>
            </div>
            <div className="kx-pie-trust-grid">
              {pillars.map((item) => {
                const Icon = item.icon;
                return (
                  <article className="kx-pie-trust-item" key={item.title}>
                    <div className="kx-pie-trust-icon"><Icon size={22} /></div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="kx-pie-section">
          <div className="kx-pie-container">
            <div className="kx-pie-section-header">
              <div className="kx-pie-section-label">Produits autonomes</div>
              <h2>Chaque produit garde son autonomie. KORYXA garde la cohérence.</h2>
              <p>
                La vitrine centrale présente les produits, explique leur rôle et oriente vers l’espace adapté.
              </p>
            </div>
            <div className="kx-pie-services-grid">
              {featuredProducts.map((product, index) => (
                <article className="kx-pie-service-card" key={product.slug}>
                  <div className="kx-pie-service-number">{String(index + 1).padStart(2, "0")}</div>
                  <h3>{product.name}</h3>
                  <p>{product.summary}</p>
                  <div className="kx-pie-service-cta">
                    <Link href={`/produits/${product.slug}`} className="kx-pie-btn kx-pie-btn-primary kx-pie-btn-sm">
                      Découvrir
                    </Link>
                    <a href={product.href} className="kx-pie-btn kx-pie-btn-outline kx-pie-btn-sm">
                      Ouvrir
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="kx-pie-section kx-pie-bg-gray">
          <div className="kx-pie-container">
            <div className="kx-pie-two-col">
              <div>
                <div className="kx-pie-section-label">Compte KORYXA</div>
                <h2 className="kx-pie-section-title">Un seul compte pour accéder à l’écosystème.</h2>
                <p className="kx-pie-section-lead">
                  Le compte KORYXA centralise l’accès à l’écosystème. Les produits autonomes peuvent s’aligner sur une
                  même identité pour offrir une expérience simple et cohérente.
                </p>
                <ul className="kx-pie-feature-list">
                  <li>✓ Identité centrale</li>
                  <li>✓ Accès par produit</li>
                  <li>✓ Accès aux produits</li>
                  <li>✓ Expérience cohérente</li>
                </ul>
                <a href={KORYXA_ACCOUNT_URL} className="kx-pie-btn kx-pie-btn-primary">
                  Accéder au Compte KORYXA
                  <ArrowRight size={18} />
                </a>
              </div>

              <div className="kx-pie-dashboard-preview">
                <div className="kx-pie-dash-head">
                  <div>
                    <div className="kx-pie-dash-kicker">KORYXA Account</div>
                    <div className="kx-pie-dash-title">Mes accès écosystème</div>
                  </div>
                  <div className="kx-pie-dash-meta">Synchronisé</div>
                </div>
                <div className="kx-pie-dash-grid">
                  <div className="kx-pie-dash-card">
                    <span>Produits actifs</span>
                    <strong>8</strong>
                    <small>connectés à KORYXA</small>
                  </div>
                  <div className="kx-pie-dash-card">
                    <span>Identité</span>
                    <strong>1 compte</strong>
                    <small>pour tout l’écosystème</small>
                  </div>
                </div>
                <div className="kx-pie-checklist">
                  {[
                    "Compte KORYXA prêt",
                    "Accès aux produits",
                    "Accès produits autonomes",
                    "Portail partenaires",
                    "API et intégrations",
                  ].map((item) => (
                    <div className="kx-pie-check-item" key={item}>
                      <span><CheckCircle2 size={14} /></span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="kx-pie-section">
          <div className="kx-pie-container">
            <div className="kx-pie-section-header">
              <div className="kx-pie-section-label">Méthode d’orchestration</div>
              <h2>Une lecture simple : besoin, orientation, accès, activation.</h2>
            </div>
            <div className="kx-pie-method-grid">
              {[
                { icon: Globe2, title: "Comprendre", text: "Identifier le besoin réel et le contexte africain." },
                { icon: Layers3, title: "Orienter", text: "Diriger vers le produit ou l’espace KORYXA adapté." },
                { icon: ShieldCheck, title: "Accéder", text: "Passer par le compte KORYXA centralisé." },
                { icon: DatabaseZap, title: "Activer", text: "Utiliser le produit autonome sans perdre la cohérence globale." },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <article className="kx-pie-method-step" key={step.title}>
                    <div className="kx-pie-method-num">{index + 1}</div>
                    <Icon size={24} />
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="kx-pie-cta-section">
          <div className="kx-pie-container">
            <h2>Entrez dans l’écosystème KORYXA.</h2>
            <p>
              Découvrez les produits, comprenez l’architecture et accédez à votre compte central.
            </p>
            <div className="kx-pie-cta-btns">
              <Link href={PUBLIC_ROUTES.ecosysteme} className="kx-pie-btn kx-pie-btn-gold">
                Explorer l’écosystème
              </Link>
              <a href={KORYXA_ACCOUNT_URL} className="kx-pie-btn kx-pie-btn-outline-white">
                Compte KORYXA
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
