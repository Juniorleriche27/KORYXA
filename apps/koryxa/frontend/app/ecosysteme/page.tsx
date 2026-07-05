import Link from "next/link";
import { PUBLIC_ROUTES } from "@/config/routes";

export default function EcosystemePage() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-950 px-6 py-14 text-white shadow-[0_28px_90px_rgba(2,6,23,0.32)] sm:px-10 lg:px-14">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-300">Écosystème KORYXA</p>
      <h1 className="kx-display mt-5 max-w-4xl text-4xl font-semibold leading-none tracking-[-0.06em] sm:text-6xl">
        Un écosystème IA autonome, connecté par KORYXA.
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
        Cette page devient l’écran dédié à l’architecture KORYXA : vitrine, compte central, produits autonomes,
        APIs, partenaires et orchestration.
      </p>
      <Link href={PUBLIC_ROUTES.produits} className="mt-8 inline-flex rounded-full bg-sky-300 px-5 py-3 text-sm font-bold text-slate-950">
        Voir les produits
      </Link>
    </section>
  );
}
