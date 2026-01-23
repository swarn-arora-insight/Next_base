"use client";

import Header from "@/components/global/header/page";
import AuthGuard from "../guard/auth.guard";
import { PersistProviders } from "@/providers/presist-provider";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: MarketingLayoutProps) {
  return (
    <AuthGuard>
      <PersistProviders>
        <main className="h-screen">
          <Header />
          {children}
        </main>
      </PersistProviders>
    </AuthGuard>
  );
}
