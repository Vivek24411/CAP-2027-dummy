"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkle: boolean;
  twinkleDuration: number;
  twinkleDelay: number;
  hasGlow: boolean;
};

// Deterministic seed-based pseudorandom generation to guarantee 100% hydration match
function generateStars(count = 175): Star[] {
  function pseudoRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const x = +(pseudoRandom(i * 3 + 1) * 100).toFixed(2);
    const y = +(pseudoRandom(i * 3 + 2) * 100).toFixed(2);
    const rand = pseudoRandom(i * 7 + 3);
    const randTwinkle = pseudoRandom(i * 11 + 5);

    let size = 1;
    let opacity = 0.4;
    let hasGlow = false;

    if (rand < 0.62) {
      // 62% micro stars (0.75px - 1.2px)
      size = +(0.75 + rand * 0.7).toFixed(2);
      opacity = +(0.25 + rand * 0.45).toFixed(2);
    } else if (rand < 0.9) {
      // 28% small/medium stars (1.3px - 2.0px)
      size = +(1.3 + (rand - 0.62) * 2.2).toFixed(2);
      opacity = +(0.55 + (rand - 0.62) * 0.9).toFixed(2);
    } else {
      // 10% bright stars with subtle glow (2.2px - 3.2px)
      size = +(2.2 + (rand - 0.9) * 4.0).toFixed(2);
      opacity = +(0.85 + (rand - 0.9) * 0.8).toFixed(2);
      hasGlow = true;
    }

    const twinkle = randTwinkle > 0.6;
    const twinkleDuration = +(2.2 + randTwinkle * 3.5).toFixed(2);
    const twinkleDelay = +(pseudoRandom(i * 13 + 7) * 4).toFixed(2);

    stars.push({
      id: i,
      x,
      y,
      size,
      opacity: Math.min(opacity, 1),
      twinkle,
      twinkleDuration,
      twinkleDelay,
      hasGlow,
    });
  }
  return stars;
}

const STATIC_STARS = generateStars(180);

interface StarfieldProps {
  className?: string;
  count?: number;
}

export function Starfield({ className, count }: StarfieldProps) {
  const filterId = useId();
  const stars = count && count < STATIC_STARS.length ? STATIC_STARS.slice(0, count) : STATIC_STARS;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)] select-none",
        className,
      )}
    >
      <svg className="absolute inset-0 size-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={`star-glow-${filterId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {stars.map((star) => (
          <circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size / 2}
            fill="#ffffff"
            fillOpacity={star.opacity}
            filter={star.hasGlow ? `url(#star-glow-${filterId})` : undefined}
            style={
              star.twinkle
                ? {
                    animation: `twinkle ${star.twinkleDuration}s ease-in-out ${star.twinkleDelay}s infinite`,
                    transformOrigin: `${star.x}% ${star.y}%`,
                  }
                : undefined
            }
          />
        ))}
      </svg>
    </div>
  );
}
