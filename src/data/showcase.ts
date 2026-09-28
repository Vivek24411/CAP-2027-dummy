import type { Showcase } from "@/models/showcase";

export const showcase: Showcase = {
  rewards: {
    src: "/images/showcase/rewards.png",
    alt: "Campus ambassador rewards: a certificate of participation, free accommodation, the E-Summit T-shirt and certified courses",
    width: 1440,
    height: 644,
  },
  banner: {
    phrases: ["Registrations are live", "Register Now", "Register Now", "Register Now"],
    // TODO: point at the real registration page once it exists.
    href: "/apply",
    label: "Registrations are live — register now for the Campus Ambassador Program",
  },
  stage: {
    src: "/images/showcase/esummit-stage.jpg",
    alt: "The illuminated E-Summit sign on stage at IIT Roorkee",
    width: 1435,
    height: 273,
  },
};
