"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import Logo from "@/components/logo";
import { ModeToggle } from "@/components/toggleMode";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, LogOut, User, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearSession } from "@/utils/storage";

import type { RootState } from "@/redux/store";

export default function Header() {
  const [addBorder, setAddBorder] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const firstLetter = user?.firstname?.charAt(0).toUpperCase();

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setAddBorder(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logOut = () => {
    clearSession(); // optional: also clear redux store if needed
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 py-2 bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm"
      )}
    >
      <div className="mx-auto px-4 flex justify-between items-center">
        <Link href="/dashboard" className="relative flex items-center space-x-2" title="brand-logo">
          <Logo className="w-auto dark:invert" />
          <span className="font-bold text-xl">Nextbase</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            title="User management"
            onClick={() => router.push("/user-management")}
            className="bg-primary hover:bg-primary/80 cursor-pointer text-text"
          >
            <Users className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="sm"
            title="Dashboard"
            onClick={() => router.push("/dashboard")}
            className="bg-primary hover:bg-primary/80 cursor-pointer text-text"
          >
            <Home className="h-4 w-4" />
          </Button>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                title="User profile"
                className="bg-primary hover:bg-primary/80 cursor-pointer text-text"
              >
                {firstLetter ?? <User className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={logOut} className="cursor-pointer flex items-center gap-2">
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <hr
        className={cn(
          "absolute w-full bottom-0 transition-opacity duration-300 ease-in-out",
          addBorder ? "opacity-100" : "opacity-0"
        )}
      />
    </header>
  );
}
