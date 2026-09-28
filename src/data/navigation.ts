import type { Navigation } from "@/models/navigation";

// Section links point at ids on the home page, e.g. <section id="faqs">.
export const navigation: Navigation = {
  links: [
    { label: "Home", href: "/" },
    { label: "Benefits", href: "/#benefits" },
    { label: "Process", href: "/#process" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "FAQs", href: "/#faqs" },
  ],
  // TODO: point at the real auth page once it exists.
  cta: { label: "Login/Signup", href: "/apply" },
};
