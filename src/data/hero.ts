import type { HeroContent } from "@/models/hero";

export const hero: HeroContent = {
  badge: "E-Summit 2027 Presents",
  eyebrow: "Campus",
  title: "Ambassador",
  subtitle: "Program",
  description:
    "Where you'll be pivotal in promoting our event, broadening our reach, and enhancing our platform's success.",
  // TODO: point at the real registration page once it exists.
  cta: { label: "Register Now", href: "/apply" },
  // Its stars light up on hover (see components/sections/hero/constellation).
  image: {
    src: "/images/hero/night-sky-hd.jpg",
    alt: "A student working on a glowing laptop on a hillside under a starry night sky",
    width: 2880,
    height: 1816,
  },
};
