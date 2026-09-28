"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger, setLenis } from "@/lib/motion";

// Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
// Off for reduced motion (native scrolling, no smoothing).
// Same-page hash links (/#faqs) glide there instead of jumping.
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    // Tells the inline safety script in layout.tsx that the app has started.
    root.dataset.motion = "ready";

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest("a");
      if (!link?.href) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;

      const target = url.hash
        ? document.getElementById(decodeURIComponent(url.hash.slice(1)))
        : null;
      if (!target && url.hash) return;
      // Cancelling the click also stops next/link from doing its own (instant) scroll.
      event.preventDefault();
      history.pushState(null, "", url.hash || url.pathname);
      // Lenis honours the CSS scroll-padding-top, which keeps the section clear of the navbar.
      lenis.scrollTo(target ?? 0, { force: true });
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
