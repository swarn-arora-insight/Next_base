import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "../logo";

const ease = [0.16, 1, 0.3, 1];

function HeroPill() {
  return (
    <a
      href="/dashboard"
      className="flex w-auto items-center space-x-2 rounded-full bg-primary/20 px-2 py-1 ring-1 ring-accent whitespace-pre"
    >
      <div className="w-fit rounded-full bg-accent px-2 py-0.5 text-center text-xs font-medium text-primary sm:text-sm">
        📣 Announcement
      </div>
      <p className="text-xs font-medium text-primary sm:text-sm">
        next.js template
      </p>
      <svg
        width="12"
        height="12"
        className="ml-1"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.78141 5.33312L5.20541 1.75712L6.14808 0.814453L11.3334 5.99979L6.14808 11.1851L5.20541 10.2425L8.78141 6.66645H0.666748V5.33312H8.78141Z"
          fill="hsl(var(--primary))"
        />
      </svg>
    </a>
  );
}

function HeroTitles() {
  return (
    <div className="flex w-full max-w-2xl flex-col space-y-4 overflow-hidden pt-8">
      <h1 className="text-center text-4xl font-medium leading-tight text-foreground sm:text-5xl md:text-6xl">
        {["Automate", "your", "workflow", "with AI"].map((text, index) => (
          <span
            key={index}
            className="inline-block px-1 md:px-2 text-balance font-semibold"
          >
            {text}
          </span>
        ))}
      </h1>
      <p className="mx-auto max-w-xl text-center text-lg leading-7 text-muted-foreground sm:text-xl sm:leading-9 text-balance">
        No matter what problem you have, our AI can help you solve it.
      </p>
    </div>
  );
}

function HeroCTA() {
  return (
    <>
      <div className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full sm:w-auto text-background flex gap-2"
          )}
        >
          <Logo className="invert h-6 w-6" />
          Get started for free
        </Link>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">
        7 day free trial. No credit card required.
      </p>
    </>
  );
}

function HeroImage() {
  return (
    <div className="relative mt-[6rem] animate-fade-up [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-0 after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)]">
      <div className="relative z-10 rounded-xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)]">
        <img
          src="/hero-light.png"
          alt="Hero Image"
          className="relative w-full h-auto rounded-[inherit] border object-contain"
        />
      </div>
    </div>
  );
}

export default function Hero2() {
  return (
    <section id="hero">
      <div className="relative flex w-full flex-col items-center justify-start px-4 pt-32 sm:px-6 sm:pt-24 md:pt-32 lg:px-8">
        <HeroPill />
        <HeroTitles />
        <HeroCTA />
        <HeroImage />
        <div className="pointer-events-none absolute inset-x-0 -bottom-12 h-1/3 bg-gradient-to-t from-background via-background to-transparent lg:h-1/4"></div>
      </div>
    </section>
  );
}
