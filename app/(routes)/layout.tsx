import Header from "@/components/global/header/page";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: MarketingLayoutProps) {
  return (
    <main className="h-screen">
        <Header/>
      {children}
    </main>
  );
}