"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/logo";
import { ModeToggle } from "@/components/toggleMode";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, User, UserRoundCog } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearSession } from "@/utils/storage";

export default function Header() {
  const [addBorder, setAddBorder] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      setAddBorder(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logOut = () => {
  clearSession();
    router.push("/login");
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 py-2 bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm"
        )}
      >
        <div className="mx-auto px-4 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="relative flex items-center space-x-2"
            title="brand-logo"
          >
            <Logo className="w-auto dark:invert" />
            <span className="font-bold text-xl">Nextbase</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                title="User management"
                size="sm"
                onClick={() => router.push("/user-management")}
                className="bg-primary hover:bg-primary/80 cursor-pointer text-text"
              >
                <UserRoundCog className="h-4 w-4" />
              </Button>

              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm"
                    title="User profile"
                  className="bg-primary hover:bg-primary/80 cursor-pointer text-text">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="">
                  <DropdownMenuItem onClick={logOut} className="cursor-pointer">
                    <LogOut/>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <hr
          className={cn(
            "absolute w-full bottom-0 transition-opacity duration-300 ease-in-out",
            addBorder ? "opacity-100" : "opacity-0"
          )}
        />
      </header>
    </>
  );
}

