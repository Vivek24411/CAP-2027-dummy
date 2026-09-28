import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Centers content and applies consistent horizontal padding across pages.
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[75rem] px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
