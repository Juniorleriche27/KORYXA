import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions legales | KORYXA",
  description:
    "Cadre legal KORYXA, informations d'edition, d'hebergement et conditions generales d'utilisation.",
  openGraph: {
    title: "Mentions legales | KORYXA",
    description:
      "Cadre legal KORYXA, informations d'edition, d'hebergement et conditions generales d'utilisation.",
    url: "/legal/mentions",
  },
  twitter: {
    title: "Mentions legales | KORYXA",
    description:
      "Cadre legal KORYXA, informations d'edition, d'hebergement et conditions generales d'utilisation.",
  },
};

const LEGAL_SECTIONS = [
  "Informations sur l'edition et l'hebergement",
  "Conditions generales d'utilisation",
  "Cadre de confidentialite detaille",
];

export default function TermsPage() {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-[34px] border border-slate-200/80 bg-white dark:bg-[#07190f] dark:border-[#234b33] p-6 shadow-[0_20px_54px_rgba(15,23,42,0.07)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#008b58] dark:text-[#4ade80]">Mentions légales</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl">
            Le cadre légal doit rester aussi lisible que le produit.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
            Cette page rassemble le cadre juridique, l'édition, l'hébergement et les conditions générales qui structurent la plateforme KORYXA.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {LEGAL_SECTIONS.map((item) => (
            <article
              key={item}
              className="rounded-[26px] border border-slate-200/80 bg-white/94 dark:bg-[#07190f] dark:border-[#234b33] p-5 shadow-[0_16px_34px_rgba(15,23,42,0.06)]"
            >
              <p className="text-sm font-semibold leading-6 text-slate-800 dark:text-slate-200">{item}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[30px] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_22px_54px_rgba(15,23,42,0.2)] sm:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Pages associées</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Vous pouvez également consulter la politique de confidentialité ou contacter nos équipes officielles.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/privacy" className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Confidentialité
            </Link>
            <Link href="/contact" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              Contact officiel
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
