import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Mail, Megaphone, MessageSquare, PackageCheck, Phone, ShieldCheck, UserRoundCog } from "lucide-react";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { KORYXA_CONTACT } from "@/config/contact";
import { ContactForm } from "./ContactForm";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Contact KORYXA | Équipe Officielle, Partenariats et Support",
  description:
    "Contactez l'équipe KORYXA par email, WhatsApp ou via notre formulaire officiel pour vos partenariats, questions produits ou accès compte.",
};

const contactReasons = [
  {
    icon: Building2,
    title: "Partenariat & Déploiement B2B",
    description: "Entreprises, institutions publiques, universités, incubateurs ou partenaires techniques.",
  },
  {
    icon: PackageCheck,
    title: "Support Solutions & Produits",
    description: "Questions sur MERQALOR, FlowCore, ChatLAYA, CoraBiz, la Formation ou nos APIs.",
  },
  {
    icon: UserRoundCog,
    title: "Compte KORYXA & Identité",
    description: "Accès à vos espaces, gestion de vos abonnements ou configuration multi-tenant.",
  },
  {
    icon: Megaphone,
    title: "Presse & Relations Médias",
    description: "Demandes d'interviews, dossier de presse et prises de parole officielles.",
  },
];

export default function ContactPage() {
  return (
    <main className="kx-pie-page kx-contact-page">
      {/* 1. Hero Section — Centered & Clean */}
      <section className="kx-contact-hero relative overflow-hidden text-center py-16 sm:py-24">
        <div className="kx-pie-blob kx-pie-blob-one" />
        <div className="kx-pie-blob kx-pie-blob-two" />

        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center">
          <div className="kx-pie-badge inline-flex items-center justify-center gap-2 mb-6">
            <span className="kx-pie-dot" />
            <span>Équipe Officielle KORYXA</span>
          </div>

          <h1 className="max-w-4xl mx-auto font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Contactez les équipes KORYXA.
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-[#e2f5ea] leading-relaxed">
            Que vous souhaitiez déployer nos technologies, explorer un partenariat institutionnel ou obtenir une assistance sur vos espaces, nous nous engageons à vous répondre dans les plus brefs délais.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <a
              href={`mailto:${KORYXA_CONTACT.email}`}
              className="kx-pie-btn kx-pie-btn-gold w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-bold"
            >
              Écrire par email
              <ArrowRight size={18} />
            </a>
            <a
              href={KORYXA_CONTACT.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="kx-pie-btn kx-pie-btn-outline-white w-full sm:w-auto inline-flex items-center justify-center text-sm font-bold"
            >
              WhatsApp Officiel
            </a>
          </div>
        </div>
      </section>

      {/* 2. Contact Channels & Reasons Section */}
      <section className="py-20 sm:py-28 bg-[#faf9f5] dark:bg-[#07140c] text-slate-900 dark:text-white transition-colors duration-200">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
              Orientation Rapide
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-serif tracking-tight">
              Pour quel motif souhaitez-vous échanger ?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Chaque demande est directement transmise aux spécialistes dédiés.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <article
                  key={reason.title}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-white/95 dark:bg-[#07190f]/90 p-6 sm:p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#00a86b]"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80] mb-5">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                      {reason.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Form & Direct Cards Section */}
      <section className="py-20 sm:py-28 bg-white dark:bg-[#050b08] text-slate-900 dark:text-white transition-colors duration-200">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] items-start">
            {/* Left: Contact Form Card */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-[#faf9f5] dark:bg-[#07190f]/90 p-8 sm:p-10 shadow-md">
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#008b58] dark:text-[#4ade80]">
                Message Direct
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold font-serif tracking-tight">
                Transmettez votre demande
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-8">
                Remplissez les informations ci-dessous et notre équipe vous recontactera sous 24h ouvrées.
              </p>

              <ContactForm />
            </div>

            {/* Right: Direct Coordinates */}
            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-white/95 dark:bg-[#07190f]/90 p-7 shadow-sm">
                <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold">Email Officiel</h3>
                    <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{KORYXA_CONTACT.email}</p>
                  </div>
                </div>
                <a
                  href={`mailto:${KORYXA_CONTACT.email}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#00a86b] dark:text-[#4ade80] hover:underline"
                >
                  Envoyer un email directement →
                </a>
              </div>

              <div className="rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-white/95 dark:bg-[#07190f]/90 p-7 shadow-sm">
                <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold">WhatsApp & Ligne Directe</h3>
                    <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{KORYXA_CONTACT.phoneDisplay}</p>
                  </div>
                </div>
                <a
                  href={KORYXA_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#00a86b] dark:text-[#4ade80] hover:underline"
                >
                  Ouvrir la conversation WhatsApp →
                </a>
              </div>

              <div className="rounded-3xl border border-slate-200/90 dark:border-[#234b33] bg-white/95 dark:bg-[#07190f]/90 p-7 shadow-sm">
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white mb-2">
                  Canaux & Réseaux Officiels
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Suivez les actualités et déploiements KORYXA sur nos plateformes officielles.
                </p>
                <SocialLinks compact />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
