import type { MetadataRoute } from "next";

const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const BASE_URL = (
  rawBaseUrl && !rawBaseUrl.includes("localhost") && !rawBaseUrl.includes("127.0.0.1")
    ? rawBaseUrl
    : "https://www.koryxa.fr"
).replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/account/", "/me/"] },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
