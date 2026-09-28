// ─────────────────────────────────────────────────────────────────────────────
//  Hero constellation — every tunable value in one place.
//  At rest the hero is just the illustration. When the mouse moves over it, the stars
//  near the cursor light up and link into a faint constellation that follows it, and
//  it all fades away when the mouse leaves. Save a change and the dev server reloads.
// ─────────────────────────────────────────────────────────────────────────────

export const CONSTELLATION_CONFIG = {
  // Stars within this many pixels of the cursor light up.
  radius: 220,
  // Two lit stars closer than this (px) get joined by a line.
  linkDistance: 140,
  // Each star joins at most this many of its nearest neighbours.
  maxLinksPerStar: 3,
  // The cursor itself joins its nearest few stars (0 = off).
  cursorLinks: 2,

  // Look (RGB triplets so opacity can vary per line/star).
  lineColor: "169, 203, 255",
  lineOpacity: 0.7,
  lineWidth: 0.9,
  starColor: "226, 236, 255",
  // Radius of a lit star's core and of its soft glow, in px.
  starSize: 1.4,
  glowSize: 9,
  // A very soft light around the cursor (0 = off).
  cursorGlow: 0.07,

  // Stars: the ones painted in the image are found automatically (brightest small points
  // in the top `skyHeight` of the picture), then topped up to this many in total.
  stars: { desktop: 150, mobile: 80 },
  skyHeight: 0.6,

  // Motion
  follow: 0.14, // how closely the light follows the cursor (0–1, lower = smoother)
  fadeIn: 0.35, // seconds
  fadeOut: 1.2, // seconds after the mouse leaves (or a touch ends)
  twinkle: 0.35, // how much lit stars twinkle (0 = steady)
} as const;
