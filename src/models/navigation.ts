export type NavLink = {
  label: string;
  href: string;
};

export type Navigation = {
  links: NavLink[];
  cta: NavLink;
};
