import { StarField } from "./StarField";

// Fixed, static page background: a faint star field under everything and a light grain
// over everything. Both are drawn once (SVG in the server HTML) and never re-render,
// so they cost nothing while scrolling.

// SVG fractal noise, tiled. 3% opacity is enough to take the digital flatness off.
const grain = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;

export function PageBackdrop() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <StarField count={170} seed={2027} maxOpacity={0.5} className="size-full" />
      </div>
      <div
        aria-hidden="true"
        style={{ backgroundImage: grain }}
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.03]"
      />
    </>
  );
}
