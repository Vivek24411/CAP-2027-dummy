import type { HeadingContent } from "@/models/heading";

export type Brand = {
  id: string;
  name: string;
  // Caption under the card, e.g. "Title Partner".
  label: string;
  logo: string;
};

export type BrandsContent = {
  heading: HeadingContent;
  items: Brand[];
};
