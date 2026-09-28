"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionEnabled, ScrollTrigger, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

type VelocityMarqueeProps = {
  // One copy of the content. It's rendered twice for a seamless loop, so make it at
  // least as wide as the screen (repeat items if needed).
  children: ReactNode;
  // Resting speed in px per second.
  speed?: number;
  className?: string;
  "aria-hidden"?: boolean;
};

// Slow, constant scroll that reacts to the page's scroll velocity: scrolling down speeds
// it up, scrolling up briefly reverses it, then it eases back to normal. Hover pauses it.
// Paused while off screen. Reduced motion or no JS → a static row.
export function VelocityMarquee({
  children,
  speed = 45,
  className,
  "aria-hidden": ariaHidden,
}: VelocityMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track || !motionEnabled()) return;

      let half = track.scrollWidth / 2;
      let x = 0;
      let direction = 1;
      let targetDirection = 1;
      let boost = 0;
      let hover = 1;
      let hoverTarget = 1;
      let visible = false;
      let resetTimer = 0;

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          visible = self.isActive;
        },
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          if (Math.abs(velocity) < 30) return;
          targetDirection = velocity < 0 ? -1 : 1;
          boost = Math.max(boost, Math.min(Math.abs(velocity) / 350, 5));
          window.clearTimeout(resetTimer);
          resetTimer = window.setTimeout(() => (targetDirection = 1), 450);
        },
      });

      const tick = (_time: number, deltaMs: number) => {
        if (!visible) return;
        const dt = Math.min(deltaMs, 50) / 1000;
        direction += (targetDirection - direction) * 0.08;
        boost *= 0.94;
        hover += (hoverTarget - hover) * 0.12;
        x = gsap.utils.wrap(-half, 0, x - speed * (1 + boost) * direction * hover * dt);
        track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      };
      gsap.ticker.add(tick);

      const resize = new ResizeObserver(() => {
        half = track.scrollWidth / 2;
      });
      resize.observe(track);
      const onEnter = () => (hoverTarget = 0);
      const onLeave = () => (hoverTarget = 1);
      root.addEventListener("pointerenter", onEnter);
      root.addEventListener("pointerleave", onLeave);

      return () => {
        gsap.ticker.remove(tick);
        resize.disconnect();
        window.clearTimeout(resetTimer);
        root.removeEventListener("pointerenter", onEnter);
        root.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} aria-hidden={ariaHidden} className={cn("flex overflow-hidden", className)}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
