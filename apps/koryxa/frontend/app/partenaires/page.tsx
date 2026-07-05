import Link from "next/link";
import { KORYXA_ACCOUNT_URL, PUBLIC_ROUTES } from "@/config/routes";

export default function PartenairesPage() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,#020617_0%,#0f172a_58%,#075985_100%)] px-6 py-14 text-white shadow-[0_28px_90px_rgba(2,6,23,0.32)] sm:px-10 lg:px-14">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-300">Partenaires</p>
      <h1 className="kx-display mt-5 max-w-4xl text-4xl font-semibold leading-none tracking-[-0.06em] sm:text-6xl">
        Construire l’écosystème IA africain avec KORYXA.
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
        Entreprises, institutions, écoles, communautés, startups et organisations terrain disposent d’une porte d’entrée claire.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={PUBLIC_ROUTES.contact} className="rounded-full bg-sky-300 px-5 py-3 text-sm font-bold text-slate-950">Devenir partenaire</Link>
        <a href={KORYXA_ACCOUNT_URL} className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white">Compte KORYXA</a>
      </div>
    </section>
  );
}
