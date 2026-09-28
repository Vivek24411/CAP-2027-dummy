import type { HeadingContent } from "@/models/heading";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqContent = {
  heading: HeadingContent;
  items: FaqItem[];
};
