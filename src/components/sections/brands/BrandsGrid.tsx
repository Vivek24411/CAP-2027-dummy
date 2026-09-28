"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { gsap, motionEnabled, useGSAP } from "@/lib/motion";

// The partner cards: they rise in with a stagger the first time the grid enters the view,
// and while the cursor is over the grid, each card gets --spot-x / --spot-y (the cursor's
// position relative to that card) so one spotlight appears to sweep across all of them.
export function BrandsGrid({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>("[data-brand]"),
        { opacity: 0, y: 48, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        },
      );
    },
    { scope: ref },
  );

  // CSS variables only — no re-renders.
  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse") return;
    for (const card of event.currentTarget.querySelectorAll<HTMLElement>("[data-brand] > div")) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    }
  };

  return (
    <ul ref={ref} onPointerMove={onPointerMove} className={className}>
      {children}
    </ul>
  );
}
