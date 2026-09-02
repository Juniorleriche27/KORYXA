"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

const CONTACT_REASONS = [
  "Partenariat & Déploiement B2B",
  "Support Solutions & Produits",
  "Compte KORYXA & Identité",
  "Presse & Relations Médias",
  "Autre demande",
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
  company: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  reason: "Partenariat & Déploiement B2B",
  message: "",
  company: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) throw new Error(payload?.message || "Impossible d'envoyer le message.");
      setForm(initialForm);
      setStatus({
        type: "success",
        message: payload?.message || "Votre message a été transmis avec succès à l'équipe KORYXA. Nous vous répondrons sous 24h ouvrées.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer ou nous écrire par email.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={submitContact}>
      {/* Honeypot field */}
      <div className="hidden" aria-hidden="true">
        <label>
          <span>Entreprise</span>
          <input
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Nom complet *
          </label>
          <input
            name="name"
            placeholder="Ex : Sarah Traoré"
            required
            minLength={2}
            maxLength={120}
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-[#00a86b] focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-slate-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Adresse email professionnelle *
          </label>
          <input
            name="email"
            type="email"
            placeholder="vous@organisation.com"
            required
            maxLength={180}
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-[#00a86b] focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Téléphone / WhatsApp
          </label>
          <input
            name="phone"
            placeholder="+228 92 09 25 72"
            maxLength={60}
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-[#00a86b] focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-slate-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Motif d'échange *
          </label>
          <select
            name="reason"
            value={form.reason}
            onChange={(event) => updateField("reason", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 shadow-sm focus:border-[#00a86b] focus:outline-none dark:border-white/15 dark:bg-[#0d2818] dark:text-white"
          >
            {CONTACT_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          Votre message *
        </label>
        <textarea
          name="message"
          rows={5}
          placeholder="Décrivez votre projet, vos objectifs ou vos questions..."
          required
          minLength={10}
          maxLength={4000}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-[#00a86b] focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-slate-500"
        />
      </div>

      {status.message ? (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-2xl border p-4 text-xs sm:text-sm font-semibold ${
            status.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span>{status.message}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-[#008b58] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        <span>{submitting ? "Transmission en cours…" : "Envoyer mon message"}</span>
      </button>
    </form>
  );
}
