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
      <p ref={ref} className="text-4xl leading-none font-bold tabular-nums md:text-[3rem]">
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
      <p className="mt-1 text-lg leading-tight md:text-[1.75rem]">{stat.label}</p>
    </div>
  );
}
