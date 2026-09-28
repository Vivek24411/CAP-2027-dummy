import type { NavLink } from "@/models/navigation";
import type { ImageAsset } from "@/models/showcase";

export type HeroContent = {
  badge: string;
  // Rendered as three lines: "CAMPUS" / "AMBASSADOR" / "PROGRAM".
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  cta: NavLink;
  // Quieter text link next to the main button.
  secondaryCta: NavLink;
  // Small print along the bottom of the hero, e.g. where the summit happens.
  location: string;
  image: ImageAsset;
};
