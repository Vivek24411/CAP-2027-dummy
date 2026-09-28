import Link from "next/link";
import type { CSSProperties } from "react";
import { getHero } from "@/controllers/content";
import { HeroBackground } from "./HeroBackground";
import { HeroScrollFx } from "./HeroScrollFx";

function HeroStar() {
  return (
    <svg
      viewBox="0 0 22 24"
      aria-hidden="true"
      className="h-6 w-[1.375rem] shrink-0 text-[#1f6fff]"
    >
      <path
        fill="currentColor"
        d="M11 0C11.8 8 14 10.7 22 12 14 13.3 11.8 16 11 24 10.2 16 8 13.3 0 12 8 10.7 10.2 8 11 0Z"
      />
    </svg>
  );
}

// `--i` orders the load-in animation (see "Hero intro" in globals.css).
const order = (i: number) => ({ "--i": i }) as CSSProperties;

// The night-sky illustration (its stars link into a constellation around the cursor on
// hover, see ./constellation), with the tag, heading, subtitle and button on top.
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
          className="rounded-full border border-white/35 bg-[#090f21]/80 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm"
        >
          {hero.badge}
        </p>

        <h1 id="hero-heading" className="mt-6 flex flex-col items-center text-white uppercase">
          {/* Each line sits in its own mask so it can slide up from behind it */}
          <span className="block overflow-hidden pb-1">
            <span
              data-hero="line"
              style={order(0)}
              className="flex items-center gap-3 text-[2.25rem] leading-none tracking-[0.04em] md:gap-4 md:text-[2.9rem]"
            >
              <HeroStar />
              {hero.eyebrow}
              <HeroStar />
            </span>
          </span>
          <span className="mt-2 block overflow-hidden md:mt-0.5">
            <span
              data-hero="line"
              style={order(1)}
              className="font-condensed block text-[4.25rem] leading-[1.05] md:text-[6.4rem]"
            >
              {hero.title}
            </span>
          </span>
          <span className="mt-2 block overflow-hidden pb-1 md:mt-1.5">
            <span
              data-hero="line"
              style={order(2)}
              className="block text-[2.25rem] leading-none tracking-[0.04em] md:text-[2.9rem]"
            >
              {hero.subtitle}
            </span>
          </span>
        </h1>

        <p
          data-hero="after"
          style={order(0)}
          className="mt-8 max-w-[33rem] text-base leading-[1.45] text-white/85"
        >
          {hero.description}
        </p>

        <div data-hero="after" style={order(1)} className="mt-6">
          <Link
            href={hero.cta.href}
            className="bg-accent-fill inline-flex h-[3.375rem] items-center rounded-lg border border-white/30 px-6 text-xl text-white transition duration-200 hover:bg-[#0285e2] hover:shadow-[0_0_28px_rgba(2,133,226,0.6)]"
          >
            {hero.cta.label}
          </Link>
        </div>
      </HeroScrollFx>
    </section>
  );
}
