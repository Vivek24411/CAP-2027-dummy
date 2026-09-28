import Image from "next/image";
import { StarField } from "@/components/background/StarField";
import { cn } from "@/lib/utils";

type ImageSlotProps = {
  // Leave out until the real image exists; an on-palette placeholder shows instead.
  src?: string;
  alt: string;
  // Shown large in the placeholder, e.g. "01".
  label?: string;
  // Passed to next/image, e.g. "(min-width: 1024px) 560px, 100vw".
  sizes: string;
  // Which side the image wipes in from when its card is revealed (see BenefitsReveal).
  revealFrom?: "left" | "right";
  className?: string;
};

// Seed each placeholder's sky from its label so the four cards don't look identical.
const seedFor = (label = "") => [...label].reduce((sum, char) => sum * 31 + char.charCodeAt(0), 7);

// Fixed 4:3 frame for card images. The image covers the frame; nothing shifts while it loads.
export function ImageSlot({ src, alt, label, sizes, revealFrom, className }: ImageSlotProps) {
  return (
    <div
      data-reveal-clip={revealFrom}
      className={cn(
        "bg-raised relative aspect-[4/3] overflow-hidden rounded-[calc(var(--radius-card)-4px)]",
        className,
      )}
    >
      {/* Scales up slightly when the card (a `group/card`) is hovered */}
      <div className="absolute inset-0 transition-[scale] duration-500 ease-out group-hover/card:scale-[1.03] motion-reduce:transition-none">
        {src ? (
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        ) : (
          <div role="img" aria-label={alt} className="absolute inset-0">
            <StarField
              count={36}
              seed={seedFor(label)}
              width={400}
              height={300}
              maxOpacity={0.55}
              className="absolute inset-0 size-full"
            />
            {/* Faint horizon glow in the brand blue */}
            <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_80%_115%,rgb(2_133_226/0.14),transparent_60%)]" />
            {label && (
              <span
                aria-hidden="true"
                className="absolute right-5 bottom-4 font-serif text-[clamp(4rem,9vw,6.5rem)] leading-none text-white/[0.09] italic md:right-6 md:bottom-5"
              >
                {label}
              </span>
            )}
          </div>
        )}
      </div>
      {/* Inner hairline keeps the edge crisp against the card surface */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/[0.06] ring-inset"
      />
    </div>
  );
}
