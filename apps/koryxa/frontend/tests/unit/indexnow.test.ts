import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import {
  DEFAULT_INDEXNOW_KEY,
  DEFAULT_INDEXNOW_HOST,
  INDEXNOW_API_ENDPOINT,
  getIndexNowConfig,
  filterAndValidateUrls,
  getIndexNowStatusMessage,
  submitIndexNowBatch,
  submitUrlsToIndexNow,
} from "@/lib/indexnow";

describe("IndexNow Configuration & Key File", () => {
  it("provides correct default configuration values", () => {
    const config = getIndexNowConfig();
    expect(config.host).toBe(DEFAULT_INDEXNOW_HOST);
    expect(config.key).toBe(DEFAULT_INDEXNOW_KEY);
    expect(config.endpoint).toBe(INDEXNOW_API_ENDPOINT);
    expect(config.keyLocation).toBe(`https://${DEFAULT_INDEXNOW_HOST}/${DEFAULT_INDEXNOW_KEY}.txt`);
  });

  it("ensures public key file exists and matches default key", () => {
    const keyFilePath = resolve(__dirname, `../../public/${DEFAULT_INDEXNOW_KEY}.txt`);
    expect(existsSync(keyFilePath)).toBe(true);
    const fileContent = readFileSync(keyFilePath, "utf-8").trim();
    expect(fileContent).toBe(DEFAULT_INDEXNOW_KEY);
  });
});

describe("IndexNow URL Filtering and Deduplication", () => {
  it("keeps valid canonical https://www.koryxa.fr URLs", () => {
    const input = [
      "https://www.koryxa.fr/",
      "https://www.koryxa.fr/ecosysteme",
      "https://www.koryxa.fr/produits/merqalor",
    ];
    const filtered = filterAndValidateUrls(input, "www.koryxa.fr");
    expect(filtered).toEqual([
      "https://www.koryxa.fr/",
      "https://www.koryxa.fr/ecosysteme",
      "https://www.koryxa.fr/produits/merqalor",
    ]);
  });

  it("normalizes naked domain koryxa.fr to canonical www.koryxa.fr", () => {
    const input = [
      "https://koryxa.fr/a-propos",
      "http://koryxa.fr/contact",
    ];
    const filtered = filterAndValidateUrls(input, "www.koryxa.fr");
    expect(filtered).toEqual([
      "https://www.koryxa.fr/a-propos",
      "https://www.koryxa.fr/contact",
    ]);
  });

  it("filters out private, auth, and api endpoints", () => {
    const input = [
      "https://www.koryxa.fr/",
      "https://www.koryxa.fr/api/contact",
      "https://www.koryxa.fr/account/role",
      "https://www.koryxa.fr/me/recommendations",
      "https://www.koryxa.fr/login",
      "https://www.koryxa.fr/signup",
      "https://www.koryxa.fr/logout",
      "https://www.koryxa.fr/produits",
    ];
    const filtered = filterAndValidateUrls(input, "www.koryxa.fr");
    expect(filtered).toEqual([
      "https://www.koryxa.fr/",
      "https://www.koryxa.fr/produits",
    ]);
  });

  it("rejects off-domain URLs and malformed strings", () => {
    const input = [
      "https://google.com/search",
      "https://external-partner.com",
      "not-a-url",
      "",
      "https://innovaplus.africa/produits",
    ];
    const filtered = filterAndValidateUrls(input, "www.koryxa.fr");
    expect(filtered).toEqual([]);
  });

  it("deduplicates identical URLs while preserving order", () => {
    const input = [
      "https://www.koryxa.fr/produits",
      "https://www.koryxa.fr/ecosysteme",
      "https://www.koryxa.fr/produits",
      "https://www.koryxa.fr/produits/",
    ];
    const filtered = filterAndValidateUrls(input, "www.koryxa.fr");
    expect(filtered).toEqual([
      "https://www.koryxa.fr/produits",
      "https://www.koryxa.fr/ecosysteme",
    ]);
  });
});

describe("IndexNow Status Code Mapping", () => {
  it("returns proper descriptive messages for each HTTP code", () => {
    expect(getIndexNowStatusMessage(200)).toContain("successfully");
    expect(getIndexNowStatusMessage(202)).toContain("pending or queued");
    expect(getIndexNowStatusMessage(400)).toContain("Bad Request");
    expect(getIndexNowStatusMessage(403)).toContain("Forbidden");
    expect(getIndexNowStatusMessage(422)).toContain("Unprocessable");
    expect(getIndexNowStatusMessage(429)).toContain("Too Many Requests");
  });
});

describe("IndexNow Batch Submission", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("submits batch with proper payload structure on 200 OK", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      statusText: "OK",
      ok: true,
      text: async () => "",
    });

    const urls = ["https://www.koryxa.fr/", "https://www.koryxa.fr/ecosysteme"];
    const result = await submitIndexNowBatch(urls, {
      fetchFn: mockFetch as unknown as typeof fetch,
      silent: true,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [calledUrl, calledInit] = mockFetch.mock.calls[0];
    expect(calledUrl).toBe(INDEXNOW_API_ENDPOINT);
    expect(calledInit.method).toBe("POST");

    const parsedBody = JSON.parse(calledInit.body);
    expect(parsedBody.host).toBe(DEFAULT_INDEXNOW_HOST);
    expect(parsedBody.key).toBe(DEFAULT_INDEXNOW_KEY);
    expect(parsedBody.keyLocation).toBe(`https://${DEFAULT_INDEXNOW_HOST}/${DEFAULT_INDEXNOW_KEY}.txt`);
    expect(parsedBody.urlList).toEqual(urls);

    expect(result.ok).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.submittedCount).toBe(2);
  });

  it("handles 202 Accepted status as a successful queued submission", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 202,
      statusText: "Accepted",
      ok: true,
      text: async () => "Key verification pending",
    });

    const urls = ["https://www.koryxa.fr/produits"];
    const result = await submitIndexNowBatch(urls, {
      fetchFn: mockFetch as unknown as typeof fetch,
      silent: true,
    });

    expect(result.ok).toBe(true);
    expect(result.statusCode).toBe(202);
    expect(result.submittedCount).toBe(1);
  });

  it("handles 403 Forbidden on invalid key", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 403,
      statusText: "Forbidden",
      ok: false,
      text: async () => "Key not found",
    });

    const urls = ["https://www.koryxa.fr/produits"];
    const result = await submitIndexNowBatch(urls, {
      fetchFn: mockFetch as unknown as typeof fetch,
      silent: true,
    });

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(403);
    expect(result.submittedCount).toBe(0);
  });

  it("handles network failure gracefully", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Connection refused"));

    const urls = ["https://www.koryxa.fr/produits"];
    const result = await submitIndexNowBatch(urls, {
      fetchFn: mockFetch as unknown as typeof fetch,
      silent: true,
    });

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(500);
    expect(result.message).toContain("Connection refused");
  });

  it("submitUrlsToIndexNow end-to-end chunks and aggregates results", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      statusText: "OK",
      ok: true,
      text: async () => "",
    });

    const rawList = [
      "https://www.koryxa.fr/a-propos",
      "https://www.koryxa.fr/contact",
      "https://koryxa.fr/contact", // duplicate
      "https://www.koryxa.fr/api/contact", // private, should be filtered
    ];

    const result = await submitUrlsToIndexNow(rawList, {
      fetchFn: mockFetch as unknown as typeof fetch,
      silent: true,
    });

    expect(result.success).toBe(true);
    expect(result.totalSubmitted).toBe(2);
    expect(result.batches.length).toBe(1);
    expect(result.errors.length).toBe(0);
  });
});
