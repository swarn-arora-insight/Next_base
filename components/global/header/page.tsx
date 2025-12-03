"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/logo";
import Menu from "@/components/menu";
import { ModeToggle } from "@/components/toggleMode";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu as MenuIcon, Palette } from "lucide-react";
import { ThemeCustomizer } from "../custom-theme/page";
import { useRouter } from "next/navigation";

export default function Header() {
  const [addBorder, setAddBorder] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      setAddBorder(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logOut = () => {
    document.cookie = "auth=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 py-2 bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm"
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="relative flex items-center space-x-2"
            title="brand-logo"
          >
            <Logo className="w-auto h-4 dark:invert" />
            <span className="font-bold text-xl">Template</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <nav>
              <Menu />
            </nav>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsThemeOpen(true)}
                variant="default"
                size="sm"
                className="bg-primary/80 text-white border border-gray-300/40"
              >
                <Palette className="h-4 w-4 mr-1" />
                Customize Theme
              </Button>

              <Button
                onClick={() => router.push("/user-management")} 
                variant="default"
                size="sm"
                className="bg-primary/80 border-gray-300/40 text-white"
              >
                User
              </Button>

              <ModeToggle />
              <Button
                variant="default"
                size="sm"
                className="bg-primary/80 text-white border border-gray-300/40"
                onClick={logOut}
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>

        {/* Scroll Border */}
        <hr
          className={cn(
            "absolute w-full bottom-0 transition-opacity duration-300 ease-in-out",
            addBorder ? "opacity-100" : "opacity-0"
          )}
        />
      </header>
      <ThemeCustomizer isOpen={isThemeOpen} onOpenChange={setIsThemeOpen} />
    </>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger>
        <MenuIcon className="w-6 h-6 cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="right" className="p-6 space-y-6">
        <SheetHeader>
          <SheetTitle className="text-left text-xl">Menu</SheetTitle>
        </SheetHeader>

        {/* Logo inside mobile drawer */}
        <div className="flex items-center space-x-2 mb-2">
          <Logo className="h-5 dark:invert" />
          <span className="font-bold">Template</span>
        </div>

        {/* Mobile nav items */}
        <div className="space-y-4">{/* <Menu mobile /> */}</div>

        {/* Theme + Login */}
        <div className="pt-6 space-y-4">
          <ModeToggle />

          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            LogOut
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
