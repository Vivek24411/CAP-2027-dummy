import Image from "next/image";
import { cn } from "@/lib/utils";

// Native size is 184x42; pass a width class to scale it, height follows.
export function EsummitLogo({ className, preload }: { className?: string; preload?: boolean }) {
  return (
    <Image
      src="/images/logos/esummit-logo.png"
      alt="IIT Roorkee's E-Summit '27"
      width={184}
      height={42}
      preload={preload}
      className={cn("h-auto", className)}
    />
  );
}
