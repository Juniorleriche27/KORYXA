"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Users, Target, Package, DollarSign, BarChart2, MessageCircle, FileText,
  Check, RotateCcw, ArrowRight, X, Sparkles, ChevronLeft,
  Copy, Download, BookOpen, PenLine, AlertCircle, UserRound, Menu, Archive,
  MessageSquarePlus, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { CHATLAYA_AUTONOMOUS_HOST, getChatlayaApiBase } from "@/lib/env";
import {
  archiveFounderProject,
  createFounderProject,
  getFounderProject,
  listFounderProjects,
  runFounderCadrageAgent,
  runFounderClientProblemAgent,
  runFounderOfferValueAgent,
  updateFounderProject,
  type FounderCadrageAnalysis,
  type FounderClientProblemAnalysis,
  type FounderOfferValueAnalysis,
  type FounderProject,
} from "@/lib/api-client/chatlaya-founder";

function apiUrl(path: string): string {
  return `${getChatlayaApiBase().replace(/\/$/, "")}${path}`;
}

const FOUNDER_AUTH_REDIRECT = `https://${CHATLAYA_AUTONOMOUS_HOST}/`;

function resolveFounderAuthHref(path: "/login" | "/signup", fallback?: string): string {
  if (typeof window !== "undefined") {
    try {
      const currentUrl = new URL(window.location.href);
      currentUrl.hash = "";
      const redirectTarget =
        currentUrl.hostname === CHATLAYA_AUTONOMOUS_HOST
          ? currentUrl.toString()
            : currentUrl.pathname.startsWith("/chatlaya")
              ? `${currentUrl.pathname}${currentUrl.search}`
              : FOUNDER_AUTH_REDIRECT;
      return `/chatlaya/auth${path}?redirect=${encodeURIComponent(redirectTarget)}`;
    } catch {
      // Fall through to the server-safe fallback below.
    }
  }
  return fallback || `/chatlaya/auth${path}?redirect=${encodeURIComponent(FOUNDER_AUTH_REDIRECT)}`;
}

function resolveFounderLoginHref(fallback?: string): string {
  return resolveFounderAuthHref("/login", fallback);
}

function resolveFounderSignupHref(fallback?: string): string {
  return resolveFounderAuthHref("/signup", fallback);
}

// ─── Types ──────────────────────────────────────────────────────────────────

type ModuleStatus = "empty" | "in_progress" | "completed";

type InputFieldDef = {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea";
  optional?: boolean;
  rows?: number;
};

type ModuleDef = {
  id: string;
  step: number;
  label: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  inputs: InputFieldDef[];
  optional?: boolean;
};

type ModuleState = {
  inputs: Record<string, string>;
  output: string | null;
  previousOutput?: string | null;
  previousRetention?: string | null;
  status: ModuleStatus;
  retention?: string;
  finalFeedback?: string;
};

type WorkspaceData = Record<string, ModuleState>;

type FounderConversation = {
  conversation_id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
  archived?: boolean;
  assistant_mode?: "general" | "launch_structure_sell";
};

type FounderProjectOwner = {
  guestId?: string | null;
  userId?: string | null;
};

const FOUNDER_GUEST_ID_KEY = "chatlaya_founder_guest_id";
const FOUNDER_DEFAULT_PROJECT_TITLE = "Projet Founder";
const FOUNDER_STEP_BY_MODULE_ID: Record<string, string> = {
  client: "client_cible",
  probleme: "probleme",
  offre: "offre_valeur",
  prix: "prix",
  business_model: "business_model",
  vente: "pitch_vente",
  business_plan: "business_plan",
};
const FOUNDER_MODULE_ID_BY_STEP: Record<string, string> = Object.fromEntries(
  Object.entries(FOUNDER_STEP_BY_MODULE_ID).map(([moduleId, step]) => [step, moduleId]),
);

// ─── Module definitions ─────────────────────────────────────────────────────

const MODULES: ModuleDef[] = [
  {
    id: "client",
    step: 1,
    label: "Client cible",
    tagline: "À qui vous adressez-vous ?",
    description: "Définissez précisément votre client idéal — qui il est, ce qui le motive, comment le trouver.",
    icon: Users,
    inputs: [
      {
        id: "activite",
        label: "Décrivez votre activité en 1-2 phrases",
        placeholder: "Ex : Je propose des formations pour apprendre à créer des vêtements africains modernes depuis chez soi…",
        type: "textarea",
        rows: 2,
      },
      {
        id: "client_idee",
        label: "À qui vendez-vous selon vous ? (soyez précis)",
        placeholder: "Ex : Femmes de 25-45 ans qui veulent créer leur propre marque de mode africaine mais ne savent pas coudre…",
        type: "textarea",
        rows: 2,
      },
    ],
  },
  {
    id: "probleme",
    step: 2,
    label: "Problème",
    tagline: "Quel problème résolvez-vous ?",
    description: "Formulez clairement la douleur de votre client — ce qu'il perd sans votre solution.",
    icon: Target,
    inputs: [
      {
        id: "probleme_idee",
        label: "Quel est le problème principal de votre client ?",
        placeholder: "Ex : Ils veulent se lancer dans la couture africaine mais les formations classiques sont trop chères et éloignées…",
        type: "textarea",
        rows: 3,
      },
    ],
  },
  {
    id: "offre",
    step: 3,
    label: "Offre & Valeur",
    tagline: "Que proposez-vous exactement ?",
    description: "Structurez votre offre et formulez ce que le client gagne ou évite grâce à vous.",
    icon: Package,
    inputs: [
      {
        id: "offre_detail",
        label: "Qu'est-ce que vous proposez exactement ?",
        placeholder: "Ex : Une formation vidéo de 6h + 3 séances live/mois + un kit de démarrage…",
        type: "textarea",
        rows: 2,
      },
      {
        id: "gain_client",
        label: "Que gagne ou évite le client grâce à vous ?",
        placeholder: "Ex : Il crée ses premières tenues en 30 jours sans machine hors de prix et sans se déplacer…",
        type: "textarea",
        rows: 2,
      },
    ],
  },
  {
    id: "prix",
    step: 4,
    label: "Prix",
    tagline: "Combien et comment facturer ?",
    description: "Validez votre stratégie tarifaire et apprenez à tester votre prix rapidement.",
    icon: DollarSign,
    inputs: [
      {
        id: "modele_prix",
        label: "Comment comptez-vous facturer ?",
        placeholder: "Ex : Paiement unique, abonnement mensuel, à la séance, accès à vie…",
        type: "textarea",
        rows: 2,
      },
      {
        id: "niveau_prix",
        label: "Quel niveau de prix envisagez-vous ?",
        placeholder: "Ex : 25 000 FCFA pour la formation complète",
        type: "text",
      },
    ],
  },
  {
    id: "business_model",
    step: 5,
    label: "Business model",
    tagline: "Comment votre activité génère-t-elle de la valeur ?",
    description: "Structurez vos flux de revenus, anticipez vos coûts clés et renforcez la solidité de votre modèle.",
    icon: BarChart2,
    inputs: [
      {
        id: "revenus",
        label: "Comment gagnez-vous de l'argent concrètement ?",
        placeholder: "Ex : Vente de formations, coaching individuel payant, vente de kits couture, affiliation…",
        type: "textarea",
        rows: 3,
      },
    ],
  },
  {
    id: "vente",
    step: 6,
    label: "Pitch & Message de vente",
    tagline: "Comment convaincre et déclencher l'achat ?",
    description: "Transformez votre cadrage en pitch clair, discours commercial et messages adaptés à vos canaux.",
    icon: MessageCircle,
    inputs: [
      {
        id: "canal",
        label: "Où vendez-vous ou comptez-vous vendre ?",
        placeholder: "Ex : WhatsApp, Instagram, bouche-à-oreille, marché physique, TikTok…",
        type: "text",
      },
    ],
  },
  {
    id: "business_plan",
    step: 7,
    label: "Business plan",
    tagline: "Votre plan complet sur 12 mois",
    description: "Synthèse structurée de votre projet — vision, marché, modèle, plan d'action et indicateurs clés.",
    icon: FileText,
    optional: true,
    inputs: [
      {
        id: "horizon",
        label: "Sur quel horizon ?",
        placeholder: "Ex : 12 mois",
        type: "text",
        optional: true,
      },
      {
        id: "objectifs",
        label: "Vos objectifs principaux",
        placeholder: "Ex : Atteindre 20 clients payants, générer 200 000 FCFA/mois…",
        type: "textarea",
        rows: 2,
        optional: true,
      },
    ],
  },
];

// Document-appropriate labels for the final deliverable
const DOC_LABELS: Record<string, { title: string; tagline: string }> = {
  client:         { title: "Client idéal",                    tagline: "À qui s'adresse ce projet" },
  probleme:       { title: "Problème central",                tagline: "Ce que nous résolvons" },
  offre:          { title: "Offre & proposition de valeur",   tagline: "Ce que nous apportons" },
  prix:           { title: "Stratégie de prix",               tagline: "Notre modèle tarifaire" },
  business_model: { title: "Modèle économique",               tagline: "Comment nous générons de la valeur" },
  vente:          { title: "Pitch & Message de vente",        tagline: "Notre discours commercial" },
  business_plan:  { title: "Plan d'action",                   tagline: "Feuille de route et priorités" },
};

function founderIsEnglish(locale: string) {
  return locale.toLowerCase().startsWith("en");
}

function localizeModules(locale: string): ModuleDef[] {
  if (!founderIsEnglish(locale)) {
    return MODULES;
  }

  return [
    {
      ...MODULES[0],
      label: "Target customer",
      tagline: "Who are you selling to?",
      description: "Define your ideal customer precisely: who they are, what drives them and how to reach them.",
      inputs: [
        { ...MODULES[0].inputs[0], label: "Describe your business in 1-2 sentences", placeholder: "Example: I offer training courses to help people create modern African fashion from home..." },
        { ...MODULES[0].inputs[1], label: "Who do you think you sell to? (be specific)", placeholder: "Example: Women aged 25-45 who want to launch their own African fashion brand but do not know how to sew..." },
      ],
    },
    {
      ...MODULES[1],
      label: "Problem",
      tagline: "What problem do you solve?",
      description: "Clearly formulate your customer's pain: what they lose without your solution.",
      inputs: [
        { ...MODULES[1].inputs[0], label: "What is your customer's main problem?", placeholder: "Example: They want to get started in African sewing but traditional training is too expensive and too far away..." },
      ],
    },
    {
      ...MODULES[2],
      label: "Offer & Value",
      tagline: "What exactly are you offering?",
      description: "Structure your offer and clarify what the customer gains or avoids thanks to you.",
      inputs: [
        { ...MODULES[2].inputs[0], label: "What exactly are you offering?", placeholder: "Example: A 6-hour video course + 3 live sessions per month + a starter kit..." },
        { ...MODULES[2].inputs[1], label: "What does the customer gain or avoid thanks to you?", placeholder: "Example: They create their first outfits in 30 days without expensive machines and without travelling..." },
      ],
    },
    {
      ...MODULES[3],
      label: "Pricing",
      tagline: "How much and how should you charge?",
      description: "Validate your pricing strategy and learn how to test your price quickly.",
      inputs: [
        { ...MODULES[3].inputs[0], label: "How do you plan to charge?", placeholder: "Example: One-time payment, monthly subscription, per session, lifetime access..." },
        { ...MODULES[3].inputs[1], label: "What price level are you considering?", placeholder: "Example: 25,000 FCFA for the full course" },
      ],
    },
    {
      ...MODULES[4],
      label: "Business model",
      tagline: "How does your business create value?",
      description: "Structure your revenue streams, anticipate key costs and strengthen your business model.",
      inputs: [
        { ...MODULES[4].inputs[0], label: "How do you make money in practice?", placeholder: "Example: Selling courses, paid one-to-one coaching, sewing kits, affiliate revenue..." },
      ],
    },
    {
      ...MODULES[5],
      label: "Pitch & Sales message",
      tagline: "How do you convince and trigger purchase?",
      description: "Turn your framing into a clear pitch, sales message and channel-adapted messaging.",
      inputs: [
        { ...MODULES[5].inputs[0], label: "Where do you sell or plan to sell?", placeholder: "Example: WhatsApp, Instagram, word of mouth, physical market, TikTok..." },
      ],
    },
    {
      ...MODULES[6],
      label: "Business plan",
      tagline: "Your full 12-month plan",
      description: "A structured synthesis of your project: vision, market, business model, action plan and key indicators.",
      inputs: [
        { ...MODULES[6].inputs[0], label: "What time horizon?", placeholder: "Example: 12 months" },
        { ...MODULES[6].inputs[1], label: "Your main goals", placeholder: "Example: Reach 20 paying clients, generate 200,000 FCFA/month..." },
      ],
    },
  ];
}

function localizeDocLabels(locale: string): Record<string, { title: string; tagline: string }> {
  if (!founderIsEnglish(locale)) {
    return DOC_LABELS;
  }

  return {
    client: { title: "Ideal customer", tagline: "Who this project is for" },
    probleme: { title: "Core problem", tagline: "What we solve" },
    offre: { title: "Offer & value proposition", tagline: "What we bring" },
    prix: { title: "Pricing strategy", tagline: "Our pricing model" },
    business_model: { title: "Business model", tagline: "How we create value" },
    vente: { title: "Pitch & sales message", tagline: "Our commercial narrative" },
    business_plan: { title: "Action plan", tagline: "Roadmap and priorities" },
  };
}

function founderUi(locale: string) {
  if (!founderIsEnglish(locale)) {
    return {
      newConversation: "Nouvelle conversation",
      loadingWorkspace: "Préparation de l'espace Founder...",
      authRequiredTitle: "Connexion requise pour Founder",
      authRequiredBody: "Connectez-vous pour retrouver vos dossiers Founder, continuer votre cadrage guidé et exporter votre document final.",
      login: "Se connecter",
      loginNewTab: "Ouvrir la connexion Founder dans un nouvel onglet",
      backGeneral: "Revenir au mode général",
      history: "Historique Founder",
      newFolder: "Nouveau dossier Founder",
      yourConversations: "Vos conversations",
      expandHistory: "Agrandir l'historique",
      collapseHistory: "Réduire l'historique",
      activeFolder: "Dossier actif",
      founderFolder: "Dossier Founder",
      archive: "Archiver",
      generalMode: "Mode général",
      framingBadge: "Espace de cadrage business guidé",
      framingBody: "En 6 étapes, Founder vous aide à clarifier votre client cible, votre problème, votre offre, votre prix, votre modèle de revenus et votre pitch commercial — et à rédiger un dossier projet structuré, exportable à la fin du parcours.",
      bravo: "Félicitations !",
      stepsDone: "Les 6 étapes sont validées. Votre dossier est prêt.",
      finalFolder: "Dossier final",
      revisionTitle: "Mode révision",
      revisionBody: "Modifiez vos réponses ci-dessous et régénérez pour affiner, ou revalidez directement la version existante.",
      starterBadge: "ChatLAYA Founder",
      starterTitle1: "Cadrez votre projet.",
      starterTitle2: "Repartez avec un dossier exploitable.",
      starterBody: "Un coach IA vous accompagne étape par étape pour clarifier votre client, votre problème, votre offre, votre prix, votre modèle économique et votre pitch commercial.",
      deliverableTitle: "Le livrable vendu",
      deliverableBody: "Un dossier projet rédigé dans les mots de l'utilisateur, exportable et présentable à un partenaire, une équipe ou un investisseur.",
      startingPoint: "Point de départ",
      startingTitle: "Décrivez votre projet en quelques phrases.",
      startingBody: "Donnez l'idée, le client visé, ce que vous vendez ou ce que vous voulez lancer. Founder transformera ça en parcours de cadrage.",
      startingPlaceholder: "Ex : Je veux vendre des PC portables performants aux étudiants et jeunes professionnels avec paiement échelonné...",
      preparingFraming: "Préparation de votre cadrage…",
      startFraming: "Commencer le cadrage",
      loginToStart: "Se connecter pour commencer",
      createAccount: "Créer un compte",
      introAfterStart: "Ensuite, cette intro disparaît et vous travaillez étape par étape avec le coach.",
      secureReturn: "Connexion securisee, puis retour direct sur ChatLAYA Founder.",
      founderThinking: "ChatLAYA réfléchit",
      finalizeTitle: "Finalisation du cadrage",
      validated: "validée",
      readyVersion: "version prête",
      toWrite: "à rédiger",
      yourFeedback: "Votre avis ou vos ajouts (optionnel)",
      feedbackPlaceholder: "Ex : garde cette idée, mais précise que je cible surtout les PME de services ; ajoute aussi l'angle gain de temps et réduction des coûts.",
      feedbackHelp: "Si vous n'ajoutez rien, Founder considère que vous validez le cadrage et rédige directement la version finale.",
      preparingDoc: "Founder prépare le document…",
      rewriteFinal: "Re-rédiger la version finale complète",
      writeFinal: "Rédiger la version finale complète",
      preparingFullDoc: "Préparation d'un document complet",
      preparingFullDocBody: "Pour un meilleur rendu, Founder peut prendre 2 à 3 minutes afin de bien analyser, structurer et peaufiner la version dossier.",
      dossierVersion: "Version dossier",
      exportNote: "sera utilisée dans l'export final",
      dossierPlaceholder: "La version finale rédigée par Founder apparaîtra ici. Vous pourrez encore la modifier avant validation.",
      noUsableAnswer: "- Aucune réponse utilisateur exploitable pour cette étape.",
      close: "Fermer",
      closeHistory: "Fermer l'historique",
      noFounderFiles: "Aucun dossier Founder pour le moment.",
      optional: "optionnel",
      generating: "Génération en cours…",
      refineWithChatlaya: "Peaufiner avec ChatLAYA",
      generateWithChatlaya: "Générer avec ChatLAYA",
      cancel: "Annuler",
      generatingAnother: "Génération en cours sur une autre étape…",
      previousVersion: "Voir la version précédente",
      chatlayaAnalysis: "Analyse ChatLAYA",
      inProgress: "En cours…",
      copyAction: "Copier",
      copied: "Copié !",
      revalidateForDossier: "Revalider pour le dossier",
      validateForDossier: "Valider pour le dossier",
      dossierVersionValidated: "Version dossier validée",
      editThisStep: "Modifier cette étape",
      exportDossier: "Exporter le dossier",
      emptyStatePrefix: "Renseignez les champs ci-dessus puis cliquez sur",
      synthesisBack: "Retour",
      synthesisTitle: "Dossier projet final",
      synthesisProjectOf: "Projet de {name}",
      synthesisConsolidated: "Votre dossier consolidé",
      exportPdf: "Exporter PDF",
      exportIncomplete: "Exporter ({count} section{plural} incomplète{plural})",
      noFormulationWarning: "{count} section{plural} sans formulation — le document exporté affichera des espaces vides à ces endroits.",
      noFormulationSections: "Sections : {sections}. Le contenu coaching ne sera pas inclus.",
      exportAnyway: "Exporter quand même",
      noFinalFormulation: "{count} section{plural} sans formulation finale",
      noFinalFormulationBody: "{sections} — ces sections apparaîtront comme non finalisées dans le document exporté. Le contenu coaching n'y sera pas inclus. Retournez dans chaque étape pour rédiger votre formulation propre.",
      synthesisIntroBadge: "Dossier Projet — Synthèse complète",
      synthesisIntroBody: "{count} section{plural} validée{plural}. Ce document présente votre projet cadré. Cliquez Exporter PDF pour générer le dossier premium.",
      optionalStep: "Optionnelle",
      finalFormulation: "Formulation finale",
      coachingAnswerFallback: "Réponse de coaching (formulation finale non renseignée)",
      downloadHtmlPdf: "Télécharger le dossier HTML · Imprimer en PDF",
      exportIncompleteDossier: "Exporter le dossier incomplet",
    };
  }

  return {
    newConversation: "New conversation",
    loadingWorkspace: "Preparing Founder workspace...",
    authRequiredTitle: "Sign-in required for Founder",
    authRequiredBody: "Sign in to recover your Founder files, continue your guided framing and export your final document.",
    login: "Sign in",
    loginNewTab: "Open Founder sign-in in a new tab",
    backGeneral: "Back to general mode",
    history: "Founder history",
    newFolder: "New Founder file",
    yourConversations: "Your conversations",
    expandHistory: "Expand history",
    collapseHistory: "Collapse history",
    activeFolder: "Active file",
    founderFolder: "Founder file",
    archive: "Archive",
    generalMode: "General mode",
    framingBadge: "Guided business framing workspace",
    framingBody: "In 6 steps, Founder helps you clarify your target customer, problem, offer, pricing, revenue model and sales pitch, then turn it into a structured exportable project file.",
    bravo: "Congratulations!",
    stepsDone: "All 6 steps are validated. Your file is ready.",
    finalFolder: "Final file",
    revisionTitle: "Revision mode",
    revisionBody: "Edit your answers below and regenerate to refine them, or revalidate the current version directly.",
    starterBadge: "ChatLAYA Founder",
    starterTitle1: "Frame your project.",
    starterTitle2: "Leave with an actionable file.",
    starterBody: "An AI coach guides you step by step to clarify your customer, problem, offer, pricing, business model and sales pitch.",
    deliverableTitle: "The sellable deliverable",
    deliverableBody: "A project file written in the user's own words, exportable and presentable to a partner, team or investor.",
    startingPoint: "Starting point",
    startingTitle: "Describe your project in a few sentences.",
    startingBody: "Give the idea, the target customer, what you sell or what you want to launch. Founder will turn that into a framing journey.",
    startingPlaceholder: "Example: I want to sell high-performance laptops to students and young professionals with installment payments...",
    preparingFraming: "Preparing your framing...",
    startFraming: "Start framing",
    loginToStart: "Sign in to start",
    createAccount: "Create an account",
    introAfterStart: "After that, this introduction disappears and you work step by step with the coach.",
    secureReturn: "Secure sign-in, then direct return to ChatLAYA Founder.",
    founderThinking: "ChatLAYA is thinking",
    finalizeTitle: "Finalize the framing",
    validated: "validated",
    readyVersion: "ready version",
    toWrite: "to write",
    yourFeedback: "Your feedback or additions (optional)",
    feedbackPlaceholder: "Example: keep this idea, but clarify that I mainly target service SMEs; also add the time-saving and cost-reduction angle.",
    feedbackHelp: "If you add nothing, Founder assumes you validate the framing and drafts the final version directly.",
    preparingDoc: "Founder is preparing the document...",
    rewriteFinal: "Rewrite the full final version",
    writeFinal: "Write the full final version",
    preparingFullDoc: "Preparing a complete document",
    preparingFullDocBody: "For a stronger result, Founder may take 2 to 3 minutes to analyze, structure and polish the dossier version.",
    dossierVersion: "Dossier version",
    exportNote: "used in the final export",
    dossierPlaceholder: "The final version written by Founder will appear here. You can still edit it before validation.",
    noUsableAnswer: "- No usable user answer for this step.",
    close: "Close",
    closeHistory: "Close history",
    noFounderFiles: "No Founder files yet.",
    optional: "optional",
    generating: "Generating...",
    refineWithChatlaya: "Refine with ChatLAYA",
    generateWithChatlaya: "Generate with ChatLAYA",
    cancel: "Cancel",
    generatingAnother: "Generation is running on another step...",
    previousVersion: "See previous version",
    chatlayaAnalysis: "ChatLAYA analysis",
    inProgress: "In progress...",
    copyAction: "Copy",
    copied: "Copied!",
    revalidateForDossier: "Revalidate for the dossier",
    validateForDossier: "Validate for the dossier",
    dossierVersionValidated: "Dossier version validated",
    editThisStep: "Edit this step",
    exportDossier: "Export dossier",
    emptyStatePrefix: "Fill in the fields above, then click",
    synthesisBack: "Back",
    synthesisTitle: "Final project dossier",
    synthesisProjectOf: "{name}'s project",
    synthesisConsolidated: "Your consolidated dossier",
    exportPdf: "Export PDF",
    exportIncomplete: "Export ({count} incomplete section{plural})",
    noFormulationWarning: "{count} section{plural} without wording — the exported document will show empty spaces there.",
    noFormulationSections: "Sections: {sections}. Coaching content will not be included.",
    exportAnyway: "Export anyway",
    noFinalFormulation: "{count} section{plural} without final wording",
    noFinalFormulationBody: "{sections} — these sections will appear as unfinished in the exported document. Coaching content will not be included. Return to each step to write your own wording.",
    synthesisIntroBadge: "Project dossier — complete synthesis",
    synthesisIntroBody: "{count} validated section{plural}. This document presents your framed project. Click Export PDF to generate the premium dossier.",
    optionalStep: "Optional",
    finalFormulation: "Final wording",
    coachingAnswerFallback: "Coaching answer (final wording not provided)",
    downloadHtmlPdf: "Download HTML dossier · Print to PDF",
    exportIncompleteDossier: "Export incomplete dossier",
  };
}

// ─── Prompt builders ────────────────────────────────────────────────────────

function buildPrompt(
  locale: string,
  moduleId: string,
  inputs: Record<string, string>,
  ws: WorkspaceData,
  docLabels: Record<string, { title: string; tagline: string }>,
): string {
  const get = (id: string) => {
    const s = ws[id];
    if (!s) return "";
    return (s.output || s.inputs[Object.keys(s.inputs)[0]] || "").trim();
  };

  const client = get("client");
  const probleme = get("probleme");
  const offre = get("offre");
  const prix = get("prix");
  const bizModel = get("business_model");

  const short = (s: string, n = 200) => (s.length > n ? s.slice(0, n) + "…" : s);
  const founderDiagnosticMarker = founderIsEnglish(locale)
    ? `CHATLAYA_FOUNDER_GUIDED_DIAGNOSTIC\nFounder step: ${docLabels[moduleId]?.title ?? moduleId}\n\n`
    : `CHATLAYA_FOUNDER_GUIDED_DIAGNOSTIC\nÉtape Founder : ${docLabels[moduleId]?.title ?? moduleId}\n\n`;

  switch (moduleId) {
    case "client":
      return founderDiagnosticMarker + (founderIsEnglish(locale)
        ? `I am working on: ${inputs.activite || "(not specified)"}. My target customer, as I see it, is: ${inputs.client_idee || "(not specified)"}. Help me define my target customer clearly: who they really are, their main characteristics, what motivates them to buy and how to find them concretely. Be precise and actionable.`
        : `Je travaille sur : ${inputs.activite || "(non précisé)"}. Mon client cible selon moi est : ${inputs.client_idee || "(non précisé)"}. Aide-moi à définir clairement mon client cible : qui il est vraiment, ses caractéristiques principales, ce qui le motive à acheter, et comment le trouver concrètement. Sois précis et actionnable.`);
    case "probleme":
      return founderDiagnosticMarker + (founderIsEnglish(locale)
        ? `My target customer is: ${client || "(not defined)"}. I believe I solve this problem: ${inputs.probleme_idee || "(not specified)"}. Help me formulate this problem clearly: why it is painful for the customer, what they lose or miss without a solution, and why this problem is worth solving. Be concrete.`
        : `Mon client cible est : ${client || "(non défini)"}. Je pense résoudre ce problème : ${inputs.probleme_idee || "(non précisé)"}. Aide-moi à formuler clairement ce problème : en quoi c'est douloureux pour le client, ce qu'il perd ou rate sans solution, et pourquoi ce problème vaut la peine d'être résolu. Sois concret.`);
    case "offre":
      return founderDiagnosticMarker + (founderIsEnglish(locale)
        ? `My customer ${client ? `is: ${short(client)}` : "(defined in the previous step)"}. ${probleme ? `Their problem is: ${short(probleme)}. ` : ""}My offer is: ${inputs.offre_detail || "(not specified)"}. The customer gains or avoids: ${inputs.gain_client || "(not specified)"}. Help me structure a clear and compelling value proposition: what I offer, for whom, why it is different and the concrete benefit. In 3 to 5 actionable points.`
        : `Mon client ${client ? `est : ${short(client)}` : "(défini à l'étape précédente)"}. ${probleme ? `Le problème qu'il rencontre : ${short(probleme)}. ` : ""}Mon offre est : ${inputs.offre_detail || "(non précisée)"}. Le client gagne ou évite : ${inputs.gain_client || "(non précisé)"}. Aide-moi à structurer une proposition de valeur claire et percutante : ce que je propose, pour qui, pourquoi c'est différent, et le bénéfice concret. En 3 à 5 points actionnables.`);
    case "prix":
      return founderDiagnosticMarker + (founderIsEnglish(locale)
        ? `${offre ? `My offer: ${short(offre)}. ` : ""}My customer: ${short(client || "(defined previously)")}. I plan to charge: ${inputs.modele_prix || "(not specified)"}${inputs.niveau_prix ? `, with a price level of: ${inputs.niveau_prix}` : ""}. Help me validate my pricing strategy: is it consistent with the value delivered, what questions should I ask myself and how can I test the price quickly?`
        : `${offre ? `Mon offre : ${short(offre)}. ` : ""}Mon client : ${short(client || "(défini précédemment)")}. Je pense facturer : ${inputs.modele_prix || "(non précisé)"}${inputs.niveau_prix ? `, avec un niveau de prix de : ${inputs.niveau_prix}` : ""}. Aide-moi à valider ma stratégie de prix : est-ce cohérent avec la valeur apportée, quelles questions je dois me poser, et comment tester mon prix rapidement.`);
    case "business_model":
      return founderDiagnosticMarker + (founderIsEnglish(locale)
        ? `${offre ? `My offer: ${short(offre)}. ` : ""}${client ? `My customer: ${short(client)}. ` : ""}${prix ? `My pricing: ${short(prix)}. ` : ""}I generate revenue through: ${inputs.revenus || "(not specified)"}. Help me structure my business model: main revenue streams, key costs to anticipate and how to make it more robust or scalable.`
        : `${offre ? `Mon offre : ${short(offre)}. ` : ""}${client ? `Mon client : ${short(client)}. ` : ""}${prix ? `Mon prix : ${short(prix)}. ` : ""}Je génère des revenus via : ${inputs.revenus || "(non précisé)"}. Aide-moi à structurer mon business model : flux de revenus principaux, coûts clés à anticiper, et comment le rendre plus solide ou scalable.`);
    case "vente":
      return founderDiagnosticMarker + (founderIsEnglish(locale)
        ? `${offre ? `My offer: ${short(offre, 120)}. ` : ""}${client ? `My customer: ${short(client, 100)}. ` : ""}${probleme ? `Their problem: ${short(probleme, 100)}. ` : ""}I sell through: ${inputs.canal || "my usual channels"}. Help me turn this framing into a convincing pitch and sales message adapted to ${inputs.canal || "that channel"}. It must clarify the promise, grab attention, show value, handle objections and call to action. Give me a core pitch and 2 to 3 short variants.`
        : `${offre ? `Mon offre : ${short(offre, 120)}. ` : ""}${client ? `Mon client : ${short(client, 100)}. ` : ""}${probleme ? `Son problème : ${short(probleme, 100)}. ` : ""}Je vends via : ${inputs.canal || "mes canaux habituels"}. Aide-moi à transformer ce cadrage en pitch et message de vente convaincant adapté à ${inputs.canal || "ce canal"}. Il doit clarifier la promesse, capter l'attention, montrer la valeur, lever les objections et appeler à l'action. Donne une base de pitch et 2 à 3 variantes courtes.`);
    case "business_plan":
      return founderDiagnosticMarker + (founderIsEnglish(locale)
        ? `Here is the summary of my project:\n- Target customer: ${client || "(to complete)"}\n- Problem solved: ${short(probleme || "(to define)")}\n- Offer: ${short(offre || "(to structure)")}\n- Pricing: ${short(prix || "(to define)")}\n- Business model: ${short(bizModel || "(to structure)")}\n\nHelp me write a simple and actionable business plan over ${inputs.horizon || "12 months"}${inputs.objectifs ? ` with these goals: ${inputs.objectifs}` : ""}. Keep it practical, not academic: vision, target market, offer and value, business model, priority action plan, key indicators.`
        : `Voici le résumé de mon projet :\n- Client cible : ${client || "(à compléter)"}\n- Problème résolu : ${short(probleme || "(à définir)")}\n- Offre : ${short(offre || "(à structurer)")}\n- Prix : ${short(prix || "(à définir)")}\n- Business model : ${short(bizModel || "(à structurer)")}\n\nAide-moi à rédiger un business plan simple et exploitable sur ${inputs.horizon || "12 mois"}${inputs.objectifs ? ` avec ces objectifs : ${inputs.objectifs}` : ""}. Garde-le pratique, pas académique : vision, marché cible, offre et valeur, modèle économique, plan d'action prioritaire, indicateurs clés.`);
    default:
      return founderIsEnglish(locale) ? "Help me on this step of my project." : "Aide-moi sur cette étape de mon projet.";
  }
}

function formatInputsForPrompt(mod: ModuleDef, inputs: Record<string, string>): string {
  const lines = mod.inputs
    .map((field) => {
      const value = inputs[field.id]?.trim();
      if (!value) return "";
      return `- ${field.label.replace(/\s*\([^)]*\)\s*$/g, "")} : ${value}`;
    })
    .filter(Boolean);

  return lines.length ? lines.join("\n") : founderUi(founderIsEnglish(mod.label) ? "en" : "fr").noUsableAnswer;
}

function finalDraftStructure(locale: string, moduleId: string, docTitle: string): string {
  if (founderIsEnglish(locale)) {
    const structures: Record<string, string> = {
      client:
        `Expected structure, matching the depth of the validated example:\n` +
        `${docTitle}: [specific segment]\n\n` +
        `Target Customer Profile and Characteristics\n` +
        `Buying Motivation and Core Pain Points\n` +
        `Offer Positioning and Perceived Value\n` +
        `Discovery Strategy and Acquisition Channels\n` +
        `Lead Qualification Criteria\n` +
        `Nuances and Pitfalls to Avoid\n` +
        `Value Proposition Synthesis`,
      probleme:
        `Expected structure, with the same depth as a premium section:\n` +
        `${docTitle}: [core pain]\n\n` +
        `Nature of the Customer Problem\n` +
        `Operational and Economic Consequences\n` +
        `Urgency and Cost of Inaction\n` +
        `Segments Most Exposed to this Pain\n` +
        `Field Validation Signals\n` +
        `Risks of Poor Framing\n` +
        `Pain-to-Solve Synthesis`,
      offre:
        `Expected structure, with real dossier logic:\n` +
        `${docTitle}: [main promise]\n\n` +
        `Offer Definition\n` +
        `Concrete Customer Benefits\n` +
        `Differentiation and Perceived Value\n` +
        `Offer Components\n` +
        `Proof, Guarantees or Reassurance Elements\n` +
        `Commercial Clarity Conditions\n` +
        `Value Proposition Synthesis`,
      prix:
        `Expected structure, oriented toward business decisions:\n` +
        `${docTitle}: [pricing logic]\n\n` +
        `Recommended Pricing Logic\n` +
        `Link Between Price and Perceived Value\n` +
        `Cost and Margin Assumptions\n` +
        `Possible Billing Options\n` +
        `Price Testing Method\n` +
        `Pricing Risks to Avoid\n` +
        `Pricing Strategy Synthesis`,
      business_model:
        `Expected structure, like a readable investor section:\n` +
        `${docTitle}: [selected model]\n\n` +
        `Overall Business Model Logic\n` +
        `Priority Revenue Sources\n` +
        `Key Costs and Required Resources\n` +
        `Value Creation and Capture Mechanics\n` +
        `Scalability and Leverage Effects\n` +
        `Assumptions to Validate\n` +
        `Business Model Synthesis`,
      vente:
        `Expected structure, ready for commercial use:\n` +
        `${docTitle}: [sales angle]\n\n` +
        `Main Commercial Angle\n` +
        `Promise to Communicate\n` +
        `Core Sales Message\n` +
        `Conviction Arguments\n` +
        `Channels and Usage Situations\n` +
        `Likely Objections and Responses\n` +
        `Commercial Narrative Synthesis`,
      business_plan:
        `Expected structure, concise but substantial:\n` +
        `${docTitle}: [horizon and priority]\n\n` +
        `Project Vision and Goal\n` +
        `Target Market and Problem Solved\n` +
        `Offer, Value and Positioning\n` +
        `Business Model and Revenue Assumptions\n` +
        `Priority Action Plan\n` +
        `Tracking Indicators\n` +
        `Executive Plan Synthesis`,
    };

    return structures[moduleId] ?? (
      `Expected structure:\n` +
      `${docTitle}\n\n` +
      `Context\n` +
      `Analysis\n` +
      `Business Implications\n` +
      `Validation Criteria\n` +
      `Synthesis`
    );
  }

  const structures: Record<string, string> = {
    client:
      `Structure attendue, en reprenant le niveau de profondeur de l'exemple validé :\n` +
      `${docTitle} : [segment précis]\n\n` +
      `Profil et Caractéristiques du Client Cible\n` +
      `Motivation d'Achat et Pain Points Fondamentaux\n` +
      `Positionnement de l'Offre et Valeur Perçue\n` +
      `Stratégie de Découverte et Canaux d'Acquisition\n` +
      `Critères de Qualification du Lead\n` +
      `Nuances et Pièges à Éviter\n` +
      `Synthèse de la Proposition de Valeur`,
    probleme:
      `Structure attendue, avec le même niveau de profondeur qu'une section premium :\n` +
      `${docTitle} : [douleur centrale]\n\n` +
      `Nature du Problème Client\n` +
      `Conséquences Opérationnelles et Économiques\n` +
      `Urgence et Coût de l'Inaction\n` +
      `Segments les Plus Exposés à cette Douleur\n` +
      `Signaux de Validation Terrain\n` +
      `Risques de Mauvaise Formulation\n` +
      `Synthèse de la Douleur à Résoudre`,
    offre:
      `Structure attendue, avec une vraie logique de dossier :\n` +
      `${docTitle} : [promesse principale]\n\n` +
      `Définition de l'Offre\n` +
      `Bénéfices Concrets pour le Client\n` +
      `Différenciation et Valeur Perçue\n` +
      `Composantes de l'Offre\n` +
      `Preuves, Garanties ou Éléments de Réassurance\n` +
      `Conditions de Clarté Commerciale\n` +
      `Synthèse de la Proposition de Valeur`,
    prix:
      `Structure attendue, orientée décision business :\n` +
      `${docTitle} : [logique tarifaire]\n\n` +
      `Logique de Prix Recommandée\n` +
      `Lien entre Prix et Valeur Perçue\n` +
      `Hypothèses de Coûts et de Marge\n` +
      `Options de Facturation Possibles\n` +
      `Méthode de Test du Prix\n` +
      `Risques Tarifaires à Éviter\n` +
      `Synthèse de la Stratégie de Prix`,
    business_model:
      `Structure attendue, comme une section investisseur lisible :\n` +
      `${docTitle} : [modèle retenu]\n\n` +
      `Logique Générale du Modèle Économique\n` +
      `Sources de Revenus Prioritaires\n` +
      `Coûts Clés et Ressources Nécessaires\n` +
      `Mécanique de Création et Capture de Valeur\n` +
      `Scalabilité et Effets de Levier\n` +
      `Hypothèses à Valider\n` +
      `Synthèse du Modèle Économique`,
    vente:
      `Structure attendue, prête à être utilisée commercialement :\n` +
      `${docTitle} : [angle de vente]\n\n` +
      `Angle Commercial Principal\n` +
      `Promesse à Communiquer\n` +
      `Message Central de Vente\n` +
      `Arguments de Conviction\n` +
      `Canaux et Situations d'Utilisation\n` +
      `Objections Probables et Réponses\n` +
      `Synthèse du Discours Commercial`,
    business_plan:
      `Structure attendue, synthétique mais substantielle :\n` +
      `${docTitle} : [horizon et priorité]\n\n` +
      `Vision et Objectif du Projet\n` +
      `Marché Cible et Problème Résolu\n` +
      `Offre, Valeur et Positionnement\n` +
      `Modèle Économique et Hypothèses de Revenus\n` +
      `Plan d'Action Prioritaire\n` +
      `Indicateurs de Suivi\n` +
      `Synthèse Exécutive du Plan`,
  };

  return structures[moduleId] ?? (
    `Structure attendue :\n` +
    `${docTitle}\n\n` +
    `Contexte\n` +
    `Analyse\n` +
    `Implications Business\n` +
    `Critères de Validation\n` +
    `Synthèse`
  );
}

function buildFinalDraftPrompt(
  locale: string,
  moduleId: string,
  state: ModuleState,
  ws: WorkspaceData,
  modules: ModuleDef[],
  docLabels: Record<string, { title: string; tagline: string }>,
): string {
  const mod = modules.find((item) => item.id === moduleId);
  const docLabel = docLabels[moduleId] ?? { title: mod?.label ?? (founderIsEnglish(locale) ? "Dossier section" : "Section dossier"), tagline: "" };
  const expectedStructure = finalDraftStructure(locale, moduleId, docLabel.title);
  const priorContext = modules
    .filter((item) => item.id !== moduleId)
    .map((item) => {
      const itemState = ws[item.id];
      const content = itemState?.retention?.trim() || itemState?.output?.trim();
      if (!content) return "";
      const label = docLabels[item.id]?.title ?? item.label;
      const shortContent = content.length > 900 ? `${content.slice(0, 900)}…` : content;
      return `## ${label}\n${shortContent}`;
    })
    .filter(Boolean)
    .join("\n\n");

  return founderIsEnglish(locale) ? (
    `You are ChatLAYA Founder. You must write the FINAL DOSSIER VERSION for this step: "${docLabel.title}".\n\n` +
    `Role of the final text: ${docLabel.tagline || "a section usable in a project dossier"}.\n\n` +
    `Initial user answers:\n${mod ? formatInputsForPrompt(mod, state.inputs) : "(module not found)"}\n\n` +
    `ChatLAYA diagnostic / framing to consider:\n${state.output?.trim() || "(no diagnostic available)"}\n\n` +
    `User feedback, corrections or additions:\n${state.finalFeedback?.trim() || "(no additions: the user validates the proposed framing)"}\n\n` +
    `${priorContext ? `Context already framed in the other steps:\n${priorContext}\n\n` : ""}` +
    `${expectedStructure}\n\n` +
    `Writing instruction: produce only the final version to place in the dossier. Do not coach, do not ask questions, do not say "here is". This version must be strong enough to be sold as part of a real premium project dossier: dense, clear and actionable. Do not write a summary. Write a full section with at least 5 to 8 paragraphs or structured blocks depending on the material available. Develop the business logic, criteria, implications, nuances and validation points that matter. Follow the expected structure above with clean headings on separate lines. Rephrase with substance, precision and business coherence. Do not use visible Markdown. Never end with a transition sentence like "the next step is..." or a question. Never artificially shorten the answer: a version that is too short is considered a failure.`
  ) : (
    `Tu es ChatLAYA Founder. Tu dois rédiger la VERSION FINALE DU DOSSIER pour cette étape : "${docLabel.title}".\n\n` +
    `Rôle du texte final : ${docLabel.tagline || "section utilisable dans un dossier projet"}.\n\n` +
    `Réponses initiales de l'utilisateur :\n${mod ? formatInputsForPrompt(mod, state.inputs) : "(module introuvable)"}\n\n` +
    `Diagnostic / cadrage ChatLAYA à prendre en compte :\n${state.output?.trim() || "(aucun diagnostic disponible)"}\n\n` +
    `Avis, corrections ou ajouts de l'utilisateur :\n${state.finalFeedback?.trim() || "(aucun ajout : l'utilisateur valide le cadrage proposé)"}\n\n` +
    `${priorContext ? `Contexte déjà cadré dans les autres étapes :\n${priorContext}\n\n` : ""}` +
    `${expectedStructure}\n\n` +
    `Consigne de rédaction : produis uniquement la version finale à mettre dans le dossier. ` +
    `Ne fais pas de coaching, ne pose pas de question, ne dis pas "voici". ` +
    `Cette version doit pouvoir être vendue comme partie d'un vrai dossier projet premium : elle doit être dense, claire et exploitable. ` +
    `Ne produis pas un résumé. Rédige une section complète avec au moins 5 à 8 paragraphes ou blocs structurés selon la matière disponible. ` +
    `Développe la logique business, les critères, les implications, les nuances et les points de validation utiles. ` +
    `Respecte la structure attendue fournie ci-dessus, avec des titres propres sur lignes séparées. ` +
    `Si le sujet est la cible client, détaille les segments prioritaires, les caractéristiques, les motivations d'achat, les signaux de besoin, les canaux pour les trouver et les hypothèses à valider. ` +
    `Si le sujet est un autre module, applique le même niveau de profondeur au problème, à l'offre, au prix, au modèle économique, au pitch commercial ou au plan d'action. ` +
    `Reformule proprement, avec substance, précision et cohérence business. ` +
    `N'utilise aucun Markdown visible : pas d'astérisques, pas de #, pas de balises. ` +
    `Ne termine jamais par une phrase de transition du type "la prochaine étape consiste à..." ou une question. ` +
    `Ne réduis jamais artificiellement la réponse : une version trop courte est considérée comme un échec.`
  );
}

function cleanDossierText(value: string): string {
  const forbiddenClosings = [
    "la prochaine étape",
    "la prochaine etape",
    "pour affiner",
    "afin d'affiner",
    "afin d affiner",
    "souhaitez-vous",
    "souhaitez vous",
    "pouvez-vous préciser",
    "pouvez vous preciser",
    "sur quels types",
    "sur quel type",
    "pour passer à l'étape suivante",
    "pour passer a l'etape suivante",
    "je peux aller plus loin",
    "si vous précisez",
    "si vous precisez",
  ];

  const cleaned = value
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/`([^`\n]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const paragraphs = cleaned.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  while (paragraphs.length) {
    const last = paragraphs[paragraphs.length - 1].toLowerCase();
    if (!last.includes("?") && !forbiddenClosings.some((pattern) => last.includes(pattern))) break;
    paragraphs.pop();
  }
  return paragraphs.join("\n\n").trim() || cleaned;
}

// ─── Markdown parser ─────────────────────────────────────────────────────────

type MdBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "ordered-list"; items: string[] }
  | { type: "unordered-list"; items: string[] };

function parseMd(content: string): MdBlock[] {
  const lines = content.split("\n");
  const blocks: MdBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.startsWith("### ")) { blocks.push({ type: "heading", level: 3, text: line.slice(4) }); i++; continue; }
    if (line.startsWith("## ")) { blocks.push({ type: "heading", level: 2, text: line.slice(3) }); i++; continue; }
    if (line.startsWith("# ")) { blocks.push({ type: "heading", level: 1, text: line.slice(2) }); i++; continue; }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length) {
        if (/^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s+/, "")); i++; }
        else if (!lines[i].trim()) {
          let j = i + 1;
          while (j < lines.length && !lines[j].trim()) j++;
          if (j < lines.length && /^\d+\.\s/.test(lines[j])) { i = j; } else { break; }
        } else { break; }
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    if (/^[-•*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length) {
        if (/^[-•*]\s/.test(lines[i])) { items.push(lines[i].replace(/^[-•*]\s+/, "")); i++; }
        else if (!lines[i].trim()) {
          let j = i + 1;
          while (j < lines.length && !lines[j].trim()) j++;
          if (j < lines.length && /^[-•*]\s/.test(lines[j])) { i = j; } else { break; }
        } else { break; }
      }
      blocks.push({ type: "unordered-list", items });
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^[-•*]\s/.test(lines[i])
    ) { paraLines.push(lines[i]); i++; }
    if (paraLines.length) blocks.push({ type: "paragraph", text: paraLines.join(" ") });
  }
  return blocks;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i} className="font-semibold text-[#101015]">{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*"))
          return <em key={i} className="italic text-[#4A4540]">{part.slice(1, -1)}</em>;
        if (part.startsWith("`") && part.endsWith("`"))
          return <code key={i} className="rounded bg-[#F0E6CC] px-1 py-0.5 font-mono text-[12px] text-[#8A6A20]">{part.slice(1, -1)}</code>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ─── FounderOutput ───────────────────────────────────────────────────────────

function FounderOutput({ content }: { content: string }) {
  const blocks = parseMd(content);
  return (
    <div className="space-y-3 break-words">
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          if (block.level === 1)
            return <h1 key={idx} className="text-base font-bold text-[#101015] pt-1">{renderInline(block.text)}</h1>;
          if (block.level === 2)
            return (
              <h2 key={idx} className="flex items-center gap-2.5 text-sm font-bold text-[#101015] pt-2">
                <span className="h-3.5 w-0.5 shrink-0 rounded-full bg-[#B8963E]" />
                {renderInline(block.text)}
              </h2>
            );
          return <h3 key={idx} className="text-sm font-semibold text-[#3A3530] pt-1">{renderInline(block.text)}</h3>;
        }
        if (block.type === "ordered-list")
          return (
            <ol key={idx} className="space-y-2">
              {block.items.map((item, li) => (
                <li key={li} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F0E6CC] text-[10px] font-bold text-[#8A6A20] ring-1 ring-[#E7DED0]">{li + 1}</span>
                  <span className="flex-1 text-sm leading-6 text-[#3A3530]">{renderInline(item)}</span>
                </li>
              ))}
            </ol>
          );
        if (block.type === "unordered-list")
          return (
            <ul key={idx} className="space-y-2">
              {block.items.map((item, li) => (
                <li key={li} className="flex gap-2.5">
                  <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />
                  <span className="flex-1 text-sm leading-6 text-[#3A3530]">{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        return <p key={idx} className="text-sm leading-7 text-[#3A3530]">{renderInline(block.text)}</p>;
      })}
    </div>
  );
}

// ─── RetentionBlock (AXE 2 — livrable final) ─────────────────────────────────

function RetentionBlock({
  value,
  onChange,
  feedback,
  onFeedbackChange,
  onGenerateFinal,
  generatingFinal,
  validated,
  locale = "fr",
}: {
  value: string;
  onChange: (v: string) => void;
  feedback: string;
  onFeedbackChange: (v: string) => void;
  onGenerateFinal: () => void;
  generatingFinal: boolean;
  validated: boolean;
  locale?: string;
}) {
  const copy = founderUi(locale);
  const isFilled = Boolean(value.trim());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!generatingFinal) {
      setElapsedSeconds(0);
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [generatingFinal]);

  const progressSteps = [
    founderIsEnglish(locale) ? "I analyze the diagnostic and your additions" : "J'analyse le diagnostic et vos ajouts",
    founderIsEnglish(locale) ? "I structure the ideas into dossier form" : "Je structure les idées en version dossier",
    founderIsEnglish(locale) ? "I refine the substance, clarity and nuance" : "Je peaufine le fond, la clarté et les nuances",
    founderIsEnglish(locale) ? "I clean up the final wording" : "Je nettoie la formulation finale",
  ];
  const activeProgressStep = elapsedSeconds < 25 ? 0 : elapsedSeconds < 80 ? 1 : elapsedSeconds < 140 ? 2 : 3;
  const progressMessage =
    elapsedSeconds < 25
      ? (founderIsEnglish(locale) ? "I am identifying the most important points to preserve." : "Je suis en train d'identifier les points les plus importants à conserver.")
      : elapsedSeconds < 80
        ? (founderIsEnglish(locale) ? "I am turning the framing into a structured, readable and actionable document." : "Je transforme le cadrage en document structuré, lisible et exploitable.")
        : elapsedSeconds < 140
          ? (founderIsEnglish(locale) ? "I am polishing the wording for a more professional result." : "Je peaufine les formulations pour obtenir un rendu plus professionnel.")
          : (founderIsEnglish(locale) ? "One moment more, the final version is almost ready." : "Patientez encore un instant, la version finale est presque prête.");
  const progressPercent = Math.min(92, Math.max(12, Math.round((elapsedSeconds / 180) * 100)));

  return (
    <div className="space-y-4 rounded-xl border border-[#E7DED0] bg-[#FFFCF7] p-4">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PenLine className="h-3.5 w-3.5 text-[#B8963E]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A6A20]">
            {copy.finalizeTitle}
          </span>
        </div>
        <span className="rounded-full bg-white/70 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#B8963E] ring-1 ring-[#E7DED0]">
          {validated ? copy.validated : isFilled ? copy.readyVersion : copy.toWrite}
        </span>
      </div>
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#B8963E]">
          {copy.yourFeedback}
        </p>
        <textarea
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
          placeholder={copy.feedbackPlaceholder}
          rows={3}
          className="w-full resize-none rounded-xl border border-[#E7DED0] bg-white/70 px-3.5 py-3 text-sm leading-relaxed text-[#101015] placeholder:text-[#C8B88A]/80 focus:border-[#B8963E] focus:outline-none"
        />
        <p className="mt-2 text-[11px] leading-relaxed text-[#6F6A60]">
          {copy.feedbackHelp}
        </p>
      </div>
      <button
        type="button"
        onClick={onGenerateFinal}
        disabled={generatingFinal}
        className="inline-flex items-center gap-2 rounded-full bg-[#101015] px-5 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-[#B8963E]/20 transition hover:bg-[#1A1A20] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {generatingFinal ? copy.preparingDoc : isFilled ? copy.rewriteFinal : copy.writeFinal}
      </button>
      {generatingFinal ? (
        <div className="rounded-2xl border border-[#E7DED0] bg-white/80 p-4 shadow-[0_12px_35px_rgba(184,150,62,0.08)]">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[#101015]">{copy.preparingFullDoc}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#6F6A60]">
                {copy.preparingFullDocBody}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#F0E6CC] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#8A6A20]">
              {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F0E6CC]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#B8963E] via-[#D4AE5C] to-[#B8963E] transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {progressSteps.map((step, index) => {
              const isActive = index === activeProgressStep;
              const isDone = index < activeProgressStep;
              return (
                <div
                  key={step}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${
                    isActive
                      ? "border-[#E7DED0] bg-[#FFFCF7] text-[#101015]"
                      : isDone
                        ? "border-[#E7DED0] bg-[#F0E6CC]/50 text-[#8A6A20]"
                        : "border-[#E7DED0] bg-[#F7F4EE] text-[#6F6A60]"
                  }`}
                >
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    isDone ? "bg-[#B8963E] text-white" : isActive ? "bg-[#B8963E] text-white" : "bg-white text-[#6F6A60]"
                  }`}>
                    {isDone ? <Check className="h-3 w-3" /> : index + 1}
                  </span>
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 animate-pulse text-xs font-medium text-[#8A6A20]">{progressMessage}</p>
        </div>
      ) : null}
      <div className="rounded-xl border border-[#E7DED0] bg-white/70 p-3.5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A6A20]">{copy.dossierVersion}</p>
          <span className="text-[9px] font-medium italic text-[#B8963E]/70">{copy.exportNote}</span>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={copy.dossierPlaceholder}
          rows={12}
          className="min-h-[320px] w-full resize-y bg-transparent text-sm leading-relaxed text-[#101015] placeholder:text-[#C8B88A]/80 focus:outline-none"
        />
      </div>
    </div>
  );
}

// ─── localStorage ─────────────────────────────────────────────────────────────

function storageKey(projectId: string) { return `kx-founder-ws-${projectId}`; }
function loadWs(projectId: string): WorkspaceData {
  try {
    const raw = localStorage.getItem(storageKey(projectId));
    if (raw) return JSON.parse(raw) as WorkspaceData;
  } catch {}
  return {};
}
function saveWs(projectId: string, data: WorkspaceData) {
  try { localStorage.setItem(storageKey(projectId), JSON.stringify(data)); } catch {}
}
function defaultMs(): ModuleState { return { inputs: {}, output: null, status: "empty" }; }
function getMs(ws: WorkspaceData, id: string): ModuleState { return ws[id] ?? defaultMs(); }
function normalizeTitle(value?: string | null, locale = "fr") { return value?.trim() || founderUi(locale).newConversation; }
function formatConversationDate(value?: string | null, locale = "fr") {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat(founderIsEnglish(locale) ? "en-US" : "fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function getOrCreateFounderGuestId(): string {
  const existing = localStorage.getItem(FOUNDER_GUEST_ID_KEY)?.trim();
  if (existing) return existing;
  const nextValue = `founder_guest_${crypto.randomUUID()}`;
  localStorage.setItem(FOUNDER_GUEST_ID_KEY, nextValue);
  return nextValue;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function readWorkspaceData(project: FounderProject): WorkspaceData {
  const projectData = asRecord(project.project_data);
  const nestedWorkspace = asRecord(projectData.workspace);
  const directWorkspace = MODULES.some((module) => module.id in projectData) ? projectData : nestedWorkspace;
  const baseWorkspace = Object.keys(directWorkspace).length ? directWorkspace : loadWs(project.id);
  return baseWorkspace as WorkspaceData;
}

function readStarterProject(project: FounderProject): string {
  const projectData = asRecord(project.project_data);
  if (typeof projectData.starter_project === "string") return projectData.starter_project;
  if (typeof projectData.starterProject === "string") return projectData.starterProject;
  const workspace = readWorkspaceData(project);
  return typeof workspace.client?.inputs?.activite === "string" ? workspace.client.inputs.activite : "";
}

function readActiveModuleId(project: FounderProject, workspace: WorkspaceData): string {
  const projectData = asRecord(project.project_data);
  const savedActiveModuleId = typeof projectData.active_module_id === "string" ? projectData.active_module_id : null;
  if (savedActiveModuleId && MODULES.some((module) => module.id === savedActiveModuleId)) {
    return savedActiveModuleId;
  }
  const fromStep = project.current_step ? FOUNDER_MODULE_ID_BY_STEP[project.current_step] : null;
  if (fromStep) return fromStep;
  const firstIncomplete = MODULES.find((module) => {
    const state = workspace[module.id];
    return !state || state.status !== "completed";
  });
  return firstIncomplete?.id ?? MODULES[0].id;
}

function buildFounderProjectTitle(starterProject: string, workspace: WorkspaceData, locale: string, fallback?: string | null): string {
  const firstLine = starterProject.trim()
    || workspace.client?.inputs?.activite?.trim()
    || workspace.client?.inputs?.client_idee?.trim()
    || fallback?.trim()
    || "";
  return normalizeTitle(firstLine.slice(0, 120), locale) || FOUNDER_DEFAULT_PROJECT_TITLE;
}

function buildFounderProjectData(starterProject: string, workspace: WorkspaceData, activeModuleId: string): Record<string, unknown> {
  return {
    starter_project: starterProject,
    active_module_id: activeModuleId,
    workspace,
  };
}

function buildFounderCurrentStep(activeModuleId: string, workspace: WorkspaceData): string {
  const requiredModuleIds = MODULES.filter((module) => !module.optional).map((module) => module.id);
  const allRequiredCompleted = requiredModuleIds.every((moduleId) => getMs(workspace, moduleId).status === "completed");
  if (allRequiredCompleted) return "completed";
  return FOUNDER_STEP_BY_MODULE_ID[activeModuleId] || "point_de_depart";
}

function buildWorkspaceFromBrief(brief: string): WorkspaceData {
  if (!brief.trim()) return {};
  return {
    client: {
      ...defaultMs(),
      inputs: { activite: brief.trim() },
      status: "in_progress",
    },
  };
}

function mergeFounderProjectList(items: FounderProject[], nextProject: FounderProject): FounderProject[] {
  const merged = [nextProject, ...items.filter((item) => item.id !== nextProject.id && !item.archived)];
  return merged.sort((left, right) => {
    const leftTime = Date.parse(left.updated_at || left.created_at || "") || 0;
    const rightTime = Date.parse(right.updated_at || right.created_at || "") || 0;
    return rightTime - leftTime;
  });
}

// ─── GeneratingCard ───────────────────────────────────────────────────────────

function getGeneratingMessages(locale: string) {
  return founderIsEnglish(locale)
    ? [
        "I’m activating the Founder corpus...",
        "I’m analyzing your situation from every angle...",
        "I’m structuring a response tailored to your project...",
        "I’m polishing it to make it genuinely useful...",
        "Almost there — I’m finalizing it for you...",
      ]
    : [
        "Je mobilise le corpus Fondateur…",
        "J'analyse votre situation sous tous les angles…",
        "Je structure une réponse adaptée à votre projet…",
        "Je peaufine pour que ce soit vraiment utile…",
        "Presque là — je finalise pour vous…",
      ];
}

function GeneratingCard({ firstName, locale }: { firstName?: string; locale: string }) {
  const messages = getGeneratingMessages(locale);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    setPhase(0);
    const id = setInterval(() => setPhase((p) => (p + 1) % messages.length), 2800);
    return () => clearInterval(id);
  }, [messages]);
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E7DED0] bg-white px-5 py-4 shadow-[0_4px_24px_rgba(184,150,62,0.08)]">
      <div className="flex items-center gap-2.5">
        <div className="flex items-end gap-[5px]">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="kx-thinking-dot inline-block rounded-full bg-[#B8963E]"
              style={{ width: i === 1 || i === 2 ? "7px" : "5px", height: i === 1 || i === 2 ? "7px" : "5px", animationDelay: `${i * 0.13}s` }}
            />
          ))}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">{founderUi(locale).founderThinking}</span>
      </div>
      <p key={phase} className="kx-thinking-msg text-sm leading-relaxed text-[#3A3530]">
        {firstName ? messages[phase] : messages[phase]}
      </p>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#F0E6CC]">
        <div className="kx-thinking-scan h-full w-1/3 rounded-full bg-gradient-to-r from-[#B8963E] via-[#D4AE5C] to-[#B8963E]" />
      </div>
    </div>
  );
}

// ─── HTML Export (AXE 3 — premium document) ───────────────────────────────────

function inlineToHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(/`([^`\n]+)`/g, "<code>$1</code>");
}

// Strict: final document uses ONLY user's own formulation — never AI coaching output
function getDocContent(mws: ModuleState): string | null {
  return mws.retention?.trim() || null;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function cleanExportText(value: string): string {
  return value
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/`([^`\n]+)`/g, "$1")
    .trim();
}

function splitExportParagraphs(value: string): string[] {
  return cleanExportText(value)
    .split(/\n\s*\n/g)
    .map((item) => item.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function buildSectionHeadline(label: string): string {
  const words = label.split(/\s+/);
  if (words.length <= 3) return escapeHtml(label);
  const mid = Math.ceil(words.length / 2);
  return `${escapeHtml(words.slice(0, mid).join(" "))}<br>${escapeHtml(words.slice(mid).join(" "))}`;
}

function buildEditorialContentHtml(retention: string, docLabel: { title: string; tagline: string }, index: number, locale: string): string {
  const paragraphs = splitExportParagraphs(retention);
  if (!paragraphs.length) return "";
  const isEnglish = founderIsEnglish(locale);

  const intro = paragraphs[0];
  const rest = paragraphs.slice(1);
  const leadIndex = Math.min(1, rest.length - 1);
  const lead = leadIndex >= 0 ? rest[leadIndex] : intro;
  const normalBlocks = rest.filter((_, idx) => idx !== leadIndex);
  const firstBlocks = normalBlocks.slice(0, 2);
  const remainingBlocks = normalBlocks.slice(2);
  const sectionTone = index % 3;

  const firstHtml = firstBlocks.length
    ? `<div class="block">
        <div class="block-title">${escapeHtml(docLabel.title)}</div>
        ${firstBlocks.map((item) => `<p>${inlineToHtml(item)}</p>`).join("")}
      </div>`
    : "";

  const calloutHtml = lead
    ? `<div class="callout">
        <div class="callout-label">${isEnglish ? "Strategic summary" : "Synthèse stratégique"}</div>
        <p>${inlineToHtml(lead)}</p>
      </div>`
    : "";

  const grouped = remainingBlocks.reduce<string[][]>((acc, item, idx) => {
    const groupIndex = Math.floor(idx / 2);
    if (!acc[groupIndex]) acc[groupIndex] = [];
    acc[groupIndex].push(item);
    return acc;
  }, []);

  const detailHtml = grouped.map((group, groupIndex) => {
    if (group.length === 2 && groupIndex === 0) {
      return `<div class="two-col">
        ${group.map((item, cardIndex) => `<div class="card">
          <div class="card-title">${cardIndex === 0 ? (isEnglish ? "Leverage point" : "Point d'appui") : (isEnglish ? "Validation angle" : "Angle de validation")}</div>
          <p>${inlineToHtml(item)}</p>
        </div>`).join("")}
      </div>`;
    }
    if (group.length >= 2 && sectionTone === 1) {
      return `<div class="criteria">
        ${group.map((item, itemIndex) => `<div class="criteria-item">
          <div class="criteria-num">${groupIndex * 2 + itemIndex + 1}</div>
          <div class="criteria-text">${inlineToHtml(item)}</div>
        </div>`).join("")}
      </div>`;
    }
    if (group.length >= 2 && sectionTone === 2) {
      return `<div class="pillars">
        ${group.slice(0, 3).map((item, itemIndex) => `<div class="pillar">
          <div class="pillar-num">${itemIndex + 1}</div>
          <div class="pillar-title">${isEnglish ? "Pillar" : "Pilier"} ${itemIndex + 1}</div>
          <p>${inlineToHtml(item)}</p>
        </div>`).join("")}
      </div>`;
    }
    return `<div class="block">
      <div class="block-title">${groupIndex === 0 ? (isEnglish ? "Development" : "Développement") : (isEnglish ? "Additional detail" : "Précision complémentaire")}</div>
      ${group.map((item) => `<p>${inlineToHtml(item)}</p>`).join("")}
    </div>`;
  }).join("");

  return `${firstHtml}${calloutHtml}${detailHtml}`;
}

function generateHtmlExport(locale: string, ws: WorkspaceData, modules: ModuleDef[], docLabels: Record<string, { title: string; tagline: string }>, firstName?: string): string {
  const copy = founderUi(locale);
  const date = new Date().toLocaleDateString(founderIsEnglish(locale) ? "en-US" : "fr-FR", { year: "numeric", month: "long", day: "numeric" });
  const completed = modules.filter((m) => getMs(ws, m.id).status === "completed");
  const requiredTotal = modules.filter((m) => !m.optional).length;

  // Strict counts: only user-formulated sections count as truly ready for the document
  const requiredWithFormulation = modules.filter((m) => !m.optional && !!getMs(ws, m.id).retention?.trim()).length;
  const missingFormulation = completed.filter((m) => !m.optional && !getMs(ws, m.id).retention?.trim());
  const isDossierComplete = requiredWithFormulation === requiredTotal;

  const displayName = firstName?.trim() || (founderIsEnglish(locale) ? "Founder Project" : "Projet Founder");
  const exportSections = completed.length ? completed : modules.filter((m) => getMs(ws, m.id).retention?.trim());
  const coverPills = exportSections.slice(0, 6).map((mod) => {
    const label = docLabels[mod.id] ?? { title: mod.label, tagline: mod.tagline };
    return `<span class="section-pill">${escapeHtml(label.title)}</span>`;
  }).join("");

  // Incomplete document banner — shown when required sections lack user formulation
  const incompleteHtml = missingFormulation.length > 0 ? `
  <div class="alert-box export-alert">
    <div class="alert-title">${founderIsEnglish(locale) ? "Incomplete dossier" : "Dossier incomplet"}</div>
    <p>${copy.noFormulationWarning.replace("{count}", String(missingFormulation.length)).replaceAll("{plural}", missingFormulation.length > 1 ? "s" : "")} <strong>${missingFormulation.map((m) => escapeHtml(docLabels[m.id]?.title ?? m.label)).join(", ")}</strong>.</p>
  </div>` : "";

  // Section bodies — STRICT: only user formulation, never AI coaching output
  const sections = exportSections.map((mod, idx) => {
    const mws = getMs(ws, mod.id);
    const docLabel = docLabels[mod.id] ?? { title: mod.label, tagline: mod.tagline };
    const retention = getDocContent(mws);
    const sectionNumber = String(idx + 1).padStart(2, "0");

    const contentHtml = retention ? buildEditorialContentHtml(retention, docLabel, idx, locale) : `
        <div class="alert-box">
          <div class="alert-title">${founderIsEnglish(locale) ? "Wording not drafted" : "Formulation non rédigée"}</div>
          <p>${founderIsEnglish(locale) ? "This section was analyzed in coaching mode, but its final dossier wording has not yet been written. Coaching content is not included in this document." : "Cette section a été analysée en mode coaching, mais sa version dossier finale n'a pas encore été rédigée. Le contenu coaching n'est pas inclus dans ce document."}</p>
        </div>`;

    return `
  <section class="section" id="s${sectionNumber}">
    <div class="section-sidebar">
      <span class="section-num">${sectionNumber}</span>
      <span class="section-label">${escapeHtml(docLabel.title)}</span>
      <span class="section-title-side">${escapeHtml(docLabel.tagline)}</span>
    </div>
    <div class="section-content">
      <h2 class="section-headline">${buildSectionHeadline(docLabel.title)}</h2>
      <p class="section-subtitle">${escapeHtml(docLabel.tagline)}</p>
      ${contentHtml}
    </div>
  </section>`;
  }).join("\n");

  const toc = exportSections.map((mod, idx) => {
    const docLabel = docLabels[mod.id] ?? { title: mod.label, tagline: mod.tagline };
    const sectionNumber = String(idx + 1).padStart(2, "0");
    return `<a href="#s${sectionNumber}" class="toc-item">
        <div class="toc-item-num">${sectionNumber}</div>
        <div class="toc-item-content">
          <div class="toc-item-title">${escapeHtml(docLabel.title)}</div>
          <div class="toc-item-desc">${escapeHtml(docLabel.tagline)}</div>
        </div>
      </a>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="${founderIsEnglish(locale) ? "en" : "fr"}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${founderIsEnglish(locale) ? "Project dossier" : "Dossier Projet"}${firstName ? ` · ${firstName}` : ""} — KORYXA Founder</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">
<style>
  :root {
    --ink: #0D0D0F;
    --paper: #F5F2EC;
    --gold: #B8963E;
    --gold-light: #D4AE5C;
    --gold-pale: #F0E6CC;
    --smoke: #E8E4DC;
    --mist: #C8C3B8;
    --charcoal: #2C2C30;
    --accent-red: #8B2020;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background: var(--paper);
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .print-action {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 20;
    background: var(--ink);
    color: #fff;
    border: 1px solid rgba(184,150,62,0.45);
    border-radius: 999px;
    padding: 12px 18px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.08em;
    cursor: pointer;
    box-shadow: 0 20px 45px rgba(0,0,0,0.22);
  }

  .cover {
    min-height: 100vh;
    background: var(--ink);
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: 56px 72px;
    position: relative;
    overflow: hidden;
  }
  .cover::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 420px; height: 420px;
    background: radial-gradient(circle at top right, rgba(184,150,62,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .cover::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 320px; height: 2px;
    background: linear-gradient(90deg, var(--gold) 0%, transparent 100%);
  }
  .cover-header, .cover-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    z-index: 1;
  }
  .brand-mark {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
  }
  .cover-meta {
    text-align: right;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--mist);
    letter-spacing: 0.05em;
    line-height: 2;
  }
  .cover-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 0 40px;
    position: relative;
    z-index: 1;
  }
  .cover-tag {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .cover-tag::before {
    content: '';
    width: 40px; height: 1px;
    background: var(--gold);
  }
  .cover-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: clamp(52px, 6vw, 88px);
    line-height: 1.0;
    color: #fff;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
  }
  .cover-title em {
    font-style: italic;
    color: var(--gold-light);
  }
  .cover-subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400;
    font-size: 22px;
    color: var(--mist);
    margin-top: 24px;
    font-style: italic;
  }
  .cover-divider {
    width: 80px; height: 1px;
    background: var(--gold);
    margin: 40px 0;
  }
  .cover-desc {
    font-size: 13px;
    color: #888;
    max-width: 520px;
    line-height: 1.9;
    letter-spacing: 0.02em;
  }
  .cover-footer {
    align-items: flex-end;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 32px;
  }
  .cover-footer-left {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #555;
    letter-spacing: 0.1em;
  }
  .sections-list {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
    max-width: 720px;
  }
  .section-pill {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold);
    border: 1px solid rgba(184,150,62,0.3);
    padding: 6px 14px;
    border-radius: 2px;
  }

  .toc-page {
    background: var(--smoke);
    padding: 96px 72px;
    border-bottom: 1px solid var(--mist);
  }
  .toc-inner { max-width: 1100px; margin: 0 auto; }
  .toc-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #8f887c;
    margin-bottom: 56px;
  }
  .toc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
  }
  .toc-item {
    display: flex;
    align-items: center;
    padding: 28px 0;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
  }
  .toc-item:hover { color: var(--gold); }
  .toc-item-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px;
    font-weight: 300;
    color: var(--mist);
    line-height: 1;
    width: 72px;
    flex-shrink: 0;
    transition: color 0.2s;
  }
  .toc-item:hover .toc-item-num { color: var(--gold); }
  .toc-item-content { flex: 1; padding-right: 32px; }
  .toc-item-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
    margin-bottom: 6px;
  }
  .toc-item-desc {
    font-size: 12px;
    color: #888;
    letter-spacing: 0.03em;
  }

  .document-shell { background: #fff; padding: 40px 0; }
  .document-body {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 72px;
  }
  .section {
    padding: 96px 0;
    border-bottom: 1px solid var(--smoke);
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 64px;
    align-items: start;
  }
  .section:last-child { border-bottom: none; }
  .section-sidebar {
    position: sticky;
    top: 40px;
  }
  .section-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 80px;
    font-weight: 300;
    line-height: 1;
    color: var(--smoke);
    display: block;
    margin-bottom: 16px;
    letter-spacing: -0.04em;
  }
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    display: block;
    margin-bottom: 8px;
  }
  .section-title-side {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    font-weight: 400;
    color: var(--charcoal);
    line-height: 1.4;
  }
  .section-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    font-weight: 500;
    line-height: 1.15;
    color: var(--ink);
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }
  .section-subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-style: italic;
    color: var(--gold);
    margin-bottom: 48px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--smoke);
  }
  .block { margin-bottom: 40px; }
  .block-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--charcoal);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .block-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--smoke);
  }
  .block p {
    font-size: 14px;
    line-height: 1.85;
    color: #3A3A3E;
    margin-bottom: 12px;
  }
  .callout {
    background: var(--ink);
    color: #fff;
    padding: 36px 40px;
    margin: 40px 0;
    position: relative;
    overflow: hidden;
  }
  .callout::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 4px; height: 100%;
    background: var(--gold);
  }
  .callout-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }
  .callout p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    line-height: 1.6;
    font-weight: 300;
    color: #eee;
  }
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin: 32px 0;
  }
  .card {
    padding: 28px 32px;
    border: 1px solid var(--smoke);
    position: relative;
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 2px;
    background: linear-gradient(90deg, var(--gold) 0%, transparent 100%);
  }
  .card-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 14px;
  }
  .card p {
    font-size: 13px;
    line-height: 1.8;
    color: var(--charcoal);
  }
  .criteria { display: grid; gap: 12px; margin: 24px 0 40px; }
  .criteria-item {
    display: flex;
    gap: 20px;
    padding: 20px 24px;
    background: var(--smoke);
    align-items: flex-start;
  }
  .criteria-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 300;
    color: var(--gold);
    line-height: 1;
    width: 32px;
    flex-shrink: 0;
  }
  .criteria-text {
    font-size: 13px;
    line-height: 1.7;
    color: var(--charcoal);
    padding-top: 4px;
  }
  .pillars {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    margin: 32px 0 40px;
  }
  .pillar {
    background: var(--smoke);
    padding: 32px 28px;
    position: relative;
  }
  .pillar-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px;
    font-weight: 300;
    color: var(--gold-pale);
    line-height: 1;
    margin-bottom: 16px;
  }
  .pillar-title {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--charcoal);
    margin-bottom: 12px;
  }
  .pillar p {
    font-size: 13px;
    line-height: 1.75;
    color: #555;
  }
  .alert-box {
    background: rgba(139,32,32,0.06);
    border-left: 3px solid var(--accent-red);
    padding: 24px 28px;
    margin: 28px 0 40px;
  }
  .export-alert {
    max-width: 1100px;
    margin: 56px auto 0;
  }
  .alert-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent-red);
    margin-bottom: 10px;
  }
  .alert-box p {
    font-size: 13px;
    line-height: 1.75;
    color: var(--charcoal);
  }
  strong { font-weight: 600; color: var(--ink); }
  em { font-style: italic; }
  code { font-family: 'DM Mono', monospace; background: var(--smoke); padding: 1px 5px; border-radius: 3px; }
  .doc-footer {
    background: var(--ink);
    padding: 56px 72px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .footer-brand {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 500;
    color: var(--gold);
    letter-spacing: 0.1em;
  }
  .footer-info {
    text-align: right;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #555;
    line-height: 2;
    letter-spacing: 0.05em;
  }
  @media print {
    .print-action { display: none !important; }
    .cover { page-break-after: always; min-height: auto; }
    .toc-page { page-break-after: always; }
    .section { page-break-inside: avoid; }
  }
  @media (max-width: 900px) {
    .cover, .toc-page, .document-body, .doc-footer { padding-left: 28px; padding-right: 28px; }
    .section { grid-template-columns: 1fr; gap: 24px; }
    .section-sidebar { position: static; }
    .section-num { font-size: 48px; }
    .toc-grid, .two-col, .pillars { grid-template-columns: 1fr; }
    .sections-list { display: none; }
    .print-action { right: 16px; bottom: 16px; }
  }
</style>
</head>
<body>
<button class="print-action" onclick="window.print()">${founderIsEnglish(locale) ? "PRINT · PDF" : "IMPRIMER · PDF"}</button>

<div class="cover">
  <div class="cover-header">
    <div class="brand-mark">KORYXA · ${founderIsEnglish(locale) ? "FOUNDER MODE" : "MODE FONDATEUR"}</div>
    <div class="cover-meta">
      <div>${founderIsEnglish(locale) ? "Tool" : "Outil"} · ChatLAYA Founder</div>
      <div>${founderIsEnglish(locale) ? "Date" : "Date"} · ${date}</div>
      <div>${founderIsEnglish(locale) ? "Sections" : "Sections"} · ${requiredWithFormulation} / ${requiredTotal} ${founderIsEnglish(locale) ? "drafted" : "rédigées"}</div>
    </div>
  </div>

  <div class="cover-center">
    <div class="cover-tag">${founderIsEnglish(locale) ? "Confidential project dossier" : "Dossier Projet Confidentiel"}</div>
    <div class="cover-title"><em>${escapeHtml(displayName.split(/\s+/)[0] || "Projet")}</em>${displayName.split(/\s+/).length > 1 ? `<br>${escapeHtml(displayName.split(/\s+/).slice(1).join(" "))}` : ""}</div>
    <div class="cover-subtitle">${founderIsEnglish(locale) ? "Business framing synthesis · ChatLAYA Founder" : "Synthèse de cadrage business · ChatLAYA Founder"}</div>
    <div class="cover-divider"></div>
    <p class="cover-desc">
      ${founderIsEnglish(locale) ? "This dossier presents the strategic framing generated with ChatLAYA Founder: ideal customer, core problem, offer, pricing, business model, sales pitch and action plan." : "Ce dossier présente le cadrage stratégique généré avec ChatLAYA Founder : client idéal, problème central, offre, prix, modèle économique, pitch commercial et plan d'action."}
    </p>
  </div>

  <div class="cover-footer">
    <div class="cover-footer-left">${isDossierComplete ? (founderIsEnglish(locale) ? "CONFIDENTIAL DOCUMENT" : "DOCUMENT CONFIDENTIEL") : (founderIsEnglish(locale) ? "WORKING DRAFT" : "BROUILLON DE TRAVAIL")}</div>
    <div class="sections-list">${coverPills}</div>
  </div>
</div>

<div class="toc-page">
  <div class="toc-inner">
    <div class="toc-label">${founderIsEnglish(locale) ? "Dossier contents" : "Sommaire du Dossier"}</div>
    <div class="toc-grid">${toc}</div>
  </div>
</div>

${incompleteHtml}

<div class="document-shell">
  <div class="document-body">
    ${sections}
  </div>
</div>

<div class="doc-footer">
  <div>
    <div class="footer-brand">KORYXA</div>
    <div style="font-family:'DM Mono',monospace; font-size:11px; color:#444; letter-spacing:0.05em; margin-top:8px;">${founderIsEnglish(locale) ? "FOUNDER MODE" : "MODE FONDATEUR"} · ChatLAYA Founder</div>
  </div>
  <div class="footer-info">
    <div>${founderIsEnglish(locale) ? "Confidential document" : "Document Confidentiel"}</div>
    <div>${escapeHtml(displayName)} · ${founderIsEnglish(locale) ? "Project dossier" : "Dossier Projet"}</div>
    <div>${date}</div>
  </div>
</div>
</body>
</html>`;
}

// ─── SynthesisView ────────────────────────────────────────────────────────────

interface SynthesisViewProps {
  ws: WorkspaceData;
  modules: ModuleDef[];
  locale: string;
  docLabels: Record<string, { title: string; tagline: string }>;
  firstName?: string;
  onBack: () => void;
  onExport: () => void;
}

function SynthesisView({ ws, modules, locale, docLabels, firstName, onBack, onExport }: SynthesisViewProps) {
  const copy = founderUi(locale);
  const [exportConfirm, setExportConfirm] = useState(false);
  const completed = modules.filter((m) => getMs(ws, m.id).status === "completed");
  // Only required sections matter for export readiness
  const withoutFormulation = completed.filter((m) => !m.optional && !getMs(ws, m.id).retention?.trim());
  const isExportReady = withoutFormulation.length === 0;

  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#E7DED0] bg-[#FFFCF7] shadow-[0_2px_16px_rgba(16,16,21,0.06)]">
      {/* Header */}
      <div className="shrink-0 border-b border-[#E7DED0] bg-gradient-to-r from-[#FFFCF7] to-[#F7F4EE] px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#6F6A60] transition hover:bg-white/80 hover:text-[#101015]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            {copy.synthesisBack}
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6F6A60]">{copy.synthesisTitle}</p>
            <p className="text-sm font-bold text-[#101015]">
              {firstName ? copy.synthesisProjectOf.replace("{name}", firstName) : copy.synthesisConsolidated}
            </p>
          </div>
          <button
            type="button"
            onClick={isExportReady ? onExport : () => setExportConfirm((v) => !v)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] ${isExportReady ? "bg-[#101015] ring-1 ring-[#B8963E]/30 hover:bg-[#1A1A20]" : "bg-amber-500 hover:bg-amber-600"}`}
          >
            <Download className="h-3.5 w-3.5" />
            {isExportReady ? copy.exportPdf : copy.exportIncomplete.replace("{count}", String(withoutFormulation.length)).replaceAll("{plural}", withoutFormulation.length > 1 ? "s" : "")}
          </button>
        </div>
      </div>

      {/* Export confirmation — shown when required sections have no user formulation */}
      {exportConfirm ? (
        <div className="shrink-0 border-b border-[#E7DED0] bg-[#F0E6CC]/50 px-5 py-3">
          <div className="flex flex-wrap items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B8963E]" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#3A3020]">
                {copy.noFormulationWarning.replace("{count}", String(withoutFormulation.length)).replaceAll("{plural}", withoutFormulation.length > 1 ? "s" : "")}
              </p>
              <p className="mt-0.5 text-[11px] text-[#6F4E20]">
                {copy.noFormulationSections.replace("{sections}", withoutFormulation.map((m) => docLabels[m.id]?.title ?? m.label).join(", "))}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => setExportConfirm(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#8A6A20] transition hover:bg-[#F0E6CC]">
                {copy.cancel}
              </button>
              <button type="button" onClick={() => { setExportConfirm(false); onExport(); }}
                className="rounded-lg bg-[#101015] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1A1A20]">
                {copy.exportAnyway}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        <div className="mx-auto max-w-2xl">

          {/* Missing formulation hint */}
          {withoutFormulation.length > 0 ? (
            <div className="mb-6 rounded-xl border border-[#E7DED0] bg-[#F0E6CC]/50 px-4 py-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B8963E]" />
                <div>
                  <p className="text-xs font-semibold text-[#3A3020]">
                    {copy.noFinalFormulation.replace("{count}", String(withoutFormulation.length)).replaceAll("{plural}", withoutFormulation.length > 1 ? "s" : "")}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-[#6F4E20]">
                    {copy.noFinalFormulationBody.replace("{sections}", withoutFormulation.map((m) => docLabels[m.id]?.title ?? m.label).join(", "))}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Intro */}
          <div className="mb-8 rounded-2xl border border-[#E7DED0] bg-gradient-to-br from-[#FFFCF7] to-[#F7F4EE] px-5 py-5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">{copy.synthesisIntroBadge}</p>
            <p className="text-sm leading-relaxed text-[#6F6A60]">
              {copy.synthesisIntroBody.replace("{count}", String(completed.length)).replaceAll("{plural}", completed.length > 1 ? "s" : "")}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {completed.map((mod, modIdx) => {
              const mws = getMs(ws, mod.id);
              const Icon = mod.icon;
              const docLabel = docLabels[mod.id] ?? { title: mod.label, tagline: mod.tagline };
              const hasRetention = !!mws.retention?.trim();
              return (
                <div key={mod.id}>
                  {modIdx > 0 && <div className="mb-8 border-t border-slate-100" />}

                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#101015] text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6F6A60]">
                        {founderIsEnglish(locale) ? `Step ${mod.step}${mod.optional ? ` · ${copy.optionalStep}` : ""}` : `Étape ${mod.step}${mod.optional ? ` · ${copy.optionalStep}` : ""}`}
                      </p>
                      <p className="text-sm font-bold text-[#101015]">{docLabel.title}</p>
                    </div>
                    <div className="kx-founder-validated flex items-center gap-1.5 rounded-full bg-[#F0E6CC]/70 px-3 py-1 text-[11px] font-semibold text-[#8A6A20] ring-1 ring-[#E7DED0]">
                      <Check className="h-3 w-3" />
                      {copy.validated}
                    </div>
                  </div>

                  {/* Main content — retention (project) or AI output (coaching fallback) */}
                  {hasRetention ? (
                    <div className="rounded-xl border border-[#E7DED0] bg-[#FFFCF7]/60 p-5">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">
                        {copy.finalFormulation}
                      </p>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#101015]">{mws.retention}</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[#E7DED0] bg-[#F7F4EE]/40 p-5">
                      <p className="mb-2 text-[10px] font-medium text-[#6F6A60]">
                        {copy.coachingAnswerFallback}
                      </p>
                      <FounderOutput content={mws.output!} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={isExportReady ? onExport : () => setExportConfirm((v) => !v)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md transition active:scale-[0.98] ${isExportReady ? "bg-[#101015] ring-1 ring-[#B8963E]/30 hover:bg-[#1A1A20]" : "bg-amber-500 hover:bg-amber-600"}`}
            >
              <Download className="h-4 w-4" />
              {isExportReady ? copy.downloadHtmlPdf : copy.exportIncompleteDossier}
            </button>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </section>
  );
}

// ─── FounderWorkspace ─────────────────────────────────────────────────────────

interface FounderWorkspaceProps {
  conversationId: string | null;
  firstName?: string;
  loginHref?: string;
  signupHref?: string;
  authRequired?: boolean;
  conversations?: FounderConversation[];
  selectedConversationId?: string | null;
  historyLoading?: boolean;
  onSelectConversation?: (conversationId: string) => void;
  onCreateConversation?: () => void;
  onArchiveConversation?: (conversationId: string) => void;
  onExit: () => void;
}

// ─── Diagnostic IA Founder ───────────────────────────────────────────────────

const DIAGNOSTIC_SCORE_KEYS = [
  "client_clarity", "problem_clarity", "offer_strength", "pricing_coherence",
  "business_model", "validation", "sales_readiness", "execution_readiness",
] as const;

const DIAGNOSTIC_SCORE_LABELS_FR: Record<string, string> = {
  client_clarity: "Clarté client", problem_clarity: "Clarté problème",
  offer_strength: "Force de l'offre", pricing_coherence: "Cohérence prix",
  business_model: "Modèle éco", validation: "Validation",
  sales_readiness: "Prêt à vendre", execution_readiness: "Prêt à exécuter",
};
const DIAGNOSTIC_SCORE_LABELS_EN: Record<string, string> = {
  client_clarity: "Client clarity", problem_clarity: "Problem clarity",
  offer_strength: "Offer strength", pricing_coherence: "Pricing coherence",
  business_model: "Business model", validation: "Validation",
  sales_readiness: "Sales readiness", execution_readiness: "Execution readiness",
};

type FounderDiagnosticBlockProps = {
  analysis: FounderCadrageAnalysis | null;
  loading: boolean;
  error: string | null;
  locale: string;
  onRun: () => void;
};

function FounderDiagnosticBlock({ analysis, loading, error, locale, onRun }: FounderDiagnosticBlockProps) {
  const isEnglish = founderIsEnglish(locale);
  const scoreLabels = isEnglish ? DIAGNOSTIC_SCORE_LABELS_EN : DIAGNOSTIC_SCORE_LABELS_FR;
  const scores = analysis?.maturity_scores;
  const nba = analysis?.next_best_action;

  return (
    <div className="rounded-2xl border border-[#B8963E]/30 bg-gradient-to-br from-[#F7F4EE] to-[#FFFCF7] p-5 shadow-[0_4px_24px_rgba(184,150,62,0.08)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#101015]">
            <BarChart2 className="h-3.5 w-3.5 text-[#B8963E]" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">
              {isEnglish ? "AI Founder Diagnostic" : "Diagnostic IA Founder"}
            </p>
            {analysis ? (
              <p className="text-[10px] text-[#6F6A60]">
                {isEnglish ? "Last analysis available" : "Dernière analyse disponible"}
              </p>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onRun}
          disabled={loading}
          className="flex shrink-0 items-center gap-2 rounded-full bg-[#101015] px-4 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-[#B8963E]/20 transition hover:bg-[#1A1A20] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="h-3 w-3 animate-spin text-[#B8963E]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="28.3 28.3" />
              </svg>
              {isEnglish ? "Analysing…" : "Analyse en cours…"}
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 text-[#B8963E]" />
              {analysis
                ? (isEnglish ? "Regenerate" : "Régénérer")
                : (isEnglish ? "Run AI Diagnostic" : "Lancer le diagnostic IA")}
            </>
          )}
        </button>
      </div>

      {error ? (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      ) : null}

      {analysis ? (
        <div className="space-y-4">
          {typeof scores?.global === "number" ? (
            <div className="rounded-xl border border-[#E7DED0] bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#101015]">
                  {isEnglish ? "Global score" : "Score global"}
                </span>
                <span className="text-lg font-bold text-[#B8963E]">
                  {scores.global}
                  <span className="text-xs font-normal text-[#6F6A60]">/100</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F0E6CC]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#D4B26A] to-[#B8963E] transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, scores.global))}%` }}
                />
              </div>
            </div>
          ) : null}

          {scores && DIAGNOSTIC_SCORE_KEYS.some((k) => typeof scores[k] === "number") ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DIAGNOSTIC_SCORE_KEYS.map((key) => {
                const val = scores[key];
                if (typeof val !== "number") return null;
                return (
                  <div key={key} className="rounded-xl border border-[#E7DED0] bg-white px-3 py-2">
                    <p className="text-[10px] font-medium text-[#6F6A60]">{scoreLabels[key]}</p>
                    <p className="mt-0.5 text-sm font-bold text-[#101015]">
                      {val}<span className="text-[10px] font-normal text-[#6F6A60]">/100</span>
                    </p>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#F0E6CC]">
                      <div
                        className="h-full rounded-full bg-[#B8963E] transition-all duration-700"
                        style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {analysis.summary ? (
            <div className="rounded-xl border border-[#E7DED0] bg-white px-4 py-3">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#6F6A60]">
                {isEnglish ? "Summary" : "Résumé"}
              </p>
              <p className="text-xs leading-relaxed text-[#3A3530]">{analysis.summary}</p>
            </div>
          ) : null}

          {(analysis.strengths?.length || analysis.risks?.length) ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {analysis.strengths?.length ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                    {isEnglish ? "Strengths" : "Forces"}
                  </p>
                  <ul className="space-y-1">
                    {analysis.strengths.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-800">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {analysis.risks?.length ? (
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 px-4 py-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                    {isEnglish ? "Risks" : "Risques"}
                  </p>
                  <ul className="space-y-1">
                    {analysis.risks.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-amber-800">
                        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {analysis.missing_information?.length ? (
            <div className="rounded-xl border border-[#E7DED0] bg-[#F7F4EE] px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6F6A60]">
                {isEnglish ? "Missing information" : "Informations manquantes"}
              </p>
              <ul className="space-y-1">
                {analysis.missing_information.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-[#6F6A60]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {nba && (nba.title || nba.why || nba.how || nba.expected_output) ? (
            <div className="rounded-xl border border-[#B8963E]/30 bg-gradient-to-br from-[#F0E6CC]/40 to-white px-4 py-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">
                {isEnglish ? "Next best action" : "Prochaine meilleure action"}
              </p>
              {nba.title ? <p className="text-sm font-bold text-[#101015]">{nba.title}</p> : null}
              {nba.why ? (
                <p className="mt-1.5 text-xs leading-relaxed text-[#6F6A60]">
                  <span className="font-semibold text-[#3A3530]">{isEnglish ? "Why: " : "Pourquoi : "}</span>
                  {nba.why}
                </p>
              ) : null}
              {nba.how ? (
                <p className="mt-1 text-xs leading-relaxed text-[#6F6A60]">
                  <span className="font-semibold text-[#3A3530]">{isEnglish ? "How: " : "Comment : "}</span>
                  {nba.how}
                </p>
              ) : null}
              {nba.expected_output ? (
                <p className="mt-1 text-xs leading-relaxed text-[#6F6A60]">
                  <span className="font-semibold text-[#3A3530]">{isEnglish ? "Expected output: " : "Résultat attendu : "}</span>
                  {nba.expected_output}
                </p>
              ) : null}
            </div>
          ) : null}

          {analysis.roadmap_7_days?.length ? (
            <div className="rounded-xl border border-[#E7DED0] bg-white px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6F6A60]">
                {isEnglish ? "7-day roadmap" : "Roadmap 7 jours"}
              </p>
              <ol className="space-y-1">
                {analysis.roadmap_7_days.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#3A3530]">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F0E6CC] text-[9px] font-bold text-[#8A6A20]">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      ) : !loading && !error ? (
        <p className="text-xs text-[#6F6A60]">
          {isEnglish
            ? "No diagnostic yet. Click \"Run AI Diagnostic\" to analyse your project."
            : "Aucun diagnostic disponible. Cliquez sur « Lancer le diagnostic IA » pour analyser votre projet."}
        </p>
      ) : null}
    </div>
  );
}

// ─── Client & Problème IA ────────────────────────────────────────────────────

const CLIENT_PROBLEM_SCORE_KEYS = [
  "client_precision", "problem_intensity", "market_accessibility", "validation_readiness",
] as const;

const CLIENT_PROBLEM_SCORE_LABELS_FR: Record<string, string> = {
  client_precision: "Précision client",
  problem_intensity: "Intensité problème",
  market_accessibility: "Accessibilité marché",
  validation_readiness: "Prêt à valider",
};
const CLIENT_PROBLEM_SCORE_LABELS_EN: Record<string, string> = {
  client_precision: "Client precision",
  problem_intensity: "Problem intensity",
  market_accessibility: "Market accessibility",
  validation_readiness: "Validation readiness",
};

type FounderClientProblemBlockProps = {
  analysis: FounderClientProblemAnalysis | null;
  loading: boolean;
  error: string | null;
  locale: string;
  onRun: () => void;
};

function FounderClientProblemBlock({ analysis, loading, error, locale, onRun }: FounderClientProblemBlockProps) {
  const isEnglish = founderIsEnglish(locale);
  const scoreLabels = isEnglish ? CLIENT_PROBLEM_SCORE_LABELS_EN : CLIENT_PROBLEM_SCORE_LABELS_FR;
  const scores = analysis?.scores;
  const nba = analysis?.next_best_action;
  const tc = analysis?.target_client;
  const prob = analysis?.problem;
  const val = analysis?.validation;

  return (
    <div className="rounded-2xl border border-[#B8963E]/30 bg-gradient-to-br from-[#F7F4EE] to-[#FFFCF7] p-5 shadow-[0_4px_24px_rgba(184,150,62,0.08)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#101015]">
            <Target className="h-3.5 w-3.5 text-[#B8963E]" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">
              {isEnglish ? "Client & Problem IA" : "Client & Problème IA"}
            </p>
            {analysis ? (
              <p className="text-[10px] text-[#6F6A60]">
                {isEnglish ? "Last analysis available" : "Dernière analyse disponible"}
              </p>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onRun}
          disabled={loading}
          className="flex shrink-0 items-center gap-2 rounded-full bg-[#101015] px-4 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-[#B8963E]/20 transition hover:bg-[#1A1A20] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="h-3 w-3 animate-spin text-[#B8963E]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="28.3 28.3" />
              </svg>
              {isEnglish ? "Analysing…" : "Analyse en cours…"}
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 text-[#B8963E]" />
              {analysis
                ? (isEnglish ? "Regenerate" : "Régénérer")
                : (isEnglish ? "Analyse client & problem" : "Analyser client & problème")}
            </>
          )}
        </button>
      </div>

      {error ? (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      ) : null}

      {analysis ? (
        <div className="space-y-4">
          {/* Global score */}
          {typeof scores?.global === "number" ? (
            <div className="rounded-xl border border-[#E7DED0] bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#101015]">
                  {isEnglish ? "Global score" : "Score global"}
                </span>
                <span className="text-lg font-bold text-[#B8963E]">
                  {scores.global}
                  <span className="text-xs font-normal text-[#6F6A60]">/100</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F0E6CC]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#D4B26A] to-[#B8963E] transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, scores.global))}%` }}
                />
              </div>
            </div>
          ) : null}

          {/* Score cards */}
          {scores && CLIENT_PROBLEM_SCORE_KEYS.some((k) => typeof scores[k] === "number") ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CLIENT_PROBLEM_SCORE_KEYS.map((key) => {
                const scoreVal = scores[key];
                if (typeof scoreVal !== "number") return null;
                return (
                  <div key={key} className="rounded-xl border border-[#E7DED0] bg-white px-3 py-2">
                    <p className="text-[10px] font-medium text-[#6F6A60]">{scoreLabels[key]}</p>
                    <p className="mt-0.5 text-sm font-bold text-[#101015]">
                      {scoreVal}<span className="text-[10px] font-normal text-[#6F6A60]">/100</span>
                    </p>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#F0E6CC]">
                      <div
                        className="h-full rounded-full bg-[#B8963E] transition-all duration-700"
                        style={{ width: `${Math.min(100, Math.max(0, scoreVal))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Client cible */}
          {tc && (tc.segment || tc.profile || tc.context || tc.ability_to_pay || tc.access_channel) ? (
            <div className="rounded-xl border border-[#E7DED0] bg-white px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">
                {isEnglish ? "Target client" : "Client cible"}
              </p>
              <dl className="space-y-1">
                {tc.segment ? (
                  <div className="flex gap-2 text-xs">
                    <dt className="w-32 shrink-0 font-semibold text-[#3A3530]">{isEnglish ? "Segment" : "Segment"}</dt>
                    <dd className="text-[#6F6A60]">{tc.segment}</dd>
                  </div>
                ) : null}
                {tc.profile ? (
                  <div className="flex gap-2 text-xs">
                    <dt className="w-32 shrink-0 font-semibold text-[#3A3530]">{isEnglish ? "Profile" : "Profil"}</dt>
                    <dd className="text-[#6F6A60]">{tc.profile}</dd>
                  </div>
                ) : null}
                {tc.context ? (
                  <div className="flex gap-2 text-xs">
                    <dt className="w-32 shrink-0 font-semibold text-[#3A3530]">{isEnglish ? "Context" : "Contexte"}</dt>
                    <dd className="text-[#6F6A60]">{tc.context}</dd>
                  </div>
                ) : null}
                {tc.ability_to_pay ? (
                  <div className="flex gap-2 text-xs">
                    <dt className="w-32 shrink-0 font-semibold text-[#3A3530]">{isEnglish ? "Ability to pay" : "Capacité de paiement"}</dt>
                    <dd className="text-[#6F6A60]">{tc.ability_to_pay}</dd>
                  </div>
                ) : null}
                {tc.access_channel ? (
                  <div className="flex gap-2 text-xs">
                    <dt className="w-32 shrink-0 font-semibold text-[#3A3530]">{isEnglish ? "Access channel" : "Canal d'accès"}</dt>
                    <dd className="text-[#6F6A60]">{tc.access_channel}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}

          {/* Problème */}
          {prob && (prob.main_problem || typeof prob.pain_level === "number" || prob.frequency || prob.consequences?.length || prob.current_alternatives?.length) ? (
            <div className="rounded-xl border border-[#E7DED0] bg-white px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">
                {isEnglish ? "Problem" : "Problème"}
              </p>
              <dl className="space-y-2">
                {prob.main_problem ? (
                  <div className="text-xs">
                    <dt className="mb-0.5 font-semibold text-[#3A3530]">{isEnglish ? "Main problem" : "Problème principal"}</dt>
                    <dd className="text-[#6F6A60]">{prob.main_problem}</dd>
                  </div>
                ) : null}
                {typeof prob.pain_level === "number" ? (
                  <div className="text-xs">
                    <div className="flex items-center justify-between">
                      <dt className="font-semibold text-[#3A3530]">{isEnglish ? "Pain intensity" : "Intensité"}</dt>
                      <dd className="font-bold text-[#B8963E]">{prob.pain_level}/10</dd>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#F0E6CC]">
                      <div className="h-full rounded-full bg-[#B8963E] transition-all duration-700" style={{ width: `${prob.pain_level * 10}%` }} />
                    </div>
                  </div>
                ) : null}
                {prob.frequency ? (
                  <div className="flex gap-2 text-xs">
                    <dt className="w-32 shrink-0 font-semibold text-[#3A3530]">{isEnglish ? "Frequency" : "Fréquence"}</dt>
                    <dd className="text-[#6F6A60]">{prob.frequency}</dd>
                  </div>
                ) : null}
                {prob.consequences?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "Consequences" : "Conséquences"}</dt>
                    <ul className="space-y-0.5">
                      {prob.consequences.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#6F6A60]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {prob.current_alternatives?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "Current alternatives" : "Alternatives actuelles"}</dt>
                    <ul className="space-y-0.5">
                      {prob.current_alternatives.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#6F6A60]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}

          {/* Validation */}
          {val && (val.critical_assumptions?.length || val.field_questions?.length || val.people_to_contact?.length || val.validation_method || val.success_criteria?.length) ? (
            <div className="rounded-xl border border-[#E7DED0] bg-white px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">
                {isEnglish ? "Validation" : "Validation terrain"}
              </p>
              <dl className="space-y-2">
                {val.critical_assumptions?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "Critical assumptions" : "Hypothèses critiques"}</dt>
                    <ul className="space-y-0.5">
                      {val.critical_assumptions.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#6F6A60]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {val.field_questions?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "Field questions" : "Questions terrain"}</dt>
                    <ol className="space-y-0.5">
                      {val.field_questions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#6F6A60]">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F0E6CC] text-[9px] font-bold text-[#8A6A20]">{i + 1}</span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
                {val.people_to_contact?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "People to contact" : "Personnes à contacter"}</dt>
                    <ul className="space-y-0.5">
                      {val.people_to_contact.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#6F6A60]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {val.validation_method ? (
                  <div className="flex gap-2 text-xs">
                    <dt className="w-32 shrink-0 font-semibold text-[#3A3530]">{isEnglish ? "Method" : "Méthode"}</dt>
                    <dd className="text-[#6F6A60]">{val.validation_method}</dd>
                  </div>
                ) : null}
                {val.success_criteria?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "Success criteria" : "Critères de succès"}</dt>
                    <ul className="space-y-0.5">
                      {val.success_criteria.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#6F6A60]">
                          <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}

          {/* Forces / Risques */}
          {(analysis.strengths?.length || analysis.risks?.length) ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {analysis.strengths?.length ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                    {isEnglish ? "Strengths" : "Forces"}
                  </p>
                  <ul className="space-y-1">
                    {analysis.strengths.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-800">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {analysis.risks?.length ? (
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 px-4 py-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                    {isEnglish ? "Risks" : "Risques"}
                  </p>
                  <ul className="space-y-1">
                    {analysis.risks.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-amber-800">
                        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Informations manquantes */}
          {analysis.missing_information?.length ? (
            <div className="rounded-xl border border-[#E7DED0] bg-[#F7F4EE] px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6F6A60]">
                {isEnglish ? "Missing information" : "Informations manquantes"}
              </p>
              <ul className="space-y-1">
                {analysis.missing_information.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-[#6F6A60]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Prochaine meilleure action */}
          {nba && (nba.title || nba.why || nba.how || nba.expected_output) ? (
            <div className="rounded-xl border border-[#B8963E]/30 bg-gradient-to-br from-[#F0E6CC]/40 to-white px-4 py-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">
                {isEnglish ? "Next best action" : "Prochaine meilleure action"}
              </p>
              {nba.title ? <p className="text-sm font-bold text-[#101015]">{nba.title}</p> : null}
              {nba.why ? (
                <p className="mt-1.5 text-xs leading-relaxed text-[#6F6A60]">
                  <span className="font-semibold text-[#3A3530]">{isEnglish ? "Why: " : "Pourquoi : "}</span>
                  {nba.why}
                </p>
              ) : null}
              {nba.how ? (
                <p className="mt-1 text-xs leading-relaxed text-[#6F6A60]">
                  <span className="font-semibold text-[#3A3530]">{isEnglish ? "How: " : "Comment : "}</span>
                  {nba.how}
                </p>
              ) : null}
              {nba.expected_output ? (
                <p className="mt-1 text-xs leading-relaxed text-[#6F6A60]">
                  <span className="font-semibold text-[#3A3530]">{isEnglish ? "Expected output: " : "Résultat attendu : "}</span>
                  {nba.expected_output}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : !loading && !error ? (
        <p className="text-xs text-[#6F6A60]">
          {isEnglish
            ? "No analysis yet. Click \"Analyse client & problem\" to start."
            : "Aucune analyse disponible. Cliquez sur « Analyser client & problème » pour démarrer."}
        </p>
      ) : null}
    </div>
  );
}

// ─── Offre & Valeur IA ──────────────────────────────────────────────────────

const OFFER_VALUE_SCORE_KEYS = [
  "offer_clarity", "value_strength", "differentiation", "trust_readiness", "testability",
] as const;

const OFFER_VALUE_SCORE_LABELS_FR: Record<string, string> = {
  offer_clarity: "Clarté de l'offre",
  value_strength: "Force de valeur",
  differentiation: "Différenciation",
  trust_readiness: "Confiance",
  testability: "Testabilité",
};
const OFFER_VALUE_SCORE_LABELS_EN: Record<string, string> = {
  offer_clarity: "Offer clarity",
  value_strength: "Value strength",
  differentiation: "Differentiation",
  trust_readiness: "Trust readiness",
  testability: "Testability",
};

type FounderOfferValueBlockProps = {
  analysis: FounderOfferValueAnalysis | null;
  loading: boolean;
  error: string | null;
  locale: string;
  onRun: () => void;
};

function FounderOfferValueBlock({ analysis, loading, error, locale, onRun }: FounderOfferValueBlockProps) {
  const isEnglish = founderIsEnglish(locale);
  const scoreLabels = isEnglish ? OFFER_VALUE_SCORE_LABELS_EN : OFFER_VALUE_SCORE_LABELS_FR;
  const scores = analysis?.scores;
  const nba = analysis?.next_best_action;
  const vp = analysis?.value_proposition;
  const offer = analysis?.offer;
  const cf = analysis?.customer_fit;

  return (
    <div className="rounded-2xl border border-[#B8963E]/30 bg-gradient-to-br from-[#F7F4EE] to-[#FFFCF7] p-5 shadow-[0_4px_24px_rgba(184,150,62,0.08)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#101015]">
            <Package className="h-3.5 w-3.5 text-[#B8963E]" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">
              {isEnglish ? "Offer & Value IA" : "Offre & Valeur IA"}
            </p>
            {analysis ? (
              <p className="text-[10px] text-[#6F6A60]">
                {isEnglish ? "Last analysis available" : "Dernière analyse disponible"}
              </p>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onRun}
          disabled={loading}
          className="flex shrink-0 items-center gap-2 rounded-full bg-[#101015] px-4 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-[#B8963E]/20 transition hover:bg-[#1A1A20] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="h-3 w-3 animate-spin text-[#B8963E]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="28.3 28.3" />
              </svg>
              {isEnglish ? "Analysing…" : "Analyse en cours…"}
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 text-[#B8963E]" />
              {analysis
                ? (isEnglish ? "Regenerate" : "Régénérer")
                : (isEnglish ? "Analyse offer & value" : "Analyser offre & valeur")}
            </>
          )}
        </button>
      </div>

      {error ? (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      ) : null}

      {analysis ? (
        <div className="space-y-4">
          {/* Global score */}
          {typeof scores?.global === "number" ? (
            <div className="rounded-xl border border-[#E7DED0] bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#101015]">
                  {isEnglish ? "Global score" : "Score global"}
                </span>
                <span className="text-lg font-bold text-[#B8963E]">
                  {scores.global}
                  <span className="text-xs font-normal text-[#6F6A60]">/100</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F0E6CC]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#D4B26A] to-[#B8963E] transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, scores.global))}%` }}
                />
              </div>
            </div>
          ) : null}

          {/* Score cards */}
          {scores && OFFER_VALUE_SCORE_KEYS.some((k) => typeof scores[k] === "number") ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {OFFER_VALUE_SCORE_KEYS.map((key) => {
                const scoreVal = scores[key];
                if (typeof scoreVal !== "number") return null;
                return (
                  <div key={key} className="rounded-xl border border-[#E7DED0] bg-white px-3 py-2">
                    <p className="text-[10px] font-medium text-[#6F6A60]">{scoreLabels[key]}</p>
                    <p className="mt-0.5 text-sm font-bold text-[#101015]">
                      {scoreVal}<span className="text-[10px] font-normal text-[#6F6A60]">/100</span>
                    </p>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#F0E6CC]">
                      <div
                        className="h-full rounded-full bg-[#B8963E] transition-all duration-700"
                        style={{ width: `${Math.min(100, Math.max(0, scoreVal))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Proposition de valeur */}
          {vp && (vp.promise || vp.target_result || vp.main_benefits?.length || vp.differentiation || vp.proof_needed?.length) ? (
            <div className="rounded-xl border border-[#E7DED0] bg-white px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">
                {isEnglish ? "Value proposition" : "Proposition de valeur"}
              </p>
              <dl className="space-y-2">
                {vp.promise ? (
                  <div className="text-xs">
                    <dt className="mb-0.5 font-semibold text-[#3A3530]">{isEnglish ? "Promise" : "Promesse"}</dt>
                    <dd className="text-[#6F6A60]">{vp.promise}</dd>
                  </div>
                ) : null}
                {vp.target_result ? (
                  <div className="text-xs">
                    <dt className="mb-0.5 font-semibold text-[#3A3530]">{isEnglish ? "Target result" : "Résultat cible"}</dt>
                    <dd className="text-[#6F6A60]">{vp.target_result}</dd>
                  </div>
                ) : null}
                {vp.differentiation ? (
                  <div className="text-xs">
                    <dt className="mb-0.5 font-semibold text-[#3A3530]">{isEnglish ? "Differentiation" : "Différenciation"}</dt>
                    <dd className="text-[#6F6A60]">{vp.differentiation}</dd>
                  </div>
                ) : null}
                {vp.main_benefits?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "Main benefits" : "Bénéfices principaux"}</dt>
                    <ul className="space-y-0.5">
                      {vp.main_benefits.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#6F6A60]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {vp.proof_needed?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "Proof needed" : "Preuves nécessaires"}</dt>
                    <ul className="space-y-0.5">
                      {vp.proof_needed.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#6F6A60]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}

          {/* Offre */}
          {offer && (offer.main_offer || offer.entry_offer || offer.premium_offer || offer.deliverables?.length || offer.conditions?.length) ? (
            <div className="rounded-xl border border-[#E7DED0] bg-white px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">
                {isEnglish ? "Offer" : "Offre"}
              </p>
              <dl className="space-y-2">
                {offer.main_offer ? (
                  <div className="text-xs">
                    <dt className="mb-0.5 font-semibold text-[#3A3530]">{isEnglish ? "Main offer" : "Offre principale"}</dt>
                    <dd className="text-[#6F6A60]">{offer.main_offer}</dd>
                  </div>
                ) : null}
                {offer.entry_offer ? (
                  <div className="text-xs">
                    <dt className="mb-0.5 font-semibold text-[#3A3530]">{isEnglish ? "Entry offer" : "Offre d'appel"}</dt>
                    <dd className="text-[#6F6A60]">{offer.entry_offer}</dd>
                  </div>
                ) : null}
                {offer.premium_offer ? (
                  <div className="text-xs">
                    <dt className="mb-0.5 font-semibold text-[#3A3530]">{isEnglish ? "Premium offer" : "Offre premium"}</dt>
                    <dd className="text-[#6F6A60]">{offer.premium_offer}</dd>
                  </div>
                ) : null}
                {offer.deliverables?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "Deliverables" : "Livrables"}</dt>
                    <ul className="space-y-0.5">
                      {offer.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#6F6A60]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {offer.conditions?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "Conditions" : "Conditions"}</dt>
                    <ul className="space-y-0.5">
                      {offer.conditions.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#6F6A60]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}

          {/* Adéquation client */}
          {cf && (cf.pains_addressed?.length || cf.gains_created?.length || cf.objections?.length || cf.trust_builders?.length) ? (
            <div className="rounded-xl border border-[#E7DED0] bg-white px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">
                {isEnglish ? "Customer fit" : "Adéquation client"}
              </p>
              <dl className="space-y-2">
                {cf.pains_addressed?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "Pains addressed" : "Douleurs traitées"}</dt>
                    <ul className="space-y-0.5">
                      {cf.pains_addressed.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#6F6A60]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {cf.gains_created?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "Gains created" : "Gains créés"}</dt>
                    <ul className="space-y-0.5">
                      {cf.gains_created.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#6F6A60]">
                          <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {cf.objections?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "Objections" : "Objections"}</dt>
                    <ul className="space-y-0.5">
                      {cf.objections.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#6F6A60]">
                          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {cf.trust_builders?.length ? (
                  <div className="text-xs">
                    <dt className="mb-1 font-semibold text-[#3A3530]">{isEnglish ? "Trust builders" : "Éléments de confiance"}</dt>
                    <ul className="space-y-0.5">
                      {cf.trust_builders.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#6F6A60]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}

          {/* Forces / Risques */}
          {(analysis.strengths?.length || analysis.risks?.length) ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {analysis.strengths?.length ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                    {isEnglish ? "Strengths" : "Forces"}
                  </p>
                  <ul className="space-y-1">
                    {analysis.strengths.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-800">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {analysis.risks?.length ? (
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 px-4 py-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                    {isEnglish ? "Risks" : "Risques"}
                  </p>
                  <ul className="space-y-1">
                    {analysis.risks.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-amber-800">
                        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Informations manquantes */}
          {analysis.missing_information?.length ? (
            <div className="rounded-xl border border-[#E7DED0] bg-[#F7F4EE] px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6F6A60]">
                {isEnglish ? "Missing information" : "Informations manquantes"}
              </p>
              <ul className="space-y-1">
                {analysis.missing_information.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-[#6F6A60]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8963E]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Prochaine meilleure action */}
          {nba && (nba.title || nba.why || nba.how || nba.expected_output) ? (
            <div className="rounded-xl border border-[#B8963E]/30 bg-gradient-to-br from-[#F0E6CC]/40 to-white px-4 py-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">
                {isEnglish ? "Next best action" : "Prochaine meilleure action"}
              </p>
              {nba.title ? <p className="text-sm font-bold text-[#101015]">{nba.title}</p> : null}
              {nba.why ? (
                <p className="mt-1.5 text-xs leading-relaxed text-[#6F6A60]">
                  <span className="font-semibold text-[#3A3530]">{isEnglish ? "Why: " : "Pourquoi : "}</span>
                  {nba.why}
                </p>
              ) : null}
              {nba.how ? (
                Array.isArray(nba.how) ? (
                  <div className="mt-1">
                    <p className="text-xs font-semibold text-[#3A3530]">{isEnglish ? "How:" : "Comment :"}</p>
                    <ol className="mt-1 space-y-0.5">
                      {nba.how.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#6F6A60]">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F0E6CC] text-[9px] font-bold text-[#8A6A20]">{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <p className="mt-1 text-xs leading-relaxed text-[#6F6A60]">
                    <span className="font-semibold text-[#3A3530]">{isEnglish ? "How: " : "Comment : "}</span>
                    {nba.how}
                  </p>
                )
              ) : null}
              {nba.expected_output ? (
                <p className="mt-1 text-xs leading-relaxed text-[#6F6A60]">
                  <span className="font-semibold text-[#3A3530]">{isEnglish ? "Expected output: " : "Résultat attendu : "}</span>
                  {nba.expected_output}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : !loading && !error ? (
        <p className="text-xs text-[#6F6A60]">
          {isEnglish
            ? "No analysis yet. Click \"Analyse offer & value\" to start."
            : "Aucune analyse disponible. Cliquez sur « Analyser offre & valeur » pour démarrer."}
        </p>
      ) : null}
    </div>
  );
}

function FounderAccountButton({ firstName }: { firstName?: string }) {
  const locale = typeof window !== "undefined" && window.location.pathname.startsWith("/en") ? "en" : "fr";
  const label = firstName
    ? founderIsEnglish(locale) ? "Open Founder workspace" : "Ouvrir l'espace Founder"
    : founderIsEnglish(locale) ? "Sign in to Founder" : "Se connecter a Founder";
  const href = resolveFounderLoginHref();

  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#101015] text-white shadow-[0_12px_28px_rgba(16,16,21,0.22)] ring-1 ring-[#B8963E]/20 transition hover:-translate-y-0.5 hover:bg-[#B8963E] hover:shadow-[0_16px_34px_rgba(184,150,62,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8963E] focus-visible:ring-offset-2"
    >
      <UserRound className="h-4 w-4" />
    </a>
  );
}

export default function FounderWorkspace({
  conversationId,
  firstName,
  loginHref,
  signupHref,
  authRequired = false,
  onSelectConversation,
  onExit,
}: FounderWorkspaceProps) {
  const locale = typeof window !== "undefined" && window.location.pathname.startsWith("/en") ? "en" : "fr";
  const copy = founderUi(locale);
  const founderModules = localizeModules(locale);
  const founderDocLabels = localizeDocLabels(locale);
  const requiredFounderModules = founderModules.filter((m) => !m.optional);
  const effectiveLoginHref = resolveFounderLoginHref(loginHref);
  const effectiveSignupHref = resolveFounderSignupHref(signupHref);
  const { user } = useAuth();
  const [activeId, setActiveId] = useState(founderModules[0].id);
  const [ws, setWs] = useState<WorkspaceData>({});
  const [workspaceLoaded, setWorkspaceLoaded] = useState(false);
  const [starterProject, setStarterProject] = useState("");
  const [generating, setGenerating] = useState<string | null>(null);
  const [finalizing, setFinalizing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedOutput, setCopiedOutput] = useState<string | null>(null);
  const [showSynthesis, setShowSynthesis] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [historyCollapsed, setHistoryCollapsed] = useState(false);
  const [briefStarting, setBriefStarting] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [projects, setProjects] = useState<FounderProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectActionId, setProjectActionId] = useState<string | null>(null);
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);
  const [diagnosticError, setDiagnosticError] = useState<string | null>(null);
  const [diagnosticAnalysis, setDiagnosticAnalysis] = useState<FounderCadrageAnalysis | null>(null);
  const [clientProblemLoading, setClientProblemLoading] = useState(false);
  const [clientProblemError, setClientProblemError] = useState<string | null>(null);
  const [clientProblemAnalysis, setClientProblemAnalysis] = useState<FounderClientProblemAnalysis | null>(null);
  const [offerValueLoading, setOfferValueLoading] = useState(false);
  const [offerValueError, setOfferValueError] = useState<string | null>(null);
  const [offerValueAnalysis, setOfferValueAnalysis] = useState<FounderOfferValueAnalysis | null>(null);
  const streamAbortRef = useRef<AbortController | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const hydrateRef = useRef(false);
  const lastSavedSnapshotRef = useRef("");
  const currentProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );
  const owner = useMemo<FounderProjectOwner | null>(() => {
    if (user?.id) return { userId: user.id };
    if (guestId) return { guestId };
    return null;
  }, [guestId, user?.id]);
  const currentConversationId = currentProject
    ? currentProject.conversation_id ?? null
    : conversationId ?? null;

  const applyProjectToWorkspace = useCallback((project: FounderProject | null) => {
    hydrateRef.current = true;
    if (!project) {
      setSelectedProjectId(null);
      setWs({});
      setStarterProject("");
      setActiveId(founderModules[0].id);
      lastSavedSnapshotRef.current = "";
      setWorkspaceLoaded(true);
      return;
    }

    const nextWorkspace = readWorkspaceData(project);
    const nextStarterProject = readStarterProject(project);
    const nextActiveId = readActiveModuleId(project, nextWorkspace);
    setSelectedProjectId(project.id);
    setWs(nextWorkspace);
    setStarterProject(nextStarterProject);
    setActiveId(nextActiveId);
    saveWs(project.id, nextWorkspace);
    lastSavedSnapshotRef.current = JSON.stringify({
      title: buildFounderProjectTitle(nextStarterProject, nextWorkspace, locale, project.title),
      current_step: buildFounderCurrentStep(nextActiveId, nextWorkspace),
      project_data: buildFounderProjectData(nextStarterProject, nextWorkspace, nextActiveId),
    });
    setWorkspaceLoaded(true);
  }, [founderModules, locale]);

  const syncConversationSelection = useCallback((project: FounderProject) => {
    if (project.conversation_id && onSelectConversation && project.conversation_id !== conversationId) {
      onSelectConversation(project.conversation_id);
    }
  }, [conversationId, onSelectConversation]);

  const loadFounderProject = useCallback(async (projectId: string) => {
    if (!owner) return null;
    const project = await getFounderProject(projectId, owner);
    setProjects((prev) => mergeFounderProjectList(prev, project));
    applyProjectToWorkspace(project);
    syncConversationSelection(project);
    return project;
  }, [applyProjectToWorkspace, owner, syncConversationSelection]);

  const reloadFounderProjects = useCallback(async (preferredProjectId?: string | null) => {
    if (!owner) return;
    setProjectsLoading(true);
    setError(null);
    try {
      const items = (await listFounderProjects(owner)).filter((item) => !item.archived);
      setProjects(items);
      const fallbackProjectId =
        preferredProjectId
        || selectedProjectId
        || items.find((item) => item.conversation_id && item.conversation_id === conversationId)?.id
        || items[0]?.id
        || null;
      if (fallbackProjectId) {
        await loadFounderProject(fallbackProjectId);
      } else {
        applyProjectToWorkspace(null);
      }
    } catch (err) {
      setProjects([]);
      applyProjectToWorkspace(null);
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setProjectsLoading(false);
      hydrateRef.current = false;
    }
  }, [applyProjectToWorkspace, conversationId, loadFounderProject, owner, selectedProjectId]);

  useEffect(() => {
    try {
      setGuestId(getOrCreateFounderGuestId());
    } catch {
      setGuestId(null);
    }
  }, []);

  useEffect(() => {
    setWorkspaceLoaded(false);
    if (!owner) return;
    void reloadFounderProjects();
  }, [owner, reloadFounderProjects]);

  useEffect(() => {
    if (!currentProject || !workspaceLoaded) return;
    saveWs(currentProject.id, ws);
  }, [currentProject, workspaceLoaded, ws]);

  useEffect(() => {
    if (!currentProject || !owner || !workspaceLoaded || hydrateRef.current) {
      if (hydrateRef.current) {
        hydrateRef.current = false;
      }
      return;
    }

    const nextPayload = {
      title: buildFounderProjectTitle(starterProject, ws, locale, currentProject.title),
      current_step: buildFounderCurrentStep(activeId, ws),
      project_data: buildFounderProjectData(starterProject, ws, activeId),
    };
    const nextSnapshot = JSON.stringify(nextPayload);
    if (nextSnapshot === lastSavedSnapshotRef.current) return;

    const timeout = window.setTimeout(() => {
      void updateFounderProject(currentProject.id, nextPayload, owner)
        .then((project) => {
          lastSavedSnapshotRef.current = nextSnapshot;
          setProjects((prev) => mergeFounderProjectList(prev, project));
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Erreur inattendue.");
        });
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [activeId, currentProject, locale, owner, starterProject, workspaceLoaded, ws]);
  useEffect(() => { contentRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }, [activeId]);
  useEffect(() => () => { streamAbortRef.current?.abort(); }, []);

  // Load existing diagnostic from project_data when switching projects
  useEffect(() => {
    setDiagnosticError(null);
    if (!currentProject) { setDiagnosticAnalysis(null); return; }
    const agentData = asRecord(asRecord(currentProject.project_data).agent_cadrage_v1);
    const existing = agentData.analysis;
    setDiagnosticAnalysis(existing && typeof existing === "object" ? existing as FounderCadrageAnalysis : null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject?.id]);

  async function runDiagnostic() {
    if (!currentProject || !owner || diagnosticLoading) return;
    setDiagnosticLoading(true);
    setDiagnosticError(null);
    try {
      const response = await runFounderCadrageAgent(currentProject.id, owner, {
        instruction: "Analyse le projet Founder et propose la prochaine meilleure action pour avancer vers une offre claire, testable et vendable.",
        auto_update: true,
      });
      setDiagnosticAnalysis(response.analysis);
      if (response.project && owner) {
        try {
          const refreshed = await getFounderProject(currentProject.id, owner);
          setProjects((prev) => mergeFounderProjectList(prev, refreshed));
        } catch {
          // Non-critical: project data already saved server-side
        }
      }
    } catch (err) {
      setDiagnosticError(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setDiagnosticLoading(false);
    }
  }

  // Load existing client-problem analysis from project_data when switching projects
  useEffect(() => {
    setClientProblemError(null);
    if (!currentProject) { setClientProblemAnalysis(null); return; }
    const agentData = asRecord(asRecord(currentProject.project_data).agent_client_problem_v1);
    const existing = agentData.analysis;
    setClientProblemAnalysis(existing && typeof existing === "object" ? existing as FounderClientProblemAnalysis : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject?.id]);

  async function runClientProblemAgent() {
    if (!currentProject || !owner || clientProblemLoading) return;
    setClientProblemLoading(true);
    setClientProblemError(null);
    try {
      const response = await runFounderClientProblemAgent(currentProject.id, owner, {
        instruction: "Analyse le client cible, le problème principal et propose un plan de validation terrain concret.",
        auto_update: true,
      });
      setClientProblemAnalysis(response.analysis);
      if (response.project && owner) {
        try {
          const refreshed = await getFounderProject(currentProject.id, owner);
          setProjects((prev) => mergeFounderProjectList(prev, refreshed));
        } catch {
          // Non-critical: project data already saved server-side
        }
      }
    } catch (err) {
      setClientProblemError(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setClientProblemLoading(false);
    }
  }

  // Load existing offer-value analysis from project_data when switching projects
  useEffect(() => {
    setOfferValueError(null);
    if (!currentProject) { setOfferValueAnalysis(null); return; }
    const agentData = asRecord(asRecord(currentProject.project_data).agent_offer_value_v1);
    const existing = agentData.analysis;
    setOfferValueAnalysis(existing && typeof existing === "object" ? existing as FounderOfferValueAnalysis : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject?.id]);

  async function runOfferValueAgent() {
    if (!currentProject || !owner || offerValueLoading) return;
    setOfferValueLoading(true);
    setOfferValueError(null);
    try {
      const response = await runFounderOfferValueAgent(currentProject.id, owner, {
        instruction: "Analyse la proposition de valeur, l'offre principale et propose une version plus claire, testable et vendable.",
        auto_update: true,
      });
      setOfferValueAnalysis(response.analysis);
      if (response.project && owner) {
        try {
          const refreshed = await getFounderProject(currentProject.id, owner);
          setProjects((prev) => mergeFounderProjectList(prev, refreshed));
        } catch {
          // Non-critical: project data already saved server-side
        }
      }
    } catch (err) {
      setOfferValueError(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setOfferValueLoading(false);
    }
  }

  const updateMs = useCallback((id: string, patch: Partial<ModuleState>) => {
    setWs((prev) => { const cur = prev[id] ?? defaultMs(); return { ...prev, [id]: { ...cur, ...patch } }; });
  }, []);

  function updateInput(moduleId: string, fieldId: string, value: string) {
    setWs((prev) => {
      const cur = prev[moduleId] ?? defaultMs();
      const inputs = { ...cur.inputs, [fieldId]: value };
      const hasAnyInput = Object.values(inputs).some(Boolean);
      const status: ModuleStatus = cur.status === "completed" ? "completed" : hasAnyInput ? "in_progress" : "empty";
      return { ...prev, [moduleId]: { ...cur, inputs, status } };
    });
  }

  function updateRetention(moduleId: string, value: string) {
    setWs((prev) => {
      const cur = prev[moduleId] ?? defaultMs();
      const status: ModuleStatus = cur.status === "completed" ? "in_progress" : cur.status;
      return { ...prev, [moduleId]: { ...cur, retention: value, status } };
    });
  }

  function updateFinalFeedback(moduleId: string, value: string) {
    setWs((prev) => {
      const cur = prev[moduleId] ?? defaultMs();
      const status: ModuleStatus = cur.status === "completed" ? "in_progress" : cur.status;
      return { ...prev, [moduleId]: { ...cur, finalFeedback: value, status } };
    });
  }

  async function createNewFounderProject(brief = "") {
    if (!owner || projectActionId) return null;
    setProjectActionId("creating");
    setError(null);
    const trimmedBrief = brief.trim();
    const initialWorkspace = buildWorkspaceFromBrief(trimmedBrief);
    const initialActiveId = trimmedBrief ? "client" : founderModules[0].id;
    try {
      const project = await createFounderProject({
        ...owner,
        conversation_id: conversationId,
        title: buildFounderProjectTitle(trimmedBrief, initialWorkspace, locale, null),
        current_step: trimmedBrief ? buildFounderCurrentStep(initialActiveId, initialWorkspace) : "point_de_depart",
        project_data: buildFounderProjectData(trimmedBrief, initialWorkspace, initialActiveId),
      });
      setProjects((prev) => mergeFounderProjectList(prev, project));
      applyProjectToWorkspace(project);
      syncConversationSelection(project);
      return project;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
      return null;
    } finally {
      setProjectActionId(null);
    }
  }

  async function startFounderFromBrief() {
    const brief = starterProject.trim();
    if (!brief || briefStarting) return;
    setBriefStarting(true);
    try {
      if (!currentProject) {
        await createNewFounderProject(brief);
      } else {
        setActiveId("client");
        updateInput("client", "activite", brief);
      }
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      window.setTimeout(() => setBriefStarting(false), 1500);
    }
  }

  async function generate(moduleId: string) {
    if (!currentConversationId || generating || finalizing) return;

    const current = getMs(ws, moduleId);
      const prompt = buildPrompt(locale, moduleId, current.inputs, ws, founderDocLabels);

    setError(null);
    setGenerating(moduleId);
    // Preserve previous output for the revision UX
    updateMs(moduleId, { previousOutput: current.output ?? null, output: null });

    streamAbortRef.current?.abort();
    const ctrl = new AbortController();
    streamAbortRef.current = ctrl;

    try {
      const res = await fetch(apiUrl("/chatlaya/message"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ conversation_id: currentConversationId, message: prompt }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Erreur de génération.");
      }
      if (!(res.headers.get("content-type") || "").includes("text/event-stream"))
        throw new Error("Format de réponse inattendu.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let output = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
        let boundary: number;
        while ((boundary = buffer.indexOf("\n\n")) !== -1) {
          const packet = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          if (!packet.trim()) continue;
          let event = "message";
          const dataLines: string[] = [];
          for (const line of packet.split("\n")) {
            if (line.startsWith("event:")) event = line.slice(6).trim();
            if (line.startsWith("data:")) dataLines.push(line.slice(5));
          }
          const data = dataLines.join("\n");
          if (event === "token") { output += data; updateMs(moduleId, { output }); }
          else if (event === "done") {
            updateMs(moduleId, { output, status: output ? "in_progress" : getMs(ws, moduleId).status });
            return;
          } else if (event === "error") throw new Error(data || "Erreur de streaming.");
        }
      }
      if (output) updateMs(moduleId, { output, status: "in_progress" });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
      updateMs(moduleId, { output: getMs(ws, moduleId).output });
    } finally {
      setGenerating(null);
    }
  }

  async function draftFinal(moduleId: string) {
    if (!currentConversationId || generating || finalizing) return;

    const current = getMs(ws, moduleId);
    if (!current.output?.trim()) return;
    const prompt = buildFinalDraftPrompt(locale, moduleId, current, ws, founderModules, founderDocLabels);

    setError(null);
    setFinalizing(moduleId);
    updateMs(moduleId, {
      previousRetention: current.retention ?? null,
      retention: "",
      status: current.status === "completed" ? "in_progress" : current.status,
    });

    streamAbortRef.current?.abort();
    const ctrl = new AbortController();
    streamAbortRef.current = ctrl;

    try {
      const res = await fetch(apiUrl("/chatlaya/message"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ conversation_id: currentConversationId, message: prompt }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Erreur de rédaction finale.");
      }
      if (!(res.headers.get("content-type") || "").includes("text/event-stream"))
        throw new Error("Format de réponse inattendu.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let output = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
        let boundary: number;
        while ((boundary = buffer.indexOf("\n\n")) !== -1) {
          const packet = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          if (!packet.trim()) continue;
          let event = "message";
          const dataLines: string[] = [];
          for (const line of packet.split("\n")) {
            if (line.startsWith("event:")) event = line.slice(6).trim();
            if (line.startsWith("data:")) dataLines.push(line.slice(5));
          }
          const data = dataLines.join("\n");
          if (event === "token") {
            output += data;
            updateMs(moduleId, { retention: cleanDossierText(output) });
          } else if (event === "done") {
            updateMs(moduleId, { retention: cleanDossierText(output), status: "in_progress" });
            return;
          } else if (event === "error") throw new Error(data || "Erreur de streaming.");
        }
      }
      if (output) updateMs(moduleId, { retention: cleanDossierText(output), status: "in_progress" });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
      updateMs(moduleId, { retention: current.retention ?? "" });
    } finally {
      setFinalizing(null);
    }
  }

  function validate(moduleId: string) {
    const current = getMs(ws, moduleId);
    const retention = current.retention?.trim();
    if (!retention) return;
    updateMs(moduleId, { status: "completed", retention });
    const idx = founderModules.findIndex((m) => m.id === moduleId);
    const next = founderModules[idx + 1];
    if (next) setActiveId(next.id);
  }

  function reopen(moduleId: string) {
    updateMs(moduleId, { status: "in_progress" });
  }

  function copyOutput(moduleId: string, content: string) {
    const plain = content.replace(/\*\*([^*\n]+)\*\*/g, "$1").replace(/\*([^*\n]+)\*/g, "$1")
      .replace(/`([^`\n]+)`/g, "$1").replace(/^#{1,3}\s+/gm, "").trim();
    navigator.clipboard.writeText(plain).then(() => {
      setCopiedOutput(moduleId);
      setTimeout(() => setCopiedOutput((c) => (c === moduleId ? null : c)), 2000);
    }).catch(() => {});
  }

  function exportToHtml() {
    const html = generateHtmlExport(locale, ws, founderModules, founderDocLabels, firstName);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (w) { setTimeout(() => URL.revokeObjectURL(url), 10000); }
    else {
      const a = document.createElement("a");
      a.href = url;
      a.download = `dossier-founder-koryxa-${new Date().toISOString().slice(0, 10)}.html`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    }
  }

  const activeModule = founderModules.find((m) => m.id === activeId) ?? founderModules[0];
  const activeMs = getMs(ws, activeId);
  const isGenerating = generating === activeId;
  const isFinalizing = finalizing === activeId;
  const canValidateActive = Boolean(activeMs.retention?.trim()) && !isFinalizing;
  const isRevision = activeMs.status === "in_progress" && !!activeMs.previousOutput;
  const hasWorkspaceContent = Object.values(ws).some((state) =>
    state.status !== "empty" ||
    !!state.output ||
    !!state.previousOutput ||
    !!state.previousRetention ||
    !!state.retention?.trim() ||
    !!state.finalFeedback?.trim() ||
    Object.values(state.inputs).some((value) => !!value.trim()),
  );
  const showStarterPanel = workspaceLoaded && !hasWorkspaceContent && !generating && !finalizing;

  const completedCount = requiredFounderModules.filter((m) => getMs(ws, m.id).status === "completed").length;
  const allDone = completedCount === requiredFounderModules.length;

  const activeIdx = founderModules.findIndex((m) => m.id === activeId);
  const nextModule = activeIdx < founderModules.length - 1 ? founderModules[activeIdx + 1] : null;
  const visibleHistory: FounderConversation[] = projects.map((project) => ({
    conversation_id: project.id,
    title: project.title,
    created_at: project.created_at || undefined,
    updated_at: project.updated_at || undefined,
    archived: project.archived,
    assistant_mode: "launch_structure_sell",
  }));

  async function selectHistoryConversation(nextConversationId: string) {
    setMobileHistoryOpen(false);
    setError(null);
    try {
      await loadFounderProject(nextConversationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
    }
  }

  async function archiveHistoryConversation(nextConversationId: string) {
    if (!owner || projectActionId) return;
    setProjectActionId(nextConversationId);
    setError(null);
    try {
      await archiveFounderProject(nextConversationId, owner);
      const remaining = projects.filter((project) => project.id !== nextConversationId);
      setProjects(remaining);
      if (selectedProjectId === nextConversationId) {
        const nextSelectedId = remaining[0]?.id || null;
        if (nextSelectedId) {
          await loadFounderProject(nextSelectedId);
        } else {
          applyProjectToWorkspace(null);
        }
        setMobileHistoryOpen(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setProjectActionId(null);
    }
  }

  if (!workspaceLoaded) {
    return (
      <main className="flex h-full min-h-0 items-center justify-center overflow-hidden">
        <div className="rounded-3xl border border-[#E7DED0] bg-[#FFFCF7]/90 px-6 py-4 text-sm font-medium text-[#6F6A60] shadow-[0_18px_48px_rgba(16,16,21,0.08)]">
          {copy.loadingWorkspace}
        </div>
      </main>
    );
  }

  if (authRequired) {
    return (
      <main className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-[#E7DED0] bg-[#FFFCF7]/92 px-7 py-6 text-center shadow-[0_18px_48px_rgba(16,16,21,0.08)]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0E6CC] ring-1 ring-[#E7DED0]">
            <UserRound className="h-5 w-5 text-[#B8963E]" />
          </div>
          <p className="text-base font-semibold text-[#101015]">{copy.authRequiredTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-[#6F6A60]">
            {copy.authRequiredBody}
          </p>
          <div className="mt-5 flex flex-col items-center gap-3">
            {effectiveLoginHref ? (
              <div className="flex flex-col items-center gap-2">
                <a
                  href={effectiveLoginHref}
                  className="inline-flex items-center justify-center rounded-full bg-[#101015] px-5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-[#B8963E]/20 transition hover:bg-[#1A1A20]"
                >
                  {copy.login}
                </a>
                <a
                  href={effectiveLoginHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#8A6A20] underline underline-offset-4 transition hover:text-[#101015]"
                >
                  {copy.loginNewTab}
                </a>
              </div>
            ) : null}
            <button
              type="button"
              onClick={onExit}
              className="text-xs text-slate-400 transition hover:text-slate-600"
            >
              {copy.backGeneral}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Synthesis view ──
  if (showSynthesis) {
    return (
      <main className="h-full min-h-0 overflow-hidden">
          <SynthesisView ws={ws} modules={founderModules} locale={locale} docLabels={founderDocLabels} firstName={firstName} onBack={() => setShowSynthesis(false)} onExport={exportToHtml} />
      </main>
    );
  }

  function renderHistoryPanel(collapsed = false) {
    return (
      <div className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#E8E0CC] bg-white/70 shadow-[0_2px_16px_rgba(26,24,20,0.06)] backdrop-blur-xl ${collapsed ? "items-center" : ""}`}>
        <div className={`shrink-0 border-b border-[#E7DED0] ${collapsed ? "w-full px-2 py-3" : "px-4 pb-3 pt-4"}`}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setHistoryCollapsed(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7DED0] bg-white text-[#6F6A60] transition hover:border-[#B8963E]/40 hover:bg-[#F0E6CC] hover:text-[#8A6A20]"
                title={copy.expandHistory}
                aria-label={copy.expandHistory}
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => void createNewFounderProject()}
                disabled={!owner || projectActionId === "creating"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#101015] text-white shadow-sm ring-1 ring-[#B8963E]/20 transition hover:bg-[#1A1A20] disabled:cursor-not-allowed disabled:opacity-50"
                title={copy.newFolder}
                aria-label={copy.newFolder}
              >
                <MessageSquarePlus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6F6A60]">{copy.history}</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-[#101015]">
                  {firstName ? (founderIsEnglish(locale) ? `${firstName}'s files` : `Dossiers de ${firstName}`) : copy.yourConversations}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileHistoryOpen(false);
                    void createNewFounderProject();
                  }}
                  disabled={!owner || projectActionId === "creating"}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#101015] text-white shadow-sm ring-1 ring-[#B8963E]/20 transition hover:bg-[#1A1A20] disabled:cursor-not-allowed disabled:opacity-50"
                  title={copy.newFolder}
                  aria-label={copy.newFolder}
                >
                  <MessageSquarePlus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryCollapsed(true)}
                  className="hidden h-9 w-9 items-center justify-center rounded-xl border border-[#E7DED0] bg-white text-[#6F6A60] transition hover:border-[#B8963E]/40 hover:bg-[#F0E6CC] hover:text-[#8A6A20] lg:inline-flex"
                  title={copy.collapseHistory}
                  aria-label={copy.collapseHistory}
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMobileHistoryOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E7DED0] bg-white text-[#6F6A60] transition hover:bg-[#F0E6CC] hover:text-[#8A6A20] lg:hidden"
                  title={copy.close}
                  aria-label={copy.closeHistory}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`min-h-0 flex-1 overflow-y-auto ${collapsed ? "w-full px-2 py-2" : "px-2 py-2"}`}>
          {projectsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`mb-1.5 animate-pulse rounded-xl bg-[#F0E6CC]/60 ${collapsed ? "mx-auto h-10 w-10" : "h-[68px]"}`} />
            ))
          ) : visibleHistory.length === 0 ? (
            collapsed ? (
              <div className="mx-auto mt-2 h-10 w-10 rounded-xl border border-dashed border-[#E7DED0]" title={copy.noFounderFiles} />
            ) : (
              <div className="rounded-xl border border-dashed border-[#E7DED0] px-3 py-4 text-xs text-[#6F6A60]">
                {copy.noFounderFiles}
              </div>
            )
          ) : (
            visibleHistory.map((conversation) => {
              const active = conversation.conversation_id === selectedProjectId;
              const title = normalizeTitle(conversation.title, locale);
              if (collapsed) {
                return (
                  <button
                    key={conversation.conversation_id}
                    type="button"
                    onClick={() => selectHistoryConversation(conversation.conversation_id)}
                    title={title}
                    aria-label={title}
                    className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl border text-[#6F6A60] transition ${
                      active ? "border-[#B8963E]/30 bg-[#F0E6CC]/60 text-[#8A6A20] shadow-sm" : "border-transparent bg-white hover:border-[#E7DED0] hover:bg-[#F7F4EE]"
                    }`}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                );
              }
              return (
                <div
                  key={conversation.conversation_id}
                  className={`mb-1.5 rounded-xl border px-3 py-3 text-left transition-all duration-200 ${
                    active ? "border-[#B8924A] bg-gradient-to-br from-[#FAF6EE] to-[#F5EFE0] shadow-[0_8px_32px_rgba(184,146,74,0.25)]" : "border-transparent bg-white/80 hover:-translate-y-0.5 hover:border-[#E8E0CC] hover:bg-white hover:shadow-[0_8px_24px_rgba(26,24,20,0.08)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectHistoryConversation(conversation.conversation_id)}
                    className="block w-full text-left"
                  >
                    <p className={`truncate text-xs font-semibold leading-snug ${active ? "text-[#8A6A20]" : "text-[#101015]"}`}>
                      {title}
                    </p>
                    <p className="mt-1 text-[10px] text-[#6F6A60]">
                      {formatConversationDate(conversation.updated_at || conversation.created_at, locale) || copy.newFolder}
                    </p>
                  </button>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#F7F4EE] px-2 py-1 text-[10px] font-medium text-[#6F6A60] ring-1 ring-[#E7DED0]">
                      {active ? copy.activeFolder : copy.founderFolder}
                    </span>
                    <button
                      type="button"
                      onClick={() => void archiveHistoryConversation(conversation.conversation_id)}
                      disabled={!owner || !!projectActionId}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-[#6F6A60] transition hover:bg-[#F7F4EE] hover:text-[#101015] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Archive className="h-3 w-3" />
                      {copy.archive}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className={`shrink-0 border-t border-[#E7DED0] ${collapsed ? "w-full px-2 py-3" : "px-3 py-3"}`}>
          <button
            type="button"
            onClick={onExit}
            className={collapsed
              ? "mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7DED0] text-[#6F6A60] transition hover:border-[#B8963E]/30 hover:bg-[#F0E6CC] hover:text-[#8A6A20]"
              : "w-full rounded-xl border border-[#E7DED0] px-3 py-2 text-[11px] font-medium text-[#6F6A60] transition hover:border-[#B8963E]/30 hover:bg-[#F0E6CC] hover:text-[#8A6A20]"
            }
            title={copy.generalMode}
            aria-label={copy.generalMode}
          >
            {collapsed ? <ChevronLeft className="h-4 w-4" /> : `← ${copy.generalMode}`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className={`kx-founder-root relative grid h-full min-h-0 gap-3 overflow-hidden ${historyCollapsed ? "lg:grid-cols-[72px_minmax(0,1fr)]" : "lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]"}`}>
      {briefStarting && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-50 h-[3px] overflow-hidden rounded-full">
          <div className="h-full kx-founder-ytbar bg-gradient-to-r from-[#D4B26A] via-[#B8963E] to-[#8A6A20]" />
        </div>
      )}

      <aside className="hidden min-h-0 lg:block">
        {renderHistoryPanel(historyCollapsed)}
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#E8E0CC] bg-white/70 shadow-[var(--shadow-sm)] backdrop-blur-xl">

        {error ? (
          <div className="shrink-0 border-b border-rose-100 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-600">{error}</div>
        ) : null}

        {/* Module header */}
        <div className="shrink-0 border-b border-[#E7DED0] bg-[#F7F4EE]/80 px-5 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileHistoryOpen(true)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E7DED0] bg-white text-[#6F6A60] transition hover:border-[#B8963E]/30 hover:bg-[#F0E6CC] hover:text-[#8A6A20] lg:hidden"
              title={copy.history}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white ${isRevision ? "bg-[#B8924A]" : "bg-[#101015]"}`}>
              {(() => { const Icon = activeModule.icon; return <Icon className="h-4 w-4" />; })()}
            </div>
            <p className="hidden flex-1 text-center font-serif text-[13px] italic leading-snug tracking-wide text-[#6F6A60] lg:block">
              {activeModule.description}
            </p>
            <div className="flex-1 lg:hidden" />
            <div className="flex shrink-0 items-center gap-2">
              {activeMs.status === "completed" ? (
                <div className="kx-founder-validated hidden items-center gap-1.5 rounded-full bg-[#F0E6CC]/70 px-3 py-1 text-[11px] font-semibold text-[#8A6A20] ring-1 ring-[#E7DED0] lg:inline-flex">
                  <Check className="h-3 w-3" />
                  {copy.validated}
                </div>
              ) : null}
              <FounderAccountButton firstName={firstName} />
            </div>
          </div>
          <div className="mt-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex items-center gap-1 rounded-full border border-[#E8E0CC] bg-white/60 p-1.5 shadow-[0_2px_8px_rgba(26,24,20,0.06)] backdrop-blur-sm">
            {founderModules.map((m) => {
              const mws = getMs(ws, m.id);
              const isCurrent = m.id === activeId;
              const isDone = mws.status === "completed";
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveId(m.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-left transition-all duration-200 active:scale-[0.96] ${
                    isCurrent
                      ? "bg-gradient-to-r from-[#D4B26A] via-[#B8924A] to-[#8B6F35] text-white shadow-[0_4px_12px_rgba(184,146,74,0.35)]"
                      : isDone
                        ? "bg-[#F0E6CC]/60 text-[#8A6A20] hover:bg-[#F0E6CC]"
                        : "text-[#6B6557] hover:bg-[#F5EFE0] hover:text-[#1A1814]"
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    isDone ? "bg-[#B8924A] text-white" : isCurrent ? "bg-white/20 text-white" : "bg-[#F5EFE0] text-[#6B6557]"
                  }`}>
                    {isDone ? <Check className="h-3 w-3" /> : m.step}
                  </span>
                  <span className="hidden text-[11px] font-semibold sm:inline">{m.label}</span>
                </button>
              );
            })}
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div ref={contentRef}
          className="founder-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 py-6 touch-pan-y [-webkit-overflow-scrolling:touch]">
          <div className={showStarterPanel ? "mx-auto flex min-h-full w-full max-w-5xl items-center py-2" : "mx-auto max-w-2xl space-y-5"}>
            {showStarterPanel ? (
              <motion.div
                className="grid w-full items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_410px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="kx-grain overflow-hidden rounded-[28px] border border-[#E8E0CC] bg-[radial-gradient(circle_at_20%_20%,rgba(184,150,62,0.10),transparent_34%),linear-gradient(135deg,#F7F4EE_0%,#FFFCF7_48%,#F7F4EE_100%)] p-6 shadow-[var(--shadow-md)] sm:p-7">
                  <div className="mb-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#E7DED0] bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A6A20] shadow-sm">
                      <Sparkles className="kx-founder-sparkle h-3.5 w-3.5 text-[#B8963E]" />
                      {copy.starterBadge}
                    </div>
                  </div>

                  <div className="max-w-2xl">
                    <h2 className="text-[30px] font-semibold leading-[1.05] tracking-[-0.02em] text-[#1A1814] [font-family:var(--font-fraunces,Georgia,serif)] sm:text-[38px]">
                      {copy.starterTitle1}
                      <span className="block bg-gradient-to-r from-[#D4B26A] via-[#B8963E] to-[#8A6A20] bg-clip-text text-transparent">
                        {copy.starterTitle2}
                      </span>
                    </h2>
                    <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#6F6A60]">
                      {copy.starterBody}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {requiredFounderModules.map((mod, i) => {
                      const Icon = mod.icon;
                      return (
                        <motion.div
                          key={mod.id}
                          className="group flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-3.5 py-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B8924A]/40 hover:shadow-[0_8px_24px_rgba(26,24,20,0.10)]"
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-20px" }}
                          transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0E6CC] text-[#8A6A20] ring-1 ring-[#E7DED0] transition-transform duration-300 group-hover:rotate-[5deg]">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#101015]">{mod.label}</p>
                            <p className="truncate text-xs text-[#6F6A60]">{mod.tagline}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#E7DED0] bg-white/70 px-4 py-3 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#101015] text-white">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#101015]">{copy.deliverableTitle}</p>
                        <p className="mt-1 text-sm leading-6 text-[#6F6A60]">
                          {copy.deliverableBody}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="kx-grain flex flex-col justify-between rounded-[28px] border border-[#E8E0CC] bg-[#FFFCF7] p-5 shadow-[var(--shadow-md)] sm:p-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6F6A60]">{copy.startingPoint}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-[#1A1814] [font-family:var(--font-fraunces,Georgia,serif)]">
                      {copy.startingTitle}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#6F6A60]">
                      {copy.startingBody}
                    </p>

                    <textarea
                      value={starterProject}
                      onChange={(event) => setStarterProject(event.target.value)}
                      rows={7}
                      disabled={briefStarting}
                      placeholder={copy.startingPlaceholder}
                      className={`mt-5 w-full resize-y rounded-2xl border-2 border-[#E8E0CC] bg-white/80 px-5 py-5 text-base italic leading-7 text-[#1A1814] placeholder:not-italic placeholder:text-[#9A9484] transition-all duration-200 focus:border-[#B8924A] focus:bg-white focus:outline-none focus:shadow-[0_0_0_4px_rgba(184,146,74,0.12)] min-h-[200px] ${briefStarting ? "opacity-40 cursor-not-allowed" : ""}`}
                    />
                  </div>

                  <div className="mt-5 space-y-3">
                    <button
                      type="button"
                      onClick={startFounderFromBrief}
                      disabled={!starterProject.trim() || briefStarting}
                      className="group kx-founder-shine flex w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-br from-[#1A1814] to-[#252118] px-5 py-[18px] text-base font-semibold text-[#FAF6EE] shadow-[0_12px_30px_rgba(26,24,20,0.28)] transition-all duration-200 hover:shadow-[0_12px_32px_rgba(26,24,20,0.38),0_0_0_1px_rgba(212,178,106,0.3)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {briefStarting ? (
                        <>
                          <svg className="h-4 w-4 animate-spin text-[#B8963E]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="28.3 28.3" />
                          </svg>
                          {copy.preparingFraming}
                        </>
                      ) : (
                        <>
                          {copy.startFraming}
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                    {!user?.id ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        <a
                          href={effectiveLoginHref}
                          className="inline-flex items-center justify-center rounded-2xl border border-[#B8963E]/40 bg-white px-4 py-3 text-sm font-bold text-[#8A6A20] transition hover:border-[#B8963E]/70 hover:bg-[#F0E6CC]"
                        >
                          {copy.login}
                        </a>
                        <a
                          href={effectiveSignupHref}
                          className="inline-flex items-center justify-center rounded-2xl border border-[#E7DED0] bg-white px-4 py-3 text-sm font-bold text-[#101015] transition hover:border-[#B8963E]/30 hover:bg-[#F7F4EE]"
                        >
                          {copy.createAccount}
                        </a>
                      </div>
                    ) : null}
                    <p className="text-center text-xs leading-5 text-[#6F6A60]">
                      {user?.id
                        ? copy.introAfterStart
                        : copy.secureReturn}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>

            {/* Product intro — visible only on a fresh workspace */}
            {completedCount === 0 && !hasWorkspaceContent && !activeMs.output && !isGenerating ? (
              <div className="rounded-xl border border-[#E7DED0] bg-[#F7F4EE] px-4 py-4">
                <p className="text-xs font-semibold text-[#3A3530]">{copy.framingBadge}</p>
                <p className="mt-1 text-xs leading-5 text-[#6F6A60]">
                  {copy.framingBody}
                </p>
              </div>
            ) : null}

            {/* Completion banner */}
            {allDone ? (
              <div className="rounded-2xl border border-[#B8963E]/30 bg-gradient-to-r from-[#F0E6CC]/40 to-[#FFFCF7] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B8963E] text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#101015]">{firstName ? `${copy.bravo} ${firstName}!` : copy.bravo}</p>
                    <p className="text-xs text-[#6F6A60]">{copy.stepsDone}</p>
                  </div>
                  <button type="button" onClick={() => setShowSynthesis(true)}
                    className="flex shrink-0 items-center gap-2 rounded-full bg-[#101015] px-4 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-[#B8963E]/20 transition hover:bg-[#1A1A20]">
                    <BookOpen className="h-3.5 w-3.5" />
                    {copy.finalFolder}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Revision banner (AXE 1) */}
            {isRevision && !isGenerating ? (
              <div className="rounded-xl border border-[#E7DED0] bg-[#F0E6CC]/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-3.5 w-3.5 shrink-0 text-[#B8963E]" />
                  <p className="text-xs font-semibold text-[#3A3020]">{copy.revisionTitle}</p>
                </div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[#6F4E20]">
                  {copy.revisionBody}
                </p>
              </div>
            ) : null}

            {/* Diagnostic IA Founder */}
            {currentProject ? (
              <FounderDiagnosticBlock
                analysis={diagnosticAnalysis}
                loading={diagnosticLoading}
                error={diagnosticError}
                locale={locale}
                onRun={() => void runDiagnostic()}
              />
            ) : null}

            {/* Client & Problème IA */}
            {currentProject ? (
              <FounderClientProblemBlock
                analysis={clientProblemAnalysis}
                loading={clientProblemLoading}
                error={clientProblemError}
                locale={locale}
                onRun={() => void runClientProblemAgent()}
              />
            ) : null}

            {/* Offre & Valeur IA */}
            {currentProject ? (
              <FounderOfferValueBlock
                analysis={offerValueAnalysis}
                loading={offerValueLoading}
                error={offerValueError}
                locale={locale}
                onRun={() => void runOfferValueAgent()}
              />
            ) : null}

            {/* Input fields */}
            <div className="space-y-4">
              {activeModule.inputs.map((field) => (
                <div key={field.id}>
                  <label className="mb-1.5 block text-xs font-semibold text-[#101015]">
                    {field.label}
                    {field.optional ? <span className="ml-1.5 font-normal text-[#6F6A60]">({copy.optional})</span> : null}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea value={activeMs.inputs[field.id] ?? ""} onChange={(e) => updateInput(activeId, field.id, e.target.value)}
                      placeholder={field.placeholder} rows={field.rows ?? 3} disabled={isGenerating}
                      className="w-full resize-none rounded-xl border border-[#E7DED0] bg-[#F7F4EE]/60 px-4 py-3 text-sm leading-relaxed text-[#101015] placeholder:text-[#B8963E]/40 transition focus:border-[#B8963E] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(184,150,62,0.08)] disabled:opacity-60"
                    />
                  ) : (
                    <input type="text" value={activeMs.inputs[field.id] ?? ""} onChange={(e) => updateInput(activeId, field.id, e.target.value)}
                      placeholder={field.placeholder} disabled={isGenerating}
                      className="w-full rounded-xl border border-[#E7DED0] bg-[#F7F4EE]/60 px-4 py-3 text-sm text-[#101015] placeholder:text-[#B8963E]/40 transition focus:border-[#B8963E] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(184,150,62,0.08)] disabled:opacity-60"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Generate button */}
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => void generate(activeId)}
                disabled={!!generating || !!finalizing || !currentConversationId}
                className="flex items-center gap-2 rounded-full bg-[#101015] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(16,16,21,0.18)] ring-1 ring-[#B8963E]/20 transition hover:bg-[#1A1A20] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
                <Sparkles className="h-3.5 w-3.5 text-[#B8963E]" />
                {isGenerating ? copy.generating : activeMs.output ? copy.refineWithChatlaya : copy.generateWithChatlaya}
              </button>
              {isGenerating ? (
                <button type="button" onClick={() => streamAbortRef.current?.abort()}
                  className="text-xs text-[#6F6A60] transition hover:text-[#101015]">
                  {copy.cancel}
                </button>
              ) : null}
              {!isGenerating && generating && generating !== activeId ? (
                <span className="text-[11px] text-[#6F6A60]">{copy.generatingAnother}</span>
              ) : null}
            </div>

            {/* Previous output (revision mode, while generating) */}
            {isGenerating && !activeMs.output && activeMs.previousOutput ? (
              <details className="rounded-xl border border-[#E7DED0]">
                <summary className="cursor-pointer rounded-xl px-4 py-2.5 text-xs font-medium text-[#6F6A60] hover:bg-[#F7F4EE]">
                  {copy.previousVersion}
                </summary>
                <div className="px-4 pb-4 pt-2 opacity-60">
                  <FounderOutput content={activeMs.previousOutput} />
                </div>
              </details>
            ) : null}

            {/* Generating animation */}
            {isGenerating && !activeMs.output ? <GeneratingCard firstName={firstName} locale={locale} /> : null}

            {/* AI output (coaching layer) */}
            {activeMs.output ? (
              <div className="group relative rounded-2xl border border-[#E7DED0] bg-white p-5 shadow-[0_4px_24px_rgba(184,150,62,0.08)]">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#101015]">
                    <span className="text-[8px] font-bold text-[#B8963E]">L</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8963E]">{copy.chatlayaAnalysis}</span>
                  {isGenerating ? (
                    <span className="ml-auto animate-pulse text-[10px] text-[#6F6A60]">{copy.inProgress}</span>
                  ) : (
                    <button type="button" onClick={() => copyOutput(activeId, activeMs.output!)}
                      className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-[#6F6A60] opacity-0 transition-all hover:bg-[#F7F4EE] hover:text-[#101015] group-hover:opacity-100"
                      title={copy.copyAction}>
                      {copiedOutput === activeId ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      {copiedOutput === activeId ? copy.copied : copy.copyAction}
                    </button>
                  )}
                </div>
                <FounderOutput content={activeMs.output} />
              </div>
            ) : null}

            {/* Retention block — livrable final (AXE 2) */}
            {activeMs.output && !isGenerating ? (
              <RetentionBlock
                value={activeMs.retention ?? ""}
                onChange={(v) => updateRetention(activeId, v)}
                feedback={activeMs.finalFeedback ?? ""}
                onFeedbackChange={(v) => updateFinalFeedback(activeId, v)}
                onGenerateFinal={() => void draftFinal(activeId)}
                generatingFinal={isFinalizing}
                validated={activeMs.status === "completed"}
                locale={locale}
              />
            ) : null}

            {/* Actions bar */}
            {activeMs.output && !isGenerating ? (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {activeMs.status !== "completed" ? (
                  <button type="button" onClick={() => validate(activeId)}
                    disabled={!canValidateActive}
                    className="flex items-center gap-2 rounded-full bg-[#101015] px-5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-[#B8963E]/20 transition hover:bg-[#1A1A20] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45">
                    <Check className="h-3.5 w-3.5" />
                    {isRevision ? copy.revalidateForDossier : copy.validateForDossier}
                  </button>
                ) : (
                  <div className="kx-founder-validated flex items-center gap-2 rounded-full bg-[#F0E6CC]/60 px-4 py-2 text-sm font-semibold text-[#8A6A20] ring-1 ring-[#E7DED0]">
                    <Check className="h-3.5 w-3.5" />
                    {copy.dossierVersionValidated}
                  </div>
                )}
                {activeMs.status === "completed" ? (
                  <button type="button" onClick={() => reopen(activeId)}
                    className="flex items-center gap-1.5 rounded-full border border-[#E7DED0] px-4 py-2 text-sm font-medium text-[#6F6A60] transition hover:border-[#B8963E]/40 hover:bg-[#F0E6CC]/40 hover:text-[#8A6A20]">
                    <RotateCcw className="h-3.5 w-3.5" />
                    {copy.editThisStep}
                  </button>
                ) : null}
                {nextModule ? (
                  <button type="button" onClick={() => { if (activeMs.status !== "completed") validate(activeId); else setActiveId(nextModule.id); }}
                    disabled={activeMs.status !== "completed" && !canValidateActive}
                    className="ml-auto flex items-center gap-2 rounded-full border border-[#B8963E]/40 bg-[#F0E6CC]/40 px-5 py-2 text-sm font-semibold text-[#8A6A20] transition hover:bg-[#F0E6CC] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45">
                    {nextModule.label}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button type="button" onClick={exportToHtml}
                    className="ml-auto flex items-center gap-2 rounded-full bg-[#101015] px-5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-[#B8963E]/20 transition hover:bg-[#1A1A20] active:scale-[0.98]">
                    <Download className="h-3.5 w-3.5 text-[#B8963E]" />
                    {copy.exportDossier}
                  </button>
                )}
              </div>
            ) : null}

            {/* Empty state */}
            {!activeMs.output && !isGenerating && !Object.values(activeMs.inputs).some(Boolean) ? (
              <div className="rounded-2xl border border-dashed border-[#E7DED0] px-5 py-6 text-center">
                <p className="text-sm font-semibold text-[#3A3530]">{activeModule.tagline}</p>
                <p className="mt-1 text-xs leading-6 text-[#6F6A60]">
                  {copy.emptyStatePrefix}{" "}
                  <span className="font-semibold text-[#B8963E]">{copy.generateWithChatlaya}</span>.
                </p>
              </div>
            ) : null}

            <div className="h-6" />
              </>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {mobileHistoryOpen && (
          <>
            <motion.div
              key="founder-drawer-backdrop"
              className="fixed inset-0 z-40 bg-[#1A1814]/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileHistoryOpen(false)}
            />
            <motion.div
              key="founder-drawer-panel"
              className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[320px] p-2 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.4, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) setMobileHistoryOpen(false);
              }}
            >
              {renderHistoryPanel(false)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
