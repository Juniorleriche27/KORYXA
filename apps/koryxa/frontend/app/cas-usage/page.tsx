import Link from "next/link";
import { PUBLIC_ROUTES } from "@/config/routes";

const useCases = [
  "Discuter avec une IA",
  "Accéder à mon compte KORYXA",
  "Utiliser un produit autonome",
  "Former ou accompagner des talents",
  "Connecter une organisation",
  "Utiliser une API",
  "Devenir partenaire",
  "Lancer un projet IA",
];

export default function CasUsagePage() {
  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-slate-200/80 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-600">Cas d’usage</p>
        <h1 className="kx-display mt-4 max-w-4xl text-4xl font-semibold leading-none tracking-[-0.06em] text-slate-950 sm:text-6xl">
          Trouvez le bon produit KORYXA selon votre besoin.
        </h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {useCases.map((item) => (
          <article key={item} className="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-700 shadow-sm">
            {item}
          </article>
        ))}
      </div>
      <Link href={PUBLIC_ROUTES.produits} className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">
        Explorer les produits
      </Link>
    </section>
  );
}
