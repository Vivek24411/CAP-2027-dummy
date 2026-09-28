import Link from "next/link";
import type { CSSProperties } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { getHero } from "@/controllers/content";
import { HeroBackground } from "./HeroBackground";
import { HeroScrollFx } from "./HeroScrollFx";

function HeroStar({ index }: { index: number }) {
  return (
    <svg
      viewBox="0 0 22 24"
      aria-hidden="true"
      data-hero="star"
      style={order(index)}
      className="h-6 w-[1.375rem] shrink-0 text-[#1f6fff] drop-shadow-[0_0_10px_rgb(31_111_255/0.8)]"
    >
      <path
        fill="currentColor"
        d="M11 0C11.8 8 14 10.7 22 12 14 13.3 11.8 16 11 24 10.2 16 8 13.3 0 12 8 10.7 10.2 8 11 0Z"
      />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

// `--i` orders the load-in animation (see "Hero intro" in globals.css).
const order = (i: number) => ({ "--i": i }) as CSSProperties;

// The night-sky illustration (its stars link into a constellation around the cursor on
// hover, see ./constellation), with the tag, heading, subtitle and buttons on top, and a
// quiet meta row (location + scroll cue) along the bottom edge.
export async function HeroSection() {
  const hero = await getHero();

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative isolate flex h-[max(46rem,63.05vw)] flex-col items-center overflow-hidden px-4 pt-32 text-center md:h-[max(56rem,63.05vw)] md:pt-[9.6875rem]"
    >
      <HeroBackground image={hero.image} />
      {/* Blend the bottom edge into the page background */}
      <div
        aria-hidden="true"
        className="to-background pointer-events-none absolute inset-x-0 bottom-0 -z-[4] h-40 bg-linear-to-b from-transparent"
      />

      <HeroScrollFx className="flex flex-col items-center will-change-transform">
        <p
          data-hero="tag"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-[#090f21]/70 py-1.5 pr-3.5 pl-2.5 text-xs tracking-[0.08em] text-white/85 uppercase backdrop-blur-md"
        >
          <span aria-hidden="true" className="relative flex size-1.5">
            <span className="bg-accent absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none" />
            <span className="bg-accent relative size-1.5 rounded-full" />
          </span>
          {hero.badge}
        </p>

        <h1 id="hero-heading" className="mt-7 flex flex-col items-center text-white uppercase">
          <span
            data-hero="track"
            style={order(0)}
            className="flex items-center gap-3 text-[2.25rem] leading-none tracking-[0.04em] md:gap-4 md:text-[2.9rem]"
          >
            <HeroStar index={0} />
            {hero.eyebrow}
            <HeroStar index={1} />
          </span>

          {/* One span per letter so they can materialise in turn; screen readers get the word. */}
          <span className="font-condensed relative mt-2 block text-[4.25rem] leading-[1.05] md:mt-0.5 md:text-[6.4rem]">
            <span className="sr-only">{hero.title}</span>
            <span aria-hidden="true" className="flex [text-shadow:0_0_40px_rgb(80_150_255/0.35)]">
              {[...hero.title].map((char, index) => (
                <span key={index} data-hero="char" style={order(index)} className="inline-block">
                  {char}
                </span>
              ))}
            </span>
            {/* Horizon flare under the title */}
            <span
              data-hero="flare"
              aria-hidden="true"
              className="absolute -inset-x-[18%] bottom-0.5 h-px bg-[linear-gradient(90deg,transparent,rgb(120_180_255/0.9)_35%,#fff_50%,rgb(120_180_255/0.9)_65%,transparent)] opacity-50 shadow-[0_0_14px_2px_rgb(60_140_255/0.55)]"
            />
          </span>

          <span
            data-hero="track"
            style={order(1)}
            className="mt-3 block text-[2.25rem] leading-none tracking-[0.04em] md:mt-3 md:text-[2.9rem]"
          >
            {hero.subtitle}
          </span>
        </h1>

        <p
          data-hero="after"
          style={order(0)}
          className="mt-8 max-w-[33rem] text-base leading-[1.5] text-pretty text-white/80"
        >
          {hero.description}
        </p>

        <div
          data-hero="after"
          style={order(1)}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-6"
        >
          <Magnetic>
            <Link
              href={hero.cta.href}
              className="group/cta bg-accent-fill relative inline-flex h-14 items-center gap-4 overflow-hidden rounded-full py-2 pr-2 pl-7 text-lg text-white shadow-[0_0_0_1px_rgb(255_255_255/0.18)_inset,0_10px_40px_-8px_rgb(2_133_226/0.7)] transition-[background-color,box-shadow] duration-300 hover:bg-[#0285e2] hover:shadow-[0_0_0_1px_rgb(255_255_255/0.3)_inset,0_14px_50px_-6px_rgb(2_133_226/0.95)]"
            >
              {/* Sheen that sweeps across on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/30 to-transparent transition-[left] duration-700 ease-out group-hover/cta:left-[130%]"
              />
              <span className="relative">{hero.cta.label}</span>
              <span className="text-accent-fill relative grid size-10 place-items-center overflow-hidden rounded-full bg-white">
                <ArrowIcon className="size-4 transition-transform duration-300 ease-out group-hover/cta:translate-x-6" />
                <ArrowIcon className="absolute size-4 -translate-x-6 transition-transform duration-300 ease-out group-hover/cta:translate-x-0" />
              </span>
            </Link>
          </Magnetic>

          <Link
            href={hero.secondaryCta.href}
            className="group/link relative inline-flex h-11 items-center text-[0.9375rem] text-white/75 transition-colors duration-200 hover:text-white"
          >
            {hero.secondaryCta.label}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-2 h-px origin-right scale-x-0 bg-current transition-[scale] duration-300 ease-out group-hover/link:origin-left group-hover/link:scale-x-100"
            />
          </Link>
        </div>
      </HeroScrollFx>

      {/* Meta row along the bottom: where, and a scroll cue */}
      <div
        data-hero="meta"
        className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto flex max-w-[75rem] items-end justify-center px-4 text-[0.6875rem] tracking-[0.18em] text-white/55 uppercase sm:grid sm:grid-cols-[1fr_auto_1fr] sm:px-6 md:bottom-8 lg:px-8"
      >
        <p className="hidden justify-self-start tabular-nums sm:block">{hero.location}</p>
        <p aria-hidden="true" className="flex flex-col items-center gap-3">
          Scroll
          <span className="scroll-cue relative block h-10 w-px overflow-hidden bg-white/15" />
        </p>
        <p className="hidden justify-self-end sm:block">E-Summit &apos;27</p>
      </div>
    </section>
  );
}
