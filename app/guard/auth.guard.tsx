"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("auth");

    if (!auth) {
      router.replace("/login"); // proxy block
    }
  }, []);

  return <>{children}</>;
}
