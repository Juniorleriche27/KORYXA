#!/usr/bin/env node

/**
 * Script for submitting KORYXA public URLs to IndexNow (Bing, Yandex, etc.)
 * Usage:
 *   node scripts/submit-indexnow.mjs                  # Fetches and submits all sitemap URLs
 *   node scripts/submit-indexnow.mjs <url1> <url2>... # Submits specific URLs
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "4f8e65a12d9c4b73810e9f82d1c67ab5";
const INDEXNOW_HOST = process.env.INDEXNOW_HOST || "www.koryxa.fr";
const INDEXNOW_ENDPOINT = process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";
const SITEMAP_URL = `https://${INDEXNOW_HOST}/sitemap.xml`;
const KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

const PRIVATE_PREFIXES = [
  "/api",
  "/account",
  "/me",
  "/onboarding",
  "/login",
  "/signup",
  "/sign-in",
  "/sign-up",
  "/logout",
  "/reset",
  "/_next",
];

const STATIC_FALLBACK_ROUTES = [
  "https://www.koryxa.fr/",
  "https://www.koryxa.fr/ecosysteme",
  "https://www.koryxa.fr/produits",
  "https://www.koryxa.fr/cas-usage",
  "https://www.koryxa.fr/partenaires",
  "https://www.koryxa.fr/a-propos",
  "https://www.koryxa.fr/contact",
  "https://www.koryxa.fr/legal/confidentialite",
  "https://www.koryxa.fr/legal/mentions",
];

function extractUrlsFromXml(xml) {
  const urls = [];
  const locRegex = /<loc>(.*?)<\/loc>/gi;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    if (match[1] && match[1].trim()) {
      urls.push(match[1].trim());
    }
  }
  return urls;
}

function extractProductSlugsFromSource() {
  try {
    const dataPath = resolve(__dirname, "../app/produits/data.ts");
    if (existsSync(dataPath)) {
      const content = readFileSync(dataPath, "utf-8");
      const slugs = [];
      const slugRegex = /slug:\s*["']([a-zA-Z0-9_-]+)["']/g;
      let match;
      while ((match = slugRegex.exec(content)) !== null) {
        if (match[1] && !slugs.includes(match[1])) {
          slugs.push(match[1]);
        }
      }
      return slugs.map((slug) => `https://${INDEXNOW_HOST}/produits/${slug}`);
    }
  } catch (err) {
    console.warn("[IndexNow] Could not read product catalog source:", err.message);
  }
  return [];
}

function filterAndDeduplicateUrls(urls) {
  const cleanHost = INDEXNOW_HOST.toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const set = new Set();

  for (const raw of urls) {
    try {
      const parsed = new URL(raw.trim());
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") continue;

      const pHost = parsed.hostname.toLowerCase();
      const match =
        pHost === cleanHost ||
        (cleanHost.startsWith("www.") && pHost === cleanHost.slice(4)) ||
        (!cleanHost.startsWith("www.") && pHost === `www.${cleanHost}`);

      if (!match) continue;

      parsed.hostname = cleanHost;
      parsed.protocol = "https:";
      parsed.port = "";
      parsed.hash = "";

      const pathname = parsed.pathname.replace(/\/+$/, "") || "/";
      parsed.pathname = pathname;
      const isPrivate = PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
      if (isPrivate) continue;

      set.add(parsed.toString());
    } catch {
      // Ignore invalid URLs
    }
  }

  return Array.from(set);
}

async function fetchSitemapUrls() {
  console.log(`[IndexNow] Fetching production sitemap from ${SITEMAP_URL}...`);
  try {
    const res = await fetch(SITEMAP_URL, {
      headers: { "User-Agent": "KORYXA-IndexNow-Submitter/1.0" },
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const xml = await res.text();
      const extracted = extractUrlsFromXml(xml);
      if (extracted.length > 0) {
        console.log(`[IndexNow] Found ${extracted.length} URL(s) in sitemap.`);
        return extracted;
      }
    }
    console.warn(`[IndexNow] Sitemap request returned HTTP ${res.status}. Falling back to local route discovery...`);
  } catch (err) {
    console.warn(`[IndexNow] Unable to fetch online sitemap (${err.message}). Using local route discovery...`);
  }

  const productUrls = extractProductSlugsFromSource();
  const allLocal = [...STATIC_FALLBACK_ROUTES, ...productUrls];
  console.log(`[IndexNow] Discovered ${allLocal.length} local route(s).`);
  return allLocal;
}

async function submitToIndexNow(urlList) {
  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  console.log("\n================ INDEXNOW SUBMISSION ================");
  console.log(`Endpoint     : ${INDEXNOW_ENDPOINT}`);
  console.log(`Host         : ${INDEXNOW_HOST}`);
  console.log(`Key          : ${INDEXNOW_KEY}`);
  console.log(`Key Location : ${KEY_LOCATION}`);
  console.log(`URLs to submit (${urlList.length}) :`);
  urlList.forEach((u, i) => console.log(`  [${i + 1}] ${u}`));
  console.log("=====================================================\n");

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "KORYXA-IndexNow-Client/1.0",
      },
      body: JSON.stringify(payload),
    });

    const bodyText = await res.text().catch(() => "");
    const status = res.status;
    const statusText = res.statusText || "";

    console.log(`HTTP Status: ${status} ${statusText}`);
    if (bodyText.trim()) {
      console.log(`Response Body: ${bodyText.trim()}`);
    }

    if (status === 200) {
      console.log("[IndexNow SUCCESS] URLs submitted successfully (HTTP 200).");
      return { ok: true, status };
    } else if (status === 202) {
      console.log("[IndexNow ACCEPTED] URLs received. Key verification pending (HTTP 202).");
      return { ok: true, status };
    } else if (status === 400) {
      console.error("[IndexNow ERROR] Bad Request: Invalid format or missing parameters (HTTP 400).");
      return { ok: false, status };
    } else if (status === 403) {
      console.error("[IndexNow ERROR] Forbidden: Key not valid or key file not found on host (HTTP 403).");
      return { ok: false, status };
    } else if (status === 422) {
      console.error("[IndexNow ERROR] Unprocessable Entity: URLs do not match host or key issue (HTTP 422).");
      return { ok: false, status };
    } else if (status === 429) {
      console.error("[IndexNow ERROR] Too Many Requests: Rate limit exceeded (HTTP 429).");
      return { ok: false, status };
    } else {
      console.warn(`[IndexNow] Unexpected HTTP response: ${status}`);
      return { ok: false, status };
    }
  } catch (err) {
    console.error(`[IndexNow ERROR] Network request failed: ${err.message}`);
    return { ok: false, error: err.message };
  }
}

async function main() {
  const cliArgs = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
  let rawUrls = [];

  if (cliArgs.length > 0) {
    console.log(`[IndexNow] Submitting ${cliArgs.length} URL(s) provided via CLI arguments.`);
    rawUrls = cliArgs;
  } else {
    rawUrls = await fetchSitemapUrls();
  }

  const validUrls = filterAndDeduplicateUrls(rawUrls);

  if (validUrls.length === 0) {
    console.error("[IndexNow ERROR] No valid public URLs to submit.");
    process.exit(1);
  }

  const result = await submitToIndexNow(validUrls);
  if (!result.ok && result.status !== 202) {
    console.warn("[IndexNow] Submission completed with warnings/errors. Check logs above.");
  }
}

main().catch((err) => {
  console.error("[IndexNow Fatal Error]", err);
  process.exit(1);
});
