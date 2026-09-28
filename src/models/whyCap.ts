import type { HeadingContent } from "@/models/heading";

export type Benefit = {
  id: string;
  title: string;
  description: string;
  // 4:3 artwork (it is cropped to fill). Leave it out and an on-palette placeholder shows.
  image?: string;
  imageAlt: string;
};

export type WhyCapContent = {
  heading: HeadingContent;
  benefits: Benefit[];
};
