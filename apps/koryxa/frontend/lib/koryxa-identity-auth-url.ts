const KORYXA_ACCOUNTS_ORIGIN = "https://accounts.koryxa.fr";

export const KORYXA_IDENTITY_SIGN_IN_URL = `${KORYXA_ACCOUNTS_ORIGIN}/sign-in`;
export const KORYXA_IDENTITY_SIGN_UP_URL = `${KORYXA_ACCOUNTS_ORIGIN}/sign-up`;

function safeRedirectPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.startsWith("/login") || value.startsWith("/signup") || value.startsWith("/sign-in") || value.startsWith("/sign-up")) return "/";
  return value;
}

export function buildKoryxaIdentityAuthUrl(params: {
  mode?: "sign-in" | "sign-up";
  redirectPath?: string | null;
}) {
  const url = new URL(params.mode === "sign-up" ? KORYXA_IDENTITY_SIGN_UP_URL : KORYXA_IDENTITY_SIGN_IN_URL);
  url.searchParams.set("redirect_url", new URL(safeRedirectPath(params.redirectPath), "https://www.koryxa.fr").toString());
  return url.toString();
}
