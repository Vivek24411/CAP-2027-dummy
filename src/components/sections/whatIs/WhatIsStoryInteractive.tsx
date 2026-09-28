"use client";

import Image from "next/image";
import { useRef, useSyncExternalStore } from "react";
import { gsap, motionEnabled, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { WhatIsContent } from "@/models/whatIs";
import { Starfield } from "./Starfield";

// ─────────────────────────────────────────────────────────────────────────────
//  Geometry, in diagram units (the SVG's viewBox is centred on the logo).
// ─────────────────────────────────────────────────────────────────────────────

// The logo box is always laid out at this size; GSAP scales it to fit.
const LOGO = 370;
// The four node dots sit on this circle; a comet runs along it and lights each in turn.
const ORBIT = 205;
// Node angles, clockwise from top-left (SVG: 0° = 3 o'clock, positive = clockwise).
// Labels follow the data order, so DISRUPT → IDEATE → BUILD → IMPACT reads as a cycle.
const NODE_ANGLES = [215, 325, 395, 505];
// Room the finished diagram needs (width × height) before it has to shrink.
const DIAGRAM = { wide: { w: 900, h: 480 }, compact: { w: 800, h: 480 } };

type Layout = "wide" | "compact";

function nodeGeometry(angle: number, layout: Layout) {
  const rad = (angle * Math.PI) / 180;
  const dot = { x: ORBIT * Math.cos(rad), y: ORBIT * Math.sin(rad) };
  const sx = Math.sign(dot.x);
  const sy = Math.sign(dot.y);
  // Phones get shorter leader lines and bigger type (the whole diagram is scaled down there).
  const g =
    layout === "wide"
      ? { elbowX: 234, y: 156, endX: 291, labelX: 303, size: 20, index: 12, gap: 26 }
      : { elbowX: 200, y: 172, endX: 222, labelX: 232, size: 30, index: 18, gap: 36 };
  return {
    dot,
    side: sx,
    path: `M ${dot.x.toFixed(1)} ${dot.y.toFixed(1)} L ${sx * g.elbowX} ${sy * g.y} L ${sx * g.endX} ${sy * g.y}`,
    label: { x: sx * g.labelX, y: sy * g.y, size: g.size },
    index: { x: sx * g.labelX, y: sy * g.y - g.gap, size: g.index },
    anchor: sx < 0 ? ("end" as const) : ("start" as const),
  };
}

// Adds an expanding ring to the timeline: radius grows `from` → `to` while it fades out.
// Driven by a 0–1 progress value so it's invisible at rest in both scroll directions.
function addPulse(
  tl: gsap.core.Timeline,
  ring: Element | null,
  { from, to, peak, duration }: { from: number; to: number; peak: number; duration: number },
  at: number,
) {
  if (!ring) return;
  const state = { t: 0 };
  tl.fromTo(
    state,
    { t: 0 },
    {
      t: 1,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        ring.setAttribute("r", (from + (to - from) * state.t).toFixed(1));
        ring.setAttribute("opacity", state.t > 0 ? (peak * (1 - state.t)).toFixed(3) : "0");
      },
    },
    at,
  );
}

function useLayout(): Layout {
  return useSyncExternalStore(
    (callback) => {
      const query = window.matchMedia("(max-width: 639px)");
      query.addEventListener("change", callback);
      return () => query.removeEventListener("change", callback);
    },
    () => (window.matchMedia("(max-width: 639px)").matches ? "compact" : "wide"),
    () => "wide",
  );
}

// "Where Ideas Become Legacies!" story, then the E-Summit logo diagram — one pinned,
// scroll-scrubbed sequence (GSAP timeline; writes straight to the DOM, no re-renders):
//   entering   the story rises in and the logo spins/sharpens into its slot on the right
//   0.6 – 1.9  the story lifts away while the logo glides to the centre
//   1.7 – 2.6  a shockwave rings out and the outer arcs draw
//   2.35–5.35  a comet runs clockwise round the orbit; as it reaches each node the dot
//              pops, its leader line draws out and the label slides in (01 → 04), and
//              the logo's glow brightens a step
//   5.1 – 5.8  the closing paragraph rises in underneath, then a short hold
// Scrub is smoothed (0.8s) so the diagram glides after the wheel rather than stepping.
export function WhatIsStoryInteractive({
  className,
  content,
}: {
  className?: string;
  content: WhatIsContent;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const layout = useLayout();
  const labels = content.diagramLabels.four;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const one = <T extends Element = HTMLElement>(selector: string) =>
        root.querySelector<T>(selector);
      const stage = one("[data-stage]");
      const anchor = one("[data-anchor]");
      const hud = one("[data-hud]");
      const logo = one("[data-logo]");
      const outro = one("[data-outro]");
      const comet = one<SVGGElement>("[data-comet]");
      const track = one<SVGCircleElement>("[data-track]");
      if (!stage || !anchor || !hud || !logo || !comet || !track) return;
      const animate = motionEnabled();

      // Where the logo starts (its slot beside the story) and where it ends (centred in the
      // space between the navbar and the closing paragraph, scaled to fit).
      const measure = () => {
        const s = stage.getBoundingClientRect();
        const a = anchor.getBoundingClientRect();
        const navClearance = 88;
        const outroSpace = outro ? outro.offsetHeight + 40 : 0;
        const room = DIAGRAM[layout];
        return {
          startX: a.left + a.width / 2 - (s.left + s.width / 2),
          startY: a.top + a.height / 2 - (s.top + s.height / 2),
          startScale: a.width / LOGO,
          endY: (navClearance - outroSpace) / 2,
          endScale: Math.min(
            1,
            (s.width - 32) / room.w,
            (s.height - navClearance - outroSpace) / room.h,
          ),
        };
      };

      // ── Entering: story and logo come in as the section scrolls up to the pin ──
      gsap.set(hud, { opacity: 1 });
      if (animate) {
        gsap
          .timeline({
            scrollTrigger: { trigger: root, start: "top 85%", end: "top 5%", scrub: 0.6 },
          })
          .fromTo(
            q("[data-story-item]"),
            { opacity: 0, y: 56 },
            { opacity: 1, y: 0, stagger: 0.14, duration: 1, ease: "power2.out" },
            0,
          )
          .fromTo(
            logo,
            { opacity: 0, scale: 0.72, rotation: -28, filter: "blur(18px)" },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              filter: "blur(0px)",
              duration: 1.3,
              ease: "power2.out",
            },
            0.1,
          );

        // Ambient: the outer arcs turn very slowly, forever.
        gsap.to(q("[data-arcs]"), {
          rotation: 360,
          svgOrigin: "0 0",
          duration: 90,
          repeat: -1,
          ease: "none",
        });
      } else {
        gsap.set(q("[data-story-item]"), { opacity: 1 });
      }

      // ── Pinned sequence ───────────────────────────────────────────────────
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: animate ? 0.8 : true,
          invalidateOnRefresh: true,
        },
      });

      // Story lifts away; logo glides from its slot to the centre.
      tl.to(
        q("[data-story]"),
        { opacity: 0, y: -48, duration: 0.8, ease: "power2.in" },
        0.6,
      ).fromTo(
        hud,
        {
          x: () => measure().startX,
          y: () => measure().startY,
          scale: () => measure().startScale,
        },
        {
          x: 0,
          y: () => measure().endY,
          scale: () => measure().endScale,
          duration: 1.3,
          ease: "power3.inOut",
        },
        0.6,
      );

      // Arrival: shockwave + first glow + outer arcs draw.
      addPulse(tl, q("[data-shock]")[0], { from: 150, to: 320, peak: 0.6, duration: 0.9 }, 1.7);
      tl.fromTo(q("[data-glow]"), { opacity: 0 }, { opacity: 0.3, duration: 0.6 }, 1.6).fromTo(
        q("[data-arc]"),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" },
        1.8,
      );

      // The comet: one proxy angle drives both the comet head and the traced orbit.
      const orbit = { angle: NODE_ANGLES[0] };
      const drawOrbit = () => {
        comet.setAttribute("transform", `rotate(${orbit.angle.toFixed(2)})`);
        track.style.strokeDashoffset = String(1 - (orbit.angle - NODE_ANGLES[0]) / 360);
      };
      drawOrbit();

      const firstHit = 2.35;
      const leg = 0.8;
      tl.fromTo(comet, { opacity: 0 }, { opacity: 1, duration: 0.15 }, firstHit - 0.1);
      [...NODE_ANGLES.slice(1), NODE_ANGLES[0] + 360].forEach((angle, index) => {
        tl.to(
          orbit,
          {
            angle,
            // Slows into each node and pulls away again, so it reads as "docking".
            ease: "sine.inOut",
            duration: index === NODE_ANGLES.length - 1 ? 0.6 : leg,
            onUpdate: drawOrbit,
          },
          firstHit + index * leg,
        );
      });
      tl.to(comet, { opacity: 0, duration: 0.25 }, firstHit + 3 * leg + 0.4);

      // Each node lights up as the comet reaches it.
      q("[data-node]").forEach((node, index) => {
        const at = firstHit + index * leg;
        const side = Number((node as HTMLElement).dataset.side);
        addPulse(
          tl,
          node.querySelector("[data-ring]"),
          { from: 4, to: 30, peak: 0.9, duration: 0.6 },
          at,
        );
        tl.fromTo(
          node.querySelector("[data-dot]"),
          { scale: 0, transformOrigin: "50% 50%" },
          { scale: 1, duration: 0.25, ease: "back.out(3)" },
          at,
        )
          .fromTo(
            node.querySelector("[data-leader]"),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.45, ease: "power2.inOut" },
            at + 0.05,
          )
          .fromTo(
            node.querySelector("[data-label]"),
            { opacity: 0, x: -side * 18 },
            { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" },
            at + 0.25,
          )
          .to(q("[data-glow]"), { opacity: 0.3 + 0.175 * (index + 1), duration: 0.3 }, at);
      });

      // Closing paragraph, then a short hold before the section lets go.
      if (outro) {
        tl.fromTo(
          outro,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          5.1,
        );
      }
      tl.to({}, { duration: 0.6 }, 5.8);
    },
    { scope: rootRef, dependencies: [layout], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className={cn("relative h-[380vh]", className)}>
      <div data-stage className="bg-background sticky top-0 h-svh w-full overflow-hidden">
        <Starfield count={140} className="opacity-80" />

        {/* Soft top/bottom edges so the stage melts into the page */}
        <div
          aria-hidden="true"
          className="from-background pointer-events-none absolute inset-x-0 top-0 z-30 h-24 bg-linear-to-b to-transparent"
        />
        <div
          aria-hidden="true"
          className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-30 h-10 bg-linear-to-t to-transparent md:h-24"
        />

        {/* Story beside the logo's starting slot */}
        <div className="relative mx-auto flex h-full w-full max-w-[72rem] flex-col items-center justify-center gap-8 px-4 pt-20 pb-6 sm:px-6 lg:flex-row lg:justify-between lg:gap-16 lg:px-8">
          <div data-story className="relative z-20 w-full max-w-[42rem] text-left">
            <h3
              data-story-item
              className="js:opacity-0 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-[2rem] lg:text-[2.25rem]"
            >
              {content.story.heading}
            </h3>
            <div className="mt-5 space-y-4">
              {content.story.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  data-story-item
                  className="js:opacity-0 text-sm leading-[1.7] text-white/80 sm:text-base md:text-lg md:leading-[1.65]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Where the logo sits before it glides to the centre (measured, never drawn) */}
          <div
            data-anchor
            aria-hidden="true"
            className="size-[180px] shrink-0 sm:size-[260px] md:size-[320px] lg:size-[370px]"
          />
        </div>

        {/* Logo + diagram */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
        >
          <div
            data-hud
            className="js:opacity-0 relative shrink-0 will-change-transform select-none"
            style={{ width: LOGO, height: LOGO }}
          >
            {/* Glow that brightens a step as each node lights */}
            <div
              data-glow
              className="absolute -inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgb(26_120_255/0.5),rgb(26_120_255/0.16)_40%,rgb(26_120_255/0.05)_68%,transparent)] opacity-0"
            />

            <div data-logo className="relative size-full will-change-transform">
              <div className="coin-float size-full">
                <Image
                  src="/images/what-is/logo-glow.png"
                  alt=""
                  width={470}
                  height={464}
                  className="size-full object-contain"
                />
              </div>
            </div>

            <svg
              viewBox="-450 -300 900 600"
              className="absolute top-1/2 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-visible"
            >
              <defs>
                <radialGradient id="comet-glow">
                  <stop offset="0%" stopColor="#bfe0ff" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#1a8cff" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#1a8cff" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Shockwave when the logo lands */}
              <circle
                data-shock
                r="150"
                fill="none"
                stroke="rgb(120 180 255)"
                strokeWidth="1.5"
                opacity="0"
              />

              {/* Outer arcs */}
              <g data-arcs>
                {["M 40 -222 A 226 226 0 0 1 205 -95", "M -40 222 A 226 226 0 0 1 -205 95"].map(
                  (d) => (
                    <path
                      key={d}
                      data-arc
                      d={d}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.45)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray="1 1"
                      strokeDashoffset={1}
                    />
                  ),
                )}
              </g>

              {/* The orbit the comet traces (drawn behind it as it goes) */}
              <circle
                data-track
                r={ORBIT}
                fill="none"
                stroke="rgba(160, 200, 255, 0.28)"
                strokeWidth="1"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1}
                transform={`rotate(${NODE_ANGLES[0]})`}
              />

              {/* Nodes */}
              {NODE_ANGLES.map((angle, index) => {
                const n = nodeGeometry(angle, layout);
                return (
                  <g key={angle} data-node data-side={n.side}>
                    <path
                      data-leader
                      d={n.path}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.7)"
                      strokeWidth="1.2"
                      pathLength={1}
                      strokeDasharray="1 1"
                      strokeDashoffset={1}
                    />
                    <circle
                      data-ring
                      cx={n.dot.x}
                      cy={n.dot.y}
                      r="4"
                      fill="none"
                      stroke="#6fb4ff"
                      strokeWidth="1.2"
                      opacity="0"
                    />
                    <circle
                      data-dot
                      cx={n.dot.x}
                      cy={n.dot.y}
                      r="4.5"
                      fill="#1a8cff"
                      className="drop-shadow-[0_0_6px_#1a8cff]"
                      transform="scale(0)"
                    />
                    <g data-label opacity="0">
                      <text
                        x={n.index.x}
                        y={n.index.y}
                        fill="#4da3ff"
                        dominantBaseline="middle"
                        textAnchor={n.anchor}
                        fontSize={n.index.size}
                        className="font-sans tracking-[0.2em] tabular-nums"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </text>
                      <text
                        x={n.label.x}
                        y={n.label.y}
                        fill="rgba(255, 255, 255, 0.95)"
                        dominantBaseline="middle"
                        textAnchor={n.anchor}
                        fontSize={n.label.size}
                        className="font-sans font-semibold tracking-[0.15em] uppercase"
                      >
                        {labels[index]}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Comet head (rotated round the orbit by the timeline) */}
              <g data-comet opacity="0" transform={`rotate(${NODE_ANGLES[0]})`}>
                <circle cx={ORBIT} cy="0" r="16" fill="url(#comet-glow)" />
                <circle cx={ORBIT} cy="0" r="2.6" fill="#fff" />
              </g>
            </svg>
          </div>
        </div>

        {/* Closing paragraph under the diagram */}
        {content.outro && (
          <div
            data-outro
            className="js:opacity-0 pointer-events-none absolute inset-x-0 bottom-8 z-20 mx-auto max-w-[55rem] px-4 text-center sm:bottom-9 md:bottom-11"
          >
            <p className="text-[0.8125rem] leading-relaxed text-pretty text-white/75 sm:text-base md:text-lg">
              {content.outro}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
