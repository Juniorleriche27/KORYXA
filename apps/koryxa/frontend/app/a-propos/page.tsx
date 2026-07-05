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
} from "lucide-react";
import { PUBLIC_ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "À propos de KORYXA | Vision, mission et méthode",
  description:
    "Découvrez la vision KORYXA : construire une infrastructure IA pensée pour les réalités africaines, avec une plateforme d’orchestration, un compte central et des produits autonomes.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Clarté",
    description: "Chaque produit, accès et parcours doit avoir un rôle compréhensible.",
  },
  {
    icon: HeartHandshake,
    title: "Utilité",
    description: "L’IA doit répondre à des besoins réels, pas seulement impressionner.",
  },
  {
    icon: Globe2,
    title: "Afrique",
    description: "La plateforme est pensée depuis les réalités africaines et pour leur transformation.",
  },
  {
    icon: Layers3,
    title: "Autonomie",
    description: "Les produits peuvent avancer séparément tout en restant liés par une architecture commune.",
  },
];

const method = [
  "Observer les besoins réels",
  "Structurer l’écosystème",
  "Connecter le compte central",
  "Déployer les produits autonomes",
  "Mesurer l’impact utile",
];

export default function AProposPage() {
  return (
    <main className="kx-pie-page kx-about-page">
      <section className="kx-about-hero">
        <div className="kx-pie-blob kx-pie-blob-one" />
        <div className="kx-pie-blob kx-pie-blob-two" />
        <div className="kx-about-hero-inner">
          <div className="kx-about-hero-copy kx-pie-animate">
            <div className="kx-pie-badge">
              <span className="kx-pie-dot" />
              <span>À propos de KORYXA</span>
            </div>
            <h1>KORYXA construit une infrastructure IA pensée pour les réalités africaines.</h1>
            <p>
              KORYXA est la porte d’entrée publique, le point d’accès central et l’orchestrateur d’un écosystème
              de produits IA autonomes.
            </p>
            <div className="kx-pie-hero-ctas">
              <Link href={PUBLIC_ROUTES.ecosysteme} className="kx-pie-btn kx-pie-btn-gold">
                Explorer l’écosystème
                <ArrowRight size={18} />
              </Link>
              <Link href={PUBLIC_ROUTES.produits} className="kx-pie-btn kx-pie-btn-outline-white">
                Voir les produits
              </Link>
            </div>
          </div>

          <div className="kx-about-manifesto-card kx-pie-animate kx-pie-delay-2">
            <Sparkles size={26} />
            <span>Manifeste</span>
            <strong>Organiser l’IA pour qu’elle devienne accessible, utile et structurée.</strong>
            <p>
              KORYXA ne cherche pas à tout mélanger dans un seul produit. La plateforme donne une direction,
              un accès et une cohérence à plusieurs systèmes autonomes.
            </p>
          </div>
        </div>
      </section>

      <section className="kx-pie-section kx-pie-trust-band">
        <div className="kx-pie-container">
          <div className="kx-about-split">
            <article>
              <Eye size={28} />
              <div className="kx-pie-section-label">Vision</div>
              <h2>Faire de KORYXA la référence d’orchestration IA en Afrique.</h2>
              <p>
                La vision est de créer un point central capable de présenter, relier et activer des produits IA
                qui répondent aux réalités des talents, organisations, partenaires et projets africains.
              </p>
            </article>
            <article>
              <Target size={28} />
              <div className="kx-pie-section-label">Mission</div>
              <h2>Transformer idées, besoins et organisations en systèmes autonomes.</h2>
              <p>
                La mission de KORYXA est d’orienter les utilisateurs vers les bons produits, de centraliser les accès
                et de maintenir une cohérence entre les projets de l’écosystème.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="kx-pie-section">
        <div className="kx-pie-container">
          <div className="kx-pie-section-header">
            <div className="kx-pie-section-label">Valeurs</div>
            <h2>Ce qui guide l’écosystème KORYXA.</h2>
            <p>
              La marque centrale porte une exigence : chaque produit doit être lisible, utile, autonome et connecté.
            </p>
          </div>
          <div className="kx-about-values-grid">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article className="kx-about-value-card" key={value.title}>
                  <div className="kx-products-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="kx-pie-section kx-pie-bg-gray">
        <div className="kx-pie-container">
          <div className="kx-about-method-card">
            <div>
              <div className="kx-pie-section-label">Méthode KORYXA</div>
              <h2>Une méthode d’orchestration, pas une accumulation de projets.</h2>
              <p>
                KORYXA part du réel, structure l’écosystème, organise les accès, puis connecte les produits à une
                architecture commune.
              </p>
            </div>
            <div className="kx-about-method-list">
              {method.map((step, index) => (
                <div key={step}>
                  <span>{index + 1}</span>
                  <strong>{step}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kx-about-africa-section">
        <div className="kx-pie-container">
          <div className="kx-about-africa-card">
            <Compass size={28} />
            <div>
              <h2>Pourquoi l’Afrique ?</h2>
              <p>
                Parce que les talents, organisations et communautés africaines ont besoin de systèmes IA adaptés à leurs
                réalités : accès, formation, organisation, partenaires, données, services et produits autonomes.
              </p>
            </div>
            <Link href={PUBLIC_ROUTES.casUsage} className="kx-pie-btn kx-pie-btn-primary">
              Voir les cas d’usage
            </Link>
          </div>
        </div>
      </section>

      <section className="kx-pie-cta-section">
        <div className="kx-pie-container">
          <div className="kx-pie-section-label">KORYXA</div>
          <h2>Une vitrine centrale. Un compte unique. Des produits autonomes.</h2>
          <p>La plateforme donne de la cohérence à tout l’écosystème KORYXA.</p>
          <div className="kx-pie-cta-btns">
            <Link href={PUBLIC_ROUTES.ecosysteme} className="kx-pie-btn kx-pie-btn-gold">
              Explorer l’écosystème
            </Link>
            <Link href={PUBLIC_ROUTES.contact} className="kx-pie-btn kx-pie-btn-outline-white">
              Contacter KORYXA
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
