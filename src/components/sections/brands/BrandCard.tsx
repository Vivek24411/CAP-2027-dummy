import Image from "next/image";
import type { Brand } from "@/models/brand";

// Logo on a light panel inside a surface card. The 1px ring around the card is lit by a
// spotlight that follows the cursor across the whole grid (--spot-x / --spot-y, set per card
// by BrandsGrid). Hover: the card lifts, the logo grows a touch, the caption brightens.
export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <figure data-brand className="group/card">
      <div className="bg-line rounded-card relative p-px transition-[translate] duration-300 ease-out group-hover/card:-translate-y-1.5 motion-reduce:group-hover/card:translate-y-0">
        {/* Border light: only the 1px ring between this and the inner card shows it */}
        <div
          aria-hidden="true"
          className="rounded-card pointer-events-none absolute inset-0 bg-[radial-gradient(260px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgb(2_133_226/0.85),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover/grid:opacity-100"
        />
        <div className="bg-surface relative overflow-hidden rounded-[11px] p-2">
          {/* Faint surface glow under the cursor */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(320px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgb(2_133_226/0.14),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover/grid:opacity-100"
          />
          <div className="bg-foreground relative flex aspect-[2/1] items-center justify-center overflow-hidden rounded-lg">
            <Image
              src={brand.logo}
              alt={brand.name}
              width={283}
              height={71}
              sizes="(min-width: 1024px) 260px, 45vw"
              className="h-auto w-[68%] transition-[scale] duration-500 ease-out group-hover/card:scale-105 motion-reduce:transition-none"
            />
          </div>
        </div>
      </div>
      <figcaption className="text-body text-secondary group-hover/card:text-foreground mt-4 text-center transition-colors duration-200">
        {brand.label}
      </figcaption>
    </figure>
  );
}
