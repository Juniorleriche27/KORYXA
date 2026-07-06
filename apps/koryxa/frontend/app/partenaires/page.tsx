import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Handshake,
  Landmark,
  Network,
  Rocket,
  Sparkles,
  UsersRound,
  Wrench,
} from "lucide-react";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Partenaires KORYXA | Construire l’écosystème IA africain",
  description:
    "KORYXA ouvre une porte d’entrée aux entreprises, institutions, écoles, communautés, startups, organisations terrain et partenaires techniques.",
};

const partnerTypes = [
  {
    icon: Building2,
    title: "Entreprises",
    description: "Connecter des besoins métier, des équipes et des projets à l’écosystème KORYXA.",
  },
  {
    icon: Landmark,
    title: "Institutions",
    description: "Structurer des initiatives IA autour de l’impact, de la formation et de l’accès organisé.",
  },
  {
    icon: GraduationCap,
    title: "Écoles",
    description: "Créer des ponts entre apprentissage, talents et produits IA concrets.",
  },
  {
    icon: UsersRound,
    title: "Communautés",
    description: "Relier les acteurs terrain, les collectifs et les talents aux bons espaces KORYXA.",
  },
  {
    icon: Rocket,
    title: "Startups",
    description: "Accélérer des projets autonomes avec une logique d’écosystème et d’accès simplifié.",
  },
  {
    icon: Wrench,
    title: "Partenaires techniques",
    description: "Connecter APIs, intégrations, automatisations et systèmes utiles à l’écosystème.",
  },
];

const partnershipProcess = [
  "Présenter l’organisation",
  "Identifier le type de partenariat",
  "Cadrer les besoins et les accès",
  "Connecter au bon espace KORYXA",
  "Suivre la collaboration",
];

export default function PartenairesPage() {
  return (
    <main className="kx-pie-page kx-partners-page">
      <section className="kx-partners-hero">
        <div className="kx-pie-blob kx-pie-blob-one" />
        <div className="kx-pie-blob kx-pie-blob-two" />
        <div className="kx-partners-hero-inner">
          <div className="kx-partners-hero-copy kx-pie-animate">
            <div className="kx-pie-badge">
              <span className="kx-pie-dot" />
              <span>Partenaires KORYXA</span>
            </div>
            <h1>Construire l’écosystème IA africain avec KORYXA.</h1>
            <p>
              KORYXA accueille les organisations qui veulent collaborer, former, connecter, déployer ou structurer
              des usages IA dans un cadre clair et cohérent.
            </p>
            <div className="kx-pie-hero-ctas">
              <Link href={PUBLIC_ROUTES.contact} className="kx-pie-btn kx-pie-btn-gold">
                Devenir partenaire
                <ArrowRight size={18} />
              </Link>
              <a href={KORYXA_ACCOUNT_URL} className="kx-pie-btn kx-pie-btn-outline-white">
                Compte KORYXA
              </a>
            </div>
          </div>

          <div className="kx-partners-panel kx-pie-animate kx-pie-delay-2">
            <div className="kx-partners-panel-head">
              <div>
                <span>Réseau KORYXA</span>
                <strong>Partenariats structurés</strong>
              </div>
              <Handshake size={26} />
            </div>
            <div className="kx-partners-panel-list">
              {partnerTypes.slice(0, 5).map((type, index) => {
                const Icon = type.icon;
                return (
                  <div key={type.title} style={{ animationDelay: `${0.25 + index * 0.1}s` }}>
                    <span>{index + 1}</span>
                    <Icon size={18} />
                    <p>{type.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="kx-pie-section kx-pie-trust-band">
        <div className="kx-pie-container">
          <div className="kx-pie-section-header">
            <div className="kx-pie-section-label">Types de partenaires</div>
            <h2>Une porte d’entrée claire pour chaque organisation.</h2>
            <p>
              KORYXA ne mélange pas les intentions. Chaque partenaire entre par un cadre lisible : organisation,
              formation, terrain, technologie ou produit.
            </p>
          </div>

          <div className="kx-partners-grid">
            {partnerTypes.map((type) => {
              const Icon = type.icon;
              return (
                <article className="kx-partners-card" key={type.title}>
                  <div className="kx-products-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{type.title}</h3>
                  <p>{type.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="kx-pie-section">
        <div className="kx-pie-container">
          <div className="kx-partners-method-card">
            <div>
              <div className="kx-pie-section-label">Processus</div>
              <h2>Une collaboration doit être cadrée avant d’être activée.</h2>
              <p>
                KORYXA structure les partenariats pour éviter les échanges dispersés : contexte, objectif,
                rôle, accès, produit concerné, puis suivi.
              </p>
            </div>
            <div className="kx-partners-process-list">
              {partnershipProcess.map((step, index) => (
                <div key={step}>
                  <span>{index + 1}</span>
                  <strong>{step}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kx-partners-portal-section">
        <div className="kx-pie-container">
          <div className="kx-partners-portal-card">
            <Network size={28} />
            <div>
              <h2>Partner Portal organise les collaborations.</h2>
              <p>
                Le portail partenaire sert d’espace de suivi pour les collaborations KORYXA : demandes,
                accès, échanges, projets et relations actives.
              </p>
            </div>
            <Link href="/produits/partner-portal" className="kx-pie-btn kx-pie-btn-primary">
              Voir Partner Portal
            </Link>
          </div>
        </div>
      </section>

      <section className="kx-pie-cta-section">
        <div className="kx-pie-container">
          <div className="kx-pie-section-label">Collaboration</div>
          <h2>Entrer dans l’écosystème KORYXA comme partenaire.</h2>
          <p>Présentez votre organisation et le type de collaboration que vous voulez ouvrir avec KORYXA.</p>
          <div className="kx-pie-cta-btns">
            <Link href={PUBLIC_ROUTES.contact} className="kx-pie-btn kx-pie-btn-gold">
              Devenir partenaire
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
