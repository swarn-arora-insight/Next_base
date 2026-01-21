import Header from "@/components/global/header/page";
import AuthGuard from "../guard/auth.guard";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: MarketingLayoutProps) {
  return (
    <AuthGuard>
      <main className="h-screen">
        <Header />
        {children}
      </main>
    </AuthGuard>
  );
}
