import type { AboutContent, TeamContact } from "@/models/about";

// Team contact details, kept here until they're finalised and put back on the cards.
export const teamContactsDraft: Record<string, TeamContact> = {
  "om-narayana-mohanty": {
    id: "om-narayana-mohanty",
    name: "Om Narayana Mohanty",
    role: "Senior Manager",
    photo: "/images/team/om-narayana-mohanty.jpg",
    phone: "+91 9777160704",
    email: "narayana_om@es.iitr.ac.in",
    linkedin: "https://www.linkedin.com/in/om-narayana-mohanty-2376a43a9",
  },
  "akshay-kumar": {
    id: "akshay-kumar",
    name: "Akshay Kumar",
    role: "Senior Manager",
    photo: "/images/team/akshay-kumar.jpg",
    phone: "+91 7009166575",
    email: "akshay_k1@me.iit.ac.in",
    linkedin: "https://www.linkedin.com/in/akshay-kumar-9a91b0391",
  },
};

// Copy is taken as-is from the Figma file (it still mentions Mood Indigo) — update before launch.
export const about: AboutContent = {
  heading: { accent: "About", title: "Us" },
  paragraphs: [
    "The College Connect Program (CCP) is the backbone of Mood Indigo’s nationwide outreach. Led by the Hospitality and Public Relations Heads, CCP builds bridges with over 7000+ colleges, bringing Mood Indigo’s spirit to campuses across India.",
    "We aim to create a vibrant network of passionate students who champion the fest in their cities - expanding our reach, amplifying engagement, and making Mood Indigo a truly national movement.",
  ],
  // Three empty cards for now (contact details temporarily removed). To show a person
  // again, give a card a contact, e.g. { id: "om", contact: teamContactsDraft["om-narayana-mohanty"] }.
  cards: [{ id: "card-1" }, { id: "card-2" }, { id: "card-3" }],
};
