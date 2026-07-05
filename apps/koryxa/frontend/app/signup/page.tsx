import { redirect } from "next/navigation";

import { resolveSafeAuthRedirectTarget } from "@/lib/auth-redirect";

type SearchParams = Record<string, string | string[] | undefined>;
type SearchParamsInput = SearchParams | Promise<SearchParams>;

function one(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

async function resolveSearchParams(input?: SearchParamsInput): Promise<SearchParams | undefined> {
  if (!input) return undefined;
  if (typeof (input as Promise<SearchParams>).then === "function") {
    return await (input as Promise<SearchParams>);
  }
  return input as SearchParams;
}

function buildIdentityRedirect(mode: "sign-in" | "sign-up", requestedRedirect?: string) {
  const target = resolveSafeAuthRedirectTarget(requestedRedirect, "/");
  const url = new URL(`https://accounts.koryxa.fr/${mode}`);
  url.searchParams.set("redirect_url", new URL(target, "https://www.koryxa.fr").toString());
  return url.toString();
}

export default async function SignupPage({ searchParams }: { searchParams?: SearchParamsInput }) {
  const params = await resolveSearchParams(searchParams);
  redirect(buildIdentityRedirect("sign-up", one(params?.redirect) || one(params?.next) || one(params?.redirect_url)));
}
