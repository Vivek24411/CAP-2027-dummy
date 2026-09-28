"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import type { WhatIsContent } from "@/models/whatIs";
import { Starfield } from "./Starfield";

function clamp01(val: number): number {
  return Math.min(Math.max(val, 0), 1);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function useWindowWidth(): number {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    },
    () => window.innerWidth,
    () => 1200,
  );
}

function useWindowHeight(): number {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    },
    () => window.innerHeight,
    () => 900,
  );
}

interface WhatIsStoryInteractiveProps {
  className?: string;
  content: WhatIsContent;
}

export function WhatIsStoryInteractive({ className, content }: WhatIsStoryInteractiveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [approachProgress, setApproachProgress] = useState(0);

  const viewportWidth = useWindowWidth();
  const viewportHeight = useWindowHeight();
  const isDesktop = viewportWidth >= 1024;

  // Geometry: In initial story layout, logo sits in right column, level with story text just below video
  const contentWidth = isDesktop ? Math.min(viewportWidth - 64, 1152) : viewportWidth - 32;
  const startOffsetX = isDesktop ? contentWidth / 2 - 190 : 0;
  // Positions logo at top right aligned with heading (top of logo ~32px, center ~217px from stage top)
  const startOffsetY = isDesktop ? 32 + 185 - viewportHeight / 2 : -50;

  // 1:1 direct scrollbar scrubbing and approach entrance tracking
  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const totalScrollable = el.offsetHeight - window.innerHeight;

      // 1. Smooth entrance as section approaches from below the video player:
      const approachDistance = window.innerHeight * 0.6;
      const approach = clamp01(1 - rect.top / approachDistance);
      setApproachProgress(approach);

      // 2. Direct 1:1 scrollbar scrubbing while pinned (rect.top <= 0):
      if (totalScrollable <= 0) return;
      const scrolled = -rect.top;
      setScrollProgress(clamp01(scrolled / totalScrollable));
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  const p = scrollProgress;

  // -------------------------------------------------------------
  // CONTINUOUS 1:1 SCROLL-DRIVEN TIMELINE
  // -------------------------------------------------------------

  // 1. STORY ENTRANCE (combines approach from below video + pinned start)
  const enterFactor = Math.max(approachProgress, clamp01(p / 0.16));
  const headingIn = easeOutCubic(enterFactor);
  const logoIn = easeOutCubic(clamp01((enterFactor - 0.03) / 0.97));

  // 2. STORY HOLD & EXIT (p: hold 0.00 -> 0.34, exit 0.34 -> 0.48)
  const exitRaw = clamp01((p - 0.34) / 0.14);
  const exitProgress = easeInOutCubic(exitRaw);
  const exitOpacity = 1 - exitProgress;
  const exitTranslateY = -exitProgress * 28;
  const exitTranslateX = -exitProgress * 20;

  // Heading opacity & translateY:
  const headingOpacity = p > 0.34 ? exitOpacity : headingIn;
  const headingY = p > 0.34 ? exitTranslateY : (1 - headingIn) * 44;

  // 3. LOGO GLIDE & POSITION: (0.34 -> 0.54)
  // Glides smoothly from right column (just below video) to exact center (-20px)
  const glideRaw = clamp01((p - 0.34) / 0.2);
  const glideEase = easeInOutCubic(glideRaw);

  const logoX = (1 - glideEase) * startOffsetX;
  const logoY =
    p <= 0.34 ? startOffsetY + (1 - logoIn) * 40 : (1 - glideEase) * startOffsetY - 20 * glideEase;
  const logoScale = p <= 0.34 ? 0.94 + 0.06 * logoIn : 1;
  const logoOpacity = p <= 0.34 ? logoIn : 1;

  // Responsive scale factor for centered HUD so it never causes horizontal overflow
  const hudScale = isDesktop ? 1 : Math.min(1, Math.max(0.48, (viewportWidth - 32) / 760));

  // ONLY AFTER LOGO ARRIVES IN CENTER (p >= 0.54), DIAGRAM ANIMATION BEGINS:

  // 4. Arcs draw around centered logo (0.54 -> 0.64)
  const arcsRaw = clamp01((p - 0.54) / 0.1);
  const arcsP = easeOutCubic(arcsRaw);
  const arcsDash = (1 - arcsP) * 280;
  const arcsOpacity = arcsP * 0.75;

  // 5. Four Connectors & Labels draw outward (0.58 -> 0.75)
  // DISRUPT (top-left): 0.58 -> 0.66
  const disruptP = easeOutCubic(clamp01((p - 0.58) / 0.08));
  const disruptDash = (1 - disruptP) * 140;
  const disruptOpacity = disruptP;

  // IDEATE (top-right): 0.61 -> 0.69
  const ideateP = easeOutCubic(clamp01((p - 0.61) / 0.08));
  const ideateDash = (1 - ideateP) * 140;
  const ideateOpacity = ideateP;

  // BUILD (bottom-left): 0.64 -> 0.72
  const buildP = easeOutCubic(clamp01((p - 0.64) / 0.08));
  const buildDash = (1 - buildP) * 140;
  const buildOpacity = buildP;

  // IMPACT (bottom-right): 0.67 -> 0.75
  const impactP = easeOutCubic(clamp01((p - 0.67) / 0.08));
  const impactDash = (1 - impactP) * 140;
  const impactOpacity = impactP;

  // 6. Bottom paragraph: Fades in directly underneath at the end of the animation (0.72 -> 0.84)
  const outroP = easeOutCubic(clamp01((p - 0.72) / 0.12));
  const outroOpacity = outroP;
  const outroTranslateY = (1 - outroP) * 20;

  // Settle and unpin smoothly into next section (0.84 -> 1.00)

  return (
    // Clean track height increased by 10% (from 200vh to 220vh) for fluid, responsive, continuous scroll
    <div ref={containerRef} className={cn("relative h-[220vh]", className)}>
      <div className="bg-background sticky top-0 flex h-screen w-full items-start justify-center overflow-hidden pt-6 sm:pt-8 md:pt-10">
        {/* Cosmic Starfield Background */}
        <Starfield count={140} className="opacity-80" />

        {/* Soft edge gradients for seamless blending into #010103 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-24 bg-gradient-to-b from-[#010103] via-[#010103]/70 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-24 bg-gradient-to-t from-[#010103] via-[#010103]/70 to-transparent"
        />

        {/* Base Grid Layer for Story State (Directly below video player) */}
        <div className="relative mx-auto flex w-full max-w-[72rem] flex-col items-center justify-center px-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
          {/* Story text ("Where Ideas Become Legacies!" + 3 paragraphs) */}
          <div
            style={{
              pointerEvents: p > 0.34 ? "none" : "auto",
            }}
            className="relative z-20 w-full max-w-[42rem] text-left select-none max-lg:pt-6"
          >
            {/* Story Heading: Initially opacity 0, slowly fades in and rises from bottom to top */}
            <h3
              style={{
                opacity: headingOpacity,
                transform: `translate3d(${p > 0.34 ? exitTranslateX : 0}px, ${headingY}px, 0)`,
                willChange: "transform, opacity",
              }}
              className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-[2rem] lg:text-[2.25rem]"
            >
              {content.story.heading}
            </h3>

            {/* Staggered Paragraphs: Slowly fade in from opacity 0 and rise from bottom to top */}
            <div className="mt-5 space-y-4">
              {content.story.paragraphs.map((paragraph, index) => {
                const paraIn = easeOutCubic(clamp01((enterFactor - 0.025 * (index + 1)) / 0.9));
                const paraOpacity = p > 0.34 ? exitOpacity : paraIn;
                const paraY = p > 0.34 ? exitTranslateY : (1 - paraIn) * 50;

                return (
                  <p
                    key={paragraph}
                    style={{
                      opacity: paraOpacity,
                      transform: `translate3d(${p > 0.34 ? exitTranslateX : 0}px, ${paraY}px, 0)`,
                      willChange: "transform, opacity",
                    }}
                    className="text-sm leading-[1.7] text-white/80 sm:text-base md:text-lg md:leading-[1.65]"
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Anchor Slot for Logo in initial story layout */}
          <div
            aria-hidden="true"
            className="pointer-events-none flex h-[280px] w-[280px] shrink-0 items-center justify-center opacity-0 select-none sm:h-[320px] sm:w-[320px] md:h-[370px] md:w-[370px]"
          />
        </div>

        {/* Dynamic Single Logo & HUD Layer */}
        <div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <div
            style={{
              transform: `translate3d(${logoX}px, ${logoY}px, 0) scale(${hudScale})`,
              willChange: "transform",
            }}
            className="relative flex items-center justify-center"
          >
            {/* The EXACT single E-Summit Logo: Initially opacity 0, slowly fades in and rises from bottom to top, then glides to center */}
            <div
              style={{
                opacity: logoOpacity,
                transform: `scale(${logoScale})`,
                willChange: "transform, opacity",
              }}
              className="relative flex h-[280px] w-[280px] shrink-0 items-center justify-center select-none sm:h-[320px] sm:w-[320px] md:h-[370px] md:w-[370px]"
            >
              <Image
                src="/images/what-is/logo-glow.png"
                alt="E-Summit Logo"
                width={470}
                height={464}
                priority
                className="pointer-events-none size-full object-contain select-none"
              />
            </div>

            {/* Technical Diagram HUD (Connectors, Dots, Labels, Arcs) - ONLY reveals after logo is in center */}
            <svg
              viewBox="-450 -300 900 600"
              className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-visible"
            >
              {/* Arcs */}
              <g style={{ opacity: arcsOpacity }}>
                <path
                  d="M 40 -222 A 226 226 0 0 1 205 -95"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.55)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeDasharray="280"
                  strokeDashoffset={arcsDash}
                />
                <path
                  d="M -40 222 A 226 226 0 0 1 -205 95"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.55)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeDasharray="280"
                  strokeDashoffset={arcsDash}
                />
              </g>

              {/* 1. DISRUPT (top-left) */}
              <g style={{ opacity: disruptOpacity }}>
                <polyline
                  points="-291,-154 -234,-154 -168,-118"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.7)"
                  strokeWidth="1.2"
                  strokeDasharray="140"
                  strokeDashoffset={disruptDash}
                />
                <circle
                  cx="-168"
                  cy="-118"
                  r="4"
                  fill="#1a8cff"
                  className="drop-shadow-[0_0_6px_#1a8cff]"
                />
                <text
                  x="-303"
                  y="-154"
                  fill="rgba(255, 255, 255, 0.95)"
                  dominantBaseline="middle"
                  className="font-sans text-[20px] font-semibold tracking-[0.15em] uppercase select-none"
                  textAnchor="end"
                >
                  {content.diagramLabels.four[0] ?? "DISRUPT"}
                </text>
              </g>

              {/* 2. IDEATE (top-right) */}
              <g style={{ opacity: ideateOpacity }}>
                <polyline
                  points="291,-154 234,-154 168,-118"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.7)"
                  strokeWidth="1.2"
                  strokeDasharray="140"
                  strokeDashoffset={ideateDash}
                />
                <circle
                  cx="168"
                  cy="-118"
                  r="4"
                  fill="#1a8cff"
                  className="drop-shadow-[0_0_6px_#1a8cff]"
                />
                <text
                  x="303"
                  y="-154"
                  fill="rgba(255, 255, 255, 0.95)"
                  dominantBaseline="middle"
                  className="font-sans text-[20px] font-semibold tracking-[0.15em] uppercase select-none"
                  textAnchor="start"
                >
                  {content.diagramLabels.four[1] ?? "IDEATE"}
                </text>
              </g>

              {/* 3. BUILD (bottom-left) */}
              <g style={{ opacity: buildOpacity }}>
                <polyline
                  points="-291,157 -234,157 -168,118"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.7)"
                  strokeWidth="1.2"
                  strokeDasharray="140"
                  strokeDashoffset={buildDash}
                />
                <circle
                  cx="-168"
                  cy="118"
                  r="4"
                  fill="#1a8cff"
                  className="drop-shadow-[0_0_6px_#1a8cff]"
                />
                <text
                  x="-303"
                  y="157"
                  fill="rgba(255, 255, 255, 0.95)"
                  dominantBaseline="middle"
                  className="font-sans text-[20px] font-semibold tracking-[0.15em] uppercase select-none"
                  textAnchor="end"
                >
                  {content.diagramLabels.four[2] ?? "BUILD"}
                </text>
              </g>

              {/* 4. IMPACT (bottom-right) */}
              <g style={{ opacity: impactOpacity }}>
                <polyline
                  points="291,157 234,157 168,118"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.7)"
                  strokeWidth="1.2"
                  strokeDasharray="140"
                  strokeDashoffset={impactDash}
                />
                <circle
                  cx="168"
                  cy="118"
                  r="4"
                  fill="#1a8cff"
                  className="drop-shadow-[0_0_6px_#1a8cff]"
                />
                <text
                  x="303"
                  y="157"
                  fill="rgba(255, 255, 255, 0.95)"
                  dominantBaseline="middle"
                  className="font-sans text-[20px] font-semibold tracking-[0.15em] uppercase select-none"
                  textAnchor="start"
                >
                  {content.diagramLabels.four[3] ?? "IMPACT"}
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Bottom Paragraph directly under the Diagram (Revealed at the end of the animation) */}
        {content.outro && (
          <div
            style={{
              opacity: outroOpacity,
              transform: `translate3d(0, ${outroTranslateY}px, 0)`,
              willChange: "transform, opacity",
            }}
            className="pointer-events-none absolute bottom-[24px] z-20 mx-auto max-w-[55rem] px-4 text-center select-none sm:bottom-[36px] md:bottom-[44px]"
          >
            <p className="text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
              {content.outro}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
