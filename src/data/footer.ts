import type { FooterContent } from "@/models/footer";

// Social URLs are placeholders ("#") until the official handles are confirmed.
export const footer: FooterContent = {
  tagline:
    "E-Summit IIT Roorkee is North India's largest entrepreneurial fest, organized by the Entrepreneurship Cell to inspire and empower future leaders.",
  explore: [
    { label: "Home", href: "/" },
    { label: "Benefits", href: "/#benefits" },
    { label: "How it works?", href: "/#process" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "FAQs", href: "/#faqs" },
  ],
  contacts: [
    { label: "esummit@iitr.ac.in", href: "mailto:esummit@iitr.ac.in" },
    { label: "+91 6387630920", href: "tel:+916387630920" },
  ],
  address: ["E-Cell Office, SAC Building", "IIT Roorkee", "Roorkee, Uttarakhand - 247667"],
  socials: [
    { platform: "facebook", label: "Facebook", href: "#" },
    { platform: "x", label: "Twitter", href: "#" },
    { platform: "instagram", label: "Instagram", href: "#" },
    { platform: "linkedin", label: "LinkedIn", href: "#" },
    { platform: "youtube", label: "YouTube", href: "#" },
  ],
  credit: "by Design & Tech Team",
  copyright: "© 2027 E-Summit IIT Roorkee. All rights reserved.",
};
