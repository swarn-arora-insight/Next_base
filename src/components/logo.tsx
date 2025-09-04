import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Logo {
    className?: string
}

const Logo = ({className}:Logo) => {
  return (
    <Image
      className={cn(className)}
      src="/next.svg"
      alt="Next.js logo"
      width={24}
      height={24}
      priority
    />
  );
};

export default Logo;
