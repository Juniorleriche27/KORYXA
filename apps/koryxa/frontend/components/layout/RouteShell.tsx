"use client";

import type { ReactNode } from "react";
import Footer from "@/components/layout/footer";
import PublicHeader from "@/components/layout/PublicHeader";

export default function RouteShell({
  children,
  autonomousChatlayaHost = false,
}: {
  children: ReactNode;
  autonomousChatlayaHost?: boolean;
}) {
  if (autonomousChatlayaHost) {
    return <>{children}</>;
  }

  return (
    <div className="public-shell relative flex min-h-screen flex-col bg-[#faf9f5] dark:bg-[#050b08] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <PublicHeader />
      <main id="page-content" className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
