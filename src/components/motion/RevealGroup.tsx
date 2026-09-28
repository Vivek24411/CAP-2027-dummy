"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, motionEnabled, useGSAP } from "@/lib/motion";

type RevealGroupProps = {
  children: ReactNode;
  as?: ElementType;
  // Seconds between items.
  stagger?: number;
  className?: string;
};

// Fades up every `[data-reveal="fade-up"]` inside it together, `stagger` apart, the first
// time the group enters the viewport. The hidden starting state lives in globals.css.
export function RevealGroup({
  children,
  as: Tag = "div",
  stagger = 0.08,
  className,
}: RevealGroupProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal="fade-up"]');
      gsap.fromTo(
        items,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger,
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
