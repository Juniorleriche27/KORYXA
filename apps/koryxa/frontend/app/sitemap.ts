import type { MetadataRoute } from "next";
import { productList } from "@/app/produits/data";

const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const BASE_URL = (
  rawBaseUrl && !rawBaseUrl.includes("localhost") && !rawBaseUrl.includes("127.0.0.1")
    ? rawBaseUrl
    : "https://www.koryxa.fr"
).replace(/\/+$/, "");

const staticRoutes = [
  { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { url: "/ecosysteme", priority: 0.9, changeFrequency: "monthly" as const },
  { url: "/produits", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/cas-usage", priority: 0.8, changeFrequency: "monthly" as const },
  { url: "/partenaires", priority: 0.8, changeFrequency: "monthly" as const },
  { url: "/a-propos", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/legal/confidentialite", priority: 0.5, changeFrequency: "yearly" as const },
  { url: "/legal/mentions", priority: 0.5, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = productList.map((product) => ({
    url: `/produits/${product.slug}`,
    priority: 0.65,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...productRoutes].map(({ url, priority, changeFrequency }) => ({
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
