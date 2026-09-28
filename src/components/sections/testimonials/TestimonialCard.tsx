import Image from "next/image";
import { QuoteIcon } from "@/components/icons/QuoteIcon";
import type { Testimonial } from "@/models/testimonial";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="border-line bg-surface rounded-card flex h-full w-[19rem] shrink-0 flex-col border p-6 md:w-[28rem] md:p-8">
      <QuoteIcon className="text-accent h-4 w-auto" />
      <blockquote className="text-body-lg text-secondary mt-5 flex-1">
        {testimonial.quote}
      </blockquote>

      <figcaption className="border-line mt-6 flex items-center gap-3 border-t pt-5">
        <Image
          src={testimonial.avatar}
          alt=""
          width={44}
          height={44}
          className="bg-raised size-11 rounded-full object-cover"
        />
        <div>
          <p className="text-foreground text-[0.9375rem] font-medium">{testimonial.name}</p>
          <p className="text-muted text-sm">{testimonial.college}</p>
        </div>
      </figcaption>
    </figure>
  );
}
