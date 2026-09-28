"use client";

import { useRef, useState } from "react";
import { gsap, motionEnabled, ScrollTrigger, useGSAP } from "@/lib/motion";

// The final number is what the server renders, so it's in the HTML (for no-JS visitors,
// search engines and screenshots). On the client, if the element is still below the fold,
// the value drops to 0 while it's out of sight and counts up once (1.4s, easing out) when
// it scrolls into view. Already on screen, or reduced motion → it stays at the final value.
export function useCountUp<T extends HTMLElement>(target: number, duration = 1.4) {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(target);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || !motionEnabled()) return;
      if (element.getBoundingClientRect().top < window.innerHeight) return;

      const counter = { value: 0 };
      setValue(0);
      ScrollTrigger.create({
        trigger: element,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            value: target,
            duration,
            onUpdate: () => setValue(Math.round(counter.value)),
          });
        },
      });
    },
    { dependencies: [target, duration] },
  );

  return { ref, value };
}
