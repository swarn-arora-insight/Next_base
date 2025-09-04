import { SiteHeader } from "./dashboard/components/site-header";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: MarketingLayoutProps) {
  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader/>
      {children}
    </main>
  );
}