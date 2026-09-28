"use client";

import { useCountUp } from "@/controllers/useCountUp";
import type { Stat } from "@/models/whatIs";

// Counts up once when scrolled into view (from the real number in the HTML). Screen readers
// get the final figure from the visually hidden copy. The number box is as wide as the final
// figure (tabular digits are all 1ch wide), so nothing moves while it counts.
export function StatCounter({ stat }: { stat: Stat }) {
  const { ref, value } = useCountUp<HTMLParagraphElement>(stat.value);
  const digits = String(stat.value).length;

  return (
    <div className="flex flex-col items-center text-center text-white">
      <p
        ref={ref}
        className="bg-linear-to-b from-white to-[#9cc8ff] bg-clip-text text-5xl leading-none font-semibold tracking-[-0.03em] text-transparent tabular-nums md:text-[4rem]"
      >
        <span className="sr-only">
          {stat.value}
          {stat.suffix}
        </span>
        <span aria-hidden="true">
          <span className="inline-block text-right" style={{ minWidth: `${digits}ch` }}>
            {value}
          </span>
          {stat.suffix}
        </span>
      </p>
      <p className="text-secondary mt-3 text-xs tracking-[0.18em] uppercase md:text-[0.8125rem]">
        {stat.label}
      </p>
    </div>
  );
}
