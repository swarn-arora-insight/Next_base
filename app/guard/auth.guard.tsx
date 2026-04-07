"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/storage";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Read token on mount
    const t = getToken();
    setTokenState(t);

    if (!t) {
      router.replace("/login");
    } else {
      setLoading(false);
    }

    // Listen for token changes in localStorage (optional but helps cross-tab)
    const handleStorageChange = () => {
      const updatedToken = getToken();
      setTokenState(updatedToken);
      if (!updatedToken) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router]);

  if (loading) return null;

  // Only render children if token exists
  return token ? <>{children}</> : null;
}
