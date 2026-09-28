"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);

// The site's one easing curve (same as --ease-out in globals.css): weighty, no overshoot.
CustomEase.create("out", "0.22,1,0.36,1");
gsap.defaults({ ease: "out" });

export { gsap, ScrollTrigger, useGSAP };

// Reveals run only when the page is marked JS-enabled (so CSS hid the starting state)
// and the visitor hasn't asked for reduced motion.
export function motionEnabled() {
  return (
    document.documentElement.classList.contains("js") &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// The Lenis instance, when smooth scrolling is on (see SmoothScroll.tsx).
let lenis: Lenis | null = null;
export const getLenis = () => lenis;
export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};
