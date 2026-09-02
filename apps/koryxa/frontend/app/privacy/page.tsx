import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Confidentialite | KORYXA",
  description:
    "Principes de confidentialite KORYXA sur la collecte, l'usage et la protection des donnees.",
  openGraph: {
    title: "Confidentialite | KORYXA",
    description:
      "Principes de confidentialite KORYXA sur la collecte, l'usage et la protection des donnees.",
    url: "/legal/confidentialite",
  },
  twitter: {
    title: "Confidentialite | KORYXA",
    description:
      "Principes de confidentialite KORYXA sur la collecte, l'usage et la protection des donnees.",
  },
};

const PRIVACY_POINTS = [
  "KORYXA collecte uniquement les donnees utiles au fonctionnement du produit et a son amelioration.",
  "Les metriques techniques servent a comprendre les usages, pas a exposer inutilement des informations sensibles.",
  "Les preferences de contact, de notifications et de compte doivent rester lisibles et contrôlables.",
];

export default function PrivacyPage() {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-[34px] border border-slate-200/80 bg-white dark:bg-[#07190f] dark:border-[#234b33] p-6 shadow-[0_20px_54px_rgba(15,23,42,0.07)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#008b58] dark:text-[#4ade80]">Confidentialité</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl">
            Une politique simple, lisible et proportionnée.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
            KORYXA applique des standards stricts de protection et de souveraineté des données pour l'ensemble des utilisateurs et entreprises de son écosystème.
          </p>
        </section>

        <section className="rounded-[30px] border border-slate-200/80 bg-white/94 dark:bg-[#07190f] dark:border-[#234b33] p-6 shadow-[0_18px_46px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="grid gap-4">
            {PRIVACY_POINTS.map((item, index) => (
              <article
                key={item}
                className="rounded-[24px] border border-slate-200/80 bg-slate-50 dark:bg-white/5 dark:border-white/10 p-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">Point {index + 1}</p>
                <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_22px_54px_rgba(15,23,42,0.2)] sm:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Continuer la lecture</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Pour comprendre le cadre global du produit, vous pouvez revenir à la présentation générale ou nous contacter directement.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/a-propos" className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              À propos de KORYXA
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
