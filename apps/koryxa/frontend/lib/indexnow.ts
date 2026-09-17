/**
 * IndexNow Client for KORYXA
 * Enables immediate indexing notifications to compatible search engines (Bing, Yandex, Naver, Seznam, etc.)
 * Specs: https://www.indexnow.org/documentation
 */

export const DEFAULT_INDEXNOW_KEY = "4f8e65a12d9c4b73810e9f82d1c67ab5";
export const DEFAULT_INDEXNOW_HOST = "www.koryxa.fr";
export const INDEXNOW_API_ENDPOINT = "https://api.indexnow.org/indexnow";
export const MAX_INDEXNOW_BATCH_SIZE = 10000;

export interface IndexNowConfig {
  host: string;
  key: string;
  keyLocation: string;
  endpoint: string;
}

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation?: string;
  urlList: string[];
}

export interface IndexNowResponse {
  ok: boolean;
  statusCode: number;
  statusText: string;
  message: string;
  submittedCount: number;
  urlList: string[];
}

export interface IndexNowBatchResult {
  success: boolean;
  totalSubmitted: number;
  batches: IndexNowResponse[];
  errors: string[];
}

export interface IndexNowOptions {
  host?: string;
  key?: string;
  keyLocation?: string;
  endpoint?: string;
  fetchFn?: typeof fetch;
  silent?: boolean;
}

const PRIVATE_PATH_PREFIXES = [
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

/**
 * Returns current IndexNow configuration with fallbacks.
 */
export function getIndexNowConfig(options?: IndexNowOptions): IndexNowConfig {
  const host = options?.host || process.env.INDEXNOW_HOST || DEFAULT_INDEXNOW_HOST;
  const key = options?.key || process.env.INDEXNOW_KEY || DEFAULT_INDEXNOW_KEY;
  const endpoint = options?.endpoint || process.env.INDEXNOW_ENDPOINT || INDEXNOW_API_ENDPOINT;
  const keyLocation = options?.keyLocation || `https://${host}/${key}.txt`;

  return {
    host,
    key,
    keyLocation,
    endpoint,
  };
}

/**
 * Validates, filters, normalizes and deduplicates a list of URLs for IndexNow submission.
 */
export function filterAndValidateUrls(urls: string[], targetHost = DEFAULT_INDEXNOW_HOST): string[] {
  const cleanHost = targetHost.toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const validSet = new Set<string>();

  for (const rawUrl of urls) {
    if (!rawUrl || typeof rawUrl !== "string") continue;
    try {
      const parsed = new URL(rawUrl.trim());
      // Only http / https
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        continue;
      }

      // Host must match targetHost or naked domain variant
      const parsedHost = parsed.hostname.toLowerCase();
      const isMatchingHost =
        parsedHost === cleanHost ||
        (cleanHost.startsWith("www.") && parsedHost === cleanHost.slice(4)) ||
        (!cleanHost.startsWith("www.") && parsedHost === `www.${cleanHost}`);

      if (!isMatchingHost) {
        continue;
      }

      // Canonicalize host to targetHost
      parsed.hostname = cleanHost;
      parsed.protocol = "https:";
      parsed.port = "";
      parsed.hash = "";

      const pathname = parsed.pathname.replace(/\/+$/, "") || "/";
      parsed.pathname = pathname;

      // Filter out non-indexable and private paths
      const isPrivate = PRIVATE_PATH_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
      );
      if (isPrivate) {
        continue;
      }

      validSet.add(parsed.toString());
    } catch {
      // Ignore malformed URLs
      continue;
    }
  }

  return Array.from(validSet);
}

/**
 * Maps IndexNow HTTP status codes to informative messages.
 */
export function getIndexNowStatusMessage(statusCode: number): string {
  switch (statusCode) {
    case 200:
      return "URL(s) submitted successfully.";
    case 202:
      return "URL(s) received. IndexNow key validation pending or queued.";
    case 400:
      return "Bad Request: Invalid format, malformed JSON, or missing required fields.";
    case 403:
      return "Forbidden: Key is not valid (key not found at keyLocation or content mismatch).";
    case 422:
      return "Unprocessable Entity: URLs do not match host or key not matching schema.";
    case 429:
      return "Too Many Requests: Rate limit exceeded (potential spam protection).";
    default:
      return `IndexNow API returned unexpected HTTP status code ${statusCode}.`;
  }
}

/**
 * Submits a single batch (<= 10,000 URLs) to IndexNow API.
 */
export async function submitIndexNowBatch(
  urlList: string[],
  options?: IndexNowOptions,
): Promise<IndexNowResponse> {
  const config = getIndexNowConfig(options);
  const fetchImpl = options?.fetchFn || fetch;

  if (!urlList.length) {
    return {
      ok: false,
      statusCode: 400,
      statusText: "Bad Request",
      message: "Cannot submit empty URL list to IndexNow.",
      submittedCount: 0,
      urlList: [],
    };
  }

  if (urlList.length > MAX_INDEXNOW_BATCH_SIZE) {
    throw new Error(
      `Batch size exceeds maximum limit of ${MAX_INDEXNOW_BATCH_SIZE} URLs. Use submitUrlsToIndexNow for automatic chunking.`,
    );
  }

  const payload: IndexNowPayload = {
    host: config.host,
    key: config.key,
    keyLocation: config.keyLocation,
    urlList,
  };

  try {
    const response = await fetchImpl(config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "KORYXA-IndexNow-Client/1.0",
      },
      body: JSON.stringify(payload),
    });

    const statusCode = response.status;
    const statusText = response.statusText || (statusCode === 200 ? "OK" : statusCode === 202 ? "Accepted" : "Error");
    const ok = statusCode === 200 || statusCode === 202;
    const message = getIndexNowStatusMessage(statusCode);

    if (!options?.silent) {
      if (ok) {
        console.log(`[IndexNow] Submitted ${urlList.length} URL(s) to ${config.endpoint} -> HTTP ${statusCode} (${message})`);
      } else {
        console.error(`[IndexNow] Error submitting to ${config.endpoint} -> HTTP ${statusCode} ${statusText} (${message})`);
      }
    }

    return {
      ok,
      statusCode,
      statusText,
      message,
      submittedCount: ok ? urlList.length : 0,
      urlList,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!options?.silent) {
      console.error(`[IndexNow] Network/Fetch error: ${errorMessage}`);
    }
    return {
      ok: false,
      statusCode: 500,
      statusText: "Internal Client Error",
      message: `Failed to connect to IndexNow endpoint: ${errorMessage}`,
      submittedCount: 0,
      urlList,
    };
  }
}

/**
 * Submits an arbitrary list of URLs to IndexNow, filtering, deduplicating,
 * and splitting into batches of 10,000 if necessary.
 */
export async function submitUrlsToIndexNow(
  urls: string[],
  options?: IndexNowOptions,
): Promise<IndexNowBatchResult> {
  const config = getIndexNowConfig(options);
  const validUrls = filterAndValidateUrls(urls, config.host);

  if (!validUrls.length) {
    return {
      success: false,
      totalSubmitted: 0,
      batches: [],
      errors: ["No valid indexable URLs matching host provided."],
    };
  }

  const batches: IndexNowResponse[] = [];
  const errors: string[] = [];
  let totalSubmitted = 0;

  for (let i = 0; i < validUrls.length; i += MAX_INDEXNOW_BATCH_SIZE) {
    const chunk = validUrls.slice(i, i + MAX_INDEXNOW_BATCH_SIZE);
    const result = await submitIndexNowBatch(chunk, options);
    batches.push(result);
    if (result.ok) {
      totalSubmitted += result.submittedCount;
    } else {
      errors.push(`Batch ${batches.length} failed with HTTP ${result.statusCode}: ${result.message}`);
    }
  }

  return {
    success: errors.length === 0,
    totalSubmitted,
    batches,
    errors,
  };
}

/**
 * Helper to submit a single URL to IndexNow.
 */
export async function submitUrlToIndexNow(
  url: string,
  options?: IndexNowOptions,
): Promise<IndexNowResponse> {
  const result = await submitUrlsToIndexNow([url], options);
  if (result.batches.length > 0) {
    return result.batches[0];
  }
  return {
    ok: false,
    statusCode: 400,
    statusText: "Bad Request",
    message: result.errors[0] || "URL is not valid for submission.",
    submittedCount: 0,
    urlList: [],
  };
}
