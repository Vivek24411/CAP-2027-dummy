import type { RolesContent } from "@/models/role";

// Only "Lead your campus" comes from the Figma file; the other three are draft copy
// to be confirmed by the team.
export const roles: RolesContent = {
  heading: { accent: "Your role", title: "In the movement" },
  items: [
    {
      id: "lead",
      title: "Lead your campus",
      description:
        "You are ESummit where you study. The events, the buzz, the crowd that shows up — that's your doing.",
    },
    {
      id: "spread",
      title: "Spread the word",
      description:
        "Own the E-Summit story on your campus — socials, groups, notice boards. If they hear about it, it's because of you.",
    },
    {
      id: "build",
      title: "Build the community",
      description:
        "Bring together the builders, dreamers and doers around you, and grow a crew that turns up for every event.",
    },
    {
      id: "grow",
      title: "Grow with us",
      description:
        "Work directly with the E-Cell IIT Roorkee team, earn rewards and certificates, and pick up skills that stay with you.",
    },
  ],
};
