import type { ReactNode } from "react";
import { HeadingReveal } from "@/components/motion/HeadingReveal";
import { cn } from "@/lib/utils";
import type { HeadingContent } from "@/models/heading";

type SectionHeadingProps = {
  heading: HeadingContent;
  // "stacked" puts each part on its own line; "inline" keeps them on one line (wrapping if needed).
  layout?: "stacked" | "inline";
  align?: "center" | "start";
  // A soft, low-opacity blue glow behind the heading. Use on two or three sections only.
  glow?: boolean;
  id?: string;
  className?: string;
};

// The one heading style used by every section: bold sans + italic serif.
export function SectionHeading({
  heading,
  layout = "stacked",
  align = "center",
  glow = false,
  id,
  className,
}: SectionHeadingProps) {
  const { accent, title, lead = "accent" } = heading;
  // Each part sits in its own mask so it can slide up out of it (see HeadingReveal).
  // The small padding keeps italic overhangs and descenders from being clipped.
  const mask = (content: ReactNode, className: string) => (
    <span className="-mx-[0.08em] -mb-[0.1em] inline-block overflow-clip px-[0.08em] pb-[0.1em]">
      <span data-heading-part className={cn("inline-block", className)}>
        {content}
      </span>
    </span>
  );
  const accentPart = mask(
    accent,
    "font-serif text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.95] font-normal tracking-[-0.01em] italic",
  );
  const titlePart = mask(
    title,
    "font-sans text-[clamp(2.25rem,4.8vw,3.625rem)] leading-[1.02] font-bold tracking-[-0.03em]",
  );

  return (
    <HeadingReveal className={cn("relative isolate", className)}>
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[16rem] w-[min(52rem,100%)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(2_133_226/0.13),transparent)]"
        />
      )}
      <h2
        id={id}
        className={cn(
          "text-foreground flex",
          layout === "stacked" && "flex-col gap-2",
          layout === "stacked" && (align === "center" ? "items-center" : "items-start"),
          layout === "inline" && "flex-wrap items-baseline gap-x-[0.3em] gap-y-1",
          align === "center" ? "justify-center text-center" : "justify-start text-left",
        )}
      >
        {lead === "accent" ? (
          <>
            {accentPart} {titlePart}
          </>
        ) : (
          <>
            {titlePart} {accentPart}
          </>
        )}
      </h2>
    </HeadingReveal>
  );
}
