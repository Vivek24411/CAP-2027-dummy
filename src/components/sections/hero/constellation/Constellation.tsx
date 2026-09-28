"use client";

import { useEffect, useRef } from "react";
import type { ImageAsset } from "@/models/showcase";
import { CONSTELLATION_CONFIG } from "./config";
import { findStars, type StarPoint } from "./findStars";

type ScreenStar = { x: number; y: number; brightness: number; phase: number };

// Hover effect for the hero: the stars painted in the illustration light up around the
// cursor and link into a faint constellation that follows it, then fade when it leaves.
//   · 2D canvas over the image (under the text); nothing is drawn while idle
//   · star positions are found in the image itself (see findStars) and mapped the same
//     way CSS `object-fit: cover` maps the <Image>, so the light lands on real stars
//   · touch: a tap or drag lights it up briefly
//   · reduced motion → no effect
export function Constellation({ image }: { image: ImageAsset }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const section = host?.closest("section");
    if (!host || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const config = CONSTELLATION_CONFIG;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return;
    }

    const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    let found: StarPoint[] = [];
    let stars: ScreenStar[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Soft glow drawn once, then stamped on each lit star.
    const sprite = document.createElement("canvas");
    const makeSprite = () => {
      const size = Math.ceil(config.glowSize * 2 * dpr);
      sprite.width = sprite.height = size;
      const s = sprite.getContext("2d");
      if (!s) return;
      const g = s.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, `rgba(${config.starColor}, 0.9)`);
      g.addColorStop(0.25, `rgba(${config.starColor}, 0.35)`);
      g.addColorStop(1, `rgba(${config.starColor}, 0)`);
      s.fillStyle = g;
      s.fillRect(0, 0, size, size);
    };

    // Image fractions → screen pixels, the way `object-fit: cover` (centred) places it.
    const layout = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeSprite();
      const scale = Math.max(width / image.width, height / image.height);
      const offsetX = (width - image.width * scale) / 2;
      const offsetY = (height - image.height * scale) / 2;
      stars = found.map((star, index) => ({
        x: offsetX + star.x * image.width * scale,
        y: offsetY + star.y * image.height * scale,
        brightness: star.brightness,
        phase: (index * 2.399) % (Math.PI * 2),
      }));
    };

    // ── State ────────────────────────────────────────────────────────────────
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let inside = false;
    let activity = 0;
    let frame = 0;
    let lastTime = 0;
    let visible = true;
    let touchTimer = 0;

    const draw = (seconds: number) => {
      ctx.clearRect(0, 0, width, height);
      if (activity <= 0.001) return;
      const { radius, linkDistance } = config;

      if (config.cursorGlow > 0) {
        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
        glow.addColorStop(0, `rgba(${config.lineColor}, ${config.cursorGlow * activity})`);
        glow.addColorStop(1, `rgba(${config.lineColor}, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(pos.x - radius, pos.y - radius, radius * 2, radius * 2);
      }

      // Stars near the cursor, with how strongly each is lit (0–1).
      const lit: { star: ScreenStar; strength: number }[] = [];
      for (const star of stars) {
        const d = Math.hypot(star.x - pos.x, star.y - pos.y);
        if (d >= radius) continue;
        const falloff = Math.pow(1 - d / radius, 1.4);
        const twinkle = 1 - config.twinkle * 0.5 * (1 + Math.sin(seconds * 2.2 + star.phase));
        lit.push({ star, strength: falloff * activity * twinkle });
      }

      // Lines: each lit star to its nearest lit neighbours.
      ctx.lineWidth = config.lineWidth;
      const drawn = new Set<string>();
      lit.forEach((a, i) => {
        const neighbours = lit
          .map((b, j) => ({ j, d: Math.hypot(a.star.x - b.star.x, a.star.y - b.star.y) }))
          .filter(({ j, d }) => j !== i && d < linkDistance)
          .sort((p, q) => p.d - q.d)
          .slice(0, config.maxLinksPerStar);
        for (const { j, d } of neighbours) {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (drawn.has(key)) continue;
          drawn.add(key);
          const b = lit[j];
          const alpha =
            Math.min(a.strength, b.strength) * (1 - d / linkDistance) * config.lineOpacity;
          ctx.strokeStyle = `rgba(${config.lineColor}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.star.x, a.star.y);
          ctx.lineTo(b.star.x, b.star.y);
          ctx.stroke();
        }
      });

      // The cursor joins in too.
      if (config.cursorLinks > 0) {
        const nearest = [...lit]
          .sort(
            (a, b) =>
              Math.hypot(a.star.x - pos.x, a.star.y - pos.y) -
              Math.hypot(b.star.x - pos.x, b.star.y - pos.y),
          )
          .slice(0, config.cursorLinks);
        for (const { star, strength } of nearest) {
          ctx.strokeStyle = `rgba(${config.lineColor}, ${(strength * config.lineOpacity * 0.6).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(star.x, star.y);
          ctx.stroke();
        }
      }

      // Stars: soft glow + bright core.
      const half = config.glowSize;
      for (const { star, strength } of lit) {
        ctx.globalAlpha = Math.min(1, strength * star.brightness * 1.2);
        ctx.drawImage(sprite, star.x - half, star.y - half, half * 2, half * 2);
        ctx.globalAlpha = Math.min(1, strength * 1.3);
        ctx.fillStyle = `rgb(${config.starColor})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, config.starSize * (0.7 + 0.5 * star.brightness), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    // Runs only while the effect is visible or fading; stops once it has faded out.
    const loop = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 1 / 60;
      lastTime = time;
      const goal = inside ? 1 : 0;
      const rate = dt / (goal > activity ? config.fadeIn : config.fadeOut);
      activity =
        goal > activity ? Math.min(goal, activity + rate) : Math.max(goal, activity - rate);
      const ease = 1 - Math.pow(1 - config.follow, dt * 60);
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      draw(time / 1000);
      const done = !inside && activity <= 0.001;
      frame = done || !visible ? 0 : requestAnimationFrame(loop);
    };
    const wake = () => {
      if (frame || !visible || document.visibilityState !== "visible") return;
      lastTime = 0;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // ── Pointer ──────────────────────────────────────────────────────────────
    // Screen → canvas pixels. The layer may be scaled/translated (hero parallax and scroll
    // zoom), so divide by the on-screen size rather than assuming 1:1.
    const moveTo = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) * width) / (rect.width || 1);
      target.y = ((event.clientY - rect.top) * height) / (rect.height || 1);
      if (activity <= 0.001) {
        pos.x = target.x;
        pos.y = target.y;
      }
    };
    const onMove = (event: PointerEvent) => {
      moveTo(event);
      if (event.pointerType === "mouse") {
        inside = true;
      } else {
        // Touch: light up while dragging, then fade shortly after.
        inside = true;
        window.clearTimeout(touchTimer);
        touchTimer = window.setTimeout(() => (inside = false), 900);
      }
      wake();
    };
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse") inside = false;
    };
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerdown", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);

    // ── Stars, sizing, visibility ────────────────────────────────────────────
    const source = new Image();
    source.decoding = "async";
    source.onload = () => {
      found = findStars(source, config.stars[isMobile ? "mobile" : "desktop"], config.skyHeight);
      layout();
    };
    source.src = image.src;

    layout();
    const resizeObserver = new ResizeObserver(() => {
      layout();
      if (!frame) draw(performance.now() / 1000);
    });
    resizeObserver.observe(host);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) stop();
      else if (inside || activity > 0) wake();
    });
    visibilityObserver.observe(host);
    const onVisibility = () => {
      if (document.visibilityState !== "visible") stop();
      else if (inside || activity > 0) wake();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.clearTimeout(touchTimer);
      source.onload = null;
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerdown", onMove);
      section.removeEventListener("pointerleave", onLeave);
      canvas.remove();
    };
  }, [image.src, image.width, image.height]);

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />;
}
