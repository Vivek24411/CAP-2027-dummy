import type { HeadingContent } from "@/models/heading";

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  college: string;
  avatar: string;
};

export type TestimonialsContent = {
  heading: HeadingContent;
  items: Testimonial[];
};
