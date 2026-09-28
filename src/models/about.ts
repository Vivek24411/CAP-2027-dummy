import type { HeadingContent } from "@/models/heading";

export type TeamContact = {
  id: string;
  name: string;
  role: string;
  photo: string;
  phone?: string;
  email?: string;
  // Full profile URL, e.g. "https://www.linkedin.com/in/username". Leave out to hide the icon.
  linkedin?: string;
};

// A card slot is either a person or an empty placeholder waiting for one.
export type AboutCard = { id: string; contact?: TeamContact };

export type AboutContent = {
  heading: HeadingContent;
  paragraphs: string[];
  cards: AboutCard[];
};
