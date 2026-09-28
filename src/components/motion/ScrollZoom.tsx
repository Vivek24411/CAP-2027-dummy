"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionEnabled, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Frames its child and eases it from slightly zoomed-in to rest as it scrolls through the
// viewport (scrubbed), with a gentle vertical drift — a slow camera move on a still.
// Reduced motion or no JS → the child sits still at normal size.
export function ScrollZoom({
  children,
  from = 1.18,
  className,
}: {
  children: ReactNode;
  from?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      gsap.fromTo(
        innerRef.current,
        { scale: from, yPercent: -6 },
        {
          scale: 1,
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom 60%",
            scrub: 0.5,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
