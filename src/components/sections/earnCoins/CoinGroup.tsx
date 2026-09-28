"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, motionEnabled, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/models/showcase";

type CoinGroupProps = {
  image: ImageAsset;
  side: "left" | "right";
  className?: string;
};

// One cluster of coin artwork against the left or right edge. Four nested layers, each
// owning one motion so they never fight over `transform`:
//   1. entry   — glides in from its own side the first time it's scrolled into view
//   2. scroll  — drifts up and tilts slightly as the section scrolls past (scrubbed)
//   3. pointer — eases away from the cursor on desktop, which reads as depth
//   4. float   — a slow bob (CSS), the right side half a cycle behind the left
// A warm glow breathes behind the gold coin. Reduced motion or no JS → static artwork.
export function CoinGroup({ image, side, className }: CoinGroupProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const entryRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const isLeft = side === "left";

  useGSAP(
    () => {
      const root = rootRef.current;
      const section = root?.closest("section");
      if (!root || !section || !motionEnabled()) return;
      const outward = isLeft ? -1 : 1;

      gsap.fromTo(
        entryRef.current,
        { x: outward * 160, opacity: 0, rotation: outward * 12 },
        {
          x: 0,
          opacity: 1,
          rotation: 0,
          duration: 1.6,
          delay: isLeft ? 0 : 0.12,
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        },
      );

      gsap.fromTo(
        scrollRef.current,
        { y: 80, rotation: -outward * 4 },
        {
          y: -80,
          rotation: outward * 4,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      if (!window.matchMedia("(pointer: fine)").matches) return;
      const xTo = gsap.quickTo(pointerRef.current, "x", { duration: 1.2 });
      const yTo = gsap.quickTo(pointerRef.current, "y", { duration: 1.2 });
      const onMove = (event: PointerEvent) => {
        const rect = section.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        xTo(-nx * 26);
        yTo(-ny * 18);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
      return () => {
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} aria-hidden="true" className={cn("pointer-events-none absolute", className)}>
      <div ref={entryRef}>
        <div ref={scrollRef}>
          <div ref={pointerRef}>
            <div className={cn("coin-float relative", !isLeft && "[animation-delay:-3.5s]")}>
              <div
                className={cn(
                  "coin-glow absolute top-[6%] aspect-square w-[55%] rounded-full bg-[radial-gradient(circle,rgba(255,196,64,0.4),transparent_65%)] blur-2xl",
                  isLeft ? "left-[2%]" : "right-[2%]",
                )}
              />
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 552px, 38vw"
                className="relative h-auto w-full select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
