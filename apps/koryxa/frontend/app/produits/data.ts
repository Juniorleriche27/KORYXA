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
    tagline: "Site public non disponible au moment du relevé.",
    summary:
      "Le domaine public chatlaya.koryxa.fr n’a pas retourné de contenu exploitable pendant le relevé. La fiche reste interne jusqu’à disponibilité d’une source publique fiable.",
    audience: "À confirmer depuis le site public",
    status: "construction",
    href: "/produits/chatlaya",
    stats: [
      { label: "Source", value: "Indispo" },
      { label: "Lien", value: "Interne" },
      { label: "Statut", value: "À vérifier" },
    ],
    highlights: ["Source publique indisponible", "Fiche interne", "À vérifier"],
    primaryCta: { label: "Voir la fiche", href: "/produits/chatlaya" },
    useCases: ["À confirmer depuis le site public"],
  },
  "partner-portal": {
    slug: "partner-portal",
    name: "Partner Portal",
    tagline: "Site public non confirmé.",
    summary:
      "Aucune page publique Partner Portal n’a été trouvée sur les domaines testés. La fiche reste interne jusqu’à confirmation d’une URL publique officielle.",
    audience: "À confirmer depuis le site public",
    status: "construction",
    href: "/produits/partner-portal",
    stats: [
      { label: "Source", value: "Absente" },
      { label: "Lien", value: "Interne" },
      { label: "Statut", value: "À vérifier" },
    ],
    highlights: ["URL publique absente", "Fiche interne", "À confirmer"],
    primaryCta: { label: "Voir la fiche", href: "/produits/partner-portal" },
    useCases: ["À confirmer depuis le site public"],
  },
  "services-ia": {
    slug: "services-ia",
    name: "Services IA",
    tagline: "Site public non confirmé.",
    summary:
      "Aucun domaine public Services IA n’a été résolu pendant le relevé. La fiche reste interne jusqu’à confirmation d’une URL publique officielle.",
    audience: "À confirmer depuis le site public",
    status: "construction",
    href: "/produits/services-ia",
    stats: [
      { label: "Source", value: "Absente" },
      { label: "Lien", value: "Interne" },
      { label: "Statut", value: "À vérifier" },
    ],
    highlights: ["URL publique absente", "Fiche interne", "À confirmer"],
    primaryCta: { label: "Voir la fiche", href: "/produits/services-ia" },
    useCases: ["À confirmer depuis le site public"],
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
