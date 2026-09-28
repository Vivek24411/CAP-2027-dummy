"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionEnabled, useGSAP } from "@/lib/motion";

// Slides each `[data-heading-part]` up out of its mask (120ms apart) the first time the
// heading scrolls into view. The hidden starting state lives in globals.css.
export function HeadingReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>("[data-heading-part]"),
        { yPercent: 110, y: 0 },
        {
          yPercent: 0,
          y: 0,
          duration: 1.1,
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
