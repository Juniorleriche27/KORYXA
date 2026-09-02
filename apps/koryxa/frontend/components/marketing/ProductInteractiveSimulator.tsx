"use client";

import React, { useState } from "react";
import {
  Sliders,
  TrendingUp,
  Zap,
  ShieldCheck,
  Bot,
  MessageSquare,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  FileText,
} from "lucide-react";
import type { ProductInfo } from "@/app/produits/data";

type Props = {
  product: ProductInfo;
};

export default function ProductInteractiveSimulator({ product }: Props) {
  const type = product.simulatorType || "general";

  // State for Finance Simulator
  const [volumeFcfa, setVolumeFcfa] = useState<number>(3500000);

  // State for CRM Simulator
  const [leadsCount, setLeadsCount] = useState<number>(450);

  // State for ChatLAYA Scenario
  const [chatScenario, setChatScenario] = useState<number>(0);

  // State for Formation Track
  const [formationTrack, setFormationTrack] = useState<number>(0);

  // State for API Language
  const [apiLang, setApiLang] = useState<"curl" | "python" | "ts">("curl");
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. FINANCE SIMULATOR (MERQALOR)
  if (type === "finance-cashflow") {
    const hoursSaved = Math.round((volumeFcfa / 1000000) * 4.5 + 8);
    const reconciliations = Math.round((volumeFcfa / 25000) * 1.2);
    const feeOptimized = Math.round(volumeFcfa * 0.012);

    return (
      <div className="w-full max-w-full min-w-0 overflow-hidden rounded-3xl border border-[#00a86b]/30 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-[#234b33] dark:bg-[#07190f]/95">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#008b58] dark:text-[#86efac] uppercase tracking-wider">
              <Sliders className="h-4 w-4" />
              <span>Simulateur d’Impact Trésorerie Live</span>
            </div>
            <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Estimez vos gains de temps et de contrôle avec {product.name}
            </h3>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-[#00a86b]/10 px-3 py-1 text-xs font-bold text-[#008b58] dark:bg-[#00a86b]/20 dark:text-[#86efac]">
            Temps Réel
          </span>
        </div>

        <div className="mt-8 space-y-6">
          {/* Slider input */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
              <span>Volume mensuel Mobile Money & Banques :</span>
              <span className="font-serif text-base sm:text-lg text-[#00a86b] dark:text-[#4ade80]">
                {volumeFcfa.toLocaleString("fr-FR")} FCFA / mois
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={25000000}
              step={250000}
              value={volumeFcfa}
              onChange={(e) => setVolumeFcfa(Number(e.target.value))}
              aria-label="Volume mensuel Mobile Money et Banques"
              className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-white/15 accent-[#00a86b]"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>500k FCFA</span>
              <span>12.5M FCFA</span>
              <span>25M+ FCFA</span>
            </div>
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-[#f4fbf7] dark:border-white/10 dark:bg-white/5 p-4 text-center sm:text-left">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Temps administratif économisé
              </span>
              <span className="mt-1 block font-serif text-2xl sm:text-3xl font-bold text-[#00a86b] dark:text-[#4ade80]">
                ~{hoursSaved} h
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">par mois sans saisie manuelle</span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-[#f4fbf7] dark:border-white/10 dark:bg-white/5 p-4 text-center sm:text-left">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Rapprochements auto
              </span>
              <span className="mt-1 block font-serif text-2xl sm:text-3xl font-bold text-[#00a86b] dark:text-[#4ade80]">
                ~{reconciliations}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">transactions Wave & OM catégorisées</span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-[#f4fbf7] dark:border-white/10 dark:bg-white/5 p-4 text-center sm:text-left">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Horizon Prédictif IA
              </span>
              <span className="mt-1 block font-serif text-2xl sm:text-3xl font-bold text-[#00a86b] dark:text-[#4ade80]">
                90 Jours
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">alertes anticipées de trésorerie</span>
            </div>
          </div>

          {/* AI Advisor Simulation Quote */}
          <div className="rounded-2xl border border-[#00a86b]/20 bg-white dark:bg-black/20 p-4 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00a86b]/15 text-[#00a86b] dark:text-[#4ade80]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Aperçu Conseil IA MERQALOR :</span>
              <p className="mt-0.5 text-slate-600 dark:text-slate-300 italic">
                « Flux récurrents analysés : vos encaissements Wave du vendredi couvrent vos charges fixes du 28. Potentiel d'optimisation de frais de retrait estimé à {feeOptimized.toLocaleString("fr-FR")} FCFA. »
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. CRM & AUTOPILOT SIMULATOR (FlowCore / Cora)
  if (type === "crm-autopilot") {
    const autoReplies = Math.round(leadsCount * 0.94);
    const convertedLeads = Math.round(leadsCount * 0.28);
    const savedHours = Math.round(leadsCount * 0.35);

    return (
      <div className="w-full max-w-full min-w-0 overflow-hidden rounded-3xl border border-[#8b5cf6]/30 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-[#8b5cf6]/30 dark:bg-[#07190f]/95">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8b5cf6] dark:text-[#c4b5fd] uppercase tracking-wider">
              <Zap className="h-4 w-4" />
              <span>Simulateur de Cadence Commerciale</span>
            </div>
            <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Automatisation Autopilot 24/7 de vos prospects
            </h3>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-[#8b5cf6]/10 px-3 py-1 text-xs font-bold text-[#8b5cf6] dark:bg-[#8b5cf6]/20 dark:text-[#c4b5fd]">
            Passerelle WhatsApp & Email
          </span>
        </div>

        <div className="mt-8 space-y-6">
          {/* Slider input */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
              <span>Nombre de prospects à traiter par mois :</span>
              <span className="font-serif text-base sm:text-lg text-[#8b5cf6] dark:text-[#c4b5fd]">
                {leadsCount} prospects / mois
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={3000}
              step={50}
              value={leadsCount}
              onChange={(e) => setLeadsCount(Number(e.target.value))}
              aria-label="Nombre de prospects à traiter par mois"
              className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-white/15 accent-[#8b5cf6]"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>50 leads</span>
              <span>1 500 leads</span>
              <span>3 000+ leads</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-[#faf8ff] dark:border-white/10 dark:bg-white/5 p-4 text-center sm:text-left">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Temps de Réponse Moyen
              </span>
              <span className="mt-1 block font-serif text-2xl sm:text-3xl font-bold text-[#8b5cf6] dark:text-[#c4b5fd]">
                &lt; 8 sec
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">contre 3h en traitement manuel</span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-[#faf8ff] dark:border-white/10 dark:bg-white/5 p-4 text-center sm:text-left">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Qualifications Autopilot
              </span>
              <span className="mt-1 block font-serif text-2xl sm:text-3xl font-bold text-[#8b5cf6] dark:text-[#c4b5fd]">
                ~{autoReplies}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">prospects engagés & scorés</span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-[#faf8ff] dark:border-white/10 dark:bg-white/5 p-4 text-center sm:text-left">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Gain temps commercial
              </span>
              <span className="mt-1 block font-serif text-2xl sm:text-3xl font-bold text-[#8b5cf6] dark:text-[#c4b5fd]">
                ~{savedHours} h
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">libérées pour conclure les ventes</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. CONVERSATION & FOUNDER SIMULATOR (ChatLAYA)
  if (type === "conversation-founder") {
    const scenarios = [
      {
        title: "Cadrage de Projet & Business Model",
        prompt: "Cadre une marketplace B2B de distribution agro-alimentaire à Abidjan avec flux Mobile Money et logistique locale.",
        output: "Synthèse structurée : Proposition de valeur, architecture des flux de paiement (Wave/OM), matrice des coûts logistiques et modèle de monétisation en commission dégressive.",
        tag: "Founder Lab",
      },
      {
        title: "Analyse Stratégique & Réglementaire",
        prompt: "Quels sont les points de vigilance juridiques OHADA pour un contrat de prestation SaaS en Afrique de l'Ouest ?",
        output: "Checklist de conformité : Juridiction compétente, clauses de propriété intellectuelle sur les modèles d'IA, protection des données personnelles et conditions de SLA.",
        tag: "Juridique & Stratégie",
      },
      {
        title: "Rédaction Institutionnelle & Pitch",
        prompt: "Rédige une note de synthèse pour un comité d'investissement sur l'impact de l'IA dans l'inclusion financière régionale.",
        output: "Document exécutif : Résumé pour décideurs, indicateurs de pénétration Mobile Money (85%), leviers de productivité (+40%) et feuille de route opérationnelle.",
        tag: "Exécutif & Pitch",
      },
    ];

    const current = scenarios[chatScenario];

    return (
      <div className="w-full max-w-full min-w-0 overflow-hidden rounded-3xl border border-[#06b6d4]/30 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-[#06b6d4]/30 dark:bg-[#07190f]/95">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#06b6d4] dark:text-[#67e8f9] uppercase tracking-wider">
              <Bot className="h-4 w-4" />
              <span>Démonstrateur IA Conversationnelle Souveraine</span>
            </div>
            <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Découvrez la précision des réponses adaptées au contexte
            </h3>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-[#06b6d4]/10 px-3 py-1 text-xs font-bold text-[#06b6d4] dark:bg-[#06b6d4]/20 dark:text-[#67e8f9]">
            Contexte Souverain
          </span>
        </div>

        {/* Scenario Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          {scenarios.map((sc, i) => (
            <button
              key={sc.title}
              type="button"
              onClick={() => setChatScenario(i)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                chatScenario === i
                  ? "bg-[#06b6d4] text-white shadow-md scale-102"
                  : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>

        {/* Live dialogue box */}
        <div className="mt-6 space-y-3 rounded-2xl border border-slate-100 bg-[#f4fcfe] dark:border-white/10 dark:bg-black/20 p-5">
          <div className="flex items-start gap-3">
            <span className="rounded-md bg-slate-200 dark:bg-white/10 px-2 py-1 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
              VOUS
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">
              « {current.prompt} »
            </p>
          </div>

          <div className="border-t border-slate-200/60 dark:border-white/10 pt-3 flex items-start gap-3">
            <span className="rounded-md bg-[#06b6d4] px-2 py-1 text-[10px] font-mono font-bold text-white shrink-0">
              ChatLAYA
            </span>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              <p>{current.output}</p>
              <div className="mt-3 flex items-center gap-3 text-[11px] font-bold text-[#06b6d4] dark:text-[#67e8f9]">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Export PDF / Markdown
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Espace Founder Actif
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. TRAINING & CERTIFICATION SIMULATOR (Formation & NeuroKap)
  if (type === "training-cert") {
    const tracks = [
      {
        title: "Python Data Analyst & IA",
        duration: "8 Semaines",
        projects: "4 Projets Réels (Prévision de séries temporelles, scoring Mobile Money)",
        skills: ["Pandas & NumPy", "Data Cleaning", "Visualisation Streamlit", "Scikit-Learn"],
      },
      {
        title: "Prompt Engineering & Agents IA",
        duration: "6 Semaines",
        projects: "3 Projets Réels (Agent support WhatsApp, Synthétiseur documentaire RAG)",
        skills: ["Ingénierie de Prompt", "Frameworks RAG", "API OpenAI & KORYXA", "Évaluation LLM"],
      },
      {
        title: "Automatisation & Workflows n8n",
        duration: "4 Semaines",
        projects: "3 Projets Réels (Synchronisation CRM, facturation automatique)",
        skills: ["n8n & Make", "Webhooks & API REST", "Logique de routage", "Intégrations ERP"],
      },
    ];

    const currentTrack = tracks[formationTrack];

    return (
      <div className="w-full max-w-full min-w-0 overflow-hidden rounded-3xl border border-[#eab308]/30 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-[#eab308]/30 dark:bg-[#07190f]/95">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ca8a04] dark:text-[#fde047] uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              <span>Simulateur de Parcours Certifiant</span>
            </div>
            <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Visualisez votre montée en compétences pratique
            </h3>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-[#eab308]/15 px-3 py-1 text-xs font-bold text-[#ca8a04] dark:bg-[#eab308]/20 dark:text-[#fde047]">
            Certification Reconnue
          </span>
        </div>

        {/* Track selector */}
        <div className="mt-6 flex flex-wrap gap-2">
          {tracks.map((t, idx) => (
            <button
              key={t.title}
              type="button"
              onClick={() => setFormationTrack(idx)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                formationTrack === idx
                  ? "bg-[#ca8a04] text-white shadow-md scale-102"
                  : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Details */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-[#fffdf0] dark:border-white/10 dark:bg-white/5 p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Durée & Projets
            </span>
            <span className="mt-1 block font-serif text-lg font-bold text-[#ca8a04] dark:text-[#fde047]">
              {currentTrack.duration}
            </span>
            <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
              {currentTrack.projects}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-[#fffdf0] dark:border-white/10 dark:bg-white/5 p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Compétences Clés Acquises
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {currentTrack.skills.map((s) => (
                <span key={s} className="rounded-md bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 px-2 py-0.5 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. API CONSOLE & CODE SNIPPET (KORYXA API & Partner Portal)
  const codeSnippets = {
    curl: `curl -X POST https://api.koryxa.fr/v1/orchestration/infer \\
  -H "Authorization: Bearer kx_live_sec_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "koryxa-sovereign-v2",
    "prompt": "Analyser la tendance des transactions Wave",
    "stream": false
  }'`,
    python: `import requests

url = "https://api.koryxa.fr/v1/orchestration/infer"
headers = {"Authorization": "Bearer kx_live_sec_..."}
payload = {
    "model": "koryxa-sovereign-v2",
    "prompt": "Analyser la tendance des transactions Wave",
    "stream": False
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    ts: `import { KoryxaClient } from "@koryxa/sdk";

const client = new KoryxaClient({ apiKey: process.env.KORYXA_API_KEY });

const result = await client.infer({
  model: "koryxa-sovereign-v2",
  prompt: "Analyser la tendance des transactions Wave",
});
console.log(result.data);`,
  };

  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-[#07190f]/95">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00a86b] dark:text-[#4ade80] uppercase tracking-wider">
            <Code2 className="h-4 w-4" />
            <span>Console & SDK Développeur</span>
          </div>
          <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Intégrez {product.name} en quelques lignes de code
          </h3>
        </div>

        {/* Code tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-black/30">
          {(["curl", "python", "ts"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setApiLang(lang)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition ${
                apiLang === lang
                  ? "bg-[#00a86b] text-white shadow-sm"
                  : "text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Code Block */}
      <div className="relative mt-6 rounded-2xl bg-slate-950 p-4 text-xs font-mono text-emerald-400 overflow-x-auto shadow-inner">
        <button
          type="button"
          onClick={() => handleCopy(codeSnippets[apiLang])}
          className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-white/20"
          aria-label="Copier le code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#4ade80]" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copié" : "Copier"}</span>
        </button>
        <pre className="pr-16 leading-relaxed whitespace-pre font-mono text-xs">
          {codeSnippets[apiLang]}
        </pre>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#00a86b]" />
          <span>Authentification sécurisée par bearer token & mTLS</span>
        </div>
        <span className="font-mono text-[11px] font-semibold text-[#00a86b] dark:text-[#4ade80]">
          Latence &lt; 25ms SLA 99.95%
        </span>
      </div>
    </div>
  );
}
