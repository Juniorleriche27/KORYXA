import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  CircuitBoard,
  Code2,
  GraduationCap,
  Network,
  PackageCheck,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";
import { productList, type ProductInfo } from "@/app/produits/data";

export const metadata: Metadata = {
  title: "Produits KORYXA | Catalogue des produits autonomes",
  description:
    "Découvrez les produits autonomes de l’écosystème KORYXA : ChatLAYA, Cora, Partner Portal, KORYXA API, KORYXA Formation, Neurokap, Corabiz et Services IA.",
};

const productIcons: Record<string, typeof Bot> = {
  chatlaya: Bot,
  cora: Workflow,
  "partner-portal": Building2,
  api: Code2,
  formation: GraduationCap,
  neurokap: CircuitBoard,
  corabiz: BriefcaseBusiness,
  "services-ia": PackageCheck,
};

const productGroups = [
  {
    label: "Usage direct",
    description: "Produits pensés pour les utilisateurs, les talents et les organisations.",
    slugs: ["chatlaya", "formation", "services-ia"],
  },
  {
    label: "Organisation",
    description: "Espaces pour structurer les relations, les partenaires et les activités.",
    slugs: ["cora", "partner-portal", "corabiz"],
  },
  {
    label: "Systèmes",
    description: "Briques techniques et projets IA rattachés à l’architecture KORYXA.",
    slugs: ["api", "neurokap"],
  },
];

function ProductCard({ product, index }: { product: ProductInfo; index: number }) {
  const Icon = productIcons[product.slug] ?? Sparkles;

  return (
    <article className="kx-products-card">
      <div className="kx-products-card-top">
        <div className="kx-products-icon">
          <Icon size={24} />
        </div>
        <span>{product.status}</span>
      </div>

      <div className="kx-products-card-number">{String(index + 1).padStart(2, "0")}</div>
      <h3>{product.name}</h3>
      <p className="kx-products-tagline">{product.tagline}</p>
      <p>{product.summary}</p>

      <div className="kx-products-meta-grid">
        <div>
          <span>Public</span>
          <strong>{product.audience}</strong>
        </div>
        <div>
          <span>Accès</span>
          <strong>Compte KORYXA</strong>
        </div>
      </div>

      <div className="kx-products-highlight-row">
        {product.highlights.slice(0, 3).map((highlight) => (
          <span key={highlight}>{highlight}</span>
        ))}
      </div>

      <div className="kx-products-actions">
        <Link href={`/produits/${product.slug}`} className="kx-pie-btn kx-pie-btn-primary kx-pie-btn-sm">
          Voir la fiche
        </Link>
        <a href={product.href} className="kx-pie-btn kx-pie-btn-outline kx-pie-btn-sm">
          Ouvrir
        </a>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  const groupedProducts = productGroups.map((group) => ({
    ...group,
    products: group.slugs
      .map((slug) => productList.find((product) => product.slug === slug))
      .filter(Boolean) as ProductInfo[],
  }));

  return (
    <main className="kx-pie-page kx-products-page">
      <section className="kx-products-hero">
        <div className="kx-pie-blob kx-pie-blob-one" />
        <div className="kx-pie-blob kx-pie-blob-two" />
        <div className="kx-products-hero-inner">
          <div className="kx-products-hero-copy kx-pie-animate">
            <div className="kx-pie-badge">
              <span className="kx-pie-dot" />
              <span>Catalogue produits KORYXA</span>
            </div>
            <h1>Les produits autonomes de l’écosystème KORYXA.</h1>
            <p>
              Chaque produit a son rôle, son public et son espace. KORYXA garde la cohérence globale : marque,
              orientation, compte KORYXA et écosystème connecté.
            </p>
            <div className="kx-pie-hero-ctas">
              <a href={KORYXA_ACCOUNT_URL} className="kx-pie-btn kx-pie-btn-gold">
                Compte KORYXA
                <ArrowRight size={18} />
              </a>
              <Link href={PUBLIC_ROUTES.casUsage} className="kx-pie-btn kx-pie-btn-outline-white">
                Trouver par besoin
              </Link>
            </div>
          </div>

          <div className="kx-products-hero-panel kx-pie-animate kx-pie-delay-2">
            <div className="kx-products-panel-head">
              <div>
                <span>Vue catalogue</span>
                <strong>8 produits connectés</strong>
              </div>
              <Network size={24} />
            </div>
            <div className="kx-products-panel-grid">
              {productList.map((product, index) => {
                const Icon = productIcons[product.slug] ?? Sparkles;
                return (
                  <div key={product.slug} style={{ animationDelay: `${0.24 + index * 0.07}s` }}>
                    <Icon size={18} />
                    <span>{product.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="kx-products-strip" aria-label="Segments produits KORYXA">
        <div className="kx-pie-container">
          <div className="kx-products-segment-grid">
            {groupedProducts.map((group) => (
              <article key={group.label}>
                <div className="kx-products-segment-kicker">{group.products.length} produits</div>
                <h2>{group.label}</h2>
                <p>{group.description}</p>
                <div>
                  {group.products.map((product) => (
                    <span key={product.slug}>{product.name}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kx-pie-section kx-pie-trust-band">
        <div className="kx-pie-container">
          <div className="kx-pie-section-header">
            <div className="kx-pie-section-label">Catalogue</div>
            <h2>Un catalogue lisible, sans mélanger les usages.</h2>
            <p>
              La page produits sert à comprendre rapidement ce que chaque produit fait, à qui il s’adresse
              et comment y accéder.
            </p>
          </div>

          <div className="kx-products-grid">
            {productList.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="kx-pie-section">
        <div className="kx-pie-container">
          <div className="kx-products-routing-card">
            <div>
              <div className="kx-pie-section-label">Orientation</div>
              <h2>Vous ne connaissez pas encore le bon produit ?</h2>
              <p>
                La page Cas d’usage permet de partir du besoin : discuter avec une IA, former des talents,
                devenir partenaire, accéder à une API ou lancer un projet IA.
              </p>
            </div>
            <div className="kx-products-routing-actions">
              <Link href={PUBLIC_ROUTES.casUsage} className="kx-pie-btn kx-pie-btn-gold">
                Voir les cas d’usage
              </Link>
              <Link href={PUBLIC_ROUTES.ecosysteme} className="kx-pie-btn kx-pie-btn-outline-white">
                Comprendre l’écosystème
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="kx-pie-cta-section">
        <div className="kx-pie-container">
          <div className="kx-pie-section-label">Compte KORYXA</div>
          <h2>Un seul compte pour ouvrir les bons produits.</h2>
          <p>
            Le compte KORYXA simplifie l’accès aux produits de l’écosystème.
          </p>
          <div className="kx-pie-cta-btns">
            <a href={KORYXA_ACCOUNT_URL} className="kx-pie-btn kx-pie-btn-gold">
              Accéder au Compte KORYXA
            </a>
            <Link href={PUBLIC_ROUTES.contact} className="kx-pie-btn kx-pie-btn-outline-white">
              Contacter KORYXA
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
