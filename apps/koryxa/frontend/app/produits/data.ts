export type ProductStatus = "actif" | "construction";

export type ProductInfo = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  audience: string;
  status: ProductStatus;
  href: string;
  badge?: string;
  category: "Finance & Pilotage" | "Conversation & IA" | "Automatisation & CRM" | "Services & Studio" | "Formation & Talents" | "Infrastructure & APIs" | "Gouvernance & Réseau";
  stats: { label: string; value: string }[];
  highlights: string[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  contact?: string;
  useCases: string[];
};

export const productCatalog: Record<string, ProductInfo> = {
  merqalor: {
    slug: "merqalor",
    name: "MERQALOR",
    tagline: "Le pilotage financier intelligent pour votre quotidien.",
    summary:
      "Centralisez vos flux Wave, Orange Money, MTN et vos comptes bancaires. Bénéficiez de prévisions de trésorerie automatiques et de 4 conseillers IA dédiés pour faire grandir votre argent.",
    audience: "Particuliers, freelances, commerçants, PME et dirigeants",
    status: "actif",
    href: "https://merqalor.koryxa.fr",
    badge: "100% Automatisé",
    category: "Finance & Pilotage",
    stats: [
      { label: "Automatisation", value: "100%" },
      { label: "Conseillers IA", value: "4 dédiés" },
      { label: "Saisie", value: "0 manuelle" },
    ],
    highlights: ["Mobile Money & Banques (Wave, OM, MTN)", "4 Conseillers IA dédiés", "Pilotage en temps réel Pan-Africain"],
    primaryCta: { label: "Accéder à MERQALOR", href: "https://merqalor.koryxa.fr" },
    secondaryCta: { label: "Comment ça marche ?", href: "https://merqalor.koryxa.fr" },
    useCases: ["Centraliser les comptes Wave et banques", "Prévoir sa trésorerie", "Consulter ses conseillers IA"],
  },
  "service-ia": {
    slug: "service-ia",
    name: "KORYXA Service IA & Web",
    tagline: "Le web, l’IA et l’automatisation réunis pour faire avancer votre entreprise.",
    summary:
      "Studio Numérique KORYXA : conception d’expériences numériques premium, d’applications utiles et de systèmes intelligents adaptés à vos opérations et vos clients.",
    audience: "Entreprises, PME, startups, institutions et marques",
    status: "actif",
    href: "https://service-ia.koryxa.fr",
    badge: "Studio Numérique",
    category: "Services & Studio",
    stats: [
      { label: "Pôles", value: "Web & IA" },
      { label: "Livraison", value: "Sur-mesure" },
      { label: "Statut", value: "Opérationnel" },
    ],
    highlights: ["Applications Web & Mobile Premium", "Agents IA & Systèmes Intelligents", "Automatisation de Processus Métier"],
    primaryCta: { label: "Parler de mon projet", href: "https://service-ia.koryxa.fr" },
    secondaryCta: { label: "Explorer les services", href: "https://service-ia.koryxa.fr" },
    useCases: ["Créer une plateforme web sur-mesure", "Intégrer des agents IA", "Automatiser ses opérations"],
  },
  flowcore: {
    slug: "flowcore",
    name: "FlowCore",
    tagline: "Autopilot Intelligence & CRM de prospection multicanal.",
    summary:
      "Tableau de bord CRM Prospects & Décideurs, pilotage autopilot 24/7 et passerelles actives WhatsApp Gateway (Baileys/Meta), Email Outreach B2B, Telegram Instant Bot et Webhooks sortants n8n/Make.",
    audience: "Équipes commerciales, agences, dirigeants de PME et directeurs de croissance",
    status: "actif",
    href: "https://flowcore.koryxa.fr",
    badge: "Autopilot 24/7",
    category: "Automatisation & CRM",
    stats: [
      { label: "Autopilot", value: "24/7 Actif" },
      { label: "Passerelles", value: "4 Canaux" },
      { label: "Qualification", value: "100% Leads" },
    ],
    highlights: ["WhatsApp Gateway & Email Outreach", "Autopilot 24/7 & Scoring IA", "Webhooks sortants n8n / Make"],
    primaryCta: { label: "Ouvrir FlowCore", href: "https://flowcore.koryxa.fr" },
    useCases: ["Capturer et qualifier des prospects", "Automatiser les relances WhatsApp & Email", "Piloter le CRM en autopilot"],
  },
  chatlaya: {
    slug: "chatlaya",
    name: "ChatLAYA",
    tagline: "Assistant IA conversationnel et cadrage d’idées souverain.",
    summary:
      "Plateforme conversationnelle souveraine pour explorer, rédiger, analyser et interagir avec l’IA en langage naturel, avec un espace Founder pour structurer des projets complets.",
    audience: "Grand public, fondateurs, étudiants, créateurs et professionnels",
    status: "actif",
    href: "https://chatlaya.koryxa.fr",
    badge: "Conversation Souveraine",
    category: "Conversation & IA",
    stats: [
      { label: "Modèles", value: "Souverains" },
      { label: "Espace", value: "Founder Lab" },
      { label: "Streaming", value: "Ultra-rapide" },
    ],
    highlights: ["Contextes et langues africaines", "Cadrage de projets Founder", "Sauvegarde centralisée"],
    primaryCta: { label: "Ouvrir ChatLAYA", href: "https://chatlaya.koryxa.fr" },
    useCases: ["Converser avec une IA", "Rédiger des documents complexes", "Structurer un projet d'entreprise"],
  },
  corabiz: {
    slug: "corabiz",
    name: "CoraBiz",
    tagline: "ERP intelligent et agents IA autonomes pour PME.",
    summary:
      "CoraBiz orchestre la gestion et les ventes de la prospection au paiement avec des agents IA autonomes, gestion de stock, facturation, relances et pilotage commercial.",
    audience: "PME, commerçants, entreprises et entrepreneurs",
    status: "actif",
    href: "https://corabiz.koryxa.fr",
    badge: "ERP & Growth",
    category: "Automatisation & CRM",
    stats: [
      { label: "Gestion", value: "ERP IA" },
      { label: "Facturation", value: "Automatisée" },
      { label: "Statut", value: "En production" },
    ],
    highlights: ["Facturation & Devis intelligents", "Suivi des stocks & Trésorerie", "Relances IA automatiques"],
    primaryCta: { label: "Ouvrir CoraBiz", href: "https://corabiz.koryxa.fr" },
    useCases: ["Gérer les ventes et factures", "Suivre les stocks en temps réel", "Automatiser les encaissements"],
  },
  formation: {
    slug: "formation",
    name: "KORYXA Formation",
    tagline: "Formations pratiques et certifiantes en Data, IA et Automatisation.",
    summary:
      "Portail de formation accélérée pour monter en compétences sur les outils de l’IA générative, l’ingénierie de prompt, l’analyse de données Python et l’automatisation.",
    audience: "Étudiants, professionnels, équipes d'entreprises et talents en reconversion",
    status: "actif",
    href: "https://formation.koryxa.fr",
    badge: "Certifications IA",
    category: "Formation & Talents",
    stats: [
      { label: "Parcours", value: "Data & IA" },
      { label: "Méthode", value: "100% Pratique" },
      { label: "Certification", value: "Reconnue" },
    ],
    highlights: ["Python Data Analyst", "Prompt Engineering & IA Appliquée", "Projets réels & Mentorat"],
    primaryCta: { label: "Découvrir les formations", href: "https://formation.koryxa.fr" },
    useCases: ["Se former aux métiers de l'IA", "Monter en compétences en entreprise", "Valider une certification"],
  },
  neurokap: {
    slug: "neurokap",
    name: "NeuroKap",
    tagline: "Entraînement cognitif, logique, calcul et décision.",
    summary:
      "NeuroKap transforme la mémoire, la logique, le calcul et la prise de décision en défis cognitifs mesurables pour révéler le potentiel cérébral et mesurer son Cerveau Score.",
    audience: "Apprenants, professionnels, étudiants et passionnés de performance mentale",
    status: "actif",
    href: "https://neurokap.koryxa.fr",
    badge: "Cognition & Score",
    category: "Finance & Pilotage",
    stats: [
      { label: "Défis", value: "20+ Kaps" },
      { label: "Piliers", value: "5 Domaines" },
      { label: "Mesure", value: "Score Live" },
    ],
    highlights: ["Entraînement de la mémoire", "Calcul rapide & Logique", "Suivi de progression cognitive"],
    primaryCta: { label: "Lancer NeuroKap", href: "https://neurokap.koryxa.fr" },
    useCases: ["Entraîner son cerveau", "Mesurer ses réflexes décisionnels", "Développer son potentiel"],
  },
  "partner-portal": {
    slug: "partner-portal",
    name: "Portail Partenaire",
    tagline: "Programme officiel pour institutions, écoles et partenaires régionaux.",
    summary:
      "Supervision des déploiements régionaux, gestion des cohortes apprenantes, attribution de codes partenaires et suivi des commissions en temps réel.",
    audience: "Universités, ministères, incubateurs, réseaux terrain et ambassadeurs",
    status: "actif",
    href: "https://partenaires.koryxa.fr",
    badge: "Réseau Institutionnel",
    category: "Gouvernance & Réseau",
    stats: [
      { label: "Réseau", value: "Panafricain" },
      { label: "Paiement", value: "Mobile Money" },
      { label: "Accès", value: "Multi-tenant" },
    ],
    highlights: ["Supervision de cohortes", "Codes partenaires & Suivi", "Paiements automatisés 48h"],
    primaryCta: { label: "Rejoindre le réseau", href: "https://partenaires.koryxa.fr" },
    useCases: ["Piloter un partenariat régional", "Gérer des cohortes d'étudiants", "Suivre ses commissions"],
  },
  api: {
    slug: "api",
    name: "KORYXA API",
    tagline: "Moteur d’orchestration et connecteurs IA haute performance.",
    summary:
      "Points d’accès unifiés gRPC / OpenAPI v3 pour interconnecter vos applications d’entreprise aux modèles d’IA, aux flux de données et aux automatisations KORYXA.",
    audience: "Développeurs, CTOs, intégrateurs et architectes de données",
    status: "actif",
    href: "https://api.koryxa.fr",
    badge: "Passerelle Développeur",
    category: "Infrastructure & APIs",
    stats: [
      { label: "Protocole", value: "gRPC & REST" },
      { label: "Sécurité", value: "mTLS / Clerk" },
      { label: "Latence", value: "< 25ms" },
    ],
    highlights: ["Endpoints d'inférence sécurisés", "Connecteurs Webhooks & SSE", "Quotas et clés unifiées"],
    primaryCta: { label: "Consulter la doc API", href: "https://api.koryxa.fr" },
    useCases: ["Intégrer l'IA dans une application", "Automatiser des pipelines de données", "Gérer des accès API"],
  },
  cora: {
    slug: "cora",
    name: "Cora",
    tagline: "Assistant commercial et gestionnaire de campagnes omnicanales.",
    summary:
      "Cora pilote les campagnes commerciales et rattache chaque message, prospect et opportunité à un projet actif avec une clarté absolue.",
    audience: "Commerciaux, agences, porteurs de projets",
    status: "actif",
    href: "https://cora.koryxa.fr",
    badge: "Assistant Commercial",
    category: "Automatisation & CRM",
    stats: [
      { label: "Canaux", value: "Omnicanal" },
      { label: "Suivi", value: "Temps réel" },
      { label: "Accès", value: "Direct" },
    ],
    highlights: ["Campagnes ciblées", "Gestion des prospects", "Fiches projets"],
    primaryCta: { label: "Ouvrir Cora", href: "https://cora.koryxa.fr" },
    useCases: ["Gérer ses campagnes", "Suivre ses prospects", "Organiser ses rendez-vous"],
  },
  "services-ia": {
    slug: "services-ia",
    name: "Services IA & Web",
    tagline: "Le studio d'ingénierie et d'automatisation KORYXA.",
    summary:
      "Transformation des besoins métier en projets livrés : applications web modernes, agents autonomes et pipelines de données adaptés au terrain.",
    audience: "Entreprises, PME, organisations et dirigeants",
    status: "actif",
    href: "https://service-ia.koryxa.fr",
    badge: "Studio Numérique",
    category: "Services & Studio",
    stats: [
      { label: "Projets", value: "Clé en main" },
      { label: "Support", value: "Dédié" },
      { label: "Audit", value: "Sous 48h" },
    ],
    highlights: ["Développement sur-mesure", "Automatisation n8n/Make", "Sécurité des données"],
    primaryCta: { label: "Lancer un projet", href: "https://service-ia.koryxa.fr" },
    useCases: ["Digitaliser une activité", "Déployer un assistant métier", "Automatiser sa comptabilité"],
  },
};

export const visibleProductSlugs = [
  "merqalor",
  "service-ia",
  "flowcore",
  "chatlaya",
  "corabiz",
  "formation",
  "neurokap",
  "partner-portal",
  "api",
] as const;

export const productList: ProductInfo[] = visibleProductSlugs.map((slug) => productCatalog[slug]);

export const removedProductSlugs = new Set(["plusbook", "plusbooks", "koryxa-sante", "sante"]);

export const productSlugAliases: Record<string, string> = {
  "koryxa-merqalor": "merqalor",
  "koryxa-service-ia": "service-ia",
  "koryxa-flowcore": "flowcore",
  "koryxa-chatlaya": "chatlaya",
  "koryxa-cora": "cora",
  "koryxa-partner-portal": "partner-portal",
  "koryxa-api": "api",
  "koryxa-formation": "formation",
  "koryxa_formation": "formation",
  "koryxa-services-ia": "service-ia",
  "services-ia": "service-ia",
};

export function resolveProductSlug(slug: string): string {
  return productSlugAliases[slug] || slug;
}
