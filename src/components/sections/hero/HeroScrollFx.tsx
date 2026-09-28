"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Hands the hero off to the next section as you scroll out of it:
//   · the scene fades into the page background colour
//   · the text drifts up a little slower than the page (and fades gently)
//   · the illustration zooms in slightly
// Transform/opacity only, written straight to the DOM once per frame — no re-renders.
// Reduced motion: nothing moves; the bottom-edge gradient still softens the hand-off.
export function HeroScrollFx({ children, className }: { children: ReactNode; className?: string }) {
  const fadeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fade = fadeRef.current;
    const text = textRef.current;
    const section = text?.closest("section");
    const scene = section?.querySelector<HTMLElement>("[data-hero-depth]");
    if (!fade || !text || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const height = section.offsetHeight;
      const y = Math.min(Math.max(window.scrollY, 0), height);
      const progress = y / height;
      fade.style.opacity = String(Math.min(1, Math.max(0, (progress - 0.1) / 0.75)));
      text.style.transform = `translate3d(0, ${(y * 0.35).toFixed(1)}px, 0)`;
      text.style.opacity = String(1 - progress * 0.9);
      // The scene pushes in as you leave, as if the camera flies on into the sky.
      if (scene) scene.style.scale = (1.04 + progress * 0.1).toFixed(4);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        ref={fadeRef}
        aria-hidden="true"
        className="bg-background pointer-events-none absolute inset-0 -z-[5] opacity-0"
      />
      <div ref={textRef} data-hero-text className={className}>
        {children}
      </div>
    </>
  );
}
