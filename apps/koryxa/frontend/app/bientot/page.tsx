import Link from "next/link";

export default function BientotDisponiblePage() {
  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-[#07190f]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#008b58] dark:text-[#4ade80]">KORYXA</p>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Bientôt disponible</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Cette section sera active dans une prochaine version.
        </p>
        <Link href="/produits" className="btn-secondary mt-6 inline-flex">Retour aux Produits</Link>
      </div>
    </div>
  );
}
