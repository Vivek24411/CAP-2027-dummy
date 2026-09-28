import type { TestimonialsContent } from "@/models/testimonial";

// Placeholder content from the Figma file — swap in real testimonials before launch.
const quote =
  "Joining the Campus Ambassador Program was a game-changer for me. Not only did I receive an internship certificate from E-Summit, IIT Roorkee, but the hands-on experience I gained was incredible.";

export const testimonials: TestimonialsContent = {
  heading: { accent: "Toasts", title: "from our family!" },
  items: Array.from({ length: 8 }, (_, i) => ({
    id: `testimonial-${i + 1}`,
    quote,
    name: "Anna Koralina",
    college: "Chandigarh University",
    avatar: "/images/testimonials/placeholder-avatar.png",
  })),
};
