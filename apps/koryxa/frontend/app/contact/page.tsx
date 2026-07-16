import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Mail, Megaphone, MessageSquare, PackageCheck, Phone, UserRoundCog } from "lucide-react";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { KORYXA_CONTACT } from "@/config/contact";
import { ContactForm } from "./ContactForm";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Contact KORYXA | Partenariat, produit, compte et presse",
  description:
    "Contactez KORYXA par email, WhatsApp ou via les pages officielles Facebook et LinkedIn.",
};

const contactReasons = [
  {
    icon: Building2,
    title: "Partenariat",
    description: "Entreprise, institution, école, communauté ou organisation terrain.",
  },
  {
    icon: PackageCheck,
    title: "Produit",
    description: "Question sur ChatLAYA, Cora, Formation, API, Services IA ou un autre produit.",
  },
  {
    icon: UserRoundCog,
    title: "Compte KORYXA",
    description: "Connexion, inscription ou accès à tes produits avec ton compte KORYXA.",
  },
  {
    icon: Megaphone,
    title: "Presse",
    description: "Demande média, présentation officielle ou prise de parole.",
  },
  {
    icon: MessageSquare,
    title: "Autre demande",
    description: "Toute autre question liée à l’écosystème KORYXA.",
  },
];

export default function ContactPage() {
  return (
    <main className="kx-pie-page kx-contact-page">
      <section className="kx-contact-hero">
        <div className="kx-pie-blob kx-pie-blob-one" />
        <div className="kx-pie-blob kx-pie-blob-two" />
        <div className="kx-contact-hero-inner">
          <div className="kx-contact-hero-copy kx-pie-animate">
            <div className="kx-pie-badge">
              <span className="kx-pie-dot" />
              <span>Contact KORYXA</span>
            </div>
            <h1>Contactez KORYXA.</h1>
            <p>
              Choisissez le bon motif de contact : partenariat, produit, compte KORYXA, presse ou autre demande.
              L’objectif est d’orienter chaque message vers le bon espace de l’écosystème.
            </p>
            <div className="kx-pie-hero-ctas">
              <a href={`mailto:${KORYXA_CONTACT.email}`} className="kx-pie-btn kx-pie-btn-gold">
                Écrire à KORYXA
                <ArrowRight size={18} />
              </a>
              <a href={KORYXA_CONTACT.whatsappUrl} target="_blank" rel="noreferrer" className="kx-pie-btn kx-pie-btn-outline-white">
                WhatsApp KORYXA
              </a>
            </div>
          </div>

          <div className="kx-contact-panel kx-pie-animate kx-pie-delay-2">
            <div className="kx-contact-panel-head">
              <div>
                <span>Point d’entrée</span>
                <strong>Une demande, un bon canal</strong>
              </div>
              <Mail size={26} />
            </div>
            <div className="kx-contact-panel-list">
              {contactReasons.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <div key={reason.title} style={{ animationDelay: `${0.25 + index * 0.1}s` }}>
                    <span>{index + 1}</span>
                    <Icon size={18} />
                    <p>{reason.title}</p>
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
            <div className="kx-pie-section-label">Motifs de contact</div>
            <h2>Chaque demande doit arriver au bon endroit.</h2>
            <p>
              KORYXA organise les échanges comme son écosystème : avec un motif clair, une orientation simple et un accès lisible.
            </p>
          </div>

          <div className="kx-contact-reason-grid">
            {contactReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <article className="kx-contact-reason-card" key={reason.title}>
                  <div className="kx-products-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{reason.title}</h3>
                  <p>{reason.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="kx-pie-section">
        <div className="kx-pie-container">
          <div className="kx-contact-main-grid">
            <div className="kx-contact-form-card">
              <div className="kx-pie-section-label">Message</div>
              <h2>Envoyez une demande claire.</h2>
              <p>
                Ce formulaire est prêt côté interface. La connexion backend sera câblée dans le chantier technique dédié.
              </p>
              <ContactForm />
            </div>

            <aside className="kx-contact-side-card">
              <div>
                <Mail size={24} />
                <h3>Email officiel</h3>
                <p>{KORYXA_CONTACT.email}</p>
                <a href={`mailto:${KORYXA_CONTACT.email}`}>Écrire par email →</a>
              </div>
              <div>
                <Phone size={24} />
                <h3>WhatsApp officiel</h3>
                <p>{KORYXA_CONTACT.phoneDisplay}</p>
                <a href={KORYXA_CONTACT.whatsappUrl} target="_blank" rel="noreferrer">Ouvrir WhatsApp →</a>
              </div>
              <div>
                <Mail size={24} />
                <h3>Réseaux officiels</h3>
                <p>Suivre KORYXA sur Facebook, LinkedIn, WhatsApp et email.</p>
                <div className="mt-4">
                  <SocialLinks />
                </div>
              </div>
              <div>
                <UserRoundCog size={24} />
                <h3>Compte KORYXA</h3>
                <p>Un seul compte pour accéder à l’écosystème KORYXA et retrouver tes produits.</p>
                <a href={KORYXA_ACCOUNT_URL}>Accéder à mon compte →</a>
              </div>
              <div>
                <Building2 size={24} />
                <h3>Partenaires</h3>
                <p>Les demandes de collaboration sont orientées vers Partner Portal.</p>
                <Link href={PUBLIC_ROUTES.partenaires}>Voir la page partenaires →</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="kx-pie-cta-section">
        <div className="kx-pie-container">
          <div className="kx-pie-section-label">Orientation</div>
          <h2>Vous voulez d’abord comprendre où aller ?</h2>
          <p>La page Cas d’usage permet de partir du besoin et d’être orienté vers le bon espace.</p>
          <div className="kx-pie-cta-btns">
            <Link href={PUBLIC_ROUTES.casUsage} className="kx-pie-btn kx-pie-btn-gold">
              Voir les cas d’usage
            </Link>
            <Link href={PUBLIC_ROUTES.produits} className="kx-pie-btn kx-pie-btn-outline-white">
              Voir les produits
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
