export const KORYXA_ACCOUNT_URL = "https://accounts.koryxa.fr/sign-in";

export const PUBLIC_ROUTES = {
  home: "/",
  ecosysteme: "/ecosysteme",
  produits: "/produits",
  casUsage: "/cas-usage",
  partenaires: "/partenaires",
  apropos: "/a-propos",
  contact: "/contact",
  privacy: "/legal/confidentialite",
  terms: "/legal/mentions",
} as const;

export const CONNECTED_ROUTES = {
  login: KORYXA_ACCOUNT_URL,
  signup: "https://accounts.koryxa.fr/sign-up",
  home: "/",
} as const;

export const MAIN_NAV_LINKS = [
  { href: PUBLIC_ROUTES.home, label: "Accueil" },
  { href: PUBLIC_ROUTES.ecosysteme, label: "Écosystème" },
  { href: PUBLIC_ROUTES.produits, label: "Produits" },
  { href: PUBLIC_ROUTES.casUsage, label: "Cas d’usage" },
  { href: PUBLIC_ROUTES.partenaires, label: "Partenaires" },
  { href: PUBLIC_ROUTES.apropos, label: "À propos" },
] as const;
