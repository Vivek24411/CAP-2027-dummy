import type { WhatIsContent } from "@/models/whatIs";

export const whatIs: WhatIsContent = {
  heading: { title: "What is", accent: "E - Summit?", lead: "title" },
  video: {
    // ▶ ADD THE VIDEO HERE: put the file in public/videos/ with this exact name.
    //   Until it exists the poster image is shown and the controls stay hidden.
    //   Optional: add a smaller WebM copy first in the list — browsers that support it use it.
    //   See "Adding the E-Summit video" in the README for the recommended export settings.
    sources: [{ src: "/videos/what-is-esummit.mp4", type: "video/mp4" }],
    poster: "/images/what-is/video-poster.jpg",
    title: "E-Summit IIT Roorkee highlights",
  },
  story: {
    heading: "Where Ideas Become Legacies!",
    paragraphs: [
      "E-Summit IITR is not just a conclave, it’s the heartbeat of innovation and the grand stage of entrepreneurship. With 15000+ attendees, 10+ power-packed events, and unforgettable nights of laughter and learning.",
      "Each edition sets new benchmarks, hosting icons who have redefined the entrepreneurial spirit of India. E-Summit brings together dreamers, doers, and disruptors from across the nation. This year, we’re back, bigger, bolder, and brighter.",
      "Join, lead the wave of innovation in your college!",
    ],
  },
  diagramLabels: {
    two: ["IDEATE", "BUILD"],
    four: ["DISRUPT", "IDEATE", "BUILD", "IMPACT"],
  },
  // Copy is taken as-is from the Figma file (it still mentions Mood Indigo) — update before launch.
  outro:
    "The college connect program is the vanguard of Mood Indigo’s outreach program. Associate with IIT Bombay’s Mood Indigo. Join the Indigo Family, be the face of Mood Indigo in your college and city. This is your chance to gain valuable experience, pull off awesome events, and build a strong network with similarly motivated individuals helping you in your future professional endeavours.",
  stats: [
    { id: "footfall", value: 13000, suffix: "+", label: "Footfall of Students" },
    { id: "startups", value: 70, suffix: "+", label: "Startups" },
    { id: "speakers", value: 30, suffix: "+", label: "Speaker Sessions" },
  ],
};
