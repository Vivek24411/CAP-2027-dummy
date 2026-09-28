import { Marquee } from "@/components/ui/Marquee";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getTestimonials, splitIntoRows } from "@/controllers/content";
import type { Testimonial } from "@/models/testimonial";
import { TestimonialCard } from "./TestimonialCard";

export async function TestimonialsSection() {
  const { heading, items } = await getTestimonials();
  const [topRow, bottomRow] = splitIntoRows(items, 2);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-section overflow-hidden"
    >
      <SectionHeading id="testimonials-heading" heading={heading} glow className="px-4" />

      <div className="mt-12 flex flex-col gap-4 md:mt-20 md:gap-6">
        {[topRow, bottomRow].map((row, index) => (
          <Marquee
            key={index}
            items={row}
            getKey={(testimonial: Testimonial) => testimonial.id}
            renderItem={(testimonial) => <TestimonialCard testimonial={testimonial} />}
            itemClassName="pr-4 md:pr-6"
            duration={60}
            reverse={index === 1}
            className="[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
          />
        ))}
      </div>
    </section>
  );
}
