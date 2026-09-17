import { NextResponse } from "next/server";
import { submitUrlsToIndexNow, filterAndValidateUrls, getIndexNowConfig } from "@/lib/indexnow";
import sitemap from "@/app/sitemap";

export async function POST(request: Request) {
  const expectedSecret = process.env.INDEXNOW_SECRET?.trim();
  if (!expectedSecret) {
    return NextResponse.json(
      {
        success: false,
        message: "Service IndexNow non configuré : INDEXNOW_SECRET manquant sur le serveur.",
      },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization") || "";
  const apiKeyHeader = request.headers.get("x-indexnow-secret")?.trim() || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  const isAuthorized =
    (Boolean(token) && token === expectedSecret) ||
    (Boolean(apiKeyHeader) && apiKeyHeader === expectedSecret);

  if (!isAuthorized) {
    return NextResponse.json(
      { success: false, message: "Non autorisé : secret IndexNow manquant ou invalide." },
      { status: 401 },
    );
  }

  const payload = (await request.json().catch(() => ({}))) as { urls?: string[] };
  let targetUrls: string[] = [];

  if (Array.isArray(payload?.urls) && payload.urls.length > 0) {
    targetUrls = payload.urls;
  } else {
    // Default to all public URLs from sitemap
    const sitemapEntries = sitemap();
    targetUrls = sitemapEntries.map((entry) => entry.url);
  }

  const config = getIndexNowConfig();
  const validUrls = filterAndValidateUrls(targetUrls, config.host);

  if (validUrls.length === 0) {
    return NextResponse.json(
      { success: false, message: "Aucune URL publique valide à soumettre pour IndexNow." },
      { status: 400 },
    );
  }

  const result = await submitUrlsToIndexNow(validUrls);

  return NextResponse.json({
    success: result.success,
    totalSubmitted: result.totalSubmitted,
    host: config.host,
    keyLocation: config.keyLocation,
    batches: result.batches.map((b) => ({
      statusCode: b.statusCode,
      statusText: b.statusText,
      message: b.message,
      submittedCount: b.submittedCount,
    })),
    errors: result.errors,
  });
}
