"use client";

import { useState } from "react";

const CONTACT_REASONS = ["Partenariat", "Produit", "Compte KORYXA", "Presse", "Autre demande"];

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
  reason: "Partenariat",
  message: "",
  company: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "" });
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
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) throw new Error(payload?.message || "Impossible d'envoyer le message.");
      setForm(initialForm);
      setStatus({ type: "success", message: payload?.message || "Message envoyé à KORYXA." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Erreur d'envoi." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="kx-contact-form" onSubmit={submitContact}>
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

      <div className="kx-contact-field-grid">
        <label>
          <span>Nom</span>
          <input
            name="name"
            placeholder="Votre nom"
            required
            minLength={2}
            maxLength={120}
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </label>
        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            placeholder="vous@email.com"
            required
            maxLength={180}
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
      </div>

      <div className="kx-contact-field-grid">
        <label>
          <span>WhatsApp / téléphone</span>
          <input
            name="phone"
            placeholder="+228 92 09 25 72"
            maxLength={60}
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </label>
        <label>
          <span>Motif</span>
          <select name="reason" value={form.reason} onChange={(event) => updateField("reason", event.target.value)}>
            {CONTACT_REASONS.map((reason) => (
              <option key={reason}>{reason}</option>
            ))}
          </select>
        </label>
      </div>

      <label>
        <span>Message</span>
        <textarea
          name="message"
          rows={6}
          placeholder="Décrivez votre demande..."
          required
          minLength={10}
          maxLength={4000}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </label>

      {status.message ? (
        <div
          role="status"
          className={
            status.type === "success"
              ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
              : "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
          }
        >
          {status.message}
        </div>
      ) : null}

      <button type="submit" disabled={submitting} className="kx-pie-btn kx-pie-btn-primary disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? "Envoi en cours…" : "Envoyer à KORYXA"}
      </button>
    </form>
  );
}
