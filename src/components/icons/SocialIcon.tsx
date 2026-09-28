import type { SocialPlatform } from "@/models/footer";

// Monochrome glyphs drawn inside a 24x24 box; they take the text colour (currentColor).
const paths: Record<Exclude<SocialPlatform, "instagram">, string> = {
  facebook:
    "M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21z",
  // The X (formerly Twitter) logo
  x: "M17.53 3h3.07l-6.7 7.66L21.8 21h-6.17l-4.83-6.32L5.27 21H2.2l7.17-8.19L1.8 3h6.33l4.37 5.77zm-1.08 16.2h1.7L7.18 4.73H5.36z",
  linkedin:
    "M6.9 20H3.6V9.3h3.3zM5.2 7.9a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8zM20.4 20h-3.3v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V20h-3.3V9.3h3.2v1.5c.4-.8 1.5-1.7 3.1-1.7 3.4 0 4 2.2 4 5.1z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z",
};

export function SocialIcon({
  platform,
  className,
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      {platform === "instagram" ? (
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
        </g>
      ) : (
        <path d={paths[platform]} />
      )}
    </svg>
  );
}
