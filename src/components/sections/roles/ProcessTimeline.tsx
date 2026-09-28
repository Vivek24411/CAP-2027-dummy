"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionEnabled, ScrollTrigger, useGSAP } from "@/lib/motion";

// Vertical timeline. An accent line draws from the first dot to the last as you scroll
// (scrubbed); when its tip reaches a step, that step's dot fills and its text brightens.
// Without JS or with reduced motion the line is fully drawn and every step is lit.
export function ProcessTimeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      const track = trackRef.current;
      const line = lineRef.current;
      if (!root || !track || !line) return;
      const dots = gsap.utils.toArray<HTMLElement>("[data-step-dot]");
      if (dots.length < 2) return;
      const first = dots[0];
      const last = dots[dots.length - 1];

      // The line runs exactly from the centre of the first dot to the centre of the last.
      const measure = () => {
        const origin = root.getBoundingClientRect().top;
        const centre = (dot: HTMLElement) => {
          const rect = dot.getBoundingClientRect();
          return rect.top + rect.height / 2 - origin;
        };
        const top = centre(first);
        const bottom = centre(last);
        for (const el of [track, line]) {
          el.style.top = `${top}px`;
          el.style.height = `${bottom - top}px`;
          el.style.bottom = "auto";
        }
      };
      measure();
      ScrollTrigger.addEventListener("refreshInit", measure);

      if (motionEnabled()) {
        // The tip of the line sits at 60% of the viewport height while scrubbing.
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: first,
              start: "center 60%",
              endTrigger: last,
              end: "center 60%",
              scrub: 0.3,
            },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          ScrollTrigger.create({
            trigger: step.querySelector("[data-step-dot]"),
            start: "center 60%",
            onEnter: () => step.setAttribute("data-active", ""),
            onLeaveBack: () => step.removeAttribute("data-active"),
          });
        });
      }

      return () => ScrollTrigger.removeEventListener("refreshInit", measure);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative">
      <div
        ref={trackRef}
        aria-hidden="true"
        className="bg-line-strong absolute top-3 bottom-3 left-[11.5px] w-px"
      />
      <div
        ref={lineRef}
        aria-hidden="true"
        className="bg-accent absolute top-3 bottom-3 left-[11.5px] w-px origin-top"
      />
      {children}
    </div>
  );
}
