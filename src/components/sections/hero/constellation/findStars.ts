// Finds the stars painted into the hero illustration: small points that are clearly
// brighter than their surroundings, in the sky part of the image. Runs once, on a
// downscaled copy. The painted stars are faint and sparse near the top, so the set is
// topped up with extra points scattered through the sky (seeded, so they're always in
// the same place) until there are `count`. Positions are fractions of the image (0–1).

export type StarPoint = { x: number; y: number; brightness: number };

const SAMPLE_WIDTH = 960;

export function findStars(image: HTMLImageElement, count: number, skyHeight: number) {
  const w = SAMPLE_WIDTH;
  const h = Math.round((w * image.naturalHeight) / image.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(image, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  const lum = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    lum[i] = 0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2];
  }

  const candidates: StarPoint[] = [];
  const maxY = Math.min(h - 3, Math.floor(h * skyHeight));
  for (let y = 3; y < maxY; y++) {
    for (let x = 3; x < w - 3; x++) {
      const v = lum[y * w + x];
      if (v < 38) continue;
      // A local maximum in its 3×3 neighbourhood…
      let isPeak = true;
      for (let dy = -1; dy <= 1 && isPeak; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if ((dx || dy) && lum[(y + dy) * w + x + dx] > v) {
            isPeak = false;
            break;
          }
        }
      }
      if (!isPeak) continue;
      // …that stands out from the ring of pixels around it.
      let ring = 0;
      let count = 0;
      for (let d = -3; d <= 3; d++) {
        ring += lum[(y - 3) * w + x + d] + lum[(y + 3) * w + x + d];
        ring += lum[(y + d) * w + x - 3] + lum[(y + d) * w + x + 3];
        count += 4;
      }
      const contrast = v - ring / count;
      if (contrast < 10) continue;
      candidates.push({ x: x / w, y: y / h, brightness: contrast });
    }
  }

  // Brightest first, keeping a little space between stars.
  candidates.sort((a, b) => b.brightness - a.brightness);
  const aspect = w / h;
  const minGap = 0.02;
  const picked: StarPoint[] = [];
  for (const star of candidates) {
    if (picked.length >= count) break;
    const tooClose = picked.some((p) => Math.hypot((p.x - star.x) * aspect, p.y - star.y) < minGap);
    if (!tooClose) picked.push(star);
  }

  const top = picked[0]?.brightness ?? 1;
  const stars = picked.map((star) => ({
    ...star,
    brightness: 0.45 + 0.55 * (star.brightness / top),
  }));

  // Top up with scattered points so every part of the sky has stars to connect.
  const random = seeded(2027);
  for (let tries = 0; stars.length < count && tries < count * 40; tries++) {
    const star = {
      x: 0.02 + random() * 0.96,
      y: 0.03 + random() * (skyHeight - 0.05),
      brightness: 0.35 + random() * 0.35,
    };
    const tooClose = stars.some((p) => Math.hypot((p.x - star.x) * aspect, p.y - star.y) < minGap);
    if (!tooClose) stars.push(star);
  }
  return stars;
}

function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
