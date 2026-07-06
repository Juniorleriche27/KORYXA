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
} from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";
import { productList } from "@/app/produits/data";

export const metadata: Metadata = {
  title: "Écosystème KORYXA | Orchestration IA en Afrique",
  description:
    "Découvrez comment KORYXA organise son écosystème IA : compte unique, produits autonomes, partenaires et systèmes connectés.",
};

const architectureLayers = [
  {
    icon: Globe2,
    title: "KORYXA Vitrine",
    description: "La porte d’entrée publique qui explique la vision, les produits, les cas d’usage et les partenaires.",
    items: ["Accueil", "Écosystème", "Produits", "Cas d’usage"],
  },
  {
    icon: KeyRound,
    title: "Compte KORYXA",
    description: "Une identité unique pour accéder aux produits KORYXA avec une expérience cohérente.",
    items: ["Compte unique", "Produits", "Profil", "Accès"],
  },
  {
    icon: Layers3,
    title: "Produits autonomes",
    description: "Chaque produit garde son périmètre, son repo et son expérience, tout en restant relié à KORYXA.",
    items: ["ChatLAYA", "Cora", "Formation", "Services IA"],
  },
  {
    icon: DatabaseZap,
    title: "APIs et systèmes",
    description: "La couche technique relie les données, les intégrations, les services et les expériences produit.",
    items: ["KORYXA API", "Connecteurs", "Automations", "Données"],
  },
  {
    icon: Building2,
    title: "Partenaires",
    description: "Les organisations, écoles, entreprises et communautés qui construisent avec KORYXA.",
    items: ["Institutions", "Écoles", "Entreprises", "Communautés"],
  },
];

const orchestrationFlow = [
  {
    label: "Comprendre",
    description: "Identifier le besoin réel : utilisateur, organisation, partenaire ou produit.",
  },
  {
    label: "Orienter",
    description: "Diriger vers la bonne page, le bon produit ou le bon espace KORYXA.",
  },
  {
    label: "Accéder",
    description: "Passer par le compte KORYXA pour accéder aux espaces adaptés.",
  },
  {
    label: "Activer",
    description: "Utiliser le produit autonome sans disperser l’identité ni l’expérience.",
  },
  {
    label: "Mesurer",
    description: "Suivre les usages, les demandes, les partenariats et l’impact terrain.",
  },
];

const ecosystemMetrics = [
  { value: "01", label: "marque repère" },
  { value: "08", label: "produits et projets" },
  { value: "01", label: "compte KORYXA" },
  { value: "05", label: "couches d’écosystème" },
];

export default function EcosystemePage() {
  return (
    <main className="kx-pie-page kx-ecosystem-page">
      <section className="kx-ecosystem-hero">
        <div className="kx-pie-blob kx-pie-blob-one" />
        <div className="kx-pie-blob kx-pie-blob-two" />
        <div className="kx-ecosystem-hero-inner">
          <div className="kx-ecosystem-hero-copy kx-pie-animate">
            <div className="kx-pie-badge">
              <span className="kx-pie-dot" />
              <span>Écosystème KORYXA</span>
            </div>
            <h1>Un écosystème IA autonome, connecté par KORYXA.</h1>
            <p>
              KORYXA n’est pas un produit isolé. C’est la plateforme qui présente, relie et organise
              les produits autonomes, le compte unique, les APIs, les partenaires et les systèmes de l’écosystème.
            </p>
            <div className="kx-pie-hero-ctas">
              <Link href={PUBLIC_ROUTES.produits} className="kx-pie-btn kx-pie-btn-gold">
                Voir les produits
                <ArrowRight size={18} />
              </Link>
              <a href={KORYXA_ACCOUNT_URL} className="kx-pie-btn kx-pie-btn-outline-white">
                Compte KORYXA
              </a>
            </div>
          </div>

          <div className="kx-ecosystem-map-card kx-pie-animate kx-pie-delay-2">
            <div className="kx-ecosystem-map-core">
              <Sparkles size={22} />
              <strong>KORYXA</strong>
              <span>écosystème connecté</span>
            </div>
            <div className="kx-ecosystem-orbit orbit-one">Compte</div>
            <div className="kx-ecosystem-orbit orbit-two">Produits</div>
            <div className="kx-ecosystem-orbit orbit-three">APIs</div>
            <div className="kx-ecosystem-orbit orbit-four">Partenaires</div>
            <div className="kx-ecosystem-orbit orbit-five">Afrique</div>
          </div>
        </div>
      </section>

      <section className="kx-pie-marquee-section" aria-label="Produits de l'écosystème KORYXA">
        <div className="kx-pie-marquee-track">
          <div className="kx-pie-marquee-inner">
            {[...productList, ...productList].map((product, index) => (
              <div className="kx-pie-mini-card" key={`${product.slug}-${index}`}>
                <span>{product.name}</span>
                <small>{product.tagline}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kx-pie-section kx-pie-trust-band">
        <div className="kx-pie-container">
          <div className="kx-pie-section-header">
            <div className="kx-pie-section-label">Architecture</div>
            <h2>Les cinq couches qui donnent de la cohérence à KORYXA.</h2>
            <p>
              La vitrine explique, le compte KORYXA ouvre l’accès, les produits exécutent, les intégrations relient,
              les partenaires amplifient.
            </p>
          </div>

          <div className="kx-ecosystem-layer-grid">
            {architectureLayers.map((layer, index) => {
              const Icon = layer.icon;
              return (
                <article className="kx-ecosystem-layer-card" key={layer.title}>
                  <div className="kx-ecosystem-layer-top">
                    <div className="kx-pie-trust-icon"><Icon size={22} /></div>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3>{layer.title}</h3>
                  <p>{layer.description}</p>
                  <div className="kx-ecosystem-chip-row">
                    {layer.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="kx-pie-section">
        <div className="kx-pie-container">
          <div className="kx-ecosystem-split">
            <div>
              <div className="kx-pie-section-label">Flux d’orchestration</div>
              <h2 className="kx-pie-section-title">Le visiteur ne doit pas chercher. KORYXA oriente.</h2>
              <p className="kx-pie-section-lead">
                La logique de l’écosystème est simple : chaque personne arrive avec un besoin, KORYXA l’aide à comprendre
                où aller, quel produit ouvrir et quel accès utiliser.
              </p>
              <div className="kx-ecosystem-metrics">
                {ecosystemMetrics.map((metric) => (
                  <div key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kx-ecosystem-flow-card">
              {orchestrationFlow.map((step, index) => (
                <div className="kx-ecosystem-flow-step" key={step.label}>
                  <div className="kx-ecosystem-flow-num">{index + 1}</div>
                  <div>
                    <h3>{step.label}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kx-pie-section kx-pie-bg-gray">
        <div className="kx-pie-container">
          <div className="kx-pie-section-header">
            <div className="kx-pie-section-label">Produits autonomes</div>
            <h2>Les produits ont leur autonomie. L’écosystème garde une direction commune.</h2>
            <p>
              Chaque produit peut évoluer dans son propre dépôt, avec son propre périmètre. KORYXA garde la lisibilité,
              la marque et l’accès au compte KORYXA.
            </p>
          </div>

          <div className="kx-ecosystem-product-grid">
            {productList.map((product) => (
              <article className="kx-ecosystem-product-card" key={product.slug}>
                <div className="kx-ecosystem-product-head">
                  <CircuitBoard size={20} />
                  <span>{product.status}</span>
                </div>
                <h3>{product.name}</h3>
                <p>{product.summary}</p>
                <div className="kx-ecosystem-product-actions">
                  <Link href={`/produits/${product.slug}`}>Découvrir</Link>
                  <a href={product.href}>Ouvrir</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kx-ecosystem-account-section">
        <div className="kx-pie-container">
          <div className="kx-ecosystem-account-card">
            <div>
              <div className="kx-pie-section-label">Compte KORYXA</div>
              <h2>Un seul compte KORYXA pour accéder aux espaces autorisés.</h2>
              <p>
                Le compte KORYXA simplifie la connexion aux produits de l’écosystème pour éviter de multiplier
                les systèmes d’identité et garder une expérience cohérente.
              </p>
            </div>
            <div className="kx-ecosystem-account-points">
              {[
                "Identité unique",
                "Accès aux produits",
                "Accès produits",
                "Portail partenaires",
              ].map((item) => (
                <div key={item}>
                  <ShieldCheck size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <a href={KORYXA_ACCOUNT_URL} className="kx-pie-btn kx-pie-btn-gold">
              Accéder au Compte KORYXA
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="kx-pie-cta-section">
        <div className="kx-pie-container">
          <div className="kx-pie-section-label">Prochaine étape</div>
          <h2>Explorer les produits autonomes KORYXA.</h2>
          <p>
            La page Produits détaille chaque espace, son public cible, son rôle et son accès.
          </p>
          <div className="kx-pie-cta-btns">
            <Link href={PUBLIC_ROUTES.produits} className="kx-pie-btn kx-pie-btn-gold">
              Voir les produits
            </Link>
            <Link href={PUBLIC_ROUTES.casUsage} className="kx-pie-btn kx-pie-btn-outline-white">
              Voir les cas d’usage
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
