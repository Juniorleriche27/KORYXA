export type ProductInfo = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  highlights: string[];
  heroImage: string;
  stats: { label: string; value: string }[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  contact?: string;
  useCases: string[];
};

export const productCatalog: Record<string, ProductInfo> = {};

export const productList = Object.values(productCatalog);

export const removedProductSlugs = new Set(["plusbook", "plusbooks", "koryxa-sante", "sante"]);

export const productSlugAliases: Record<string, string> = {};

export function resolveProductSlug(slug: string): string {
  return productSlugAliases[slug] || slug;
}
