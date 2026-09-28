import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps<T> = {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T) => ReactNode;
  // Spacing after each item. Use padding (e.g. "pr-6"), not margin or gap, so both halves stay equal.
  itemClassName?: string;
  reverse?: boolean;
  // Seconds for one full loop — higher is slower.
  duration?: number;
  // Repeats the list inside each half, for short lists that wouldn't fill a wide screen.
  repeat?: number;
  className?: string;
};

// Infinite CSS marquee (keyframes, no JS). The content is rendered twice and the track slides by -50%,
// so the second copy lands exactly where the first began and the loop is seamless.
// Hovering pauses it; users who prefer reduced motion get a static row.
export function Marquee<T>({
  items,
  getKey,
  renderItem,
  itemClassName,
  reverse = false,
  duration = 40,
  repeat = 1,
  className,
}: MarqueeProps<T>) {
  const half = Array.from({ length: repeat }, () => items).flat();

  return (
    <div className={cn("group flex overflow-hidden", className)}>
      <div
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
        className={cn(
          "animate-marquee flex w-max group-hover:[animation-play-state:paused] motion-reduce:animate-none",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {[0, 1].map((copy) =>
          half.map((item, index) => (
            <div
              key={`${copy}-${index}-${getKey(item, index)}`}
              className={cn("shrink-0", itemClassName)}
              aria-hidden={copy === 1 || index >= items.length}
            >
              {renderItem(item)}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
