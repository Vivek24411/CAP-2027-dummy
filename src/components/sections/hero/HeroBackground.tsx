import Image from "next/image";
import type { CSSProperties } from "react";
import type { ImageAsset } from "@/models/showcase";
import { Constellation } from "./constellation/Constellation";
import { HeroDepth } from "./HeroDepth";

// Where each shooting star starts (% of the hero), its angle, and its timing. Long,
// uneven cycles so they feel occasional rather than on a loop.
const shootingStars = [
  { top: "9%", left: "78%", angle: "-22deg", dur: "12s", delay: "2.6s" },
  { top: "4%", left: "46%", angle: "-30deg", dur: "17s", delay: "8.5s" },
  { top: "18%", left: "96%", angle: "-18deg", dur: "23s", delay: "14s" },
];

// The hero illustration as a normal (optimised, preloaded) <Image>, with the hover
// constellation layer and a few shooting stars on top of it. Layers, outside in:
//   scene → pushed in and eased back out on load (see "Hero intro" in globals.css)
//   depth → pointer parallax + scroll zoom (HeroDepth, HeroScrollFx)
//   veil  → starts near-black and lifts, so the scene fades up out of the dark
export function HeroBackground({ image }: { image: ImageAsset }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div data-hero="scene" className="absolute inset-0">
        <HeroDepth>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0">
            {shootingStars.map((star) => (
              <span
                key={star.left}
                className="shooting-star"
                style={
                  {
                    top: star.top,
                    left: star.left,
                    "--angle": star.angle,
                    "--dur": star.dur,
                    "--delay": star.delay,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <Constellation image={image} />
        </HeroDepth>
      </div>
      <div
        data-hero="veil"
        aria-hidden="true"
        className="bg-background pointer-events-none absolute inset-0 opacity-0"
      />
    </div>
  );
}
