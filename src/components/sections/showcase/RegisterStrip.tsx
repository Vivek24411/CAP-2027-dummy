import Link from "next/link";
import { VelocityMarquee } from "@/components/ui/VelocityMarquee";
import type { RegisterBanner } from "@/models/showcase";

// Full-width scrolling "Register Now" strip between two hairlines. The whole strip is one
// link; screen readers hear `banner.label` instead of the repeating text. Phrases are separated by a small accent dot.
export function RegisterStrip({ banner }: { banner: RegisterBanner }) {
  // Two passes of the phrases per copy, so one copy is wider than any screen.
  const phrases = [...banner.phrases, ...banner.phrases];

  return (
    <Link
      href={banner.href}
      className="group/strip border-line bg-surface/60 block border-y focus-visible:outline-offset-[-2px]"
    >
      <span className="sr-only">{banner.label}</span>
      {/* Padding lives on the marquee so hovering anywhere on the strip pauses it */}
      <VelocityMarquee
        aria-hidden
        className="[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] py-8 md:py-11"
      >
        {phrases.map((phrase, index) => (
          <span
            key={index}
            aria-hidden={index >= banner.phrases.length}
            className="flex items-center gap-10 pr-10 md:gap-14 md:pr-14"
          >
            <span className="text-foreground/85 group-hover/strip:text-foreground text-xl tracking-[-0.01em] whitespace-nowrap transition-colors duration-200 md:text-[1.625rem]">
              {phrase}
            </span>
            <span aria-hidden="true" className="bg-accent size-1.5 rounded-full" />
          </span>
        ))}
      </VelocityMarquee>
    </Link>
  );
}
