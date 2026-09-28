"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Pointer parallax for the hero: the illustration drifts a few pixels away from the
// cursor and the text a little toward it, which reads as depth. Eased every frame, and
// only while there's somewhere to go. Uses the `translate` property, so it composes with
// the intro animation (transform) and the scroll zoom (scale, see HeroScrollFx).
// Touch devices and reduced motion: nothing moves.
export function HeroDepth({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = ref.current;
    const section = scene?.closest("section");
    const text = section?.querySelector<HTMLElement>("[data-hero-text]");
    if (!scene || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let frame = 0;

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.06;
      pos.y += (target.y - pos.y) * 0.06;
      scene.style.translate = `${(-pos.x * 16).toFixed(2)}px ${(-pos.y * 10).toFixed(2)}px`;
      if (text) text.style.translate = `${(pos.x * 6).toFixed(2)}px ${(pos.y * 4).toFixed(2)}px`;
      const settled = Math.abs(target.x - pos.x) < 0.001 && Math.abs(target.y - pos.y) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      target.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      wake();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      wake();
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} data-hero-depth className="absolute inset-0 scale-[1.04] will-change-transform">
      {children}
    </div>
  );
}
