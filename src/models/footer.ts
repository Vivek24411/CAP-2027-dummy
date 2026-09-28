import type { NavLink } from "@/models/navigation";

export type SocialPlatform = "facebook" | "x" | "instagram" | "linkedin" | "youtube";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  href: string;
};

export type FooterContent = {
  tagline: string;
  explore: NavLink[];
  contacts: NavLink[];
  address: string[];
  socials: SocialLink[];
  credit: string;
  copyright: string;
};
