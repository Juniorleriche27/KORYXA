export type ProductStatus = "actif" | "construction" | "interne";

export type ProductInfo = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  audience: string;
  status: ProductStatus;
  href: string;
  stats: { label: string; value: string }[];
  highlights: string[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  contact?: string;
  useCases: string[];
};

export const productCatalog: Record<string, ProductInfo> = {
  corabiz: {
    slug: "corabiz",
    name: "CoraBiz",
    tagline: "Agents IA autonomes pour croissance commerciale.",
    summary:
      "CoraBiz orchestre les ventes de la prospection au paiement avec des agents IA autonomes, un marketplace, des relances, le suivi des paiements, des rapports et une configuration commerciale complète.",
    audience: "Entreprises ambitieuses, équipes commerciales, entrepreneurs",
    status: "actif",
    href: "https://corabiz.koryxa.fr",
    stats: [
      { label: "Produit", value: "Growth" },
      { label: "Mode", value: "Agents IA" },
      { label: "Statut", value: "Public" },
    ],
    highlights: ["Prospection", "Relance IA", "Paiement suivi"],
    primaryCta: { label: "Ouvrir CoraBiz", href: "https://corabiz.koryxa.fr" },
    useCases: ["Prospecter", "Publier des offres", "Suivre les paiements", "Piloter la croissance"],
  },
  cora: {
    slug: "cora",
    name: "Cora",
    tagline: "Assistant commercial.",
    summary:
      "Cora pilote les campagnes commerciales omnicanales avec une interface claire, rapide et professionnelle. Il rattache chaque message, document et action à un projet ou dossier actif.",
    audience: "Équipes commerciales, porteurs de projets, professionnels",
    status: "actif",
    href: "https://cora.koryxa.fr",
    stats: [
      { label: "Mode", value: "Assistant" },
      { label: "Accès", value: "Libre" },
      { label: "Statut", value: "Public" },
    ],
    highlights: ["Campagnes", "Prospects", "Documents"],
    primaryCta: { label: "Ouvrir Cora", href: "https://cora.koryxa.fr" },
    useCases: ["Organiser le travail", "Préparer une réponse", "Trouver la prochaine action"],
  },
  api: {
    slug: "api",
    name: "KORYXA API",
    tagline: "Toutes les briques d’intelligence KORYXA, accessibles par API.",
    summary:
      "KORYXA API rassemble des agents IA, modèles ML, API de données, recherche intelligente, API métier et automatisations prêtes à intégrer dans des produits.",
    audience: "Développeurs, équipes produit, intégrateurs, organisations techniques",
    status: "interne",
    href: "https://api.koryxa.fr",
    stats: [
      { label: "Accès", value: "API" },
      { label: "Sécurité", value: "Clés" },
      { label: "Statut", value: "Preview" },
    ],
    highlights: ["Agents IA", "Modèles ML", "Automatisations"],
    primaryCta: { label: "Ouvrir KORYXA API", href: "https://api.koryxa.fr" },
    useCases: ["Intégrer une API", "Connecter un service", "Automatiser des workflows"],
  },
  formation: {
    slug: "formation",
    name: "KORYXA Formation",
    tagline: "Formations pratiques en Data, IA et Automatisation.",
    summary:
      "KORYXA Formation est un portail de parcours pratiques pour apprendre la data, l’IA et l’automatisation par projets, choisir une formation dédiée et construire des résultats concrets.",
    audience: "Étudiants, professionnels, entrepreneurs, débutants motivés",
    status: "actif",
    href: "https://formation.koryxa.fr",
    stats: [
      { label: "Parcours", value: "Data IA" },
      { label: "Méthode", value: "Projets" },
      { label: "Statut", value: "Public" },
    ],
    highlights: ["Python Data Analyst", "IA appliquée", "Automatisation"],
    primaryCta: { label: "Ouvrir Formation", href: "https://formation.koryxa.fr" },
    useCases: ["Apprendre la data", "Construire un portfolio", "Automatiser des tâches"],
  },
  neurokap: {
    slug: "neurokap",
    name: "NeuroKap",
    tagline: "Entraîne ton cerveau, révèle ton potentiel.",
    summary:
      "NeuroKap transforme mémoire, logique, calcul et décision en défis courts, mesurables et motivants pour révéler un profil cognitif et faire progresser le Cerveau Score.",
    audience: "Apprenants, joueurs, personnes qui veulent entraîner mémoire, logique, calcul et décision",
    status: "actif",
    href: "https://neurokap.koryxa.fr",
    stats: [
      { label: "Jeux", value: "20" },
      { label: "Piliers", value: "5" },
      { label: "Essai", value: "100 Kaps" },
    ],
    highlights: ["Mémoire", "Calcul", "Logique"],
    primaryCta: { label: "Ouvrir NeuroKap", href: "https://neurokap.koryxa.fr" },
    useCases: ["Entraîner la mémoire", "Améliorer le calcul", "Travailler la logique"],
  },
  chatlaya: {
    slug: "chatlaya",
    name: "ChatLAYA",
    tagline: "Assistant conversationnel et espace Founder.",
    summary:
      "ChatLAYA est le produit conversationnel autonome de KORYXA. Son repo contient l’interface de chat, la gestion des conversations, un mode assistant général et un espace Founder pour cadrer un projet jusqu’au dossier final.",
    audience: "Fondateurs, porteurs de projets, utilisateurs qui veulent structurer une idée ou une prochaine action",
    status: "actif",
    href: "/produits/chatlaya",
    stats: [
      { label: "Mode", value: "Chat" },
      { label: "Espace", value: "Founder" },
      { label: "Source", value: "Repo" },
    ],
    highlights: ["Conversations", "Cadrage Founder", "Dossier projet"],
    primaryCta: { label: "Voir la fiche", href: "/produits/chatlaya" },
    useCases: ["Discuter avec une IA", "Structurer une idée", "Préparer un dossier fondateur"],
  },
  "partner-portal": {
    slug: "partner-portal",
    name: "Partner Portal",
    tagline: "Programme partenaire officiel KORYXA.",
    summary:
      "Partner Portal permet de rejoindre le programme partenaire KORYXA, recevoir un code partenaire unique, partager un lien, suivre les gains depuis un dashboard et gérer les leads liés à la formation Python Data Analyst.",
    audience: "Partenaires, ambassadeurs, apporteurs d’affaires, communautés et réseaux terrain",
    status: "actif",
    href: "https://partenaire.koryxa.fr",
    stats: [
      { label: "Commission", value: "5 000 FCFA" },
      { label: "Paiement", value: "48h" },
      { label: "Accès", value: "Dashboard" },
    ],
    highlights: ["Code partenaire", "Dashboard de suivi", "Paiement Mobile Money"],
    primaryCta: { label: "Ouvrir Partner Portal", href: "https://partenaire.koryxa.fr" },
    useCases: ["Devenir partenaire", "Partager un lien", "Suivre les gains", "Gérer les leads"],
  },
  "services-ia": {
    slug: "services-ia",
    name: "Services IA",
    tagline: "Studio d’exécution KORYXA.",
    summary:
      "Services IA transforme les besoins métier en projets livrés : qualification, devis, équipe dédiée et delivery. Le repo présente 10 services IA autour du revenu, de la productivité, du digital, des systèmes et de la sécurité des données.",
    audience: "Entreprises, PME, organisations, porteurs de projets et équipes métier",
    status: "actif",
    href: "/produits/services-ia",
    stats: [
      { label: "Offres", value: "10 services" },
      { label: "Qualification", value: "72h" },
      { label: "Delivery", value: "Équipe dédiée" },
    ],
    highlights: ["Pilotage business", "Automatisation", "Systèmes intégrés"],
    primaryCta: { label: "Voir la fiche", href: "/produits/services-ia" },
    useCases: ["Transformer un besoin métier", "Automatiser un processus", "Créer un système digital"],
  },
};

export const productList = Object.values(productCatalog);

export const removedProductSlugs = new Set(["plusbook", "plusbooks", "koryxa-sante", "sante"]);

export const productSlugAliases: Record<string, string> = {
  "koryxa-chatlaya": "chatlaya",
  "koryxa-cora": "cora",
  "koryxa-partner-portal": "partner-portal",
  "koryxa-api": "api",
  "koryxa-formation": "formation",
  "koryxa_formation": "formation",
  "koryxa-services-ia": "services-ia",
};

export function resolveProductSlug(slug: string): string {
  return productSlugAliases[slug] || slug;
}
