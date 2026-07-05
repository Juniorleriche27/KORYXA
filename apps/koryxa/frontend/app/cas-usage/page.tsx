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
  Sparkles,
} from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Cas d’usage KORYXA | Trouver le bon produit",
  description:
    "Trouvez le bon produit KORYXA selon votre besoin : discuter avec une IA, accéder au compte KORYXA, former des talents, connecter une organisation, utiliser une API ou devenir partenaire.",
};

const useCases = [
  {
    icon: Bot,
    title: "Je veux discuter avec une IA",
    description: "Démarrer une conversation, explorer une idée, cadrer une demande ou accélérer une réflexion.",
    product: "ChatLAYA",
    href: "/produits/chatlaya",
    action: "Ouvrir ChatLAYA",
    tag: "Conversation IA",
  },
  {
    icon: KeyRound,
    title: "Je veux accéder à mon compte KORYXA",
    description: "Entrer dans l’espace central qui gère l’identité, les rôles et les accès aux produits.",
    product: "Compte KORYXA",
    href: KORYXA_ACCOUNT_URL,
    action: "Accéder au compte",
    tag: "Accès central",
    external: true,
  },
  {
    icon: Layers3,
    title: "Je veux utiliser un produit autonome",
    description: "Comprendre les produits disponibles et choisir l’espace KORYXA adapté à votre situation.",
    product: "Catalogue produits",
    href: PUBLIC_ROUTES.produits,
    action: "Voir les produits",
    tag: "Produit autonome",
  },
  {
    icon: GraduationCap,
    title: "Je veux former ou accompagner des talents",
    description: "Orienter des apprenants, des communautés ou des profils vers la montée en compétence IA.",
    product: "KORYXA Formation",
    href: "/produits/formation",
    action: "Voir Formation",
    tag: "Talents IA",
  },
  {
    icon: Building2,
    title: "Je veux connecter une organisation",
    description: "Structurer une organisation, un partenaire, une équipe ou un espace métier dans l’écosystème.",
    product: "Cora / Partner Portal",
    href: "/produits/partner-portal",
    action: "Voir Partner Portal",
    tag: "Organisation",
  },
  {
    icon: Code2,
    title: "Je veux utiliser une API",
    description: "Accéder à la couche technique, aux intégrations et aux fondations système de KORYXA.",
    product: "KORYXA API",
    href: "/produits/api",
    action: "Voir l’API",
    tag: "Système",
  },
  {
    icon: Network,
    title: "Je veux devenir partenaire",
    description: "Collaborer avec KORYXA comme entreprise, école, institution, communauté ou acteur terrain.",
    product: "Partenaires",
    href: PUBLIC_ROUTES.partenaires,
    action: "Voir partenaires",
    tag: "Partenariat",
  },
  {
    icon: Rocket,
    title: "Je veux lancer un projet IA",
    description: "Transformer une demande, un besoin métier ou une idée en prestation IA cadrée et exécutable.",
    product: "Services IA",
    href: "/produits/services-ia",
    action: "Voir Services IA",
    tag: "Exécution IA",
  },
];

const routes = [
  "Besoin réel",
  "Orientation KORYXA",
  "Compte central",
  "Produit autonome",
  "Activation",
];

export default function CasUsagePage() {
  return (
    <main className="kx-pie-page kx-usecases-page">
      <section className="kx-usecases-hero">
        <div className="kx-pie-blob kx-pie-blob-one" />
        <div className="kx-pie-blob kx-pie-blob-two" />
        <div className="kx-usecases-hero-inner">
          <div className="kx-usecases-hero-copy kx-pie-animate">
            <div className="kx-pie-badge">
              <span className="kx-pie-dot" />
              <span>Orientation par besoin</span>
            </div>
            <h1>Trouvez le bon produit KORYXA selon votre besoin.</h1>
            <p>
              Vous n’avez pas besoin de connaître le nom exact d’un produit. Dites ce que vous voulez faire :
              KORYXA vous oriente vers le bon espace, le bon accès ou la bonne trajectoire.
            </p>
            <div className="kx-pie-hero-ctas">
              <Link href={PUBLIC_ROUTES.produits} className="kx-pie-btn kx-pie-btn-gold">
                Explorer les produits
                <ArrowRight size={18} />
              </Link>
              <a href={KORYXA_ACCOUNT_URL} className="kx-pie-btn kx-pie-btn-outline-white">
                Compte KORYXA
              </a>
            </div>
          </div>

          <div className="kx-usecases-route-card kx-pie-animate kx-pie-delay-2">
            <div className="kx-usecases-route-head">
              <div>
                <span>Parcours guidé</span>
                <strong>Du besoin au bon produit</strong>
              </div>
              <Compass size={24} />
            </div>
            <div className="kx-usecases-route-list">
              {routes.map((route, index) => (
                <div key={route} style={{ animationDelay: `${0.25 + index * 0.1}s` }}>
                  <span>{index + 1}</span>
                  <p>{route}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kx-pie-section kx-pie-trust-band">
        <div className="kx-pie-container">
          <div className="kx-pie-section-header">
            <div className="kx-pie-section-label">Cas d’usage</div>
            <h2>Choisissez d’abord l’intention. KORYXA fait le tri.</h2>
            <p>
              Cette page sert de routeur : elle relie un besoin concret à un produit, une page partenaire ou au Compte KORYXA.
            </p>
          </div>

          <div className="kx-usecases-grid">
            {useCases.map((item, index) => {
              const Icon = item.icon;
              const isExternal = "external" in item && item.external;
              const CardLink = isExternal ? "a" : Link;
              const linkProps = isExternal ? { href: item.href } : { href: item.href };

              return (
                <article className="kx-usecases-card" key={item.title}>
                  <div className="kx-usecases-card-top">
                    <div className="kx-products-icon">
                      <Icon size={24} />
                    </div>
                    <span>{item.tag}</span>
                  </div>
                  <div className="kx-products-card-number">{String(index + 1).padStart(2, "0")}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="kx-usecases-target">
                    <span>Orientation</span>
                    <strong>{item.product}</strong>
                  </div>
                  <div className="kx-usecases-actions">
                    <CardLink {...linkProps} className="kx-pie-btn kx-pie-btn-primary kx-pie-btn-sm">
                      {item.action}
                    </CardLink>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="kx-pie-section">
        <div className="kx-pie-container">
          <div className="kx-usecases-method-card">
            <div>
              <div className="kx-pie-section-label">Méthode</div>
              <h2>Un visiteur arrive avec un problème, pas avec une architecture.</h2>
              <p>
                La logique KORYXA est de rendre l’écosystème lisible. Le visiteur part de son intention, puis la plateforme
                le dirige vers le produit, le partenaire, l’API ou le compte central qui correspond.
              </p>
            </div>
            <div className="kx-usecases-method-list">
              {[
                "Clarifier le besoin",
                "Identifier le bon espace",
                "Ouvrir l’accès adapté",
                "Activer le produit autonome",
              ].map((step, index) => (
                <div key={step}>
                  <span>{index + 1}</span>
                  <strong>{step}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kx-usecases-account-section">
        <div className="kx-pie-container">
          <div className="kx-usecases-account-grid">
            <article>
              <KeyRound size={26} />
              <h3>Accès central</h3>
              <p>Un seul compte KORYXA pour ouvrir les espaces autorisés.</p>
              <a href={KORYXA_ACCOUNT_URL}>Compte KORYXA →</a>
            </article>
            <article>
              <BriefcaseBusiness size={26} />
              <h3>Partenaires</h3>
              <p>Une entrée claire pour collaborer avec KORYXA.</p>
              <Link href={PUBLIC_ROUTES.partenaires}>Devenir partenaire →</Link>
            </article>
            <article>
              <Lightbulb size={26} />
              <h3>Produits</h3>
              <p>Un catalogue lisible pour comprendre chaque produit autonome.</p>
              <Link href={PUBLIC_ROUTES.produits}>Voir les produits →</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="kx-pie-cta-section">
        <div className="kx-pie-container">
          <div className="kx-pie-section-label">Prochaine étape</div>
          <h2>Vous connaissez maintenant le besoin. Choisissez le bon chemin.</h2>
          <p>
            KORYXA vous oriente vers le produit, le compte ou l’espace partenaire adapté.
          </p>
          <div className="kx-pie-cta-btns">
            <Link href={PUBLIC_ROUTES.produits} className="kx-pie-btn kx-pie-btn-gold">
              Explorer les produits
            </Link>
            <Link href={PUBLIC_ROUTES.ecosysteme} className="kx-pie-btn kx-pie-btn-outline-white">
              Comprendre l’écosystème
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
