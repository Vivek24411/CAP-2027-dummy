import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

// primary   → solid accent; a touch brighter and 1px higher on hover (with a sheen sweeping
//             across), back down when pressed
// secondary → ghost with a hairline border
const variants: Record<Variant, string> = {
  primary:
    "relative overflow-hidden bg-accent-fill text-white hover:bg-accent-fill-hover hover:-translate-y-px active:translate-y-0 before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:skew-x-[-20deg] before:bg-linear-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-[left] before:duration-700 before:ease-out hover:before:left-[130%]",
  secondary:
    "border border-line-strong text-foreground hover:border-white/30 hover:bg-white/[0.04] active:bg-white/[0.02]",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,translate] duration-200 ease-out motion-reduce:hover:translate-y-0",
    variants[variant],
    sizes[size],
    className,
  );
}

type Common = { variant?: Variant; size?: Size };

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & Common) {
  return <Link className={buttonClassName({ variant, size, className })} {...props} />;
}

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & Common) {
  return <button className={buttonClassName({ variant, size, className })} {...props} />;
}
