import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Mono, DM_Sans, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";

import { AuthProvider } from "@/components/auth/AuthProvider";
import RouteShell from "@/components/layout/RouteShell";
import { KORYXA_IDENTITY_SIGN_IN_URL, KORYXA_IDENTITY_SIGN_UP_URL } from "@/lib/koryxa-identity-auth-url";
import { ThemeProvider, themeInitScript } from "@/components/theme/ThemeProvider";
import PWARegister from "@/components/util/PWARegister";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-mono",
  display: "swap",
});

const pwaResetScript = `
(() => {
  if (typeof window === "undefined") return;
  const unregister = async () => {
    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key.startsWith("innova-pwa")).map((key) => caches.delete(key)));
      }
    } catch {}
  };
  void unregister();
})();
`;

export const metadata: Metadata = {
  title: "KORYXA",
  description: "La première plateforme d'orchestration IA en Afrique.",
  applicationName: "KORYXA",
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://koryxa.com"),
  openGraph: {
    title: "KORYXA",
    description: "La première plateforme d'orchestration IA en Afrique.",
    url: "/",
    siteName: "KORYXA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KORYXA",
    description: "La première plateforme d'orchestration IA en Afrique.",
  },
};

export default async function RootLayout(props: { children: ReactNode }) {
  const { children } = props;
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-koryxa-host") ||
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    "";
  const normalizedHost = host.split(":")[0];
  const autonomousChatlayaHost = false;

  return (
    <html
      lang="fr"
      data-app-host={normalizedHost}
      className={`${dmSans.variable} ${playfair.variable} ${dmMono.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: pwaResetScript }} />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-[#fffdf6] text-[#1a1f2e] antialiased transition-colors duration-300">
        <a
          href="#page-content"
          className="sr-only z-50 rounded bg-slate-900 px-3 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-16"
        >
          Aller au contenu
        </a>
        <ClerkProvider signInUrl={KORYXA_IDENTITY_SIGN_IN_URL} signUpUrl={KORYXA_IDENTITY_SIGN_UP_URL}>
          <ThemeProvider>
            <AuthProvider>
              <PWARegister />
              <RouteShell autonomousChatlayaHost={autonomousChatlayaHost}>{children}</RouteShell>
            </AuthProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
