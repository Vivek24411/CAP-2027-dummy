import type { WhyCapContent } from "@/models/whyCap";

// Card images: drop a 4:3 file (ideally 1200×900) in public/images/why-cap and set `image`,
// e.g. image: "/images/why-cap/certificate.jpg". Without `image` the card shows an
// on-palette placeholder. (The PNGs currently in that folder are Figma cut-outs with
// pastel backgrounds baked in, so they're not used.)
export const whyCap: WhyCapContent = {
  heading: { accent: "Why", title: "CAP?" },
  benefits: [
    {
      id: "certified",
      title: "Get Certified",
      imageAlt: "Placeholder image for Get Certified",
      description:
        "Earn an official E-Summit IIT Roorkee certificate that validates your contribution and stands out on every resume and LinkedIn profile.",
    },
    {
      id: "leader",
      title: "Be a Leader",
      imageAlt: "Placeholder image for Be a Leader",
      description:
        "Lead the innovation movement on your campus, build and manage your own team, and develop real leadership and event-management skills.",
    },
    {
      id: "goodies",
      title: "Goodies & Merchandise",
      imageAlt: "Placeholder image for Goodies & Merchandise",
      description:
        "Unlock exclusive E-Summit swag — tees, stickers, and limited-edition merch — plus rewards and perks as you climb the ambassador leaderboard.",
    },
    {
      id: "career",
      title: "Career Launchpad",
      imageAlt: "Placeholder image for Career Launchpad",
      description:
        "Get direct access to startups, mentors, and recruiters — internships, PPOs, and networking that launch your entrepreneurial career.",
    },
  ],
};
