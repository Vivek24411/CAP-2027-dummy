"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionEnabled, useGSAP } from "@/lib/motion";

// As each card enters: its image wipes in (clip-path) from the side it sits on — always
// from the left on phones, where the image is on top — then the number, title and
// description fade up 100ms later. Plays once.
export function BenefitsReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      const desktop = window.matchMedia("(min-width: 64rem)").matches;

      gsap.utils.toArray<HTMLElement>("[data-benefit]").forEach((card) => {
        const image = card.querySelector<HTMLElement>("[data-reveal-clip]");
        const text = card.querySelector<HTMLElement>('[data-reveal="fade-up"]');
        const fromRight = desktop && image?.dataset.revealClip === "right";

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 80%", once: true },
        });
        if (image) {
          tl.fromTo(
            image,
            { clipPath: fromRight ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1 },
            0,
          );
        }
        if (text) tl.fromTo(text, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, 0.1);
      });
    },
    { scope: ref },
  );

  return (
    <ul ref={ref} className={className}>
      {children}
    </ul>
  );
}
