export type ProductStatus = "actif" | "construction" | "interne";

export type ProductInfo = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  audience: string;
  status: ProductStatus;
  repo?: string;
  href: string;
  stats: { label: string; value: string }[];
  highlights: string[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  contact?: string;
  useCases: string[];
};

export const productCatalog: Record<string, ProductInfo> = {
  chatlaya: {
    slug: "chatlaya",
    name: "ChatLAYA",
    tagline: "Assistant conversationnel IA de l’écosystème KORYXA.",
    summary: "ChatLAYA donne une interface conversationnelle pour explorer, cadrer et accélérer des usages IA.",
    audience: "Utilisateurs, fondateurs, équipes projet",
    status: "actif",
    href: "/produits/chatlaya",
    stats: [{ label: "Accès", value: "1" }, { label: "Mode", value: "IA" }, { label: "Statut", value: "Actif" }],
    highlights: ["Conversation IA", "Cadrage", "Espace autonome"],
    primaryCta: { label: "Découvrir", href: "/produits/chatlaya" },
    useCases: ["Discuter avec une IA", "Explorer une idée", "Structurer un besoin"],
  },
  cora: {
    slug: "cora",
    name: "Cora",
    tagline: "Produit autonome KORYXA pour les parcours métier et organisationnels.",
    summary: "Cora fait partie des produits autonomes connectés à l’identité et à l’écosystème KORYXA.",
    audience: "Organisations, équipes, utilisateurs métier",
    status: "actif",
    href: "/produits/cora",
    stats: [{ label: "Produit", value: "1" }, { label: "Accès", value: "KORYXA" }, { label: "Statut", value: "Actif" }],
    highlights: ["Produit autonome", "Parcours métier", "Accès KORYXA"],
    primaryCta: { label: "Découvrir", href: "/produits/cora" },
    useCases: ["Utiliser un produit autonome", "Connecter une organisation"],
  },
  "partner-portal": {
    slug: "partner-portal",
    name: "Partner Portal",
    tagline: "Espace partenaires de l’écosystème KORYXA.",
    summary: "Partner Portal structure les relations avec les partenaires, institutions et organisations connectées à KORYXA.",
    audience: "Partenaires, institutions, organisations",
    status: "actif",
    href: "/produits/partner-portal",
    stats: [{ label: "Espace", value: "Partenaires" }, { label: "Accès", value: "Central" }, { label: "Statut", value: "Actif" }],
    highlights: ["Partenariats", "Suivi", "Organisation"],
    primaryCta: { label: "Accéder", href: "/produits/partner-portal" },
    useCases: ["Devenir partenaire", "Suivre une collaboration"],
  },
  api: {
    slug: "api",
    name: "KORYXA API",
    tagline: "Couche technique d’accès aux systèmes KORYXA.",
    summary: "KORYXA API expose les fondations techniques nécessaires aux produits autonomes et aux intégrations.",
    audience: "Développeurs, produits, intégrations",
    status: "interne",
    href: "/produits/api",
    stats: [{ label: "Couche", value: "API" }, { label: "Usage", value: "Interne" }, { label: "Statut", value: "Actif" }],
    highlights: ["API", "Intégrations", "Systèmes"],
    primaryCta: { label: "Voir l’API", href: "/produits/api" },
    useCases: ["Utiliser une API", "Connecter un produit"],
  },
  formation: {
    slug: "formation",
    name: "KORYXA Formation",
    tagline: "Espace de formation et montée en compétence IA.",
    summary: "KORYXA Formation accompagne les talents dans l’apprentissage et l’usage concret de l’intelligence artificielle.",
    audience: "Talents, apprenants, communautés",
    status: "actif",
    href: "/produits/formation",
    stats: [{ label: "Public", value: "Talents" }, { label: "Focus", value: "IA" }, { label: "Statut", value: "Actif" }],
    highlights: ["Formation", "Talents", "Compétences IA"],
    primaryCta: { label: "Découvrir", href: "/produits/formation" },
    useCases: ["Former des talents", "Comprendre l’IA"],
  },
  neurokap: {
    slug: "neurokap",
    name: "Neurokap",
    tagline: "Projet IA autonome rattaché à l’écosystème KORYXA.",
    summary: "Neurokap porte une logique produit autonome dans l’univers KORYXA, avec ses propres usages et son propre périmètre.",
    audience: "Utilisateurs avancés, projets IA",
    status: "actif",
    href: "/produits/neurokap",
    stats: [{ label: "Projet", value: "IA" }, { label: "Mode", value: "Autonome" }, { label: "Statut", value: "Actif" }],
    highlights: ["Projet IA", "Autonomie", "Écosystème"],
    primaryCta: { label: "Découvrir", href: "/produits/neurokap" },
    useCases: ["Explorer un projet IA", "Utiliser un produit autonome"],
  },
  corabiz: {
    slug: "corabiz",
    name: "Corabiz",
    tagline: "Projet business autonome connecté à KORYXA.",
    summary: "Corabiz structure une branche business autonome de l’écosystème, reliée à la marque et à l’accès KORYXA.",
    audience: "Entrepreneurs, PME, équipes business",
    status: "actif",
    href: "/produits/corabiz",
    stats: [{ label: "Cible", value: "Business" }, { label: "Mode", value: "Autonome" }, { label: "Statut", value: "Actif" }],
    highlights: ["Business", "PME", "Produit autonome"],
    primaryCta: { label: "Découvrir", href: "/produits/corabiz" },
    useCases: ["Digitaliser une activité", "Structurer une organisation"],
  },
  "services-ia": {
    slug: "services-ia",
    name: "Services IA",
    tagline: "Produit autonome pour les prestations et l’exécution IA.",
    summary: "Services IA concentre les offres, demandes et prestations IA dans un dépôt séparé de la vitrine centrale.",
    audience: "Entreprises, organisations, porteurs de projets",
    status: "actif",
    href: "/produits/services-ia",
    stats: [{ label: "Offre", value: "Services" }, { label: "Mode", value: "Autonome" }, { label: "Statut", value: "Actif" }],
    highlights: ["Prestations IA", "Exécution", "Demandes clients"],
    primaryCta: { label: "Découvrir", href: "/produits/services-ia" },
    useCases: ["Lancer un projet IA", "Demander une prestation", "Structurer un besoin"],
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
