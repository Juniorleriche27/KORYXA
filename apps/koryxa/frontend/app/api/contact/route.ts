import { NextResponse } from "next/server";

const CONTACT_API_PATH = "/api/v1/contacts";

function adminApiBaseUrl() {
  return (
    process.env.KORYXA_ADMIN_API_URL ||
    process.env.NEXT_PUBLIC_KORYXA_ADMIN_API_URL ||
    ""
  ).replace(/\/$/, "");
}

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const baseUrl = adminApiBaseUrl();
  if (!baseUrl) {
    return NextResponse.json(
      { success: false, message: "Le service de contact KORYXA n'est pas encore configuré." },
      { status: 503 },
    );
  }

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ success: false, message: "Payload invalide." }, { status: 400 });
  }

  const response = await fetch(`${baseUrl}${CONTACT_API_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Forwarded-For": clientIp(request),
      "User-Agent": request.headers.get("user-agent") || "koryxa-public-form",
    },
    body: JSON.stringify({
      ...payload,
      source: "koryxa_public_contact",
      page_url: request.headers.get("referer") || "https://koryxa.fr/contact",
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null) as { detail?: string; message?: string } | null;

  if (!response.ok) {
    return NextResponse.json(
      { success: false, message: data?.detail || data?.message || "Impossible d'envoyer le message." },
      { status: response.status },
    );
  }

  return NextResponse.json({ success: true, message: "Message reçu. KORYXA vous répondra depuis le bon canal." });
}
