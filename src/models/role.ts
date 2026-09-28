import type { HeadingContent } from "@/models/heading";

// The card number (01, 02, ...) comes from the role's position in the list.
export type Role = {
  id: string;
  title: string;
  description: string;
};

export type RolesContent = {
  heading: HeadingContent;
  items: Role[];
};
