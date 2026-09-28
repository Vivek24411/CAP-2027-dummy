// A static, randomly scattered star field drawn as one SVG. It's rendered on the server
// and never changes, so it costs nothing after first paint. The same `seed` always gives
// the same sky (server and client agree).

type StarFieldProps = {
  count: number;
  seed: number;
  // Aspect of the drawing area; the SVG covers its box ("slice"), so this only sets density.
  width?: number;
  height?: number;
  // Brightest star opacity; the rest are dimmer.
  maxOpacity?: number;
  className?: string;
};

function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function StarField({
  count,
  seed,
  width = 1440,
  height = 900,
  maxOpacity = 0.5,
  className,
}: StarFieldProps) {
  const random = seeded(seed);
  const stars = Array.from({ length: count }, () => {
    const size = random();
    return {
      x: (random() * width).toFixed(1),
      y: (random() * height).toFixed(1),
      // Mostly tiny, a few slightly larger
      r: (0.35 + size * size * 0.9).toFixed(2),
      o: (maxOpacity * (0.25 + random() * 0.75)).toFixed(2),
    };
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      {stars.map((star, index) => (
        <circle key={index} cx={star.x} cy={star.y} r={star.r} fill="#dfe7f5" opacity={star.o} />
      ))}
    </svg>
  );
}
