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
  image: ImageAsset;
};
